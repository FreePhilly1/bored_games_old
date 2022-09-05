import React from 'react';

export default function PlayerCards(props) {
    let gameObject = props.gameObject;
    let playerStates = gameObject.playerStates;
    return (
        <>
            {
                Object.keys(playerStates).length > 0 && 
                Object.keys(playerStates).map((key) => {
                    return (
                        <div style={{ width: '200px', height: '100px', margin: '20px', borderRadius: '20px', backgroundColor: "yellow"}}>
                            <p>{key}</p>
                            <p>Cards: {playerStates[key].cards.toString()}</p>
                            <p>Coins: {playerStates[key].coins}</p>
                        </div>
                    )
                })
            }
        </>
    )
}