import React, { useState } from 'react';

/*
Here, we define the Floor component that takes in two props: floorNumber and onCallElevator. 
floorNumber represents the number of the floor that this component is rendering, and onCallElevator 
is a callback function passed down from the parent Building component that will be called when the 
button is clicked.

Inside the component, we use the useState hook to keep track of the state of the button. 
We set the initial text of the button to "Call" and the color to green.

When the button is clicked, we call the onCallElevator callback function passed down from the parent 
Building component with the floorNumber as an argument. We also change the text of the button to "Waiting"
and the color to red.

Finally, we render the button and the floor number inside a div element. We disable the 
button if the button text is not "Call".
*/

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
