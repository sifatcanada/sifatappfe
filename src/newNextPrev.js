import React, { useState } from 'react';

const App = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div>
      <h1>Step {step}</h1>

      {/* Render different content based on the step */}
      {step === 1 && (
        <div>
          <p>Content for Step 1</p>
        </div>
      )}

      {step === 2 && (
        <div>
          <p>Content for Step 2</p>
        </div>
      )}

      {step === 3 && (
        <div>
          <p>Content for Step 3</p>
        </div>
      )}

      {/* "Previous" button is disabled on the first step */}
      <button onClick={handlePrevious} disabled={step === 1}>
        Previous
      </button>

      {/* "Next" button is disabled on the last step */}
      <button onClick={handleNext} disabled={step === 3}>
        Next
      </button>
    </div>
  );
};

export default App;
