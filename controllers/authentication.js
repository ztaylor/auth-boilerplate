const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  // sub mean subject of token
  // iat means issued at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
      error: 'Username and password are required.',
    });
  }

  // see if a user with a given email exists
  User.findOne(
    {
      email: email,
    },
    (err, existingUser) => {
      // if a user does exist, return an error
      if (err) {
        return next(err);
      }
      if (existingUser) {
        // 422 - unprocessable entity
        return res.status(422).send({
          error: 'Email is in use',
        });
      }

      // if a user does not exist, create a user
      const user = new User({
        email,
        password,
      });

      user.save(err => {
        if (err) {
          return next(err);
        }

        res.json({ token: tokenForUser(user) });
      });
    },
  );
};

exports.signin = function(req, res, next) {
  console.log('user:', req.user);
  res.send({
    token: tokenForUser(req.user),
  });
};
