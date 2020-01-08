'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const jobs = require("./app/cronjobs")
const MONGOOSE_DB_URL = process.env.MONGOOSE_DB_URL;

const socket = require("./app/socket");

const port = process.env.PORT || 3001;
//cross domain
app.use(cors());
// extends layout 
app.engine('ejs', require('express-ejs-extend'));

// Boostrap models
require(config.PATH_MODELS).map(modelName => `${config.PATH_MODELS}/${modelName}`).forEach(require);

// Boostrap routes
require("./config/express")(app);

const listen = () => new Promise((resolve, reject) => {
    http.listen(port, () => {
        console.log(`App is listening on port: ${port}`);
        // jobs().start();
        resolve();
    });
})

const connect = () => new Promise((resolve, reject) => {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(MONGOOSE_DB_URL, { useNewUrlParser: true }, (err) => {
        if (err) {
            console.log('Some problem with the connection ' + err);
        } else {
            console.log('The Mongoose connection is ready');
        }
    })
    const db = mongoose.connection;
    db.on('error', () => reject('Please install and start your mongodb'));
    db.once('open', resolve);
})

const runJobs = () => {
    return new Promise((resolve, reject) => {
        try {
            jobs.map(job => job().start())
            resolve(jobs)
        } catch (err) {
            reject(err)
        }
    })
}

connect()
    .then(() => {
        socket(io);
    })
    .then(listen)
    .then(runJobs)
    .catch(er => {
        console.log(er);
        process.exit(0);
    });