const { query } = require("../../db");

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT l.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM listings l
      JOIN users u ON l.owner_id = u.id
      WHERE l.listing_id = $1;
    `;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json({
      listing: result.rows[0],
    });
  } catch (err) {
    console.error("Error fetching listing:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getListingById };
