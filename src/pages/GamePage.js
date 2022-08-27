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
  const [target, setTarget] = useState("");
  const [currAction, setCurrAction] = useState(null);
  const [guess, setGuess] = useState("");
  const [challengeIP, setChallengeIP] = useState(false);
  const [ambassadorCards, setAmbassadorCards] = useState([]);

  useEffect(() => {
    socket.on('game-state', (data) => {
      setRoomData(data);
    }, [socket]);

    socket.on('init-game-complete', (data) => {
      setGameState(data);
    }, [socket]);

    socket.on('new-gamestate', (data) => {
      setCurrAction(data.actionData);
      setGameState(data.gameState);
    });

    socket.on('check-challenge-block', (data) => {
      setCurrAction(data);
      setChallengeIP(true);
    });

    socket.on('challenge-received', () => {
      setChallengeIP(false);
    });

    socket.on('choose-exchange', (data) => {
      console.log(data);
      setGameState(data);
    })
  });

  const initializeGame = async (e) => {
    e.preventDefault();
    await socket.emit('init-game', { roomcode: roomData.roomcode, players: roomData.players });
  }

  const handleIncome = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "income", user: gameState.turn}
    await socket.emit('nochallenge-card-action', { roomcode: roomData.roomcode, actionData });
  }

  const handleForeignAid = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "foreign-aid", user: gameState.turn}
    await socket.emit('start-special-card', { roomcode: roomData.roomcode, actionData });
  }

  const handleTax = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "tax", user: gameState.turn}
    await socket.emit('start-special-card', { roomcode: roomData.roomcode, actionData });
  }

  const handleSteal = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "steal", user: gameState.turn, target}
    if (target) {
      await socket.emit('start-special-card', { roomcode: roomData.roomcode, actionData });
    }
  }

  const handleExchange = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "exchange", user: gameState.turn}
    await socket.emit('start-special-card', { roomcode: roomData.roomcode, actionData });
  }

  const handleAssassinate = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "assassinate", user: gameState.turn, target}
    if (target) {
      await socket.emit('start-special-card', { roomcode: roomData.roomcode, actionData });
    }
  }

  const handleCoup = async (e) => {
    e.preventDefault();
    let actionData = {actionType: "coup", user: gameState.turn, target, guess}
    if (target && guess) {
      await socket.emit('nochallenge-card-action', { roomcode: roomData.roomcode, actionData });
    }
  }

  const handleChallenge = async (e) => {
    e.preventDefault();
    let data = {user: username, action: "challenge"};
    await socket.emit("challenge-response", {roomcode: roomData.roomcode, data});
  }

  const handleBlock = async (e) => {
    e.preventDefault();
    let data = {user: username, action: "block"};
    await socket.emit("challenge-response", {roomcode: roomData.roomcode, data});
  }

  const handleNoAction = async (e) => {
    e.preventDefault();
    let data = {user: username, action: ""};
    await socket.emit("challenge-response", {roomcode: roomData.roomcode, data});
  }

  const handleCardExchange = (e) => {
    let cardIdx = e.target.value;
    let find = ambassadorCards.indexOf(cardIdx);
    let arr = ambassadorCards;
    if (find > -1) {
      arr.splice(find, 1);
    } else {
      if (ambassadorCards.length <= 1) {
        arr.push(cardIdx);
      }
    }
    setAmbassadorCards(ambassadorCards);
    console.log(ambassadorCards);
  }

  const handleCardExchangeSubmit = async (e) => {
    e.preventDefault();
    if (ambassadorCards.length == 2) {
      await socket.emit("exchange-selected", {ambassadorCards, roomcode: roomData.roomcode});
    }
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
      {roomData.host === username && !('players' in gameState) &&
        <button onClick={initializeGame}>Start Game</button>
      }
      {
        gameState.turn === username &&
        <div>
          <button onClick={handleIncome}>Income</button>
          <button onClick={handleForeignAid}>Foreign</button>
          <button onClick={handleTax}>tax</button>
          <button onClick={handleSteal}>steal</button>
          <button onClick={handleExchange}>exchange</button>
          <button onClick={handleAssassinate}>assassinate</button>
          <button onClick={handleCoup}>Coup</button>
        </div>
      }
      {
        currAction && 
          <div>{JSON.stringify(currAction)}</div>
      }
      <form>
        {
          roomData.players.map((player, idx) => {
            return (
              <>
                <input
                  key={`${idx}-target`}
                  type="radio"
                  name="target"
                  value={player}
                  onChange={(e) => setTarget(e.target.value)}
                />
                <label key={`${idx}-label`}>{player}</label>
                <br/>
              </>
            )
          })
        }
      </form>
      <div>Guess:</div>
      <form>
        <input
          type="radio"
          name="guess"
          value="assassin"
          onChange={(e) => setGuess(e.target.value)}
        />
        <label key="assassin-target">assassin</label>
        <br/>
        <input
          type="radio"
          name="guess"
          value="contessa"
          onChange={(e) => setGuess(e.target.value)}
        />
        <label key="contessa-target">contessa</label>
        <br/>
        <input
          type="radio"
          name="guess"
          value="ambassador"
          onChange={(e) => setGuess(e.target.value)}
        />
        <label key="ambassador-target">ambassador</label>
        <br/>
        <input
          type="radio"
          name="guess"
          value="duke"
          onChange={(e) => setGuess(e.target.value)}
        />
        <label key="duke-target">duke</label>
        <br/>
        <input
          type="radio"
          name="guess"
          value="captain"
          onChange={(e) => setGuess(e.target.value)}
        />
        <label key="captain-target">captain</label>
        <br/>
      </form>
      {
        currAction && currAction.user !== username &&
          challengeIP &&
          (currAction.actionType === "foreign-aid" ||
          currAction.actionType === "assassinate" ||
          currAction.actionType === "tax" || 
          currAction.actionType === "exchange" ||
          currAction.actionType === "steal") &&
          <button onClick={handleBlock}>Block</button>
      }
      {
        currAction && currAction.user !== username &&
          challengeIP &&
          (currAction.actionType === "assassinate" ||
          currAction.actionType === "tax" || 
          currAction.actionType === "exchange" ||
          currAction.actionType === "steal") &&
          <button onClick={handleChallenge}>Challenge</button>
      }
      {
        currAction && currAction.user !== username &&
          challengeIP &&
          (currAction.actionType === "foreign-aid" ||
          currAction.actionType === "assassinate" ||
          currAction.actionType === "tax" || 
          currAction.actionType === "exchange" ||
          currAction.actionType === "steal") &&
          <button onClick={handleNoAction}>No action</button>
      }
      {gameState.hasOwnProperty('players') && gameState.players[username].cards.length > 2 &&
      <>
      <form onChange={handleCardExchange}>
        {gameState.players[username].cards.map((card, idx) => {
          return (
            <>
              <input
                type="checkbox"
                name="target"
                value={idx}
                handleOnChange={handleCardExchange}
              />
              <label>{card}</label>
              <br/>
            </>
          )
        })
        }
      </form>
      <button onClick={handleCardExchangeSubmit}>Submit Exchange</button>
      </>
      }
    </>
  )
}

export default GamePage