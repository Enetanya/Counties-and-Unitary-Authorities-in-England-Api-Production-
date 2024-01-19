/*import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authMiddleware from './authenticationJsonToken';
import changeMiddleware from './changeLoginDetails';
import mainMiddleware from './main';


const api = express();
const router = express.Router();

// View engine setup
api.set('view engine', 'pug');
api.set('views', './views');

// Middleware setup
api.use(cookieParser());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(cors());

// Apply authentication middleware
router.use('/auth', authMiddleware);

// Use route to change login details
router.use('/forgot', changeMiddleware);

// Use route for main API
router.use('/main', mainMiddleware);

// API endpoint for a health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is healthy' });
});

// Handle undefined routes
api.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
api.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

api.use('/api/', router);

export const handler = serverless(api); */




const pug = require('pug');
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

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views')); // Views directory in the root directory

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Apply authentication middleware
router.use('/auth', (req, res, next) => authMiddleware(req, res, next));

// Use route to change login details
router.use('/forgot', (req, res, next) => changeMiddleware(req, res, next));

// Use route for the main API
router.use('/main', (req, res, next) => mainMiddleware(req, res, next));


// Aligns with the Netlify function's route
app.use('/', router);

module.exports.handler = serverless(app);