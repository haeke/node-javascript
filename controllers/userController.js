const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login Form' });
};

exports.registerForm = (reg, res) => {
  res.render('register', { title: 'Register' });
};

//validate form input for name and email password and password confirm
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name'); //from express-validator https://github.com/ctavan/express-validator
  req.checkBody('name', 'Supply a name').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password cannot be empty').notEmpty();
  req.checkBody('password-confirm', 'Confirmed password cannot be empty').notEmpty();
  req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

  //check to see if there are errors
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }

  next(); //no errors found
};
