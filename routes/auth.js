const express = require('express');
const router = express.Router();
const passport = require('passport');

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

//---------ROUTES: START

router.get(
  '/google',
  ensureGuest,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Successful authentication.
    res.redirect('/');
  }
);

//Verifies if user is authenticated and logged in
router.get('/verify', (req, res) => {
  if (req.user) {
    //we're authenticated and have access to req.user
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

//Local Login Route
router.get('/login', ensureGuest, (req, res) => {
  res.render('auth/login');
});

//Local Login Form Post
router.post('/login', ensureGuest, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true //show flash msg if the login fails
  })(req, res, next);
});

//Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});

//---------

module.exports = router;
