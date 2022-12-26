import React from 'react';
import { useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';
import "./StartButton.css";

export default function StartButton(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;

    const handleGameStart = async (e) => {
        e.preventDefault();
        await socket.emit('start-game', {roomcode: gameObject.roomcode} );
    };
    return (
        gameObject.host === username && !gameObject.gameStart &&
        (
            gameObject.players.length > 1 ?
            <button className="start-button" onClick={handleGameStart}>Start Game</button> : 
            <div>Waiting for More Players</div>
        )
    )
}