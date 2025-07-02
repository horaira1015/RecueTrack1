import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored user data
    localStorage.removeItem("officerId");
    localStorage.removeItem("officerName"); // If storing officerName
    localStorage.clear(); // Clears all stored data

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center shadow-lg border-0">
        <h3>Logging Out...</h3>
        <Spinner animation="border" variant="primary" className="mt-3" />
        <p className="mt-2 text-muted">You will be redirected to the login page.</p>
      </Card>
    </Container>
  );
}

export default Logout;
