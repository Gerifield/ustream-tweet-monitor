var config = require('./config');
var Twit = require('twit');
var tw = new Twit(config);
var io = require('socket.io')(3001);

var app = require('express')();
var http = require('http').Server(app);

var redis = require('redis'),
	client = redis.createClient();

//var stream = tw.stream('statuses/sample');
var stream = tw.stream('statuses/filter', {
	track: ['ustream', 'ustream.tv'],
//	language: 'en'
});

console.log('started');

client.on("error", function (err) {
        console.log("Redis error " + err);
    });

stream.on('tweet', function printTweet(tweet){
	console.log(tweet.user.screen_name + ": " + tweet.text);
	io.emit('tweet', tweet);
	client.lpush(['tweets', JSON.stringify(tweet)]);
	client.ltrim(['tweets', 0, 10]);
});

stream.on('error', function printError(err){
	console.log(err);
});

io.on('connection', function(socket){
	console.log('New connection!')
	client.get('tweets', function(err, replies){
		if (!err) {
			for (var i = replies.length - 1; i >= 0; i--) {
				scket.emit('tweet', JSON.parse(replies[i]));
			};
		}
	});
});


app.get('/', function main(req, res){
	res.sendFile(__dirname + '/static/index.html');
});


http.listen(3000, function(){
	console.log('Listen on *:3000');
});