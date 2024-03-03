const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken'); // JWT library
const User = require('../model.js');

// Secret key for JWT
const secretKey = process.env.secretKeyRight;

// Signup route with validation
router.post('/process.env.sp', async function(req, res){
    try {
        let { id, password, email } = req.body;
 
        //Trim the 'id' to remove leading/trailing space
        id = id.trim();
        
       // Validation for 'id'
        if (!/^[a-zA-Z]{8,}$/.test(id)) {
            return res.send({ message: "Invalid 'id' format! It should be at least 8 characters long and contain only letters." });
        }
 
        // Validation for 'password'
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!£@#$%^&*()_+])[a-zA-Z0-9!£@#$%^&*()_+]{8,}$/.test(password)) {
            return res.send( { message: "Invalid 'password' format! It should contain at least one letter, one number, one special character, and be at least 8 characters long." });
        }
 
        // Check if email already exists (example query, adjust as per your setup)
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.send( { message: "Email already exists! Please choose another Email" });
        }
 
        // Create new user (example save, adjust as per your setup)
        const newUser = new User({ id, password, email });
        await newUser.save();
        return res.send({ message: 'success' });
    } catch(err) {
        console.error(err);
        return res.send({ message: 'Internal Server Error' });
    }
 });

router.post('/process.env.ln', async function(req, res){
    if (!req.body.id || !req.body.password) {
        res.send({ message: "Please enter both id and password" });
    } else {
        try {
            const foundUser = await User.findOne({ id: req.body.id, password: req.body.password }).exec();
            if(foundUser){
                const token = jwt.sign({ id: foundUser.id }, secretKey);
                res.cookie('token', token);
                res.send({message: "success"});
            } else {
                res.send({ message: "Invalid credentials!" });
            }
        } catch(err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Error handling middleware which handles any unhandled errors in the application.
app.use((err,req,res,next)=>{
    console.error(err.stack); // Log the error stack trace
    res.status(500).send('Something went wrong');
});

module.exports = router;
