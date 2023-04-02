// import React, { useState, useEffect } from 'react';
// import Floor from './Floor';
// import Elevator from './Elevator';
// // import QueueManager from './QueueManager';
// /*
//     The main logic for the elevator system. 
//     Manage the state of the elevators, their destinations, 
//     and the queues of people waiting to go up or down. 
//     The component also renders the floors and elevators using the Floor and Elevator components, respectively.
// */

// const ElevatorSystem = ({ numFloors, numElevators }) => {
//   const [elevatorData, setElevatorData] = useState(
//     Array(numElevators).fill().map((_, i) => ({
//       elevatorNumber: i + 1,
//       currentFloor: 1,
//       destinations: [],
//       isOccupied: false, // add isOccupied property
//     }))
//   );

//   const [upQueue, setUpQueue] = useState(Array(numFloors).fill(false));
//   const [downQueue, setDownQueue] = useState(Array(numFloors).fill(false));

//   useEffect(() => {
//     elevatorData.forEach(elevator => {
//     if (elevator.destinations.includes(elevator.currentFloor)) {
//         const newDestinations = elevator.destinations.filter(
//         destination => destination !== elevator.currentFloor
//         );
//         setElevatorData(prevData => {
//         const newData = [...prevData];
//         newData[elevator.elevatorNumber - 1].destinations = newDestinations;
//         newData[elevator.elevatorNumber - 1].isOccupied = false; // set isOccupied to false
//         return newData;
//         });
//     }
//     });
//   }, [elevatorData]);

//   const handleQueueChange = (upQueue, downQueue) => {
//     setUpQueue(upQueue);
//     setDownQueue(downQueue);
//   };

//   /*
//     Responsible for determining which elevator to send to a particular floor. 
//     It does this by iterating over the elevators and finding the one that is closest to the floor 
//     and is currently not in use. 
//     If no idle elevators are available, the function adds the request to the appropriate queue (upQueue or downQueue).
//   */
//   const handleCallElevator = (floorNumber, direction) => {
//     // Determine which elevator to send based on direction and current location
//     let elevatorToCall = null;
//     let minDistance = Infinity;

//     elevatorData.forEach(elevator => {
//       const distance = Math.abs(elevator.currentFloor - floorNumber);
//       if (elevator.destinations.length === 0 && distance < minDistance) {
//         if (direction === 'up' && elevator.currentFloor < floorNumber) {
//           elevatorToCall = elevator.elevatorNumber;
//           minDistance = distance;
//         } else if (direction === 'down' && elevator.currentFloor > floorNumber) {
//           elevatorToCall = elevator.elevatorNumber;
//           minDistance = distance;
//         }
//       }
//     });

//     // If no idle elevators are available, add the request to the appropriate queue
//     if (elevatorToCall === null) {
//       if (direction === 'up') {
//         setUpQueue(prevQueue => {
//           const newQueue = [...prevQueue];
//           newQueue[floorNumber] = true;
//           return newQueue;
//         });
//       } else if (direction === 'down') {
//         setDownQueue(prevQueue => {
//           const newQueue = [...prevQueue];
//           newQueue[floorNumber] = true;
//           return newQueue;
//         });
//       }
//     } else {
//       setElevatorData(prevData => {
//         const newData = [...prevData];
//         newData[elevatorToCall - 1].destinations.push(floorNumber);
//         newData[elevatorToCall - 1].isOccupied = true; // set isOccupied to true
//         return newData;
//       });
//     }
//   };

//   /*
//     Called when an elevator reaches a floor. 
//     It updates the state of the elevators to indicate that the elevator has reached the floor and removes 
//     the floor from the list of destinations.
//   */
//   const handleFloorReached = (elevatorNumber) => {
//     setElevatorData(prevData => {
//       const newData = [...prevData];
//       const elevator = newData[elevatorNumber - 1];
//       const floor = elevator.destinations[0];
//       elevator.currentFloor = floor;
//       elevator.destinations.shift();
//       elevator.isOccupied = false;
//       return newData;
//     });
//   };

//   const elevators = elevatorData.map(({ elevatorNumber, currentFloor, destinations }) =>
//     <Elevator
//       key={elevatorNumber}
//       elevatorNumber={elevatorNumber}
//       currentFloor={currentFloor}
//       destinations={destinations}
//       onFloorReached={() => handleFloorReached(elevatorNumber)}
//     />
//   );

//   const floors = [];

//   for (let i = 1; i <= numFloors; i++) {
//     floors.push(
//       <Floor
//             key={i}
//             floorNumber={i}
//             onCallElevator={(floorNumber) => handleCallElevator(floorNumber, 'up')}
//       />
//     );
//   }

    
//     return (
//         <div className="elevator-system">
//             <div className="floors">{floors}</div>
//             <div className="elevators">{elevators}</div>
//             {/* <QueueManager
//                 numFloors={numFloors}
//                 upQueue={upQueue}
//                 downQueue={downQueue}
//                 onQueueChange={handleQueueChange}
//             /> */}
//         </div>
//         );
//     };
    
//     export default ElevatorSystem;


import React, { useState } from 'react';
import Floor from './Floor';
import Elevator from './Elevator';

const NUM_FLOORS = 10;
const NUM_ELEVATORS = 5;

const ElevatorSystem = () => {
  const [elevators, setElevators] = useState(
    Array.from({ length: NUM_ELEVATORS }, (_, i) => ({
      currentFloor: 0,
      destinations: [],
      isOccupied: false,
    }))
  );
  const [requests, setRequests] = useState([]);
  
  const handleCallElevator = (floorNumber) => {
    setRequests((prevState) => {
      const newRequests = [...prevState, floorNumber];
      const sortedRequests = newRequests.sort((a, b) => a - b);
      const direction = floorNumber > sortedRequests[0] ? 'up' : 'down';
      return direction === 'up' ? sortedRequests : sortedRequests.reverse();
    });
  
    const availableElevator = elevators.find((elevator) => !elevator.isOccupied);
    if (availableElevator) {
      availableElevator.destinations.push(floorNumber);
      availableElevator.destinations.sort((a, b) => a - b);
      availableElevator.isOccupied = true;
      return;
    }
  
    let minDistance = Infinity;
    let nearestElevatorIndex = null;
    for (let i = 0; i < elevators.length; i++) {
      const distance = Math.abs(elevators[i].currentFloor - floorNumber);
      if (distance < minDistance) {
        minDistance = distance;
        nearestElevatorIndex = i;
      }
    }
    const nearestElevator = elevators[nearestElevatorIndex];
    nearestElevator.destinations.push(floorNumber);
    nearestElevator.destinations.sort((a, b) => {
      if (nearestElevator.currentFloor < floorNumber) {
        return a - b;
      } else {
        return b - a;
      }
    });
    nearestElevator.isOccupied = true;
  };
  
  const handleFloorReached = (elevatorIndex) => {
    const updatedElevators = [...elevators];
    updatedElevators[elevatorIndex].currentFloor =
      updatedElevators[elevatorIndex].destinations[0];
    updatedElevators[elevatorIndex].destinations.shift();
    updatedElevators[elevatorIndex].isOccupied =
      updatedElevators[elevatorIndex].destinations.length > 0;
    setElevators(updatedElevators);
    new Audio('/path/to/sound.mp3').play();
  };

  return (
    <div className="elevator-system">
      <div className="floors">
        {Array.from({ length: NUM_FLOORS }, (_, i) => (
          <Floor key={i} floorNumber={i} onCallElevator={handleCallElevator} />
        ))}
      </div>
      <div className="elevators">
        {elevators.map((elevator, i) => (
          <Elevator
            key={i}
            elevatorNumber={i+1}
            currentFloor={elevator.currentFloor}
            destinations={elevator.destinations}
            onFloorReached={() => handleFloorReached(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default ElevatorSystem;

