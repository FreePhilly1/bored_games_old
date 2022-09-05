import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function AmbassadorPanel(props) {
    const socket = useContext(SocketContext);
    let gameObject = props.gameObject;
    let username = props.username;
    let roomcode = gameObject.roomcode;
    const [cards, setCards] = useState([]);
    console.log(cards);

    useEffect(() => {
        socket.on('asdf', () => {
            console.log('asdf');
        }, [socket]);
    });

    const sendExchange = async (e) => {
        e.preventDefault();
        if (cards.length === 2) {
            await socket.emit('select-ambassador-cards', { username, roomcode, cards});
        }
    };

    const selectCard = async (e) => {
        e.preventDefault();
        if (!cards.includes(e.target.value)) {
            cards.push(e.target.value);
        }
        if (cards.length > 2) {
            cards.shift();
        }
        console.log(cards);
    };

    return (
        gameObject.gameStart && gameObject.exchangeInProgress &&
        username === gameObject.currentAction.user &&
        <>
        {
            gameObject.playerStates[username].cards.map((card, idx) => {
                return (<button style={{backgroundColor: "purple"}} className={`${card}-card`} value={idx} onClick={selectCard}>{card}</button>)
            })
        }
        <button onClick={sendExchange}>Remove Cards</button>
        </>
    );
}