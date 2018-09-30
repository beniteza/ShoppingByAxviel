const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
  itemName: {
    type: String,
    require: true
  },
  itemPrice: {
    type: String,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  },
  itemImage: {
    type: String,
    required: true
  },
  reviews: [
    {
      reviewBody: {
        type: String,
        required: true
      },
      reviewDate: {
        type: Date,
        default: Date.now
      },
      reviewUser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//Create collection & add Schema
mongoose.model('items', ItemSchema, 'items'); //third param 'stories' specifies the name of the collection
