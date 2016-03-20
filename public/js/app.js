var socket = io();
var room = getQueryVariable('room') || 'General Chat';
var name = getQueryVariable('name') || 'Anonymous';

// update h1 room title
$('.room-title').prepend(room);

socket.on('connect', function () {
	console.log('Connected to socket.io server');

	socket.emit('joinRoom', {
		name: name,
		room: room
	});
	console.log(name + ' joined ' + room);
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');

	// strip scripts from message.text
	message.text = stripScripts(message.text);

	console.log('New message:');
	console.log(message.text);

	// $message.append('<p class="small animated fadeInUp"><strong>' 
	// 	+ momentTimestamp.local().format('h:mm:ssa') 
	// 	+ ' [' +  message.name + '] </strong><br>' + message.text + '</p>');

	$message.append('<p class="small animated fadeInUp"><strong>'
		+ message.name + '</strong><br>'
		+ message.text + '<br><span class="smaller" style="color: #aaaaaa">'
		+ momentTimestamp.local().format('h:mm:ssa') + '</span></p>');

	// COLORS room easter egg :]
	if (room.trim() === 'COLORS') {
		$('.messages > p').css('-webkit-animation', 'rainbow 10s infinite');
		$('.messages > p').css('-ms-animation', 'rainbow 10s infinite');
		$('.messages > p').css('-o-animation', 'rainbow 10s infinite');
		$('.messages > p').css('animation', 'rainbow 10s infinite');
	} 
});

// handles submission of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');

});