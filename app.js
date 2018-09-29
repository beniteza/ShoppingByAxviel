const express = require('express');
const mongoose = require('mongoose');

//Passport Config
require('./config/passport')(passport);

const app = express();

//Load Keys
const keys = require('./config/keys');

//------- LOAD ROUTES: START

const index = require('./routes/index');
const auth = require('./routes/auth');

//-------

//------- USE ROUTES: START

app.use('/', index);
app.use('/auth', auth);

//-------

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
