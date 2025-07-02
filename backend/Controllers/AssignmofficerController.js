const AssignMedicalOfficer = require("../Models/AssignMofficerModel");
const MedicalOfficer = require("../Models/MofficerRegModel");
// const AssignCOfficerModel = require("../Models/AssignCofficerModel");
const CampAid = require("../Models/CampRegModel");
const victim = require("../Models/VictimModel")

const assignMedicalOfficer = async (req, res) => {
    try {
        const { MOfficerId, campId } = req.body;
        console.log("Received MOfficerId:", MOfficerId);  // Debugging log
        console.log("Received campId:", campId);

        if (!MOfficerId) {
            return res.status(400).json({ error: "MOfficerId is missing in request" });
        }


        if (!campId) {
            return res.status(400).json({ error: "Camp ID is missing in request" });
        }

        // Check if officer exists
        const officerExists = await MedicalOfficer.findById(MOfficerId);
        if (!officerExists) {
            return res.status(404).json({ message: "Medical Officer not found." });
        }

        // Check if camp exists
        const campExists = await CampAid.findById(campId);
        if (!campExists) {
            return res.status(404).json({ message: "Camp not found." });
        }

        // Check if assignment already exists
        const existingAssignment = await AssignMedicalOfficer.findOne({ medicalOfficerId: MOfficerId });
        if (existingAssignment) {
            return res.status(400).json({ message: "Officer is already assigned to a camp." });
        }

        const newAssignment = new AssignMedicalOfficer({
            MOfficerId,
            campId,
            assignDate: new Date() // Ensure assignDate is set
        });


        await newAssignment.save();
        res.status(201).json({ message: "Medical officer assigned successfully." });

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



