const Client = require('../models/Client');

const clientController = {
  getAllClients: async (req, res) => {
    try {
      const clients = await Client.find();
      res.json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getClientById: async (req, res) => {
    const clientId = req.params.id;
    try {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addClient: async (req, res) => {
    const newClientData = req.body;

    // Validate email format
    if (!isValidEmail(newClientData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number format
    if (!isValidPhoneNumber(newClientData.phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
      const newClient = await Client.create(newClientData);
      console.log('Added Client:', newClient);
      res.status(201).json(newClient);
    } catch (error) {
      console.error('Error adding client:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateClient: async (req, res) => {
    const clientId = req.params.id;
    const updatedClientData = req.body;

    if (updatedClientData.email && !isValidEmail(updatedClientData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (updatedClientData.phone && !isValidPhoneNumber(updatedClientData.phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
      const updatedClient = await Client.findByIdAndUpdate(clientId, updatedClientData, { new: true });
      if (!updatedClient) {
        return res.status(404).json({ error: 'Client not found' });
      }
      console.log('Updated Client:', updatedClient);
      res.json(updatedClient);
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteClient: async (req, res) => {
    const clientId = req.params.id;
    try {
      const deletedClient = await Client.findByIdAndDelete(clientId);
      if (!deletedClient) {
        return res.status(404).json({ error: 'Client not found' });
      }
      console.log('Deleted Client:', deletedClient);
      res.json(deletedClient);
    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^\+\d{2} \d{3} \d{2} \d{2} \d{2}$/;
  return phoneRegex.test(phoneNumber);
}

module.exports = clientController;
