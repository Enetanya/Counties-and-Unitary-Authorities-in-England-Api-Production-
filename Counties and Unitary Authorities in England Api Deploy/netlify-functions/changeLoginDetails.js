const express = require('express');
const app = express();
const router = express.Router();
const SSE = require('@takadenoshi/express-sse');
const sse = new SSE();
const nodemailer = require('nodemailer');
const User = require('../model.js');
const jwt = require('jsonwebtoken'); // Importing JWT library

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
  const changeLink = `https://charming-figolla-3e81b7.netlify.app/forgot/change-login-details/${token}`;
 
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




// Handling the token verification

router.get('/change-login-detail/:token', (req, res) => { 
  const token = req.params.token;
  
  jwt.verify(token, secretKey, (err, decoded) => { 
    if (err) { 
      return res.send('Invalid or expired token'); 
    }
    
    // Token verification successful
    console.log('Token verified successfully');
    
    // Sending message to the client window
    const successMessage = 'Token verified successfully';
  
    // Send a message to another window
    const otherWindow = window.open('http://localhost:3000', '_blank');
    otherWindow.postMessage(successMessage, 'http://localhost:3000');
  });
});




router.get('/change-login-details/:token', (req, res) => { 
  const token = req.params.token;
  jwt.verify(token, secretKey, (err, decoded) => { 
    if (err) { 
      return res.send('Invalid or expired token'); 
    }
    // Render a page to update login details 
    console.log('Redirect');
    
    res.redirect('http://localhost:3000/new-login-details');
  });
});


// SSE message sender endpoint
router.get('/message-sender', (req, res) => {
  console.log('SSE endpoint accessed');  // Adding this for basic logging

  // Set up headers for SSE and CORS
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // CORS headers for the SSE route
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Function to send SSE message
  const sendSSEMessage = (data) => {
    console.log('Sending SSE message:', data);  // Add this for message logging
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send 'successful' as an SSE message
  sendSSEMessage({ status: 'successful' });

  // Handle connection close
  req.on('close', () => {
    console.log('Connection closed');  // Adding this for connection close logging
    // Close the change stream and end the response
    res.end();
  });
});




// SSE message sender endpoint
router.get('/sse', (req, res) => {
  console.log('SSE endpoint accessed');  // Log when SSE endpoint is accessed

  // Set headers for SSE route
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');


  // Connect the SSE instance to the response stream
  sse.init;

  // Send initial SSE event
  console.log('Sending initial SSE event');
  sse.send({ status: 'successful' });
});


  // Handling setting of cookies
router.get('/set-cookie', (req, res) => {
    // Set cookie with data and expiration time
    res.cookie('data', JSON.stringify({ status: "successful" }), { maxAge: 20000 }); // 20 seconds expiration
    res.send('Cookie set');
});



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




