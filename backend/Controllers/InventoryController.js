const Inventory = require("../Models/InventoryModel");
const Item = require("../Models/ItemRegModel");
const CampAid=require("../Models/CampRegModel");
const mongoose=require("mongoose");


// Get inventory items assigned to a specific camp


const getInventoryByCamp = async (req, res) => {
    try {
        const { campId } = req.params;

        // Convert campId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(campId)) {
          return res.status(400).json({ error: "Invalid campId format" });
      }
        const inventory = await Inventory.find({ campId });

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ error: "Inventory not found" });
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};



// Update inventory status
const updateInventoryStatus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    if (!["Available", "Low Stock", "Out of Stock"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, { status }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating inventory status:", error);
    res.status(500).json({ message: "Failed to update inventory status" });
  }
};

module.exports = { getInventoryByCamp, updateInventoryStatus };
