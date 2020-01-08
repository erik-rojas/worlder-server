const mongoose = require("mongoose");
const User = mongoose.model("User");
const moment = require("moment");
const bcrypt = require("bcryptjs");

viewProfile = async (req, res) => {
  try {
    const _id = req.user._id;

    let user = await User.findById(_id).exec();
    if (!user) throw new Error("User not found!");

    let _data = {
      titlePage: "Profile",
      user,
      moment,
      notification: {}
    };
    return res.render("admin/profile/index", _data);
  } catch (err) {
    return res.redirect("/admin/login");
  }
};

upadteProfile = async (req, res) => {
  try {
    const _id = req.user._id;
    const _data = req.body;

    if (_data.password == "") {
      delete _data.password;
      delete _data.re_password;
    } else {
      // const hashedPassword = passwordHash.generate(_data.password);
      _data.password = bcrypt.hashSync(_data.password, 10);
      delete _data.re_password;
    }


    let user = await User.findOneAndUpdate(
      { _id },
      { $set: _data },
      (err, response) => {
        console.log(response);
        if (err) throw err;
      }
    ).exec();

    let result = {
      titlePage: "Profile",
      user,
      moment,
      notification: {
        status: "success",
        action: "update-info",
        msg: "Updated Profile successfully!"
      }
    };

    return res.render("admin/profile/index", result);
  } catch (err) {
    let result = {
      titlePage: "Profile",
      moment,
      notification: {
        status: "error",
        action: "update-info",
        msg: "Updated Profile error!"
      }
    };

    return res.render("admin/profile/index", result);
  }
};

// change avatar
changeAvatar = async (req, res) => {
  try {
    const _id = req.user._id;
    const _file = req.file;
    const avatar = `/uploads/${_file.filename}`;
    let user = await User.findOneAndUpdate(
      { _id },
      { $set: { avatar } },
      (err, response) => {
        console.log(response);
        if (err) throw err;
      }
    );

    let result = {
      titlePage: "Profile",
      user,
      moment,
      notification: {
        status: "success",
        action: "change-avatar",
        msg: "Updated Avatar successfully!"
      }
    };

    (await user.avatar) && (req.session.URL_AVATAR = user.avatar);
    (await user.avatar) && (req.app.locals.URL_AVATAR = user.avatar);

    return res.render("admin/profile/index", result);

    // return res.redirect("/admin/profile");
  } catch (err) {
    let result = {
      titlePage: "Profile",
      moment,
      notification: {
        status: "error",
        action: "change-avatar",
        msg: "Updated Avatar successfully!"
      }
    };

    return res.render("admin/profile/index", result);
  }
};

// logout account
logoutAccount = (req, res) => {
  req.session.token = null;

  return res.redirect("/admin/login");
};

module.exports = {
  viewProfile,
  upadteProfile,
  changeAvatar,
  logoutAccount
};
