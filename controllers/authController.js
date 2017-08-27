const passport = require('passport');

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
