import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CreateDisaster = () => {
  const [form, setForm] = useState({ name: "", location: "", description: "", leaderId: "" });
  const [leaders, setLeaders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5553/api/leaders/get").then(res => {
      const availableLeaders = res.data.filter(l => l.assignedDisasters.length === 0);
      setLeaders(availableLeaders);
    });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("http://localhost:5553/api/disasters/create", form);
      setMessage("✅ Disaster created!");
      setForm({ name: "", location: "", description: "", leaderId: "" });
    } catch {
      setMessage("❌ Error creating disaster.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundElements}>
        <div style={styles.gradientOrb1}></div>
        <div style={styles.gradientOrb2}></div>
        <div style={styles.gradientOrb3}></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style={styles.title}>Create New Disaster</h2>
          <p style={styles.subtitle}>Coordinate emergency response efforts</p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.messageContainer}
          >
            <p style={styles.message}>{message}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Disaster Name</label>
            <input 
              placeholder="e.g. First response for earthquake" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location</label>
            <input 
              placeholder="e.g. Dhaka, Comilla, Chittagong" 
              value={form.location} 
              onChange={e => setForm({ ...form, location: e.target.value })} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea 
              placeholder="Provide detailed information about the disaster and response requirements..." 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              style={styles.textarea}
              rows="4"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Response Leader</label>
            <select 
              value={form.leaderId} 
              onChange={e => setForm({ ...form, leaderId: e.target.value })} 
              required 
              style={styles.select}
            >
              <option value="">Choose a leader...</option>
              {leaders.map(l => (
                <option key={l._id} value={l._id}>
                  {l.name} ({l.email})
                </option>
              ))}
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            style={styles.button}
            onMouseEnter={e => e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
            onMouseLeave={e => e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Create Disaster Response
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #ebecefff 0%, #c6aae1ff 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  gradientOrb1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite'
  },
  gradientOrb2: {
    position: 'absolute',
    bottom: '-15%',
    right: '-15%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'float 8s ease-in-out infinite reverse'
  },
  gradientOrb3: {
    position: 'absolute',
    top: '50%',
    left: '80%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'float 10s ease-in-out infinite'
  },
  card: { 
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
    width: '100%',
    maxWidth: '550px',
    border: '1px solid rgba(255,255,255,0.2)',
    position: 'relative',
    zIndex: 1
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    color: 'white',
    marginBottom: '16px'
  },
  title: { 
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    fontWeight: '500'
  },
  messageContainer: {
    marginBottom: '24px',
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(72, 187, 120, 0.1)',
    border: '1px solid rgba(72, 187, 120, 0.2)'
  },
  message: { 
    textAlign: 'center',
    color: '#2f855a',
    fontWeight: '600',
    margin: 0
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '4px'
  },
  input: { 
    padding: '16px 20px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    background: 'white',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    outline: 'none',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  textarea: {
    padding: '16px 20px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    background: 'white',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    minHeight: '120px'
  },
  select: {
    padding: '16px 20px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    background: 'white',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    outline: 'none',
    cursor: 'pointer'
  },
  button: { 
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
    marginTop: '8px'
  }
};

// Add CSS animation keyframes
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  input:focus, textarea:focus, select:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default CreateDisaster;