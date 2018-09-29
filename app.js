const express = require('express');
const mongoose = require('mongoose');

const app = express();

//------- LOAD ROUTES: START

const index = require('./routes/index');

//-------

//------- USE ROUTES: START

app.use('/', index);

//-------

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
