const mongoose = require("mongoose")
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
  const _id = req.user._id;

  let user = await User.findOne({ _id }).exec();

  if(user.avatar){
    req.app.locals.URL_AVATAR = user.avatar;
  } else {

  }
  req.app.locals.URL_AVATAR = user.avatar ? user.avatar : "/images/avt.png";
  req.app.locals.userLocal = {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar || "/images/avt.png"
  }

  next();
}