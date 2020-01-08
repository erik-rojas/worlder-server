const config = require("../index");
const {CODE} = require("../../app/utils/constants")
module.exports = (req, res, next) => {
    res.locals.session = {
        userAuth: req.session.userAuth || false,
        myData: {
            name: "jinsphan"
        }
    };

    var _render = res.render;

    res.render = function (view, options, fn) {
        _render.call(this, view, {
            ...options,
            ADMIN_URL: config.ADMIN_URL,
            GAME_FEES: config.GAME_FEES,

        }, fn);
    }

    res.CODE = CODE
    res.CONFIG = config

    req.host_url = `${req.protocol}://${req.headers.host}`;
    
    next();
}