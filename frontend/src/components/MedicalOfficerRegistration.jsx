import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Navbarr from "./Navbarr";
import { useNavigate } from "react-router-dom";

function MedicalOfficerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    specialization: "", // ✅ Added Specialization
    idProof: null,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleView = () => navigate("/viewmedicalofficer");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, idProof: e.target.files[0] });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.phone.trim() || !/^01[3-9]\d{8}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 11-digit phone number (starting with 013-019)";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required"; // ✅ Validation added
    if (!formData.idProof) newErrors.idProof = "ID Proof is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5553/api/medicaloffReg/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setSuccessMessage("Medical Officer Registered Successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          specialization: "",
          idProof: null,
        });

        document.getElementById("idProofInput").value = ""; // Reset file input
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error registering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card style={{ width: "400px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <h4 className="text-center">Medical Officer Registration</h4>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            {["name", "email", "phone", "address", "password"].map((field, index) => (
              <Form.Group className="mb-2" key={index}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  isInvalid={!!errors[field]}
                />
                <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
              </Form.Group>
            ))}

            {/* ✅ Specialization Field */}
            <Form.Group className="mb-2">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                as="select"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                isInvalid={!!errors.specialization}
              >
                <option value="">Select Specialization</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Surgery">Surgery</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Others">Others</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.specialization}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ID Proof (Upload)</Form.Label>
              <Form.Control id="idProofInput" type="file" name="idProof" onChange={handleFileChange} isInvalid={!!errors.idProof} />
              <Form.Control.Feedback type="invalid">{errors.idProof}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Register"}
            </Button>

            <Button variant="secondary" className="w-100 mt-2" onClick={handleView}>
              View Medical Officers
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default MedicalOfficerRegistration;
