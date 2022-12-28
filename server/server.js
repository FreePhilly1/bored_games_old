const app = require('express')();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
const http = require('http').Server(app);
const crypto = require('crypto');
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const port = process.env.PORT || 5000;
const CoupGame = require('./CoupGame.js');
const socketMap = {};

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('create-room', ({ username }) => {
        try {
            // Generate Random Room Code
            let roomcode = crypto.randomBytes(3).toString('hex');

            // Regenerate Room Code if it already exists
            while (io.sockets.adapter.rooms.get(roomcode)) {
                roomcode = crypto.randomBytes(3).toString('hex')
            } 
            socket.join(roomcode);
            let roomState = io.sockets.adapter.rooms.get(roomcode);

            // Create CoupGame instance
            roomState.gameObject = new CoupGame(username, roomcode);
            let gameObject = roomState.gameObject;
            socketMap[socket.id] = [username, roomcode];

            // Emit Game State
            socket.emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    })

    socket.on('join-room', ({ username, roomcode }) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            if (roomState) {
                let gameObject = roomState.gameObject;
                if (gameObject.players.includes(username)) {
                    // Duplicate Username in Lobby
                    socket.emit('duplicate-username');
                } else if (gameObject.players.length >= 6) {
                    // Gameroom Full
                    socket.emit('full-gameroom');
                } else if (gameObject.gameStart) {
                    // Game started
                    socket.emit('game-inprogress');
                } else {
                    // Join Room
                    socket.join(roomcode);
                    gameObject.addPlayer(username);
                    socketMap[socket.id] = [username, roomcode];
                    io.to(roomcode).emit('game-state', { gameObject });
                }
            } else {
                // Wrong Roomcode
                socket.emit('invalid-roomcode');
            }
        } catch (err) {
            console.log(err);
        }
    });
    
    // Start Game
    socket.on('start-game', ({ roomcode }) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.setBoard();
            io.to(roomcode).emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('send-message', (data) => {
        try {
            socket.broadcast.to(data.roomcode).emit('receive-message', data);
        } catch (err) {
            console.log(err);
        }
    })

    socket.on('regular-action', ({actionData, roomcode}) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.currentAction = actionData;
            gameObject.handleAction();
            io.to(roomcode).emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('special-action', ({actionData, roomcode}) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.currentAction = actionData;
            gameObject.acceptVotes = true;
            gameObject.selectAction = false;
            io.to(roomcode).emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('send-vote', ({voter, roomcode, response}) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.handleVote(voter, response, io, socket);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('send-card-challenge', ({roomcode, cardIdx}) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.wrapChallenge(cardIdx);
            io.to(roomcode).emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('select-card-challenge', ({roomcode, cardIdx, username, block}) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.challengerLost = false;
            let card = gameObject.playerStates[username].cards[cardIdx];
            gameObject.deck.push(card);
            gameObject.removeCard(cardIdx, username);
            gameObject.randomizeCards(gameObject.deck);
            let newCard = gameObject.deck.pop();
            console.log(block);
            if (block) {
                gameObject.blockInProgress = false;
                gameObject.playerStates[gameObject.blocker].cards.push(newCard);
                gameObject.handleTurn();
            } else {
                gameObject.playerStates[gameObject.currentAction.user].cards.push(newCard);
                gameObject.handleAction();
            }
            io.to(roomcode).emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('send-block-vote', ({ voter, roomcode, response }) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.handleBlockVote(voter, response, io, socket);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('send-card-block-challenge', ({roomcode, cardIdx}) => {
        try {
            let roomState = io.sockets.adapter.rooms.get(roomcode);
            let gameObject = roomState.gameObject;
            gameObject.wrapBlockChallenge(cardIdx);
            io.to(roomcode).emit('game-state', { gameObject });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('select-assassin-card', ({ roomcode, cardIdx, username }) => {
        let roomState = io.sockets.adapter.rooms.get(roomcode);
        let gameObject = roomState.gameObject;
        gameObject.assassinateInProgress = false;
        let card = gameObject.playerStates[username].cards[cardIdx];
        gameObject.removeCard(cardIdx, username);
        gameObject.deck.push(card);
        gameObject.handleTurn();
        io.to(roomcode).emit('game-state', { gameObject });
    });

    socket.on('select-ambassador-cards', ({ username, roomcode, cards}) => {
        let roomState = io.sockets.adapter.rooms.get(roomcode);
        let gameObject = roomState.gameObject;
        gameObject.finishExchange(username, cards);
        io.to(roomcode).emit('game-state', { gameObject });
    })

    socket.on('disconnect', () => {
        try {
            console.log(`user disconnected: ${socket.id}`);
            // Stop game if user is in an active room
            if (socketMap[socket.id]) {
                // Extract Room Data
                let socketData = socketMap[socket.id];
                let username = socketData[0];
                let roomcode = socketData[1];
                let roomState = io.sockets.adapter.rooms.get(roomcode);
                delete socketMap[socket.id];
                // If game still exists
                if (roomState) {
                    let gameObject = roomState.gameObject;
                    // Remove player from room
                    gameObject.removePlayer(username);
                    // Check if players are still playing
                    if (gameObject.gameStart) {
                        // Restart game if game is in progress
                        io.to(roomcode).emit('restart-game');
                    } else {
                        // Keep room if game has not started
                        io.to(roomcode).emit('game-state', { gameObject });
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }
    });
});

http.listen(port, () => {
    console.log(`listening on port ${port}`);
});