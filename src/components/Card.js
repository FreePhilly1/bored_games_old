import React from 'react';
import { useState, useEffect, useContext } from 'react';

import AmbassadorSVG from '../svgs/ambassador.svg';
import AssassinSVG from '../svgs/assassin.svg';
import CaptainSVG from '../svgs/captain.svg';
import ContessaSVG from '../svgs/contessa.svg';
import DukeSVG from '../svgs/duke.svg';


function Card(props) {
    const role = props.role;
    const renderSwitch = (param) => {
        switch(param) {
            case "assassin":
                return (<img src={AssassinSVG} alt='ASSASSIN' height='340px'></img>);
            case "ambassador":
                return (<img src={AmbassadorSVG} alt='AMBASSADOR' height='340px'></img>);
            case "captain":
                return (<img src={CaptainSVG} alt='CAPTAIN' height='340px'></img>);
            case "contessa":
                return (<img src={ContessaSVG} alt='CONTESSA' height='340px'></img>);
            case "duke":
                return (<img src={DukeSVG} alt='DUKE' height='340px'></img>);
            default:
                return (<></>);
        }
    }

    return (
        <>{renderSwitch(role)}</>
    );
}

export default Card;