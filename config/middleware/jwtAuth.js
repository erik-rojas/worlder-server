const { pareJwtToken, jwtToken } = require("../../app/utils/func")
const { companyService, jobseekerService } = require('../../app/services');

const getUserToken = (user) => {
    let userInfo = user.toJSON();
    delete userInfo.password;
    return jwtToken(userInfo);
}

module.exports = (req, res, next) => {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Token') {

        let jwtToken = req.headers.authorization.split(' ')[1];
        try {
            let payload = pareJwtToken(jwtToken);
            if (payload) {
                let getProfileAsync = null;
                switch (payload.user_id.role) {
                    case 'company': {
                        getProfileAsync = companyService.getCompany
                        break;
                    }
                    case 'seeker': {
                        getProfileAsync = jobseekerService.getJobseeker;
                        break;
                    }
                    default: return res.sendError("User's role not allowed !", 401);
                }
                getProfileAsync("user_id", payload.user_id._id)
                    .then(data => {
                        if (data.user_id.status.toUpperCase() === 'ACTIVE') {
                            req.user = data.toJSON();
                            req.token = getUserToken(data);
                            return next()
                        } else throw new Error("Access denied !", 401)
                    })
                    .catch(err => {
                        res.sendError(err.message, '401');
                    })
            } else {
                res.sendError('Unauthorized user!', '401');
            }
        } catch (er) {
            res.sendError(er.message, '401');
        }
    } else {
        res.sendError('Login required !', 401);
    }
};