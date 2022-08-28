import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket';

export default function Players(props) {
    let gameState = props.gameState;

    return (
        <>
            {
                gameState.hasOwnProperty('players') && 
                Object.keys(gameState.players).map((key) => {
                    return (
                        <div style={{ width: '200px', height: '100px', margin: '20px', borderRadius: '20px', backgroundColor: "red"}}>
                            <p>{key}</p>
                            <p>Cards: {gameState.players[key].cards.toString()}</p>
                            <p>Coins: {gameState.players[key].coins}</p>
                        </div>
                    )
                })
            }
        </>
    )
}