const Item = require("../Models/ItemRegModel");

// Register a new item
const registerItem = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // ✅ Log request body

    const { categoryId, addDate, campId, totalQuantity, description } = req.body;

    if (!categoryId || !campId || !addDate || !totalQuantity || !description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newItem = new Item({
      categoryId,
      addDate,
      campId,
      totalQuantity,
      description,
    });

    await newItem.save();
    res.status(201).json({ message: "Item Registered Successfully", item: newItem });
  } catch (error) {
    console.error("🚨 Error registering item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Get all registered items
const getItems = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!campId) {
      return res.status(400).json({ error: "Camp ID is required!" });
    }

    const items = await Item.find({ campId }).populate("categoryId", "name");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getItemsByCategory = async (req, res) => {
  try {
      const categoryId = req.params.categoryId; // Get category ID from request
      const items = await Item.find({ categoryId }).populate("categoryId", "name");

      if (!items.length) {
          return res.status(404).json({ message: "No items found for this category" });
      }

      res.json(items);
  } catch (error) {
      console.error("Error fetching items by category:", error);
      res.status(500).json({ message: "Server error" });
  }
};
const getItemsByCategoryAndCamp = async (req, res) => {
  try {
    const { categoryId, campId } = req.params; // Get category and camp ID from request

    if (!categoryId || !campId) {
      return res.status(400).json({ message: "Category ID and Camp ID are required" });
    }

    // Fetch items that match both category and camp
    const items = await Item.find({ categoryId, campId }).populate("categoryId", "name");

    console.log("Filtering items with: ", { categoryId, campId });


    if (!items.length) {
      return res.status(404).json({ message: "No items found for this category in the specified camp" });
    }

    res.json(items);
  } catch (error) {
    console.error("Error fetching items by category and camp:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getItemsGroupedByCategory = async (req, res) => {
  try {
    const items = await Item.aggregate([
      {
        $group: {
          _id: "$categoryId",
          totalQuantity: { $sum: "$totalQuantity" },
          totalAssigned: { $sum: "$assignedQuantity" }
        }
      },
      {
        $lookup: {
          from: "tbl_categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $unwind: "$categoryDetails"
      },
      {
        $project: {
          categoryName: "$categoryDetails.name",
          totalQuantity: 1,
          totalAssigned: 1,
          availableQuantity: { $subtract: ["$totalQuantity", "$totalAssigned"] }
        }
      }
    ]);

    res.json(items);
  } catch (error) {
    console.error("Error grouping items by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllItemDetails = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("categoryId", "name description")
      .populate("campId", "name"); // Assuming camp model has a `name` field

    const result = items.map(item => ({
      categoryName: item.categoryId.name,
      description: item.description,
      campName: item.campId.name,
      totalQuantity: item.totalQuantity,
      usedQuantity: item.usedQuantity,
      availableQuantity: item.totalQuantity - item.usedQuantity
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching item details:", error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { registerItem,getAllItemDetails, getItems, getItemsByCategoryAndCamp,getItemsByCategory ,getItemsGroupedByCategory};



