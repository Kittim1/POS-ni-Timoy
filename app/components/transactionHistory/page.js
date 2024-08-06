'use client';
import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../CustomNavbar/page.js'; // Ensure the correct path

function TransactionHistory() {
  const [transactions, setTransactions] = useState([
    // Sample transactions
    { id: 1, date: '2023-08-01', amount: 100.0, details: 'Sample Transaction 1' },
    { id: 2, date: '2023-08-02', amount: 200.0, details: 'Sample Transaction 2' },
    { id: 3, date: '2023-08-03', amount: 150.0, details: 'Sample Transaction 3' },
    { id: 4, date: '2023-08-04', amount: 250.0, details: 'Sample Transaction 4' },
  ]);

  useEffect(() => {
    // Fetch transaction history from API
    axios.get('http://localhost/tims/transactions.php') // Assume this endpoint exists
      .then(response => setTransactions(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Container fluid>
      <CustomNavbar activeKey="transaction-history" setActiveKey={() => {}} />
      <h3>Kunwari Transaction History</h3>
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.details}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default TransactionHistory;
