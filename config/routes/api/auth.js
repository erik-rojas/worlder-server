const router = require('express').Router();

const {
    uploadMedia
} = require('../../middleware');
const {
    authCtrl
} = require("../../../app/controllers").apiCtrl;

router.post("/login", authCtrl.login);
router.post("/login/company", authCtrl.loginCompany);
router.post("/loginWithFacebook", authCtrl.loginWithFacebook);

router.get("/profile", authCtrl.getProfile);
router.post("/uploadavatar", authCtrl.changeAvatar);

router.post("/register/facebook", authCtrl.registerWithFacebook);
router.post("/register/company", authCtrl.registerCompany);
router.post("/register/seeker", authCtrl.registerSeeker);

router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/reset-password", authCtrl.resetPassword);
router.post("/check-email", authCtrl.checkEmailAvailable);
module.exports = router;