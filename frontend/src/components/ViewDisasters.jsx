import React, { useEffect, useState } from "react";
import axios from "axios";
const ViewDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  useEffect(() => {
    
    axios.get("http://localhost:5553/api/disasters/getall").then(res => setDisasters(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <div style={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <h2 style={styles.title}>Disaster Management</h2>
              <p style={styles.subtitle}>Active Emergency Response Operations</p>
            </div>
          </div>
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{disasters.length}</span>
              <span style={styles.statLabel}>Total Disasters</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.cardsContainer}>
        {disasters.map((d, index) => (
          <div 
            key={d._id} 
            style={{
              ...styles.card,
              animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <div style={styles.cardIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3 style={styles.cardTitleText}>{d.name}</h3>
              </div>
              <div style={styles.priorityBadge}>
                <span style={styles.priorityDot}></span>
                Active
              </div>
            </div>

            <div style={styles.cardContent}>
              <div style={styles.infoRow}>
                <div style={styles.infoIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Location</span>
                  <span style={styles.infoValue}>{d.location}</span>
                </div>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.infoIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Description</span>
                  <span style={styles.infoValue}>{d.description}</span>
                </div>
              </div>

              <div style={styles.infoRow}>
                <div style={styles.infoIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Response Leader</span>
                  <div style={styles.leaderInfo}>
                    <span style={styles.leaderName}>{d.leader?.name || "N/A"}</span>
                    <span style={styles.leaderEmail}>{d.leader?.email || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.cardFooter}>
              <div style={styles.actionButtons}>
                <button style={styles.actionButton}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Details
                </button>
                <button style={styles.actionButtonSecondary}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    pointerEvents: 'none'
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '32px 40px',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
  },
  title: { 
    fontSize: '32px',
    fontWeight: '800',
    color: '#2d3748',
    margin: '0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: '4px 0 0 0',
    fontWeight: '500'
  },
  statsContainer: {
    display: 'flex',
    gap: '16px'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '20px 24px',
    borderRadius: '12px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    minWidth: '120px'
  },
  statNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '800',
    color: '#667eea',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '600'
  },
  cardsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '32px'
  },
  card: { 
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    animation: 'slideUp 0.6s ease-out forwards',
    opacity: 0,
    transform: 'translateY(30px)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  cardIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    color: 'white'
  },
  cardTitleText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0'
  },
  priorityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#dc2626',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  priorityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#dc2626'
  },
  cardContent: {
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  infoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '8px',
    color: '#667eea',
    flexShrink: 0
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoValue: {
    fontSize: '14px',
    color: '#2d3748',
    fontWeight: '500',
    lineHeight: '1.5'
  },
  leaderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  leaderName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748'
  },
  leaderEmail: {
    fontSize: '13px',
    color: '#718096'
  },
  cardFooter: {
    padding: '20px 28px 24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    background: 'rgba(0, 0, 0, 0.02)'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  actionButtonSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(styleSheet);

export default ViewDisasters;