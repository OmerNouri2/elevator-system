import React, { useState, useEffect } from 'react';
import { ReactComponent as ElevatorIcon } from './elevator-icon.svg';

const Elevator = ({ elevatorNumber, currentFloor, destinations, onFloorReached }) => {
  const [currentDirection, setCurrentDirection] = useState('none');
  const [currentDestination, setCurrentDestination] = useState(null);
  const [buttonColor, setButtonColor] = useState('black');
  const [isOccupied, setIsOccupied] = useState(false);
  
 
  useEffect(() => {
    const intervalId = setTimeout(() => {
      if (destinations.length === 0) {
        setCurrentDirection('none');
        setCurrentDestination(null);
        setButtonColor('black');
        setIsOccupied(false);
      } else {
        console.log("destinations.length != 0");
        const nextFloor = destinations[0];
        console.log("nextFloor");
        console.log(nextFloor);
        if (nextFloor > currentFloor) {
          console.log("nextFloor > currentFloor");
          setCurrentDirection('up');
          setButtonColor('red');
          setIsOccupied(true);
          destinations.sort((a, b) => a - b);
          onFloorReached(elevatorNumber);
        } else if (nextFloor < currentFloor) {
          console.log("nextFloor < currentFloor");
          setCurrentDirection('down');
          setButtonColor('red');
          setIsOccupied(true);
          destinations.sort((a, b) => b - a);
          onFloorReached(elevatorNumber);
        } else {
          destinations.shift();
          console.log("elevatorNumber");
          console.log(elevatorNumber);
          onFloorReached(elevatorNumber);
          setCurrentDirection('none');
          setCurrentDestination(null);
          setIsOccupied(false);
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
      // setButtonText(currentDestination.toString());
      setButtonColor('red');
    }
  }, [currentDestination, currentFloor, currentDirection, isOccupied]);

  // useEffect(() => {
  //   setCurrentDestination(destinations[0]);
  // }, [destinations]);

  useEffect(() => {
    if (currentDestination !== null && currentDestination !== currentFloor) {
      // Move the elevator toward the destination floor
      const timeoutId = setTimeout(() => {
        if (currentDirection === 'up') {
          onFloorReached(elevatorNumber);
        } else {
          onFloorReached(elevatorNumber);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentDestination, currentFloor, currentDirection, onFloorReached]);

  return (
    <div className="elevator">
      <h3>Elevator {elevatorNumber}</h3>
      <p>Current floor: {currentFloor}</p>
      <p>Destinations: {destinations.join(', ')}</p>
      <p>Direction: {currentDirection}</p>
      <ElevatorIcon color={buttonColor}  />
    </div>
  );
};

export default Elevator;
