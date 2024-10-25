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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NepaliDateTime from "./components/NepaliDateTime";


function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle between dark and light mode
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

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

                <div className="blobs" style={{ marginRight: '16px' }}>
                  <span></span>
                  <span></span>
                </div>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1 }} // Adds margin to the left and right of the divider
                />

                <IconButton

                  onClick={handleThemeChange}
                  color="inherit"
                  className='lightMode'
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
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
