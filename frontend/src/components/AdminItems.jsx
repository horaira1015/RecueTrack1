import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Accordion, Spinner, Table, Card } from "react-bootstrap";
import Navbarr from "./Navbarr";
const AdminItemsByCategory = () => {
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5553/api/items/details")
      .then((res) => {
        const grouped = {};

        res.data.forEach(item => {
          const key = item.categoryName;

          if (!grouped[key]) {
            grouped[key] = {
              description: item.description,
              items: []
            };
          }

          grouped[key].items.push(item);
        });

        setGroupedItems(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching item details:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
    <Navbarr/>
    <Container className="mt-5">
      <Card className="shadow-sm p-4 mb-4 bg-white rounded">
        <h3 className="text-center mb-4 text-primary">View Inventories</h3>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Accordion defaultActiveKey="0" alwaysOpen>
            {Object.entries(groupedItems).map(([categoryName, data], idx) => (
              <Accordion.Item eventKey={idx.toString()} key={categoryName}>
                <Accordion.Header className="fw-bold fs-5">
                  {categoryName}
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover responsive className="mt-3">
                    <thead className="table-primary">
                      <tr>
                        <th>Camp Name</th>
                        <th>Description</th>
                        <th>Total Quantity</th>
                        {/* <th>Used Quantity</th>
                        <th>Available Quantity</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.campName}</td>
                          <td>{item.description}</td>
                          <td>{item.totalQuantity}</td>
                          {/* <td>{item.usedQuantity}</td>
                          <td>{item.availableQuantity}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Card>
    </Container>
    </>
  );
};

export default AdminItemsByCategory;
