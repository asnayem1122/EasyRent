const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// 1. Get properties with search filters
const getAllProperties = async (req, res) => {
  const { location, property_type, rooms, rent_min, rent_max } = req.query;

  let queryText = `
    SELECT p.*, 
           (SELECT image_path FROM property_images WHERE property_id = p.property_id LIMIT 1) as main_image 
    FROM properties p 
    WHERE p.approval_status = 'Approved'
  `;
  const params = [];
  let paramIndex = 1;

  if (location) {
    queryText += ` AND p.location ILIKE $${paramIndex}`;
    params.push(`%${location}%`);
    paramIndex++;
  }

  if (property_type) {
    queryText += ` AND p.property_type = $${paramIndex}`;
    params.push(property_type);
    paramIndex++;
  }

  if (rooms) {
    queryText += ` AND p.rooms = $${paramIndex}`;
    params.push(parseInt(rooms));
    paramIndex++;
  }

  if (rent_min) {
    queryText += ` AND p.rent >= $${paramIndex}`;
    params.push(parseFloat(rent_min));
    paramIndex++;
  }

  if (rent_max) {
    queryText += ` AND p.rent <= $${paramIndex}`;
    params.push(parseFloat(rent_max));
    paramIndex++;
  }

  queryText += ' ORDER BY p.created_at DESC';

  try {
    const result = await db.query(queryText, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching properties.' });
  }
};

// 2. Get single property details with owner info & all images
const getPropertyById = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const propertyResult = await db.query(`
      SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone 
      FROM properties p
      JOIN users u ON p.owner_id = u.user_id 
      WHERE p.property_id = $1 LIMIT 1
    `, [propertyId]);

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const property = propertyResult.rows[0];

    const imagesResult = await db.query('SELECT image_id, image_path FROM property_images WHERE property_id = $1', [propertyId]);
    property.images = imagesResult.rows;

    res.status(200).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching property details.' });
  }
};

// 3. Get my properties (for owners)
const getMyProperties = async (req, res) => {
  const ownerId = req.user.user_id;

  try {
    const result = await db.query(`
      SELECT p.*, 
             (SELECT image_path FROM property_images WHERE property_id = p.property_id LIMIT 1) as main_image 
      FROM properties p 
      WHERE p.owner_id = $1 
      ORDER BY p.created_at DESC
    `, [ownerId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching owner properties.' });
  }
};

// 4. Create a property (owner)
const createProperty = async (req, res) => {
  const ownerId = req.user.user_id;
  const { title, description, rent, location, rooms, bathrooms, property_type, contact_info } = req.body;

  if (!title || !description || !rent || !location || !rooms || !bathrooms || !property_type || !contact_info) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await db.query(`
      INSERT INTO properties (owner_id, title, description, rent, location, rooms, bathrooms, property_type, contact_info) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING property_id
    `, [ownerId, title, description, parseFloat(rent), location, parseInt(rooms), parseInt(bathrooms), property_type, contact_info]);

    const propertyId = result.rows[0].property_id;

    // Handle files uploaded (via multer req.files)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // We store paths relative to backend root, serving static files from uploads folder
        const imagePath = `uploads/${file.filename}`;
        await db.query('INSERT INTO property_images (property_id, image_path) VALUES ($1, $2)', [propertyId, imagePath]);
      }
    }

    res.status(201).json({ message: 'Property listing created successfully and is pending approval.', property_id: propertyId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error creating property listing.' });
  }
};

// 5. Update a property (owner)
const updateProperty = async (req, res) => {
  const ownerId = req.user.user_id;
  const propertyId = req.params.id;
  const { title, description, rent, location, rooms, bathrooms, property_type, status, contact_info } = req.body;

  if (!title || !description || !rent || !location || !rooms || !bathrooms || !property_type || !status || !contact_info) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check ownership
    const ownershipCheck = await db.query('SELECT owner_id FROM properties WHERE property_id = $1', [propertyId]);
    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    if (ownershipCheck.rows[0].owner_id !== ownerId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    await db.query(`
      UPDATE properties SET 
        title = $1, description = $2, rent = $3, location = $4, 
        rooms = $5, bathrooms = $6, property_type = $7, status = $8, contact_info = $9 
      WHERE property_id = $10
    `, [title, description, parseFloat(rent), location, parseInt(rooms), parseInt(bathrooms), property_type, status, contact_info, propertyId]);

    // Handle new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imagePath = `uploads/${file.filename}`;
        await db.query('INSERT INTO property_images (property_id, image_path) VALUES ($1, $2)', [propertyId, imagePath]);
      }
    }

    res.status(200).json({ message: 'Property updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error updating property.' });
  }
};

// 6. Delete a property (owner or admin)
const deleteProperty = async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.user_id;
  const userRole = req.user.role;

  try {
    // Check ownership
    const propCheck = await db.query('SELECT owner_id FROM properties WHERE property_id = $1', [propertyId]);
    if (propCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    if (propCheck.rows[0].owner_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    // Fetch and delete all image files on disk
    const images = await db.query('SELECT image_path FROM property_images WHERE property_id = $1', [propertyId]);
    for (const img of images.rows) {
      const fullPath = path.join(__dirname, '..', img.image_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // Delete property (cascade will remove property_images, inquiries, and favorites in Postgres)
    await db.query('DELETE FROM properties WHERE property_id = $1', [propertyId]);

    res.status(200).json({ message: 'Property deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error deleting property.' });
  }
};

// 7. Delete specific image (owner)
const deletePropertyImage = async (req, res) => {
  const imageId = req.params.imageId;
  const ownerId = req.user.user_id;

  try {
    // Verify ownership
    const imgCheck = await db.query(`
      SELECT pi.image_path, p.owner_id 
      FROM property_images pi
      JOIN properties p ON pi.property_id = p.property_id
      WHERE pi.image_id = $1
    `, [imageId]);

    if (imgCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found.' });
    }

    if (imgCheck.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    // Unlink file
    const filePath = path.join(__dirname, '..', imgCheck.rows[0].image_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from DB
    await db.query('DELETE FROM property_images WHERE image_id = $1', [imageId]);

    res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error deleting property image.' });
  }
};

// 8. Toggle favorite property (tenant)
const toggleFavorite = async (req, res) => {
  const tenantId = req.user.user_id;
  const propertyId = req.params.id;

  try {
    const checkFav = await db.query('SELECT favorite_id FROM favorites WHERE tenant_id = $1 AND property_id = $2', [tenantId, propertyId]);
    
    if (checkFav.rows.length > 0) {
      // Remove favorite
      await db.query('DELETE FROM favorites WHERE tenant_id = $1 AND property_id = $2', [tenantId, propertyId]);
      res.status(200).json({ favorited: false, message: 'Removed from favorites.' });
    } else {
      // Add favorite
      await db.query('INSERT INTO favorites (tenant_id, property_id) VALUES ($1, $2)', [tenantId, propertyId]);
      res.status(200).json({ favorited: true, message: 'Added to favorites.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error toggling favorite.' });
  }
};

// 9. Get favorites list (tenant)
const getFavorites = async (req, res) => {
  const tenantId = req.user.user_id;

  try {
    const result = await db.query(`
      SELECT p.*, 
             (SELECT image_path FROM property_images WHERE property_id = p.property_id LIMIT 1) as main_image 
      FROM favorites f
      JOIN properties p ON f.property_id = p.property_id
      WHERE f.tenant_id = $1 
      ORDER BY f.favorite_id DESC
    `, [tenantId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching favorites.' });
  }
};

// 10. Check if a property is favorited
const isFavorite = async (req, res) => {
  const tenantId = req.user.user_id;
  const propertyId = req.params.id;

  try {
    const result = await db.query('SELECT 1 FROM favorites WHERE tenant_id = $1 AND property_id = $2', [tenantId, propertyId]);
    res.status(200).json({ isFavorite: result.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error checking favorite status.' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  toggleFavorite,
  getFavorites,
  isFavorite
};
