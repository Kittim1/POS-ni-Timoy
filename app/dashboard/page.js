'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Table, Button, Modal, Card } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [quantity, setQuantity] = useState('1');
  const [barcode, setBarcode] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [cashTendered, setCashTendered] = useState('');
  const [change, setChange] = useState(null);
  const [productData, setProductData] = useState([]);
  const [adminCredentials, setAdminCredentials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [pausedTransactions, setPausedTransactions] = useState([]);
  const [theme, setTheme] = useState('light');
  const [userTransactions, setUserTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPausedTransactionsModal, setShowPausedTransactionsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const quantityRef = useRef(null);
  const barcodeRef = useRef(null);
  const cashTenderedRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get('http://localhost/tims/products.php');
        setProductData(response.data);
      } catch (error) {
        console.error("There was an error fetching the product data!", error);
      }
    };

    const fetchUserCredentials = async () => {
      try {
        const response = await axios.get('http://localhost/tims/user.php');
        setAdminCredentials(response.data);
      } catch (error) {
        console.error("There was an error fetching the admin credentials!", error);
      }
    };

    const fetchCurrentUser = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const response = await axios.get(`http://localhost/tims/user.php?user=${encodeURIComponent(username)}`);
          setCurrentUser(response.data[0]);
        } catch (error) {
          console.error("There was an error fetching current user info!", error);
        }
      }
    };

    fetchProductData();
    fetchUserCredentials();
    fetchCurrentUser();

    const handleKeydown = (event) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'F2':
            event.preventDefault();
            barcodeRef.current.focus();
            break;
          case 'F1':
            event.preventDefault();
            quantityRef.current.focus();
            break;
          case 'F3':
            event.preventDefault();
            cashTenderedRef.current.focus();
            break;
          case 'F6':
            event.preventDefault();
            showReport();
            break;
          case 'F7':
            event.preventDefault();
            promptResumeTransaction();
            break;
          case 'F9':
            event.preventDefault();
            resetProcess();
            break;
          case 'F12':
            event.preventDefault();
            toggleTheme();
            break;
          case 'm':
            event.preventDefault();
            if (items.length > 0) {
              promptPasswordToDelete();
            }
            break;
          case 'b':
            event.preventDefault();
            if (items.length > 0) {
              setAsideTransaction();
            }
            break;
          case 'l':
            event.preventDefault();
            logout();
            break;
          case 'p':
            event.preventDefault();
            showReceipt();
            break;
          default:
            break;
        }
      } else if (event.key === 'p' && showReceiptModal) {
        printReceipt();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [items, pausedTransactions, adminCredentials, theme, cashTendered, totalCost, currentUser, showReceiptModal]);

  const addItem = () => {
    const product = productData.find(p => p.barcode === barcode);
    const parsedQuantity = parseInt(quantity, 10);

    if (product && parsedQuantity > 0) {
      const newItem = { product: product.p_name, quantity: parsedQuantity, price: product.price };
      setItems([...items, newItem]);
      setTotalCost(totalCost + newItem.quantity * newItem.price);
      resetFields();
      quantityRef.current.focus();
    } else {
      alert('Please enter a valid barcode and quantity.');
    }
  };

  const resetFields = () => {
    setBarcode('');
    setQuantity('');
  };

  const promptPasswordToDelete = () => {
    setItemsToDelete([]);
    setShowModal(true);
  };

  const validatePassword = () => {
    const admin = adminCredentials.find(user => user.user === 'Admin');
    if (admin && admin.password === adminPassword) {
      deleteSelectedItems();
    } else {
      alert('Incorrect admin password.');
    }
    setShowModal(false);
    setAdminPassword('');
  };

  const deleteSelectedItems = () => {
    const remainingItems = items.filter((_, index) => !itemsToDelete.includes(index));
    const costOfDeletedItems = itemsToDelete.reduce((total, index) => total + items[index].quantity * items[index].price, 0);
    setItems(remainingItems);
    setTotalCost(totalCost - costOfDeletedItems);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.target.id === 'quantity') {
        barcodeRef.current.focus();
      } else if (event.target.id === 'barcode') {
        addItem();
      } else if (event.target.id === 'cashTendered') {
        calculateChange();
      }
    }
  };

  const calculateChange = () => {
    if (!isNaN(cashTendered) && cashTendered >= totalCost) {
      setChange(cashTendered - totalCost);
    } else {
      alert('Insufficient cash.');
      setChange(null);
    }
  };

  const resetProcess = () => {
    setItems([]);
    setTotalCost(0);
    setCashTendered('');
    setChange(null);
    resetFields();
    quantityRef.current.focus();
  };

  const setAsideTransaction = () => {
    setPausedTransactions([...pausedTransactions, { items, totalCost }]);
    resetProcess();
  };

  const promptResumeTransaction = () => {
    setShowPausedTransactionsModal(true);
  };

  const resumePausedTransaction = () => {
    if (selectedTransaction !== null) {
      const transaction = pausedTransactions[selectedTransaction];
      setItems(transaction.items);
      setTotalCost(transaction.totalCost);
      setPausedTransactions(pausedTransactions.filter((_, index) => index !== selectedTransaction));
      setShowPausedTransactionsModal(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const showReport = async () => {
    try {
      const response = await axios.get('http://localhost/tims/transactions.php');
      const transactions = response.data;

      router.push({
        pathname: '/reports',
        query: { transactions: JSON.stringify(transactions), currentUser: JSON.stringify(currentUser) }
      });
    } catch (error) {
      console.error("There was an error fetching the user transactions!", error);
    }
  };

  const handleItemToDeleteChange = (index) => {
    if (itemsToDelete.includes(index)) {
      setItemsToDelete(itemsToDelete.filter(itemIndex => itemIndex !== index));
    } else {
      setItemsToDelete([...itemsToDelete, index]);
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    router.push('/');
  };

  const showReceipt = () => {
    setShowReceiptModal(true);
  };

  const printReceipt = () => {
    // Print logic here (e.g., window.print() or using a library for printing)
    console.log('Printing receipt...');
    setShowReceiptModal(false);
  };

  return (
    <Container className="mt-5" style={{ background: 'linear-gradient(to bottom, #001f3f, #001845)', padding: '5px', minHeight: '100vh' }}>
      <header>
        <div className="text-center" style={{ color: 'white' }}>
          <h2>RANDOGS SUPERMARKET</h2>
          <p>By: Kittim Ignalig</p>
        </div>
      </header>
      <Form className="mt-3">
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="quantity">
              <Form.Label style={{ color: 'white' }}>Quantity</Form.Label>
              <Form.Control
                type="number"
                ref={quantityRef}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="barcode">
              <Form.Label style={{ color: 'white' }}>Barcode</Form.Label>
              <Form.Control
                type="text"
                ref={barcodeRef}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="cashTendered">
              <Form.Label style={{ color: 'white' }}>Cash Tendered</Form.Label>
              <Form.Control
                type="number"
                ref={cashTenderedRef}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover variant="dark" className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={itemsToDelete.includes(index)}
                  onChange={() => handleItemToDeleteChange(index)}
                />
              </td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" className="text-right">Total Cost:</td>
            <td>{totalCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="4" className="text-right">Change:</td>
            <td>{change !== null ? change.toFixed(2) : ''}</td>
          </tr>
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Admin Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="adminPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={validatePassword}>
            Validate
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPausedTransactionsModal} onHide={() => setShowPausedTransactionsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Paused Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {pausedTransactions.map((transaction, index) => (
                <tr key={index} onClick={() => setSelectedTransaction(index)}>
                  <td>{index + 1}</td>
                  <td>{transaction.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPausedTransactionsModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={resumePausedTransaction}>
            Resume Transaction
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReceiptModal} onHide={() => setShowReceiptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Header>RANDOGS SUPERMARKET</Card.Header>
            <Card.Body>
              <Card.Title>Receipt</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <strong>Total Cost:</strong> {totalCost.toFixed(2)}
              </div>
              <div>
                <strong>Cash Tendered:</strong> {cashTendered}
              </div>
              <div>
                <strong>Change:</strong> {change !== null ? change.toFixed(2) : ''}
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReceiptModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <br/>
      <br/>
      <br/>
        <Card><div><h1>Keybinds</h1></div>
              <b>Enter Quantity		Ctrl + F1</b>
              <b>Enter Barcode		Ctrl + F2</b>
              <b>Cash Tendered		Ctrl + F3</b>
              <b>New Transaction		Ctrl + F9</b>
              <b>Resume Transaction	Ctrl + F7</b>
              <b>Pause Transaction	Ctrl + b</b>
              <b>Void			Ctrl + m          </b>
              <b>Print  Ctrl + P </b>
              <b>Log Out 		Ctrl + L</b>
        </Card>

    </Container>
  );
};

export default Home;
