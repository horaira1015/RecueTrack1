import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Table } from "react-bootstrap";
import CoNavbar from "./CoNavbar";

function RequestSupplies() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requests, setRequests] = useState([]);

  const officerId = localStorage.getItem("officerId");
  const campId = localStorage.getItem("campId");

  useEffect(() => {
    fetchItems();
    fetchRequests();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`http://localhost:5553/api/items/getItems/${campId}`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5553/api/requestSupply/requests`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem || !quantity) {
      alert("Please select an item and enter quantity.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5553/api/requestSupply/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campId, officerId, itemId: selectedItem, quantityRequested: quantity }),
      });
      

      const data = await res.json();
      if (res.ok) {
        alert("Request submitted successfully!");
        setQuantity("");
        fetchRequests();
      } else {
        alert(data.error || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <>
      <CoNavbar />
      <Container className="mt-4">
        <Card className="shadow border-0">
          <Card.Header className="bg-primary text-white">Request Supplies</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Select Item</Form.Label>
                <Form.Control as="select" value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.categoryId?.name} - {item.description} (Available: {item.totalQuantity})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </Form.Group>

              <Button type="submit" variant="success" className="mt-2 w-100">
                Submit Request
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Display Requests */}
        <Card className="mt-4 shadow border-0">
          <Card.Header className="bg-dark text-white">Submitted Requests</Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Rejection Reason</th> {/* New Column */}
                </tr>
              </thead>
              <tbody>
  {requests.map((req) => (
    <tr key={req._id}>
      <td>{req.itemId?.categoryId?.name} - {req.itemId?.description}</td>
      <td>{req.quantityRequested}</td>
      <td 
        className={req.status === "Pending" ? "text-warning" : req.status === "Approved" ? "text-success" : "text-danger"} >
        {req.status}
      </td>
      <td>
      {req.status === "Rejected" ? req.rejectionReason || "No reason provided" : "-"}
      </td>
    </tr>
  ))}
</tbody>

            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RequestSupplies;
