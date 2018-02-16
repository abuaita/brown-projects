var status;
get_tweets("http://ec2-18-218-249-183.us-east-2.compute.amazonaws.com/feed/start", status);
var checkbox = $('#pause_update');
var keepUpdating = true; //by default

checkbox.change(function() {
	if (checkbox.is(':checked')){
		keepUpdating = false;
		console.log("its checked");
	}
	else{
		keepUpdating = true;
		console.log("un checked");
	}
});


setInterval(function () { get_tweets("http://ec2-18-218-249-183.us-east-2.compute.amazonaws.com/feed/start", status) }, 5000);

var tweet_feed = $('#tweet_feed');
var tweets = [];
var authors = [];
var ids = [];
var prof_images = [];
var times = []

function get_tweets(url, callback) {
	if (keepUpdating){
	   $.getJSON(url, function(data, status) {
	      if (status === "success") {
	         console.log("just got new data");
	         console.log(data)
	         for (i = 0; i < data.length; i++) {  //for each tweet in chron order
	         	//ids is empty at first, but after first load, it contains 26 IDs.
	         	//after first load, we need to check to see if it already is in the list
	         	if (!(ids.indexOf(data[i].id) >=0)){ //if it isnt in the list, add it 
	         		//adds it at the index it should be to maintain chronological order
	         		ids.splice(i, 0, data[i].id);
	    			tweets.splice(i, 0, data[i].text);
	    			authors.splice(i, 0, data[i].user.screen_name);
	    			prof_images.splice(i, 0, data[i].user.profile_image_url);
	    			times.splice(i, 0, data[i].created_at);
	         	}
			}
			clean_up_length();

	      } else {
	         console.log("it aint workin boo");
	      }

	   });
	}
}

function clean_up_length(){
	//now we have the list of tweets in chron order,
	//but need to delete any that are above index 25 (26 tweets)

	if (ids.length != 26){
		ids.length = 26;
		tweets.length = 26;
		authors.length = 26;
		prof_images.length = 26;
		times.length = 26;
	}

	publish_tweets()

}

function publish_tweets(){
	tweet_feed.text(""); //reset tweets
	var li = $('<li></li>');
	for (i = tweets.length-1; i >= 0; i--) { 
		var img = $('<img src='+ prof_images[i] +' />');
		li.html('<p>'+ tweets[i] +'<strong> -- @' + authors[i] + '</strong> <br>@ '+ times[i]+' </p>' );
		tweet_feed.append(img.clone());
		tweet_feed.append(li.clone());
	}

}
