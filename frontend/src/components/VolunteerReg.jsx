import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    campId: "",
    availableTime: "",
    skills: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5553/api/campreg/getCamp")
      .then((res) => setCamps(res.data))
      .catch((err) => console.error("Error fetching camps:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      alert("Password is required!");
      return;
    }

    try {
      const finalFormData = {
        ...formData,
        skills: formData.skills === "Other" ? formData.otherSkill : formData.skills,
      };

      await axios.post("http://localhost:5553/api/volunteer/register", finalFormData);
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Error registering volunteer", error.response?.data || error);
    }
  };

  return (
    <>
      {/* Top-right login button */}
      <div className="d-flex justify-content-end p-3 bg-light border-bottom">
        <Link to="/VolunteerLogin">
          <Button variant="outline-primary">Login</Button>
        </Link>
      </div>

      {/* Registration Form */}
      <Container className="mt-3" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Volunteer Registration</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" name="name" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phone" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
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

          <Form.Group className="mb-3">
            <Form.Label>Available Time</Form.Label>
            <Form.Select name="availableTime" value={formData.availableTime} onChange={handleChange} required>
              <option value="">Select Available Time</option>
              <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
              <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
              <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
              <option value="Night (8 PM - 12 AM)">Night (8 PM - 12 AM)</option>
              <option value="Flexible">Flexible</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Skills/Experience</Form.Label>
            <Form.Select name="skills" value={formData.skills} onChange={handleChange}>
              <option value="">Select Your Skill</option>
              <option value="First Aid & Medical Assistance">First Aid & Medical Assistance</option>
              <option value="Cooking & Food Distribution">Cooking & Food Distribution</option>
              <option value="Logistics & Inventory Management">Logistics & Inventory Management</option>
              <option value="Rescue Operations">Rescue Operations</option>
              <option value="Counseling & Psychological Support">Counseling & Psychological Support</option>
              <option value="Shelter Management">Shelter Management</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          {formData.skills === "Other" && (
            <Form.Group className="mb-3">
              <Form.Label>Specify Other Skill</Form.Label>
              <Form.Control
                type="text"
                name="otherSkill"
                value={formData.otherSkill || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default VolunteerRegistration;
