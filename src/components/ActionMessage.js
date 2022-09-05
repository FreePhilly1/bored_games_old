import React from 'react';

export default function ActionMessage(props) {
    let gameObject = props.gameObject;
    let currentAction = gameObject.currentAction;
    let message;
    switch (currentAction.action) {
        case "income":
        case "foreignAid":
        case "tax":
        case "exchange":
            message = `${currentAction.user} does ${currentAction.action}`;
            break;
        case "assassinate":
        case "steal":
        case "coup":
            message = `${currentAction.user} does ${currentAction.action} on ${currentAction.target}`;
            break;
        default:
            message = "";
    }
    return (
        gameObject.gameStart && 
        <div>{message}</div>
    )
}