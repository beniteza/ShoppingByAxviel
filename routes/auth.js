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

//Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//---------

module.exports = router;
