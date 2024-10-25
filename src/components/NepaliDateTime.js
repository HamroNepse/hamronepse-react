import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';  // Import useTheme to access the theme

const NepaliDateTime = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const theme = useTheme(); // Access the current theme

  useEffect(() => {
    const updateNepaliDateTime = () => {
      const now = new Date();

      // Format the date as "MMM DD"
      const options = { month: 'short', day: '2-digit' };
      const formattedDate = now.toLocaleDateString('en-US', options);

      // Format the time as "hh:mm:ss AM/PM"
      const optionsTime = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      };
      const formattedTime = now.toLocaleTimeString('en-US', optionsTime);

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateNepaliDateTime();
    const intervalId = setInterval(updateNepaliDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ color: theme.palette.text.primary, textAlign: 'center' }}>
      <h4>{currentDate}, {currentTime}</h4>
    </div>
  );
};

export default NepaliDateTime;
