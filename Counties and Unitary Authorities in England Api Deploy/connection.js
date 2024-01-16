
const mongoose = require('mongoose');


const mongoURI = 'mongodb+srv://okechukwuenetanyas:JWnsARftgVv7h0YK@projects.im3erqb.mongodb.net/England'

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = {mongoose, db}; // Exporting Mongoose itself


