import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Table, Alert } from "react-bootstrap";
import axios from "axios";
import CoNavbar from "./CoNavbar"; // Your navbar for camp officers

function IncidentReports() {
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [reports, setReports] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [severity, setSeverity] = useState("");


  const officerId = localStorage.getItem("officerId"); // assuming login saves officerId
  const campId = localStorage.getItem("campId"); // assuming campId is stored too

  useEffect(() => {
    if (officerId) {
      fetchReports();
    } else {
      console.error("Missing officerId in localStorage");
    }
  }, []);
  

  const fetchReports = async () => {
    try {
      const res = await axios.get(`http://localhost:5553/api/incidents/get/${officerId}`);
      setReports(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !incidentDate || !severity) {
        setErrorMsg("Please fill in all fields.");
        return;
      }
      
      const newReport = {
        description,
        incidentDate,
        officerId,
        campId,
        severity,
      };
      

      console.log("Sending report:", {
        description,
        incidentDate,
        officerId,
        campId,
        severity,
      });
      try {
        console.log("Sending report:", newReport);
      await axios.post("http://localhost:5553/api/incidents/submit", newReport);
      setSuccessMsg("Incident report submitted successfully!");
      setDescription("");
      setIncidentDate("");
      setErrorMsg("");
      fetchReports();
    } catch (error) {
      console.error("Error submitting report:", error);
      setErrorMsg("Failed to submit incident report.");
    }
  };

  return (
    <>
      <CoNavbar />
      <Container className="mt-4">
        <Card className="p-4 shadow-sm mb-4">
          <h3 className="mb-3">Submit Incident Report</h3>

          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Incident</Form.Label>
              <Form.Control
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Severity</Form.Label>
  <Form.Select
    value={severity}
    onChange={(e) => setSeverity(e.target.value)}
    required
  >
    <option value="">Select severity</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </Form.Select>
</Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe the incident..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Submit Report
            </Button>
          </Form>
        </Card>

        <Card className="p-3 shadow-sm">
          <h4 className="mb-3">Your Incident Reports</h4>
          <Table striped bordered hover responsive>
          <thead>
  <tr>
    <th>#</th>
    <th>Date</th>
    <th>Severity</th>
    <th>Status</th>
    <th>Description</th>
    <th>Admin Response</th> {/* NEW */}
  </tr>
</thead>


<tbody>
  {reports.length > 0 ? (
    reports.map((report, idx) => (
      <tr key={report._id}>
        <td>{idx + 1}</td>
        <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
        <td>{report.severity}</td>
        <td>{report.status}</td>
        <td>{report.description}</td>
        <td>{report.adminResponse || "-"}</td> {/* NEW */}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center">
        No incident reports found.
      </td>
    </tr>
  )}
</tbody>


          </Table>
        </Card>
      </Container>
    </>
  );
}

export default IncidentReports;
