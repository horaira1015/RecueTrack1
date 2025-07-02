import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MoNavbar from "./Mnavbar";

const MedicalReportPage = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5553/api/medicalreports/getreports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching medical reports", err);
    }
  };

  const filteredReports = reports.filter((report) =>
    report.victimId.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const rows = filteredReports.map((r) => [
      r.victimId.name,
      r.diagnosis,
      r.treatment,
      r.medications,
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    const csv =
      "Name,Diagnosis,Treatment,Medications,Date\n" +
      rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "medical_reports.csv";
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const rows = filteredReports.map((r) => [
      r.victimId.name,
      r.diagnosis,
      r.treatment,
      r.medications,
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Name", "Diagnosis", "Treatment", "Medications", "Date"]],
      body: rows,
    });

    doc.save("medical_reports.pdf");
  };

  return (
    <>
      <MoNavbar />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fef9c3", // soft yellow
          padding: "40px 20px",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "30px",
              color: "#1e3a8a",
            }}
          >
            📝 Complete Medical Reports
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Search by victim name..."
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "400px",
                marginBottom: "10px",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button
                onClick={exportToPDF}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                Export PDF
              </button>
              <button
                onClick={exportToCSV}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                Export CSV
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#6366f1", color: "white" }}>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Diagnosis</th>
                  <th style={{ padding: "12px" }}>Treatment</th>
                  <th style={{ padding: "12px" }}>Medications</th>
                  <th style={{ padding: "12px" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr
                    key={report._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    <td style={{ padding: "10px" }}>{report.victimId.name}</td>
                    <td style={{ padding: "10px" }}>{report.diagnosis}</td>
                    <td style={{ padding: "10px" }}>{report.treatment}</td>
                    <td style={{ padding: "10px" }}>{report.medications}</td>
                    <td style={{ padding: "10px" }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280" }}>
                No reports found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalReportPage;
