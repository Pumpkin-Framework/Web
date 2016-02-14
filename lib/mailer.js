var nodemailer = require('nodemailer');

var smtp = nodemailer.createTransport(require("./config.json").mailer);

module.exports = function(to, subject, content, cb){
    smtp.sendMail({
        from: "Pumpkin <no-reply@jk-5.nl>",
        to: to,
        subject: subject,
        text: content
    }, cb);
};
