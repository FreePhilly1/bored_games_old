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
  console.log(gameState);

  useEffect(() => {
    socket.on('game-state', (data) => {
      setGamestate(data);
    }, [socket]);

    socket.on('init-game-complete', (data) => {
      console.log(data);
    }, [socket]);
    });

  const initializeGame = async (e) => {
    e.preventDefault();
    await socket.emit('init-game', { roomcode: gameState.roomcode, players: gameState.players });
  }

    
  return (
    <>
      <div>GamePage</div>
      <Chat roomcode={gameState.roomcode} username={username}/>
      {JSON.stringify(gameState)}
      <button onClick={initializeGame}>Start Game</button>
    </>
  )
}

export default GamePage