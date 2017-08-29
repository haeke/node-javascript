const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

//transport for generating emails
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// send to email address
exports.send = async (options) => {
  const mailOptions = {
    from: `Testemail <noreply@whoknows.com>`,
    to: options.user.email,
    subject: options.subject,
    html: 'to be done later',
    text: 'to be done later',
  };

  //create a promise from a callback
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
