import React from 'react';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function ResponsePanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let actionInformation = gameObject.actionInformation;
    let currentAction = gameObject.currentAction;
    let username = props.username;
    let roomcode = gameObject.roomcode;
    console.log(gameObject);

    useEffect(() => {
        socket.on('asdf', () => {
            console.log('asdf');
        }, [socket]);
    });

    const sendBlock = async (e) => {
        e.preventDefault();
        await socket.emit('send-vote', { voter: username, roomcode, response: 'block'});
    };

    const sendChallenge = async (e) => {
        e.preventDefault();
        await socket.emit('send-vote', { voter: username, roomcode, response: 'challenge'});
    };

    const sendPass = async (e) => {
        e.preventDefault();
        await socket.emit('send-vote', { voter: username, roomcode, response: 'pass'});
    };

    return (
        gameObject.gameStart && gameObject.acceptVotes &&
        currentAction.user !== username && !gameObject.voters.includes(username) &&
        <>
            {actionInformation[currentAction.action].block.length > 0 && 
                <button onClick={sendBlock}>Block</button>
            }
            {actionInformation[currentAction.action].challenge && 
                <button onClick={sendChallenge}>Challenge</button>
            }
            <button onClick={sendPass}>Pass</button>
        </>
    );
}