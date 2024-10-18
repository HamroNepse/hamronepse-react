import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  OutlinedInput 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // Active bell icon
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'; // Inactive bell icon

const StockAlert = () => {
  const [selectedStock, setSelectedStock] = useState('');
  const [priceCondition, setPriceCondition] = useState('');
  const [thresholdValue, setThresholdValue] = useState('');
  const [units, setUnits] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    fetch('https://e97a-2407-5200-400-43a3-7d13-db99-b628-f3e4.ngrok-free.app/stocks/', {
        method: 'GET',
        headers: new Headers({
            'ngrok-skip-browser-warning': '6024', // Add the ngrok skip warning header
            'Content-Type': 'application/json', // Include content type if necessary
        }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Ensure the response is parsed as JSON
    })
    .then((data) => {
        if (data.symbols) {
            setStockList(data.symbols); // Update the state with the stock list
        } else {
            throw new Error('Invalid data format received');
        }
    })
    .catch((error) => {
        console.error('Error fetching stock list:', error);
        setSnackbarMessage(`Error fetching stocks: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    });
}, []);

 // Function to fetch stock alerts
 const fetchStockAlerts = () => {
  fetch('https://e97a-2407-5200-400-43a3-7d13-db99-b628-f3e4.ngrok-free.app/notifications/', {
    method: 'GET',
    headers: {
      'ngrok-skip-browser-warning': '6024',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setAlerts(data.stock_alerts); // Adjust this based on your API structure
    })
    .catch((error) => {
      console.error('Error fetching stock alerts:', error);
      setSnackbarMessage(`Error fetching alerts: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    });
};


// Fetch stock alerts when the component mounts
useEffect(() => {
  fetchStockAlerts(); // Call the function here
}, []);


  const handleSubmit = (e) => {
    e.preventDefault();
   
    const price_thresholds = {
      [selectedStock]: [
        { type: priceCondition, value: thresholdValue }
      ]
    };

      // The object to send to the server
      const dataToSend = {
        price_thresholds: price_thresholds
      };

      // Send the stock_price_thresholds data to the endpoint
      fetch('https://e97a-2407-5200-400-43a3-7d13-db99-b628-f3e4.ngrok-free.app/notifications/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to add stock alert');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Success:', data);
          setSnackbarMessage(data.msg);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          fetchStockAlerts();
        })
        .catch((error) => {
          console.error('Error:', error);
          setSnackbarMessage(`Error: ${error.message}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const toggleStatus = (alert) => {
    const endpoint = `https://e97a-2407-5200-400-43a3-7d13-db99-b628-f3e4.ngrok-free.app/notifications/stock/${alert.id}/status/toggle`;
    fetch(endpoint, {
      method: 'PUT', // Assuming the server accepts PUT requests for updating
      headers: {
        'ngrok-skip-browser-warning': '6024',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to toggle status for ${alert.symbol}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Toggle success:', data);
        // Update the local state to reflect the new status
        setAlerts((prevAlerts) =>
          prevAlerts.map((a) => {
            if (a.symbol === alert.symbol) {
              return { ...a, is_active: !a.is_active }; // Toggle the status in the state
            }
            return a;
          })
        );
        setSnackbarMessage(data.msg); // Use the message returned from the server
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
    
  };

  const removeAlert = (id) => {
    fetch(`https://e97a-2407-5200-400-43a3-7d13-db99-b628-f3e4.ngrok-free.app/notifications/stock/${id}/delete`, {
      method: 'DELETE',
      headers: {
        'ngrok-skip-browser-warning': '6024',
        'Content-Type': 'application/json',
      },
     
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete alert for ${id}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Delete success:', data);
        setSnackbarMessage(data.msg);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchStockAlerts(); // Refresh the alerts after deletion
      })
      .catch((error) => {
        setSnackbarMessage(`Error : ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };
  

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', gap: '20px' }}>
      {/* Add Stock Alert Form */}
      <Box sx={{ width: '40%' }}>
        <Typography variant="h4" gutterBottom>
          Add Stock Alert
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="stock-select-label">Select stock *</InputLabel>
            <Select
              labelId="stock-select-label"
              value={selectedStock}
              input={<OutlinedInput label="selectedStock" />}
              onChange={(e) => setSelectedStock(e.target.value)}
              required
            >
              {stockList.map((stock, index) => (
                <MenuItem key={index} value={stock}>
                  {stock}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="condition-select-label">Condition *</InputLabel>
            <Select
              labelId="condition-select-label"
              value={priceCondition}
              input={<OutlinedInput label="priceCondition" />}
              onChange={(e) => setPriceCondition(e.target.value)}
              required
            >
              <MenuItem value="below">Less than(Below)</MenuItem>
              <MenuItem value="above">Greater than(Above)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Price"
            type="number"
            value={thresholdValue}
            onChange={(e) => setThresholdValue(e.target.value)}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Units greater than"
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth className="alert-button">
            ADD NOTIFICATION
          </Button>
        </form>
      </Box>

      {/* Stock Alert List */}
      <Box sx={{ width: '60%' }}>
        <Typography variant="h4" gutterBottom>
          Stock Alert List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stock Symbol</TableCell>
                <TableCell>Condition (Type)</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell>{alert.symbol}</TableCell>
                    <TableCell>{alert.alert_type}</TableCell>
                    <TableCell>{alert.threshold_value}</TableCell>
                    <TableCell
                      onClick={() => toggleStatus(alert)}
                      style={{ cursor: 'pointer', color: alert.is_active ? 'green' : 'red' }}
                    >
                      {alert.is_active ? (
                        <NotificationsActiveIcon style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                      ) : (
                        <NotificationsOffIcon style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeAlert(alert.id)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Snackbar for Success/Error Response */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockAlert;
