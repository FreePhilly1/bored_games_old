import React, { useState } from 'react';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function ActionPanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;
    let roomcode = gameObject.roomcode;
    let currentPlayer = gameObject.players[gameObject.turnIdx];
    const [selectTarget, setSelectTarget] = useState(false);
    const [targetType, setTargetType] = useState("");

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

    const chooseTarget = (e) => {
        e.preventDefault();
        setSelectTarget(true);
        setTargetType(e.target.value);
    }

    const handleTargetedAction = async (e) => {
        setSelectTarget(false);
        let actionData = { user: username, target: e.target.value };
        switch(targetType) {
            case "a":
                actionData.action = "assassinate";
                break;
            case "s":
                actionData.action = "steal";
                break;
            default:
                console.log("This should not be printed");
        }
        await socket.emit('special-action', { actionData, roomcode });
    }

    return (
        gameObject.gameStart && gameObject.selectAction &&
        currentPlayer === username && 
            (selectTarget ? 
        <>
            <button onClick={() => setSelectTarget(false)}>back</button>
            {gameObject.players.map(player => {
                if (player !== username && gameObject.playerStates[player].cards.length > 0) {
                    return (
                        <button onClick={handleTargetedAction} value={player}>{player}</button>
                    );
                }
                return (<></>);
            })}
        </>
        :
        <>
            {gameObject.playerStates[username].coins < 10 &&
                <>
                    <button className="-button" onClick={handleIncome}>Income</button>
                    <button className="-button" onClick={handleForeignAid}>Foreign Aid</button>
                    <button className="-button" onClick={handleTax}>Tax</button>
                    <button className="-button" onClick={chooseTarget} value="a">Assassinate</button>
                    <button className="-button" onClick={chooseTarget} value="s">Steal</button>
                    <button className="-button" onClick={handleExchange}>Exchange</button>
                </>
            }
            <button onClick={handleCoup}>Coup</button>
        </>)
    );
}