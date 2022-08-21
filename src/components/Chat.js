import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from '../contexts/socket';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css';
import { useParams } from 'react-router-dom';


var gameCode;
var username;

export default function () {
    const socket = useContext(SocketContext)

    const { gameID } = useParams();
    gameCode = gameID;
    const [ currMsg, setCurrMsg ] = useState('');
    const [ messageList, setMessageList ] = useState([]);

    const sendMessage = async () => {
        if (currMsg !== "") {
            const messageData = {
                gameCode: gameCode,
                username: username,
                message: currMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }
            await socket.emit('send-message', messageData)
            setMessageList((list) => [...list, messageData]);
            setCurrMsg('');
        }
    }

    useEffect(() => {
        socket.on('receive-message', (data) => {
            console.log(data);
            setMessageList((list) => [...list, data]);
        })
    }, [socket]);

    return (
    <div className="chat-window">
        
        <div className="chat-body">
            <ScrollToBottom className="message-container">
                {
                    messageList.map((messageData) => {
                        return (
                        <div
                            className="message"
                            id={username === messageData.username ? "you" : "other"}
                        >
                            <div>
                               <div className="message-content">
                                   <p>{messageData.message}</p>
                                </div>
                                <div className="message-info">
                                    <p>{messageData.time}</p>
                                    <p>{messageData.username}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input
                type="text"
                value={currMsg}
                placeholder='send a message'
                onChange={(e) => {setCurrMsg(e.target.value)}}
                onKeyDown={(e) => {
                    e.key==="Enter" && sendMessage();
                }}
            />
            <button onClick={sendMessage}>
                Send
            </button>
        </div>
    </div>
  )
}
