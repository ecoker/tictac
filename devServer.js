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
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
	console.log('connected');
	socket.on('xo', function(data){
		console.log(data);
	});
	socket.emit('xo', { square: 1, xo: 'x' });
});

server.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
