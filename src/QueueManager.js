import React, { useState, useEffect } from 'react';

/*
    This component is used to display the queues of people waiting to go up or down. 
    It also allows the user to manually add or remove people from the queues.    
*/

const QueueManager = ({ numFloors, onQueueChange }) => {
  const [upQueue, setUpQueue] = useState(Array(numFloors).fill(false));
  const [downQueue, setDownQueue] = useState(Array(numFloors).fill(false));

  useEffect(() => {
    onQueueChange(upQueue, downQueue);
  }, [upQueue, downQueue, onQueueChange]);



  return null;
};

export default QueueManager;
