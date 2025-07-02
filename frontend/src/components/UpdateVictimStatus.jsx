import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Row, Col, Modal } from "react-bootstrap";
import CoNavbar from "./CoNavbar";

function UpdateVictimStatus() {
  const [victims, setVictims] = useState([]);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");  // ✅ Contact field
  const [address, setAddress] = useState("");  // ✅ Address field
  const [familyMembers, setFamilyMembers] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");

  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchVictims();
  }, []);

  // Fetch victims assigned to the logged-in officer's camp
  const fetchVictims = async () => {
    const officerId = localStorage.getItem("officerId");
    if (!officerId) {
      console.error("Officer ID not found!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5553/api/victims/getbycamp/${officerId}`);
      setVictims(response.data);
    } catch (error) {
      console.error("Error fetching victims:", error.response?.data || error.message);
    }
  };

  // Handle updating victim status
  const handleUpdateStatus = async () => {
    if (!selectedVictim || !status) {
      alert("Please select a victim and status.");
      return;
    }

    try {
      await axios.put(`http://localhost:5553/api/victims/update/${selectedVictim}`, { 
        healthStatus: status 
      });

      setMessage({ type: "success", text: "Victim status updated successfully!" });

      // Update UI immediately
      setVictims((prevVictims) =>
        prevVictims.map((victim) =>
          victim._id === selectedVictim ? { ...victim, healthStatus: status } : victim
        )
      );

      setStatus("");
    } catch (error) {
      console.error("Error updating victim:", error.response?.data || error.message);
      setMessage({ type: "danger", text: "Error updating victim status" });
    }
  };

  // Open edit modal
  const openEditModal = (victim) => {
    setSelectedVictim(victim._id);
    setName(victim.name);
    setAge(victim.age);
    setGender(victim.gender);
    setContact(victim.contact || "");   // ✅ Load contact
    setAddress(victim.address || "");   // ✅ Load address
    setFamilyMembers(victim.familyMembers || "");
    setSpecialNeeds(victim.specialNeeds || "");
    setShowEditModal(true);
  };

  // Handle update victim details
  const handleUpdateDetails = async () => {
    try {
      await axios.put(`http://localhost:5553/api/victims/update/${selectedVictim}`, {
        name,
        age,
        gender,
        contact,
        address,    // ✅ Send address field
        familyMembers,
        specialNeeds,
      });

      setMessage({ type: "success", text: "Victim details updated successfully!" });

      // Update UI instantly
      setVictims((prevVictims) =>
        prevVictims.map((victim) =>
          victim._id === selectedVictim ? { ...victim, name, age, gender } : victim
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating victim details:", error.response?.data || error.message);
      setMessage({ type: "danger", text: "Error updating victim details" });
    }
  };

  // Handle delete victim
  const handleDeleteVictim = async (id) => {
    if (!window.confirm("Are you sure you want to delete this victim?")) return;

    try {
      await axios.delete(`http://localhost:5553/api/victims/delete/${id}`);
      setMessage({ type: "success", text: "Victim deleted successfully!" });

      // Remove from UI instantly
      setVictims((prevVictims) => prevVictims.filter((victim) => victim._id !== id));
    } catch (error) {
      console.error("Error deleting victim:", error.response?.data || error.message);
      setMessage({ type: "danger", text: "Error deleting victim" });
    }
  };

  return (
    <>
      <CoNavbar />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Manage Victims</h2>

        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Row>
          {/* Victim List */}
          <Col md={6}>
            <h5>Victim List</h5>
            <div className="victim-list">
              {victims.map((victim) => (
                <Card key={victim._id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{victim.name}</strong> ({victim.age}, {victim.gender})
                        <br />
                        <small>Contact: {victim.contact || "N/A"}</small><br />
                        <small>Address: {victim.address || "N/A"}</small><br />
                        <small>Status: {victim.healthStatus || "Not Updated"}</small>
                      </div>
                      <div>
                        <span 
                          style={{ cursor: "pointer", color: "blue", marginRight: "10px" }}
                          onClick={() => openEditModal(victim)}
                        >
                          ✏️
                        </span>
                        <span 
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDeleteVictim(victim._id)}
                        >
                          ❌
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          

          {/* Status Update Form */}
          <Col md={6}>
            <h5>Update Status</h5>
            {selectedVictim ? (
              <Card className="p-3">
                <h6>
                  Victim: {victims.find((v) => v._id === selectedVictim)?.name || "Unknown"}
                </h6>
                <p>
                  <b>Current Status:</b> {victims.find((v) => v._id === selectedVictim)?.healthStatus || "Not Updated"}
                </p>

                <Form.Group>
                  <Form.Label>New Status</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose...</option>
                    <option value="Stable">Stable</option>
                    <option value="Injured">Injured</option>
                    <option value="Critical">Critical</option>
                    <option value="Deceased">Deceased</option>
                  </Form.Select>
                </Form.Group>

                <Button className="mt-3 w-100" variant="primary" onClick={handleUpdateStatus}>
                  Update Status
                </Button>
              </Card>
            ) : (
              <p className="text-muted">Select a victim to update status.</p>
            )}
          </Col>
        </Row>
      </Container>

      {/* Edit Victim Modal */}
      {/* Edit Victim Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Victim Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Control value={gender} onChange={(e) => setGender(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Family Members</Form.Label>
              <Form.Control value={familyMembers} onChange={(e) => setFamilyMembers(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Special Needs</Form.Label>
              <Form.Control value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateDetails}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateVictimStatus;
