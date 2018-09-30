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

//-------

module.exports = router;
