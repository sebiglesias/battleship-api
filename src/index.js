const Game = require('./game.js');
const Board = require('./board.js');
const Move = require('./move.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dao = require('./dao/userDao.js');

const port = 3000;
const users = [];
var players = [];
const games = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('user connected: ' + socket.id);

    socket.on('login', function (facebookId) {
        console.log(facebookId);
        dao.getUser(facebookId, function (res) {
            if (isEmpty(res)) {
                dao.newUser(facebookId, function (newUser) {
                    console.log(newUser);
                    users.push({
                        socketId: socket.id,
                        userId: newUser.id,
                        facebookId: facebookId
                    });
                    console.log('length login2: ' + users.length);
                    io.to(socket.id).emit('user', newUser);
                });
            } else {
                users.push({
                    socketId: socket.id,
                    userId: res.Item.id,
                    facebookId: facebookId
                });
                io.to(socket.id).emit('user', res.Item);
            }
        });
    });


    socket.on('play', function (user) {
        console.log(user);
        if (players.length === 0) {
            console.log('First Player');
            players.push({
                socketId: socket.id,
                userId: user.playerId,
                facebookId: user.facebookId
            });
            io.to(socket.id).emit('game', 'Waiting for another player');
        } else {
            console.log('Other Player');
            let playerA = players.pop();
            let playerB = {
                socketId: socket.id,
                userId: user.playerId,
                facebookId: user.facebookId
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
            games.push(game);
        } else {
            games.push(game);
            io.to(game.playerA.socketId).emit('moveRes', new Move(game.playerA.userId, game.playerAboard, game.boardAopponent, undefined));
            io.to(game.playerB.socketId).emit('moveRes', new Move(game.playerA.userId, game.playerBboard, game.boardBopponent, undefined));
        }
    });


    socket.on('move', function (move) {
        console.log('move');
        const game = getGame(move.gameId);
        game.shot(move.row, move.column, move.userID);



        let nextPlayer = undefined;
        if(move.userID === game.playerA.userId){
            nextPlayer = game.playerB.userId;
        }else{
            nextPlayer = game.playerA.userId;
        }

        const winner = game.winner();

        games.push(game);
        io.to(game.playerA.socketId).emit('moveRes', new Move(nextPlayer, game.playerAboard, game.boardAopponent, winner));
        io.to(game.playerB.socketId).emit('moveRes', new Move(nextPlayer, game.playerBboard, game.boardBopponent, winner));
    });


    socket.on('abandon', function (player) {
       console.log(player);
    });

    socket.on('logout', function (player) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === player.playerId) {
                console.log('logout');
                users.splice(i, 1);
            }
        }
        console.log('length logout: ' + users.length);
    });

    socket.on('disconnect', function (socket) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users.splice(i, 1);
            }
        }
    });



    socket.on('reconnect', function (player) {
        console.log('Reconectando....');
        // for(let i = 0; i < games.length; i++){
        //     if(games[i].gameId === player.gameId){
        //         if(games[i].playerA.userId === player.userID){
        //             games[i].playerA.socketId = socket.id;
        //             io.to(socket.id).emit('reconnectRec', new Move(games[i].playerA.userId, games[i].playerAboard, games[i].boardAopponent));
        //         } else {
        //             games[i].playerB.socketId = socket.id;
        //             io.to(socket.id).emit('reconnectRec', new Move(games[i].playerB.userId, games[i].playerBboard, games[i].boardBopponent));
        //         }
        //     }
        // }
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


