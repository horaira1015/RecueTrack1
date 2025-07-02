import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbarr from "./Navbarr";
import axios from "axios";
import {
  FaCampground,
  FaUsers,
  FaDonate,
  FaClipboardList,
  FaWarehouse,
  FaListAlt
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [totalCamps, setTotalCamps] = useState();
  const [totalRequests, setTotalRequests] = useState(0);
  const [approvedVolunteers, setApprovedVolunteers] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    const fetchApprovedVolunteers = async () => {
      try {
        const response = await axios.get("http://localhost:5553/api/volunteer/approved");
        setApprovedVolunteers(response.data.length);
      } catch (err) {
        console.error("Error fetching approved volunteers:", err);
      }
    };
    fetchApprovedVolunteers();
  }, []);

  useEffect(() => {
    const fetchRequestsCount = async () => {
      try {
        const campOfficerRequests = await axios.get("http://localhost:5553/api/requestSupply/requests");
        const medicalOfficerRequests = await axios.get("http://localhost:5553/api/requests/allrequests");
        const pendingCampRequests = campOfficerRequests.data.filter(req => req.status === "Pending").length;
        const pendingMedicalRequests = medicalOfficerRequests.data.filter(req => req.status === "Pending").length;
        setTotalRequests(pendingCampRequests + pendingMedicalRequests);
      } catch (err) {
        console.error("Error fetching requests count:", err);
      }
    };
    fetchRequestsCount();
  }, []);

  useEffect(() => {
    const fetchDonationsData = async () => {
      try {
        const response = await axios.get("http://localhost:5553/api/donate/donations");
        const donations = response.data.donations;
        const totalReceived = donations.reduce((sum, donation) => sum + donation.amount, 0);
        const totalRemaining = donations.reduce((sum, donation) => sum + donation.balance_amount, 0);
        setTotalDonations(totalReceived);
        setRemainingBalance(totalRemaining);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };
    fetchDonationsData();
  }, []);

  return (
    <>
      <Navbarr />
      <Container className="mt-5">
        <h2 className="text-center mb-4">Admin Dashboard</h2>

        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/alerts")}>
              <Card.Body>
                <FaClipboardList size={32} className="text-danger mb-2" />
                <Card.Title>Send Alerts</Card.Title>
                <Card.Text className="fs-5 fw-bold">Disasters / Stock Out</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/CampSummary")}>
              <Card.Body>
                <FaCampground size={32} className="text-primary mb-2" />
                <Card.Title>Total Camps</Card.Title>
                <Card.Text className="fs-4 fw-bold">{totalCamps}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/ApprovedVolunteers")}>
              <Card.Body>
                <FaUsers size={32} className="text-success mb-2" />
                <Card.Title>Registered Volunteers</Card.Title>
                <Card.Text className="fs-4 fw-bold">{approvedVolunteers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/ManageCamps")}>
              <Card.Body>
                <FaCampground size={32} className="text-primary mb-2" />
                <Card.Title>Manage Camps</Card.Title>
                <Card.Text className="fs-4 fw-bold">{totalCamps}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/Viewdonation")}>
              <Card.Body>
                <FaDonate size={32} className="text-warning mb-2" />
                <Card.Title>Donations Received</Card.Title>
                <Card.Text className="fs-5 fw-bold">{totalDonations.toLocaleString()}</Card.Text>
                <Card.Text className="text-muted">Remaining: {remainingBalance.toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/Requests")}>
              <Card.Body>
                <FaClipboardList size={32} className="text-danger mb-2" />
                <Card.Title>Active Requests</Card.Title>
                <Card.Text className="fs-4 fw-bold">{totalRequests}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          

          <Col md={4}>
            <Card className="dashboard-card text-center">
              <Card.Body>
                <FaClipboardList size={32} className="text-info mb-2" />
                <Card.Title className="mb-3">Camp Reports</Card.Title>
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-primary" onClick={() => navigate("/campreports")}>📝 Daily Camp Reports</button>
                  <button className="btn btn-danger" onClick={() => navigate("/adminincidents")}>🚨 Incident Reports</button>
                  <button className="btn btn-secondary" onClick={() => navigate("/victims")}>👤 View Victim Details</button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/Requests")}>
              <Card.Body>
                <FaListAlt size={32} className="text-success mb-2" />
                <Card.Title>View Requests</Card.Title>
                <Card.Text className="fs-5 fw-bold">Monitor & Respond</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card text-center" onClick={() => navigate("/viewItems")}>
              <Card.Body>
                <FaWarehouse size={32} className="text-warning mb-2" />
                <Card.Title>Manage Inventory</Card.Title>
                <Card.Text className="fs-5 fw-bold">Track & Distribute</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .dashboard-card {
          cursor: pointer;
          border-radius: 15px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}

export default AdminDashboard;
