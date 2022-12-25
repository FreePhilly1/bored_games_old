import React from 'react';
import { useState, useEffect, useContext } from 'react';
import CoinAngled from '../svgs/coin-angled.svg';
import Card from './Card';

function PlayerConsole(props) {
    const gameObject = props.gameObject;
    const username = props.username;
    console.log(gameObject);
    console.log(username);

    return (
      gameObject.gameStart &&
        <div className='player-items'>
          <div className='coins'>
            <img className='coin' src={CoinAngled} alt='COIN' width='130px' style={{bottom: '0px'}}></img>
            <img className='coin' src={CoinAngled} alt='COIN' width='130px' style={{bottom: '10px'}}></img>
            <img className='coin' src={CoinAngled} alt='COIN' width='130px' style={{bottom: '20px'}}></img>
          </div>
          {gameObject.playerStates[username].cards.map((role, idx) => {
            return (<Card role={role} className={`player-card-${idx + 1}`}/>);
          })
          }
        </div>
    );
}

export default PlayerConsole;