const router = require('express').Router();

router.use('/', require('./login.routes.js'));
router.use('/', require('./signup.routes.js'));
router.use('/', require('./user.routes.js'));
router.use('/', require('./logout.routes.js'));

module.exports = router;
