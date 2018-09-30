const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Item = mongoose.model('items');
const User = mongoose.model('users');

//------- ROUTES: START

router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/selling', (req, res) => {
  //Find all stories of the logged in user
  Item.find({ user: req.user.id }).then(items => {
    res.render('index/selling', {
      items: items
    });
    console.log(items);
  });
});

router.get('/cart', (req, res) => {
  //Find all stories of the logged in user
  Story.find({ user: req.user.id }).then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  });
});

router.get('/orders', (req, res) => {
  //Find all stories of the logged in user
  Story.find({ user: req.user.id }).then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  });
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

//-------

module.exports = router;
