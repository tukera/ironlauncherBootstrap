const router = require('express').Router();

const isLoggedIn = require('../../middleware/isLoggedIn');

router.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
