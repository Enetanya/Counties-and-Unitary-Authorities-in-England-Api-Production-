const mongoose = require('./connection.js');


// Define a mongoose schema for storing the random number
const RandomNumberSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
});

const RandomNumber = mongoose.model('RandomNumber', RandomNumberSchema,'resolutionNumber');

module.exports = RandomNumber;
