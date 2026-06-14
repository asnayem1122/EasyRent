const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!['admin', 'owner', 'tenant'].includes(role)) {
    return res.status(400).json({ error: 'Invalid user role.' });
  }

  try {
    // Check if email already exists
    const emailCheck = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, phone, role',
      [name, email, phone, hashedPassword, role]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkey_easyrent',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during registration.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkey_easyrent',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during login.' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const result = await db.query('SELECT user_id, name, email, phone, role, created_at FROM users WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching profile.' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email and phone are required.' });
  }

  try {
    // Check if email belongs to another user
    const emailCheck = await db.query('SELECT user_id FROM users WHERE email = $1 AND user_id != $2', [email, userId]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another account.' });
    }

    let queryText = 'UPDATE users SET name = $1, email = $2, phone = $3 WHERE user_id = $4 RETURNING user_id, name, email, phone, role';
    let queryParams = [name, email, phone, userId];

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      queryText = 'UPDATE users SET name = $1, email = $2, phone = $3, password = $4 WHERE user_id = $5 RETURNING user_id, name, email, phone, role';
      queryParams = [name, email, phone, hashedPassword, userId];
    }

    const result = await db.query(queryText, queryParams);
    res.status(200).json({ message: 'Profile updated successfully!', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error updating profile.' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
