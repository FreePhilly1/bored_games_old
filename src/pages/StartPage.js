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
    <div className='HomeMenu' style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#2d3038"}}>
        <h1 style={{color: "white"}}>COUP</h1>
        <form style={{margin: 20}} onSubmit={handleRoomCreate}>
            <label style={{color: "white"}}>
                Username:
                <input
                    style= {{borderRadius: '5px', height: '50px'}}
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <input
                style={{borderRadius: '10px', backgroundColor: 'green', height: '50px', marginLeft: 20}}
                type="submit"
                value="Create Room"
            />
        </form>
        <form onSubmit={handleRoomSubmit}>
            <label style={{color: "white"}}>
                Room:
                <input style={{borderRadius: '5px', height: 50}}
                    type="text"
                    required
                    value={roomcode}
                    onChange={(e) => setRoomcode(e.target.value)}
                />
            </label>
            <input
                style={{borderRadius: '10px', backgroundColor: 'orange', height: 50, marginLeft: 20}}
                type="submit"
                value="Join Room"
            />
        </form>
    </div>
  )
}
