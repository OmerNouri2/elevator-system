import React, { useState, useEffect } from 'react';
import Floor from './Floor';
import Elevator from './Elevator';
import QueueManager from './QueueManager';
/*
    Here, we have implemented the main logic for the elevator system. 
    The component uses React hooks to manage the state of the elevators, their destinations, 
    and the queues of people waiting to go up or down. 
    The component also renders the floors and elevators using the Floor and Elevator components, respectively.
*/

const ElevatorSystem = ({ numFloors, numElevators }) => {
  const [elevatorData, setElevatorData] = useState(
    Array(numElevators).fill().map((_, i) => ({
      elevatorNumber: i + 1,
      currentFloor: 1,
      destinations: [],
      isOccupied: false, // add isOccupied property
    }))
  );

  const [upQueue, setUpQueue] = useState(Array(numFloors).fill(false));
  const [downQueue, setDownQueue] = useState(Array(numFloors).fill(false));

  useEffect(() => {
    elevatorData.forEach(elevator => {
    if (elevator.destinations.includes(elevator.currentFloor)) {
        const newDestinations = elevator.destinations.filter(
        destination => destination !== elevator.currentFloor
        );
        setElevatorData(prevData => {
        const newData = [...prevData];
        newData[elevator.elevatorNumber - 1].destinations = newDestinations;
        newData[elevator.elevatorNumber - 1].isOccupied = false; // set isOccupied to false
        return newData;
        });
    }
    });
  }, [elevatorData]);

  const handleQueueChange = (upQueue, downQueue) => {
    setUpQueue(upQueue);
    setDownQueue(downQueue);
  };

  /*
    Responsible for determining which elevator to send to a particular floor. 
    It does this by iterating over the elevators and finding the one that is closest to the floor 
    and is currently not in use. 
    If no idle elevators are available, the function adds the request to the appropriate queue (upQueue or downQueue).
  */
  const handleCallElevator = (floorNumber, direction) => {
    // Determine which elevator to send based on direction and current location
    let elevatorToCall = null;
    let minDistance = Infinity;

    elevatorData.forEach(elevator => {
      const distance = Math.abs(elevator.currentFloor - floorNumber);
      if (elevator.destinations.length === 0 && distance < minDistance) {
        if (direction === 'up' && elevator.currentFloor < floorNumber) {
          elevatorToCall = elevator.elevatorNumber;
          minDistance = distance;
        } else if (direction === 'down' && elevator.currentFloor > floorNumber) {
          elevatorToCall = elevator.elevatorNumber;
          minDistance = distance;
        }
      }
    });

    // If no idle elevators are available, add the request to the appropriate queue
    if (elevatorToCall === null) {
      if (direction === 'up') {
        setUpQueue(prevQueue => {
          const newQueue = [...prevQueue];
          newQueue[floorNumber] = true;
          return newQueue;
        });
      } else if (direction === 'down') {
        setDownQueue(prevQueue => {
          const newQueue = [...prevQueue];
          newQueue[floorNumber] = true;
          return newQueue;
        });
      }
    } else {
      setElevatorData(prevData => {
        const newData = [...prevData];
        newData[elevatorToCall - 1].destinations.push(floorNumber);
        newData[elevatorToCall - 1].isOccupied = true; // set isOccupied to true
        return newData;
      });
    }
  };

  /*
    Called when an elevator reaches a floor. 
    It updates the state of the elevators to indicate that the elevator has reached the floor and removes 
    the floor from the list of destinations.
  */
  const handleFloorReached = (elevatorNumber) => {
    setElevatorData(prevData => {
      const newData = [...prevData];
      const elevator = newData[elevatorNumber - 1];
      const floor = elevator.destinations[0];
      elevator.currentFloor = floor;
      elevator.destinations.shift();
      return newData;
    });
  };

  const elevators = elevatorData.map(({ elevatorNumber, currentFloor, destinations }) =>
    <Elevator
      key={elevatorNumber}
      elevatorNumber={elevatorNumber}
      currentFloor={currentFloor}
      destinations={destinations}
      onFloorReached={() => handleFloorReached(elevatorNumber)}
    />
  );

  const floors = [];

  for (let i = 1; i <= numFloors; i++) {
    floors.push(
      <Floor
            key={i}
            floorNumber={i}
            onCallElevator={(floorNumber) => handleCallElevator(floorNumber, 'up')}
      />
    );
  }

    
    return (
        <div className="elevator-system">
            <div className="floors">{floors}</div>
            <div className="elevators">{elevators}</div>
            <QueueManager
                numFloors={numFloors}
                upQueue={upQueue}
                downQueue={downQueue}
                onQueueChange={handleQueueChange}
            />
        </div>
        );
    };
    
    export default ElevatorSystem;
