/**
 *  Class DataDivvyModel
 *
 *  This class fetch the tweet for the selected area
 */

var DataTwitterModel = function() {
    var self = DataModel();

    self._twitterProxyURL = "data/twitter/twitter.php";
    self._notification = Notifications.data.TWITTER_CHANGED;
    self.interval = 30000;

    var count = "100";  // Number of tweet in a request range [1,100]

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {

        var selection = selectionModel.getCircumscribedSelection();
        var radius = getRadius(selection[0]);

        d3.json(self._twitterProxyURL +
                "&latitude=" + latitude +
                "&longitude=" + longitude +
                "&radius=" + radius +
                "&count=" + count, function(error, json) {
            if(error) {
                console.log("Error downloading the file "+self._divvyURL);
                return;
            }
            self.callback(geoFilter(json.statuses));
        });
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    /**
     * This function is automatically called for filtering data.
     * @param data to be filtered
     */
    var geoFilter = function(data) {
        var newData = data.filter(function(d) {
            if(d.coordinates != undefined)
                return false;

            return selectionModel.pointInside([d.coordinates[0], d.coordinates[1]]);
        });

        return newData;
    };

    var getRadius = function(rectangle) {
        var p0 = rectangle.points[0];
        var p1 = rectangle.points[1];
        var p2 = rectangle.points[2];
        var p3 = rectangle.points[3];

        var center = [p0[0]+p1[0]+p2[0]+p3[0],
                      p0[1]+p1[1]+p2[1]+p3[1]];

        var maxDistance = 0;

        rectangle.points.forEach(function(p) {
            var distance = geolib.getDistance(
                {latitude: center[0], longitude: center[1]},
                {latitude: p[0]    , longitude: p[1]}
            );
            if(distance > maxDistance)
                maxDistance = distance;
        });

        return maxDistance;
    };

    var init = function() {

        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.dataChanged);

    }();

    return self;
};

var dataTwitterModel = DataTwitterModel();