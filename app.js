var config = require('./config');
var Twit = require('twit');
var tw = new Twit(config);
var io = require('socket.io')(3001);

var app = require('express')();
var http = require('http').Server(app);

//var stream = tw.stream('statuses/sample');
var stream = tw.stream('statuses/filter', {
	track: ['ustream', 'ustream.tv'],
//	language: 'en'
});

console.log('started');

stream.on('tweet', function printTweet(tweet){
	console.log(tweet.user.screen_name + ": " + tweet.text);
	io.emit('tweet', tweet);
});

stream.on('error', function printError(err){
	console.log(err);
});

io.on('connection', function(socket){
	console.log('New connection!')
});


app.get('/', function main(req, res){
	res.sendFile(__dirname + '/static/index.html');
});


http.listen(3000, function(){
	console.log('Listen on *:3000');
});