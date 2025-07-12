import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ViewDisasters = () => {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5553/api/disasters/getall").then(res => setDisasters(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Disasters</h2>
      {disasters.map(d => (
        <motion.div key={d._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={styles.card}>
          <h3>{d.name}</h3>
          <p><b>Location:</b> {d.location}</p>
          <p><b>Description:</b> {d.description}</p>
          <p><b>Leader:</b> {d.leader?.name || "N/A"} ({d.leader?.email || "N/A"})</p>
        </motion.div>
      ))}
    </div>
  );
};

const styles = {
  container: { padding: '30px', background: '#f7fafc', minHeight: '100vh' },
  title: { fontSize: '24px', marginBottom: '20px', fontWeight: '700' },
  card: { background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px' }
};

export default ViewDisasters;
