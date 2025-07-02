import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CoNavbar from "./CoNavbar";

function CampStatus() {
  const navigate = useNavigate();
  const [report, setReport] = useState("");
  const [campStatuses, setCampStatuses] = useState([]);
  const officerId = localStorage.getItem("officerId");
  const campId = localStorage.getItem("campId");

  useEffect(() => {
    fetchCampStatuses();
  }, []);

  const fetchCampStatuses = async () => {
    if (!campId) {
      console.error("Error: campId is missing");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:5553/api/campstatus/get/${campId}`);
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch camp statuses");
      }
  
      setCampStatuses(data);
    } catch (error) {
      console.error("Error fetching camp statuses:", error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report.trim()) {
      alert("Please enter a report before submitting.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5553/api/campstatus/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerId, campId, report }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add camp status");
      }

      setReport("");
      fetchCampStatuses();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <>
      <CoNavbar />
      <Container className="mt-4">
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-primary text-white text-center fs-5">
            Camp Status Updates
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Daily Update</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter today's update..."
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  style={{ resize: "none", borderRadius: "10px" }}
                />
              </Form.Group>
              <Button type="submit" variant="success" className="w-100 py-2">
                Submit Update
              </Button>
            </Form>

            <hr />

            <h5 className="mt-4 mb-3 text-center text-primary fw-bold">
              Previous Updates
            </h5>

            {campStatuses.length > 0 ? (
              <ListGroup className="shadow-sm">
                {campStatuses.map((status, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <span className="fw-bold">{status.report}</span>
                      <br />
                      <small className="text-muted">
                        {new Date(status.date).toLocaleDateString()}{" "}
                        {new Date(status.date).toLocaleTimeString()}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-center text-muted">No updates yet.</p>
            )}
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
           <Button variant="secondary" className="mt-3 w-100" onClick={() => navigate(-1)}>
                        Back
                      </Button>
        </div>
      </Container>
    </>
  );
}

export default CampStatus;
