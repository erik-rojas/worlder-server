const router = require("express").Router();

const { utils } = require("../../../app/controllers/api");

router.post("/distance", utils.getDistance);

module.exports = router
