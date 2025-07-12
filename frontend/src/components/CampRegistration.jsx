import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import Navbarr from "./Navbarr";
import axios from "axios";

function CampRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    district: "",
    totalCapacity: "",
    pincode: "",
    address: "",
  });

  const [disasters, setDisasters] = useState([]);
  const [disasterId, setDisasterId] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load all disasters for selection
    axios.get("http://localhost:5553/api/disasters/getall")
      .then((res) => setDisasters(res.data))
      .catch((err) => {
        console.error("Failed to load disasters", err);
        setMessage("❌ Failed to fetch disasters. Try again later.");
      });
  }, []);

  const districts = ["Select District", "Dhaka", "Chattogram", "Sylhet", "Barisal", "Rajshahi", "Khulna", "Mymensingh"];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    setMessage("");
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Camp name is required";
    if (!formData.place.trim()) newErrors.place = "Place is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.district || formData.district === "Select District") newErrors.district = "Select a district";
    if (!/^[0-9]{4}$/.test(formData.pincode)) newErrors.pincode = "Valid 4-digit pincode required";
    if (!/^[0-9]+$/.test(formData.totalCapacity)) newErrors.totalCapacity = "Capacity must be a number";
    if (!disasterId) newErrors.disaster = "Please select a disaster";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5553/api/camps/cr", {
        ...formData,
        disaster: disasterId,
      });

      if (res.status === 201) {
        setMessage("✅ Camp registered successfully!");
        setFormData({
          name: "", place: "", district: "", totalCapacity: "", pincode: "", address: ""
        });
        setDisasterId("");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setMessage("❌ Camp already exists with the same details.");
      } else {
        setMessage("❌ Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card style={{ width: "420px", padding: "25px", boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" }}>
          <h4 className="text-center mb-3">📍 Register a Camp</h4>

          {message && <Alert variant={message.includes("✅") ? "success" : "danger"}>{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Disaster dropdown */}
            <Form.Group className="mb-2">
              <Form.Label>Disaster</Form.Label>
              <Form.Select
                name="disaster"
                value={disasterId}
                onChange={(e) => setDisasterId(e.target.value)}
                isInvalid={!!errors.disaster}
              >
                <option value="">Select Disaster</option>
                {disasters.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.disaster}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Camp Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Place</Form.Label>
              <Form.Control type="text" name="place" value={formData.place} onChange={handleChange} isInvalid={!!errors.place} />
              <Form.Control.Feedback type="invalid">{errors.place}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} isInvalid={!!errors.address} />
              <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>District</Form.Label>
              <Form.Select name="district" value={formData.district} onChange={handleChange} isInvalid={!!errors.district}>
                {districts.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Pincode</Form.Label>
              <Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleChange} isInvalid={!!errors.pincode} />
              <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Total Capacity</Form.Label>
              <Form.Control type="text" name="totalCapacity" value={formData.totalCapacity} onChange={handleChange} isInvalid={!!errors.totalCapacity} />
              <Form.Control.Feedback type="invalid">{errors.totalCapacity}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="success" className="w-100 mt-3" disabled={loading}>
              {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : "Register Camp"}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default CampRegistration;
