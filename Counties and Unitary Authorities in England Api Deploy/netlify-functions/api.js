const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./authenticationJsonToken');
const changeMiddleware = require('./changeLoginDetails');
const mainMiddleware = require('./main');
const path = require('path');

const app = express();
const router = express.Router();

// Serve static HTML files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Apply authentication middleware
router.use('/auth', authMiddleware);

// Use route to change login details
router.use('/forgot', changeMiddleware);

// Use route for the main API
router.use('/main', mainMiddleware);

// Aligns with the Netlify function's route
app.use('/', router);

// Set HTML as the default view engine
app.engine('html', (filePath, options, callback) => {
  // Function to render HTML files
  res.sendFile(filePath);
});

app.set('view engine', 'html');

// Serverless setup
module.exports.handler = serverless(app);