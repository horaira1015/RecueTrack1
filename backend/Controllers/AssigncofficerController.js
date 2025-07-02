const AssignCampOfficer = require("../Models/AssignCofficerModel");
const CampOfficer = require("../Models/CofficerRegModel");
// const AssignCOfficerModel = require("../Models/AssignCofficerModel");
const CampAid= require("../Models/CampRegModel");
const victim = require("../Models/VictimModel")

const assignCampOfficer = async (req, res) => {
    try {
        const { officerId } = req.params; // Extract from params
        const { campId } = req.body; // Extract from body

        console.log("Received officerId:", officerId);
        console.log("Received campId:", campId);


        if (!officerId || !campId) {
            return res.status(400).json({ message: "Officer ID and Camp ID are required." });
        }

        // Check if officer exists
        const officerExists = await CampOfficer.findById(officerId);
        if (!officerExists) {
            return res.status(404).json({ message: "Camp Officer not found." });
        }

        // Check if camp exists
        const campExists = await CampAid.findById(campId);
        if (!campExists) {
            return res.status(404).json({ message: "Camp not found." });
        }

        // Check if assignment already exists
        const existingAssignment = await AssignCampOfficer.findOne({ campOfficerId: officerId });
        if (existingAssignment) {
            return res.status(400).json({ message: "Officer is already assigned to a camp." });
        }

        const assignment = new AssignCampOfficer({
            campOfficerId: officerId,
            campId: campId,
            assignDate: new Date()
        });

        await assignment.save();
        res.status(200).json({ message: "Camp officer assigned successfully!" });

    } catch (error) {
        console.error("Error while assigning officer:", error);
        res.status(500).json({ message: "Server error while assigning officer.", error });
    }
};


const getAssignedCampForOfficer = async (req, res) => {
    try {
        const { officerId } = req.params; // Extract Officer ID

        if (!officerId) {
            return res.status(400).json({ message: "Officer ID is required." });
        }
        const officer = await CampOfficer.findById(officerId);
        if (!officer) {
            return res.status(404).json({ message: "Camp Officer not found." });
        }

        const assignedCamp = await AssignCampOfficer.findOne({ campOfficerId: officerId })
            .populate("campId", "name place district status totalCapacity filled availableSpace"); // Fetch camp details including capacity

        if (!assignedCamp) {
            return res.status(404).json({ message: "No assigned camp found for this officer." });
        }

        const camp = assignedCamp.campId;

        if (!camp) {
            console.error("Camp ID is missing in the assignedCamp object:", assignedCamp);
            return res.status(500).json({ message: "Camp details not found for this officer." });
        }
        
        // Count registered victims in this camp
        let filled = 0;
const victims = await victim.find({ campId: camp._id });

victims.forEach(victimDoc => {
  filled += 1; // Count the victim themselves
  if (victimDoc.familyMembers) {
    filled += victimDoc.familyMembers;
  }
});

console.log(officer);
        
        // Calculate available space
        const availableSpace = Math.max(camp.totalCapacity - filled, 0);

        res.status(200).json({
            officer:officer.name,
            name: camp.name,
            place: camp.place,
            district: camp.district,
            status: camp.status,
            totalCapacity: camp.totalCapacity,
            filled: filled,
            availableSpace: availableSpace,
            campId: camp._id,
        });

    } catch (error) {
        console.error("Error fetching assigned camp:", error);
        res.status(500).json({ message: "Error fetching assigned camp", error });
    }
};

const getAllAssignedCampOfficers = async (req, res) => {
    try {
        const assigned = await AssignCampOfficer.find()
            .populate("campOfficerId", "name email") // Make sure these fields exist in tbl_medical_officer
            .populate("campId", "name place district");

        res.status(200).json(assigned);
    } catch (error) {
        console.error("Error fetching assigned officers:", error);
        res.status(500).json({ message: "Failed to fetch assigned officers" });
    }
};

module.exports = { assignCampOfficer, getAllAssignedCampOfficers,getAssignedCampForOfficer };



