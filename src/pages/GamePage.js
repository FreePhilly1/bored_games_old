import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';

function GamePage(props) {
  const socket = useContext(SocketContext);
  let location = useLocation();
  const username = location.state.username;
  const [gameState, setGamestate] = useState(location.state.gameState);

  useEffect(() => {
    socket.on('game-state', (data) => {
        setGamestate(data);
    })
}, [socket]);

    
  return (
    <>
      <div>GamePage</div>
      <Chat roomcode={gameState.roomcode} username={username}/>
      {JSON.stringify(gameState)}
    </>
  )
}

export default GamePage