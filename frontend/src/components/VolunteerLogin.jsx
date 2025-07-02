import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VolunteerNavbar from "./VNavbar";

const VolunteerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5553/api/volunteer/login", formData);
      localStorage.setItem("volunteerToken", res.data.token);
      alert("Login Successful");
      navigate("/VolunteerDashboard");
    } catch (error) {
      alert("Login failed: " + error.response.data.message);
    }
  };

  return (
<>
<VolunteerNavbar/>

    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Volunteer Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" required onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">Login</Button>
      </Form>
    </Container>

    </>
  );
};

export default VolunteerLogin;
