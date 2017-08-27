const mongoose = require('mongoose');
const User = mongoose.model('user');
const promisify = require('es6-promisify');

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

//add registered user to the database
exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  //register will pass to the database from passportLocalMongoose
  const register =  promisify(User.register, User); //pass the entire object to find the register method
  await register(user, req.body.password);
  next(); //go to auth controller
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit your account' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' },
  );
  req.flash('success', 'updated the profile');
  res.redirect('back');
};
