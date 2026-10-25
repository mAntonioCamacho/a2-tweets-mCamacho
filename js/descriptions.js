writtenTweets = [];
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	writtenTweets = tweet_array.filter(tweet => tweet.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const input = document.getElementById("textFilter");
	input.addEventListener('input', function() {
		const searchText = input.value.toLowerCase();
		const matches = writtenTweets.filter(tweet => tweet.writtenText.toLowerCase().includes(searchText));
		const tableBody = document.getElementById("tweetTable");
		tableBody.innerHTML = matches.map((tweet,i) => tweet.getHTMLTableRow(i+1)).join("");

		if(searchText === "") {
			tableBody.innerHTML = "";
			return;
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});