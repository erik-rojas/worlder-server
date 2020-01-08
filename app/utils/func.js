const jwt = require("jsonwebtoken");
const config = require("../../config");
const moment = require("moment")

const jwtToken = (data = {}) => {
    return jwt.sign(data, config.SESSION.jwtSecret, { expiresIn: 86400 });
}

const pareJwtToken = (token) => {
    return jwt.verify(token, config.SESSION.jwtSecret)
}

const randInt = (start, stop) => {
    return Math.floor(Math.random() * (stop - start + 1) + start);
}

const randFloat = (start, stop, fixed = 2) => {
    return parseFloat((Math.random() * (stop - start + 1) + start).toFixed(fixed));
}

const toJsonObject = (data = [], key) => {
    if (key) {
        return data.reduce((cur, next) => {
            let tmp = {};
            try {
                if (eval('next.' + key)) {
                    tmp = { ...cur, [eval('next.' + key)]: next };
                } else {
                    tmp = cur;
                }
            } catch (er) {
                tmp = { ...cur };
            }
            return tmp;
        }, {});
    }
    return data;
}

const formatVnd = (money) => {
    return money ? money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : "0VND"
}

const vndToUsd = (money) => +money / 23255.814

const getDataObject = (data, keys = "", cb = () => { }) => {
    // console.log(data, keys);
    // let res = keys.split(".").reduce((acc, cur) => {
    //     if (cur !== null && acc[cur]) return acc[cur];
    //     else return null; 
    // }, data || {});
    // if (res) cb(res);
    // return res;

    let res = null;
    try {
        res = eval("data." + keys);
    } catch (er) {
    }
    cb(res);
    return res;
}

isInt = function (nVal) {
    return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
};

module.exports = {
    jwtToken,
    randInt,
    randFloat,
    pareJwtToken,
    toJsonObject,
    formatVnd,
    vndToUsd,
    getDataObject,
    isInt
}