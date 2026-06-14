const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken, checkRole(['admin']));

router.get('/stats', adminController.getDashboardStats);
router.get('/properties', adminController.getAllPropertiesForAdmin);
router.put('/properties/:id/approval', adminController.updateApprovalStatus);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
