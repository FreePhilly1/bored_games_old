const cardRoles = {
    duke: "duke",
    assassin: "assassin",
    ambassador: "ambassador",
    captain: "captain",
    contessa: "contessa"
};

const actionInformation = {
    foreignAid: {
        challenge: false,
        block: ["duke"],
    },
    tax: {
        role: "duke",
        challenge: true,
        block: [],
    },
    assassinate: {
        role: "assassin",
        challenge: true,
        block: ["contessa"]
    },
    exchange: {
        role: "ambassador",
        challenge: true,
        block: [],
    },
    steal: {
        role: "captain",
        challenge: true,
        block: ["captain", "ambassador"],
    }
}

class CoupGame {
    constructor(host, roomcode) {
        this.host = host;
        this.roomcode = roomcode;
        this.gameStart = false;
        this.selectAction = false;
        this.players = [host];
        this.alivePlayers = 0;
        this.turnIdx = 0;
        this.turnPlayer = this.players[this.turnIdx];
        this.deck = [];
        this.playerStates = {}
        this.currentAction = {}
        this.acceptVotes = false;
        this.acceptBlockVotes = false;
        this.voters = [];
        this.blockInProgress = false;
        this.challengeInProgress = false;
        this.exchangeInProgress = false;
        this.assassinateInProgress = false;
        this.blocker = "";
        this.challenger = "";
        this.challengerLost = false;
        this.actionInformation = actionInformation;
    }

    addPlayer(newPlayer) {
        // Add a player
        this.players.push(newPlayer);
    }

    removePlayer(player) {
        // Remove player
        let idx = this.players.indexOf(player);
        if (idx > -1) {
            this.players.splice(idx, 1);
        }
        // Assign new host
        this.host = this.players[0];
    }

    setBoard() {
        // Choose random player to start game
        this.turnIdx = Math.floor(Math.random() * this.players.length);
        this.turnPlayer = this.players[this.turnIdx];

        // Put in three of each card into the deck
        for (let card in cardRoles) {
            for (let i = 0; i < 3; i++){
                this.deck.push(card);
            }
        };

        // Randomize the deck
        this.randomizeCards(this.deck);

        // Deal cards to each player and give them two coins
        for (let i = 0; i < this.players.length; i++) {
            this.playerStates[this.players[i]] = {
                cards: [this.deck.pop(), this.deck.pop()],
                coins: 2
            }
        }
        this.alivePlayers = this.players.length;

        // Set startGame to True
        this.gameStart = true;
        this.selectAction = true;
    }

    randomizeCards(cards) {
        for (let j = 0; j < 5; j++) {
            for (let i = cards.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * i);
                let temp = cards[i];
                cards[i] = cards[j];
                cards[j] = temp;
            }
        }
    }

    // Handle income, foreign aid, tax, steal, coup actions
    handleAction(socketio, psocket) {
        let user = this.currentAction.user;
        let action = this.currentAction.action;
        let playerStates = this.playerStates;
        let target;
        switch(action) {
            case "income":
                if (playerStates[user].coins < 10) {
                    playerStates[user].coins += 1;
                }
                this.handleTurn();
                break;
            case "foreignAid":
                if (playerStates[user].coins < 10) {
                    playerStates[user].coins += 2;
                }
                this.handleTurn();
                break;
            case "tax":
                if (playerStates[user].coins < 10) {
                    playerStates[user].coins += 3;
                }
                this.handleTurn();
                break;
            case "steal":
                if (playerStates[user].coins < 10) {
                    target = this.currentAction.target;
                    let amountStolen = playerStates[target].coins;
                    if (amountStolen > 2) {
                        amountStolen = 2;
                    }
                    playerStates[user].coins += amountStolen;
                    playerStates[target].coins -= amountStolen;
                }
                this.handleTurn();
                break;
            case "assassinate":
                if (playerStates[user].coins >= 3 && playerStates[user].cards.length > 0) {
                    target = this.currentAction.target;
                    playerStates[user].coins -= 3;
                    this.assassinateInProgress = true;
                }
                break;
            case "exchange":
                playerStates[user].cards.push(this.deck.pop());
                playerStates[user].cards.push(this.deck.pop());
                this.exchangeInProgress = true;
                break;
            case "coup":
                if (playerStates[user].coins >= 7) {
                    target = this.currentAction.target;
                    let guess = this.currentAction.guess;
                    let idx = playerStates[target].cards.indexOf(guess);
                    if (idx > -1) {
                        playerStates[target].cards.splice(idx, 1);
                    }
                    playerStates[user].coins -= 7;
                    this.handleTurn();
                }
                break;
            default:
                console.log('Invalid Regular Action');
        }
    }

    finishExchange(username, cards) {
        this.exchangeInProgress = false;
        cards.sort();
        cards = cards.reverse();
        for (let i = 0; i < cards.length; i++) {
            let idx = cards[i];
            let currentCard = this.playerStates[username].cards[idx];
            this.deck.push(currentCard);
            this.playerStates[username].cards.splice(idx, 1);
        }
        this.handleTurn();
    }

    handleVote(voter, response, socketio, psocket) {
        if (this.acceptVotes) {
            switch(response) {
                case "pass":
                    this.voters.push(voter);
                    if (this.voters.length === this.players.length - 1) {
                        this.voters = [];
                        this.acceptVotes = false;
                        this.handleAction(socketio, psocket);
                        socketio.to(this.roomcode).emit('game-state', { gameObject: this });
                    } else {
                        psocket.emit('game-state', { gameObject: this });
                    }
                    break;
                case "block":
                    this.acceptVotes = false;
                    this.acceptBlockVotes = true;
                    this.voters = [];
                    this.blockInProgress = true;
                    this.blocker = voter;
                    socketio.to(this.roomcode).emit('game-state', { gameObject: this });
                    break;
                case "challenge":
                    this.acceptVotes = false;
                    this.voters = [];
                    this.challengeInProgress = true;
                    this.challenger = voter;
                    socketio.to(this.roomcode).emit('game-state', { gameObject: this });
                    break;
                default:
                    console.log('Invalid Vote');
            }
        }
    }

    handleBlockVote(voter, response, socketio, psocket) {
        if (this.acceptBlockVotes) {
            console.log(response);
            switch(response) {
                case "pass":
                    this.voters.push(voter);
                    if (this.voters.length === this.players.length - 1) {
                        console.log('here');
                        this.voters = [];
                        this.blockInProgress = false;
                        this.acceptBlockVotes = false;
                        this.handleTurn();
                        socketio.to(this.roomcode).emit('game-state', { gameObject: this });
                    } else {
                        psocket.emit('game-state', { gameObject: this });
                    }
                    break;
                case "challenge":
                    this.acceptBlockVotes = false;
                    this.voters = [];
                    this.challengeInProgress = true;
                    this.challenger = voter;
                    socketio.to(this.roomcode).emit('game-state', { gameObject: this });
                    break;
                default:
                    console.log('Invalid Vote');
            }
        }
    }

    wrapChallenge(cardIdx) {
        let currentPlayer = this.currentAction.user;
        let move = this.currentAction.action;
        let currentCard = this.playerStates[currentPlayer].cards[cardIdx];
        let correctCard = this.actionInformation[move].role;
        this.deck.push(currentCard);
        this.playerStates[currentPlayer].cards.splice(cardIdx, 1);
        this.challengeInProgress = false;
        if (currentCard === correctCard) {
            this.challengerLost = true;
        } else {
            this.handleTurn();
        }
    }

    wrapBlockChallenge(cardIdx) {
        let currentPlayer = this.blocker;
        let currentCard = this.playerStates[currentPlayer].cards[cardIdx];
        let move = this.currentAction.action;
        let roles = this.actionInformation[move].block;
        this.deck.push(currentCard);
        this.playerStates[currentPlayer].cards.splice(cardIdx, 1);
        this.challengeInProgress = false;
        if (roles.includes(currentCard)) {
            this.challengerLost = true;
        } else {
            this.blockInProgress = false;
            this.handleTurn();
        }
    }

    removeCard(cardIdx, username) {
        this.playerStates[username].cards.splice(cardIdx, 1);
    }

    // Set turn to next player with cards
    handleTurn() {
        let idx = this.turnIdx;
        let playerStates = this.playerStates;
        let players = this.players;
        idx = (idx + 1) % players.length;
        while (playerStates[players[idx]].cards.length === 0) {
            idx = (idx + 1) % players.length;
        }
        this.turnIdx = idx;
        this.selectAction = true;
    }
}

module.exports = CoupGame;