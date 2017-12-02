var nodemailer = require('nodemailer');
var config = require('../config');

module.exports = (to, subject, text, html, callback) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 25,
        secure: false, // true for 465, false for other ports
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: config.fromEmail, // sender address
        to, subject, text, html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(false, info);
    });
}

