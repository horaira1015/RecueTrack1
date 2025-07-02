import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import CoNavbar from "./CoNavbar";

function VictimRegistration() {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
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

  const [familyDetails, setFamilyDetails] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch camps from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5553/api/campreg/getCamp")
      .then((res) => setCamps(res.data))
      .catch((err) => console.error("Error fetching camps:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // When familyMembers count changes, update familyDetails array
    if (e.target.name === "familyMembers") {
      const count = Number(e.target.value);
      setFamilyDetails(
        Array.from({ length: count }, () => ({ name: "", age: "", relationship: "", healthStatus: "Stable" }))
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
          campId: "",
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
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" name="contact" value={formData.contact} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Camp</Form.Label>
                <Form.Select name="campId" value={formData.campId} onChange={handleChange} required>
                  <option value="">Select Camp</option>
                  {camps.map((camp) => (
                    <option key={camp._id} value={camp._id}>
                      {camp.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Health Status</Form.Label>
                <Form.Select name="healthStatus" value={formData.healthStatus} onChange={handleChange} required>
                  <option>Stable</option>
                  <option>Injured</option>
                  <option>Critical</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Family Members</Form.Label>
                <Form.Control type="number" name="familyMembers" value={formData.familyMembers} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          {familyDetails.map((member, index) => (
            <Row key={index} className="mt-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Family Member {index + 1} Name</Form.Label>
                  <Form.Control type="text" onChange={(e) => handleFamilyChange(index, "name", e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" onChange={(e) => handleFamilyChange(index, "age", e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control type="text" onChange={(e) => handleFamilyChange(index, "relationship", e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Health Status</Form.Label>
                  <Form.Select onChange={(e) => handleFamilyChange(index, "healthStatus", e.target.value)} required>
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
                <Form.Control type="text" name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Button type="submit" variant="primary" className="w-100">Register Victim</Button>
            </Col>
            <Col md={6}>
              <Button variant="secondary" className="w-100" onClick={() => navigate("/victimlist")}>
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
