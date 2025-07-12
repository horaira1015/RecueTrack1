const AssignMedicalOfficer = require("../Models/AssignMofficerModel");
const MedicalOfficer = require("../Models/MofficerRegModel");
// const AssignCOfficerModel = require("../Models/AssignCofficerModel");
const CampAid = require("../Models/CampRegModel");
const victim = require("../Models/VictimModel")

const assignMedicalOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;
    const { campId } = req.body;

    console.log("Received MOfficerId:", officerId);
    console.log("Received campId:", campId);

    if (!officerId || !campId) {
      return res.status(400).json({ error: "Missing officerId or campId" });
    }

    // Check if officer and camp exist
    const officerExists = await MedicalOfficer.findById(officerId);
    if (!officerExists) {
      return res.status(404).json({ message: "Medical Officer not found." });
    }

    const campExists = await CampAid.findById(campId);
    if (!campExists) {
      return res.status(404).json({ message: "Camp not found." });
    }

    // Check for existing assignment
    const existingAssignment = await AssignMedicalOfficer.findOne({ MOfficerId: officerId });
    if (existingAssignment) {
      return res.status(400).json({ message: "Officer is already assigned to a camp." });
    }

    // 1️⃣ Save assignment in separate assignment collection
    const newAssignment = new AssignMedicalOfficer({
      MOfficerId: officerId,
      campId,
      assignDate: new Date()
    });
    await newAssignment.save();

    // 2️⃣ Update the camp's reference to this medical officer
    await CampAid.findByIdAndUpdate(
  campId,
  { $addToSet: { medicalOfficer: officerId } }, // ✅ Add without duplicates
  { new: true }
);


    res.status(201).json({ message: "Medical officer assigned and camp updated successfully." });

  } catch (error) {
    console.error("Error while assigning officer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const getAssignedMedicalForOfficer = async (req, res) => {
    try {
        const { MOfficerId } = req.params; // Fix parameter name

        if (!MOfficerId) {
            return res.status(400).json({ message: "Officer ID is required." });
        }

        const officer = await MedicalOfficer.findById(MOfficerId);
        if (!officer) {
            return res.status(404).json({ message: "Medical Officer not found." });
        }

        const assignedCamp = await AssignMedicalOfficer.findOne({ MOfficerId}) 

    .populate("campId", "name place district status filled");

        console.log("Assigned Camp Found:", assignedCamp); // Debugging

        if (!assignedCamp) {
            console.error("❌ No assigned camp found for this officer:", officerId);
            return res.status(404).json({ message: "No assigned camp found for this officer." });
        }


        const camp = assignedCamp.campId;

        let filled = 0;
        const victims = await victim.find({ campId: camp._id });

        victims.forEach(victimDoc => {
            filled += 1;
            if (victimDoc.familyMembers) {
                filled += victimDoc.familyMembers;
            }
        });

        res.status(200).json({
            officer: officer.name,  // ✅ Add this field
            name: camp.name,
            place: camp.place,
            district: camp.district,
            status: camp.status,
            filled: filled,
            campId: camp._id,
        });

    } catch (error) {
        console.error("Error fetching assigned camp:", error);
        res.status(500).json({ message: "Error fetching assigned camp", error });
    }
};

const getAllAssignedMedicalOfficers = async (req, res) => {
    try {
        const assigned = await AssignMedicalOfficer.find()
            .populate("MOfficerId", "name email") // Make sure these fields exist in tbl_medical_officer
            .populate("campId", "name place district");

        res.status(200).json(assigned);
    } catch (error) {
        console.error("Error fetching assigned officers:", error);
        res.status(500).json({ message: "Failed to fetch assigned officers" });
    }
};



module.exports = { assignMedicalOfficer,getAllAssignedMedicalOfficers, getAssignedMedicalForOfficer };



