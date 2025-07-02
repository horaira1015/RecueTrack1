import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function MoNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("officerId"); // Clear stored login info
    localStorage.removeItem("campId");
    navigate("/"); // Redirect to login page
  };

  return (
    <Navbar collapseOnSelect expand="lg" style={navbarStyle}>
      <Container>
        {/* Stylish Brand */}
        <Navbar.Brand as={Link} to="/medicalDashboard" style={brandStyle}>
          CampAid 
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ backgroundColor: '#fff' }} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/medicalDashboard" style={navLinkStyle}>Dashboard</Nav.Link>

            {/* Medical Records */}
            <NavDropdown title="Medical Records" id="medical-dropdown" style={navDropdownStyle}>
              <NavDropdown.Item as={Link} to="/medicalreports" style={dropdownItemStyle}>Add Report</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/generateReports" style={dropdownItemStyle}>Generate Reports</NavDropdown.Item>
            </NavDropdown>

            {/* Supplies */}
            <NavDropdown title="Supplies" id="supplies-dropdown" style={navDropdownStyle}>
              <NavDropdown.Item as={Link} to="/requestMedicalSupplies" style={dropdownItemStyle}>Request Supplies</NavDropdown.Item>
               {/* <NavDropdown.Item as={Link} to="/viewRequests" style={dropdownItemStyle}>View Requests</NavDropdown.Item> */}
            </NavDropdown>

            {/* Health Monitoring */}
            <NavDropdown title="Health Monitoring" id="health-dropdown" style={navDropdownStyle}>
              {/* <NavDropdown.Item as={Link} to="/trackPatients" style={dropdownItemStyle}>Track Patients</NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/healthstatus" style={dropdownItemStyle}>Camp Health Status</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link onClick={handleLogout} style={{ ...navLinkStyle, color: 'white' }}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Navbar Styles
const navbarStyle = {
  background: 'linear-gradient(90deg, #6a11cb, #2575fc)', 
  padding: '12px 20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
};

const brandStyle = {
  color: '#fff',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textShadow: '0 0 12px rgba(255, 255, 255, 0.3)',
};

const navLinkStyle = {
  color: '#f8f9fa',
  fontSize: '1rem',
  fontWeight: '500',
  margin: '0 12px',
  transition: 'color 0.3s ease',
  textDecoration: 'none',
};

const navDropdownStyle = {
  color: '#f8f9fa',
  fontSize: '1rem',
};

const dropdownItemStyle = {
  color: '#333',
  fontSize: '0.95rem',
  transition: 'background 0.3s ease',
};

export default MoNavbar;
