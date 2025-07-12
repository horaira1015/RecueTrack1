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
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.card}>
        <h2 style={styles.title}>Create New Disaster</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input placeholder="Disaster Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={styles.input} />
          <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required style={styles.input} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={styles.input} />
          <select value={form.leaderId} onChange={e => setForm({ ...form, leaderId: e.target.value })} required style={styles.input}>
            <option value="">Select Leader</option>
            {leaders.map(l => <option key={l._id} value={l._id}>{l.name} ({l.email})</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={styles.button}>Create</motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4f8' },
  card: { background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' },
  title: { textAlign: 'center', fontSize: '22px', marginBottom: '20px', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', fontSize: '14px', borderRadius: '8px', border: '1px solid #ccc' },
  button: { padding: '12px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  message: { textAlign: 'center', marginBottom: '15px', color: '#2f855a' }
};

export default CreateDisaster;
