import React from 'react';
import Chat from '../components/Chat.js';
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';
import { Link } from "react-router-dom";
const axios = require('axios');

export default function StartMenu() {
    const socket = useContext(SocketContext);
    const [username, setUsername] = useState('');
    const [roomcode, setRoomcode] = useState('');
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        socket.on('room-created', (data) => {
            console.log(data);

        })
        socket.on('room-code', (data) => {
            console.log(data);
        })
        socket.on('game-state', (data) => {
            setGameData(data);
        })
    }, []);

    const handleRoomSubmit = (e) => {
        e.preventDefault();

        if (roomcode !== "") {
            let joinData = {username, roomcode};
            console.log(joinData);
            socket.emit('join-room', joinData);
        }
    }

    const handleRoomCreate = (e) => {
        e.preventDefault();

        if (username !== "") {
            socket.emit('create-room', { username });
        }
    }



    return (
    <div className='HomeMenu'>
        <h1>COUP</h1>
        <form onSubmit={handleRoomCreate}>
            <label>
                Username:
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <p>{username}</p>
        </form>
        <button onClick={handleRoomCreate}>Create Room</button>
        <form onSubmit={handleRoomSubmit}>
            <label>
                Room:
                <input
                    type="text"
                    required
                    value={roomcode}
                    onChange={(e) => setRoomcode(e.target.value)}
                />
            </label>
            <input type="submit" value="Join Room"/>
        </form>
        <Link to="/game/:gameid">Chat</Link>
        {gameData &&
            <div>{JSON.stringify(gameData)}</div>
        }
    </div>
  )
}
