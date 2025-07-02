import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div style={styles.body}>
      {/* Navbar */}
      <Navbar expand="lg" style={styles.navbar} fixed="top" variant="dark">
        <Container>
          <Navbar.Brand href="/" style={styles.brand}>
            rescueTrack
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/" style={styles.navLink}>
                হোম
              </Nav.Link>
              <Nav.Link href="#about" style={styles.navLink}>
                সম্পর্কে
              </Nav.Link>
              <Nav.Link href="/disaster-info" style={styles.navLink}>
                দুর্যোগ তথ্য
              </Nav.Link>
              <Nav.Link href="/donate" style={styles.navLink}>
                দান করুন
              </Nav.Link>
              <Nav.Link href="/map" style={styles.navLink}>
                রিলিফ মানচিত্র
              </Nav.Link>
              <Nav.Link href="#contact" style={styles.navLink}>
                যোগাযোগ
              </Nav.Link>
            </Nav>

            <Nav className="ms-3">
              <Button
                style={styles.loginButton}
                onClick={() => navigate("/Login")}
                whileHover={{ scale: 1.05 }}
              >
                লগইন
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container fluid style={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={styles.heroContent}
        >
          <motion.h1
            style={styles.heroTitle}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            rescueTrack: শক্তিশালী বাংলাদেশ, দ্রুত উদ্ধার
          </motion.h1>
          <motion.p
            style={styles.heroSubtitle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            বাংলাদেশের জন্য একটি দুর্যোগ ত্রাণ ও সহায়তা ব্যবস্থাপনা প্ল্যাটফর্ম
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 8px 15px rgba(233,30,99,0.6)" }}
            whileTap={{ scale: 0.95 }}
            style={styles.heroButton}
            onClick={() => navigate("/VolunteerReg")}
          >
            অংশগ্রহণ করুন
          </motion.button>
        </motion.div>
      </Container>

      {/* Public Features */}
      <Container
        id="public-features"
        style={{ ...styles.section, background: "#002f4b", color: "#f0f9ff" }}
      >
        <motion.h2
          style={styles.sectionTitleWhite}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          পাবলিক ফিচারস
        </motion.h2>
        <Row>
          {[
            { title: "দুর্যোগ তথ্য দেখুন", text: "তাজা ও নির্ভরযোগ্য তথ্য পান।", link: "/disaster-info" },
            { title: "দান করুন", text: "সহায়তায় অর্থ দিন।", link: "/donate" },
            { title: "স্বেচ্ছাসেবক হোন", text: "উদ্ধারে আপনার হাত বাড়ান।", link: "/VolunteerReg" },
            { title: "রিলিফ মানচিত্র", text: "সহায়তা কেন্দ্র ও বিপর্যয় অঞ্চল খুঁজুন।", link: "/map" },
            { title: "রিয়েল-টাইম আপডেট", text: "সর্বশেষ খবর পেতে থাকুন।", link: "/publicview" },
          ].map((feature, index) => (
            <Col key={index} md={4} className="mb-4">
              <motion.div
                whileHover={{ scale: 1.07, boxShadow: "0 10px 20px rgba(255,255,255,0.3)" }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: 0.1 * index }}
                style={{ cursor: "pointer" }}
              >
                <Card style={styles.cardGradient}>
                  <Card.Body className="text-center">
                    <Card.Title style={{ color: "#c1e7ff" }}>{feature.title}</Card.Title>
                    <Card.Text style={{ color: "#a0d8ff" }}>{feature.text}</Card.Text>
                    <Button
                      style={styles.buttonGradient}
                      onClick={() => navigate(feature.link)}
                    >
                      বিস্তারিত জানুন
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* About rescueTrack */}
      <Container
        id="about"
        style={{ ...styles.section, background: "#f9fafb", boxShadow: "0 8px 30px rgb(0 0 0 / 0.05)" }}
      >
        <motion.h2
          style={styles.sectionTitleDark}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          rescueTrack সম্পর্কে
        </motion.h2>
        <Row>
          <Col md={6}>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={styles.aboutTextDark}
            >
              <strong>আমাদের মিশন:</strong> বাংলাদেশে দুর্যোগ ত্রাণ কার্যক্রমকে দ্রুত, কার্যকর ও
              স্বচ্ছ করার লক্ষ্যে rescueTrack কাজ করে যাচ্ছে। আমরা বাস্তব সময় তথ্য সরবরাহ করি,
              দাতাদের এবং স্বেচ্ছাসেবকদের সরাসরি সংযোগ স্থাপন করি।
            </motion.p>
          </Col>
          <Col md={6}>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={styles.aboutTextDark}
            >
              <strong>আমাদের প্রভাব:</strong> গ্রামীণ ও শহুরে অঞ্চলে আমরা শত শত পরিবারের কাছে
              দ্রুত সাহায্য পৌঁছে দিই। দান, স্বেচ্ছাসেবক বা তথ্যের জন্য যারা ইচ্ছুক,
              rescueTrack তাদের জন্য কার্যকরী একটি হাতিয়ার।
            </motion.p>
          </Col>
        </Row>
      </Container>

      {/* Contact Section */}
      <Container
        id="contact"
        style={{ ...styles.section, background: "#002f4b", color: "#f0f9ff" }}
      >
        <motion.h2
          style={styles.sectionTitleWhite}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          যোগাযোগ করুন
        </motion.h2>
        <Row>
          <Col md={6}>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <strong>ইমেইল:</strong> rescueTrack.bd@gmail.com
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <strong>ফোন:</strong> +880 1700 123456
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <strong>ঠিকানা:</strong> ১২৩ জাতীয় দুর্যোগ মন্ত্রণালয়, ঢাকা, বাংলাদেশ
            </motion.p>
          </Col>
          <Col md={6}>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ lineHeight: "1.5rem" }}
            >
              আপনার প্রশ্ন বা স্বেচ্ছাসেবক, দাতা বা দুর্যোগ কর্মী হিসেবে অংশগ্রহণের জন্য আমাদের সাথে যোগাযোগ করুন।
              একসাথে আমরা দ্রুত ও কার্যকর সহায়তা পৌঁছে দিতে পারব।
            </motion.p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const styles = {
  body: {
    background: "#e3f2fd",
    color: "#111827",
    minHeight: "100vh",
    paddingTop: "75px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    background: "linear-gradient(90deg, #0D47A1, #1976D2)",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.25)",
  },
  brand: {
    fontSize: "2rem",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "2px",
    textShadow: "1.5px 1.5px 4px rgba(0,0,0,0.7)",
  },
  navLink: {
    color: "#bbdefb",
    fontSize: "1.15rem",
    marginLeft: "14px",
    fontWeight: "600",
    transition: "color 0.3s",
  },
  loginButton: {
    borderRadius: "30px",
    padding: "10px 28px",
    fontWeight: "700",
    background: "#c2185b",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(194,24,91,0.7)",
    transition: "background 0.3s",
  },
  heroSection: {
    height: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1565c0 0%, #64b5f6 100%)",
    textAlign: "center",
    color: "#fff",
    padding: "0 20px",
    boxShadow: "inset 0 0 60px rgba(255,255,255,0.3)",
  },
  heroContent: {
    maxWidth: "800px",
  },
  heroTitle: {
    fontSize: "3.4rem",
    fontWeight: "900",
    marginBottom: "20px",
    textShadow: "3px 3px 8px rgba(0, 0, 0, 0.7)",
  },
  heroSubtitle: {
    fontSize: "1.7rem",
    marginBottom: "35px",
    fontWeight: "600",
    textShadow: "1.5px 1.5px 6px rgba(0, 0, 0, 0.5)",
  },
  heroButton: {
    padding: "16px 40px",
    fontSize: "1.4rem",
    fontWeight: "bold",
    borderRadius: "45px",
    background: "#c2185b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(194, 24, 91, 0.7)",
    transition: "background 0.3s ease",
  },
  section: {
    padding: "60px 20px",
    marginTop: "30px",
    borderRadius: "15px",
  },
  sectionTitleWhite: {
    fontSize: "2.8rem",
    textAlign: "center",
    color: "#f0f9ff",
    marginBottom: "40px",
    fontWeight: "900",
    textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
  },
  sectionTitleDark: {
    fontSize: "2.8rem",
    textAlign: "center",
    color: "#111827",
    marginBottom: "40px",
    fontWeight: "900",
  },
  cardGradient: {
    background: "linear-gradient(145deg, #1565c0, #1976d2)",
    padding: "25px",
    textAlign: "center",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(25, 118, 210, 0.5)",
    color: "#bbdefb",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease",
  },
  buttonGradient: {
    borderRadius: "30px",
    padding: "12px 30px",
    fontWeight: "700",
    background: "#c2185b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 25px rgba(194, 24, 91, 0.7)",
    transition: "background 0.3s ease",
  },
  aboutTextDark: {
    fontSize: "1.2rem",
    lineHeight: "1.9rem",
    color: "#222",
  },
};

export default HomePage;
