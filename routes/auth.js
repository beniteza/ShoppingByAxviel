const express = require('express');
const router = express.Router();
const passport = require('passport');

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
    res.redirect('/dashboard'); //to dashboard if passes
  }
);

//---------
