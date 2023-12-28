const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  booking_date: Date,
  return_date: Date,
  status: String,
}, { collection: 'Booking', versionKey: false });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
