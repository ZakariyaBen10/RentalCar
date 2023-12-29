const Cars = require('../models/Car');

const carController = {
  getAllCars: async (req, res) => {
    try {
      const { limit, offset, searchField, searchValue } = req.query;

      let query = {};

      if (searchField && searchValue) {
        query[searchField] = new RegExp(searchValue, 'i'); 
      }

      const cars = await Cars.find(query)
        .limit(parseInt(limit, 10) || 10)
        .skip(parseInt(offset, 10) || 0);

      res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getCarById: async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await Cars.findById(carId);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json(car);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addCar: async (req, res) => {

const newCarData = req.body;

    if (
      !newCarData.brand || !newCarData.model || !newCarData.year || !newCarData.color ||
      !newCarData.license_plate || typeof newCarData.available !== 'boolean' ||
      /\d/.test(newCarData.brand) || /\d/.test(newCarData.model)
    ) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
      const newCar = await Cars.create(newCarData);
      console.log('Added Car:', newCar);
      res.status(201).json(newCar);
    } catch (error) {
      console.error('Error adding car:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  },



  updateCar: async (req, res) => {

const carId = req.params.id;
    const updatedCarData = req.body;

    if (updatedCarData.year && isNaN(updatedCarData.year)) {
      return res.status(400).json({ error: 'Year must be a numeric value' });
    }

    if (
      !updatedCarData.brand || !updatedCarData.model || !updatedCarData.color ||
      !updatedCarData.license_plate || typeof updatedCarData.available !== 'boolean' ||
      /\d/.test(updatedCarData.brand) || /\d/.test(updatedCarData.model)
    ) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
      const updatedCar = await Cars.findByIdAndUpdate(carId, updatedCarData, { new: true });
      if (!updatedCar) {
        return res.status(404).json({ error: 'Car not found' });
      }
      console.log('Updated Car:', updatedCar);
      res.json(updatedCar);
    } catch (error) {
      console.error('Error updating car:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  },

  deleteCar: async (req, res) => {
const carId = req.params.id;
  try {
    const deletedCar = await Cars.findByIdAndDelete(carId);
    if (!deletedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    console.log('Deleted Car:', deletedCar);
    res.json(deletedCar);
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  },
};

module.exports = carController;
