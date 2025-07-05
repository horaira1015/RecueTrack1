import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusColors = {
  Stable: { backgroundColor: "#d1fae5", color: "#065f46" },
  Injured: { backgroundColor: "#fef3c7", color: "#92400e" },
  Critical: { backgroundColor: "#fee2e2", color: "#991b1b" },
};

const containerStyle = {
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f9fafb",
  color: "#111827",
  minHeight: "100vh",
  padding: "40px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1e3a8a",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "20px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "16px",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginBottom: "30px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontWeight: "bold",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  border: "none",
};

const pdfButton = {
  ...buttonStyle,
  backgroundColor: "#ef4444",
  color: "#fff",
};

const csvButton = {
  ...buttonStyle,
  backgroundColor: "#10b981",
  color: "#fff",
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#4338ca",
  marginBottom: "10px",
};

const victimContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  marginBottom: "40px",
};

const cardStyle = {
  width: "250px",
  padding: "16px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const nameStyle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "4px",
};

const subTextStyle = {
  fontSize: "14px",
  color: "#6366f1",
  fontWeight: "500",
  marginBottom: "12px",
};

const statusBoxStyle = {
  padding: "6px 12px",
  fontSize: "14px",
  fontWeight: "500",
  borderRadius: "20px",
  marginBottom: "12px",
  display: "inline-block",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const VictimHealthStatusPage = () => {
  const [groupedVictims, setGroupedVictims] = useState({});
  const [filteredVictims, setFilteredVictims] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVictimHealthData();
  }, []);

  const fetchVictimHealthData = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/victims/getVictims");
      const grouped = {};
      response.data.forEach((item) => {
        if (!item.isFamilyMember) {
          grouped[item._id] = { ...item, family: [] };
        } else {
          const victimId = item._id.split("-")[0];
          if (grouped[victimId]) {
            grouped[victimId].family.push(item);
          } else {
            grouped[victimId] = { family: [item] };
          }
        }
      });
      setGroupedVictims(grouped);
      setFilteredVictims(grouped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching victim health data:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      setUpdatingId(memberId);
      await axios.put(`http://localhost:5553/api/victims/update/${memberId}`, {
        healthStatus: newStatus,
      });
      fetchVictimHealthData();
    } catch (error) {
      console.error("Error updating health status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (!value) {
      setFilteredVictims(groupedVictims);
      return;
    }
    const filtered = {};
    Object.values(groupedVictims).forEach((victim) => {
      const fullList = [victim, ...(victim.family || [])];
      const matches = fullList.some((p) => p.name.toLowerCase().includes(value));
      if (matches) {
        filtered[victim._id] = victim;
      }
    });
    setFilteredVictims(filtered);
  };

  const exportToCSV = () => {
    const rows = [];
    Object.values(filteredVictims).forEach((victim) => {
      console.log(victim)
      const members = [victim, ...(victim.family || [])];
      members.forEach((person) => {
        rows.push([
          person.name,
          person.healthStatus,
          isVictim(person) ? "Victim" : "Family Member",
          victim.campId || "N/A",
        ]);
      });
      
    });
    const csvContent =
      "Name,Health Status,Type,Camp ID\n" + rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "victim_health_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableRows = [];
    Object.values(filteredVictims).forEach((victim) => {
      const members = [victim, ...(victim.family || [])];
      members.forEach((person) => {
        tableRows.push([
          person.name,
          person.healthStatus,
          isVictim(person) ? "Victim" : "Family Member",
          victim.campId || "N/A",
        ]);
      });
    });
    autoTable(doc, {
      head: [["Name", "Health Status", "Type", "Camp ID"]],
      body: tableRows,
    });
    doc.save("victim_health_data.pdf");
  };

  const isVictim = (person) => !person.isFamilyMember;

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>Loading victim data...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🩺 Victim & Health Status</h1>
      </div>

      <input
        type="text"
        placeholder="Search victims or family..."
        value={searchTerm}
        onChange={handleSearch}
        style={inputStyle}
      />

      <div style={buttonGroupStyle}>
        <button style={pdfButton} onClick={exportToPDF}>
          📄 Export PDF
        </button>
        <button style={csvButton} onClick={exportToCSV}>
          📊 Export CSV
        </button>
      </div>

      {Object.values(filteredVictims).map((victim) => (
        <div key={victim._id}>
          <h2 style={sectionTitleStyle}>
            {victim.name} {victim.campId ? `(Camp: ${victim.campId})` : ""}
          </h2>
          <div style={victimContainerStyle}>
            <PersonCard
              person={victim}
              isVictim={true}
              updatingId={updatingId}
              handleStatusChange={handleStatusChange}
            />
            {victim.family?.map((member) => (
              <PersonCard
                key={member._id}
                person={member}
                isVictim={false}
                updatingId={updatingId}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PersonCard = ({ person, isVictim, updatingId, handleStatusChange }) => {
  return (
    <div style={cardStyle}>
      <div>
        <p style={nameStyle}>{person.name}</p>
        {isVictim && <p style={subTextStyle}>(Victim)</p>}
      </div>

      <div style={{ ...statusBoxStyle, ...statusColors[person.healthStatus] }}>
        Status: {person.healthStatus}
      </div>

      <select
        value={person.healthStatus}
        onChange={(e) => handleStatusChange(person._id, e.target.value)}
        style={selectStyle}
        disabled={updatingId === person._id}
      >
        <option value="Stable">Stable</option>
        <option value="Injured">Injured</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
  );
};

export default VictimHealthStatusPage;
