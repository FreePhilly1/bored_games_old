import React from 'react'
import { useEffect, useState } from 'react'

export default function HomeMenu() {
    const [code, setCode] = useState('');
    const [gameData, setGameData] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const game = { code };
        console.log(game);

        (async () => {
            const res = await fetch("/ping");
            const json = await res.text();
            setGameData(gameData)
            console.log(json);
        })();          

        // fetch("/ping").then(
        //     response => response.text()
        // ).then(
        //     data => {setGameData(data)}
        // )
        // tick(1000)
        // console.log(gameData)

        // useEffect(() => {
        //     //replace ping request with request to start a new game
        //     fetch("/ping").then(
        //         response => response.json()
        //     ).then(
        //         data => setGameData(data)
        //     )
        //     console.log(gameData)
        // }, []);
    }

    return (
    <div className='HomeMenu'>
        <h1>COUP</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Room Code:
                <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </label>
            <input type="submit" value="enter"/>
            <p>{code}</p>
        </form>
    </div>
  )
}
