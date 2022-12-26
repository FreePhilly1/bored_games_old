import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import GameBoard from '../components/GameBoard.js';
import RoomInfo from '../components/RoomInfo.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';

import './GamePage.css';

function GamePage() {
  const socket = useContext(SocketContext);
  let location = useLocation();
  console.log(location.state);
  const username = location.state.username;
  const [gameObject, setGameObject] = useState(location.state.gameObject);

  useEffect(() => {
    socket.on('game-state', ({ gameObject }) => {
      setGameObject(gameObject);
      console.log('hi is this working');
    }, [socket]);
  });

  return (
    <div className='gamepage-background'>
      <div className='gameboard-column'>
        <GameBoard gameObject={gameObject} username={username}/>
      </div>
      <div className='chat-column'>
        <RoomInfo roomcode={gameObject.roomcode} host={gameObject.host}/>
        <Chat roomcode={gameObject.roomcode} username={username}/>
      </div>
    </div>
  )
}

export default GamePage