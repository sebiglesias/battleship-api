var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;


io.on('connection', function(socket){
    socket.on('message', function(msg){
        console.log(msg);
        // io.emit('chat message', msg);
    });


});

http.listen(port, function(){
    console.log('listening on *:' + port);
});