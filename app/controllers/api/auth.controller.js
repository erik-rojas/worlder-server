const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const _ = require('lodash');
const async = require('async');
const { validatePass, ROLES } = require("../../models/users");
const FB = require('fb');
const fb = new FB.Facebook({
    appId: '1582691115194133',
    appSecret: '93594c368dd9168bfcd533ea42ba4b6e'
});
const User = mongoose.model("User");
const Company = mongoose.model("Companie");
const Jobseeker = mongoose.model("Jobseeker");
const { jwtToken, pareJwtToken } = require("../../utils/func");
const email = process.env.MAIL_USERNAME || 'auth_email_address@gmail.com';
const { companyService } = require('../../services');
const { jobseekerService } = require("../../services");
const { authService } = require("../../services");
const { transporter } = require("../../../config/middleware/nodemailer");
const nunjucks = require('nunjucks')

const checkSocalToken = (req, res) => {
    if (req.user.err) {
        res.status(res.CODE.BAD_REQUEST).json({ success: false, message: req.user.err.message, error: req.user.err });
    } else {
        res.sendData({
            jwt_token: jwtToken(req.user.provider),
            user: req.user.provider
        })
    }
}

const checkFacebookToken = (req, res) => {
    checkSocalToken(req, res);
}

const checkGoogleToken = (req, res) => {
    checkSocalToken(req, res);
}

const checkEmailAvailable = (req, res) => {
    authService.checkEmailAvailable(req.body.email)
        .then(data => {
            res.sendData(data)
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const companyRegister = ({ company_data }) => {
    return new Promise(async (rs, rj) => {
        try {
            const company = new Company(company_data);
            await company.save();
            rs(true);
        } catch (er) {
            rj(er);
        }
    })
};

const seekerRegister = ({ user_data }) => {
    return new Promise(async (rs, rj) => {
        try {
            const user = new User(user_data);
            const jobseeker = new Jobseeker({
                user_id: user._id,
            });
            await user.save();
            await jobseeker.save();
            rs(true);
        } catch (er) {
            rj(er);
        }
    })
};

const getUserToken = (user) => {
    let userInfo = user.toJSON();
    delete userInfo.password;
    return jwtToken(userInfo);
}

const getUserProfile = (res, user) => {
    if (user.role.toLowerCase() == "company") {
        companyService.getCompany("user_id", user._id)
            .then(data => {
                res.sendData({
                    token: getUserToken(data)
                });
            })
            .catch(err => {
                res.sendError(err.message)
            })
    } else if (user.role.toLowerCase() == "seeker") {
        jobseekerService.getJobseeker("user_id", user._id)
            .then(data => {
                res.sendData({
                    token: getUserToken(data)
                });
            })
            .catch(err => {
                res.sendError(err.message)
            })
    } else {
        res.sendData({
            token: getUserToken(user)
        });
    }
}

const getCompanyProfile = (res, company) => {
    res.sendData({
        token: getUserToken(company)
    })
}

const login = (req, res) => {
    let login_type = '';
    let login_type_value = '';
    if (req.body.email) { login_type = 'email'; login_type_value = req.body.email.toLowerCase(); }
    if (req.body.username) { login_type = 'username'; login_type_value = req.body.username.toLowerCase(); }
    let password = req.body.password;
    User.findOne({ [login_type]: login_type_value, role: { "$in": [ROLES[2], ROLES[3]] } }, (err, user) => {
        if (user && user.checkPassword(password)) {
            getUserProfile(res, user);
        } else {
            let ErrMsg = '';
            if (login_type === 'email') ErrMsg = "Email or password incorrect";
            if (login_type === 'username') ErrMsg = "UserName or password incorrect";
            res.sendError(ErrMsg, res.CODE.UNAUTHORIZED);
        }
    })
}

const loginCompany = (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const phone = req.body.phone;
    Company.findOne({
        $and: [
            { email: email },
            { phone: phone }
        ]
    }, (err, company) => {
        if (company && company.checkPassword(password)) {
            console.log('company = ', company)
            getCompanyProfile(res, company);
        } else {
            res.sendError("Login Info Incorrect", res.CODE.UNAUTHORIZED);
        }
    })
}

const loginWithFacebook = async (req, res) => {
    const access_token = req.body.accessToken;
    console.log('access_token = ', access_token)
    let result = await FB.api('me', { fields: ['id', 'name', 'email'], access_token: access_token });
    if (!(result && result.email && result.name)) return false;
    User.findOne({ "email": result.email.toLowerCase(), role: { "$in": [ROLES[2], ROLES[3]] } }, (err, user) => {
        if (user) {
            getUserProfile(res, user);
        } else {
            res.sendError("This account doesn't exist", res.CODE.UNAUTHORIZED);
        }
    })
}

const social_login = (req, res) => {
    let provider_type = req.user.provider.provider_type;
    let email = req.user.provider.email.toLowerCase();
    User.findOne({ "email": email }, (err, user) => {
        if (!user) {
            res.sendError("User does not exist. Please register with this " + provider_type + " account first !", 401);
        } else {
            if (!user.provider.type) {
                return res.sendError("Please login using your email !");
            }
            else if (user.provider.type != provider_type) {
                return res.sendError("Please login using your " + user.provider.type + " account !");
            } else {
                getUserProfile(res, user);
            }
        }
    })
}

const registerWithFacebook = async (req, res) => {
    const access_token = req.body.accessToken;
    let result = await FB.api('me', { fields: ['id', 'name', 'email'], access_token: access_token });
    if (!(result && result.email && result.name)) return false;
    let user_data = {
        email: result.email.toLowerCase(),
        password: null,
        username: result.name,
        fullname: result.name,
        birthday: '',
        role: "seeker"
    }

    const afterRegister = async (err_message, code = res.CODE.BAD_REQUEST, errors = []) => {
        if (!err_message) {
            try {
                User.findOne({ email: result.email.toLowerCase() }, (err, user) => {
                    jobseekerService.getJobseeker("user_id", user._id)
                        .then(data => {
                            res.sendData({
                                token: getUserToken(data)
                            });
                        })
                        .catch(err => {
                            res.sendError(err.message)
                        })
                })
            } catch (err) {
                res.sendError(err.message);
            }
        } else {
            res.sendError(err_message, code, errors);
        }
    }

    seekerRegister({
        user_data,
    }).then(data => {
        afterRegister();
    }).catch(er => {
        afterRegister(er.message);
    })
}

const registerSeeker = async (req, res) => {
    let user_data = {};
    user_data = {
        email: req.body.email.toLowerCase(),
        password: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username,
        fullname: req.body.fullname,
        birthday: req.body.birthday,
        role: "seeker"
    };

    // check provider
    if (req.body.jwt_token && pareJwtToken(req.body.jwt_token)) {
        let jwt_data = pareJwtToken(req.body.jwt_token);

        if (jwt_data.email !== user_data.email) {
            const err_message = `Email is not valid with your ${jwt_data.provider_type.toUpperCase()} access token`;
            res.sendError(err_message, code = res.CODE.BAD_REQUEST, errors = []);
        }

        user_data = {
            ...user_data,
            fullname: jwt_data.first_name + jwt_data.last_name,
            email: jwt_data.email.toLowerCase(),
            avatar: jwt_data.avatar,
            provider: {
                type: jwt_data.provider_type,
                provider_id: jwt_data.provider_id,
                provider_access_token: jwt_data.access_token,
            }
        }
    } else {
        user_data = {
            ...user_data,
        }
    }

    seekerRegister({
        user_data,
    }).then(data => {
        res.sendData("Register successfully");
    }).catch(er => {
        res.sendError(er.message, code = res.CODE.BAD_REQUEST, errors = []);
    })
}

const registerCompany = async (req, res) => {
    let company_data = {}
    company_data = {
        email: req.body.email.toLowerCase(),
        password: bcrypt.hashSync(req.body.password, 10),
        companyname: req.body.companyname,
        fullname: req.body.fullname,
        vatnumber: req.body.vatnumber,
        country: req.body.country,
        city: req.body.city,
        address: req.body.address,
        postalcode: req.body.postalcode,
        phone: req.body.phone
    };

    companyRegister({
        company_data,
    }).then(data => {
        res.sendData("Register successfully");
    }).catch(er => {
        res.sendError(er.message, code = res.CODE.BAD_REQUEST, errors = []);
    })
}

const getProfile = (req, res) => {
    res.sendData({
        ...req.user,
        token: req.token
    });
}

const forgotPassword = (req, res) => {
    async.waterfall(
        [
            function (done) {
                User.findOne({
                    email: req.body.email.toLowerCase()
                }).exec(function (err, user) {
                    if (user) {
                        done(err, user);
                    } else {
                        res.sendError("User Not Found !", res.CODE.UNPROCESSABLE_ENTITY);
                    }
                });
            },
            function (user, done) {
                // create the random code
                crypto.randomBytes(5, function (err, buffer) {
                    const code = buffer.toString("hex").toUpperCase();
                    done(err, user, code);
                });
            },
            function (user, code, done) {
                User.findOneAndUpdate(
                    { _id: user._id },
                    {
                        reset_password_code: code,
                        reset_password_expires: Date.now() + 1800000
                    },
                    { upsert: true, new: true }
                ).exec(function (err, new_user) {
                    done(err, code, new_user);
                });
            },
            function (code, user, done) {
                let template = nunjucks.render(
                    'config/routes/api/templates/forgot-password-email.html',
                    { code: code, name: user.username }
                )
                let mainOptions = {
                    from: email.toLowerCase(),
                    to: user.email.toLowerCase(),
                    subject: 'DanangJobs - Reset Password Email',
                    text: 'You recieved message from ',
                    html: template,
                }
                transporter.sendMail(mainOptions, function (err) {
                    if (!err) {
                        return res.sendData({
                            message: "Please check your mail box to get your password reset CODE !"
                        });
                    } else {
                        console.log("err", err)
                        return done(err);
                    }
                });
            }
        ],
        function (err) {
            return res.status(422).json({ message: err });
        }
    );
};


const resetPassword = (req, res) => {
    if (req.body.email) {
        User.findOne({
            email: req.body.email.toLowerCase(),
            reset_password_code: req.body.reset_password_code,
            reset_password_expires: {
                $gt: Date.now()
            }
        }).exec(function (err, user) {
            if (!err && user) {
                const { error } = validatePass(
                    (data = { password: req.body.new_password })
                );
                if (error) {
                    res.sendError(error.message);
                } else {
                    if (req.body.new_password === req.body.new_password_retype) {
                        user.password = bcrypt.hashSync(req.body.new_password, 10);
                        user.reset_password_token = "";
                        user.save(function (err) {
                            if (err) {
                                return res.status(422).send({
                                    message: err
                                });
                            } else {
                                let template = nunjucks.render(
                                    'config/routes/api/templates/reset-password-email.html',
                                    { name: user.username }
                                )
                                let mainOptions = {
                                    from: email.toLowerCase(),
                                    to: user.email.toLowerCase(),
                                    subject: 'DanangJobs - Reset Password Email',
                                    text: 'You recieved message from ',
                                    html: template,
                                }
                                transporter.sendMail(mainOptions, function (err) {
                                    if (!err) {
                                        return res.sendData({
                                            message: "Reset password successful !"
                                        });
                                    } else {
                                        console.log("err", err)
                                        return done(err);
                                    }
                                });
                            }
                        });
                    } else {
                        return res.status(422).send({
                            message: "Passwords do not match !"
                        });
                    }
                }
            } else {
                return res.status(400).send({
                    message: "Password reset CODE is invalid or has expired !"
                });
            }
        });
    } else {
        res.sendError({ message: "Please input your email" });
    }

};

const changeAvatar = (req, res) => {
    console.log('aaaa')
    console.log('req = ', req)
}

module.exports = {
    login,
    loginCompany,
    loginWithFacebook,
    social_login,
    registerWithFacebook,
    registerSeeker,
    registerCompany,
    checkFacebookToken,
    checkGoogleToken,
    getProfile,
    forgotPassword,
    resetPassword,
    checkEmailAvailable,
    changeAvatar
};
