const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

// Load the user model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('users/login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('users/register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
    // Typically new/confirm passwords should be implemented on the front-end
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please complete all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Your password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('./users/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'This email already exists' });
        res.render('./users/register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Success! Your account has been created. Log in!'
                );
                res.redirect('./login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', 
passport.authenticate('local', {
  failureRedirect: './login',
  failureFlash: true
}), (req, res, next) => {
  res.redirect('../dashboard')
  // req.user.password = undefined;
  // res.json(req.user);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have logged out');
  res.redirect('./login');
});

module.exports = router;