const express = require('express'); //bring in express
const mongoose = require('mongoose'); //bring in mongoose
const bcrypt = require('bcryptjs'); //bring in bcryptjs
const passport = require('passport'); //bring in passport
const router = express.Router(); //bring in the router from express

//Load User Model
require('../models/User');
const User = mongoose.model('users');

require('../models/Item');
const Item = mongoose.model('items');

//------USERS ROUTES: START

//User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//Login Form Post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    //we using the 'local' staregy
    successRedirect: '/' //where it goes after successful login
    //failureRedirect: '/users/login',
    //failureFlash: true //show flash msg if the login fails
  })(req, res, next); //this immediately fires off
});

//Logout User Route
router.get('/logout', (req, res) => {
  req.logout(); //this logs us out
  //req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

//Register Form Post
router.post('/register', (req, res) => {
  //password validation
  let errors = [];

  if (req.body.password != req.body.password2) {
    //password don't match
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    //password too short
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    //there are errors
    res.render('users/register', {
      //re-render the form with all the already entered data
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    //Prevent same email from being used twice
    User.findOne({ email: req.body.email }).then(user => {
      //the user
      if (user) {
        //if there's already an user with this email
        //req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        //do the rest of the process for registring a new user
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });

        //Encrypt password genSalt(numOfChars, callback funct)
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            //pass in the bare text password
            //hash is the hashed password
            if (err) throw err; //there is an error

            newUser.password = hash; //set pasw to the new hashed pasw

            newUser
              .save() //save the user in db
              .then(user => {
                //user = is the new user
                // req.flash(
                //   'success_msg',
                //   'You are now registered and can log in'
                // );
                res.redirect('/users/login');
              })
              .catch(err => {
                //just in case there's any error
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Show Cart
router.get('/cart/:id', (req, res) => {
  let items = [];

  User.findOne({
    _id: req.params.id
  }).then(function getItems(user) {
    cart = user.cart;
    //let items = [];

    function getItems() {
      for (let i = 0; i < cart.length; i++) {
        Item.findOne({
          _id: cart[i].cartItem
        }).then(item => {
          items.unshift(item);
        });
      }
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(items);
        }, 2000);
      });
    }
    //Goota set Timeout to wait until all items are found. Less times means the promise from getItems() is returned without all the items. FIX LATER
    async function f1() {
      items = await getItems();

      res.render('index/cart', {
        //user: user,
        items: items
      });
    }

    f1(); //FIXX
  });
});

//Delete Cart Item
router.delete('/cart/:id', (req, res) => {
  user = req.user;
  cart = user.cart;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].cartItem == req.params.id) {
      cart.splice(i, 1);
      break;
    }
  }
  user.save().then(user => {
    res.redirect(`/cart/${user.id}`);
  });
});

//Add Cart Item
router.post('/cart/:id', (req, res) => {
  User.findOne({
    _id: req.params.id
  }).then(user => {
    const newCartItem = {
      cartItem: req.body.item
    };

    // Add to review array
    user.cart.unshift(newCartItem);
    user.save().then(user => {
      res.redirect(`/cart/${user.id}`);
    });
  });
});

//Add Order
router.post('/order/:id', (req, res) => {
  const orderItems = [];
  // const cartItems = req.body.items;
  user = req.user;
  const cartItems = user.cart;

  for (let i = 0; i < cartItems.length; i++) {
    console.log(cartItems[i].id);
  }

  for (let i = 0; i < cartItems.length; i++) {
    orderItems.unshift(cartItems[i].id);
  }

  const newOrderItems = {
    orderItems: orderItems
  };

  user.orders.unshift(newOrderItems);
  user.cart = [];
  user.save().then(user => {
    res.redirect(`/orders/${user.id}`);
  });
});

//Show Orders
router.get('/orders/:id', (req, res) => {
  const user = req.user;
  const orders = user.orders;

  res.render('index/orders', {
    orders: orders
  });
});

//Edit profile form
router.get('/profile/:id', (req, res) => {
  const user = req.user;
  res.render('users/profile', {
    user: user
  });
});

//Edit Form process
router.put('/profile/:id', (req, res) => {
  console.log('HEEEEEEEEEEE');
  user = req.user;
  const image = req.body.image;
  user.image = image;

  user.save().then(user => {
    res.redirect('/');
  });
});

//------

module.exports = router;
