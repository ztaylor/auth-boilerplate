const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config');

// setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload is the decoded jwt token
  // done is a callback on successful authentication
  // see if the user id in the payload exists in the db
  // if it does, call done with that user
  // otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) return done(err, false);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

const localOptions = {
  usernameField: 'email',
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify the username and password, call done iwth the user
  // otherwise call done with false
  console.log(`looking for user ${email} with password ${password}`);
  User.findOne(
    {
      email: email,
    },
    function(err, user) {
      console.log('made it');
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      } else {
        // compare password
        console.log('b');
        user.comparePassword(password, function(err, isMatch) {
          console.log('ayy');
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      }
    },
  );
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
