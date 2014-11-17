function TwitterLayerController() {
    var self = MapLayerController();

    var onTwitterData = function() {

        tweets = dataTwitterModel.data;
        tweets.forEach(function(tweet) {
            var tweetController = self.createIcon(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0], "resource/sublayer/icon/twitter.svg");

            /*
            var p = self.project(tweet.coordinates.coordinates[0], tweet.coordinates.coordinates[1]);
            tweetController.view
                .attr("x", p.x)
                .attr("y", p.y);
            */

            self.view.append(tweetController);

            // Add the interaction on
            tweetController.view.onClick(function() {
                onTweetSelected();
            });
        });

    };

    var onTweetSelected = function() {
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