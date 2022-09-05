import React from 'react';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function SelectCardPanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;
    let roomcode = gameObject.roomcode;

    useEffect(() => {
        socket.on('asdf', () => {
            console.log('asdf');
        }, [socket]);
    });

    const submitCard = async (e) => {
        e.preventDefault();
        await socket.emit('remove-card', { roomcode, cardIdx: e.target.value, username });
    };

    return (
        gameObject.gameStart && gameObject.challengerLost &&
        username === gameObject.challenger &&
        <>
        {
            gameObject.playerStates[username].cards.map((card, idx) => {
                return (<button className={`${card}-card`} value={idx} onClick={submitCard}>{card}</button>)
            })
        }
        </>
    );
}