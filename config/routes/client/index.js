const router = require('express').Router();
const { 
} = require('../../middleware');

const {
} = require("../../../app/controllers").clientCtrls;

router.get("*", (req, res) => {
    res.render("index");
});

module.exports = router;