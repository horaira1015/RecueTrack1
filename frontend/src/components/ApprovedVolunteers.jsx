import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbarr from "./Navbarr";

function ApprovedVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Approved Volunteers from Backend
    axios.get("http://localhost:5553/api/volunteer/approved")
      .then((response) => {
        setVolunteers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching volunteers:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Approved Volunteers</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Card className="p-3 shadow-sm">
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Assigned Camp</th>
                  <th>Skills</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length > 0 ? (
                  volunteers.map((volunteer, index) => (
                    <tr key={volunteer._id}>
                      <td>{index + 1}</td>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.email}</td>
                      <td>{volunteer.phone}</td>
                      <td>{volunteer.address}</td>
                      <td>{volunteer.campId ? volunteer.campId.name : "Not Assigned"}</td>
                      <td>{volunteer.skills || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No Approved Volunteers Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </>
  );
}

export default ApprovedVolunteers;
