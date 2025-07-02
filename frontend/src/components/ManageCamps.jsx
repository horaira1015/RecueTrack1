import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Navbarr from "./Navbarr";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

function ManageCamps() {
  const [camps, setCamps] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);

  // Fetch camps from the backend
  useEffect(() => {
    axios.get("http://localhost:5553/api/managecamps/getCamp")
      .then((res) => setCamps(res.data))
      .catch((err) => console.error("Error fetching camps:", err));
  }, []);

  // Handle Edit
  const handleEdit = (camp) => {
    setSelectedCamp({ ...camp });
    setShow(true);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this camp?")) {
      axios.delete(`http://localhost:5553/api/managecamps/deleteCamp/${id}`)
        .then(() => {
          setCamps(camps.filter((camp) => camp._id !== id));
          alert("Camp deleted successfully!");
        })
        .catch((err) => console.error("Error deleting camp:", err));
    }
  };

  // Handle Status Toggle (Active/Inactive)
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    axios.put(`http://localhost:5553/api/managecamps/updateCamp/${id}`, { status: newStatus })
      .then(() => {
        setCamps(camps.map((camp) => (camp._id === id ? { ...camp, status: newStatus } : camp)));
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Manage Camps</h2>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>District</th>
              <th>Place</th>
              <th>Pincode</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp._id}>
                <td>{camp.name}</td>
                <td>{camp.address}</td>
                <td>{camp.district}</td>
                <td>{camp.place}</td>
                <td>{camp.pincode}</td>
                <td>{camp.totalCapacity}</td>
                <td>{camp.status}</td>
                <td>
                  {/* Activate/Deactivate Button */}
                  <Button
                    variant={camp.status === "Active" ? "danger" : "success"}
                    size="sm"
                    onClick={() => toggleStatus(camp._id, camp.status)}
                  >
                    {camp.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>

                  {/* Edit Button */}
                  <Button variant="link" onClick={() => handleEdit(camp)}>
                    <FaEdit style={{ color: "#FFC107", fontSize: "1.2rem" }} />
                  </Button>

                  {/* Delete Button */}
                  <Button variant="link" onClick={() => handleDelete(camp._id)}>
                    <FaTrash style={{ color: "#DC3545", fontSize: "1.2rem" }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Modal */}
        {selectedCamp && (
          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Camp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCamp.name}
                    onChange={(e) => setSelectedCamp({ ...selectedCamp, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCamp.address}
                    onChange={(e) => setSelectedCamp({ ...selectedCamp, address: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCamp.district}
                    onChange={(e) => setSelectedCamp({ ...selectedCamp, district: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Place</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCamp.place}
                    onChange={(e) => setSelectedCamp({ ...selectedCamp, place: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCamp.pincode}
                    onChange={(e) => setSelectedCamp({ ...selectedCamp, pincode: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedCamp.totalCapacity}
                    onChange={(e) => setSelectedCamp({ ...selectedCamp, totalCapacity: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
              <Button variant="primary" onClick={handleEdit}>Update</Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </>
  );
}

export default ManageCamps;
