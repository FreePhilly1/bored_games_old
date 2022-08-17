import React from 'react'
import Chat from './Chat.js'
import { useEffect, useState, useContext } from 'react'
import { SocketContext } from '../context/socket.js';

export default function HomeMenu() {
    const socket = useContext(SocketContext);
    const [gameCode, setGameCode] = useState('');
    const [username, setUsername] = useState('');
    const [gameData, setGameData] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const game = { gameCode };
        console.log(game);

        if (gameCode !== "") {
            socket.emit('join-room', gameCode);
        }

        // (async () => {
        //     const res = await fetch("/ping");
        //     const json = await res.text();
        //     setGameData(gameData)
        //     console.log(json);
        // })();          
    }

    return (
    <div className='HomeMenu'>
        <h1>COUP</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                Room Code:
                <input
                    type="text"
                    required
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                />
            </label>
            <input type="submit" value="enter"/>
            <p>{gameCode}</p>
        </form>
        <Chat gameCode={gameCode} username={username}></Chat>
    </div>
  )
}
