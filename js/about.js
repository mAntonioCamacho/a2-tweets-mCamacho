function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	updateTweetDates();
	updateTweetCategory();
	writtenTweets();
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateTweetDates() {
	//Tweet Dates 1 point
	var earliestTweet = tweet_array.reduce(
		(earliest, current) => {
			return current.time < earliest.time ? current : earliest;
	});
	var latestTweet = tweet_array.reduce(
		(latest, current) => {
			return current.time > latest.time ? current : latest;
	});
	
	dateFormat = {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	};

	document.getElementById('firstDate').innerText = earliestTweet.time.toLocaleDateString('en-us', dateFormat);
	document.getElementById('lastDate').innerText = latestTweet.time.toLocaleDateString('en-us', dateFormat);
}

function updateTweetCategory() {
	// completed_events
	var complete = 0;
	tweet_array.forEach((tweet) => complete = (tweet.source === "completed_event") ? complete + 1 : complete);
	document.getElementsByClassName("completedEvents")[0].innerText = complete;
	document.getElementsByClassName("completedEvents")[1].innerText = complete;
	document.getElementsByClassName("completedEventsPct")[0].innerText = ((complete / tweet_array.length) * 100).toFixed(2)+'%';

	// achieved
	var achieved = 0;
	tweet_array.forEach((tweet) => achieved = (tweet.source === "achievement") ? achieved + 1 : achieved);
	document.getElementsByClassName("achievements")[0].innerText = achieved;
	document.getElementsByClassName("achievementsPct")[0].innerText = ((achieved / tweet_array.length) * 100).toFixed(2)+'%';

	// live_events
	var live = 0;
	tweet_array.forEach((tweet) => live = (tweet.source === "live_event") ? live + 1 : live);
	document.getElementsByClassName("liveEvents")[0].innerText = live;
	document.getElementsByClassName("liveEventsPct")[0].innerText = ((live / tweet_array.length) * 100).toFixed(2)+'%';

	// misc
	var misc = 0;
	tweet_array.forEach((tweet) => misc = (tweet.source === "miscellaneous") ? live + 1 : live);
	document.getElementsByClassName("miscellaneous")[0].innerText = misc;
	document.getElementsByClassName("miscellaneousPct")[0].innerText = ((misc / tweet_array.length) * 100).toFixed(2)+'%';
}

function writtenTweets() {
	//tweet_array.forEach((tweet) => { console.log(tweet.writtenText); });

	var complete = 0;
	var counter = 0;
	tweet_array.forEach((tweet) => complete = (tweet.source === "completed_event") ? complete + 1 : complete);
	tweet_array.forEach((tweet) =>  counter = (tweet.writtenText != "") ? counter + 1 : counter);

	document.getElementsByClassName("written")[0].innerText = counter;
	document.getElementsByClassName("writtenPct")[0].innerText = ((counter/complete) * 100).toFixed(2)+'%';
}