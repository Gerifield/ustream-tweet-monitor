var Twit = require('twit');
var config = require('./config');

var tw = new Twit(config);

//var stream = tw.stream('statuses/sample');
var stream = tw.stream('statuses/filter', {
	track: ['ustream', 'ustream.tv'],
	language: 'en'
});

console.log('started');

stream.on('tweet', function printTweet(tweet){
	console.log(tweet.user.screen_name + ": " +tweet.text);
});

stream.on('error', function printError(err){
	console.log(err);
});
