
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const dao = require('./dao.js');

const players = [];


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('login', function (msg) {
        dao.getUser(msg, function (err, res) {
            if(err){
                console.log('crear usuario');
            }else {
                console.log('El usuario existe');
                socket.emit('user', res);
            }
        });
    });


    socket.on('play', function (playerId) {
        if(players.length === 0 ) {
            players.push(playerId)
        } else {
            // new game
        }
    })
});


http.listen(port, function () {
    console.log('listening on *:' + port);
});