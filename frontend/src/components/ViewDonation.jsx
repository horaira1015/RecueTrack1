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

      // Update frontend data
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
    <div style={{ minHeight: "100vh", backgroundColor: "#141414", padding: "40px", color: "white" }}>
      <div style={{ maxWidth: "90%", margin: "0 auto", background: "#1F1F1F", padding: "20px", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", color: "#1E90FF", marginBottom: "20px" }}>
          Donations List
        </h2>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#1E90FF", color: "black" }}>
                {["#", "Name", "Email", "Amount (₹)", "Spent (₹)", "Balance (₹)", "Message", "Actions"].map((header) => (
                  <th key={header} style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #333" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation, index) => (
                  <tr key={donation._id} style={{ background: index % 2 === 0 ? "#222" : "#333", transition: "background 0.3s" }}>
                    <td style={{ padding: "12px", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{donation.name}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{donation.email}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>₹{donation.amount}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {donation.money_Spent_For.map((item, i) => (
                        <div key={i}>
                          {item.For}: ₹{item.amount}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>₹{donation.balance_amount}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{donation.message || "—"}</td>
                    <td>
                      {editingId === donation._id ? (
                        <div>
                          <input
                            type="text"
                            placeholder="Spent For"
                            value={editedData.moneySpentFor}
                            onChange={(e) => handleChange(e, "moneySpentFor")}
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={editedData.moneySpent}
                            onChange={(e) => handleChange(e, "moneySpent")}
                          />
                          <button onClick={() => handleSaveEdit(donation._id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(donation)}>Edit</button>
                          <button onClick={() => handleDelete(donation._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No donations found.</td>
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
