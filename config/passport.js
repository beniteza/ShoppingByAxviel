const GoogleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const bcrypt = require('bcryptjs');

//Load the User model
const User = mongoose.model('users');

module.exports = function(passport) {
  //Define the strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);

        //Create the image (get the link)
        //indexOf('?') cuts off the img size changing query
        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf('?')
        );

        //Object to put inside db
        const newUser = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: image
        };

        //Check for existing user
        User.findOne({
          googleID: profile.id //match google id w profile id that's being submitted
        }).then(user => {
          //check for the user
          if (user) {
            //return user
            done(null, user); //user found
          } else {
            //create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  //Local startegy w/o googleID
  passport.use(
    new localStrategy({ usernameField: 'email' }, (email, password, done) => {
      //check if there's an user with that email
      User.findOne({
        email: email //see if the email passed matches a stored email
      }).then(user => {
        //returns a user
        if (!user) {
          //if there's not a user
          //this takes an error and a user. but no user so false
          return done(null, false, { message: 'No User Found' });
        }

        //if there is a user, check the password
        //password = unencrypted pasw from the form ; user.password = encrypted pasw
        //user is the one that has the email matched
        //the callback takes an error and a boolean var called isMatched
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          //check if pasw matches
          if (isMatch) {
            //true then pasw does match
            return done(null, user); //return the actual user
          } else {
            //pasw no match
            return done(null, false, { message: 'Password Incorrect' });
          }
        });
      });
    })
  );

  //Serialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //Deserialize User
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
