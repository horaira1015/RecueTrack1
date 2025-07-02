import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbarr from "./Navbarr"; // Navbar component

function AddCategory() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Load categories from DB
  const navigate = useNavigate();

  // Fetch existing categories from the database
  useEffect(() => {
    axios.get("http://localhost:5553/api/category/getCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Handle form submission
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (category.trim() === "") return;

    try {
      // Send new category to the backend
      const res = await axios.post("http://localhost:5553/api/category/addCategory", { name: category });

      // Update UI with new category
      setCategories([...categories, res.data]);
      setCategory(""); // Reset input field
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card style={{ width: "400px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
          <Card.Title className="text-center">Add New Category</Card.Title>
          <Form onSubmit={handleAddCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Add Category</Button>
          </Form>

          {/* Display added categories */}
          <Card className="mt-3">
            <Card.Body>
              <ListGroup>
                {categories.map((cat, index) => (
                  <ListGroup.Item key={index}>{cat.name}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Back Button */}
          <Button variant="secondary" className="mt-3 w-100" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Card>
      </Container>
    </>
  );
}

export default AddCategory;
