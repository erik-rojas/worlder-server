const mongoose = require("mongoose");
const User = mongoose.model("User");

const { pareJwtToken } = require("../../app/utils/func")

module.exports = async (req, res, next) => {
  const token = req.session.token;

  if (token) {
    let decodedToken;
    try {
      decodedToken = pareJwtToken(token);
      await User.findById(decodedToken._id).then(doc => {
        if (!doc) return new Promise.reject({ message: "User not found" });
        req.user = doc.toJSON();
        next();
      })
    } catch (err) {
      return res.redirect("/admin/login");
    }
  } else {
    return res.redirect("/admin/login");
  }
};