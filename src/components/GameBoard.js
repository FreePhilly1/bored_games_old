import React from 'react';
import { useState, useEffect, useContext } from 'react';
import PlayerCards from './PlayerCard.js';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../contexts/socket.js';
import StartButton from '../components/StartButton.js';
import ActionPanel from '../components/ActionPanel.js';
import ActionMessage from '../components/ActionMessage.js';
import ResponsePanel from '../components/ResponsePanel.js';
import ChallengePanel from '../components/ChallengePanel.js';
import SelectCardPanel from '../components/SelectCardPanel.js';
import BlockPanel from '../components/BlockPanel.js';
import BlockChallengePanel from '../components/BlockChallengePanel.js';
import AmbassadorPanel from '../components/AmbassadorPanel.js';
import AssassinPanel from '../components/AssassinPanel.js';

import './GameBoard.css';

//SVGs
import AmbassadorSVG from '../svgs/ambassador.svg';
import AssassinSVG from '../svgs/assassin.svg';
import CaptainSVG from '../svgs/captain.svg';
import CoinSVG from '../svgs/coin.svg';
import ContessaSVG from '../svgs/contessa.svg';
import DukeSVG from '../svgs/duke.svg';
import BackSVG from '../svgs/back.svg';
import CoinStack from '../svgs/coin-stack.svg'
import CardStack from '../svgs/deck.svg';
import PlaceHolder from '../svgs/placeholder.svg';
import CoinAngled from '../svgs/coin-angled.svg';
import PlayerConsole from './PlayerConsole.js';

function GameBoard(props) {
  const socket = useContext(SocketContext);
  const [gameObject, setGameObject] = useState(props.gameObject);
  const username = props.username;

  useEffect(() => {
    socket.on('game-state', ({ gameObject }) => {
      setGameObject(gameObject);
    }, [socket]);
  });

  console.log(gameObject);

  return (
    <>
      <div className='game-screen'>

        <div className='deck'>
          <img src={CardStack} alt='BACK' height='150px'></img>
          <img src={CoinStack} alt='BACK' height='150px'></img>
        </div>
        
        <div className='table'>
          <div className='other-1'>
            <h2 className='name-tag'>PHILLIP</h2>
            <img className='other-card-1' src={BackSVG} alt='BACK' height='150px'></img>
            <img className='other-card-2' src={BackSVG} alt='BACK' height='150px'></img>
          </div>
          <div className='other-2'>
            <h2 className='name-tag'>BRYAN</h2>  
            <img className='other-card-1' src={BackSVG} alt='BACK' height='150px'></img>
            <img className='other-card-2' src={BackSVG} alt='BACK' height='150px'></img>
          </div>
          <div className='other-3'>
            
            <img className='placeholder' src={PlaceHolder} alt='PLACEHOLDER' height='150px'></img>
          </div>
          <div className='other-4'>
            
            <img className='placeholder' src={PlaceHolder} alt='PLACEHOLDER' height='150px'></img>
          </div>
          <div className='other-5'>
            
            <img className='placeholder' src={PlaceHolder} alt='PLACEHOLDER' height='150px'></img>
          </div>
        </div>

        <PlayerConsole gameObject={gameObject} username={username}/>

        <div className='info-box'>
          <PlayerCards gameObject={gameObject}/>
          <StartButton gameObject={gameObject} username={username}/>
          <ActionPanel gameObject={gameObject} username={username}/>
          <ActionMessage gameObject={gameObject}/>
          <ResponsePanel gameObject={gameObject} username={username}/>
          <ChallengePanel gameObject={gameObject} username={username}/>
          <SelectCardPanel gameObject={gameObject} username={username}/>
          <BlockPanel gameObject={gameObject} username={username}/>
          <BlockChallengePanel gameObject={gameObject} username={username}/>
          <AmbassadorPanel gameObject={gameObject} username={username}/>
          <AssassinPanel gameObject={gameObject} username={username}/>
        </div>
      
      </div>
    </>
  )
}

export default GameBoard