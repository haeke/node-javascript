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

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/password-reset.pug`, options);
  const inlined = juice(html); //automatically inline css
  return inlined;
};

// send to email address
exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Testemail <noreply@whoknows.com>`,
    to: options.user.email,
    subject: options.subject,
    html: html,
    text: text,
  };

  //create a promise from a callback
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
