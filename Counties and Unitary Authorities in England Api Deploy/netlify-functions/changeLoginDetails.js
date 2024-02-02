const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../model.js');
const jwt = require('jsonwebtoken'); // Importing JWT library
const dbConnection = require('../connection'); 



// Generate JWT token with email and expiration time
function generateToken(email) {
  return jwt.sign({ email }, '1234567890', { expiresIn: '15m' });
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
  const changeLink = `http://localhost:3000/forgot/change-login-details/${token}`;
 
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



// Define the Verify model
const Verify = dbConnection.model('Verify', {
  email: {
    type: String,
    required: true
  },
  verification: {
    type: String,
    enum: ['pass', 'fail'],
    required: true
  }
}, 'Verification');


// Handling the token verification
app.get('/change-login-details/:token', async (req, res) => {
  const token = req.params.token;

  // ...

try {
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, '1234567890', (err, decoded) => {
      if (err) {
        reject('Invalid or expired token');
      } else {
        resolve(decoded);
      }
    });
  });

  // Example verification logic: Check if the decoded object has a valid email
  const verificationStatus = decoded && decoded.email ? 'pass' : 'fail';

  // Create a new document in the 'Verification' collection with email and verification status
  await Verify.create({ email: decoded.email, verification: verificationStatus });

  if (verificationStatus === 'pass') {
    // Render a page to update login details
    res.render('new-login-details', { email: decoded.email });
  } else {
    // Handle the case where verification fails and redirect to an error page
    res.render('verification-failed');
  }
} catch (error) {
  // Handle errors during token verification or database interaction
  res.status(500).send(`Error: ${error}`);
}




// Handling the form submission for updating login details
router.post('/update-login-details', async (req, res) => 
{ let { email, newId, newPassword } = req.body;
 newId = newId.trim();
try { 
    // Validate newId against schema rules 
    const isValidId = /^[a-zA-Z]{8,}$/.test(newId);
 
    if (!isValidId) { 
        return res.render('newLoginDetails', { 
            email, error: 'New ID does not follow schema rules ; try again.' 
        }); 
        }
 // Validate newPassword against existing schema rules 
 const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(newPassword);
 
 if (!isPasswordValid) { 
    return res.render('newLoginDetails', { 
        email, error: 'New Password does not follow schema rules ; try again.' 
    }); 
}
 const updatedUser = await User.findOneAndUpdate( { email }, 
    { $set: { id: newId, password: newPassword } }, 
    { new: true } );
 
    if (!updatedUser) { 
        return res.render('newLoginDetails', { 
            email, error: 'User not found' }); 
        }
 // Render the form with the success message 
 res.send('newLoginDetails', { email, 
    success: 'Your login details have been successfully updated. Click the Login link below to continue.' 
});
 } catch (err) { 
    return res.render('newLoginDetails', { email, 
        error: 'Error updating login details.' 
    }); 
}});





// Error handling middleware which handles any unhandled errors in the application 
app.use((err,req,res,next)=>{console.error(err.stack);// Log the error stack trace
res.status(500).send('Something went wrong')
})


module.exports = router;




