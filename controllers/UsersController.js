const User = require('../models/User');

exports.register = async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname
    });

    try {
        const registeredUser = await user.save();
        return res.send(registeredUser);
    } catch (error) {
        res.send(error).status(400);
    }
};
