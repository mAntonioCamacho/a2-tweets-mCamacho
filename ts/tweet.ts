class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if(this.text.startsWith("Achieved")) return "achievement";
        if(this.text.includes("completed") || this.text.includes("posted")) return "completed_event"
        if(this.text.startsWith("Watch")) return "live_event";
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if(this.text.includes("Check it out!")) return false;
        if(this.text.includes("TomTom MySports Watch")) return false;
        if(this.text.includes("#RKLive")) return false;
        if(this.text.includes("Distance...")) return false;
        if(this.text.includes("I just set a goal")) return false;

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        let index = this.text.indexOf("@Runkeeper");
        if(index >= 0) { return this.text.slice(index + "@Runkeeper".length); }

        index = this.text.indexOf("-");
        if(index >= 0) { return this.text.slice(index + 1); }

        return `ERROR: something happened original text here\n: ${this.text}`;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}