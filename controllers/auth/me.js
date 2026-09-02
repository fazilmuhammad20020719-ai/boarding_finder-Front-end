const { query } = require("../../db");

const me = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, role,
              university, course, student_id,
              property_name, property_type, permit_number, property_address, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Get me error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = me;
