const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/', verifyToken, checkRole(['tenant']), inquiryController.sendInquiry);
router.get('/', verifyToken, checkRole(['owner', 'tenant']), inquiryController.getInquiries);

module.exports = router;
