const notFound = require("./notFound");
const notAuth = require("./notAuth");
const localVariables = require("./localVariables");
const passportAuth = require("./passport");
const modifyResponse = require("./modifyResponse");
const jwtAuth = require('./jwtAuth')
const confirmJWT = require('./confirmJWT')
const uploadMedia = require("./uploadMedia");
const getAvatar = require("./getAvatar");
const hasRole = require("./checkRole");

module.exports = {
    notFound,
    localVariables,
    notAuth,
    passportAuth,
    modifyResponse,
    jwtAuth,
    confirmJWT,
    uploadMedia,
    getAvatar,
    hasRole
}