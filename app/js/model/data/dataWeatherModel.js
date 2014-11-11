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
    self.interval = 30000;

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

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
        self.startFetching();
    }();

    return self;
};

var dataWeatherModel = DataWeatherModel();