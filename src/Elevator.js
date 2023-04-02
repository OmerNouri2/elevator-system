import React, { useState, useEffect } from 'react';
import ElevatorButton from './ElevatorButton';

const Elevator = ({ elevatorNumber, destinations, onFloorReached }) => {
  const [currentDirection, setCurrentDirection] = useState('none');
  const [currentDestination, setCurrentDestination] = useState(null);
  const [buttonText, setButtonText] = useState('Idle');
  const [buttonColor, setButtonColor] = useState('black');
  const [isOccupied, setIsOccupied] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (destinations.length === 0) {
        setCurrentDirection('none');
        setCurrentDestination(null);
        setButtonText('Idle');
        setButtonColor('green');
        setIsOccupied(false);
      } else {
        const nextFloor = destinations[0];
        if (nextFloor > currentFloor) {
          setCurrentDirection('up');
          setButtonText('Occupied');
          setButtonColor('red');
          setIsOccupied(true);
          destinations.sort((a, b) => a - b);
        } else if (nextFloor < currentFloor) {
          setCurrentDirection('down');
          setButtonText('Occupied');
          setButtonColor('red');
          setIsOccupied(true);
          destinations.sort((a, b) => b - a);
        } else {
          if (nextFloor === currentFloor) {
            destinations.shift();
            onFloorReached();
          }
          destinations.shift();
          onFloorReached();
          setCurrentDirection('none');
          setCurrentDestination(null);
          setIsOccupied(false);
          setButtonText("Idle");
          setButtonColor("green");
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentFloor, destinations, onFloorReached]);

  useEffect(() => {
    if (isOccupied && currentDestination !== null) {
      // The elevator is occupied and has a destination set
      if (currentDestination > currentFloor && currentDirection !== 'down') {
        // If the current floor is below the destination floor and the elevator is not already going up
        setCurrentDirection('up');
      } else if (currentDestination < currentFloor && currentDirection !== 'up') {
        // If the current floor is above the destination floor and the elevator is not already going down
        setCurrentDirection('down');
      }
      setButtonText(currentDestination.toString());
      setButtonColor('red');
    }
  }, [currentDestination, currentFloor, currentDirection, isOccupied]);

  const handleClick = () => {
    if (destinations.length === 0 || isOccupied || destinations[0] === currentFloor) {
      return;
    }
  
    const nextDestination = destinations[0];
    if (nextDestination === currentFloor) {
        destinations.shift();
        onFloorReached();
        setCurrentDirection('none');
        setCurrentDestination(null);
        setIsOccupied(false);
        setButtonText("Idle");
        setButtonColor("green");
        setCurrentFloor(nextDestination); // Update the current floor
        return;
      }
    destinations.push(nextDestination);
    setCurrentDestination(nextDestination);
    setIsOccupied(true);
    setCurrentFloor(currentFloor + (currentDirection === 'up' ? 1 : -1));
  };

  useEffect(() => {
    setCurrentDestination(destinations[0]);
  }, [destinations]);

  return (
    <div className="elevator">
      <h3>Elevator {elevatorNumber}</h3>
      <p>Current floor: {currentFloor}</p>
      <p>Destinations: {destinations.join(', ')}</p>
      <p>Direction: {currentDirection}</p>
      <ElevatorButton buttonText={buttonText} buttonColor={buttonColor} onClick={handleClick} />
    </div>
  );
};

export default Elevator;
