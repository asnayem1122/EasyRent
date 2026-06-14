const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { verifyToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'prop_' + uniqueSuffix + ext);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, webp) are allowed.'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: fileFilter
});

// Routes definition
router.get('/', propertyController.getAllProperties);
router.get('/my-listings', verifyToken, checkRole(['owner']), propertyController.getMyProperties);
router.get('/favorites', verifyToken, checkRole(['tenant']), propertyController.getFavorites);

router.get('/:id', propertyController.getPropertyById);
router.get('/:id/is-favorite', verifyToken, checkRole(['tenant']), propertyController.isFavorite);
router.post('/:id/favorite', verifyToken, checkRole(['tenant']), propertyController.toggleFavorite);

router.post('/', verifyToken, checkRole(['owner']), upload.array('images', 5), propertyController.createProperty);
router.put('/:id', verifyToken, checkRole(['owner', 'admin']), upload.array('images', 5), propertyController.updateProperty);
router.delete('/:id', verifyToken, checkRole(['owner', 'admin']), propertyController.deleteProperty);
router.delete('/image/:imageId', verifyToken, checkRole(['owner']), propertyController.deletePropertyImage);

module.exports = router;
