import React from 'react';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function ActionPanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;
    let roomcode = gameObject.roomcode;
    let currentPlayer = gameObject.players[gameObject.turnIdx];

    useEffect(() => {
        socket.on('asdf', () => {
            console.log('asdf');
        }, [socket]);
    });

    const handleIncome = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "income" };
        await socket.emit('regular-action', { actionData, roomcode } );
    }

    const handleCoup = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "coup", target:"philly", guess:"duke"}
        await socket.emit('regular-action', { actionData, roomcode} );
    }

    return (
        gameObject.gameStart &&
        currentPlayer === username && 
        <>
            {
            gameObject.playerStates[username].coins < 10 &&
            <>
                <button onClick={handleIncome}>Income</button>
                <button>Foreign Aid</button>
                <button>Tax</button>
                <button>Assassinate</button>
                <button>Steal</button>
                <button>Exchange</button>
            </>
            }
            <button onClick={handleCoup}>Coup</button>
        </>
    );
}