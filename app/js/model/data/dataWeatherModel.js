/**
 *  Class DataWeatherModel
 *
 * This class fetch the weather for the city of Chicago
 */

var DataWeatherModel = function(name) {
    var self = DataModel();

    self._key = "6bf3d5f7145551ec";
    self._weather = "http://api.wunderground.com/api/"+self._key+"/conditions/q/CA/Chicago.json";
    self._notification = Notifications.data.WEATHER_CHANGED;
    self.interval = 1200000;    // Every 20 minutes

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {
        d3.json(self._proxyURL + self._weather, function(error, json) {
            if(error) {
                console.log("Error downloading the file "+self._weather);
                return;
            }
            self.callback(json);
        });
    };

    self.subscribe = function(notification, callback) {
        self.super_subscribe(notification, callback);

        self._observers++;

        if(self._active == true && self.data != null) {
            // Data is already present, call callback
            callback();
        }
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var init = function() {
        self.startFetching();
    }();

    return self;
};

var dataWeatherModel = DataWeatherModel();