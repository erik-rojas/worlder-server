const router = require("express").Router();
const profile = require("../../../app/controllers/admin/profile");
// multer
const multer = require("multer");
const upload = multer({ dest: "assets/uploads/" });


router.get("/logout", profile.logoutAccount);
router.get("/profile", profile.viewProfile);
router.post("/profile", profile.upadteProfile);
router.post("/change-avatar", upload.single("avatar"), profile.changeAvatar);

module.exports = router;