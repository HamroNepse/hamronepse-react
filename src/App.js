import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SideNavBar from './components/SideNavBar';
import Portfolio from './pages/Portfolio';
import StockAlert from './pages/StockAlert';
import BuySell from './pages/BuySell'
import TechnicalScreener from './pages/TechnicalScreener'
import { Box } from '@mui/material';
import theme from './theme'; 
import { ThemeProvider } from '@mui/material/styles';
import LiveMarket from './pages/LiveMarket'

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div className="App">
        <Box sx={{ display: 'flex' }}>
          {/* SideNavBar remains persistent */}
          <SideNavBar />

          {/* Main content */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
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
