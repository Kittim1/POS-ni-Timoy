'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../CustomNavbar/page.js';

function UserManagement() {
  const [activeKey, setActiveKey] = useState('user-management');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ user: '', password: '', fullName: '' });

  useEffect(() => {
    // Fetch users from API
    axios.get('http://localhost/tims/user.php')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddUser = () => {
    // Add user logic
  };

  return (
    <Container fluid>
      <CustomNavbar activeKey={activeKey} setActiveKey={setActiveKey} />
      <h3>User Management</h3>
      <Form>
        <Form.Group>
          <h1> Add User</h1>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={newUser.user}
            onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddUser}>Add User</Button>

        <h1> Current Users</h1>
      </Form>
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.user}</td>
              <td>{user.fullName}</td>
              <td>
                <Button variant="warning" className='me-2'>Edit</Button>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserManagement;
