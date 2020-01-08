'use strict';

require('dotenv').config();


const mongoose = require("mongoose");
const config = require('./config');

const modelsName = require("./app/models");
const MONGOOSE_DB_URL = process.env.MONGOOSE_DB_URL;

// Boostrap models
require(config.PATH_MODELS).map(modelName => `${config.PATH_MODELS}/${modelName}`).forEach(require);

// utils
const firstUpperCase = str => str[0].toUpperCase() + str.substr(1);
const mixString = (ch) => (str) => str.split(ch).map(firstUpperCase).join("");

const getModels = () => modelsName
    .map(mixString('_'))
    .map(str => str.slice(0, -1))
    .map(modelName => mongoose.model(modelName));

const cleanDB = (db) => new Promise((rs, rj) => db.deleteMany({}).then(_ => db.collection.drop().then(rs).catch(rs)));
const migrateDB = (db) => db.insertMany(db.getMigrateData ? db.getMigrateData() : []);

const cleanDBs = (DBs) => Promise.all(DBs.map(cleanDB))
const migrateDBs = (DBs) => Promise.all(DBs.map(migrateDB))


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

connect().then(() => {
    cleanDBs(getModels())
        .then(() => {
            return migrateDBs(getModels())
        })
        .then(() => {
            console.log("All DB is migrated");
            process.exit(0);
        })
        .catch((er) => {
            console.log(er.message || "ERROR when migrate");
            process.exit(0);
        })
})