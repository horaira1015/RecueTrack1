import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CampOfficerRegistration() {
// Bangladeshi address data
const districts = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Barishal", "Rajshahi", "Rangpur", "Mymensingh"];

const zillas = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Manikganj", "Munshiganj", "Kishoreganj", "Faridpur", "Madaripur", "Shariatpur", "Rajbari", "Gopalganj"],
  Chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Feni", "Noakhali", "Chandpur", "Lakshmipur", "Brahmanbaria", "Rangamati", "Khagrachhari", "Bandarban"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail", "Chuadanga", "Meherpur", "Jhenaidah", "Magura"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokati", "Barguna"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj", "Naogaon", "Natore", "Chapainawabganj", "Joypurhat"],
  Rangpur: ["Rangpur", "Dinajpur", "Nilphamari", "Gaibandha", "Kurigram", "Lalmonirhat", "Panchagarh", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Netrokona", "Jamalpur", "Sherpur"]
};

const upazillas = {
  Dhaka: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Demra", "Dhanmondi", "Gulshan", "Mirpur", "Motijheel", "Ramna", "Tejgaon", "Uttara"],
  Gazipur: ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj"],
  Narayanganj: ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"],
  Tangail: ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur"],
  Chittagong: ["Chandgaon", "Double Mooring", "Kotwali", "Pahartali", "Bandar", "Patenga", "Bakalia", "Bayezid", "Hathazari", "Raojan", "Sandwip", "Satkania", "Sitakunda"],
  CoxsBazar: ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Ramu", "Teknaf", "Ukhia"],
  Sylhet: ["Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Sylhet Sadar", "Zakiganj"],
  Khulna: ["Khalishpur", "Sonadanga", "Dacope", "Dighalia", "Koyra", "Paikgacha", "Phultala", "Rupsa", "Terokhada"],
  Barishal: ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Barishal Sadar", "Mehendiganj", "Muladi", "Wazirpur"],
  Rajshahi: ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
  Rangpur: ["Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"],
  Mymensingh: ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Mymensingh Sadar", "Muktagachha", "Nandail", "Phulpur", "Trishal"]
};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    zilla: "",
    upazilla: "",
    password: "",
    idProof: null,
  });

  const [address, setAddress] = useState({
    district: "",
    zilla: "",
    upazilla: "",
    street: ""
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableZillas, setAvailableZillas] = useState([]);
  const [availableUpazillas, setAvailableUpazillas] = useState([]);

  const handleView = () => navigate("/viewcampofficer");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    setAddress(prev => {
      const newAddress = { ...prev, [name]: value };
      
      // Reset dependent fields when parent changes
      if (name === "district") {
        newAddress.zilla = "";
        newAddress.upazilla = "";
        setAvailableZillas(zillas[value] || []);
        setAvailableUpazillas([]);
      } else if (name === "zilla") {
        newAddress.upazilla = "";
        setAvailableUpazillas(upazillas[value] || []);
      }
      
      return newAddress;
    });
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
    if (!address.district) newErrors.district = "District is required";
    if (!address.zilla) newErrors.zilla = "Zilla is required";
    if (!address.upazilla) newErrors.upazilla = "Upazilla is required";
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.idProof) newErrors.idProof = "ID Proof is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Combine address components into single string
    const fullAddress = `${address.street}, ${address.upazilla}, ${address.zilla}, ${address.district}`;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("address", fullAddress);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5553/api/cofficerReg/createoffReg",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setSuccessMessage("Camp Officer Registered Successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          idProof: null,
        });
        setAddress({
          district: "",
          zilla: "",
          upazilla: "",
          street: ""
        });
        document.getElementById("idProofInput").value = "";
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.error || "Error registering. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-4">
      <Card style={{ width: "100%", maxWidth: "600px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h2 className="text-center mb-4" style={{ color: "#2c3e50" }}>Camp Officer Registration</h2>
        {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Enter full name"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Enter email address"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  placeholder="01XXXXXXXXX"
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="At least 6 characters"
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-4 mb-3" style={{ color: "#2c3e50" }}>Address Information</h5>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Select
                  name="district"
                  value={address.district}
                  onChange={handleAddressChange}
                  isInvalid={!!errors.district}
                >
                  <option value="">Select District</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>{district}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Zilla</Form.Label>
                <Form.Select
                  name="zilla"
                  value={address.zilla}
                  onChange={handleAddressChange}
                  disabled={!address.district}
                  isInvalid={!!errors.zilla}
                >
                  <option value="">Select Zilla</option>
                  {availableZillas.map((zilla, index) => (
                    <option key={index} value={zilla}>{zilla}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.zilla}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Upazilla</Form.Label>
                <Form.Select
                  name="upazilla"
                  value={address.upazilla}
                  onChange={handleAddressChange}
                  disabled={!address.zilla}
                  isInvalid={!!errors.upazilla}
                >
                  <option value="">Select Upazilla</option>
                  {availableUpazillas.map((upazilla, index) => (
                    <option key={index} value={upazilla}>{upazilla}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.upazilla}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Street/Village</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="House/Road No."
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>ID Proof (Upload)</Form.Label>
            <Form.Control 
              id="idProofInput"
              type="file" 
              name="idProof" 
              onChange={handleFileChange} 
              isInvalid={!!errors.idProof}
            />
            <Form.Text className="text-muted">
              Upload a clear image of your NID/Passport/Driving License
            </Form.Text>
            <Form.Control.Feedback type="invalid">{errors.idProof}</Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Registering...
                </>
              ) : "Register"}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={handleView}
            >
              View Registered Officers
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default CampOfficerRegistration;