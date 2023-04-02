import React from 'react';

const ElevatorButton = ({ buttonText, buttonColor, onClick }) => {
  return (
    <button
      className="elevator-button"
      style={{ backgroundColor: buttonColor }}
      onClick={onClick}
      disabled={buttonText === 'Occupied'}
    >
      {buttonText}
    </button>
  );
};

export default ElevatorButton;
