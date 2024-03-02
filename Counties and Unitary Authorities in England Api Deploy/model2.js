const mongoose = require('./connection.js');


// Define a mongoose schema for storing the random number
const RandomNumberSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true},
  email: {
        type: String,
        required: true}
  
});

const RandomNumber = mongoose.model('RandomNumber', RandomNumberSchema,'resolutionNumbers');

module.exports = RandomNumber;
