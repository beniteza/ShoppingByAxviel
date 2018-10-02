const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  googleID: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String,
    default: 'https://i.stack.imgur.com/34AD2.jpg'
  },
  password: {
    type: String
  },
  cart: [
    {
      cartItem: {
        type: Schema.Types.ObjectId,
        ref: 'items'
      }
    }
  ],
  orders: [
    {
      orderItems: [
        {
          type: Schema.Types.ObjectId,
          ref: 'items'
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now //automatically puts the current time
  }
});

//Create collection & add Schema
mongoose.model('users', UserSchema); //users= name of collection. Goes in mongoose.model('*')
