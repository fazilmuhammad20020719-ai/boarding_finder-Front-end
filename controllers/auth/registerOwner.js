const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../../db");

const registerOwner = async (req, res) => {
  try {
    const {
      name, email, phone, password, role,
      propertyName, propertyType, permitNumber, propertyAddress
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password and role are required." });
    }

    if (!propertyName || !propertyType || !permitNumber || !propertyAddress) {
      return res.status(400).json({ message: "Property name, type, permit number, and address are required for owners." });
    }

    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await query(
      `INSERT INTO users (
        name, email, phone, password_hash, raw_password, role,
        property_name, property_type, permit_number, property_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, name, email, phone, role, property_name, property_type, permit_number, property_address, created_at`,
      [name, email, phone, passwordHash, password, role, propertyName, propertyType, permitNumber, propertyAddress]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      message: "Owner account created successfully!",
      token,
      user,
    });
  } catch (err) {
    console.error("Register owner error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = registerOwner;
