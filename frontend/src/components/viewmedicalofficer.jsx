import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbarr from "./Navbarr";

function ViewMedicalOfficer() {
  const [medicalOfficers, setMedicalOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editOfficerId, setEditOfficerId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  // Fetch all medical officers
  const fetchMedicalOfficers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5553/api/medicaloffReg/get");
      setMedicalOfficers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch medical officers. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a medical officer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medical officer?")) return;

    try {
      await axios.delete(`http://localhost:5553/api/medicaloffReg/delete/${id}`);
      setSuccessMessage("Medical officer deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchMedicalOfficers(); // Refresh list after deletion
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete medical officer. Try again later.");
    }
  };

  // Enable edit mode for a specific medical officer
  const handleEdit = (officer) => {
    setEditOfficerId(officer._id);
    setEditedData({ ...officer }); // Store existing details in state
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5553/api/medicaloffReg/update/${editOfficerId}`, editedData);
      setSuccessMessage("Medical officer details updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditOfficerId(null); // Exit edit mode
      fetchMedicalOfficers(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update medical officer details. Try again later.");
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditOfficerId(null);
    setEditedData({});
  };

  useEffect(() => {
    fetchMedicalOfficers();
  }, []);

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h3 className="text-center">Medical Officers List</h3>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Specialization</th> {/* ✅ Added Specialization Column */}
                <th>ID Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalOfficers.length > 0 ? (
                medicalOfficers.map((officer, index) => (
                  <tr key={officer._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editOfficerId === officer._id ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={editedData.name || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        officer.name
                      )}
                    </td>
                    <td>
                      {editOfficerId === officer._id ? (
                        <Form.Control
                          type="email"
                          name="email"
                          value={editedData.email || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        officer.email
                      )}
                    </td>
                    <td>
                      {editOfficerId === officer._id ? (
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={editedData.phone || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        officer.phone
                      )}
                    </td>
                    <td>
                      {editOfficerId === officer._id ? (
                        <Form.Control
                          type="text"
                          name="address"
                          value={editedData.address || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        officer.address
                      )}
                    </td>

                    {/* ✅ Specialization Field with Dropdown */}
                    <td>
                      {editOfficerId === officer._id ? (
                        <Form.Control
                          as="select"
                          name="specialization"
                          value={editedData.specialization || ""}
                          onChange={handleInputChange}
                        >
                          <option value="General Medicine">General Medicine</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Surgery">Surgery</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Others">Others</option>
                        </Form.Control>
                      ) : (
                        officer.specialization
                      )}
                    </td>

                    <td>
                      <a href={`http://localhost:5553/${officer.idProof}`} target="_blank" rel="noopener noreferrer">
                        View ID
                      </a>
                    </td>
                    <td>
                      {editOfficerId === officer._id ? (
                        <>
                         
                          <Button variant="success" size="sm" onClick={handleSaveChanges}>
                            Save
                          </Button>
                          <Button variant="secondary" size="sm" onClick={handleCancelEdit} className="ms-2">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                        <Button variant="info" size="sm" onClick={() => navigate(`/assignmofficer/${officer._id}`)}>
                        Assign to Camp
                      </Button>
                          <Button variant="warning" size="sm" onClick={() => handleEdit(officer)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(officer._id)} className="ms-2">
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No medical officers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}

export default ViewMedicalOfficer;