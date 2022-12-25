import React from 'react';
import "./RoomInfo.css";

export default function RoomInfo(props) {
    let roomcode = props.roomcode;
    let host = props.host;

    const copyRoom = () => {
        navigator.clipboard.writeText(roomcode);
    }

    return (
        <div className='room-info-container'>
            <div className='roomcode-info'>
                <h2>Room Code: {roomcode}&ensp;</h2>
                <button className='roomcode-copy-button' onClick={copyRoom}>&#xf0c5;</button>
            </div>
            <div>
                <h2>Host: {host}</h2>
            </div>
        </div>
    )
}