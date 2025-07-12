import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewDonations = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    amount: 0,
    message: "",
    moneySpentFor: "",
    moneySpent: 0,
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/donate/donations");
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to fetch donations. Please try again later.");
    }
  };

  const handleEditClick = (donation) => {
    setEditingId(donation._id);
    setEditedData({
      name: donation.name,
      email: donation.email,
      amount: donation.amount,
      message: donation.message || "",
      moneySpentFor: "",
      moneySpent: 0,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5553/api/donate/donations/${id}`, {
        moneySpent: Number(editedData.moneySpent),
        moneySpentFor: editedData.moneySpentFor,
      });

      setDonations(
        donations.map((donation) =>
          donation._id === id
            ? {
                ...donation,
                money_Spent: donation.money_Spent + Number(editedData.moneySpent),
                money_Spent_For: [
                  ...donation.money_Spent_For,
                  { For: editedData.moneySpentFor, amount: Number(editedData.moneySpent) },
                ],
                balance_amount: donation.amount - (donation.money_Spent + Number(editedData.moneySpent)),
              }
            : donation
        )
      );

      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error("Error updating donation:", error);
      setError("Failed to update donation. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5553/api/donate/donations/${id}`);
      setDonations(donations.filter((donation) => donation._id !== id));
    } catch (error) {
      console.error("Error deleting donation:", error);
      setError("Failed to delete donation. Try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "95%", margin: "auto", backgroundColor: "#fff", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#003366", fontSize: "28px", marginBottom: "25px" }}>
          Donation Management Panel
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#003366", color: "#fff" }}>
                {["#", "Name", "Email", "Amount", "Spent", "Balance", "Message", "Actions"].map((header) => (
                  <th key={header} style={{ padding: "12px", textAlign: "center", border: "1px solid #ccc" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation, index) => (
                  <tr key={donation._id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{index + 1}</td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{donation.name}</td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{donation.email}</td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>৳{donation.amount}</td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                      {donation.money_Spent_For.map((item, i) => (
                        <div key={i}>{item.For}: ৳{item.amount}</div>
                      ))}
                    </td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>৳{donation.balance_amount}</td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>{donation.message || "—"}</td>
                    <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                      {editingId === donation._id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <input
                            type="text"
                            placeholder="Spent For"
                            value={editedData.moneySpentFor}
                            onChange={(e) => handleChange(e, "moneySpentFor")}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={editedData.moneySpent}
                            onChange={(e) => handleChange(e, "moneySpent")}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                          />
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              onClick={() => handleSaveEdit(donation._id)}
                              style={{ backgroundColor: "#28a745", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{ backgroundColor: "#6c757d", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <button
                            onClick={() => handleEditClick(donation)}
                            style={{ backgroundColor: "#ffc107", color: "#000", padding: "6px 10px", border: "none", borderRadius: "4px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(donation._id)}
                            style={{ backgroundColor: "#dc3545", color: "#fff", padding: "6px 10px", border: "none", borderRadius: "4px" }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    No donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewDonations;
