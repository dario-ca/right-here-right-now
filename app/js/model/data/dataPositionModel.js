/**
 *  Class DataPositionModel
 *
 *  This class contains the actual position of the user
 */

var DataPositionModel = function() {
    var self = DataModel();

    self.interval = 0;
    self._notification = Notifications.position.POSITION_CHANGED;
    self.duplicateCheck = false;

    self.automaticallyClearData = false;

    var noReply = true;

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    self.fetchData = function() {
        console.log("fetch position data");

        navigator.geolocation.getCurrentPosition(function(position) {
            var position = [position.coords.latitude, position.coords.longitude];
            console.log("Position: ", position);
            noReply = false;
            self.callback(position);
        });

        setTimeout(function(){
            if(noReply == true)
                self.callback([41.8700506,-87.6484266]);
        }, 5000);
    };

    var init = function() {
        self.startFetching();
    }();

    return self;
};

var dataPositionModel = DataPositionModel();