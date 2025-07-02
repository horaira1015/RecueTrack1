import React, { useState } from "react";
import axios from "axios";

const DailyLogs = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("http://localhost:5553/api/dailylogs", {
        title,
        content,
      });

      if (response.status === 201) {
        setMessage("Daily log submitted successfully!");
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error submitting log:", error);
      setMessage("Failed to submit log. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Daily Logs</h2>
      {message && <p style={messageStyle}>{message}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Log Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Write your daily log..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={textareaStyle}
        ></textarea>
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "600px",
  margin: "20px auto",
  padding: "20px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "10px",
  margin: "10px 0",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const textareaStyle = {
  padding: "10px",
  margin: "10px 0",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  height: "120px",
  resize: "none",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

const messageStyle = {
  color: "green",
  fontWeight: "bold",
};

export default DailyLogs;
