import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import CoNavbar from "./CoNavbar";

function VictimRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contact: "",
    address: "",
    campId: "",
    healthStatus: "Stable",
    familyMembers: 0,
    specialNeeds: "",
  });

  const [campName, setCampName] = useState("");
  const [familyDetails, setFamilyDetails] = useState([]);
  const [message, setMessage] = useState("");

  // On mount, get campId and fetch camp details
  useEffect(() => {
    const campId = localStorage.getItem("campId");
    if (campId) {
      setFormData((prev) => ({ ...prev, campId }));
      fetchCampName(campId);
    } else {
      console.error("campId missing in localStorage");
    }
  }, []);

  // Fetch camp info by ID
  const fetchCampName = async (campId) => {
    try {
      const res = await fetch(`http://localhost:5553/api/camps/get/${campId}`); // Adjust URL to your API
      if (!res.ok) throw new Error("Failed to fetch camp info");
      const data = await res.json();
      setCampName(data.name || "Unknown Camp");
    } catch (error) {
      console.error("Error fetching camp name:", error);
      setCampName("Unknown Camp");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "familyMembers") {
      const count = Number(e.target.value);
      setFamilyDetails(
        Array.from({ length: count }, () => ({
          name: "",
          age: "",
          relationship: "",
          healthStatus: "Stable",
        }))
      );
    }
  };

  const handleFamilyChange = (index, field, value) => {
    const updatedFamily = [...familyDetails];
    updatedFamily[index] = { ...updatedFamily[index], [field]: value };
    setFamilyDetails(updatedFamily);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const victimData = { ...formData, familyDetails };

      const res = await fetch("http://localhost:5553/api/victims/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(victimData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Victim registered successfully!" });
        setFormData({
          name: "",
          age: "",
          gender: "Male",
          contact: "",
          address: "",
          campId: formData.campId,
          healthStatus: "Stable",
          familyMembers: 0,
          specialNeeds: "",
        });
        setFamilyDetails([]);
      } else {
        setMessage({ type: "danger", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Error registering victim" });
    }
  };

  return (
    <>
      <CoNavbar />
      <Container className="mt-5">
        <h2 className="text-center">Victim Registration</h2>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assigned Camp</Form.Label>
                <Form.Control type="text" value={campName} disabled />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Health Status</Form.Label>
                <Form.Select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  required
                >
                  <option>Stable</option>
                  <option>Injured</option>
                  <option>Critical</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Family Members</Form.Label>
                <Form.Control
                  type="number"
                  name="familyMembers"
                  value={formData.familyMembers}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </Form.Group>
            </Col>
          </Row>

          {familyDetails.map((member, index) => (
            <Row key={index} className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Family Member {index + 1} Name</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      handleFamilyChange(index, "name", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={(e) =>
                      handleFamilyChange(index, "age", e.target.value)
                    }
                    required
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      handleFamilyChange(index, "relationship", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Health Status</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      handleFamilyChange(index, "healthStatus", e.target.value)
                    }
                    required
                    defaultValue="Stable"
                  >
                    <option>Stable</option>
                    <option>Injured</option>
                    <option>Critical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          ))}

          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Special Needs</Form.Label>
                <Form.Control
                  type="text"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Button type="submit" variant="primary" className="w-100">
                Register Victim
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="secondary"
                className="w-100"
                onClick={() => navigate("/victimlist")}
              >
                View Victims
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default VictimRegistration;
