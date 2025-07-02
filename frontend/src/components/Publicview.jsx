import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PublicView = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/donate/donations");
      setDonations(Array.isArray(response.data.donations) ? response.data.donations : []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to fetch donations. Please try again later.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0F8FF", padding: "40px" }}>
      <div style={{ maxWidth: "90%", margin: "0 auto", background: "#FFFFFF", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", color: "#0056b3", marginBottom: "20px" }}>
          Public Donations Overview
        </h2>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden", background: "#FAFAFA" }}>
            <thead>
              <tr style={{ background: "#0056b3", color: "white" }}>
                {["#", "Donor Name", "Donations (₹)", "Inventory Spent", "Fund Remaining (₹)"].map((header) => (
                  <th key={header} style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
  {donations.length > 0 ? (
    <>
      {donations.map((donation, index) => (
        <tr key={donation._id} style={{ background: index % 2 === 0 ? "#E3F2FD" : "#F0F8FF" }}>
          <td style={{ padding: "12px", textAlign: "center" }}>{index + 1}</td>
          <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold" }}>{donation.name}</td>
          <td style={{ padding: "12px", textAlign: "center", color: "#008000", fontWeight: "bold" }}>₹{donation.amount}</td>
          <td style={{ padding: "12px", textAlign: "center" }}>
            {donation.money_Spent_For.length > 0 ? (
              <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
                {donation.money_Spent_For.map((item, i) => (
                  <li key={i} style={{ padding: "5px 0" }}>
                    <strong>{item.For}:</strong> ₹{item.amount}
                  </li>
                ))}
              </ul>
            ) : (
              "—"
            )}
          </td>
          <td style={{ padding: "12px", textAlign: "center", color: "#D32F2F", fontWeight: "bold" }}>₹{donation.balance_amount}</td>
        </tr>
      ))}
      <tr style={{ background: "#C8E6C9" }}>
        <td colSpan="4" style={{ textAlign: "right", padding: "12px", fontWeight: "bold" }}>
          Total Remaining Funds:
        </td>
        <td style={{ textAlign: "center", padding: "12px", color: "#2E7D32", fontWeight: "bold" }}>
          ₹{donations.reduce((acc, curr) => acc + Number(curr.balance_amount || 0), 0)}
        </td>
      </tr>
    </>
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center", padding: "12px", fontSize: "16px", color: "#555" }}>No donations found.</td>
    </tr>
  )}
</tbody>

            
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <button
            onClick={() => navigate("/donate")}
            style={{
              backgroundColor: "#FF9800",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              padding: "12px 24px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#F57C00")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#FF9800")}
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
