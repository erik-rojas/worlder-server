const mongoose = require("mongoose");
const { wrap: async } = require("co");

const modelsName = require("../../models");

// utils
const firstUpperCase = str => str[0].toUpperCase() + str.substr(1);
const mixString = (ch) => (str) => str.split(ch).map(firstUpperCase).join("");

const getModels = () => modelsName
    .map(mixString('_'))
    .map(str => str.slice(0, -1))
    .map(modelName => mongoose.model(modelName));

const cleanDB = (db) => db.remove({});
const migrateDB = (db) => db.insertMany(db.getMigrateData ? db.getMigrateData() : []);

const cleanDBs = (DBs) => Promise.all(DBs.map(cleanDB))
const migrateDBs = (DBs) => Promise.all(DBs.map(migrateDB))

const index = (req, res) => {
    cleanDBs(getModels())
    .then(() => {
        return migrateDBs(getModels())
    })
    .then(() => {
        res.end("All DB is migrated");
    })
    .catch((er) => {
        res.end(er.message);
    })
}

module.exports = {
    index
}