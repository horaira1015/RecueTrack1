import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import CoNavbar from "./CoNavbar";

function VictimList() {
  const [victims, setVictims] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const nodeRefs = useRef({});

  useEffect(() => {
    const fetchVictims = async () => {
      const officerId = localStorage.getItem("officerId");
      if (!officerId) {
        console.error("No officerId found!");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5553/api/victims/getbycamp/${officerId}`);
        console.log("Victims:", response.data);
        setVictims(response.data);
      } catch (error) {
        console.error("Error fetching victims:", error.response?.data || error.message);
      }
    };

    fetchVictims();
  }, []);

  const toggleFamilyDetails = (victimId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [victimId]: !prevState[victimId],
    }));
  };

  return (
    <>
      <CoNavbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Registered Victims</h2>
        {message && <div style={styles.alert}>{message}</div>}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Gender</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Health Status</th>
              <th style={styles.th}>Family Members</th>
              <th style={styles.th}>Special Needs</th>
            </tr>
          </thead>
          <tbody>
            {victims.length > 0 ? (
              victims.map((victim) => {
                if (!nodeRefs.current[victim._id]) {
                  nodeRefs.current[victim._id] = React.createRef();
                }
                return (
                  <React.Fragment key={victim._id}>
                    <tr style={styles.row}>
                      <td style={styles.td}>{victim.name}</td>
                      <td style={styles.td}>{victim.age}</td>
                      <td style={styles.td}>{victim.gender}</td>
                      <td style={styles.td}>{victim.contact}</td>
                      <td style={styles.td}>{victim.address}</td>
                      <td style={styles.td}>{victim.healthStatus}</td>
                      <td
                        style={styles.clickableTd}
                        onClick={() => toggleFamilyDetails(victim._id)}
                      >
                        {victim.familyMembers}{" "}
                        <span style={styles.arrow(expandedRows[victim._id])}>▼</span>
                      </td>
                      <td style={styles.td}>{victim.specialNeeds}</td>
                    </tr>

                    <TransitionGroup component={null}>
                      {expandedRows[victim._id] && (
                        <CSSTransition
                          key={victim._id}
                          timeout={300}
                          classNames="fade"
                          nodeRef={nodeRefs.current[victim._id]}
                        >
                          <tr ref={nodeRefs.current[victim._id]} style={styles.familyRow}>
                            <td colSpan="8" style={styles.familyDetails}>
                              <strong>Family Details:</strong>
                              {victim.familyDetails && victim.familyDetails.length > 0 ? (
                                <table style={styles.innerTable}>
                                  <thead>
                                    <tr>
                                      <th style={styles.th}>Name</th>
                                      <th style={styles.th}>Age</th>
                                      <th style={styles.th}>Relationship</th>
                                      <th style={styles.th}>Health Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {victim.familyDetails.map((member, index) => (
                                      <tr key={index} style={styles.row}>
                                        <td style={styles.td}>{member.name}</td>
                                        <td style={styles.td}>{member.age}</td>
                                        <td style={styles.td}>{member.relationship}</td>
                                        <td style={styles.td}>{member.healthStatus}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p style={styles.noFamilyDetails}>No family details available</p>
                              )}
                            </td>
                          </tr>
                        </CSSTransition>
                      )}
                    </TransitionGroup>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={styles.noData}>No victims found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Inline styles object
const styles = {
  container: {
    width: "90%",
    margin: "30px auto",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  alert: {
    backgroundColor: "#ffdddd",
    color: "#a94442",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px",
    textAlign: "left",
  },
  row: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.3s",
  },
  td: {
    padding: "10px",
  },
  clickableTd: {
    padding: "10px",
    cursor: "pointer",
    color: "#007bff",
    textDecoration: "underline",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  arrow: (expanded) => ({
    transition: "transform 0.3s",
    display: "inline-block",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  }),
  familyRow: {
    backgroundColor: "#f8f9fa",
  },
  familyDetails: {
    padding: "15px",
    borderLeft: "5px solid #007bff",
  },
  innerTable: {
    width: "100%",
    marginTop: "10px",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  },
  noFamilyDetails: {
    color: "gray",
    fontStyle: "italic",
  },
  noData: {
    textAlign: "center",
    padding: "15px",
    color: "#666",
  },
};

export default VictimList;
