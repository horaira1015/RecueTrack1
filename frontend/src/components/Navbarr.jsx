import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function Navbarr() {
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
            <Nav.Link as={Link} to ="/AdminDashboard" style={navLinkStyle}>Dashboard</Nav.Link>
            <Nav.Link href="#pricing" style={navLinkStyle}></Nav.Link>
            
            {/* Registration Dropdown */}
            <NavDropdown title="Registration" id="collapsible-nav-dropdown" style={navDropdownStyle}>
              <NavDropdown.Item as={Link} to ="/CampRegistration" style={dropdownItemStyle}>Camp</NavDropdown.Item>
              <NavDropdown.Item as={Link} to ="/CampOfficerRegistration" style={dropdownItemStyle}>Camp Officer</NavDropdown.Item>
              <NavDropdown.Item as={Link} to ="/MedicalOfficerRegistration" style={dropdownItemStyle}>Medical Officer</NavDropdown.Item>
            </NavDropdown>

           {/* Inventory Management as a Main Dropdown */}
<NavDropdown title="Inventory Management" id="inventory-dropdown" style={navDropdownStyle}>
  <NavDropdown.Item as={Link} to="/AddCategory" style={{ ...dropdownItemStyle, fontWeight: "bold", color: "#007bff" }}>
    ➕ Add Category
  </NavDropdown.Item>
  <NavDropdown.Item as={Link} to="/CateogoryRegistration" style={{ ...dropdownItemStyle, fontWeight: "bold", color: "#007bff" }}>
     Add Item
  </NavDropdown.Item>
</NavDropdown>



            <Nav.Link href="/" style={navLinkStyle}>Logout</Nav.Link>
            {/* <Nav.Link eventKey={2} href="#memes" style={navLinkStyle}>-</Nav.Link> */}
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
  //textTransform: 'uppercase',
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

export default Navbarr;
