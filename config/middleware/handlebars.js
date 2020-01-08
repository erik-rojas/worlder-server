const path = require("path");
const hbs = require('nodemailer-express-handlebars');
const email = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASSWORD;
const nodemailer = require('nodemailer');
const config = require("../../config");
const smtpTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  name: process.env.MAIL_NAME,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: email,
    pass: pass
  }
});


const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: config.PATH_TEMPLATE_MAIL,
    layoutsDir: config.PATH_TEMPLATE_MAIL,
    defaultLayout: 'EmailHolding',
  },
  viewPath: path.resolve("./config/routes/api/templates"),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = {
    smtpTransport
}