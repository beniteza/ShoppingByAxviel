const express = require('express'); //bring in express
const mongoose = require('mongoose'); //bring in mongoose
const passport = require('passport'); //bring in passport
const router = express.Router(); //bring in the router from express

//Load User Model
require('../models/User');
const User = mongoose.model('users');

//------USERS ROUTES: START

//User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//Login Form Post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    //we using the 'local' staregy
    successRedirect: '/ideas', //where it goes after successful login
    failureRedirect: '/users/login',
    failureFlash: true //show flash msg if the login fails
  })(req, res, next); //this immediately fires off
});

//------
