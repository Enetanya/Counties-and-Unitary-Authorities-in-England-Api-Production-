const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../model.js');
const RandomNumber = require('../model2.js');
const randomize = require('randomatic'); // npm package for generating random numbers



// Handle POST request to submit email confirmation
router.post('/submit-email', async (req, res) => { 
    // Extract email from request body
    const { email } = req.body;
    
    // Check if the email exists in the database
    const user = await User.findOne({ email }); 
    if (!user) { 
        // If email not found, return error response
        return res.send('Email not found in our records'); 
    }
    
    // Generate a random 6-digit number
    const randomNumber = randomize('0', 6);
    
    // Create a new RandomNumber instance with the generated number
    const newRandomNumber = new RandomNumber({ number: randomNumber, email});
    try {   
        // Save the random number to the database   
        await newRandomNumber.save();
        
        // Construct HTML message for successful email confirmation
        const htmlMessage = `<html><body><h1>Success!</h1><p>Thank you for confirming your email address.</p><p>Copy your reference number: <strong>${randomNumber}</strong>.</p><p>Please include it in the relevant section.</p><p>You can now return to the Api Frontend React App main window.</p></body></html>`;
        
        // Create a nodemailer transporter 
        const transporter = nodemailer.createTransport({ 
            service: 'Gmail', // Use your email service 
            auth: { 
                user: 'businessenets@gmail.com', // My email 
                pass: 'tyei ibsr csvy jocq' // My password or app password 
            }, 
        });
        
        // Define mail options for sending confirmation email
        const mailOptions = { 
            from: 'businessenets@gmail.com', 
            to: email, 
            subject: 'Confirmation Email', 
            html: htmlMessage
        };

        // Send the email 
        transporter.sendMail(mailOptions, function(error, info) {  
            if (error) { 
                // If sending email fails, send error response
                res.send({ error: 'Failed to send email' }); 
            } else { 
                // If email sent successfully, send success response
                res.send({ message: 'success' }); 
            } 
        });
    } catch (err) {    
        // If an error occurs during database operation, send internal server error response
        res.status(500).json({ message: 'Error generating and saving random number' });  
    }
});




// Endpoint to generate and save random number
router.post('/update-login-details', async (req, res) => {
    try {
        let { email, newId, newPassword, number } = req.body;

        // Check if required fields are missing
        if (!email || !newId || !newPassword || !number) {
            console.log('Incomplete request body');
            return res.status(400).json({ error: 'Incomplete request body; please provide all required fields.' });
        }

        console.log('Received form submission:', email, newId, newPassword, number);
        newId = newId.trim();

        // Validate newId against schema rules
        const isValidId = /^[a-zA-Z]{8,}$/.test(newId);
        console.log('isValidId:', isValidId);

        if (!isValidId) {
            console.log('Invalid newId');
            return res.status(400).json({ error: 'New ID does not follow schema rules; try again.' });
        }

        // Validate newPassword against existing schema rules
        const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(newPassword);
        console.log('isPasswordValid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid newPassword');
            return res.status(400).json({ error: 'New Password does not follow schema rules; try again.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the RandomNumber document
        const randomNumber = await RandomNumber.findOne({ number });

        if (!randomNumber) {
            console.log('Random number not found');
            return res.status(500).json({ error: 'Random number not found' });
        }

        // Update user's login details
        const updatedUser = await User.findOneAndUpdate({ email },
            { $set: { id: newId, password: newPassword } },
            { new: true }
        );

        // Send a JSON response with success message
        console.log('Login details successfully updated');
        return res.status(200).json({ success: 'Your login details have been successfully updated.' });
    } catch (err) {
        console.error('Error updating login details:', err);
        return res.status(500).json({ error: 'Error updating login details.' });
    }
});




// Error handling middleware which handles any unhandled errors in the application 
app.use((err,req,res,next)=>{console.error(err.stack);// Log the error stack trace
res.status(500).send('Something went wrong')
})


module.exports = router;




