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
        navigator.geolocation.getCurrentPosition(function(position) {
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