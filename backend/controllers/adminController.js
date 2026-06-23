const db = require('../config/db');

// 1. Get all properties for Admin panel
const getAllPropertiesForAdmin = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.name as owner_name, u.email as owner_email 
      FROM properties p
      JOIN users u ON p.owner_id = u.user_id 
      ORDER BY p.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching properties for admin.' });
  }
};

// 2. Approve, Reject property
const updateApprovalStatus = async (req, res) => {
  const propertyId = req.params.id;
  const { approval_status } = req.body;

  if (!['Pending', 'Approved', 'Rejected'].includes(approval_status)) {
    return res.status(400).json({ error: 'Invalid approval status value.' });
  }

  try {
    const result = await db.query(`
      UPDATE properties SET approval_status = $1 WHERE property_id = $2 RETURNING property_id
    `, [approval_status, propertyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    res.status(200).json({ message: `Property status updated to ${approval_status} successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error updating approval status.' });
  }
};

// 3. Get all users
const getAllUsers = async (req, res) => {
  const adminId = req.user.user_id;

  try {
    const result = await db.query(`
      SELECT user_id, name, email, phone, role, created_at 
      FROM users 
      WHERE user_id != $1 
      ORDER BY created_at DESC
    `, [adminId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching users.' });
  }
};

// 4. Delete user (Admin)
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const adminId = req.user.user_id;

  if (parseInt(userId) === parseInt(adminId)) {
    return res.status(400).json({ error: 'You cannot delete your own admin account.' });
  }

  try {
    // Delete user (cascade deletes inquiries, properties, favorites etc. in Postgres)
    const result = await db.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error deleting user.' });
  }
};

// 5. Get system statistics (Admin Dashboard)
const getDashboardStats = async (req, res) => {
  try {
    // User counts
    const usersCount = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
        COUNT(CASE WHEN role = 'tenant' THEN 1 END) as tenants
      FROM users
      WHERE role != 'admin'
    `);

    // Property counts
    const propertiesCount = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN approval_status = 'Approved' AND status = 'Available' THEN 1 END) as active,
        COUNT(CASE WHEN approval_status = 'Pending' THEN 1 END) as pending
      FROM properties
    `);

    // Inquiries count
    const inquiriesCount = await db.query('SELECT COUNT(*) as total FROM inquiries');

    res.status(200).json({
      users: {
        total: parseInt(usersCount.rows[0].total),
        owners: parseInt(usersCount.rows[0].owners),
        tenants: parseInt(usersCount.rows[0].tenants),
      },
      properties: {
        total: parseInt(propertiesCount.rows[0].total),
        active: parseInt(propertiesCount.rows[0].active),
        pending: parseInt(propertiesCount.rows[0].pending),
      },
      inquiries: {
        total: parseInt(inquiriesCount.rows[0].total),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error generating system stats.' });
  }
};

module.exports = {
  getAllPropertiesForAdmin,
  updateApprovalStatus,
  getAllUsers,
  deleteUser,
  getDashboardStats,
};
