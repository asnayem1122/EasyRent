const db = require('./config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const seedDatabase = async () => {
  console.log('Starting PostgreSQL database setup and seeding...');

  try {
    // 1. Read and run schema
    const schemaPath = path.join(__dirname, 'database.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Recreating tables...');
    await db.query(schemaSql);
    console.log('Tables recreated successfully.');

    // 2. Create Demo Users
    console.log('Seeding demo user accounts...');
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const ownerPass = await bcrypt.hash('owner123', salt);
    const tenantPass = await bcrypt.hash('tenant123', salt);

    // Insert Admin
    const adminRes = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
      ['System Administrator', 'admin@easyrent.com', '+1234567890', adminPass, 'admin']
    );
    const adminId = adminRes.rows[0].user_id;
    console.log(`- Created Admin Account (admin@easyrent.com) ID: ${adminId}`);

    // Insert Owner
    const ownerRes = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
      ['John Owner', 'owner@easyrent.com', '+1987654321', ownerPass, 'owner']
    );
    const ownerId = ownerRes.rows[0].user_id;
    console.log(`- Created Owner Account (owner@easyrent.com) ID: ${ownerId}`);

    // Insert Tenant
    const tenantRes = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
      ['Sarah Tenant', 'tenant@easyrent.com', '+1122334455', tenantPass, 'tenant']
    );
    const tenantId = tenantRes.rows[0].user_id;
    console.log(`- Created Tenant Account (tenant@easyrent.com) ID: ${tenantId}`);

    // 3. Seed Properties
    console.log('Seeding sample properties...');
    const properties = [
      [
        ownerId,
        'Luxury 3 BHK Flat in Downtown',
        'Spacious flat with city view, modular kitchen and 24/7 security. Located in the heart of the city, close to metro and shopping malls.',
        1500.00,
        'Downtown',
        3,
        2,
        'Flat',
        'Available',
        'Approved',
        'Call John: +1987654321'
      ],
      [
        ownerId,
        'Cozy 2 Bedroom Suburban House',
        'Beautiful cottage-style house with backyard garden and parking. Quiet neighborhood, perfect for families. Pet-friendly.',
        1200.00,
        'Suburbs',
        2,
        1,
        'House',
        'Available',
        'Approved',
        'Email: john.owner@example.com'
      ],
      [
        ownerId,
        'Modern Studio Flat - City Center',
        'Fully furnished studio apartment with high-speed internet, 24-hour security, and amazing city views from the 8th floor.',
        800.00,
        'City Center',
        1,
        1,
        'Flat',
        'Available',
        'Approved',
        'Phone: +1987654321'
      ],
      [
        ownerId,
        'Spacious 4BHK Family House',
        'Huge family house with garden, 2-car garage, and open-plan living area. Close to top schools and parks.',
        2200.00,
        'North Zone',
        4,
        3,
        'House',
        'Available',
        'Pending',
        'Contact: +1987654321'
      ]
    ];

    const propIds = [];
    for (const p of properties) {
      const res = await db.query(`
        INSERT INTO properties (owner_id, title, description, rent, location, rooms, bathrooms, property_type, status, approval_status, contact_info) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING property_id
      `, p);
      propIds.push(res.rows[0].property_id);
    }
    console.log(`- Seeded ${propIds.length} sample properties.`);

    // 4. Seed Inquiry
    console.log('Seeding sample inquiries...');
    await db.query(`
      INSERT INTO inquiries (property_id, tenant_id, message) 
      VALUES ($1, $2, $3)
    `, [propIds[0], tenantId, 'Hello! I am very interested in this flat. Is it available for viewing this weekend? Please let me know the best time to visit. Thank you!']);
    console.log('- Seeded tenant inquiry.');

    console.log('\nDatabase setup and seeding completed successfully!');
    console.log('\n--- Demo Accounts Credentials ---');
    console.log('Admin:  admin@easyrent.com  / admin123');
    console.log('Owner:  owner@easyrent.com  / owner123');
    console.log('Tenant: tenant@easyrent.com / tenant123');
    console.log('---------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('An error occurred during database seeding:', err);
    process.exit(1);
  }
};

seedDatabase();
