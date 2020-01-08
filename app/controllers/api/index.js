const authCtrl = require("./auth.controller");
const userCtrl = require("./users.controller");
const companyCtrl = require("./company.controller");
const jobseekerCtrl = require("./jobseekers.controller");
const utils = require("./utils");

module.exports = {
    authCtrl,
    userCtrl,
    companyCtrl,
    jobseekerCtrl,
    utils
}