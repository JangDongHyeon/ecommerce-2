const User = require('../models/User');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const {
    errorHandler
} = require('../helpers/dbErrorHandler');
const brcypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

exports.signup = async (req, res) => {
    try {
        const user = new User(req.body);
        const salt = await brcypt.genSalt(10);

        user.password = await brcypt.hash(user.password, salt);

        await user.save();
        user.password = undefined;
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            msg: errorHandler(err)
        });
    }
};

exports.signin = async (req, res) => {
    try {
        //find the user based on email
        const {
            email,
            password
        } = req.body;
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                msg: 'User with that email does not exist. Please Signup'
            });
        }

        const isMatch = await brcypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({
                msg: 'Email and Password dont match'
            });
        }
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET);
        res.cookie('t', token, {
            expire: new Date() + 9999
        });
        const {
            _id,
            name,
            role
        } = user;
        return res.json({
            token,
            user: {
                _id,
                email,
                name,
                role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            msg: errorHandler(err)
        });
    }
};

exports.signout = (req, res) => {
    try {
        res.clearCookie('t');
        res.json({
            msg: 'Signout success'
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        })
    }
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    try {
        let user = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
        if (!user) {
            return res.status(403).json({
                msg: 'Access denid'
            });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.profile.role === 0)
            return res.status(403).json({
                msg: 'Admin resourse! Access denied'
            })
        next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        })
    }
}