import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const leaderId = localStorage.getItem("leaderId");
  const [leader, setLeader] = useState(null);
  const [disaster, setDisaster] = useState(null);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMode, setAddMode] = useState(false);
  const [newCamp, setNewCamp] = useState({
    name: "",
    place: "",
    district: "",
    totalCapacity: ""
  });
  const [campMessage, setCampMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderRes = await axios.get(`http://localhost:5553/api/leaders/${leaderId}`);
        setLeader(leaderRes.data);

        const disasterRes = await axios.get(`http://localhost:5553/api/disasters/leader/${leaderId}`);
        setDisaster(disasterRes.data);

        if (disasterRes.data?._id) {
          const campsRes = await axios.get(`http://localhost:5553/api/camps/disaster/${disasterRes.data._id}`);
          setCamps(campsRes.data);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (leaderId) fetchData();
    else navigate("/LeaderLogin");
  }, [leaderId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCamp(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCamp = async () => {
    if (!newCamp.name || !newCamp.place || !newCamp.district || !newCamp.totalCapacity) {
      setCampMessage("❌ Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5553/api/camps/cr`, {
        ...newCamp,
        location: disaster.location,
        disaster: disaster._id,
        totalCapacity: Number(newCamp.totalCapacity)
      });

      setCampMessage("✅ Camp added successfully!");
      setNewCamp({ name: "", place: "", district: "", totalCapacity: "" });
      setAddMode(false);

      const updated = await axios.get(`http://localhost:5553/api/camps/disaster/${disaster._id}`);
      setCamps(updated.data);
    } catch (err) {
      console.error("Error adding camp:", err);
      setCampMessage(`❌ ${err.response?.data?.error || "Failed to add camp"}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("leaderId");
    navigate("/LeaderLogin");
  };

  const handleCampClick = (id) => navigate(`/campsdetails/${id}`);

  if (loading) return <div className="text-center p-5">Loading your dashboard...</div>;

  return (
    <div className="p-3" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container>
        <div className="text-center mb-4 bg-primary text-white py-3 rounded">
          <h2>Leader Dashboard</h2>
          <p>Welcome, {leader?.name}</p>
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow">
              <Card.Header className="bg-info text-white">Assigned Disaster</Card.Header>
              <Card.Body>
                {disaster ? (
                  <>
                    <p><strong>Name:</strong> {disaster.name}</p>
                    <p><strong>Location:</strong> {disaster.location}</p>
                    <p><strong>Date:</strong> {new Date(disaster.date).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {disaster.description}</p>
                  </>
                ) : <Alert variant="warning">No disaster assigned yet.</Alert>}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <span>Managed Camps</span>
                <Button variant="light" size="sm" onClick={() => {
                  setAddMode(!addMode);
                  setCampMessage("");
                }}>
                  {addMode ? "Cancel" : "➕ Add Camp"}
                </Button>
              </Card.Header>
              <Card.Body>
                {addMode && (
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Camp Name*</Form.Label>
                      <Form.Control name="name" value={newCamp.name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Place*</Form.Label>
                      <Form.Control name="place" value={newCamp.place} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>District*</Form.Label>
                      <Form.Control name="district" value={newCamp.district} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Total Capacity*</Form.Label>
                      <Form.Control type="number" name="totalCapacity" value={newCamp.totalCapacity} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Location (auto-filled)</Form.Label>
                      <Form.Control value={disaster?.location || ""} disabled />
                    </Form.Group>
                    <Button className="w-100" variant="primary" onClick={handleCreateCamp}>Create Camp</Button>
                  </Form>
                )}

                {campMessage && (
                  <Alert className="mt-3" variant={campMessage.startsWith("✅") ? "success" : "danger"}>
                    {campMessage}
                  </Alert>
                )}

                {camps.length > 0 ? (
                  <ListGroup className="mt-3">
                    {camps.map(camp => (
                      <ListGroup.Item key={camp._id} action onClick={() => handleCampClick(camp._id)}>
                        <strong>{camp.name}</strong> – {camp.place}, {camp.district} ({camp.totalCapacity} people)
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted mt-3">No camps available yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </Container>
    </div>
  );
};

export default LeaderDashboard;
