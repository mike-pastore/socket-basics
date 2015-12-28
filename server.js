var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

// object to store & share client info between server-side functions
var clientInfo = {};

// sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	} 

	// iterate through all info, find users with matching room id
	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: ' *_* ',
		text: 'Current Users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function () {
		if (typeof clientInfo[socket.id] !== 'undefined') {
			var userData = clientInfo[socket.id];

			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: ' *_* ',
				text: userData.name + ' has left the room.',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: ' *_* ',
			text: req.name + ' has joined the room!',
			timestamp: moment().valueOf()
		});

		console.log('USER [' + req.name + '] connected to ROOM \'' + req.room + '\'');
	});

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);

		if (message.text === '/users') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}		
	});

	socket.emit('message', {
		name: ' *_* ',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});