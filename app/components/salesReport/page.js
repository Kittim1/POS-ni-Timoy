'use client';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import CustomNavbar from '../CustomNavbar/page.js'; // Ensure the correct path

// Register Chart.js components
Chart.register(...registerables);

function SalesReports() {
  // Sample data for the chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [300, 400, 200, 500, 700, 600],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container fluid>
      <CustomNavbar activeKey="sales-reports" setActiveKey={() => {}} />
      <h3>Sales Reports</h3>
      <Bar data={data} options={options} />
    </Container>
  );
}

export default SalesReports;
