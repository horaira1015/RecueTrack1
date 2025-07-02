
import CoNavbar from "./CoNavbar";
import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const campId = localStorage.getItem("campId"); 

  useEffect(() => {

    if (!campId) {
      setError("Camp ID not found!");
      setLoading(false);
      return;
    }

    console.log("Fetching inventory for campId:", campId);

    const fetchInventory = async () => {
  const campId = localStorage.getItem("campId");
  if (!campId) {
    console.error("Camp ID not found!");
    return;
  }

  console.log("Fetching inventory for campId:", campId);

  try {
    const response = await axios.get(`http://localhost:5553/api/inventory/getinventory/${campId}`);
    console.log("Fetched Inventory:", response.data);
    setInventory(response.data);
  } catch (err) {
    console.error("Failed to fetch inventory:", err.response?.data || err.message);
  }
};

    

    fetchInventory();
  }, [campId]);

  const updateStatus = async (itemId, status) => {
    try {
      await axios.put(`http://localhost:5553/api/inventory/items/${itemId}`, { status });
      setInventory(inventory.map(item => item._id === itemId ? { ...item, status } : item));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p style={{ textAlign: "center", fontSize: "18px" }}>Loading inventory...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (

    <><CoNavbar/>
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Category</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Description</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Total Quantity</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Status</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{item.categoryId.name}</td>
              <td style={{ padding: "10px" }}>{item.description}</td>
              <td style={{ padding: "10px" }}>{item.totalQuantity}</td>
              <td style={{ padding: "10px", fontWeight: "bold", color: item.status === "Out of Stock" ? "red" : item.status === "Low Stock" ? "orange" : "green" }}>
                {item.status}
              </td>
              <td style={{ padding: "10px" }}>
                <select 
                  value={item.status} 
                  onChange={(e) => updateStatus(item._id, e.target.value)}
                  style={{ padding: "5px", fontSize: "14px", cursor: "pointer" }}
                >
                  <option value="Available">Available</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </>
  );
};

export default InventoryPage;
