const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../model.js');
const User = require('../model2.js');
const jwt = require('jsonwebtoken'); // Importing JWT library
const randomize = require('randomatic'); // npm package for generating random numbers


// Secret key for JWT
const secretKey = '1234567890';

// Generate JWT token with email and expiration time
function generateToken(email) {
  return jwt.sign({ email }, secretKey, { expiresIn: '15m' });
}


        // Routes to input email 
router.get('/forgot-password', (req, res) => { 
    res.render('forgotPassword'); // Render the page to enter email
});

router.post('/submit-email', async (req, res) => { 
    const { email } = req.body;
 const user = await User.findOne({ email }); 
 if (!user) { 
    return res.send('Email not found in our records'
    ); 
}
 const token = generateToken(email);
  const changeLink = `https://counties-unitauthorities-england-api.netlify.app/forgot/change-login-details/${token}`;
 
 // Create a nodemailer transporter 
 const transporter = 
 nodemailer.createTransport({ 
    service: 'Gmail', // Use your email service 
    auth: { 
     user: 'businessenets@gmail.com', // My email 
     pass: 'tyei ibsr csvy jocq' // My password or app password 
}, 
});

 // Email content with the generated token in the link 
 const mailOptions = { 
    from: 'businessenets@gmail.com', 
    to: email, 
    subject: 'Change Login Details', 
    text: `Click the link to change your login details: ${changeLink}`, 
};

// Send the email 
transporter.sendMail(mailOptions, function 
    (error, info) {  
        if (error) { 
           res.send({error:'Failed to send email'}); 
          } else { 
            res.send({message:'success'}); 
        } 
    });
});



 // Token verification 
router.get('/change-login-details/:token', (req, res) => { 
  const token = req.params.token;
  jwt.verify(token, secretKey, (err, decoded) => { 
    if (err) { 
      return res.send('Invalid or expired token'); 
    }
    // Redirect  
    console.log('Redirect');
    
    res.redirect('forgot/generate-number');
  });
});



// Endpoint to generate and save random number
router.post(
  '/generate-number', async (req, res) => {  
    const randomNumber = randomize('0', 6); // Generate a random 6-digit number  
    const newRandomNumber = new RandomNumber({ number: randomNumber });
  try {    
    // Save the random number to the database    
    await newRandomNumber.save();
    // Send the random number to the client    
    res.json({ number: randomNumber, message: 'Thanks you for confirming your email address. Copy your resolution number below and include it in the relevant section. You can now return to the react app main window.' });  
  } 
  catch (err) 
  {    res.status(500).json({ message: 'Error generating and saving random number' });  
  }});



// Handling the form submission for updating login details
router.post('/update-login-details', async (req, res) => {
    let { email, newId, newPassword } = req.body;
    console.log('Received form submission:', email, newId, newPassword);
    newId = newId.trim();

    try {
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

        const updatedUser = await User.findOneAndUpdate({ email },
            { $set: { id: newId, password: newPassword } },
            { new: true }
        );

        if (!updatedUser) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

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




