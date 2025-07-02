import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For error display
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
        setErrorMessage("Please enter both email and password.");
        return;
    }

    if (email === "admin@gmail.com" && password === "admin123") {
        alert("Welcome, Admin!");
        navigate('/AdminDashboard');
        return;
    }

    try {
      const res = await axios.post("http://localhost:5553/api/auth/campofficer", 
        { email, password },
        { withCredentials: true }
      );
      
      console.log("Full API Response:", res.data);  // Debug response
      
      if (res.data.success && res.data.campOfficerId) {
          console.log("✅ officerId received:", res.data.campOfficerId); // Debug officerId
          localStorage.setItem("officerId", res.data.campOfficerId);
          navigate("/COfficerDashboard");
      } else {
          console.error("❌ Login failed, response:", res.data);
          setErrorMessage(res.data.message || "Invalid login credentials. Please try again.");
      }
      
    } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("An error occurred. Please try again.");
    }
};


  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 vw-100">
      <div className="bg-white p-4 rounded w-25 shadow">
        <h2 className="text-center"> Camp Officer Login</h2>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>

        <p className="mt-3 text-center">
          Medical officer Login <Link to='/Login' className="text-dark font-weight-bold">Login</Link>
        </p>
        <p className="text-center">
          Forgot Password? <Link to='/forgot-password' className="text-dark font-weight-bold">Click here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;