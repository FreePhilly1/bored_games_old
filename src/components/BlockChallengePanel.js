import React from 'react';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function BlockChallengePanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;
    let currentAction = gameObject.currentAction;
    let roomcode = gameObject.roomcode;

    useEffect(() => {
        socket.on('asdf', () => {
            console.log('asdf');
        }, [socket]);
    });

    const submitCard = async (e) => {
        e.preventDefault();
        await socket.emit('send-card-block-challenge', { roomcode, cardIdx: e.target.value });
    };

    return (
        gameObject.gameStart && gameObject.blockInProgress && gameObject.challengeInProgress &&
        username === gameObject.blocker &&
        <>
        {
            gameObject.playerStates[username].cards.map((card, idx) => {
                return (<button style= {{backgroundColor: "red"}} className={`${card}-card`} value={idx} onClick={submitCard}>{card}</button>)
            })
        }
        </>
    );
}