'use strict';
require('dotenv').config();


// const config = require('./config');
const moment = require("moment");

const shell = require('shelljs');

const bk = async () => {
    try {
        let time = moment().format("YYYY-MM-DD-HH:mm");
        let filename = process.env.MONGOOSE_DB_NAME + "_" + time;
        await shell.exec('./backup-db.sh ' + process.env.MONGOOSE_DB_NAME + ' ' + time + ' ' + filename);
    } catch (er) {
        console.log(er.message);
    }
}

bk();
