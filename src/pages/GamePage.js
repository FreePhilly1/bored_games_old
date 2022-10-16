import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import GameBoard from '../components/GameBoard.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';

import './GamePage.css';

function GamePage() {
  const socket = useContext(SocketContext);
  let location = useLocation();
  const username = location.state.username;
  const [gameObject, setGameObject] = useState(location.state.gameObject);

  useEffect(() => {
    socket.on('game-state', ({ gameObject }) => {
      setGameObject(gameObject);
    }, [socket]);
  });

  console.log(gameObject);

  return (
    <>
      <div>
        <GameBoard gameObject={gameObject} username={username}/>
      </div>
      <div className='chat'>
        <Chat roomcode={gameObject.roomcode} username={username}/>
      </div>
    </>
  )
}

export default GamePage