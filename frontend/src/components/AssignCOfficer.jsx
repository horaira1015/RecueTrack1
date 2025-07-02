import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AssignCOfficer() {
  const { officerId } = useParams();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState("");
  const [assignedOfficers, setAssignedOfficers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all camps
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await axios.get("http://localhost:5553/api/campreg/getCamp");
        setCamps(response.data);
      } catch (err) {
        setError("Failed to fetch camps. Try again later.");
      
      }
    };

    const fetchAssignedOfficers = async () => {
      try {
        const response = await axios.get("http://localhost:5553/api/assigncofficer/getAssignedOfficers");
        setAssignedOfficers(response.data);
      } catch (err) {
        // setError("Failed to fetch assigned officers. Try again later.");
      }
    };

    fetchCamps();
    fetchAssignedOfficers();
  }, []);

  // Handle form submission
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCamp) return setError("Please select a camp.");

    setError(""); // Clear previous errors

    try {
      await axios.put(`http://localhost:5553/api/assigncofficer/assign/${officerId}`, { campId: selectedCamp });

      setSuccessMessage("Officer assigned to camp successfully!");
      
      // Fetch updated assigned officers list
      const updatedOfficers = await axios.get("http://localhost:5553/api/assigncofficer/getAssignedCamp");
      setAssignedOfficers(updatedOfficers.data);

      // Clear success message and navigate after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/viewcampofficer");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign officer. Try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Assign Camp Officer to a Camp</h3>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleAssign}>
        <Form.Group className="mb-3">
          <Form.Label>Select Camp</Form.Label>
          <Form.Select value={selectedCamp} onChange={(e) => setSelectedCamp(e.target.value)}>
            <option value="">-- Select a Camp --</option>
            {camps.map((camp) => (
              <option key={camp._id} value={camp._id}>
                {camp.name} ({camp.place}, {camp.district})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Assign Officer
        </Button>
      </Form>

      {/* Assigned Officers Table */}
      <h4 className="mt-5">Assigned Camp Officers</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Officer Name</th>
            <th>Email</th>
            <th>Camp Name</th>
            <th>Place</th>
            <th>Assigned Date</th>
          </tr>
        </thead>
        <tbody>
          {assignedOfficers.length > 0 ? (
            assignedOfficers.map((officer, index) => (
              <tr key={officer._id}>
                <td>{index + 1}</td>
                <td>{officer.campOfficerId?.name || "N/A"}</td>
                <td>{officer.campOfficerId?.email || "N/A"}</td>
                <td>{officer.campId?.name || "N/A"}</td>
                <td>{officer.campId?.place || "N/A"}</td>
                <td>{new Date(officer.assignDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No assigned officers found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default AssignCOfficer;
