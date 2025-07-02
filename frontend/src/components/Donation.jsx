import React, { useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DonationSlip = () => {
  const slipRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const generatePDF = async () => {
    if (isDisabled) return;
    setIsDisabled(true);

    const slipElement = slipRef.current;
    if (!slipElement) {
      alert("Error: Unable to find the slip.");
      setIsDisabled(false);
      return;
    }

    try {
      await axios.post("http://localhost:5553/api/donate/donations", {
        name,
        email,
        amount,
        message,
      });

      const canvas = await html2canvas(slipElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      const pdfBlob = pdf.output("blob");

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const pdfData = reader.result.split(",")[1];
        await axios.post("http://localhost:5553/api/cofficerReg/email", {
          email,
          pdfData,
        });
        alert("Donation successful! Receipt sent to your email.");
        window.history.back();
      };
    } catch (error) {
      alert("Error processing donation.");
      setIsDisabled(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            textAlign: "center",
            color: "#0d47a1",
            marginBottom: "1.5rem",
          }}
        >
          💖 Donate with Love
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <InputField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
          />
          <InputField
            label="Donation Amount (Taka)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            type="number"
          />
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#0d47a1" }}>
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #90caf9",
                borderRadius: "8px",
                fontSize: "14px",
                marginTop: "5px",
                resize: "none",
              }}
              rows={3}
              placeholder="Write a kind note..."
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ fontWeight: "500", color: "#0d47a1", marginBottom: "8px" }}>
            📱 Scan this QR to Pay
          </p>
          <img
            src="http://localhost:5553/uploads/gpay_qr.jpeg"
            alt="QR Code"
            style={{
              width: "100px",
              height: "100px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              marginBottom: "6px",
            }}
          />
          <p style={{ fontSize: "12px", color: "#888" }}>
            After scanning, enter the amount you paid above.
          </p>
        </div>

        <button
          onClick={generatePDF}
          disabled={isDisabled}
          style={{
            width: "100%",
            marginTop: "1.5rem",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isDisabled ? "#90caf9" : "#1976d2",
            color: isDisabled ? "#555" : "#fff",
            cursor: isDisabled ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {isDisabled ? "Processing..." : "Donate Now"}
        </button>
      </div>

      {/* Hidden Receipt */}
      <div >
        <div
          ref={slipRef}
          style={{
            padding: "20px",
            backgroundColor: "#ffffff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "400px",
            textAlign: "center",
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0d47a1" }}>
            Donation Receipt
          </h2>
          <p style={{ marginTop: "10px", color: "#333" }}>Donor: {name}</p>
          <p style={{ color: "#333" }}>Email: {email}</p>
          <p style={{ color: "#333" }}>Amount: Taka{amount}</p>
          {message && (
            <p style={{ color: "#555", fontStyle: "italic" }}>Message: {message}</p>
          )}
          <p style={{ marginTop: "16px", fontSize: "13px", color: "#888" }}>
            Thank you for your kindness! 🌸
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label style={{ fontSize: "14px", fontWeight: "600", color: "#0d47a1" }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        marginTop: "5px",
        borderRadius: "8px",
        border: "1px solid #90caf9",
      }}
      placeholder={placeholder}
    />
  </div>
);

export default DonationSlip;
