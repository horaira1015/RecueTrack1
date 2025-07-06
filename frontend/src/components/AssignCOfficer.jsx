import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Table, Card, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AssignCOfficer() {
  const { officerId } = useParams();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState("");
  const [assignedOfficers, setAssignedOfficers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await axios.get("http://localhost:5553/api/campreg/getCamp");
        setCamps(response.data);
      } catch {
        setError("Failed to fetch camps. Try again later.");
      }
    };

    const fetchAssignedOfficers = async () => {
      try {
        const response = await axios.get("http://localhost:5553/api/assigncofficer/getAssignedOfficers");
        setAssignedOfficers(response.data);
      } catch {
        // silently ignore
      }
    };

    fetchCamps();
    fetchAssignedOfficers();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCamp) return setError("Please select a camp.");
    setError("");

    try {
      await axios.put(`http://localhost:5553/api/assigncofficer/assign/${officerId}`, { campId: selectedCamp });

      setSuccessMessage("Officer assigned to camp successfully!");
      const updatedOfficers = await axios.get("http://localhost:5553/api/assigncofficer/getAssignedOfficers");
      setAssignedOfficers(updatedOfficers.data);

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/viewcampofficer");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign officer. Try again.");
    }
  };

  return (
    <Container
      fluid
      className="p-5"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg rounded-4 border-0">
            <Card.Body className="p-5">
              <h3 className="mb-4 text-center fw-bold text-primary">
                Assign Camp Officer to a Camp
              </h3>

              {successMessage && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccessMessage("")}
                  className="mb-4"
                >
                  {successMessage}
                </Alert>
              )}
              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                  className="mb-4"
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleAssign}>
                <Form.Group controlId="selectCamp" className="mb-4">
                  <Form.Label className="fw-semibold fs-5">
                    Select Camp
                  </Form.Label>
                  <Form.Select
                    value={selectedCamp}
                    onChange={(e) => setSelectedCamp(e.target.value)}
                    size="lg"
                    className="shadow-sm"
                  >
                    <option value="">-- Select a Camp --</option>
                    {camps.map((camp) => (
                      <option key={camp._id} value={camp._id}>
                        {camp.name} — {camp.place}, {camp.district}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    size="lg"
                    className="fw-bold"
                    style={{
                      background:
                        "linear-gradient(90deg, #0052d4 0%, #4364f7 50%, #6fb1fc 100%)",
                      border: "none",
                      boxShadow:
                        "0 4px 15px 0 rgba(65, 132, 255, 0.75)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 6px 20px 0 rgba(65, 132, 255, 1)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 15px 0 rgba(65, 132, 255, 0.75)")
                    }
                  >
                    Assign Officer
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <h4 className="mb-4 text-center text-secondary fw-semibold">
            Assigned Camp Officers
          </h4>

          <div
            className="table-responsive shadow-sm rounded-4"
            style={{ background: "white" }}
          >
            <Table
              striped
              hover
              bordered
              className="mb-0"
              style={{ minWidth: "700px" }}
            >
              <thead
                className="table-primary"
                style={{ position: "sticky", top: 0, zIndex: 1 }}
              >
                <tr>
                  <th>#</th>
                  <th>Officer Name</th>
                  <th>Email</th>
                  <th>Camp Name</th>
                  <th>Place</th>
                  <th>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {assignedOfficers.length > 0 ? (
                  assignedOfficers.map((officer, idx) => (
                    <tr key={officer._id}>
                      <td>{idx + 1}</td>
                      <td>{officer.campOfficerId?.name || "N/A"}</td>
                      <td>{officer.campOfficerId?.email || "N/A"}</td>
                      <td>{officer.campId?.name || "N/A"}</td>
                      <td>{officer.campId?.place || "N/A"}</td>
                      <td>
                        {new Date(officer.assignDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-muted py-4 fst-italic"
                    >
                      No assigned officers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AssignCOfficer;
