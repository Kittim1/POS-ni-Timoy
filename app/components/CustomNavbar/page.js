import React from 'react';
import { Nav, Navbar, NavbarCollapse } from 'react-bootstrap';

const CustomNavbar = ({ activeKey, setActiveKey }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand  href='/components/admin'>Admin Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <NavbarCollapse id="basic-navbar-nav">
        <Nav
          className="mr-auto"
          activeKey={activeKey}
          onSelect={(selectedKey) => setActiveKey(selectedKey)}
        >
          <Nav.Link eventKey="home" href='/components/admin'>Home</Nav.Link> <br/>
          <Nav.Link eventKey="user-management" href="/components/userManagement">User Management</Nav.Link>
          <Nav.Link eventKey="product-management" href="/components/productManagement">Product Management</Nav.Link>
          <Nav.Link eventKey="sales-reports" href="/components/salesReport">Sales Reports</Nav.Link>
          <Nav.Link eventKey="transaction-history" href="/components/transactionHistory">Transaction History</Nav.Link>
          <Nav.Link eventKey="settings" href="/components/settings">Settings</Nav.Link>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  );
};

export default CustomNavbar;
