const MedicalRequest = require("../Models/MedicalRequestModel");
const mongoose = require("mongoose");

// Submit a new supply request
const submitMRequest = async (req, res) => {
  try {
    const { campId, mOfficerId, itemId, quantity } = req.body;

    if (!campId || !mOfficerId || !itemId || !quantity) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newRequest = new MedicalRequest({ campId, mOfficerId, itemId, quantity });
    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully", request: newRequest });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all requests (for admin)
const getAllMRequests = async (req, res) => {
  try {
    const requests = await MedicalRequest.find()
  .populate("campId", "name")  
  .populate("mOfficerId", "name")  
  .populate("itemId", "description");  

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Approve or Reject request
const updateMRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log("Received update request for:", requestId); // Debugging log

    const { status, reason } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update!" });
    }

    const updateData = { status };
    if (status === "Rejected") {
      updateData.rejectionReason = reason || "No reason provided";
    }

    const existingRequest = await MedicalRequest.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ error: "Request not found!" });
    }

    const updatedRequest = await MedicalRequest.findByIdAndUpdate(requestId, updateData, { new: true });

    console.log("Updated request:", updatedRequest);
    res.status(200).json({ message: "Request status updated", request: updatedRequest });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { submitMRequest, getAllMRequests, updateMRequestStatus };
