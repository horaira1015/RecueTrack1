import React, { useEffect, useState } from "react";
import { Container, Table, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Navbarr from "./Navbarr";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mrequests, setMRequests] = useState([]);
  const [mloading, setMLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/requestSupply/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching camp officer requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5553/api/requests/allRequests");
      setMRequests(response.data);
    } catch (error) {
      console.error("Error fetching medical officer requests:", error);
    } finally {
      setMLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchMRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    console.log("Updating request:", requestId, "Status:", status); // Debugging log
  
    const reason = status === "Rejected" ? prompt("Enter rejection reason:") : "";
  
    if (status === "Rejected" && !reason) {
      alert("Rejection reason is required!");
      return;
    }
  
    try {
      const response1 = await axios.put(`http://localhost:5553/api/requestSupply/request/${requestId}`, { status, reason });
      console.log("Camp Officer Request Updated:", response1.data);
  
      // const response2 = await axios.put(`http://localhost:5553/api/requests/mrequest/${requestId}`, { status, reason });
      // console.log("Medical Officer Request Updated:", response2.data);
  
      alert(`Request ${status} successfully!`);
      fetchRequests();
     
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };
  
  const handleMStatusUpdate = async (requestId, status) => {
    console.log("Updating request:", requestId, "Status:", status); // Debugging log
  
    const reason = status === "Rejected" ? prompt("Enter rejection reason:") : "";
  
    if (status === "Rejected" && !reason) {
      alert("Rejection reason is required!");
      return;
    }
  
    try {
      
  
      const response2 = await axios.put(`http://localhost:5553/api/requests/update/${requestId}`, { status, reason });
      console.log("Medical Officer Request Updated:", response2.data);
  
      alert(`Request ${status} successfully!`);
    
      fetchMRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Supply Requests</h2>

        {loading && mloading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* Camp Officer Requests */}
            <Card className="p-3 shadow-sm mb-4">
              <h4 className="mb-3 text-primary">Camp Officer Requests</h4>
              <Table striped bordered hover responsive>
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Camp</th>
                    <th>Officer</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((req, index) => (
                      <tr key={req._id}>
                        <td>{index + 1}</td>
                        <td>{req.campId?.name || "Unknown"}</td>
                        <td>{req.officerId?.name || "Unknown"}</td>
                        <td>{req.itemId?.description || "Unknown"}</td>
                        <td>{req.quantityRequested}</td>
                        <td
                          className={
                            req.status === "Pending"
                              ? "text-warning"
                              : req.status === "Approved"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {req.status}
                        </td>
                        <td>
                          {req.status === "Pending" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleStatusUpdate(req._id, "Approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleStatusUpdate(req._id, "Rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Camp Officer Requests Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>

            {/* Medical Officer Requests */}
            <Card className="p-3 shadow-sm">
              <h4 className="mb-3 text-danger">Medical Officer Requests</h4>
              <Table striped bordered hover responsive>
                <thead className="table-danger">
                  <tr>
                    <th>#</th>
                    <th>Camp</th>
                    <th>Medical Officer</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mrequests.length > 0 ? (
                    mrequests.map((req, index) => (
                      <tr key={req._id}>
                        <td>{index + 1}</td>
                        <td>{req.campId?.name || "Unknown"}</td>
                        <td>{req.mOfficerId?.name || "Unknown"}</td>
                        <td>{req.itemId?.description || "Unknown"}</td>
                        <td>{req.quantity}</td>
                        <td
                          className={
                            req.status === "Pending"
                              ? "text-warning"
                              : req.status === "Approved"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {req.status}
                        </td>
                        <td>
                          {req.status === "Pending" && (
                            <div className="d-flex">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleMStatusUpdate(req._id, "Approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleMStatusUpdate(req._id, "Rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Medical Officer Requests Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}

export default Requests;
