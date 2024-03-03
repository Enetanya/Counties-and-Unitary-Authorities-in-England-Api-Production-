
const mongoose = require('mongoose');


const mongoURI = process.env.mg;

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = mongoose; // Exporting Mongoose itself


