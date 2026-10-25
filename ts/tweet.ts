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
        if (this.source !== 'completed_event') {
            return "unknown"; // this was 'unknown'
        }
        
        var text_words = this.text.toLowerCase().split(" ");
        if(text_words.includes("run")) return "run";
        if(text_words.includes("walk")) return "walk";
        if(text_words.includes("elliptical")) return "elliptical";
        if(text_words.includes("bike")) return "bike";
        if(text_words.includes("swim")) return "swim";
        if(text_words.includes("row")) return "row";
        if(text_words.includes("hike")) return "hike";
        if(text_words.includes("skate")) return "skate";
        return "";
    }

    get distance():number {
        if(this.source !== 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        if(this.activityType === "") return 0;
        var text_words = this.text.toLowerCase().split(" ");
        var index = text_words.findIndex((word) => word === "mi" || word === "km");
        
        if(index > 0) {
            if(text_words[index] === "km") return Number(text_words[index - 1]) / 1.609344;
            return Number(text_words[index - 1]);
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const urlIndex = this.text.indexOf("https");
        if(urlIndex >= 0) {
            const textPart = this.text.slice(0, urlIndex);
            const url = this.text.slice(urlIndex);
        
            return `
            <tr>
                <td>${rowNumber}</td>
                <td>${this.activityType}</td>
                <td>${textPart}<a href="${url}">${url}</a></td>
            </tr>
            `;
        }
        return "<tr></tr>";
    }
}