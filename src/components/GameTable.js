import React from 'react';
import { useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';
import './GameTable.css';

//SVGs
import AmbassadorSVG from '../svgs/ambassador.svg';
import AssassinSVG from '../svgs/assassin.svg';
import CaptainSVG from '../svgs/captain.svg';
import CoinSVG from '../svgs/coin.svg';
import ContessaSVG from '../svgs/contessa.svg';
import DukeSVG from '../svgs/duke.svg';
import BackSVG from '../svgs/back.svg';

function GameTable(props) {
  const players = props.players;
  const playerStates = props.playerStates;
  const username = props.username;

  return (
    <>
        <div className='table'>

            {players.map((player, idx) => {
                if (player === username) {
                    return (<></>)
                }
                let boardIdx = ((idx - players.indexOf(username) + players.length) % players.length) % players.length - 1;
                return(
                <div className={`other-${boardIdx}`}>
                    <h2 className='name-tag'>{player}</h2>
                    {/* {playerStates && } */}
                    <img className='other-card-1' src={BackSVG} alt='BACK' height='150px'></img>
                    <img className='other-card-2' src={BackSVG} alt='BACK' height='150px'></img>
                </div>
                )}
            )}

          <div className='player-hand'>
            <h2 className='name-tag-hand'>{username}</h2>
            <img className='other-card-1' src={BackSVG} alt='BACK' height='200px'></img>
            <img className='other-card-2' src={BackSVG} alt='BACK' height='200px'></img>
          </div>
        </div>
    </>
  )
}

export default GameTable;