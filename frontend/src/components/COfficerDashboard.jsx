import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ProgressBar, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CoNavbar from "./CoNavbar";
import { ListGroup } from "react-bootstrap";


function CampOfficerDashboard() {
  const [OfficerName, setOfficer] = useState(null);
  const navigate = useNavigate();
  const [assignCampOfficer, setAssignedCamp] = useState(null);
  const [victimStats, setVictimStats] = useState({ stable: 0, injured: 0, critical: 0 });
  const [inventoryItems, setInventoryItems] = useState([]);

  const [volunteers, setVolunteers] = useState(0);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchAssignedCamp();
    fetchVictimStats();
    fetchVolunteerCount();
  }, []);

  const fetchVictimStats = async () => {
    try {
      const officerId = localStorage.getItem("officerId");
      if (!officerId) {
        console.error("❌ No Officer ID found in localStorage.");
        return;
      }
  
      console.log("Fetching victim statistics for Officer ID:", officerId);
  
      const res = await fetch(`http://localhost:5553/api/victims/stats/${officerId}`);
      const data = await res.json();
  
      console.log("Victim Stats:", data);
  
      if (res.ok) {
        setVictimStats({
          stable: data.Stable || 0,
          injured: data.Injured || 0,
          critical: data.Critical || 0,
        });
      } else {
        console.error("❌ API Error:", data.message);
      }
    } catch (error) {
      console.error("🔥 Error fetching victim statistics:", error);
    }
  };
  

  const fetchAssignedCamp = async () => {
    try {
      const officerId = localStorage.getItem("officerId");
      if (!officerId) return;

      const res = await fetch(`http://localhost:5553/api/assigncofficer/getAssignedCamp/${officerId}`);
      const data = await res.json();

      console.log("Fetched Camp Data:", data);

      if (res.ok) {
        setAssignedCamp(data);
        setOfficer(data.officer || "Unknown Officer");

        console.log("Camp ID:", data.campId); // Debugging

        if (data.campId) {
          localStorage.setItem("campId", data.campId); // Store campId in localStorage
          fetchInventoryItems(data.campId);
        }
        fetchVolunteerCount(data.campId);
      }
    } catch (error) {
      console.error("Error fetching assigned camp:", error);
    }
  };

  const fetchVolunteerCount = async (campId) => {

    
    try {

      const campId = localStorage.getItem("campId"); // Ensure campId is retrieved
  if (!campId) {
    console.error("Camp ID not found");
    return;
  }
      const res = await fetch(`http://localhost:5553/api/volunteer/approvedVolunteers/${campId}`);
      const data = await res.json();

      if (res.ok) {
        setVolunteers(data.count);
      }
    } catch (error) {
      console.error("Error fetching approved volunteers count:", error);
    }
  };

  const fetchInventoryItems = async () => {
    const campId = localStorage.getItem("campId"); // Get camp ID from localStorage
    if (!campId) {
      console.error("Error: Camp ID is missing");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:5553/api/items/getItems/${campId}`); // ✅ Use campId in API call
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch inventory items");
      }
  
      console.log("Fetched Inventory Items:", data);
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };
  


  const handleStatusSubmit = (e) => {
    e.preventDefault();
    setReports([...reports, statusUpdate]);
    setStatusUpdate("");
  };

  const handleLogout = () => {
    localStorage.removeItem("officerId");
    navigate("/login");
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <CoNavbar />

      {/* Hero Section */}
      <div className="hero-banner text-center py-4" style={{ background: "linear-gradient(90deg, #1565c0, #004ba0)", color: "white", borderRadius: "10px" }}>
        <h1>Camp Officer Dashboard</h1>
        <h2>Welcome, {OfficerName}</h2>
      </div>

      <Container className="mt-4">
        <Row className="gy-4">
          {/* Assigned Camp Details */}
          <Col md={6}>
            <Card className="shadow border-0">
              <Card.Header className="bg-primary text-white font-weight-bold">Assigned Camp</Card.Header>
              <Card.Body>
                {assignCampOfficer ? (
                  <>
                    <p><strong>Name:</strong> {assignCampOfficer.name}</p>
                    <p><strong>Location:</strong> {assignCampOfficer.place}, {assignCampOfficer.district}</p>
                    <p><strong>Status:</strong> {assignCampOfficer.status}</p>
                    <p><strong>Total Capacity:</strong> {assignCampOfficer.totalCapacity} people</p>
                    <p><strong>Filled:</strong> {assignCampOfficer.filled} people</p>
                    <p><strong>Available Space:</strong> {assignCampOfficer.availableSpace} people</p>
                  </>
                ) : (
                  <p>No assigned camp found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Victim Statistics */}
          <Col md={6}>
            <Card className="shadow border-0">
              <Card.Header className="bg-success text-white font-weight-bold">Victim Statistics</Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col>
                    <h5 className="text-success">Stable</h5>
                    <h2>{victimStats.stable}</h2>
                  </Col>
                  <Col>
                    <h5 className="text-warning">Injured</h5>
                    <h2>{victimStats.injured}</h2>
                  </Col>
                  <Col>
                    <h5 className="text-danger">Critical</h5>
                    <h2>{victimStats.critical}</h2>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Inventory & Volunteers */}
        <Row className="mt-4 gy-4">
        <Col md={6}>
            <Card className="shadow border-0">
              <Card.Header className="bg-warning text-dark font-weight-bold">Inventory Items</Card.Header>
              <Card.Body>
                {inventoryItems.length > 0 ? (
                  <ListGroup>
                    {inventoryItems.map((item, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between">
                        <div>
                          <strong>{item.categoryId.name}:</strong> {item.totalQuantity} units
                        </div>
                        <small className="text-muted">{new Date(item.addDate).toLocaleDateString()}</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-center text-muted">No inventory items available.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          

          <Col md={6}>
            <Card className="shadow border-0">
              <Card.Header className="bg-info text-white font-weight-bold">Volunteers</Card.Header>
              <Card.Body className="text-center">
                <h5>Total Approved Volunteers: {volunteers}</h5>
                <Button variant="primary" className="w-100">Manage Volunteers</Button>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* Camp Status Updates */}
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow border-0">
              <Card.Header className="bg-dark text-white font-weight-bold">Camp Status Updates</Card.Header>
              <Card.Body>
                <Form onSubmit={handleStatusSubmit}>
                  <Form.Group>
                    <Form.Control as="textarea" rows={3} placeholder="Enter daily update..." value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)} />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => navigate("/campstatus")}
                  >
                    Write Camp Report
                  </Button>

                </Form>
                <ul className="mt-3">
                  {reports.map((report, index) => (
                    <li key={index}>{report}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Logout Button */}
        <div className="text-center mt-4">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </Container>
    </div>
  );
}

export default CampOfficerDashboard;
