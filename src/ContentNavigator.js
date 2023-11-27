import React, { useState } from 'react';

const ContentNavigator = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contents = [
    'First Content',
    'Second Content',
    'Third Content',
    // Add more content as needed
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + contents.length) % contents.length);
  };

  return (
    <div>
      <h1>Current Content</h1>
      <p>{contents[currentIndex]}</p>
      <button onClick={handlePrevious} disabled={currentIndex === 0}>
        Previous
      </button>
      <button onClick={handleNext} disabled={currentIndex === contents.length - 1}>
        Next
      </button>
    </div>
  );
};

export default ContentNavigator;
