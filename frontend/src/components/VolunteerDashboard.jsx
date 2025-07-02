import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VolunteerNavbar from "./VNavbar";


const VolunteerDashboard = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVolunteerDetails();
    fetchTasks();
    fetchAnnouncements();
  }, []);

  const fetchVolunteerDetails = async () => {
    try {
        const volunteerId = localStorage.getItem("volunteerId"); // Correct variable name
        if (!volunteerId) return;

        const response = await axios.get(`http://localhost:5553/api/volunteer/get/${volunteerId}`);
        setVolunteer(response.data);
    } catch (error) {
        console.error("Error fetching volunteer details:", error);
    }
};



  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/tasks", { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  return (

    <>
    <VolunteerNavbar/>
    
    
    
      <Container className="mt-4">
        <h2 className="text-center">Volunteer Dashboard</h2>

        {volunteer && (
          <Card className="mb-4 p-3 shadow-lg">
            <h4>Welcome, {volunteer.name}!</h4>
            <p><strong>Email:</strong> {volunteer.email}</p>
            <p><strong>Camp:</strong> {volunteer.campId?.name || "Not Assigned"}</p>
            <p><strong>Availability:</strong> {volunteer.availableTime}</p>
          </Card>
        )}

        <h3 className="text-center mt-4">Your Tasks</h3>
        <Row>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Col md={6} key={task._id}>
                <Card className="mb-3 shadow-lg">
                  <Card.Body>
                    <h5>{task.title}</h5>
                    <p>{task.description}</p>
                    <p><strong>Deadline:</strong> {task.deadline}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No tasks assigned.</p>
          )}
        </Row>

        <h3 className="text-center mt-4">Announcements</h3>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement._id} className="mb-3 p-3 shadow-lg">
              <h5>{announcement.title}</h5>
              <p>{announcement.message}</p>
            </Card>
          ))
        ) : (
          <p>No announcements available.</p>
        )}

        <Button variant="secondary" className="mt-3" onClick={() => navigate("/volunteer/profile")}>Manage Profile</Button>
      </Container>
      </>
  );
};

export default VolunteerDashboard;