import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const DonationSuccess = () => {
  const slipRef = useRef();
  const [params] = useSearchParams();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const name = params.get("name") || "";
  const email = params.get("email") || "";
  const amount = params.get("amount") || "";
  const message = params.get("message") || "";

  const hasSentEmail = useRef(false);

  useEffect(() => {
    const generatePDFAndSendEmail = async () => {
      if (!email) {
        setError("No email provided.");
        return;
      }

      const slipElement = slipRef.current;
      if (!slipElement) {
        setError("Receipt element not found.");
        return;
      }

      try {
        const canvas = await html2canvas(slipElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#fff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

        const pdfBlob = pdf.output("blob");
        const reader = new FileReader();

        reader.readAsDataURL(pdfBlob);
        reader.onloadend = async () => {
          const base64Pdf = reader.result.split(",")[1];

          await axios.post("http://localhost:5553/api/cofficerReg/email", {
            email,
            pdfData: base64Pdf,
          });

          setEmailSent(true);
        };
      } catch (err) {
        setError("Failed to generate/send PDF receipt.");
        console.error(err);
      }
    };

    if (!hasSentEmail.current && email) {
      hasSentEmail.current = true;
      generatePDFAndSendEmail();
    }
  }, [email]);

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
          maxWidth: "480px",
          backgroundColor: "#fff",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#1976d2", marginBottom: "1rem" }}>
          Donation Successful!
        </h1>
        <p style={{ fontSize: "16px", color: "#555", marginBottom: "2rem" }}>
          Thank you, <strong>{name}</strong>, for your generous donation of BDT{" "}
          <strong>{amount}</strong>.
        </p>

        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>Error: {error}</p>
        )}

        {!error && !emailSent && (
          <p style={{ color: "#777" }}>Sending your receipt to {email}...</p>
        )}

        {emailSent && (
          <p style={{ color: "green" }}>
            Receipt sent successfully to <strong>{email}</strong>.
          </p>
        )}

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: "2rem",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#1976d2",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(25, 118, 210, 0.2)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
        >
          Return to Home
        </button>

        {/* Offscreen receipt for PDF generation */}
        <div
          ref={slipRef}
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            width: "400px",
            padding: "24px",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            fontFamily: "'Inter', sans-serif",
            textAlign: "left",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#1976d2",
              marginBottom: "10px",
            }}
          >
            Donation Receipt
          </h2>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Amount:</strong> BDT {amount}
          </p>
          {message && (
            <p>
              <strong>Message:</strong> {message}
            </p>
          )}
          <p style={{ marginTop: "20px", fontSize: "13px", color: "#888" }}>
            Transaction ID:{" "}
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
          <p style={{ color: "#1976d2", fontWeight: "600" }}>
            Thank you for your kindness! ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;
