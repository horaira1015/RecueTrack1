import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Card } from "react-bootstrap";
import axios from "axios";

function CampReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  axios.get("http://localhost:5553/api/campstatus/getAll")
    .then((res) => {
      setReports(res.data.statuses); // ✅ extract the array
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching reports:", err);
      setLoading(false);
    });
}, []);


  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#2c3e50" }}>
          📋 All Camp Reports
        </h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : reports.length > 0 ? (
          <Table striped bordered hover responsive className="text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>🏕️ Camp Name</th>
                <th>👮 Officer Name</th>
                <th>📝 Report</th>
                <th>📅 Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.campId?.name || "N/A"}</td>
                  <td>{report.officerId?.name || "N/A"}</td>
                  <td>{report.report}</td>
                  <td>{new Date(report.date).toLocaleString("en-GB", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center text-muted">No reports found.</div>
        )}
      </Card>
    </Container>
  );
}

export default CampReports;
