import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import Navbarr from "./Navbarr";
import axios from "axios";

function CampRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    place: "",
    pincode: "",
    totalCapacity: "",
    status: "Inactive", // Default status
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const districts = [
  "Select District", "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra",
  "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chattogram", "Chuadanga", "Comilla",
  "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur",
  "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi", "Jhenaidah",
  "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia",
  "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur",
  "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj",
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna",
  "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati",
  "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj",
  "Sylhet", "Tangail", "Thakurgaon"
];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Camp name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.district || formData.district === "Select District") newErrors.district = "Select a district";
    if (!formData.place.trim()) newErrors.place = "Place is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.totalCapacity.trim()) {
      newErrors.totalCapacity = "Total capacity is required";
    } else if (!/^\d+$/.test(formData.totalCapacity)) {
      newErrors.totalCapacity = "Capacity must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5553/api/campreg/createCamp", formData);

        if (response.status === 201) {
          alert("Camp registered successfully!");
          setFormData({
            name: "", address: "", district: "", place: "", pincode: "", totalCapacity: "", status: "Inactive"
          });
        } else {
          alert(`Unexpected response: ${response.status}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          if (error.response.status === 409) {
            alert("Camp with these details already exists!");
          } else {
            alert(`Error: ${error.response.data.msg || "Please try again."}`);
          }
        } else {
          alert("Network error! Please check your connection.");
        }
      }
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card style={{ width: "350px", padding: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          <h4 className="text-center mb-3">Register a Camp</h4>

          {submitted && <Alert variant="success">Camp registered successfully!</Alert>}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Camp Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} placeholder="Enter camp name" />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} isInvalid={!!errors.address} placeholder="Enter address" />
              <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>District</Form.Label>
              <Form.Control as="select" name="district" value={formData.district} onChange={handleChange} isInvalid={!!errors.district}>
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Place</Form.Label>
              <Form.Control type="text" name="place" value={formData.place} onChange={handleChange} isInvalid={!!errors.place} placeholder="Enter place" />
              <Form.Control.Feedback type="invalid">{errors.place}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Pincode</Form.Label>
              <Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleChange} isInvalid={!!errors.pincode} placeholder="Enter 6-digit pincode" />
              <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Total Capacity</Form.Label>
              <Form.Control type="text" name="totalCapacity" value={formData.totalCapacity} onChange={handleChange} isInvalid={!!errors.totalCapacity} placeholder="Enter total capacity" />
              <Form.Control.Feedback type="invalid">{errors.totalCapacity}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value="Inactive" disabled />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">Register Camp</Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default CampRegistration;
