function TwitterLayerController() {
    var self = MapLayerController();

    var tweetControllers = [];

    var onTwitterData = function() {

        removeTweets(); // Remove old tweets

        tweets = dataTwitterModel.data;
        tweets.forEach(function(tweet) {
            var tweetController = self.createIcon(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0], "resource/sublayer/icon/twitter.svg");

            tweetController.tweet = tweet;

            //tweet.user.profile_image_url

            self.view.append(tweetController);

            tweetControllers.push(tweetController);

            // Add the interaction on
            tweetController.view.onClick(function() {
                onTweetSelected(tweetController);
                console.log("Tweet clicked");
            });
        });

    };

    var removeTweets = function() {
        tweetControllers.forEach(function(tweetControllers) {
            tweetControllers.dispose();
        });
    };

    var onTweetSelected = function(tweetController) {
        var popup = popupLayerController.openPopup(tweetController.tweet.coordinates.coordinates[1],
                                                   tweetController.tweet.coordinates.coordinates[0],
                                                   MapPopupType.POPUP_TWITTER);
        var tweet = tweetController.tweet;

        popup.view.user.text(tweet.user.name);
        popup.view.image.attr("xlink:href",tweet.user.profile_image_url);
        popup.view.line1.text(formatLine(tweet.text,0));
        popup.view.line2.text(formatLine(tweet.text,1));
        popup.view.line3.text(formatLine(tweet.text,2));
    };

    var formatLine = function(text, line) {
        var charPerLine = 30;
        return text.substring(line*charPerLine, line*charPerLine + charPerLine);
    };

    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.clear();
        self.super_dispose();
        dataTwitterModel.unsubscribe(Notifications.data.TWITTER_CHANGED, onTwitterData);
    };

    var init = function() {
        dataTwitterModel.subscribe(Notifications.data.TWITTER_CHANGED, onTwitterData);
    }();

    return self;
}