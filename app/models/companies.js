const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const CompanieSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String },
    fullname: { type: String },
    vatnumber: { type: String },
    companyname: { type: String },
    country: { type: String },
    city: { type: String },
    address: { type: String },
    postalcode: { type: String },
    phone: { type: String },
    lat: { type: Number },
    long: { type: Number },
  },
  {
    timestamps: true
  }
);

const dataMigrate = [];

CompanieSchema.statics.getMigrateData = function () {
  return dataMigrate;
};

CompanieSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

CompanieSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) 
      next(new Error('Email already exists, please try again'));
  else next(error);
});

module.exports = mongoose.model("Companie", CompanieSchema);
