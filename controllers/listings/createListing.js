const { query } = require("../../db");

const createListing = async (req, res) => {
  try {
    const { title, description, price, location, amenities, image_urls } = req.body;
    const owner_id = req.user.id;

    if (!title || !description || !price || !location) {
      return res.status(400).json({ message: "Please provide title, description, price, and location." });
    }

    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can create listings." });
    }

    const sql = `
      INSERT INTO listings (owner_id, title, description, price, location, amenities, image_urls)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      owner_id,
      title,
      description,
      price,
      location,
      amenities || null,
      image_urls || null,
    ];

    const result = await query(sql, values);

    return res.status(201).json({
      message: "Listing created successfully",
      listing: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating listing:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createListing };
