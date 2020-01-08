const mongoose = require("mongoose");
const User = mongoose.model("User");
const Seeker = mongoose.model("Jobseeker");
const Company = mongoose.model("Companie");
const bcrypt = require("bcryptjs");
const moment = require("moment");


mongoose.Promise = global.Promise;



getListUsers = async (req, res) => {
  // try {
  let user = await User.find()
    .sort("-updatedAt")
    .exec();

  return res.render("admin/users/index", {
    titlePage: "Users",
    users: user,
    moment: moment
  });
};

viewCreatePage = (req, res) => {
  return res.render("admin/users/create", {
    titlePage: "User Create"
  });
};

createSeeker = async (req, res) => {
  const {
    name,
    email,
    password,
    birthday,
    phone,
    address,
    skill,
    education,
    experience
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    birthday,
    role: "seeker",
    phone,
    address,
  });

  // console.log("seeker", user)
  try {
    await user.save();
    console.log(user)
    const seeker = new Seeker({
      birthday,
      phone,
      address,
      skill,
      education,
      experience,
      user_id: user._id
    });
    await seeker.save();
    return res.redirect("/admin/users");
  } catch (error) {
    console.log(err.message)
  }
  
};


createCompany = async (req, res) => {
  const {
    name,
    email,
    password,
    address,
    phone,
    description
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "company",
    phone,
    address,
    description
  });
  // console.log("company", user)
  // await user.save();

  // return res.redirect("/admin/users");
  try {
    await user.save();
    // console.log(user)
    const company = new Company({
      // birthday,
      // phone,
      // address,
      // skill,
      // education,
      // experience,
      user_id: user._id
    });
    await company.save();
    return res.redirect("/admin/users");
  } catch (error) {
    console.log(err.message)
  }
};

// detail user
viewDetailUser = async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id).exec();
  // role COMPANY

  let _data = {
    titlePage: "Detail",
    moment: moment,
    user,
    // company,
  };
  return res.render("admin/users/detail", _data);
};

// delete user
deleteUser = async (req, res) => {
  const { id } = req.params;
  let user = await User.deleteOne({ _id: id }).exec();

  return res.redirect("/admin/users");
};

// delete multi reocords
deleteUserRecords = async (req, res) => {
  try {
    let data = req.body;
    let list_del = data._arr;
    list_del.map(async val => {
      const user = await User.deleteOne(
        { _id: val },
        (err, result) => {
          if (err) return res.status(400).json({ status: "error" });
          console.log(result);
        }
      ).exec();
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

// update user
updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let _data = req.body;


    let user = await User.findOneAndUpdate(
      { _id: id },
      { $set: _data.user },
      (err, response) => {
        if (err) throw err;
        console.log(response);
      }
    ).exec();


    return res
      .status(200)
      .json({ status: "success", msg: "Updated successfully!" });
  } catch (err) {
    return res.status(400).json({ status: "error" });
  }
};

module.exports = {
  getListUsers,
  createSeeker,
  createCompany,
  viewCreatePage,
  viewDetailUser,
  deleteUser,
  updateUser,
  // changeAvatar,
  deleteUserRecords
};
