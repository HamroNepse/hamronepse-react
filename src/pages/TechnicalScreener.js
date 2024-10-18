// src/pages/TechnicalScreener.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const TechnicalScreener = () => {
  const [bollingerBand, setBollingerBand] = useState('Above Upper Band');
  const [macd, setMacd] = useState('Up');
  const [rsi, setRsi] = useState('70-100');
  const [sector, setSector] = useState('Hydropower');
  const [supertrendLength, setSupertrendLength] = useState(10);
  const [supertrendFactor, setSupertrendFactor] = useState(3);
  const [submittedData, setSubmittedData] = useState([]); // State to hold submitted data

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      stockName: 'Stock ABC', // Replace with actual stock name if available
      sector,
      ltp: 100, // Replace with actual LTP if available
    };
    setSubmittedData((prevData) => [...prevData, data]); // Update submitted data state with the new entry
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Technical Screener
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Row for Bollinger Band, MACD, and RSI */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <FormControl fullWidth margin="normal">
            <Typography>Bollinger Band</Typography>
            <Select
              value={bollingerBand}
              onChange={(e) => setBollingerBand(e.target.value)}
              fullWidth
            >
              <MenuItem value="Above Upper Band">Above Upper Band</MenuItem>
              <MenuItem value="Inside Bollinger Band">Inside Bollinger Band</MenuItem>
              <MenuItem value="Below Lower Band">Below Lower Band</MenuItem>
              <MenuItem value="LTP Between Upper Band & Middle Line">LTP Between Upper Band & Middle Line</MenuItem>
              <MenuItem value="LTP Between Middle Line & Lower Band">LTP Between Middle Line & Lower Band</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Typography>MACD</Typography>
            <Select
              value={macd}
              onChange={(e) => setMacd(e.target.value)}
              fullWidth
            >
              <MenuItem value="Up">Up</MenuItem>
              <MenuItem value="Down">Down</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Typography>RSI</Typography>
            <Select
              value={rsi}
              onChange={(e) => setRsi(e.target.value)}
              fullWidth
            >
              <MenuItem value="70-100">70-100</MenuItem>
              <MenuItem value="30-70">30-70</MenuItem>
              <MenuItem value="0-30">0-30</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Row for Sector, Supertrend Length, and Supertrend Factor */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: 2 }}>
          <FormControl fullWidth margin="normal">
            <Typography>Sector</Typography>
            <Select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              fullWidth
            >
              <MenuItem value="Hydropower">Hydropower</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Dev Bank">Dev Bank</MenuItem>
              <MenuItem value="C Bank">C Bank</MenuItem>
              <MenuItem value="Manufacture">Manufacture</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Typography>Supertrend Length</Typography>
            <TextField
              type="number"
              value={supertrendLength}
              onChange={(e) => setSupertrendLength(e.target.value)}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Typography>Supertrend Factor</Typography>
            <TextField
              type="number"
              value={supertrendFactor}
              onChange={(e) => setSupertrendFactor(e.target.value)}
              fullWidth
            />
          </FormControl>
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </form>

      {/* Display submitted data in a table */}
      {submittedData.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stock Name</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>LTP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.stockName}</TableCell>
                  <TableCell>{data.sector}</TableCell>
                  <TableCell>{data.ltp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TechnicalScreener;
