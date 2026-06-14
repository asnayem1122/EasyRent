const db = require('../config/db');

// 1. Submit a property inquiry (Tenant)
const sendInquiry = async (req, res) => {
  const tenantId = req.user.user_id;
  const { property_id, message } = req.body;

  if (!property_id || !message) {
    return res.status(400).json({ error: 'Property ID and message are required.' });
  }

  try {
    // Check if property exists
    const propCheck = await db.query('SELECT 1 FROM properties WHERE property_id = $1', [property_id]);
    if (propCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    await db.query(`
      INSERT INTO inquiries (property_id, tenant_id, message) 
      VALUES ($1, $2, $3)
    `, [property_id, tenantId, message]);

    res.status(201).json({ message: 'Inquiry submitted successfully to the property owner.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error submitting inquiry.' });
  }
};

// 2. Fetch inquiries based on role
const getInquiries = async (req, res) => {
  const userId = req.user.user_id;
  const userRole = req.user.role;

  try {
    if (userRole === 'owner') {
      // Fetch inquiries for listings owned by this owner
      const result = await db.query(`
        SELECT i.*, p.title as property_title, u.name as tenant_name, u.email as tenant_email, u.phone as tenant_phone 
        FROM inquiries i
        JOIN properties p ON i.property_id = p.property_id
        JOIN users u ON i.tenant_id = u.user_id
        WHERE p.owner_id = $1
        ORDER BY i.inquiry_date DESC
      `, [userId]);
      res.status(200).json(result.rows);
    } else if (userRole === 'tenant') {
      // Fetch inquiries sent by this tenant
      const result = await db.query(`
        SELECT i.*, p.title as property_title, p.location as property_location, u.name as owner_name 
        FROM inquiries i
        JOIN properties p ON i.property_id = p.property_id
        JOIN users u ON p.owner_id = u.user_id
        WHERE i.tenant_id = $1
        ORDER BY i.inquiry_date DESC
      `, [userId]);
      res.status(200).json(result.rows);
    } else {
      res.status(403).json({ error: 'Inquiries are only viewable by owners and tenants.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching inquiries.' });
  }
};

module.exports = {
  sendInquiry,
  getInquiries,
};
