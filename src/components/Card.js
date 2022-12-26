import React from 'react';
import { useState } from 'react';
import "./StartButton.css";

//SVGs
import AmbassadorSVG from '../svgs/ambassador.svg';
import AssassinSVG from '../svgs/assassin.svg';
import CaptainSVG from '../svgs/captain.svg';
import ContessaSVG from '../svgs/contessa.svg';
import DukeSVG from '../svgs/duke.svg';
import BackSVG from '../svgs/back.svg';

export default function Card(props) {
    const [front, setFront] = useState(false);
    const idx = props.idx;
    const card = props.card;
    let cardType = BackSVG;
    switch(card) {
        case 'captain':
            cardType = CaptainSVG;
            break;
        case 'contessa':
            cardType = ContessaSVG;
            break;
        case 'assassin':
            cardType = AssassinSVG;
            break;
        case 'ambassador':
            cardType = AmbassadorSVG;
            break;
        case 'duke':
            cardType = DukeSVG;
            break;
        default:
            console.log('Your app is broken');
    }

    const flipCard = (e) => {
        e.preventDefault();
        setFront(!front);
    }

    return (
        <>
            {front
                ? <img className={`other-card-${idx + 1}`} src={cardType} alt='BACK' height='200px' onClick={flipCard}/>
                : <img className={`other-card-${idx + 1}`} src={BackSVG} alt='BACK' height='200px' onClick={flipCard}/>
            }
        </>
    )
}