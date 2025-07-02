const Victim = require("../Models/VictimModel");
const CampOfficer = require("../Models/CofficerRegModel");
const AssignCampOfficer = require("../Models/AssignCofficerModel");
const CampAid = require("../Models/CampRegModel");
const mongoose = require("mongoose");

// 📌 Register a new victim and update camp's filled count
const registerVictim = async (req, res) => {
  try {
    const { campId, familyMembers, familyDetails } = req.body; 

    // Ensure `familyDetails` is an array if familyMembers > 0
    const formattedFamilyDetails = familyMembers > 0 && Array.isArray(familyDetails) ? familyDetails : [];

    // Check if the camp exists
    const camp = await CampAid.findById(campId);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    // Register victim
    const victim = new Victim({
      ...req.body,
      familyDetails: formattedFamilyDetails,  // Store family info properly
    });

    await victim.save();

    // Update the filled count in the camp
    const totalNewEntries = 1 + formattedFamilyDetails.length;  // Victim + family members
    camp.filled += totalNewEntries;
    await camp.save();

    res.status(201).json({ message: "Victim registered successfully", victim });
  } catch (error) {
    console.error("Error registering victim:", error);
    res.status(500).json({ message: "Error registering victim", error });
  }
};




// 📌 Get all victims with camp details
const getVictims = async (req, res) => {
  try {
    const victims = await Victim.find();
    let allVictims = [];

    victims.forEach((victim) => {
      // Add main victim
      allVictims.push({
        _id: victim._id,
        name: victim.name,
        age: victim.age,
        healthStatus: victim.healthStatus,
        isFamilyMember: false, // Indicates it's a primary victim
      });

      // Add each family member as a separate record
      victim.familyDetails.forEach((familyMember) => {
        allVictims.push({
          _id: `${victim._id}-${familyMember.name}`, // Unique ID using victim ID + name
          name: familyMember.name,
          age: familyMember.age,
          healthStatus: familyMember.healthStatus,
          isFamilyMember: true, // Indicates it's a family member
          primaryVictim: victim.name, // Reference to primary victim
        });
      });
    });

    res.status(200).json(allVictims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching victims", error });
  }
};

// 📌 Get a single victim by ID
const getVictimById = async (req, res) => {
  try {
    const victim = await Victim.findById(req.params.id).populate("campId", "name place district");
    if (!victim) return res.status(404).json({ message: "Victim not found" });
    res.status(200).json(victim);
  } catch (error) {
    res.status(500).json({ message: "Error fetching victim", error });
  }
};

// 📌 Update victim details (Does NOT update filled count)
const updateVictim = async (req, res) => {
  try {
    const victimId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(victimId)) {
      return res.status(400).json({ message: "Invalid Victim ID format" });
    }

    const updatedVictim = await Victim.findByIdAndUpdate(
      victimId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedVictim) {
      return res.status(404).json({ message: "Victim not found" });
    }

    res.status(200).json({ message: "Victim updated successfully", updatedVictim });
  } catch (error) {
    res.status(500).json({ message: "Error updating victim", error });
  }
};

// 📌 Delete victim and update camp's filled count
const deleteVictim = async (req, res) => {
  try {
    const victim = await Victim.findById(req.params.id);
    if (!victim) return res.status(404).json({ message: "Victim not found" });

    // Remove victim from DB
    await Victim.findByIdAndDelete(req.params.id);

    // Update filled count in the camp
    await CampAid.findByIdAndUpdate(victim.campId, { $inc: { filled: -(1 + (victim.familyMembers || 0)) } });

    res.status(200).json({ message: "Victim deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting victim", error });
  }
};



// 📌 Get victims assigned to a camp officer's camp
const getVictimsByCamp = async (req, res) => {
  try {
    const { officerId } = req.params;
    if (!officerId) return res.status(400).json({ message: "Officer ID is required" });

    // ✅ Find campId for the officer
    const assignment = await AssignCampOfficer.findOne({ campOfficerId: officerId });
    if (!assignment || !assignment.campId) {
      return res.status(404).json({ message: "No camp assigned to this officer" });
    }

    // ✅ Fetch victims in that camp
    const victims = await Victim.find({ campId: assignment.campId });

    //Count health status
    const stats = { stable: 0, injured: 0, critical: 0 };
    victims.forEach(victim => {
      if (victim.healthStatus === "Stable") stats.stable++;
      else if (victim.healthStatus === "Injured") stats.injured++;
      else if (victim.healthStatus === "Critical") stats.critical++;
    
    // Count health status of family members
    victim.familyDetails.forEach(member => {
      if (member.healthStatus === "Stable") stats.stable++;
      else if (member.healthStatus === "Injured") stats.injured++;
      else if (member.healthStatus === "Critical") stats.critical++;
    });
  });


    res.status(200).json(victims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching victims", error: error.message });
  }
};


const getVictimStatsByCamp = async (req, res) => {
  try {
    const { officerId } = req.params;
    if (!officerId) return res.status(400).json({ message: "Officer ID is required" });

    // ✅ Find the officer's assigned camp
    const assignment = await AssignCampOfficer.findOne({ campOfficerId: officerId });
    if (!assignment || !assignment.campId) {
      return res.status(404).json({ message: "No camp assigned to this officer" });
    }

    console.log("API Hit: Fetching Victim Stats for Officer ID:", req.params.officerId);


    // ✅ Fetch all victims in the assigned camp
    const victims = await Victim.find({ campId: assignment.campId });

    // ✅ Initialize health status counters
    const stats = { Stable: 0, Injured: 0, Critical: 0 };

    // ✅ Count victims' health statuses
    victims.forEach((victim) => {
      if (victim.healthStatus === "Stable") stats.Stable++;
      else if (victim.healthStatus === "Injured") stats.Injured++;
      else if (victim.healthStatus === "Critical") stats.Critical++;

      // ✅ Count family members' health statuses
      victim.familyDetails.forEach((member) => {
        if (member.healthStatus === "Stable") stats.Stable++;
        else if (member.healthStatus === "Injured") stats.Injured++;
        else if (member.healthStatus === "Critical") stats.Critical++;
      });
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching victim statistics", error: error.message });
  }
};


const getHealthStatusCounts = async (req, res) => {

  try {

    const { campId } = req.params;



    const victims = await Victim.find({ campId });

    let stable = 0, injured = 0, critical = 0;



    for (const victim of victims) {

      const status = victim.healthStatus;

      if (status === "Stable") stable++;

      else if (status === "Injured") injured++;

      else if (status === "Critical") critical++;



      if (victim.familyDetails && Array.isArray(victim.familyDetails)) {

        for (const member of victim.familyDetails) {

          const memberStatus = member.healthStatus;

          if (memberStatus === "Stable") stable++;

          else if (memberStatus === "Injured") injured++;

          else if (memberStatus === "Critical") critical++;

        }

      }

    }



    res.json({ stable, injured, critical });

  } catch (error) {

    console.error("Error fetching health status counts:", error);

    res.status(500).json({ message: "Server error" });

  }

};

// 📌 Update health status of a specific family member
const updateFamilyMemberHealthStatus = async (req, res) => {
  const { memberId } = req.params;
  const { healthStatus } = req.body;

  try {
    const [victimId, memberName] = memberId.split("-");

    const victim = await Victim.findById(victimId);
    if (!victim) return res.status(404).json({ message: "Victim not found" });

    const familyMember = victim.familyDetails.find(m => m.name === memberName);
    if (!familyMember) return res.status(404).json({ message: "Family member not found" });

    familyMember.healthStatus = healthStatus;
    await victim.save();

    res.status(200).json({ message: "Family member health status updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating family member health", error });
  }
};
const getAllVictimsWithCampDetails = async (req, res) => {
  try {
    const victims = await Victim.find()
      .populate("campId", "name")
      .lean();

    res.status(200).json(victims);
  } catch (error) {
    console.error("Error fetching victims overview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





module.exports = { registerVictim, getVictims, getVictimById,getAllVictimsWithCampDetails, updateVictim, deleteVictim, getVictimsByCamp,getVictimStatsByCamp,getHealthStatusCounts,updateFamilyMemberHealthStatus};
