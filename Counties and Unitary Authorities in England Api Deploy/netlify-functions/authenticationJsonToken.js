
const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken'); // JWT library
const User = require('../model.js');


// Secret key for JWT
const secretKey = '1234567890';


// Signup route
router.get('/signup', function(req, res){
    res.render(path.join(__dirname, '../views/signup'), { message: null });
});


// Signup route with validation
router.post('/signup', async function(req, res){
    try {
        let { id, password, email } = req.body;
 
        //Trim the 'id' to remove leading/trailing space
        id = id.trim();
        
       // Validation for 'id'
        if (!/^[a-zA-Z]{8,}$/.test(id)) {
            return res.render('signup', { message: "Invalid 'id' format! It should be at least 8 characters long and contain only letters." });
        }
 
        // Validation for 'password'
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!£@#$%^&*()_+])[a-zA-Z0-9!£@#$%^&*()_+]{8,}$/.test(password)) {
            return res.render('signup', { message: "Invalid 'password' format! It should contain at least one letter, one number, one special character, and be at least 8 characters long." });
        }
 
        // Check if email already exists (example query, adjust as per your setup)
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.render('signup', { message: "Email already exists! Please choose another Email" });
        }
 
        // Create new user (example save, adjust as per your setup)
        const newUser = new User({ id, password, email });
        await newUser.save();
        return res.redirect('/auth/login');
    } catch(err) {
        console.error(err);
        return res.render('signup', { message: 'Internal Server Error' });
    }
 });
 
 
// Login route
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', async function(req, res){
    if (!req.body.id || !req.body.password) {
        res.render('login', { message: "Please enter both id and password" });
    } else {
        try {
            const foundUser = await User.findOne({ id: req.body.id, password: req.body.password }).exec();
            if(foundUser){
                const token = jwt.sign({ id: foundUser.id }, secretKey);
                res.cookie('token', token);
                res.redirect('/auth/documentationPage');
            } else {
                res.render('login', { message: "Invalid credentials!" });
            }
        } catch(err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Protected page route
router.get('/documentationPage', verifyToken, function(req, res){
    res.render('documentationPage', { id: req.userId });
});

// Logout route
router.get('/logout', function(req, res){
    res.clearCookie('token');
    console.log('User logged out.');
    res.redirect('/auth/login');
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
   const token = req.cookies.token;
   if (token) {
       jwt.verify(token, secretKey, (err, decoded) => {
           if (err) {
               return res.redirect('/auth/login');
           }
           req.userId = decoded.id;
           next();
       });
   } else {
       res.redirect('/auth/login');
   }
}


// Error handling middleware which handles any unhandled errors in the  application
app.use((err,req,res,next)=>
{console.error(err.stack);// Log the error stack trace
res.status(500).send('Something went wrong')
})

module.exports = router;
