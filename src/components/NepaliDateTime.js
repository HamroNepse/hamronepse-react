// src/components/NepaliDateTime.js

import React, { useEffect, useState } from 'react';

const NepaliDateTime = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateNepaliDateTime = () => {
      // Get the current date and time
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
    const intervalId = setInterval(updateNepaliDateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div style={{ color: 'white',  textAlign: 'center' }}>
      <h4>{currentDate}, {currentTime}</h4>
    </div>
  );
};

export default NepaliDateTime;
