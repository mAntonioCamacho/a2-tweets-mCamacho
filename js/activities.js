function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var activity_arr = makeActivityArray(); 
	
	// activity types count with removal of "" and "unknown"
	const counts = new Map();
	for(const element of activity_arr) {	
		if(element.activity !== "" && element.activity !== "unknown")
			counts.set(element.activity, (counts.get(element.activity) || 0) + 1);
	}
	document.getElementById("numberActivities").innerText = counts.size;

	// sort the values from largest to smallest : convert map to array [...map]
	const sortedArr = [...counts.entries()].sort((a,b) => b[1] - a[1]);
	// getting the top 3 activities from the array of arrays
	var first = sortedArr[0][0];
	var second = sortedArr[1][0];
	var third = sortedArr[2][0];
	document.getElementById("firstMost").innerText = first;
	document.getElementById("secondMost").innerText = second;
	document.getElementById("thirdMost").innerText = third;

	
	// getting the longest and shortest distance activity
	// i only want the top three
	const distanceMap = new Map();
	for(const element of activity_arr) {
		if(element.activity === first || element.activity === second || element.activity === third) {
			distanceMap.set(element.activity, (distanceMap.get(element.activity) || 0) + element.distance);
		}
	}
	// map those averages with activity
	const averages = new Map();
	distanceMap.forEach((total, activity) => {
		averages.set(activity, total / counts.get(activity));
	});
	// convert to sorted array
	const sortedAvg = [...averages.entries()].sort((a,b) => b[1] - a[1]);
		//console.log(sortedAvg[2]);
	document.getElementById("longestActivityType").innerText = sortedAvg[0][0];
	document.getElementById("shortestActivityType").innerText = sortedAvg[2][0];
	// nifty filter function... just get the bike people
	bike_array = activity_arr.filter(biker => biker.activity === "bike");
	var weekend_biker = 0;
	var weekend_dist = 0;
	var weekday_biker = 0;
	var weekday_dist = 0;
	for(const biker of bike_array) {
		if(biker.weekend) {
			weekend_biker++;
			weekend_dist += biker.distance;
		}
		else {
			weekday_biker++;
			weekday_dist += biker.distance;
		}
	}
	var weekdayAvg = weekday_dist / weekday_biker;
	var weekendAvg = weekend_dist / weekend_biker;

		//console.log(weekdayAvg, weekendAvg);
	document.getElementById("weekdayOrWeekendLonger").innerText = (weekdayAvg > weekendAvg) ? "Weekday" : "Weekend"

	counts_arr = [...counts].map(([activity, count]) => ({activity,count}));
	// bruh - why is that info at the bottom in canvas - all that work is staying
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": counts_arr
	  },
	  "mark": "bar",
	  "encoding": {
		x: {
			field: "activity",
			type: "nominal"
		},
		y: {
			field: "count",
			type: "quantitative"
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	dist_act_day_arr = activity_arr.filter(obj => obj.activity === "run" || obj.activity === "walk" || obj.activity === "bike")
	.map(obj => ({
		activity: obj.activity,
		distance: obj.distance,
		day: obj.day
	}));

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "",
	  "data": {
	    "values": dist_act_day_arr
	  },
	  "mark": "point",
	  "encoding": {
		x: {
			field: "day",
			type: "ordinal"
		},
		y: {
			field: "distance",
			type: "quantitative"
		},
		color: {
			field: "activity",
			type: "nominal"
		}
	  }
	};

	distance_agg_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "",
	  "data": {
	    "values": dist_act_day_arr
	  },
	  "mark": "point",
	  "encoding": {
		x: {
			field: "day",
			type: "ordinal"
		},
		y: {
			field: "distance",
			type: "quantitative",
			aggregate: "mean"
		},
		color: {
			field: "activity",
			type: "nominal"
		}
	  }
	};

	let aggregated = false;
	vegaEmbed('#distanceVis', distance_vis_spec, {actions: false});
	document.getElementById("aggregate").addEventListener("click", () => { 
		aggregated = !aggregated;
		if(aggregated) {
			vegaEmbed('#distanceVis', distance_vis_spec, {actions: false});
		}
		else {
			vegaEmbed('#distanceVis', distance_agg_vis_spec, {actions: false});
		}

	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function makeActivityArray() {
	const activities = tweet_array.map(tweet => {
		return {
			activity: tweet.activityType,
			distance: tweet.distance,
			weekend: tweet.time.getDay() === 0 || tweet.time.getDay() === 6,
			day: tweet.time.getDay()
		};
	});
	return activities;
}

