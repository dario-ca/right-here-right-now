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

        /*
        return text.substring(line*charPerLine, line*charPerLine + charPerLine);
        */

        var i = formatLineIndexes(text, line);

        /*if(i[0] >= text.length || i[1] >= text.length)
            return "";
        else */
            return text.substring(i[0], i[1]);
    };

    var formatLineIndexes = function(text, line) {
        var charPerLine = 33;

        var lastSpaceIndex = (line + 1) * charPerLine;
        for(var i = line * charPerLine; i < (line + 1) * charPerLine && i < text.length; i++) {
            if(text[i] == ' ')
                lastSpaceIndex = i;
        }

        if((line + 1) * charPerLine - lastSpaceIndex > 5)
            lastSpaceIndex = (line + 1) * charPerLine;

        if(line == 0)
            return [0, lastSpaceIndex];

        var previousIndexes = formatLineIndexes(text, line - 1);
        var currentIndexes = formatLineIndexes(text.substring(previousIndexes[1], formatLineIndexes[1]+charPerLine), 0);
        return [previousIndexes[1] + 1, previousIndexes[1] + currentIndexes[1]];

    };

    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.clear();
        self.super_dispose();
        dataTwitterModel.unsubscribe(Notifications.data.TWITTER_CHANGED, onTwitterData);

        // Disable notification
        dataNotificationModel.disableNotification(Notifications.data.TWITTER_CHANGED);
    };

    var init = function() {
        dataTwitterModel.subscribe(Notifications.data.TWITTER_CHANGED, onTwitterData);

        // Enable notification
        dataNotificationModel.enableNotification(Notifications.data.TWITTER_CHANGED);
    }();

    return self;
}