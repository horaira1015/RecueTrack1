import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VolunteerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5553/api/logout", {}, { withCredentials: true });
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Navbar expand="lg" style={styles.navbar}>
      <Container>
        <Navbar.Brand href="/volunteer/dashboard" style={styles.brand}>
          🌍 CampAid
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/volunteer/dashboard" style={styles.navLink}>Dashboard</Nav.Link>
            <Nav.Link href="/volunteer/tasks" style={styles.navLink}>Tasks</Nav.Link>
            <Nav.Link href="/volunteer/announcements" style={styles.navLink}>Announcements</Nav.Link>
            <Nav.Link href="/volunteer/profile" style={styles.navLink}>Profile</Nav.Link>
          </Nav>
          <Nav.Link href="/" style={styles.logoutBtn}>Logout</Nav.Link> 
         
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#007bff", // Blue color
    padding: "10px 20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  brand: {
    color: "#ffffff",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navLink: {
    color: "#ffffff",
    fontSize: "1.1rem",
    marginRight: "15px",
  },
  logoutBtn: {
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "5px",
    color: '#f8f9fa',
  },
};

export default VolunteerNavbar;
