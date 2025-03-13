const Service = require('../models/Service');

// CREATE service
const createService = async (req, res) => {
    try {
      const { amount, name, description, time, days,date } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Handling image upload
      
      const newService = new Service({
        amount,
        name,
        description,
        time,
        days,
        date,
        imageUrl,  // Saving the image URL in the service
      });
  
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// GET all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE service
const updateService = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      days: req.body.days.split(',').map(day => day.trim())
    };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE service
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
