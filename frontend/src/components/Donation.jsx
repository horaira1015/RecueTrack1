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
  const [donationSuccess, setDonationSuccess] = useState(false);

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
        setDonationSuccess(true);
      };
    } catch (error) {
      alert("Error processing donation.");
      setIsDisabled(false);
    }
  };

  if (donationSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#ffffff",
            padding: "2.5rem",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#e3f2fd",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1976d2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1976d2",
              marginBottom: "1rem",
            }}
          >
            Donation Successful!
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#555",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            Thank you, {name}, for your generous donation of Taka {amount}. Your
            receipt has been sent to {email}.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 4px 6px rgba(25, 118, 210, 0.2)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#e3f2fd",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1976d2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "#0d47a1",
              marginBottom: "0.5rem",
            }}
          >
            Support Our Cause
          </h1>
          <p style={{ color: "#666", fontSize: "15px" }}>
            Your contribution makes a real difference
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
          <InputField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
          <InputField
            label="Donation Amount (Taka)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            type="number"
            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#0d47a1",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Message (Optional)
            </label>
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s",
                ":hover": {
                  borderColor: "#90caf9",
                },
              }}
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "14px",
                  border: "none",
                  borderRadius: "8px",
                  resize: "none",
                  minHeight: "100px",
                  outline: "none",
                }}
                placeholder="Write a kind note..."
              />
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "2rem 0 1.5rem",
            padding: "1.5rem 0",
            borderTop: "1px solid #eee",
            borderBottom: "1px solid #eee",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              color: "#0d47a1",
              marginBottom: "12px",
              fontSize: "15px",
            }}
          >
            Scan to donate via mobile payment
          </p>
          <div
            style={{
              display: "inline-block",
              padding: "12px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
              marginBottom: "12px",
            }}
          >
            <img
              src="http://localhost:5553/uploads/gpay_qr.jpeg"
              alt="QR Code"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
              }}
            />
          </div>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>
            After payment, please enter the amount above
          </p>
        </div>

        <button
          onClick={generatePDF}
          disabled={isDisabled}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isDisabled ? "#bbdefb" : "#1976d2",
            color: "#fff",
            cursor: isDisabled ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            boxShadow: "0 4px 6px rgba(25, 118, 210, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseOver={(e) =>
            !isDisabled && (e.target.style.backgroundColor = "#1565c0")
          }
          onMouseOut={(e) =>
            !isDisabled && (e.target.style.backgroundColor = "#1976d2")
          }
        >
          {isDisabled ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Donate Now
            </>
          )}
        </button>
      </div>

      {/* Hidden Receipt */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div
          ref={slipRef}
          style={{
            padding: "24px",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            width: "400px",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid #eee",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#1976d2",
                marginBottom: "4px",
              }}
            >
              Donation Receipt
            </h2>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Thank you for your generous support
            </p>
          </div>
          <div
            style={{
              textAlign: "left",
              marginBottom: "20px",
              lineHeight: "1.8",
            }}
          >
            <p style={{ color: "#333" }}>
              <strong>Donor:</strong> {name}
            </p>
            <p style={{ color: "#333" }}>
              <strong>Email:</strong> {email}
            </p>
            <p style={{ color: "#333" }}>
              <strong>Amount:</strong> Taka {amount}
            </p>
            {message && (
              <p style={{ color: "#555", marginTop: "12px" }}>
                <strong>Message:</strong> {message}
              </p>
            )}
          </div>
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid #eee",
            }}
          >
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
              Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
            <p style={{ fontSize: "14px", color: "#1976d2", fontWeight: "600" }}>
              Thank you for your kindness! ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text", icon }) => (
  <div>
    <label
      style={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#0d47a1",
        display: "block",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>
    <div
      style={{
        position: "relative",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        transition: "all 0.3s",
        ":hover": {
          borderColor: "#90caf9",
        },
      }}
    >
      {icon && (
        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#90caf9",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={icon} />
          </svg>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: icon ? "12px 12px 12px 40px" : "12px",
          fontSize: "14px",
          border: "none",
          borderRadius: "8px",
          outline: "none",
        }}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default DonationSlip;