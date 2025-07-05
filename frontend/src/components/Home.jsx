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
      {/* Enhanced Navbar */}
      <Navbar expand="lg" style={styles.navbar} variant="dark" sticky="top">
        <Container>
          <Navbar.Brand href="/" style={styles.brand}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <span style={styles.brandIcon}>🛟</span> Rescue Track
            </motion.div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={styles.navbarToggle} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={styles.navItems}>
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "#about" },
                { name: "Disaster Info", path: "/disaster-info" },
                { name: "Donate", path: "/donate" },
                { name: "Relief Map", path: "/map" },
                { name: "Contact", path: "#contact" }
              ].map((item, index) => (
                <Nav.Link 
                  key={index} 
                  href={item.path} 
                  style={styles.navLink}
                  className="position-relative"
                >
                  {item.name}
                  <motion.span 
                    style={styles.navLinkUnderline}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Nav.Link>
              ))}
            </Nav>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                style={styles.loginButton} 
                onClick={() => navigate("/Login")}
                className="ms-lg-3 mt-3 mt-lg-0"
              >
                Login
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ms-2">
                  <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                  <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </Button>
            </motion.div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section with Gradient and Animated Background */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <Container className="h-100">
          <Row className="h-100 align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 style={styles.heroTitle}>Rescue Track: Together for Bangladesh</h1>
                <p style={styles.heroSubtitle}>Empowering disaster response and community resilience across the nation.</p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(46, 184, 114, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.primaryButton}
                    onClick={() => navigate("/VolunteerReg")}
                  >
                    Get Involved
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.secondaryButton}
                    onClick={() => document.getElementById("public-features").scrollIntoView({ behavior: "smooth" })}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="public-features" style={styles.featuresSection}>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={styles.sectionTitle}>Explore Features</h2>
            <p style={styles.sectionSubtitle}>Discover how Rescue Track helps communities before, during, and after disasters</p>
            
            <Row className="g-4 mt-4">
              {[
                { 
                  title: "Disaster Alerts", 
                  text: "Track flood, cyclone, and earthquake reports live.", 
                  link: "/disaster-info",
                  icon: "⚠️"
                },
                { 
                  title: "Donate", 
                  text: "Support communities in need with your donations.", 
                  link: "/donate",
                  icon: "💝"
                },
                { 
                  title: "Volunteer", 
                  text: "Join as a volunteer for field or remote support.", 
                  link: "/VolunteerReg",
                  icon: "👥"
                },
                { 
                  title: "Relief Map", 
                  text: "Locate affected areas and aid distribution points.", 
                  link: "/map",
                  icon: "🗺️"
                },
                { 
                  title: "Live Updates", 
                  text: "Get the latest news from disaster zones.", 
                  link: "/publicview",
                  icon: "📢"
                }
              ].map((feature, index) => (
                <Col key={index} xs={12} md={6} lg={4}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card style={styles.featureCard}>
                      <Card.Body className="text-center p-4">
                        <div style={styles.featureIcon}>{feature.icon}</div>
                        <Card.Title style={styles.featureTitle}>{feature.title}</Card.Title>
                        <Card.Text style={styles.featureText}>{feature.text}</Card.Text>
                        <Button 
                          style={styles.featureButton}
                          onClick={() => navigate(feature.link)}
                        >
                          Learn More
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ms-2">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                          </svg>
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" style={styles.aboutSection}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 style={styles.sectionTitle}>About Rescue Track</h2>
                <div style={styles.aboutContent}>
                  <div className="mb-4">
                    <h3 style={styles.aboutSubtitle}>Our Vision</h3>
                    <p style={styles.aboutText}>
                      Rescue Track is a dedicated platform initiated to serve people across
                      Bangladesh during natural and man-made disasters. From flash floods in Sylhet to cyclones in Khulna,
                      we stand united to respond, rebuild, and recover.
                    </p>
                  </div>
                  <div>
                    <h3 style={styles.aboutSubtitle}>Our Impact</h3>
                    <p style={styles.aboutText}>
                      Built with the spirit of unity, Rescue Track helps citizens access
                      timely aid, stay informed, and become part of the national emergency response. Together, we
                      create safer, more resilient communities.
                    </p>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="position-relative"
              >
                <div style={styles.aboutImageWrapper}>
                  <div style={styles.aboutImage}></div>
                  <div style={styles.aboutImageOverlay}></div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contactSection}>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={styles.sectionTitle}>Contact Us</h2>
            <p style={styles.sectionSubtitle}>Get in touch with our team for support or collaboration</p>
            
            <Row className="mt-5">
              <Col md={6} className="mb-4 mb-md-0">
                <div style={styles.contactCard}>
                  <h3 style={styles.contactCardTitle}>Contact Information</h3>
                  <ul style={styles.contactList}>
                    <li style={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                      </svg>
                      rescuetrack.bd@gmail.com
                    </li>
                    <li style={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                      </svg>
                      +880 1611 223344
                    </li>
                    <li style={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                      </svg>
                      21/A Relief Road, Dhaka 1207, Bangladesh
                    </li>
                  </ul>
                </div>
              </Col>
              <Col md={6}>
                <div style={styles.contactCard}>
                  <h3 style={styles.contactCardTitle}>Get Involved</h3>
                  <p style={styles.contactText}>
                    Want to help or need help? Rescue Track is here to connect citizens, volunteers,
                    and authorities. Together, we can face any crisis and rebuild stronger.
                  </p>
                  <Button 
                    style={styles.contactButton}
                    onClick={() => navigate("/VolunteerReg")}
                  >
                    Join Our Volunteer Network
                  </Button>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <div style={styles.footerBrand}>
                <span style={styles.brandIcon}>🛟</span> Rescue Track
              </div>
              <p style={styles.footerText}>
                Empowering communities through disaster preparedness and response.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div style={styles.socialLinks}>
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                  <a key={index} href={`https://${social}.com`} style={styles.socialLink} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d={`M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z`} />
                    </svg>
                  </a>
                ))}
              </div>
              <p style={styles.footerCopyright}>
                © {new Date().getFullYear()} Rescue Track. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

const styles = {
  body: {
    background: "#f8f9fa",
    color: "#2d3748",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    lineHeight: 1.6,
  },
  navbar: {
    background: "linear-gradient(135deg, #0A2647 0%, #144272 100%)",
    padding: "1rem 0",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  navbarToggle: {
    border: "none",
    outline: "none",
  },
  brand: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
  },
  brandIcon: {
    fontSize: "1.5rem",
    marginRight: "10px",
  },
  navItems: {
    alignItems: "center",
  },
  navLink: {
    color: "#FFFFFF",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    position: "relative",
    transition: "color 0.3s ease",
    ":hover": {
      color: "#2EB872",
    },
  },
  navLinkUnderline: {
    position: "absolute",
    bottom: "0",
    left: "1rem",
    right: "1rem",
    height: "2px",
    backgroundColor: "#2EB872",
    transformOrigin: "left",
  },
  loginButton: {
    background: "#2EB872",
    border: "none",
    color: "#fff",
    padding: "0.5rem 1.5rem",
    borderRadius: "30px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    ":hover": {
      background: "#25a25a",
      transform: "translateY(-2px)",
    },
  },
  heroSection: {
    position: "relative",
    height: "100vh",
    minHeight: "700px",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)",
    overflow: "hidden",
    color: "#FFFFFF",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "1.5rem",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    maxWidth: "700px",
    margin: "0 auto 2rem",
    opacity: 0.9,
  },
  primaryButton: {
    background: "#2EB872",
    border: "none",
    color: "#fff",
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  secondaryButton: {
    background: "transparent",
    border: "2px solid #fff",
    color: "#fff",
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  featuresSection: {
    padding: "6rem 0",
    background: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#0A2647",
    marginBottom: "1rem",
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: "1.1rem",
    color: "#4a5568",
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 3rem",
  },
  featureCard: {
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    height: "100%",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
    },
  },
  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
  },
  featureTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0A2647",
    marginBottom: "1rem",
  },
  featureText: {
    color: "#4a5568",
    marginBottom: "1.5rem",
  },
  featureButton: {
    background: "transparent",
    color: "#2EB872",
    border: "none",
    fontWeight: "600",
    padding: "0.5rem 1rem",
    display: "inline-flex",
    alignItems: "center",
    ":hover": {
      background: "rgba(46, 184, 114, 0.1)",
    },
  },
  aboutSection: {
    padding: "6rem 0",
    background: "#f0f4f8",
  },
  aboutContent: {
    background: "#FFFFFF",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
  },
  aboutSubtitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0A2647",
    marginBottom: "1rem",
  },
  aboutText: {
    color: "#4a5568",
    marginBottom: "1.5rem",
  },
  aboutImageWrapper: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
    height: "400px",
  },
  aboutImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover",
  },
  aboutImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to right, rgba(10, 38, 71, 0.7), rgba(20, 66, 114, 0.5))",
  },
  contactSection: {
    padding: "6rem 0",
    background: "#FFFFFF",
  },
  contactCard: {
    background: "#f8f9fa",
    padding: "2rem",
    borderRadius: "12px",
    height: "100%",
  },
  contactCardTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0A2647",
    marginBottom: "1.5rem",
  },
  contactList: {
    listStyle: "none",
    padding: 0,
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    color: "#4a5568",
  },
  contactText: {
    color: "#4a5568",
    marginBottom: "2rem",
  },
  contactButton: {
    background: "#2EB872",
    border: "none",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    fontWeight: "600",
    borderRadius: "30px",
    width: "100%",
    transition: "all 0.3s ease",
    ":hover": {
      background: "#25a25a",
    },
  },
  footer: {
    background: "#0A2647",
    color: "#FFFFFF",
    padding: "3rem 0",
  },
  footerBrand: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
  },
  footerText: {
    opacity: 0.8,
    maxWidth: "400px",
  },
  socialLinks: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginBottom: "1rem",
  },
  socialLink: {
    color: "#FFFFFF",
    opacity: 0.7,
    transition: "all 0.3s ease",
    ":hover": {
      opacity: 1,
      transform: "translateY(-2px)",
    },
  },
  footerCopyright: {
    opacity: 0.7,
    fontSize: "0.9rem",
  },
};

export default HomePage;