import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function CoNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" style={navbarStyle}>
      <Container>
        {/* Stylish Brand */}
        <Navbar.Brand href="#home" style={brandStyle}>
          CampAid
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ backgroundColor: '#fff' }} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/COfficerDashboard" style={navLinkStyle}>Dashboard</Nav.Link>
            
            {/* Victim Management */}
            <NavDropdown title="Victim Management" id="victim-dropdown" style={navDropdownStyle}>
              <NavDropdown.Item as={Link} to="/victimsreg" style={dropdownItemStyle}>Register Victim</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/UpdateVictimStatus" style={dropdownItemStyle}>Update Status</NavDropdown.Item>
            </NavDropdown>

            {/* Inventory Management */}
            <NavDropdown title="Inventory" id="inventory-dropdown" style={navDropdownStyle}>
              {/* <NavDropdown.Item as={Link} to="/Inventory" style={dropdownItemStyle}>View Inventory</NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/requestsupplies" style={dropdownItemStyle}>Request Supplies</NavDropdown.Item>
            </NavDropdown>

            {/* Volunteer Coordination */}
            <NavDropdown title="Volunteers" id="volunteer-dropdown" style={navDropdownStyle}>
              <NavDropdown.Item as={Link} to="/VolunteerCamp" style={dropdownItemStyle}>Requests</NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/TrackVolunteers" style={dropdownItemStyle}>Track Contributions</NavDropdown.Item> */}
            </NavDropdown>
            
            {/* Reports */}
            <NavDropdown title="Reports" id="reports-dropdown" style={navDropdownStyle}>
              <NavDropdown.Item as={Link} to="/campstatus" style={dropdownItemStyle}>Daily Camp Status</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ireports" style={dropdownItemStyle}>Incident Reports</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/" style={navLinkStyle}>Logout</Nav.Link>
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

export default CoNavbar;
