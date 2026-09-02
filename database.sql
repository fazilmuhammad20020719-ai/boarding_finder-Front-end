-- =============================================
-- BoardingFinder — Full Database Setup
-- Run with: sudo -u postgres psql -f database.sql
-- =============================================

-- 1. Create the database user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_user') THEN
    CREATE ROLE admin_user WITH LOGIN PASSWORD 'Boarding@123';
  END IF;
END
$$;

-- 2. Create the database
SELECT 'CREATE DATABASE boarding_db OWNER admin_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'boarding_db')\gexec

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE boarding_db TO admin_user;

-- 4. Connect to the new database to create tables
\c boarding_db

-- 5. Grant schema privileges (required for PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO admin_user;

-- =============================================
-- TABLES
-- =============================================

-- 6. Users table (students + owners + admins)
CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  phone             VARCHAR(20),
  password_hash     VARCHAR(255) NOT NULL,
  raw_password      VARCHAR(255), -- For development purposes only
  role              VARCHAR(20) NOT NULL CHECK (role IN ('student', 'owner', 'admin')),

  -- Student-specific fields
  university        VARCHAR(200),
  course            VARCHAR(200),
  student_id        VARCHAR(50),

  -- Owner-specific fields
  property_name     VARCHAR(200),
  property_type     VARCHAR(50),
  permit_number     VARCHAR(100),
  property_address  TEXT,

  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- 7. Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- 8. Set ownership so admin_user can manage the table
ALTER TABLE users OWNER TO admin_user;

-- 9. Listings table
CREATE TABLE IF NOT EXISTS listings (
  listing_id        SERIAL PRIMARY KEY,
  owner_id          INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(255) NOT NULL,
  description       TEXT NOT NULL,
  price             NUMERIC(10, 2) NOT NULL,
  location          VARCHAR(255) NOT NULL,
  amenities         TEXT,
  image_urls        TEXT[],
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- 10. Indexes for listings
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);

-- 11. Set ownership for listings
ALTER TABLE listings OWNER TO admin_user;

-- Done!
SELECT '✅ Database setup complete!' AS status;
