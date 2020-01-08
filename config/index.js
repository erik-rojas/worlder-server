const path = require('path');
const __DEV__ = require('./env/development');
const __PRO__ = require('./env/production');
const __STAG__ = require('./env/staging');
const APP_NAME = 'nodejs-ejs-socket-template';

// config session
var SESSION = {
    APP_NAME,
    secret: APP_NAME + 'jki33234!@@',
    jwtSecret: `jwt-sct-${APP_NAME}-!@##@!`,
    cookie: { maxAge: 60000 }
}

// This is defaults config
const defaults = {
    ROOT: path.join(__dirname, ".."),
    PATH_MODELS: path.join(__dirname, "../app/models"),
    PATH_TEMPLATE_MAIL: path.join(__dirname, "../app/views/templates-mail"),
    PATH_ASSETS: path.join(__dirname, "../assets"),
    SESSION,
    ADMIN_URL: "/admin",
}

const config = {
    development: {
        ...defaults,
        ...__DEV__
    },
    production: {
        ...defaults,
        ...__PRO__
    },
    staging: {
        ...defaults,
        ...__STAG__
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];
