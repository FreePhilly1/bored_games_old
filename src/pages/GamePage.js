import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import GameBoard from '../components/GameBoard.js';
import RoomInfo from '../components/RoomInfo.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';

import './GamePage.css';
const SOCKET_URL = "http://localhost:5000";

function GamePage() {
  const socket = useContext(SocketContext);
  let location = useLocation();
  const username = location.state.username;
  const [gameObject, setGameObject] = useState(location.state.gameObject);
  
  useEffect(() => {
    
    socket.emit('game-loaded', { msg: "hello"});

    socket.on('game-state', ({ gameObject }) => {
      setGameObject(gameObject);
    }, [socket]);

    return () => {
      socket.off('game-state');
      socket.disconnect(SOCKET_URL);
    }
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