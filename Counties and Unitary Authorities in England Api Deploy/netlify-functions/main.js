const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('../connection.js');
const crypto = require('crypto');
const authenticatePasswords = require('../passProtectedRoute.js')



// Schema and model definitions for County
const countySchema = mongoose.Schema({
  "Name": String,
  "Districts": [String],
  "Hospitals": [String],
  "Universities": [String],
  "NotableSites": [String],
  "ClosestAirports": [String],
  "MainTrainStations": [String]
});
const County = mongoose.model("County", countySchema, "Ceremonial_Counties_and_Unitary_Authorities");

// Schema and model definitions for API keys
const apiKeySchema = mongoose.Schema({
  key: String
});


const  ApiKey = mongoose.model("ApiKey", apiKeySchema, "apiKeys");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate API key
function generateAPIKey() {
  return crypto.randomBytes(20).toString('hex');
}

// Endpoint to generate an API key
router.post('/process.env.gy', async function(req, res) {
  try {
    const apiKey = generateAPIKey();
    const apiKeyDocument = new ApiKey({ key: apiKey });
    await apiKeyDocument.save();
    
    res.json({ apiKey, success: 'API key generated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating API key.' });
  }
});

// Middleware to validate API key
function authenticateAPIKey(req, res, next) {
  const apiKeyHeader = req.header('Authorization');
  const apiKeyQuery = req.query.api_key;
  const useHeader = req.query.use_header; // 'true' or 'false' chooses between header or query

  if (useHeader === 'true' && apiKeyHeader) {
    ApiKey.findOne({ key: apiKeyHeader })
      .then((result) => {
        if (!result) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } else if (useHeader === 'false' && apiKeyQuery) {
    ApiKey.findOne({ key: apiKeyQuery })
      .then((result) => {
        if (!result) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}


// GET endpoint to retrieve all counties (protected by API key)
router.get('/place', authenticateAPIKey, async function(req, res) {
  try {
    const counties = await County.find().exec();
    res.json(counties);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET endpoint to retrieve counties by name
router.get('/place/:name', authenticateAPIKey, async function(req, res){
    try {
      const cityName = req.params.name;
      const response = await County.find({ Name: cityName }).exec();
      
      if (!response || response.length === 0) {
        return res.status(404).json({ message: `${cityName} not found` });
      }
      
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });


  
  // POST endpoint to create single or multiple counties documents
  router.post('/process.env.ct',authenticatePasswords ,async function(req, res){
    try {
      const newCounties = Array.isArray(req.body) ? req.body : [req.body]; // body contains an array of counties
      const createdCounties = await County.insertMany(newCounties);
        const cityName = req.body.Name; //  name is provided in the request body
    
      res.json({message:`${cityName} successfully Added`})
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

 // PUT endpoint to update a single county by name
router.post('/process.env.ut', authenticatePasswords, async function(req, res){
  try {
    const cityName = req.body.Name; //  name is provided in the request body
    const updatedCounty = req.body; // body contains the updated county details

    const updateResult = await County.findOneAndUpdate({ Name: cityName }, { $set: updatedCounty }, { new: true });

    if (updateResult) {
      res.json({ message: `${cityName} updated successfully` });
    } else {
      res.status(404).json({ message: `${cityName} not found or not updated` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE endpoint to delete a single county by name
router.post('/process.env.dt', authenticatePasswords, async function(req, res){
  try {
    const cityName = req.body.Name; // name is provided in the request body
    const deleteResult = await County.findOneAndDelete({ Name: cityName });

    if (deleteResult) {
      res.json({ message: `${cityName} deleted successfully` });
    } else {
      res.status(404).json({ message: `${cityName} not found or not deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
  

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

// export the mainApi
module.exports = router;

