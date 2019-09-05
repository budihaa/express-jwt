const router = require('express').Router();

const UsersController = require('./../controllers/UsersController');

router.post('/register', UsersController.register);

module.exports = router;