import React from 'react';
import Chat from '../components/Chat.js';
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';
const axios = require('axios');

export default function StartMenu() {
    const socket = useContext(SocketContext);
    const [username, setUsername] = useState('');
    const [gameData, setGameData] = useState('');

    useEffect(() => {
        socket.on('room-created', (data) => {
            console.log(data);
            
        })
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username !== "") {
            socket.emit('initialize-game', username);
            const testData =  { 'players': [ "bob", "sally", "trey" ] };
            socket.emit('create-room');
            // axios.put('/game/start-game', testData)
            // .then(function (response) {
            //     console.log(response);
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });

            // fetch('/game/start-game', {
            //     method: 'PUT',
            //     mode: 'cors',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(testData)
            // });
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
            <input type="submit" value="enter"/>
            <p>{username}</p>
        </form>
    </div>
  )
}
