import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import Players from '../components/Players.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';
import StartButton from '../components/StartButton.js';
import ActionPanel from '../components/ActionPanel.js';

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

  return (
    <>
      <div>GamePage</div>
      <Chat roomcode={gameObject.roomcode} username={username}/>
      <Players gameObject={gameObject}/>
      <div>
        Room: {gameObject.roomcode}
      </div>
      <div>
        Players: {gameObject.players.toString()}
      </div>
      <div>
        Host: {gameObject.host}
      </div>
      <StartButton gameObject={gameObject} username={username}/>
      <ActionPanel gameObject={gameObject} username={username}/>
    </>
  )
}

export default GamePage