import React, { useEffect, useState } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import axios from "axios";

function CampReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5553/api/campstatus/getAll")
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">All Camp Reports</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : reports.length > 0 ? (
        <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Camp Name</th>
      <th>Officer Name</th>
      <th>Report</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    {reports.map((report) => (
      <tr key={report._id}>
        <td>{report.campId?.name || "N/A"}</td>
        <td>{report.officerId?.name || "N/A"}</td>
        <td>{report.report}</td>
        <td>{new Date(report.date).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</Table>

      ) : (
        <div className="text-center text-muted">No reports found.</div>
      )}
    </Container>
  );
}

export default CampReports;
