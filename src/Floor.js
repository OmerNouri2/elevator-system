import React, { useState } from 'react';

const Floor = ({ floorNumber, onCallElevator }) => {
    const [buttonText, setButtonText] = useState('Call');
    const [buttonColor, setButtonColor] = useState('green');
  
    const handleClick = () => {
      if (buttonText !== 'Call') {
        return;
      }
      onCallElevator(floorNumber);
      setButtonText('Waiting');
      setButtonColor('red');
    
      // Wait for 2 seconds before resetting the button text and color
      setTimeout(() => {
        setButtonText('Call');
        setButtonColor('green');
      }, 2000);
      // play a sound when the elevator reaches the floor
      const sound = new Audio("path/to/sound.mp3");
      sound.play();
    };
    
  
    return (
      <div className="floor">
        <button
          className="floor-button"
          style={{ backgroundColor: buttonColor }}
          onClick={handleClick}
          disabled={buttonText !== 'Call'}
        >
          {buttonText}
        </button>
        <p>Floor {floorNumber}</p>
      </div>
    );
  };

export default Floor;
