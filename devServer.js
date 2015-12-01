var path    = require('path');
var express = require('express');
var webpack = require('webpack');
var config  = require('./webpack.config.dev');

var app      = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* CUSTOM SETTINGS --- */
var flipCoin = function(){ return Math.round(Math.random()) > 0; };

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var newBoard = function(){
  var board = [];
  for (var i=0;i<9;i++) {
    board.push({xo:false});
  }
  return board;
};
var board = newBoard();
var current = 'x';

var players = {};
var setPlayer = function(name, type, socket) {
  players[socket.id] = {
    room: name,
    type: type
  };
  console.log('Socket ' + socket.id + ' has connected.');
};

var rooms = {};
var setRoom = function(name, socket){
  name = name || 'default';
  if (typeof rooms[name] == 'undefined') rooms[name] = {};
  rooms[name].x = rooms[name].x || false;
  rooms[name].o = rooms[name].o || false;
  rooms[name].spectators = rooms[name].spectators || [];
  if (!rooms[name].x && !rooms[name].o) {
    if (flipCoin) {
      rooms[name].x = socket.id;
      setPlayer(name, 'x', socket);
      rooms[name].next = 'x';
    }
    else {
      rooms[name].o = socket.id;
      setPlayer(name, 'o', socket);
      rooms[name].next = 'o';
    }
  } else if (!rooms[name].x) {
    rooms[name].x = socket.id;
    setPlayer(name, 'x', socket);
  } else if (!rooms[name].o) {
    rooms[name].o = socket.id;
    setPlayer(name, 'o', socket);
  } else {
    rooms[name].spectators.push(socket.id);
    setPlayer('spectator', socket);
  }
};



io.on('connection', function (socket) {
  socket.on('xo', function(data){
		var player = players[socket.id];
    var room = rooms[player.room];

    console.log( socket.id + ' has clicked');

    if (room.next == player.type) {
      console.log('Click accepted');
      board[ data.key ].xo = current;
      room.next = room.next == 'x' ? 'o' : 'x';
      current = room.next;
      io.emit('board', board);
    } else {
      console.log('Click denied');
    }

	});
  socket.on('reset', function(){
    board = newBoard();
    io.emit('board', board);
  });
  socket.emit('board', board);
  socket.emit('player', players[socket.id]);
  setRoom(false, socket);
});

server.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:3000');
});