import React, { useEffect, useState } from "react";
import MoNavbar from "./Mnavbar";

const MedicalReport = () => {
  const [reports, setReports] = useState([]);
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    victimId: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    followUpDate: "",
  });

  const officerId = localStorage.getItem("MOfficerId");

  useEffect(() => {
    if (!officerId) {
      setError("Officer ID is missing.");
      setLoading(false);
      return;
    }

    // Fetch medical reports for the officer
    fetch(`http://localhost:5553/api/medicalreports/get/${officerId}`)
      .then((res) => res.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching reports:", err));

    // Fetch victims including family members
    fetch("http://localhost:5553/api/victims/getVictims")
      .then((res) => res.json())
      .then((data) => setVictims(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching victims:", err));

    setLoading(false);
  }, [officerId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!officerId) {
      setError("Officer ID is missing.");
      return;
    }

    const response = await fetch("http://localhost:5553/api/medicalreports/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, officerId }),
    });

    const data = await response.json();
    if (response.ok) {
      setReports([...reports, data.report]);
      setForm({
        victimId: "",
        diagnosis: "",
        treatment: "",
        medications: "",
        followUpDate: "",
      });
    } else {
      setError(data.message || "Error adding report");
    }
  };

  return (
    <>
      <MoNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Medical Reports</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Add Report Form */}
        <div className="card p-4 shadow-sm mb-4">
          <h4 className="mb-3">Add Medical Report</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Select Victim</label>
                <select className="form-select" name="victimId" value={form.victimId} onChange={handleChange} required>
                  <option value="">-- Select Victim --</option>
                  {victims.map((victim) => (
                    <option key={victim._id} value={victim._id}>
                      {victim.isFamilyMember
                        ? `${victim.name} (${victim.age} years) - ${victim.healthStatus} (Family of ${victim.primaryVictim})`
                        : `${victim.name} (${victim.age} years) - ${victim.healthStatus}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Diagnosis</label>
                <input type="text" className="form-control" name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Treatment</label>
                <input type="text" className="form-control" name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Medications</label>
                <input type="text" className="form-control" name="medications" placeholder="Medications" value={form.medications} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Follow-Up Date</label>
                <input type="date" className="form-control" name="followUpDate" value={form.followUpDate} onChange={handleChange} />
              </div>
              <div className="col-md-12 text-center">
                <button type="submit" className="btn btn-primary w-50">Add Report</button>
              </div>
            </div>
          </form>
        </div>

        {/* Display Reports */}
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3">Existing Reports</h4>
          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Victim Name</th>
                    <th>Diagnosis</th>
                    <th>Treatment</th>
                    <th>Medications</th>
                    <th>Follow-up Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.victimId?.name} ({report.victimId?.age} years)</td>
                      <td>{report.diagnosis}</td>
                      <td>{report.treatment}</td>
                      <td>{report.medications}</td>
                      <td>{report.followUpDate ? new Date(report.followUpDate).toDateString() : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No reports available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MedicalReport;
