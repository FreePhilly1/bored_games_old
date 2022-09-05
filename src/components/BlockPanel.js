import React from 'react';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function BlockPanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;
    let roomcode = gameObject.roomcode;
    console.log(gameObject);

    useEffect(() => {
        socket.on('asdf', () => {
            console.log('asdf');
        }, [socket]);
    });

    const sendChallenge = async (e) => {
        e.preventDefault();
        await socket.emit('send-block-vote', { voter: username, roomcode, response: 'challenge'});
    };

    const sendPass = async (e) => {
        e.preventDefault();
        await socket.emit('send-block-vote', { voter: username, roomcode, response: 'pass'});
    };

    return (
        gameObject.gameStart && gameObject.blockInProgress && !gameObject.challengeInProgress &&
        !gameObject.challengerLost && gameObject.blocker !== username && !gameObject.voters.includes(username) &&
        <>
            <button onClick={sendChallenge}>Challenge</button>
            <button onClick={sendPass}>Pass</button>
        </>
    );
}