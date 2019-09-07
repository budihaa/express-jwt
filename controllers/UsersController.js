const User = require('../models/User');

const { check, validationResult } = require('express-validator');

exports.validate = method => {
    switch (method) {
        case 'login': {
            return [
                check('email')
                    .not()
                    .isEmpty()
                    .isEmail()
                    .trim(),
                check('password')
                    .not()
                    .isEmpty()
            ];
        }

        case 'register': {
            return [
                check('email')
                    .not()
                    .isEmpty()
                    .isEmail()
                    .withMessage('Your e-mail is not valid')
                    .custom(email => {
                        return User.findOne({ email }).then(user => {
                            if (user) {
                                return Promise.reject('E-mail already in use');
                            }
                        });
                    })
                    .normalizeEmail()
                    .trim(),
                check('password')
                    .not()
                    .isEmpty()
                    .isLength({ min: 6 })
                    .withMessage('Your password must be at least 6 characters'),
                check('conf_password')
                    .not()
                    .isEmpty()
                    .custom((value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error('Password confirmation does not match password');
                        }

                        // Indicates the success of this synchronous custom validator
                        return true;
                    }),
                check('fullname')
                    .not()
                    .isEmpty()
                    .isLength({ min: 4 })
                    .withMessage('Your fullname must be at least 4 characters')
                    .trim()
                    .escape()
            ];
        }
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        // Check if user exist
        const validUser = await User.findOne({ email: req.body.email });
        if (!validUser) {
            return res.status(401).json({ message: 'Your e-mail or password is invalid' });
        }

        // Check password
        const validPassword = await validUser.comparePassword(req.body.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Your password is invalid' });
        }
        
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.register = async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname
        });

        return res.status(204).json({ status: 'sucess', user });
    } catch (error) {
        res.status(500).json(error);
    }
};
