import React, { useState, useEffect, useCallback } from 'react';
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
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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

  const [modalOpen, setModalOpen] = useState(false); // State for modal open/close

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/stocks/`, {
      method: 'GET',
      headers: new Headers({
        'ngrok-skip-browser-warning': '6024',
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.symbols) {
          setStockList(data.symbols);
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
  }, [baseUrl]);

  const fetchStockAlerts = useCallback(() => {
    fetch(`${baseUrl}/notifications/`, {
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
        setAlerts(data.stock_alerts);
      })
      .catch((error) => {
        console.error('Error fetching stock alerts:', error);
        setSnackbarMessage(`Error fetching alerts: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  }, [baseUrl]);

  useEffect(() => {
    fetchStockAlerts();
  }, [fetchStockAlerts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const price_thresholds = {
      [selectedStock]: [
        { type: priceCondition, value: thresholdValue }
      ]
    };

    const dataToSend = {
      price_thresholds: price_thresholds
    };

    fetch(`${baseUrl}/notifications/add/`, {
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
        setSnackbarMessage(data.msg);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchStockAlerts();
        handleCloseModal(); // Close the modal on success
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

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStock('');
    setPriceCondition('');
    setThresholdValue('');
    setUnits(0);
  };

  const toggleStatus = (alert) => {
    const endpoint = `${baseUrl}/notifications/stock/${alert.id}/status/toggle`;
    fetch(endpoint, {
      method: 'PUT',
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
        setAlerts((prevAlerts) =>
          prevAlerts.map((a) => {
            if (a.symbol === alert.symbol) {
              return { ...a, is_active: !a.is_active };
            }
            return a;
          })
        );
        setSnackbarMessage(data.msg);
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
    fetch(`${baseUrl}/notifications/stock/${id}/delete`, {
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
        setSnackbarMessage(data.msg);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchStockAlerts();
      })
      .catch((error) => {
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', gap: '20px' }}>
      {/* Add Stock Alert Button */}


      {/* Stock Alert List */}
      <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ flexGrow: 1, textAlign: 'center' }}>
        Stock Alerts
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        startIcon={<AddIcon />}
        className='add-btn'
      >
        {/* You can keep this empty or remove the text */}
      </Button>
    </div>
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

      {/* Modal for Adding Stock Alert */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add Stock Alert</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Stock Symbol</InputLabel>
            <Select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              input={<OutlinedInput label="Stock Symbol" />}
            >
              {stockList.map((stock) => (
                <MenuItem key={stock} value={stock}>
                  {stock}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Condition</InputLabel>
            <Select
              value={priceCondition}
              onChange={(e) => setPriceCondition(e.target.value)}
              input={<OutlinedInput label="Condition" />}
            >
              <MenuItem value="above">Above</MenuItem>
              <MenuItem value="below">Below</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Threshold Value"
            type="number"
            fullWidth
            value={thresholdValue}
            onChange={(e) => setThresholdValue(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={!selectedStock || !priceCondition || !thresholdValue}>
            Add Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockAlert;
