'use client';
import React, { useState } from 'react';
import { Container, Row, Col, Tab, Card, ListGroup } from 'react-bootstrap';
import UserManagement from '../userManagement/page';
import ProductManagement from '../productManagement/page';  
import SalesReports from '../salesReport/page';  
import TransactionHistory from '../transactionHistory/page';  
import Settings from '../settings/page';  
import CustomNavbar from '../CustomNavbar/page.js';

function AdminDashboard() {
  const [activeKey, setActiveKey] = useState('home');

  return (
    <Container fluid>
      <CustomNavbar activeKey={activeKey} setActiveKey={setActiveKey} />
      <Row>
        <Col md={12}>
          <Tab.Content className='p-3'>
            <Tab.Pane eventKey="home">
              <Row>
                <Col md={3}>
                  <Card className='text-center'>
                    <Card.Body>
                      <Card.Title>Total Users</Card.Title>
                      <Card.Text>1500</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className='text-center'>
                    <Card.Body>
                      <Card.Title>Total Products</Card.Title>
                      <Card.Text>350</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className='text-center'>
                    <Card.Body>
                      <Card.Title>Sales This Month</Card.Title>
                      <Card.Text>$20,000</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className='text-center'>
                    <Card.Body>
                      <Card.Title>Transactions</Card.Title>
                      <Card.Text>120</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col md={6}>
                  <Card>
                    <Card.Header>Recent Activities</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>User John Doe added a new product.</ListGroup.Item>
                      <ListGroup.Item>Admin Jane Doe updated product prices.</ListGroup.Item>
                      <ListGroup.Item>Sale completed for $150.</ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>Quick Links</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item action onClick={() => setActiveKey('user-management')}>User Management</ListGroup.Item>
                      <ListGroup.Item action onClick={() => setActiveKey('product-management')}>Product Management</ListGroup.Item>
                      <ListGroup.Item action onClick={() => setActiveKey('sales-reports')}>Sales Reports</ListGroup.Item>
                      <ListGroup.Item action onClick={() => setActiveKey('transaction-history')}>Transaction History</ListGroup.Item>
                      <ListGroup.Item action onClick={() => setActiveKey('settings')}>Settings</ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="user-management">
              <UserManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="product-management">
              <ProductManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="sales-reports">
              <SalesReports />
            </Tab.Pane>
            <Tab.Pane eventKey="transaction-history">
              <TransactionHistory />
            </Tab.Pane>
            <Tab.Pane eventKey="settings">
              <Settings />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
