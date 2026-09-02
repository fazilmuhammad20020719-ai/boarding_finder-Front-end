const pool = require('./db');

async function run() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS raw_password VARCHAR(255);');
    console.log('Successfully added raw_password column to users table.');
  } catch (err) {
    console.error('Error adding column:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
