import React from 'react';
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
import GameTable from './GameTable.js';

import './GameBoard.css';

function GameBoard(props) {
  const gameObject = props.gameObject;
  const username = props.username;

  console.log(gameObject);

  return (
    <>
      <div className='game-screen'>
        <GameTable username={username} players={gameObject.players} playerStates={gameObject.playerStates}/>
        <StartButton gameObject={gameObject} username={username}/>

        {/* <div className='info-box'>
          <ActionPanel gameObject={gameObject} username={username}/>
          <ActionMessage gameObject={gameObject}/>
          <ResponsePanel gameObject={gameObject} username={username}/>
          <ChallengePanel gameObject={gameObject} username={username}/>
          <SelectCardPanel gameObject={gameObject} username={username}/>
          <BlockPanel gameObject={gameObject} username={username}/>
          <BlockChallengePanel gameObject={gameObject} username={username}/>
          <AmbassadorPanel gameObject={gameObject} username={username}/>
          <AssassinPanel gameObject={gameObject} username={username}/>
        </div> */}
      
      </div>
    </>
  )
}

export default GameBoard