import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SideNavBar from './components/SideNavBar';
import Portfolio from './pages/Portfolio';
import StockAlert from './pages/StockAlert';
import BuySell from './pages/BuySell';
import TechnicalScreener from './pages/TechnicalScreener';
import LiveMarket from './pages/LiveMarket';
import { Divider, Box, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme'; // Import both themes
import { useState, useEffect } from 'react';
import NepaliDateTime from "./components/NepaliDateTime";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);

  // Toggle between dark and light mode
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch("/nepse-data/market-open");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setMarketOpen(data.isOpen === "OPEN");
        console.log(data)
      } catch (error) {
        console.error("Failed to fetch market status:", error);
      }
    };
  
    fetchMarketStatus();
  }, []);
  

  // Update the body background color based on the theme
  useEffect(() => {
    const body = document.body;
    body.style.backgroundColor = darkMode
      ? darkTheme.palette.background.default
      : lightTheme.palette.background.default;
    body.style.color = darkMode
      ? darkTheme.palette.text.primary
      : lightTheme.palette.text.primary;
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <div className="App">

          <Box sx={{ display: 'flex' }}>
            {/* SideNavBar remains persistent */}
            <SideNavBar />

            {/* Main content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
              {/* Toggle button for dark and light mode */}
              <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '30px' }}>

                <div  className={`blobs ${marketOpen ? 'open' : ''}`} style={{ marginRight: '16px' }}>
                <span style={{ background: marketOpen ? 'green' : '#df0c0c' }}></span>
                <span style={{ background: marketOpen ? 'green' : '#df0c0c' }}></span>
                </div>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1 }} // Adds margin to the left and right of the divider
                />

                <IconButton

                  onClick={handleThemeChange}
                  color="inherit"
                  className='themeToggle'
                >
                  {darkMode ? <LightModeIcon className='light-mode' /> : <DarkModeIcon />}
                </IconButton>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1 }} // Adds margin to the left and right of the divider
                />
                <NepaliDateTime />
              </Box>
              {/* Routes */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/stockAlert" element={<StockAlert />} />
                <Route path="/buySell" element={<BuySell />} />
                <Route path="/tScreener" element={<TechnicalScreener />} />
                <Route path="/live" element={<LiveMarket />} />
              </Routes>
            </Box>
          </Box>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
