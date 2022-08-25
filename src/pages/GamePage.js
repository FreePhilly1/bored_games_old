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
  const [target, setTarget] = useState(0);
  const myIdx = roomData.players.indexOf(username);

  useEffect(() => {
    socket.on('game-state', (data) => {
      setRoomData(data);
    }, [socket]);

    socket.on('init-game-complete', (data) => {
      setGameState(data);
    }, [socket]);

    socket.on('new-gamestate', (data) => {
      console.log(data.actionData);
      setGameState(data.gameState);
    })
  });

  const initializeGame = async (e) => {
    e.preventDefault();
    await socket.emit('init-game', { roomcode: roomData.roomcode, players: roomData.players });
  }

  const handleIncome = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "income"}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleForeignAid = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "foreign-aid"}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleTax = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "tax"}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleSteal = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "steal", target}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleExchange = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "exchange"}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleAssassinate = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "assassinate", target}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleCoup = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "coup", target}
    await socket.emit('card-action', { roomcode: roomData.roomcode, actionData });
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
        myIdx: {myIdx}
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
      <button onClick={handleIncome}>Income</button>
      <button onClick={handleForeignAid}>Foreign</button>
      <button onClick={handleTax}>tax</button>
      <button onClick={handleSteal}>steal</button>
      <button onClick={handleExchange}>exchange</button>
      <button onClick={handleAssassinate}>assassinate</button>
      <button onClick={handleCoup}>Coup</button>
      <form>
        {
          roomData.players.map((player, idx) => {
            console.log(player, idx);
            return (
              <>
                <input type="radio" id={`${player}-target`} name="target" value={idx}/>
                <label for={`${player}-target`}>{player}</label>
                <br/>
              </>
            )
          }
        )}
      </form>
    </>
  )
}

export default GamePage