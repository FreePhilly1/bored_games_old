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
        let data = {roomcode, cardIdx: e.target.value, username};
        if (gameObject.blockInProgress) {
            data.block = true;
        } else {
            data.block = false;
        }
        await socket.emit('select-card-challenge', data);
    };

    return (
        gameObject.gameStart && gameObject.challengerLost &&
        username === gameObject.challenger &&
        <>
        {
            gameObject.playerStates[username].cards.map((card, idx) => {
                return (<button style={{backgroundColor: "green"}} className={`${card}-card`} value={idx} onClick={submitCard}>{card}</button>)
            })
        }
        </>
    );
}