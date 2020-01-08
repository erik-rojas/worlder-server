const router = require("express").Router();
const {  confirmJWT, getAvatar } = require("../../middleware");
const authCtrl = require("../../../app/controllers/admin/auth");

const profile = require("./profile");
const users = require("./users");

// Controllers
const  {
} = require("../../../app/controllers/admin");

// Middleware
const {
} = require("../../../config/middleware");

// login
router.get("/login", authCtrl.viewLoginPage);
router.post("/login", authCtrl.login);

// confirm session
router.use(confirmJWT);
router.use(getAvatar);
// router.use(jwtAuth);

// dashboard
router.get("/", (req, res) => {
    res.render("admin/dashboard/index", {
        titlePage: "Dashboard"
    })
});

// profile
router.use(profile);

// user
router.use(users);

module.exports = router;