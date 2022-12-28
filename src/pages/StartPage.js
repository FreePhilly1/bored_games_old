import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './StartPage.css';
import '../styles.css';

export default function StartPage(props) {
    const navigate = useNavigate();
    const usernameRef = useRef();
    const roomcodeRef = useRef();
    const [creatingGame, setCreatingGame] = useState(false);
    const [joiningGame, setJoiningGame] = useState(false);    

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        // socket.emit('create-room', { username: usernameRef.current.value });
        let username = usernameRef.current.value;
        let url = `http://localhost:5000/create-room-request?host=${username}`;
        let response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let responseData = await response.json();
        let gameObject = responseData.gameObject;
        if (responseData.status) {
            navigate(`/room/${gameObject.roomcode}`, { state: { gameObject, username }});
        } else {
            alert('Unable to Create Room. Try again.');
        }
    }

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        let roomcode = roomcodeRef.current.value;
        let username = usernameRef.current.value;
        let url = `http://localhost:5000/join-room-request?roomcode=${roomcode}&username=${username}`;
        let response = await fetch(url, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let responseData = await response.json();
        let gameObject = responseData.gameObject;
        switch(responseData.status) {
            case 'success':
                navigate(`/room/${gameObject.roomcode}`, { state: { gameObject, username }});
                break;
            case 'invalid':
                alert('Invalid Room Code');
                break;
            case 'duplicate':
                alert('Duplicate Username. Choose another one.');
                break;
            case 'full':
                alert('Room Full. Try another.');
                break;
            case 'inprogress':
                alert('Game In Progress. Try again later');
                break;
            default:
                alert('Something is broken');
        }

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
                    <form className='text-form' onSubmit={handleCreateRoom}>
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
                    <form className='text-form' onSubmit={handleJoinRoom}>
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
