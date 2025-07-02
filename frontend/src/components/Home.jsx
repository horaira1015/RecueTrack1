import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, []);

  return (
    <div style={styles.body}>
      <Navbar expand="lg" style={styles.navbar}>
        <Container>
          <Navbar.Brand href="/" style={styles.brand}>Rescue Track</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/" style={styles.navLink}>Home</Nav.Link>
              <Nav.Link href="#about" style={styles.navLink}>About</Nav.Link>
              <Nav.Link href="/disaster-info" style={styles.navLink}>Disaster Info</Nav.Link>
              <Nav.Link href="/donate" style={styles.navLink}>Donate</Nav.Link>
              <Nav.Link href="/map" style={styles.navLink}>Relief Map</Nav.Link>
              <Nav.Link href="#contact" style={styles.navLink}>Contact</Nav.Link>
            </Nav>
            <Nav className="ms-3">
              <Button style={styles.loginButton} onClick={() => navigate("/Login")}>Login</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid style={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={styles.heroContent}
        >
          <h1 style={{ fontWeight: "bold" }}>Rescue Track: Together for Bangladesh</h1>
          <p>Empowering disaster response and community resilience across the nation.</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={styles.heroButton}
            onClick={() => navigate("/VolunteerReg")}
          >
            Get Involved
          </motion.button>
        </motion.div>
      </Container>

      <Container id="public-features" style={styles.section}>
        <h2 style={styles.sectionTitle}>Explore Features</h2>
        <Row>
          {[
            { title: "Disaster Alerts", text: "Track flood, cyclone, and earthquake reports live.", link: "/disaster-info" },
            { title: "Donate", text: "Support communities in need with your donations.", link: "/donate" },
            { title: "Volunteer", text: "Join as a volunteer for field or remote support.", link: "/VolunteerReg" },
            { title: "Relief Map", text: "Locate affected areas and aid distribution points.", link: "/map" },
            { title: "Live Updates", text: "Get the latest news from disaster zones.", link: "/publicview" }
          ].map((feature, index) => (
            <Col key={index} md={4} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card style={styles.card}>
                  <Card.Body className="text-center">
                    <Card.Title style={{ fontWeight: "600" }}>{feature.title}</Card.Title>
                    <Card.Text>{feature.text}</Card.Text>
                    <Button style={styles.button} onClick={() => navigate(feature.link)}>
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <Container id="about" style={styles.section}>
        <h2 style={styles.sectionTitle}>About Rescue Track</h2>
        <Row>
          <Col md={6}>
            <p>
              <strong>Our Vision:</strong> Rescue Track is a dedicated platform initiated to serve people across
              Bangladesh during natural and man-made disasters. From flash floods in Sylhet to cyclones in Khulna,
              we stand united to respond, rebuild, and recover.
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Our Impact:</strong> Built with the spirit of unity, Rescue Track helps citizens access
              timely aid, stay informed, and become part of the national emergency response. Together, we
              create safer, more resilient communities.
            </p>
          </Col>
        </Row>
      </Container>

      <Container id="contact" style={styles.section}>
        <h2 style={styles.sectionTitle}>Contact Us</h2>
        <Row>
          <Col md={6}>
            <p><strong>Email:</strong> rescuetrack.bd@gmail.com</p>
            <p><strong>Phone:</strong> +880 1611 223344</p>
            <p><strong>Address:</strong> 21/A Relief Road, Dhaka 1207, Bangladesh</p>
          </Col>
          <Col md={6}>
            <p>
              Want to help or need help? Rescue Track is here to connect citizens, volunteers,
              and authorities. Together, we can face any crisis and rebuild stronger.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const styles = {
  body: {
    background: "#F7FAFC",
    color: "#2C3E50",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    background: "#0A2647",
  },
  brand: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  navLink: {
    color: "#FFFFFF",
    fontSize: "1.05rem",
    marginRight: "10px",
  },
  loginButton: {
    background: "#2EB872",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "25px",
    fontWeight: "bold",
  },
  heroSection: {
    height: "65vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0077B6, #00B4D8)",
    textAlign: "center",
    color: "#FFFFFF",
    padding: "30px",
  },
  heroButton: {
    marginTop: "20px",
    padding: "12px 30px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderRadius: "30px",
    background: "#2EB872",
    color: "#fff",
    border: "none",
  },
  section: {
    background: "#FFFFFF",
    padding: "60px 20px",
    marginTop: "40px",
    borderRadius: "12px",
  },
  sectionTitle: {
    fontSize: "2rem",
    textAlign: "center",
    color: "#0A2647",
    marginBottom: "30px",
    fontWeight: "bold",
  },
  card: {
    background: "#E8F1FA",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  button: {
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    background: "#0A2647",
    color: "#fff",
    border: "none",
  },
};

export default HomePage;
