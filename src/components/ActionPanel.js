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

    const handleForeignAid = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "foreignAid" };
        await socket.emit('special-action', { actionData, roomcode });
    }

    const handleTax = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "tax" };
        await socket.emit('special-action', { actionData, roomcode });
    }

    const handleAssassinate = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "assassinate", target: "philly" };
        await socket.emit('special-action', { actionData, roomcode });
    }

    const handleSteal = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "steal", target: "philly" };
        await socket.emit('special-action', { actionData, roomcode });
    }

    const handleExchange = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "exchange" };
        await socket.emit('special-action', { actionData, roomcode });
    }

    const handleCoup = async (e) => {
        e.preventDefault();
        let actionData = { user: username, action: "coup", target:"philly", guess:"duke"}
        await socket.emit('regular-action', { actionData, roomcode} );
    }

    return (
        gameObject.gameStart && gameObject.selectAction &&
        currentPlayer === username && 
        <>
            {gameObject.playerStates[username].coins < 10 &&
                <>
                    <button onClick={handleIncome}>Income</button>
                    <button onClick={handleForeignAid}>Foreign Aid</button>
                    <button onClick={handleTax}>Tax</button>
                    <button onClick={handleAssassinate}>Assassinate</button>
                    <button onClick={handleSteal}>Steal</button>
                    <button onClick={handleExchange}>Exchange</button>
                </>
            }
            <button onClick={handleCoup}>Coup</button>
        </>
    );
}