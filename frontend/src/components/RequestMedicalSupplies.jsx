import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Alert } from "react-bootstrap";
import MoNavbar from "./Mnavbar";

const RequestMedicalSupplies = () => {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ itemId: "", quantity: "" });
  const [message, setMessage] = useState("");

  const mOfficerId = localStorage.getItem("MOfficerId");
  const campId = localStorage.getItem("campId");
  if (!mOfficerId || !campId) {
    console.error("Camp ID or Medical Officer ID is missing in localStorage.");
  }


  useEffect(() => {
    fetchMedicineItems();
    fetchRequests();
  }, []);

  const fetchMedicineItems = async () => {
    try {
      const categoryRes = await fetch("http://localhost:5553/api/category/getCategories");
      const categories = await categoryRes.json();
      const medicineCategory = categories.find(cat => cat.name.toLowerCase() === "medicine");

      if (!medicineCategory) {
        console.error("Medicine category not found.");
        return;
      }

      const campId = localStorage.getItem("campId");
      if (!campId) return;

      const res = await fetch(`http://localhost:5553/api/items/category/${medicineCategory._id}/camp/${campId}`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchRequests = async () => {

    console.log("Stored mOfficerId:", localStorage.getItem("mOfficerId"));
console.log("Stored campId:", localStorage.getItem("campId"));
if (!mOfficerId) {
  setMessage("You must be logged in as a Medical Officer to request supplies.");
  return;
}


    try {
      
      if (!campId) {
        console.error("Camp ID not found in localStorage.");
        return;
      }

      const res = await fetch(`http://localhost:5553/api/requests/allrequests`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear message before new submission

   

    if (!campId || !mOfficerId) {
      setMessage("Camp ID or Medical Officer ID not found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5553/api/requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, campId, mOfficerId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Request submitted successfully!");
        setFormData({ itemId: "", quantity: "" });
        fetchRequests(); // Refresh the list of requests
      } else {
        setMessage(data.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage("Server error.");
    }
  };

  return (
    <>
      <MoNavbar />
      <Container className="mt-4">
        <h2>Request Medical Supplies</h2>
        {message && <Alert variant="info">{message}</Alert>}

        {/* Request Form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Medicine</Form.Label>
            <Form.Select name="itemId" value={formData.itemId} onChange={handleChange} required>
              <option value="">-- Select --</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.description} (Available: {item.totalQuantity})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Request
          </Button>
        </Form>

        {/* Request List */}
        <h3 className="mt-5">Submitted Requests</h3>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Request Date</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req._id}>
                <td>{index + 1}</td>
                <td>{req.itemId?.description || "Unknown"}</td>
                <td>{req.quantity}</td>
                <td>
                  <span className={`badge bg-${req.status === "Pending" ? "warning" : req.status === "Approved" ? "success" : "danger"}`}>
                    {req.status}
                  </span>
                </td>
                <td>{req.requestDate ? new Date(req.requestDate).toLocaleString() : "N/A"}</td>
                <td className="text-danger">
                  {req.status === "Rejected" ? req.rejectionReason || "No reason provided" : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default RequestMedicalSupplies;
