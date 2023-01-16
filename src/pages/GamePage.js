import React from 'react';
import { useState, useEffect } from 'react';
import Chat from '../components/Chat.js';
import GameBoard from '../components/GameBoard.js';
import socketio from "socket.io-client";
import RoomInfo from '../components/RoomInfo.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';
import './GamePage.css';
const SOCKET_URL = "http://localhost:5000";

function GamePage() {
  let socket;
  let location = useLocation();
  const username = location.state.username;
  const [gameObject, setGameObject] = useState(location.state.gameObject);
  
  useEffect(() => {
    socket = socketio.connect(SOCKET_URL);
    socket.emit('game-loaded', { msg: "hello"});

    socket.on('game-state', ({ gameObject }) => {
      setGameObject(gameObject);
    });

    return () => {
      socket.off('game-state');
      socket.disconnect(SOCKET_URL);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <div className='gamepage-background'>
        <div className='gameboard-column'>
          <GameBoard gameObject={gameObject} username={username}/>
        </div>
        <div className='chat-column'>
          <RoomInfo roomcode={gameObject.roomcode} host={gameObject.host}/>
          <Chat roomcode={gameObject.roomcode} username={username}/>
        </div>
      </div>
    </SocketContext.Provider>
  )
}

export default GamePage;