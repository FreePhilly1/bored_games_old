import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';
const axios = require('axios');

export default function StartMenu() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomcode, setRoomcode] = useState('');
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        socket.on('room-created', (data) => {
            navigate('/game/:gameid', { state: {roomcode: data}});
        })
    }, []);

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        if (roomcode !== "") {
            let joinData = {username, roomcode};
            socket.emit('join-room', joinData);
        }
    }

    const handleRoomCreate = (e) => {
        e.preventDefault();
        if (username !== "") {
            socket.emit('create-room', { username });
            navigate('/game/:gameid');
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
            <input type="submit" value="Create Room"/>
        </form>
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
        {gameData &&
            <div>{JSON.stringify(gameData)}</div>
        }
    </div>
  )
}
