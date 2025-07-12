import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
        <h2 className="text-center mb-5 fw-bold">📊 Admin Dashboard</h2>

        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/alerts")}>
              <Card.Body>
                <FaClipboardList size={32} className="text-danger mb-3" />
                <h5 className="fw-bold">Send Alerts</h5>
                <p className="text-muted mb-0">Disasters / Stock Out</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/ManageCamps")}>
              <Card.Body>
                <FaCampground size={32} className="text-primary mb-3" />
                <h5 className="fw-bold">Manage Camps</h5>
                <p className="fs-5 text-dark fw-semibold">{totalCamps ?? "—"}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/ApprovedVolunteers")}>
              <Card.Body>
                <FaUsers size={32} className="text-success mb-3" />
                <h5 className="fw-bold">Volunteers</h5>
                <p className="fs-5 text-dark fw-semibold">{approvedVolunteers}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/Viewdonation")}>
              <Card.Body>
                <FaDonate size={32} className="text-warning mb-3" />
                <h5 className="fw-bold">Donations</h5>
                <p className="mb-1 text-success fw-semibold">{totalDonations.toLocaleString()}</p>
                <small className="text-muted">Remaining: {remainingBalance.toLocaleString()}</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/Requests")}>
              <Card.Body>
                <FaClipboardList size={32} className="text-danger mb-3" />
                <h5 className="fw-bold">Pending Requests</h5>
                <p className="fs-5 text-dark fw-semibold">{totalRequests}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/CampSummary")}>
              <Card.Body>
                <FaCampground size={32} className="text-info mb-3" />
                <h5 className="fw-bold">Camp Summary</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="dashboard-card glass text-center">
              <Card.Body>
                <FaClipboardList size={32} className="text-info mb-3" />
                <h5 className="fw-bold">Camp Reports</h5>
                <div className="d-flex flex-column gap-2 mt-3">
                  <Button variant="primary" onClick={() => navigate("/campreports")}>📝 Daily Reports</Button>
                  <Button variant="danger" onClick={() => navigate("/adminincidents")}>🚨 Incidents</Button>
                  <Button variant="secondary" onClick={() => navigate("/victims")}>👤 Victim Details</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/CreateDisaster")}>
              <Card.Body>
                <FaClipboardList size={32} className="text-info mb-3" />
                <h5 className="fw-bold">Create Disaster</h5>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/ViewDisasters")}>
              <Card.Body>
                <FaClipboardList size={32} className="text-info mb-3" />
                <h5 className="fw-bold">View Disasters</h5>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card glass" onClick={() => navigate("/viewItems")}>
              <Card.Body>
                <FaWarehouse size={32} className="text-warning mb-3" />
                <h5 className="fw-bold">Manage Inventory</h5>
                <p className="text-muted">Track & Distribute</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .dashboard-card {
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.15);
        }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </>
  );
}

export default AdminDashboard;
