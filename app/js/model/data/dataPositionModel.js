/**
 *  Class DataPositionModel
 *
 *  This class contains the actual position of the user
 */

var DataPositionModel = function() {
    var self = DataModel();

    self.interval = 10000;
    self._notification = Notifications.position.POSITION_CHANGED;

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    self.fetchData = function() {
        console.log("Try to get geolocation");
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Got geolocation");
            var position = [position.coords.latitude, position.coords.longitude];
            self.callback(position);
        });
    };

    var init = function() {
        self.startFetching();
    }();

    return self;
};

var dataPositionModel = DataPositionModel();