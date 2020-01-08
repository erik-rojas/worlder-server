const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ 
    service: process.env.MAIL_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    port: process.env.MAIL_PORT,
    host: process.env.MAIL_HOST,
    secure: false,
});

module.exports = {
    transporter
}