const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Item = mongoose.model('items');
const User = mongoose.model('users');

//------- ROUTES: START

router.get('/', (req, res) => {
  res.render('index/home');
});

router.get('/selling', ensureAuthenticated, (req, res) => {
  //Find all items for sale of the logged in user
  Item.find({ user: req.user.id }).then(items => {
    res.render('index/selling', {
      items: items
    });
  });
});

// router.get('/cart', ensureAuthenticated, (req, res) => {
//   //Find all stories of the logged in user
//   Story.find({ user: req.user.id }).then(stories => {
//     res.render('index/dashboard', {
//       stories: stories
//     });
//   });
// });

// router.get('/orders', ensureAuthenticated, (req, res) => {
//   //Find all stories of the logged in user
//   Story.find({ user: req.user.id }).then(stories => {
//     res.render('index/dashboard', {
//       stories: stories
//     });
//   });
// });

router.get('/about', (req, res) => {
  res.render('index/about');
});

//-------

module.exports = router;
