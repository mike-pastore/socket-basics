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

	$message.append('<p class="small animated fadeInUp"><strong>' 
		+ momentTimestamp.local().format('h:mm:ssa') 
		+ ' [' +  message.name + '] </strong><br>' + message.text + '</p>');
});

// handles submission of new message
var $form = jQuery('#message-form');
var $button = jQuery('#form-submit-button');
var $input = $('input');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');

	// scroll div upwards IF form submit field is below window
	// console.log($button.isOnScreen())
});