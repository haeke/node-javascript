const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/',
  successFlash: 'You are logged in',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
};

//middleware used to check to see if a user is logged in
exports.isLoggedIn = (req, res, next) => {
  //check if isAuth
  if (req.isAuthenticated()) {
    next(); //users logged in go
    return;
  }

  req.flash('error', 'You need to be logged in first');
  res.redirect('/login');
};

exports.forgot = async (req, res) => {
  // check if the user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'Password reset sent');
    return res.redirect('/login');
  }
  // set reset tokens and expiry on acccount
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; //one hour from now
  await user.save();
  // send an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  //send the email
  await mail.send({
    user: user,
    subject: 'Password reset',
    resetURL: resetURL,

  })
  req.flash('success', `Password reset request has been sent `);
  // redirect to login page
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  //a user exists - show the reset password form
  res.render('reset', { title: 'Reset your password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next(); //keep going
    return;
  }

  req.flash('error', 'Password mismatch - in confirmedPasswords');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.flash('error', 'Password reset is invalid or has expired in update');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);

  //remove the users pasword token and expiry
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updated = await user.save();

  await req.login(updated);
  req.flash('success', 'Password reset');
  res.redirect('/');
};
