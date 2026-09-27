const { query } = require("../db");

const initDb = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id              SERIAL PRIMARY KEY,
        name            VARCHAR(100) NOT NULL,
        email           VARCHAR(255) UNIQUE NOT NULL,
        phone           VARCHAR(20),
        password_hash   VARCHAR(255) NOT NULL,
        role            VARCHAR(20) NOT NULL CHECK (role IN ('student', 'owner')),

        -- Student-specific fields
        university      VARCHAR(200),
        course          VARCHAR(200),
        student_id      VARCHAR(50),

        -- Owner-specific fields
        property_name    VARCHAR(200),
        property_type    VARCHAR(50),
        permit_number    VARCHAR(100),
        property_address TEXT,

        created_at      TIMESTAMP DEFAULT NOW(),
        updated_at      TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("❌ Failed to initialize database tables:", err.message);
    throw err;
  }
};

module.exports = initDb;
