const router = require('express').Router();

const isLoggedIn = require('../../middleware/isLoggedIn');

// GET route ==> to display the user profile
router.get('/user', isLoggedIn, (req, res) =>
  res.render('users/user-profile', { userInSession: req.session.currentUser })
);

module.exports = router;
