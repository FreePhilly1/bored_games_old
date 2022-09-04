import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../contexts/socket.js';
import './StartPage.css';
import '../styles.css';
import { CSSTransition } from 'react-transition-group';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function StartPage(props) {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomcode, setRoomcode] = useState('');
    const [creatingGame, setCreatingGame] = useState(false);
    const [joiningGame, setJoiningGame] = useState(false);

    useEffect(() => {
        socket.on('game-state', ({ gameObject }) => {
            navigate('/game/room', { state: { gameObject, username } });
        }, [socket, navigate, username]);

        socket.on('duplicate-username', () => {
            console.log('Username already exists, Choose Another');
        }, [socket]);
        
        socket.on('invalid-roomcode', () => {
            console.log('Invalid Roomcode, Try again');
        }, [socket]);

        socket.on('full-gameroom', () => {
            console.log('Room full, Try another room');
        }, [socket]);
    });

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        if (roomcode !== "" && username !== "") {
            socket.emit('join-room', {username, roomcode});
        }
    }

    const handleRoomCreate = (e) => {
        e.preventDefault();
        if (username !== "") {
            socket.emit('create-room', { username });
        }
    }

    let menuNavigationButton;
    const menuBack = () => {
        setCreatingGame(false);
        setJoiningGame(false);
    }

    return (
    <div className='background'>
        <div className='menu'>
            {/* {menuNavigationButton} */}
            <h1 className='title'>COUP</h1>
            <div className='menu-body'>
                <CSSTransition
                    in={!joiningGame && !creatingGame}
                    unmountOnExit
                    timeout={800}
                    classNames='select-menu'
                >
                    <div className='form-div'>
                        <button className='form-button' onClick={() => setCreatingGame(true)}>
                            Create Game
                        </button>
                        <button className='form-button' onClick={() => setJoiningGame(true)}>
                            Join Game
                        </button>
                    </div>
                </CSSTransition>

                <CSSTransition
                    in={creatingGame}
                    unmountOnExit
                    timeout={800}
                    classNames='create-menu'
                >
                    <form className='text-form' onSubmit={handleRoomCreate}>
                    <label className='form-label'>
                        Username:
                    </label>
                    <input
                            className='form-text-input'
                            type="text"
                            required
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    <input
                        className='form-button submit-button'
                        type="submit"
                        value="Create Room"
                    />
                    <ArrowBackIosIcon className='back-button' onClick={menuBack}/>
                </form>  
                    
                </CSSTransition>

                <CSSTransition
                    in={joiningGame}
                    unmountOnExit
                    timeout={800}
                    classNames='join-menu'
                >
                    <form className='text-form' onSubmit={handleRoomSubmit}>
                        <div>
                            <div style={{display:'inline-block'}}>
                                <label className='form-label'>
                                    Username:
                                </label>
                                <input
                                    className='form-text-input'
                                    type="text"
                                    required
                                    placeholder='Username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div style={{display:'inline-block'}}>
                                <label className='form-label'>
                                    Room Code:
                                </label>
                                <input 
                                    className='form-text-input'
                                    type="text"
                                    required
                                    placeholder='Room Code'
                                    value={roomcode}
                                    onChange={(e) => setRoomcode(e.target.value)}
                                />
                            </div>
                        </div>
                        <input
                            className='form-button submit-button'
                            type="submit"
                            value="Join Room"
                        />
                        <ArrowBackIosIcon className='back-button' onClick={menuBack}/>
                    </form>
                </CSSTransition>
            </div>
        </div>
    </div>
  )
}
