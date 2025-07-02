import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Card, Badge } from "react-bootstrap";
import axios from "axios";

function VictimsOverview() {
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5553/api/victims/victimsoverview")
      .then((res) => {
        setVictims(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching victims:", err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Stable":
        return <Badge bg="success">Stable</Badge>;
      case "Injured":
        return <Badge bg="warning" text="dark">Injured</Badge>;
      case "Critical":
        return <Badge bg="danger">Critical</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="text-center mb-4">🧍‍♂️ Victims Overview</h3>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : victims.length > 0 ? (
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-dark">
                <tr>
                  <th>Victim Name</th>
                  <th>Camp</th>
                  <th>Health Status</th>
                  <th>Family Members</th>
                </tr>
              </thead>
              <tbody>
                {victims.map((v) => (
                  <tr key={v._id}>
                    <td>{v.name}</td>
                    <td>{v.campId?.name || <em>Not Assigned</em>}</td>
                    <td>{getStatusBadge(v.healthStatus)}</td>
                    <td>
                      {v.familyDetails?.length > 0 ? (
                        <ul className="list-unstyled mb-0 text-start ps-3">
                          {v.familyDetails.map((member, idx) => (
                            <li key={idx}>
                              {member.name} - {getStatusBadge(member.healthStatus)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center text-muted">No victim data found.</div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default VictimsOverview;
