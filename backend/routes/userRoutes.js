const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { createUser, verifyOtp, loginUser } = require('../Controllers.js/userController');

// Route to create a user using POST
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be at least 3 characters').isLength({ min: 3 }),
], createUser);

// Route to verify OTP
router.post('/verifyotp', [
    body('email', 'Enter a valid email').trim().isEmail(),
    // body('otp', 'Enter a valid OTP').trim().isLength({ min: 4, max: 4 }).isNumeric(),
], verifyOtp);

// Route to login user
router.post('/loginuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be at least 3 characters').isLength({ min: 3 }),
], loginUser);

module.exports = router;
