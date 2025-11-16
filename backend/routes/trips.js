const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// Public routes
router.get('/search', tripController.searchTrips);
router.get('/:id', tripController.getTripDetail);
router.get('/:id/seat-map', tripController.getSeatMap);

// Protected routes - Require authentication
router.use(auth.authenticate);

// Nhà xe tạo chuyến xe
router.post('/', auth.authorizeBusCompanyOrAdmin, validation.createTrip, tripController.createTrip);

module.exports = router;