const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

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

  //Serialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //Deserialize User
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
