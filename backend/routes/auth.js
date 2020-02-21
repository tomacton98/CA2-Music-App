const passport = require('passport');
const settings = require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const router = require('express').Router();

let User = require('../models/User');
router.post('/register', (req, res) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
        return res.json({
            success: false,
            message: 'Error: email cant be blank.'
        });
    }
    if (!password) {
        return res.json({
            success: false,
            message: 'Error: Password cant be blank.'
        });
    }
    email == email.toLowerCase().trim();

    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error: Server error'
            });
        } else if (previousUsers.length > 0) {
            return res.json({
                success: false,
                message: "Error: Account already exists"
            });
        }

        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error Server error'
                });
            }
            return res.json({
                success: true,
                message: 'Account created'
            });
        });
    });
});

router.post('/login', function (req, res) {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
        return res.json({
            success: false,
            message: 'Error: email cant be blank.'
        });
    }
    if (!password) {
        return res.json({
            success: false,
            message: 'Errpr: Password cant be blank.'
        });
    }
    email == email.toLowerCase().trim();

    User.findOne({ email }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).json({ sucess: false, message: 'Authentication failed. User not found' });
        } else {
            if (user.validPassword(password)) {
                let token = jwt.sign(user.toJSON(), process.env.API_SECRET);
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        _id: user._id,
                        email: user.email
                    }
                });
            } else {
                res.json({ success: false, message: 'Autnenticaion failed, Wrong password' });
            }
        }
    });

})

module.exports = router;
