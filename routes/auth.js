const express = require('express');
const router = express.Router();
const passport = require('passport');

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

//---------ROUTES: START

//The scope asks the user to share their profile and email
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//if it fails go back to home page
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/'); //to home if passes
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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    //we using the 'local' staregy
    successRedirect: '/' //where it goes after successful login
    //failureRedirect: '/users/login',
    //failureFlash: true //show flash msg if the login fails
  })(req, res, next); //this immediately fires off
});

//Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

//---------

module.exports = router;
