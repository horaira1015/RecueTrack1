const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_items", required: true },
    campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_category", required: true }, // 🔹 Category reference
    // quantity: { type: Number, required: true },
    status: { type: String, enum: ["Available", "Low Stock", "Out of Stock"], default: "Available" },
    // dateAdded: { type: Date, default: Date.now }
});

const Inventory = mongoose.model("tbl_inventory", InventorySchema);
module.exports = Inventory;
