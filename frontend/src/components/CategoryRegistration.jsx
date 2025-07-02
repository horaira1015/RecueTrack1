import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import Navbarr from "./Navbarr";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CategoryRegistration() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [camps, setCamps] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    addDate: "",
    campId: "",
    totalQuantity: "", // ✅ Corrected field name
    description: "",
  });

  // Fetch categories and camps from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5553/api/category/getCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));

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
    try {
      await axios.post("http://localhost:5553/api/items/registerItem", {
        ...formData,
        totalQuantity: parseInt(formData.totalQuantity, 10), // ✅ Ensure totalQuantity is a number
      });

      alert("Item Registered Successfully!");
      setFormData({
        categoryId: "",
        addDate: "",
        campId: "",
        totalQuantity: "", // ✅ Reset correctly
        description: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to register item!");
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card style={{ width: "400px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
          <Card.Title className="text-center">Register Item</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add Date</Form.Label>
              <Form.Control type="date" name="addDate" value={formData.addDate} onChange={handleChange} required />
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
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="totalQuantity" // ✅ Corrected field name
                value={formData.totalQuantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Add
            </Button>
            <Button variant="secondary" className="mt-3 w-100" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default CategoryRegistration;
