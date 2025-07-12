import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbarr from "./Navbarr";

function ViewLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5553/api/leaders/get");
      setLeaders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leaders. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h3 className="text-center">Leader List</h3>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>ID Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaders.length > 0 ? (
                leaders.map((leader, index) => (
                  <tr key={leader._id}>
                    <td>{index + 1}</td>
                    <td>{leader.name}</td>
                    <td>{leader.email}</td>
                    <td>{leader.phone}</td>
                    <td>
                      <a href={`http://localhost:5553/${leader.idProof}`} target="_blank" rel="noopener noreferrer">
                        View ID
                      </a>
                    </td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => console.log("Edit logic here")}>Edit</Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => console.log("Delete logic here")}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No leaders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}

export default ViewLeaders;
