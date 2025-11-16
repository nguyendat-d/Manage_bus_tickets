const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Tất cả routes đều yêu cầu authentication và admin role
router.use(auth.authenticate, auth.authorizeAdmin);

// Quản lý users
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

// Quản lý nhà xe
router.get('/bus-companies', adminController.getBusCompanies);
router.put('/bus-companies/:id/status', adminController.approveBusCompany);

// Quản lý tuyến đường
router.get('/routes', adminController.getRoutes);
router.post('/routes', adminController.createRoute);
router.put('/routes/:id', adminController.updateRoute);
router.delete('/routes/:id', adminController.deleteRoute);

// Analytics & Reports
router.get('/analytics', adminController.getAnalytics);

module.exports = router;