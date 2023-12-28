const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: String,
  color: String,
  license_plate: String,
  available: Boolean,
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
