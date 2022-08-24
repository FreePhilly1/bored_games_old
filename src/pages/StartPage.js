import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';

export default function StartMenu(props) {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomcode, setRoomcode] = useState('');

    useEffect(() => {
        socket.on('game-state', (data) => {
            navigate('/game/room', { state: {roomData: data, username } });
        })
    }, [socket, navigate, username]);

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        if (roomcode !== "" && username !== "") {
            let joinData = {username, roomcode};
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
    </div>
  )
}
