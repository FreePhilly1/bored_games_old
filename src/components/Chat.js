import React, { useEffect } from 'react';
import { useState, useContext, useRef } from 'react';
import { SocketContext } from '../contexts/socket';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css';


var gameCode;

export default function Chat(props) {
    const socket = useContext(SocketContext);
    const { roomcode, username } = props;
    
    const messageRef = useRef();
    const [ messageList, setMessageList ] = useState([]);

    const sendMessage = async () => {
        if (messageRef.current.value !== "") {
            const messageData = {
                gameCode: gameCode,
                username: username,
                message: messageRef.current.value,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                roomcode: roomcode
            }
            await socket.emit('send-message', messageData)
            setMessageList((list) => [...list, messageData]);
            messageRef.current.value = "";
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('receive-message', (data) => {
                console.log(data);
                setMessageList((list) => [...list, data]);
            });
        }
        
    }, []);

    return (
    <div className="chat-window">
        
        <div className="chat-body">
            <ScrollToBottom className="message-container">
                {
                    messageList.map((messageData) => {
                        return (
                        <div
                            className="message"
                        >
                            <div className="message-info">
                                <p>{messageData.username} | {messageData.time}</p>
                            </div>
                            <div
                                className="message-content"
                                id={username === messageData.username ? "you" : "other"}
                            >
                                <p>{messageData.message}</p>
                            </div>
                        </div>
                    );
                })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input
                className='message-input'
                type="text"
                placeholder='send a message'
                ref={messageRef}
                onKeyDown={(e) => {
                    e.key==="Enter" && sendMessage();
                }}
            />
            <button
                className='chat-send'
                onClick={sendMessage}
            >
                Send
            </button>
        </div>
    </div>
  )
}
