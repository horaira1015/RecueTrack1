const Category = require("../Models/AddCategoryModel");

// Add a new category
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists!" });
        }

        // Save new category
        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { addCategory, getCategories };
