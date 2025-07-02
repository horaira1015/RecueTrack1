const CampAid = require("../Models/CampRegModel");

const createCamp = async (req, res) => {
  try {
    const { name, address, district, place, pincode, totalCapacity } = req.body;


    // Check if a camp with the same details already exists
    const existingCamp = await CampAid.findOne({ name, address, district, place, pincode });

    if (existingCamp) {
      return res.status(409).json({ error: "Camp with these details already exists." });
    }

    // Create a new camp record
    const newCamp = await CampAid.create({ name, address, district, place, pincode, totalCapacity, status: "Inactive" });
    res.status(201).json({ message: "Camp registered successfully!", camp: newCamp });
  } catch (error) {
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

const getCamp = async (req, res) => {
  try {

    const testCamp = await CampAid.findOne();
    
    if (testCamp) {
      console.log("Test Camp with Virtuals:", testCamp.toObject({ virtuals: true }));
    } else {
      console.log("No camp found in the database.");
    }

    const camps = await CampAid.find(); // Don't use .lean()
    
    // Convert each camp to an object to ensure virtuals are included
    const updatedCamps = camps.map(camp => camp.toObject({ virtuals: true }));

    console.log("Fetched Camp Data:", updatedCamps[0]); // ✅ Check if virtuals are present
    res.status(200).json(updatedCamps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching camps", error });
  }
};








module.exports = { createCamp, getCamp };