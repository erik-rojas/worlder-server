const router = require("express").Router();

const authRoute = require("./auth");
const userRoute = require("./users");
const companyRoute = require("./company");
const utils = require("./utils");

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/company", companyRoute);
router.use("/utils", utils);

module.exports = router;
