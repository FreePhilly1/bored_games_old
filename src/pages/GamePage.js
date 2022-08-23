import React from 'react'
import Chat from '../components/Chat.js';
import { useLocation } from 'react-router-dom';

function GamePage() {
  const {state} = useLocation();
  console.log(state);
    
  return (
    <>
      <div>GamePage</div>
      <Chat/>
    </>
  )
}

export default GamePage