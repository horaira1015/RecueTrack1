import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoNavbar from "./CoNavbar";

function CampOfficerVolunteers() {
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [approvedVolunteers, setApprovedVolunteers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingVolunteers();
    fetchApprovedVolunteers();
  }, []);

  const fetchPendingVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/volunteer/pending");
      setPendingVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching pending volunteers:", error);
    }
  };

  const fetchApprovedVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/volunteer/approved");
      setApprovedVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching approved volunteers:", error);
    }
  };

  const handleApprove = async (volunteerId) => {
    try {
      await axios.post(`http://localhost:5553/api/volunteer/approve/${volunteerId}`);
      alert("Volunteer Approved!");
      fetchPendingVolunteers();
      fetchApprovedVolunteers();
    } catch (error) {
      console.error("Error approving volunteer:", error);
    }
  };

  const handleReject = async (volunteerId) => {
    try {
      await axios.post(`http://localhost:5553/api/volunteer/reject/${volunteerId}`);
      alert("Volunteer Rejected!");
      fetchPendingVolunteers();
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
    }
  };

  return (
    <>
      <CoNavbar />

      <Container style={{ marginTop: "30px" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", color: "#2c3e50", textTransform: "uppercase", marginBottom: "20px" }}>
          Manage Volunteers
        </h2>

        {/* Pending Volunteers Section */}
        <div style={{ backgroundColor: "#f9f3e7", border: "5px solid #f39c12", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
          <h3 style={{ textAlign: "center", fontSize: "24px", color: "#333", marginBottom: "15px" }}>Pending Volunteers</h3>
          <Row>
            {pendingVolunteers.length > 0 ? (
              pendingVolunteers.map((volunteer) => (
                <Col md={6} key={volunteer._id}>
                  <Card
                    style={{
                      borderRadius: "10px",
                      border: "none",
                      transition: "all 0.3s ease-in-out",
                      boxShadow: "0px 4px 6px rgba(120, 37, 37, 0.1)",
                      marginBottom: "15px",
                    }}
                  >
                    <Card.Body>
                      <h5 style={{ fontSize: "20px", fontWeight: "bold", color: "#2c3e50" }}>{volunteer.name}</h5>
                      <p><strong>Email:</strong> {volunteer.email}</p>
                      <p><strong>Skills:</strong> {volunteer.skills}</p>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="success" onClick={() => handleApprove(volunteer._id)}>Approve</Button>
                        <Button variant="danger" onClick={() => handleReject(volunteer._id)}>Reject</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>No pending volunteers.</p>
            )}
          </Row>
        </div>

        {/* Approved Volunteers Section */}
        <div style={{ backgroundColor: "#e8f6f3", border: "5px solid #27ae60", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
          <h3 style={{ textAlign: "center", fontSize: "24px", color: "#333", marginBottom: "15px" }}>Approved Volunteers</h3>
          <Row>
            {approvedVolunteers.length > 0 ? (
              approvedVolunteers.map((volunteer) => (
                <Col md={6} key={volunteer._id}>
                  <Card
                    style={{
                      borderRadius: "10px",
                      border: "none",
                      transition: "all 0.3s ease-in-out",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      marginBottom: "15px",
                      backgroundColor: "#eafaf1",
                      borderLeft: "4px solid #2ecc71",
                    }}
                  >
                    <Card.Body>
                      <h5 style={{ fontSize: "20px", fontWeight: "bold", color: "#2c3e50" }}>{volunteer.name}</h5>
                      <p><strong>Email:</strong> {volunteer.email}</p>
                      <p><strong>Skills:</strong> {volunteer.skills}</p>
                      <p><strong>Camp:</strong> {volunteer.campId?.name || "Unknown"}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>No approved volunteers found.</p>
            )}
          </Row>
        </div>

        <Button
          variant="secondary"
          style={{
            display: "block",
            margin: "20px auto",
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            backgroundColor: "#34495e",
            border: "none",
            color: "white",
            transition: "0.3s ease-in-out",
          }}
          onClick={() => navigate("/COfficerDashboard")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2c3e50")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#34495e")}
        >
          Back to Dashboard
        </Button>
      </Container>
    </>
  );
}

export default CampOfficerVolunteers;
