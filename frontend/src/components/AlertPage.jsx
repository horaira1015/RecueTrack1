import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminEmailPage = () => {
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5553/api/campreg/getCamp")
      .then((res) => setCamps(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDisasterEmail = async () => {
    try {
      await axios.post("http://localhost:5553/api/email/disaster", { place, description });
      alert("Disaster email sent!");
      setPlace("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Failed to send disaster email.");
    }
  };

  const handleOutOfStockEmail = async () => {
    try {
      await axios.post("http://localhost:5553/api/email/out-of-stock", {
        campId: selectedCamp,
        item,
        quantity,
      });
      alert("Out of stock email sent!");
      setSelectedCamp("");
      setItem("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to send out of stock email.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right,rgb(191, 223, 239), #e1bee7)",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: "40px",
        }}
      >
        <h1 style={{ fontSize: "30px", textAlign: "center", color: "#1a237e", marginBottom: "30px" }}>
          ⚠️ Admin Alert Center
        </h1>

        {/* Disaster Alert Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "20px", color: "#0288d1", marginBottom: "20px" }}>🚨 Send Disaster Alert</h2>

          <input
            type="text"
            placeholder="Enter Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          />

          <textarea
            placeholder="Enter Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          />

          <button
            onClick={handleDisasterEmail}
            style={{
              width: "100%",
              backgroundColor: "#0288d1",
              color: "white",
              padding: "14px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
          >
            Send Disaster Alert
          </button>
        </div>

        <hr style={{ marginBottom: "40px", borderColor: "#ccc" }} />

        {/* Out of Stock Section */}
        <div>
          <h2 style={{ fontSize: "20px", color: "#d32f2f", marginBottom: "20px" }}>📦 Send Out of Stock Alert</h2>

          <select
            value={selectedCamp}
            onChange={(e) => setSelectedCamp(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          >
            <option value="">Select Camp</option>
            {camps.map((camp) => (
              <option key={camp._id} value={camp._id}>
                {camp.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Item Name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          />

          <input
            type="number"
            placeholder="Quantity Needed"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          />

          <button
            onClick={handleOutOfStockEmail}
            style={{
              width: "100%",
              backgroundColor: "#d32f2f",
              color: "white",
              padding: "14px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
          >
            Send Out of Stock Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailPage;
