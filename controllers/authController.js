const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('user');

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
  req.flash('success', 'Password reset request has been sent');
  // redirect to login page
  res.redirect('/login');
};
