import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CampDetails = () => {
  const { campId } = useParams();
  const navigate = useNavigate();

  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campOfficers, setCampOfficers] = useState([]);
  const [medicalOfficers, setMedicalOfficers] = useState([]);
  const [selectedCampOfficer, setSelectedCampOfficer] = useState("");
  const [selectedMedicalOfficer, setSelectedMedicalOfficer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campRes = await axios.get(`http://localhost:5553/api/camps/get/${campId}`);
        setCamp(campRes.data);
        console.log("debug:");
        console.log("Camp data:", campRes.data);

        if (campRes.data.campOfficer) {
          setSelectedCampOfficer(campRes.data.campOfficer._id);
        }
        if (campRes.data.medicalOfficer) {
          setSelectedMedicalOfficer(campRes.data.medicalOfficer._id);
        }

        const [campOfficerRes, medicalOfficerRes] = await Promise.all([
          axios.get(`http://localhost:5553/api/cofficerReg/get`),
          axios.get(`http://localhost:5553/api/medicaloffReg/get`)
        ]);
        console.log("Camp Officers:", campOfficerRes.data);
        console.log("Medical Officers:", medicalOfficerRes.data);
        setCampOfficers(campOfficerRes.data);
        setMedicalOfficers(medicalOfficerRes.data);
      } catch (err) {
        console.error("Failed to fetch camp details or officers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campId]);

  const handleAssignCampOfficer = async () => {
    if (!selectedCampOfficer) {
      setMessage("❌ Please select a camp officer to assign.");
      return;
    }

    try {
      await axios.put(`http://localhost:5553/api/assigncofficer/assign/${selectedCampOfficer}`, {
        campId,
      });

      setMessage("✅ Camp Officer assigned successfully!");

      const updatedCamp = await axios.get(`http://localhost:5553/api/camps/get/${campId}`);
      setCamp(updatedCamp.data);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.error || "Failed to assign camp officer"}`);
    }
  };

  const handleAssignMedicalOfficer = async () => {
    if (!selectedMedicalOfficer) {
      setMessage("❌ Please select a medical officer to assign.");
      return;
    }

    try {
      await axios.put(`http://localhost:5553/api/assignmofficer/assign/${selectedMedicalOfficer}`, {
        campId,
      });

      setMessage("✅ Medical Officer assigned successfully!");

      const updatedCamp = await axios.get(`http://localhost:5553/api/camps/get/${campId}`);
      setCamp(updatedCamp.data);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.error || "Failed to assign medical officer"}`);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading camp details...</div>;
  }

  if (!camp) {
    return <div style={styles.error}>Camp not found</div>;
  }

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.card}
      >
        <h2 style={styles.heading}>🏕️ Camp: {camp.name}</h2>

        <div style={styles.section}>
          <h3 style={styles.subheading}>📌 Camp Information</h3>
          <div style={styles.infoGrid}>
            <p><strong>Place:</strong> {camp.place}</p>
            <p><strong>District:</strong> {camp.district}</p>
            <p><strong>Total Capacity:</strong> {camp.totalCapacity}</p>
            <p><strong>Status:</strong> {camp.status}</p>
          </div>

        </div>

        <div style={styles.section}>
          <h3 style={styles.subheading}>✅ Current Assigned Officers</h3>
          <div style={styles.currentBox}>

            <div style={styles.currentBox}>
              <div style={styles.officerBox}>
                <h4>👮 Camp Officer</h4>
                {camp.campOfficer && camp.campOfficer.length > 0 ? (
                  <ul>
                    {camp.campOfficer.map((officer) => (
                      <li key={officer._id || officer.id}>
                        {officer.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={styles.unassigned}>No camp officers assigned yet</p>
                )}
              </div>

              <div style={styles.officerBox}>
                <h4>👨‍⚕️ Medical Officer</h4>
                {camp.medicalOfficer && camp.medicalOfficer.length > 0 ? (
                  <ul>
                    {camp.medicalOfficer.map((officer) => (
                      <li key={officer._id || officer.id}>
                        {officer.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={styles.unassigned}>No medical officers assigned yet</p>
                )}
              </div>
            </div>

          </div>
        </div>


        <div style={styles.section}>
          <h3 style={styles.subheading}>👮 Assign New Camp Officer</h3>
          <div style={styles.infoBox}>
            <select
              value={selectedCampOfficer}
              onChange={(e) => setSelectedCampOfficer(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Camp Officer</option>
              {campOfficers.map((officer) => (
                <option key={officer._id} value={officer._id}>
                  {officer.name} ({officer.email})
                </option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={styles.submitBtn}
              onClick={handleAssignCampOfficer}
            >
              Assign Camp Officer
            </motion.button>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subheading}>👨‍⚕️ Assign New Medical Officer</h3>
          <div style={styles.infoBox}>
            <select
              value={selectedMedicalOfficer}
              onChange={(e) => setSelectedMedicalOfficer(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Medical Officer</option>
              {medicalOfficers.map((officer) => (
                <option key={officer._id} value={officer._id}>
                  {officer.name} ({officer.email})
                </option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={styles.submitBtn}
              onClick={handleAssignMedicalOfficer}
            >
              Assign Medical Officer
            </motion.button>
          </div>
        </div>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: "15px",
              color: message.startsWith("✅") ? "#2F855A" : "#C53030",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ⬅ Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    background: "linear-gradient(to right, #edf2f7, #e2e8f0)",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "850px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#2d3748",
    marginBottom: "20px",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "10px",
  },
  subheading: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2c5282",
    marginBottom: "10px",
  },
  section: {
    marginBottom: "30px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    padding: "15px",
    backgroundColor: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },
  currentBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    backgroundColor: "#fefcbf",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ecc94b",
  },
  officerBox: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#fff9db",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "500",
    color: "#744210",
  },
  infoBox: {
    backgroundColor: "#f0f4f8",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "15px",
    marginBottom: "15px",
  },
  unassigned: {
    color: "#a0aec0",
    fontStyle: "italic",
  },
  submitBtn: {
    backgroundColor: "#3182ce",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    fontSize: "15px",
  },
  backButton: {
    backgroundColor: "#e2e8f0",
    color: "#2d3748",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginTop: "25px",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#4a5568",
  },
  error: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#e53e3e",
  },
};

export default CampDetails;
