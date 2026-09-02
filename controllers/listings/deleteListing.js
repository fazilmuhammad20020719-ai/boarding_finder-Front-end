const { query } = require("../../db");

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;

    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can delete listings." });
    }

    // Verify ownership
    const checkSql = "SELECT owner_id FROM listings WHERE listing_id = $1";
    const checkResult = await query(checkSql, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (checkResult.rows[0].owner_id !== owner_id) {
      return res.status(403).json({ message: "You are not authorized to delete this listing." });
    }

    const sql = "DELETE FROM listings WHERE listing_id = $1";
    await query(sql, [id]);

    return res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting listing:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { deleteListing };
