-- EasyRent Database Schema (PostgreSQL)

-- Drop tables if they exist (clean setup)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) CHECK (role IN ('admin', 'owner', 'tenant')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Properties Table
CREATE TABLE properties (
  property_id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  rooms INT NOT NULL,
  bathrooms INT NOT NULL,
  property_type VARCHAR(10) CHECK (property_type IN ('House', 'Flat')) NOT NULL,
  status VARCHAR(15) DEFAULT 'Available' CHECK (status IN ('Available', 'Rented')),
  approval_status VARCHAR(15) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  contact_info VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Property Images Table
CREATE TABLE property_images (
  image_id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
  image_path VARCHAR(255) NOT NULL
);

-- 4. Inquiries Table
CREATE TABLE inquiries (
  inquiry_id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
  tenant_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  inquiry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Favorites Table
CREATE TABLE favorites (
  favorite_id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
  UNIQUE(tenant_id, property_id)
);
