const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { createListing } = require("../controllers/listings/createListing");
const { getAllListings } = require("../controllers/listings/getAllListings");
const { getListingById } = require("../controllers/listings/getListingById");
const { updateListing } = require("../controllers/listings/updateListing");
const { deleteListing } = require("../controllers/listings/deleteListing");
const { getMyListings } = require("../controllers/listings/getMyListings");

// Public routes
router.get("/", getAllListings);

// Protected routes (Owner only)
router.get("/owner/mine", auth, getMyListings);

// Public route for specific ID
router.get("/:id", getListingById);

// Protected routes (Owner only)
router.post("/", auth, createListing);
router.put("/:id", auth, updateListing);
router.delete("/:id", auth, deleteListing);

module.exports = router;
