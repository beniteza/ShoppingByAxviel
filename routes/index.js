const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Item = mongoose.model('items');
const User = mongoose.model('users');

//------- ROUTES: START

router.get('/', (req, res) => {
  res.redirect('/items');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

//-------

module.exports = router;
