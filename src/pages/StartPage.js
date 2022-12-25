import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from 'react';
import { SocketContext } from '../contexts/socket.js';
import { CSSTransition } from 'react-transition-group';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './StartPage.css';
import '../styles.css';

export default function StartPage(props) {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const usernameRef = useRef();
    const roomcodeRef = useRef();
    const [creatingGame, setCreatingGame] = useState(false);
    const [joiningGame, setJoiningGame] = useState(false);

    useEffect(() => {
        socket.on('game-state', ({ gameObject }) => {
            navigate(`/room/${gameObject.roomcode}`, { state: { gameObject, username: usernameRef.current.value } });
        });

        socket.on('duplicate-username', () => {
            alert('Username already exists, Choose Another');
        });
        
        socket.on('invalid-roomcode', () => {
            alert('Invalid Roomcode, Try again');
        });

        socket.on('full-gameroom', () => {
            alert('Room full, Try another room');
        });

        socket.on('game-inprogress', () => {
            alert('Game in Progress, Try another room');
        });
    }, [socket, navigate]);

    

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        socket.emit('join-room', {username: usernameRef.current.value, roomcode: roomcodeRef.current.value});
    }

    const handleRoomCreate = (e) => {
        e.preventDefault();
        socket.emit('create-room', { username: usernameRef.current.value });
    }

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
                    <label className='form-label' for='username-field-create'>
                        Username:
                    </label>
                    <input
                        id='username-field-create'
                        className='form-text-input'
                        type="text"
                        required
                        placeholder='Username'
                        ref={usernameRef}
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
                                <label className='form-label' for='username-field'>
                                    Username:
                                </label>
                                <input
                                    id='username-field'
                                    className='form-text-input'
                                    type="text"
                                    required
                                    placeholder='Username'
                                    ref={usernameRef}
                                />
                            </div>
                            <div style={{display:'inline-block'}}>
                                <label className='form-label' for='roomcode-field'>
                                    Room Code:
                                </label>
                                <input
                                    id='roomcode-field'
                                    className='form-text-input'
                                    type="text"
                                    required
                                    placeholder='Room Code'
                                    ref={roomcodeRef}
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
