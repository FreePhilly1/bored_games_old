import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';

function GamePage(props) {
  const socket = useContext(SocketContext);
  let location = useLocation();
  const username = location.state.username;
  const [roomData, setRoomData] = useState(location.state.roomData);
  const [gameState, setGameState] = useState(roomData.gameState);

  useEffect(() => {
    socket.on('game-state', (data) => {
      setRoomData(data);
    }, [socket]);

    socket.on('init-game-complete', (data) => {
      setGameState(data);
    }, [socket]);
    });

  const initializeGame = async (e) => {
    e.preventDefault();
    await socket.emit('init-game', { roomcode: roomData.roomcode, players: roomData.players });
  }

    
  return (
    <>
      <div>GamePage</div>
      <Chat roomcode={roomData.roomcode} username={username}/>
      <div>
        Room: {roomData.roomcode}
      </div>
      <div>
        Players: {roomData.players.toString()}
      </div>
      <div>
        Host: {roomData.host}
      </div>
      <div>
        {JSON.stringify(gameState)}
      </div>
      {roomData.host === username &&
        <button onClick={initializeGame}>Start Game</button>
      }
    </>
  )
}

export default GamePage