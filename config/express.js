const express = require('express');
const session = require('express-session');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const config = require("./index");
const json2xls = require('json2xls');
const passport = require('passport');

// Routes
const {
    testRoute,
    adminRoute,
    clientRoute,
    apiRoute
} = require("./routes");

// Middlewares
const {
    notFound,
    localVariables,
    passportAuth,
    modifyResponse
} = require("./middleware");


module.exports = (app, io) => {
    app.set('views', config.ROOT + '/app/views');
    app.set("view engine", "ejs");

    // Config for session
    app.set('trust proxy', 1) // trust first proxy
    app.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    app.use(session());
    app.use(express.static(config.ROOT + '/assets'));

    // constants Avatar
    app.locals.URL_AVATAR_DEFAULT = "/images/avt.png";

    // config for body paser
    app.use(bodyParser.json({ limit: '10mb', extended: true }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

    // modify response
    app.use(modifyResponse);

    // config for passport
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(passportAuth.authFacebookToken);
    passport.use(passportAuth.authGoogleToken);

    app.use(localVariables);

    if (config.IS_OPEN_TEST) {
        app.use(json2xls.middleware);
        app.use("/test", testRoute)
    }

    app.use(config.ADMIN_URL, adminRoute);
    app.use("/api", apiRoute);
    app.use("/", clientRoute);

    app.use(notFound);
}
