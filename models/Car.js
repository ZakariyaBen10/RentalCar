const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  color: String,
  license_plate: String,
  available: Boolean,
}, { collection: 'Cars', versionKey: false });

const Car = mongoose.model('Cars', carSchema);

module.exports = Car;
