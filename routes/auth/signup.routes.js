const router = require('express').Router();
// ℹ️ Handles password encryption
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require('../../models/User.model');

// Require necessary (isLoggedOut) middleware in order to control access to specific routes
const isLoggedOut = require('../../middleware/isLoggedOut');

// GET route ==> to display the signup form to users
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', isLoggedOut, (req, res, next) => {
  console.log('The form data: ', req.body);
  const { username, email, password } = req.body;

  // make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render('auth/signup', {
      errorMessage:
        'All fields are mandatory. Please provide your username, email and password.',
    });
    return;
  }

  // make sure passwords are strong:
  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!regex.test(password)) {
  //   res.status(500).render('auth/signup', {
  //     errorMessage:
  //       'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
  //   });
  //   return;
  // }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
      // Create a user and save it in the database
      return User.create({
        username,
        email,
        password: hashedPassword, // passwordHash => this is the key from the User.model.js
      });
    })
    .then(user => {
      // Bind the user to the session object
      req.session.user = user;
      res.redirect('/user');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage:
            'Username and email need to be unique. Either username or email is already used.',
        });
      } else {
        next(error);
      }
    });
});

module.exports = router;
