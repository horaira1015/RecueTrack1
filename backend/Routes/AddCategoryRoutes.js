const express = require("express");
const router = express.Router();
const { addCategory, getCategories } = require("../Controllers/AddCategoryController");

// Route to add a category
router.post("/addCategory", addCategory);

// Route to get all categories
router.get("/getCategories", getCategories);

module.exports = router;
