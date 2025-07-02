import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbarr from "./Navbarr";

function ViewCampOfficer() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editOfficerId, setEditOfficerId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5553/api/cofficerReg/get");
      setOfficers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch officers. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h3 className="text-center">Camp Officers List</h3>

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
                <th>Address</th>
                <th>ID Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.length > 0 ? (
                officers.map((officer, index) => (
                  <tr key={officer._id}>
                    <td>{index + 1}</td>
                    <td>{officer.name}</td>
                    <td>{officer.email}</td>
                    <td>{officer.phone}</td>
                    <td>{officer.address}</td>
                    <td>
                      <a href={`http://localhost:5553/${officer.idProof}`} target="_blank" rel="noopener noreferrer">
                        View ID
                      </a>
                    </td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => navigate(`/assigncofficer/${officer._id}`)}>
                        Assign to Camp
                      </Button>
                      <Button variant="warning" size="sm" onClick={() => setEditOfficerId(officer._id)} className="ms-2">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => console.log("Delete logic here")} className="ms-2">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No camp officers found.
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

export default ViewCampOfficer;
