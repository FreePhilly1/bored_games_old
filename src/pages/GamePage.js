import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';

function GamePage(props) {
  const socket = useContext(SocketContext);
  let location = useLocation();
  const [gameState, setGamestate] = useState(location.state.gameState);

  useEffect(() => {
    socket.on('game-state', (data) => {
        setGamestate(data);
    })
}, []);

    
  return (
    <>
      <div>GamePage</div>
      <Chat roomcode={gameState.roomcode}/>
      {JSON.stringify(gameState)}
    </>
  )
}

export default GamePage