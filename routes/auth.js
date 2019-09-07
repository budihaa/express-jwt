const router = require('express').Router();

const UsersController = require('../controllers/UsersController');

router.post('/login', UsersController.validate('login'), UsersController.login);
router.post('/register', UsersController.validate('register'), UsersController.register);

module.exports = router;
