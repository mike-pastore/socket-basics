var socket = io();
var room = getQueryVariable('room');
var name = getQueryVariable('name') || 'Anonymous';

socket.on('connect', function () {
	console.log('Connected to socket.io server');
	console.log(name + ' joined ' + room);
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');

	console.log('New message:');
	console.log(message.text);

	$message.append('<p class="small"><strong>' + momentTimestamp.local().format('h:mm:ssa') 
		+ ' [' +  message.name+ '] </strong><br>' + message.text + '</p>');
});

// strip + marks form multi-word names
function stripPlus(name) {
    return name.split('+').join(' ');
}

// call stripPlus
name = stripPlus(name);

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