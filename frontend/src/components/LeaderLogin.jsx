import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';

function LeaderLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5553/api/auth/leader", 
        { email, password },
        { withCredentials: true }
      );

      console.log("Full API Response:", res.data);

      if (res.data.success && res.data.leaderId) {
        console.log("✅ leaderId received:", res.data.leaderId);
        localStorage.setItem("leaderId", res.data.leaderId);
        navigate("/LeaderDashboard");
      } else {
        console.error("❌ Login failed, response:", res.data);
        setErrorMessage(res.data.message || "Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.loginCard}
      >
        <div style={styles.header}>
          <div style={styles.logo}>🧭</div>
          <h2 style={styles.title}>Leader Login</h2>
          <p style={styles.subtitle}>Access your disaster management dashboard</p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.errorMessage}
          >
            {errorMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            style={styles.loginButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
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
                  style={styles.spinner}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <div style={styles.links}>
          <Link to="/Login" style={styles.link}>Medical Officer Login</Link>
          <span style={styles.divider}>•</span>
          <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
        </div>

        <div style={styles.otherLogins}>
          <p style={styles.otherLoginsText}>Or login as:</p>
          <div style={styles.otherButtons}>
            <motion.button
              style={styles.volunteerButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/VolunteerLogin')}
            >
              Volunteer
            </motion.button>
            <motion.button
              style={styles.adminButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/AdminLogin')}
            >
              Admin
            </motion.button>
            <motion.button
              style={styles.adminButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/LeaderLogin')}
            >
              Leader
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  otherLogins: { textAlign: 'center' },
  otherButtons: { display: 'flex', gap: '12px' },
  otherLoginsText: { color: '#718096', fontSize: '14px', marginBottom: '12px' },
  adminButton: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#667eea',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  volunteerButton: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#f6ad55',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
    padding: '20px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '450px',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
  },
  errorMessage: {
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: { marginBottom: '20px' },
  formGroup: { marginBottom: '20px' },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#38a169',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
  },
  link: {
    color: '#4299e1',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },
  divider: {
    color: '#cbd5e0',
    fontSize: '14px',
  },
};

export default LeaderLogin;