'use client';
import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar/page.js'; // Ensure the correct path

function Settings() {
  return (
    <Container fluid>
      <CustomNavbar activeKey="settings" setActiveKey={() => {}} />
      <h3>Settings</h3>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email Notifications</Form.Label>
          <Form.Check 
            type="checkbox" 
            label="Enable Email Notifications"
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Change Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
          />
        </Form.Group>
        <Form.Group controlId="formBasicText">
          <Form.Label>Other Settings</Form.Label>
          <Form.Control
            type="text"
            placeholder="Other settings or preferences"
          /><br/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default Settings;
