import React from 'react';
import Card from './Card.js';
import './GameTable.css';

//SVGs
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
                    {playerStates.hasOwnProperty(player) && playerStates[player].cards.map((card, idx) => {
                        return (
                            <img className={`other-card-${idx + 1}`} src={BackSVG} alt='BACK' height='150px'/>
                        )
                    })}
                </div>
                )}
            )}

          <div className='player-hand'>
            <h2 className='name-tag-hand'>{username}</h2>
            {playerStates.hasOwnProperty(username) && playerStates[username].cards.map((card, idx) => {
                return (
                    <Card idx={idx} card={card}/>
                )
            })}
          </div>
        </div>
    </>
  )
}

export default GameTable;