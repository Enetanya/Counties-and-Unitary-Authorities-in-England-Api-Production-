
const mongoose = require('./connection.js');


// Assuming you have defined a schema for the passwords collection
const passwordSchema = mongoose.Schema({ 
    password1: String, 
    password2: String});
const PasswordModel = mongoose.model('Password', passwordSchema, 'passwordsCollection');

// Authentication middleware
async function authenticatePasswords(req, res, next) {
     try { let enteredPassword1 = req.body.password1.trim();
        let enteredPassword2 = req.body.password2.trim();
        // Query the database for stored passwords    
    const storedPasswords = await PasswordModel.findOne({});
    // Compare input passwords with stored passwords    
    if (
        (storedPasswords.password1.trim() !== enteredPassword1 && 
            storedPasswords.password2.trim() !== enteredPassword2) 
        ) {return res.status(401).json({ message: 
            'Unauthorized. Wrong passwords.' });
     }
     // If both passwords are correct, allow access to the endpoint    
     next();
     } catch (err) { 
        console.error(err); 
        res.status(500).json(
            { message: 'Error authenticating passwords.' });
         }}
         
         module.exports = authenticatePasswords;








         