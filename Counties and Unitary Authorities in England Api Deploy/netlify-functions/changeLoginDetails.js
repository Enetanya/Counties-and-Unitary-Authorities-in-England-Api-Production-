const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Importing JWT library
const User = require('../model.js');
const AWS = require('aws-sdk');



// Secret key for JWT
const secretKey = '1234567890';

// Generate JWT token with email and expiration time
function generateToken(email) { 
    return jwt.sign({ email }, 
        secretKey, 
        { expiresIn: '15m' });}

        // Routes
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


// Endpoint to handle changing login details with token verification
router.get('/change-login-details/:token', (req, res) => {
  const token = req.params.token;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.send('Invalid or expired token');
    }

    // Publish a message to AWS SNS after token verification
    const sns = new AWS.SNS();
    const publishParams = {
      TopicArn:  'arn:aws:sns:eu-north-1:745109517592:Counties_and_Unitary_Authorities_in_England_Api', // SNS topic ARN
      Message: 'Token successfully validated. Trigger React update.',
    };

    sns.publish(publishParams, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Message published:', data.MessageId);
        return res.status(200).json({ success: true });
      }
    });
  });
});


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




