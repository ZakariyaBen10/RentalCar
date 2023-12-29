const Booking = require('../models/Booking');
const Client = require('../models/Client');
const Car = require('../models/Car');

const bookingController = {
  getAllBookings: async (req, res) => {
    try {
      const { limit, offset, searchField, searchValue } = req.query;

      let query = {};

      if (searchField && searchValue) {
        query[searchField] = new RegExp(searchValue, 'i');
      }

      const bookings = await Booking.find(query)
        .limit(parseInt(limit, 10) || 10)
        .skip(parseInt(offset, 10) || 0);

      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getBookingById: async (req, res) => {
    const bookingId = req.params.id;
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addBooking: async (req, res) => {
    const newBookingData = req.body;

    if (!isValidDateFormat(newBookingData.booking_date) || !isValidDateFormat(newBookingData.return_date)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const clientExists = await Client.exists({ _id: newBookingData.client_id });
    if (!clientExists) {
      return res.status(400).json({ error: 'Invalid client_id' });
    }

    const carExists = await Car.exists({ _id: newBookingData.car_id });
    if (!carExists) {
      return res.status(400).json({ error: 'Invalid car_id' });
    }

    try {
      const newBooking = await Booking.create(newBookingData);
      console.log('Added Booking:', newBooking);
      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Error adding booking:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateBooking: async (req, res) => {
    const bookingId = req.params.id;
    const updatedBookingData = req.body;

    if (
      (updatedBookingData.booking_date && !isValidDateFormat(updatedBookingData.booking_date)) ||
      (updatedBookingData.return_date && !isValidDateFormat(updatedBookingData.return_date))
    ) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (updatedBookingData.client_id) {
      const clientExists = await Client.exists({ _id: updatedBookingData.client_id });
      if (!clientExists) {
        return res.status(400).json({ error: 'Invalid client_id' });
      }
    }

    if (updatedBookingData.car_id) {
      const carExists = await Car.exists({ _id: updatedBookingData.car_id });
      if (!carExists) {
        return res.status(400).json({ error: 'Invalid car_id' });
      }
    }

    try {
      const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updatedBookingData, { new: true });
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      console.log('Updated Booking:', updatedBooking);
      res.json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteBooking: async (req, res) => {
    const bookingId = req.params.id;
    try {
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
      if (!deletedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      console.log('Deleted Booking:', deletedBooking);
      res.json(deletedBooking);
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

function isValidDateFormat(date) {
 const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
return dateRegex.test(date);
}

module.exports = bookingController;