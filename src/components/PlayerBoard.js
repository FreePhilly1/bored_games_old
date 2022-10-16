import React from 'react';
import { useState, useEffect, useContext } from 'react';

function PlayerBoard(props) {
    const gameObject = props.gameObject;
    
    return (
        <div className='table'>
          <div className='other-1'>
            <h2 className='name-tag'>PHILLIP</h2>
            <img className='other-card-1' src={BackSVG} alt='BACK' height='150px'></img>
            <img className='other-card-2' src={BackSVG} alt='BACK' height='150px'></img>
          </div>
          <div className='other-2'>
            <h2 className='name-tag'>BRYAN</h2>  
            <img className='other-card-1' src={BackSVG} alt='BACK' height='150px'></img>
            <img className='other-card-2' src={BackSVG} alt='BACK' height='150px'></img>
          </div>
          <div className='other-3'>
            
            <img className='placeholder' src={PlaceHolder} alt='PLACEHOLDER' height='150px'></img>
          </div>
          <div className='other-4'>
            
            <img className='placeholder' src={PlaceHolder} alt='PLACEHOLDER' height='150px'></img>
          </div>
          <div className='other-5'>
            
            <img className='placeholder' src={PlaceHolder} alt='PLACEHOLDER' height='150px'></img>
          </div>
        </div>
    );
}

export default PlayerBoard;