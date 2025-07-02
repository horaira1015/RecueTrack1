const CampModel = require("../Models/ManageCampModel");

// Create a new camp
const createCamp = async (req, res) => {
    try {
        const { name, address, district, place, pincode, totalCapacity, status } = req.body;

        // Check if camp already exists
        const existingCamp = await CampModel.findOne({ name, address, district, place, pincode });

        if (existingCamp) {
            return res.status(409).json({ error: "Camp with these details already exists." });
        }

        // Create new camp
        const newCamp = await CampModel.create({
            name,
            address,
            district,
            place,
            pincode,
            totalCapacity,
            status: status || "Inactive"
        });

        res.status(201).json({ message: "Camp registered successfully!", camp: newCamp });

    } catch (error) {
        console.error("Error in createCamp:", error);
        res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

// Get all camps
const getCamps = async (req, res) => {
    try {
        const camps = await CampModel.find();
        res.status(200).json(camps);
    } catch (error) {
        console.error("Error fetching camps:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a camp
const updateCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedCamp = await CampModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCamp) {
            return res.status(404).json({ error: "Camp not found" });
        }

        res.status(200).json({ message: "Camp updated successfully!", camp: updatedCamp });

    } catch (error) {
        console.error("Error updating camp:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a camp
const deleteCamp = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCamp = await CampModel.findByIdAndDelete(id);

        if (!deletedCamp) {
            return res.status(404).json({ error: "Camp not found" });
        }

        res.status(200).json({ message: "Camp deleted successfully!" });

    } catch (error) {
        console.error("Error deleting camp:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createCamp, getCamps, updateCamp, deleteCamp };
