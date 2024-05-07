const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const JWT_SECRET = "vaibhav";

// Store OTP and corresponding email address
const otpCache = {};

// Generate OTP
function generateOtp() {
    return randomstring.generate({ length: 4, charset: 'numeric' });
}

// Send OTP via email
function sendOtp(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dev.vaibhavsoni@gmail.com', // Your Gmail email address
            pass: 'tsov pvnj iavv aziu' // Your Gmail password or app password if 2-Step Verification is enabled
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'dev.vaibhavsoni@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for Verification is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('OTP email sent successfully:', info.response);
        }
    });
}

// Function to delete user from the database
async function deleteUserByEmail(email) {
    try {
        // Find the user by email and delete it from the database
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) {
            // If user with the given email doesn't exist, return an error
            throw new Error('User not found');
        }
        return deletedUser;
    } catch (error) {
        // Handle any errors
        console.error('Error deleting user:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to create a new user
async function createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Check whether a user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, error: "The user with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const scPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: scPass,
            email: req.body.email,
        });
        const data = {
            user: {
                id: user.id
            }
        };

        const { email } = req.body;
        const otp = generateOtp();
        otpCache[email] = otp; // Store OTP in cache

        // Send OTP via mail
        sendOtp(email, otp);

        const authtoken = jwt.sign(data, JWT_SECRET);
      
        res.status(200).json({ success: true, token: authtoken, message: "email sent successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
}

// Function to verify OTP
let OtpCheck;
const otpAttempts=[];
async function verifyOtp(req, res) {
    OtpCheck={ check: "false" };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    // Initialize OTP attempts counter if not already present
    if (!otpAttempts[email]) {
        otpAttempts[email] = 1;
    } else {
        otpAttempts[email]++;
    }

    //check if email exists in the cache
    if (!otpCache.hasOwnProperty(email)) {
        return res.status(400).json({ msg: "email not found" })
    }

    if (otpCache[email] === otp) {
        // success=true;
        delete otpCache[email];
        //reset attempts
        delete otpAttempts[email];
        return res.status(200).json({ msg: "otp verifies successfully" })
    }
    else {
        if (otpAttempts[email] >= 3 ) {
            // Clear user information (simulate deleting user from database)
            try {
                // Call the deleteUserByEmail function with the user's email
                const deletedUser = await deleteUserByEmail(email);
                console.log('User deleted:', deletedUser);
                // Respond with success message or perform any additional actions
                res.status(200).json({ success: true, message: 'User deleted successfully plz signup again' });
            } catch (error) {
                // Handle errors
                console.error('Error deleting user:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
            delete otpCache[email];
            // Reset OTP attempts counter
            delete otpAttempts[email];
            // Respond with error message
            return res.status(400).json({ success: false, message: 'Invalid OTP. Maximum attempts exceeded. User information deleted.' });
        }
        return res.status(400).json({ msg: "wrong otp" })
    }
}

// Function to login user
async function loginUser(req, res) {
    // console.log(OtpCheck.check)
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if(verifyOtp.success===false)
        {
            return res.status(400).json({msg:"plz verify otp"})
        }
        else
        {
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        
        return res.status(200).json({ message: 'Login successful' });
    }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { createUser, verifyOtp, loginUser };
