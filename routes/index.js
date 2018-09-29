const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//------- ROUTES: START

router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', (req, res) => {
  //Find all stories of the logged in user
  Story.find({ user: req.user.id }).then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  });
});

//-------

module.exports = router;
