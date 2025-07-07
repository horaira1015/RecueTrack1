import { useEffect } from "react";
import { Container, Card, Spinner } from "react-bootstrap";

function Logout() {
  useEffect(() => {
    // Clear all stored user data
    localStorage.clear();

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1); // force forward
    };

    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, []);

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
