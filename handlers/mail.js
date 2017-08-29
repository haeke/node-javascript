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

transport.sendMail({
  from: 'Ed ',
  to: 'lol@lol.com',
  subject: 'how does this work',
  html: 'Hey <strong> lol </strong>',
  text: 'Hey lol',
});
