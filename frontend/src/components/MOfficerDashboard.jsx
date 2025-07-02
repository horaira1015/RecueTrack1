import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MoNavbar from "./Mnavbar";

function MOfficerDashboard() {
  const [officerName, setOfficer] = useState(null);
  const [assignedCamp, setAssignedCamp] = useState(null);
const [victimStats, setVictimStats] = useState({ stable: 0, injured: 0, critical: 0 });
  const [medicalReports, setMedicalReports] = useState([]);
  const [medicalSupplies, setMedicalSupplies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedCamp();

    fetchMedicalReports();
    fetchMedicalSupplies();
    

    
  }, []);
  useEffect(() => {
    if (assignedCamp?.campId) {
      fetchVictimHealthStatus();
    }
  }, [assignedCamp]);

  const fetchAssignedCamp = async () => {
    try {
        const MOfficerId =localStorage.getItem("MOfficerId");
        console.log("Officer ID from localStorage:", MOfficerId);
        if (!MOfficerId) {
            console.error("❌ No officerId found in localStorage");
            return;
        }

        console.log("Fetching assigned camp for Officer ID:", MOfficerId);

        const res = await fetch(`http://localhost:5553/api/assignmofficer/getAssignedCamp/${MOfficerId}`);
        const data = await res.json();

        console.log("Fetched Camp Data:", data); // Debugging

        if (res.ok) {
            setAssignedCamp(data);
            setOfficer(data.officer || "Unknown Officer");

            localStorage.setItem("campId", data.campId);
        } else {
            console.error("❌ API Error:", data.message);
        }
    } catch (error) {
        console.error("🔥 Fetch error:", error);
    }
};


const fetchMedicalReports = async () => {
  try {
    const officerId = localStorage.getItem("MOfficerId");
    if (!officerId) return;

    const res = await fetch(`http://localhost:5553/api/medicalreports/get/${officerId}`);
    const data = await res.json();
    setMedicalReports(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching medical reports:", error);
  }
};

const fetchMedicalSupplies = async () => {
  try {
    const campId = localStorage.getItem("campId");
    if (!campId) return;

    // Fetch category ID for "medicine"
    const categoryRes = await fetch("http://localhost:5553/api/category/getCategories");
    const categories = await categoryRes.json();
    const medicineCategory = categories.find(cat => cat.name.toLowerCase() === "medicine");

    if (!medicineCategory) {
      console.error("Medicine category not found.");
      return;
    }

    // Fetch items only for the "medicine" category
    const res = await fetch(`http://localhost:5553/api/items/category/${medicineCategory._id}/camp/${campId}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    
    setMedicalSupplies(data);
  } catch (error) {
    console.error("Error fetching medical supplies:", error);
  }
};

const fetchVictimHealthStatus = async () => {
  try {
    const campId = localStorage.getItem("campId");
    if (!campId) return;

    const res = await fetch(`http://localhost:5553/api/victims/healthStatusCounts/${campId}`);
    const data = await res.json();

    if (res.ok) {
      setVictimStats(data);
    } else {
      console.error("Error fetching victim health stats:", data.message);
    }
  } catch (error) {
    console.error("Error fetching victim stats:", error);
  }
};




  const handleLogout = () => {
    localStorage.removeItem("officerId");
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <MoNavbar />

      {/* Hero Section */}
      <div className="hero-banner text-center py-4" style={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)", color: "white", borderRadius: "10px" }}>
        <h1>Medical Officer Dashboard</h1>
        <h2>Welcome, {officerName}</h2>
      </div>

      <Container className="mt-4">
        <Row className="gy-4">
          {/* Assigned Camp Details */}
          <Col md={6}>
            <Card className="shadow border-0">
              <Card.Header className="bg-primary text-white">Assigned Camp</Card.Header>
              <Card.Body>
                {assignedCamp ? (
                  <>
                    <p><strong>Name:</strong> {assignedCamp.name}</p>
                    <p><strong>Location:</strong> {assignedCamp.place}, {assignedCamp.district}</p>
                    <p><strong>Status:</strong> {assignedCamp.status}</p>
                    {/* <p><strong>Total Capacity:</strong> {assignedCamp.totalCapacity} people</p> */}
                    <p><strong>Filled:</strong> {assignedCamp.filled} people</p>
                    {/* <p><strong>Available Space:</strong> {assignedCamp.availableSpace} people</p> */}
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

        {/* Medical Reports */}
        <Row className="mt-4 gy-4">
        <Col md={6}>
            <Card className="shadow border-0">
                          <Card.Header className="bg-warning text-dark font-weight-bold">Medical Reports</Card.Header>
              <Card.Body>
                <p>Total Reports: {medicalReports.length}</p>
                <p>Recent Cases:</p>
                <ul>
                  {medicalReports.slice(0, 3).map((report) => (
                    <li key={report._id}>
                      {report.victimId?.name} - {report.diagnosis}
                    </li>
                  ))}
                </ul>
                <Button variant="primary" onClick={() => navigate("/medicalreports")}>
                  Manage Reports
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Medical Supplies */}
          <Col md={6}>
            <Card className="shadow border-0">
              <Card.Header className="bg-info text-white">Medical Supplies</Card.Header>
              <Card.Body>
              

                {medicalSupplies.length > 0 ? (
                  <ListGroup>
                    {medicalSupplies.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <strong>{item.description}:</strong> {item.totalQuantity} units
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                ) : (
                  <p className="text-center text-muted">view and request supplies.</p>
                )}
                <Button variant="success" className="w-100 mb-2" onClick={() => navigate("/requestMedicalSupplies")}>
  Request Supplies
</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Logout */}
        <div className="text-center mt-4">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </Container>
    </div>
  );
}

export default MOfficerDashboard;
