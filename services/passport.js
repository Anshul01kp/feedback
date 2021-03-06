const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {

    User.findOne({ googleID: profile.id}).then((existingUser) => {
        if(existingUser){
          //User already registered
          done(null, 'existingUser');
        }else {
          //User doesn't exist, creating new User
          new User({ googleID: profile.id}).save().then( user => done(null, 'user'));
        }
      })
  })
);
