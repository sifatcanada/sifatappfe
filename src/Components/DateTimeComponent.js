import React from 'react';

const DateTimeComponent = () => {
  const getCurrentDate = () => {
    const currentDate = new Date();

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };

    return currentDate.toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <p>Current Date:</p>
      <p>{getCurrentDate()}</p>
    </div>
  );
};

export default DateTimeComponent;
