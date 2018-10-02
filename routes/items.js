const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Item = mongoose.model('items');
const User = mongoose.model('users');

//------- ROUTES: START

//Items index
router.get('/', (req, res) => {
  //All items
  Item.find()
    .populate('user')
    .sort({ date: 'desc' })
    .then(items => {
      res.render('items/index', {
        //pass in the items
        items: items
      });
    });
});

// Show Single Item
router.get('/show/:id', (req, res) => {
  Item.findOne({
    _id: req.params.id
  })
    .populate('user')
    .populate('reviews.reviewUser')
    .then(item => {
      res.render('items/show', {
        item: item
      });
    });
});

//List Items for Sale From a User
router.get('/user/:userId', (req, res) => {
  Item.find({ user: req.params.userId })
    .populate('user')
    .then(items => {
      //Use the index view and just pass the user's items
      res.render('items/index', {
        items: items
      });
    });
});

//Add item from
router.get('/add', (req, res) => {
  res.render('items/add');
});

//Process Add Item
router.post('/', (req, res) => {
  //Build up item object
  const newItem = {
    itemName: req.body.itemName,
    itemPrice: req.body.itemPrice,
    itemDescription: req.body.itemDescription,
    itemImage: req.body.itemImage,
    user: req.user.id
  };
  //Create Item
  new Item(newItem).save().then(item => {
    res.redirect(`/item/show/${item.id}`);
  });
});

//Edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Item.findOne({
    _id: req.params.id //id in the url
  }).then(item => {
    if (item.user != req.user.id) {
      //Prevent another user from editing my story
      res.redirect('/items');
    } else {
      res.render('items/edit', {
        item: item
      });
    }
  });
});

//Edit Form process
router.put('/:id', (req, res) => {
  Item.findOne({
    _id: req.params.id //id in the url
  }).then(item => {
    //New Values
    item.itemName = req.body.itemName;
    item.itemPrice = req.body.itemPrice;
    item.itemDescription = req.body.itemDescription;
    item.itemImage = req.body.itemImage;

    item.save().then(item => {
      res.redirect('/selling');
    });
  });
});

//Delete Item
router.delete('/:id', (req, res) => {
  Item.remove({ _id: req.params.id }).then(() => {
    res.redirect('/dashboard');
  });
});

//Add Review
router.post('/review/:id', (req, res) => {
  Item.findOne({
    _id: req.params.id
  }).then(item => {
    const newReview = {
      reviewBody: req.body.reviewBody,
      reviewUser: req.user.id
    };

    // Add to review array
    item.reviews.unshift(newReview);
    item.save().then(item => {
      res.redirect(`/items/show/${item.id}`);
    });
  });
});

//-------

module.exports = router;
