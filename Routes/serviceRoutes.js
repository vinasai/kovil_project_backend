const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const multer = require('multer');
const path = require('path');

// Configure storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route for creating a new service with image upload
router.post('/', upload.single('image'), serviceController.createService);

// Route for getting all services
router.get('/', serviceController.getAllServices);

// Route for getting a single service by ID
router.get('/:id', serviceController.getServiceById);

// Route for updating a service
router.put('/:id', upload.single('image'), serviceController.updateService);

// Route for deleting a service
router.delete('/:id', serviceController.deleteService);

module.exports = router;
