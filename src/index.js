const Game = require('./game.js');
const Board = require('./board.js');
const Move = require('./move.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dao = require('./dao/userDao.js');

const port = 3000;
const users = [];
const players = [];
const games = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('user connected: ' + socket.id);

    socket.on('login', function (msg) {
        console.log(msg);
        dao.getUser(msg, function (res) {
            if (isEmpty(res)) {
                dao.newUser(msg, function (newUser) {
                    users.push({
                        socketId: socket.id,
                        userId: newUser.id
                    });
                    io.to(socket.id).emit('user', res.Item);
                });
            } else {
                users.push({
                    socketId: socket.id,
                    userId: res.Item.id
                });
                io.to(socket.id).emit('user', res.Item);
            }
        });
    });


    socket.on('play', function (playerId) {
        if (players.length === 0) {
            console.log('First Player');
            players.push({
                socketId: socket.id,
                userId: playerId
            });
            io.to(socket.id).emit('game', 'Waiting for another player');
        } else {
            console.log('Other Player');
            let playerA = players.pop();
            let playerB = {
                socketId: socket.id,
                userId: playerId
            };
            let game = new Game(playerA, playerB);
            games.push(game);
            io.to(socket.id).emit('newGame', game);
            io.to(playerA.socketId).emit('newGame', game);
        }
    });


    socket.on('cancelPlay', function () {
        for (let i = 0; i < players.length; i++) {
            if (players[i].socketId === socket.id) {
                players.splice(i, 1);
                io.to(socket.id).emit('canceledGame', 'Canceled game.');
            }
        }
    });

    socket.on('startGame', function (boards) {
        console.log('llegue startgame');
        const game = getGame(boards.gameId);
        setInitialConfiguration(game, boards);
        if(game.playerAboard === undefined || game.playerBboard === undefined){
            console.log('player1');
            console.log(game);
            games.push(game);
        } else {
            games.push(game);
            console.log('player2');
            console.log(game);
            io.to(game.playerA.socketId).emit('moveRes', new Move(game.playerA.userId, game.playerAboard, game.boardAopponent));
            io.to(game.playerB.socketId).emit('moveRes', new Move(game.playerB.userId, game.playerBboard, game.boardBopponent));
        }
    });


    socket.on('move', function (move) {

    });


    // socket.emit('moveRes')

    socket.on('disconnect', function (socket) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users.splice(i, 1);
            }
        }
    });

    socket.on('reconnect', function (gameId) {

    });
});


http.listen(port, function () {
    console.log('listening on *:' + port);
});


function isEmpty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function getGame(gameId) {
    for (let i = 0; i < games.length; i++) {
        if(games[i].gameId === gameId){
            return games.splice(i,1).pop();
        }
    }
}

function setInitialConfiguration(game, board) {
    const newBoard = new Board(board.playerId, board.boardCells, board.totalShipCells, board.shipList);

    if(game.playerA.userId === board.playerId){
        game.playerAboard = newBoard
    } else { game.playerBboard = newBoard}
}

function updateSocketId(game, userId, socketId){
    if(game.playerA.userId === userId){
        game.playerA.socketId = socketId
    } else {game.playerB.socketId = socketId}
}