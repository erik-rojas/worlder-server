const router = require('express').Router();
const moment = require("moment")
const passport = require("passport");

// controllers
const {
} = require("../../app/controllers/test");

// Middlewares
const {
} = require("../middleware");

// utils
const { jwtToken, pareJwtToken } = require("../../app/utils/func");

router.get("/", (req, res) => {
    res.status(200).json({
        message: "test"
    })
});

router.get("/auth/facebook-token", passport.authenticate('facebook-token', { session: false }), (req, res, next) => {
    if (req.user.err) {
        res.status(400).json({ success: false, message: req.user.err.message, error: req.user.err });
    } else {
        res.status(200).json({
            jwt_token: jwtToken(req.user.facebook),
            user: req.user.facebook
        })
    }
}, (error, req, res, next) => {
    if (error) {
        res.status(400).json({ success: false, message: 'Auth failed', error })
    }
})


router.get("/auth/google-token", passport.authenticate('google-token', { session: false }), (req, res, next) => {
    if (req.user.err) {
        res.status(400).json({ success: false, message: req.user.err.message, error: req.user.err });
    } else {
        res.status(200).json({
            jwt_token: jwtToken(req.user.google),
            user: req.user.google
        })
    }
}, (error, req, res, next) => {
    if (error) {
        res.status(400).json({ success: false, message: 'Auth failed', error })
    }
})

router.post("/auth/login", (req, res) => { })
router.post("/auth/register", (req, res) => { })

module.exports = router;
