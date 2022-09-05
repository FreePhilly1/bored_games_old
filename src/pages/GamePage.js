import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Chat from '../components/Chat.js';
import PlayerCards from '../components/PlayerCards.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';
import StartButton from '../components/StartButton.js';
import ActionPanel from '../components/ActionPanel.js';
import ActionMessage from '../components/ActionMessage.js';
import ResponsePanel from '../components/ResponsePanel.js';
import ChallengePanel from '../components/ChallengePanel.js';
import SelectCardPanel from '../components/SelectCardPanel.js';

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
      <div>GamePage</div>
      <Chat roomcode={gameObject.roomcode} username={username}/>
      <PlayerCards gameObject={gameObject}/>
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
      <ActionMessage gameObject={gameObject}/>
      <ResponsePanel gameObject={gameObject} username={username}/>
      <ChallengePanel gameObject={gameObject} username={username}/>
      <SelectCardPanel gameObject={gameObject} username={username}/>
    </>
  )
}

export default GamePage