import React, { useEffect, useState } from "react";
import { Container, Card, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function AdminIncidentPanel() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("");
  const [adminResponse, setAdminResponse] = useState("");

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5553/api/incidents/admin/all");
      setReports(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5553/api/incidents/admin/update/${selectedReport._id}`,
        {
          status,
          adminResponse,
        }
      );
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-3 shadow-sm">
        <h3 className="mb-3">All Incident Reports</h3>
        <Table striped bordered hover responsive>
        <thead>
  <tr>
    <th>#</th>
    <th>Date</th>
    <th>Camp</th>
    <th>Officer</th>
    <th>Severity</th>
    <th>Status</th>
    <th>Description</th>
    <th>Response</th>
    <th>Action</th>
  </tr>
</thead>
<tbody>
  {reports.map((report, idx) => (
    <tr key={report._id}>
      <td>{idx + 1}</td>
      <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
      <td>{report.campId?.name || "N/A"}</td>
      <td>{report.officerId?.name || "N/A"}</td>
      <td>{report.severity}</td>
      <td>{report.status}</td>
      <td>{report.description}</td>
      <td>{report.adminResponse || "-"}</td>
      <td>
        <Button
          size="sm"
          onClick={() => {
            setSelectedReport(report);
            setStatus(report.status);
            setAdminResponse(report.adminResponse || "");
          }}
        >
          Take Action
        </Button>
      </td>
    </tr>
  ))}
</tbody>

         
        </Table>
      </Card>

      {/* Modal for updating */}
      <Modal show={selectedReport !== null} onHide={() => setSelectedReport(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Take Action on Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Admin Response</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedReport(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminIncidentPanel;
