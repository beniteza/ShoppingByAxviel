const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//------- ROUTES: START

router.get('/', (req, res) => {
  res.send('ROOT');
});

//-------

module.exports = router;
