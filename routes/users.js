const express = require('express'); //bring in express
const mongoose = require('mongoose'); //bring in mongoose
const bcrypt = require('bcryptjs'); //bring in bcryptjs
const passport = require('passport'); //bring in passport
const router = express.Router(); //bring in the router from express

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

//Load User Model
require('../models/User');
const User = mongoose.model('users');

require('../models/Item');
const Item = mongoose.model('items');

//------USERS ROUTES: START

//User Register Route
router.get('/register', ensureGuest, (req, res) => {
  res.render('users/register');
});

//Register Form Post
router.post('/register', ensureGuest, (req, res) => {
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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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
        req.flash('error_msg', 'Email already registered');
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
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/auth/login');
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
router.get('/cart', ensureAuthenticated, (req, res) => {
  cart = req.user.cart;
  let cartItems = [];
  for (let i = 0; i < cart.length; i++) {
    cartItems.unshift(cart[i].cartItem._id);
  }

  Item.find({ _id: { $in: cartItems } }).then(items => {
    res.render('index/cart', {
      items: items
    });
  });
});

//Delete Cart Item
router.delete('/cart/:id', ensureAuthenticated, (req, res) => {
  user = req.user;
  cart = user.cart;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].cartItem == req.params.id) {
      cart.splice(i, 1);
      break;
    }
  }
  user.save().then(user => {
    res.redirect('/users/cart');
  });
});

//Add Cart Item
router.post('/cart', ensureAuthenticated, (req, res) => {
  user = req.user;
  const newCartItem = {
    cartItem: req.body.item
  };

  // Add to review array
  user.cart.unshift(newCartItem);
  user.save().then(user => {
    res.redirect('/users/cart');
  });
});

//Add Order
router.post('/orders', ensureAuthenticated, (req, res) => {
  const orderItems = [];
  user = req.user;
  const cartItems = user.cart;

  for (let i = 0; i < cartItems.length; i++) {
    orderItems.unshift(cartItems[i].cartItem);
  }

  const newOrderItems = {
    orderItems: orderItems
  };

  user.orders.unshift(newOrderItems);
  user.cart = [];
  user.save().then(user => {
    res.redirect('/users/orders');
  });
});

//Show Orders
router.get('/orders', ensureAuthenticated, (req, res) => {
  const user = req.user;
  const orders = user.orders;

  let orderItems = [];
  for (let i = 0; i < orders.length; i++) {
    for (let j = 0; j < orders[i].orderItems.length; j++) {
      orderItems.unshift(orders[i].orderItems[j]._id);
    }
  }

  Item.find({ _id: { $in: orderItems } }).then(items => {
    res.render('index/orders', {
      items: items
    });
  });
});

//Edit profile form
router.get('/profile', ensureAuthenticated, (req, res) => {
  const user = req.user;
  res.render('users/profile', {
    user: user
  });
});

//Edit Form process
router.put('/profile', ensureAuthenticated, (req, res) => {
  user = req.user;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.image = req.body.image;

  user.save().then(user => {
    res.redirect('/');
  });
});

router.get('/selling', ensureAuthenticated, (req, res) => {
  //Find all items for sale of the logged in user
  Item.find({ user: req.user.id }).then(items => {
    res.render('index/selling', {
      items: items
    });
  });
});

//------

module.exports = router;
