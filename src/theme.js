import { createTheme } from '@mui/material/styles';

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Apply Poppins font
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Apply Poppins font
  },
});
