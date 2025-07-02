import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Button, Table } from "react-bootstrap";
import axios from "axios";
import Navbarr from "./Navbarr";
import { FaCampground, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function CampSummary() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5553/api/managecamps/getCamp")
      .then((res) => {
        const total = res.data.length;
        const active = res.data.filter((camp) => camp.status === "Active").length;
        const inactive = total - active;
        setStats({ total, active, inactive });
        setCamps(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching camp data:", err));
  }, []);

  // Filtered list based on active/inactive/all
  const filteredCamps = camps.filter((camp) => 
    filter === "all" ? true : camp.status === filter
  );

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Camp Summary</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* Interactive Statistics Section */}
            <Row className="justify-content-center mb-4">
              <Col md={4}>
                <Card 
                  className="text-center shadow-sm p-3 camp-card"
                  onClick={() => setFilter("all")}
                  style={{ cursor: "pointer", transition: "0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.classList.add("hover-effect")}
                  onMouseLeave={(e) => e.currentTarget.classList.remove("hover-effect")}
                >
                  <Card.Body>
                    <FaCampground size={40} color="#007BFF" />
                    <Card.Title className="mt-2">Total Camps</Card.Title>
                    <Card.Text className="fs-4">{stats.total}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card 
                  className="text-center shadow-sm p-3 camp-card"
                  onClick={() => setFilter("Active")}
                  style={{ cursor: "pointer", transition: "0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.classList.add("hover-effect")}
                  onMouseLeave={(e) => e.currentTarget.classList.remove("hover-effect")}
                >
                  <Card.Body>
                    <FaCheckCircle size={40} color="green" />
                    <Card.Title className="mt-2">Active Camps</Card.Title>
                    <Card.Text className="fs-4">{stats.active}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card 
                  className="text-center shadow-sm p-3 camp-card"
                  onClick={() => setFilter("Inactive")}
                  style={{ cursor: "pointer", transition: "0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.classList.add("hover-effect")}
                  onMouseLeave={(e) => e.currentTarget.classList.remove("hover-effect")}
                >
                  <Card.Body>
                    <FaTimesCircle size={40} color="red" />
                    <Card.Title className="mt-2">Inactive Camps</Card.Title>
                    <Card.Text className="fs-4">{stats.inactive}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filter Buttons */}
            <div className="text-center mb-3">
              <Button variant={filter === "all" ? "primary" : "outline-primary"} className="mx-2" onClick={() => setFilter("all")}>
                Show All
              </Button>
              <Button variant={filter === "Active" ? "success" : "outline-success"} className="mx-2" onClick={() => setFilter("Active")}>
                Active Camps
              </Button>
              <Button variant={filter === "Inactive" ? "danger" : "outline-danger"} className="mx-2" onClick={() => setFilter("Inactive")}>
                Inactive Camps
              </Button>
            </div>

            {/* Table Display */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>District</th>
                  <th>Place</th>
                  <th>Pincode</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCamps.length > 0 ? (
                  filteredCamps.map((camp) => (
                    <tr key={camp._id}>
                      <td>{camp.name}</td>
                      <td>{camp.address}</td>
                      <td>{camp.district}</td>
                      <td>{camp.place}</td>
                      <td>{camp.pincode}</td>
                      <td>{camp.totalCapacity}</td>
                      <td style={{ color: camp.status === "Active" ? "green" : "red", fontWeight: "bold" }}>
                        {camp.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No camps available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </Container>

      {/* Custom Styling */}
      <style>{`
        .hover-effect {
          transform: scale(1.05);
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}

export default CampSummary;
