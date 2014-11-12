/**
 *  Controller that update the weather conditions
 *
 */
var WeatherViewController = function() {
    var self = SvgViewController();

    //#PUBLIC FUNCTIONS

    self.onWeatherChanged = function() {

        // Manage the weather that change
        console.log("New weather: ",dataWeatherModel.data.current_observation.weather,
                                    dataWeatherModel.data.current_observation.temp_f,
                                    dataWeatherModel.data.current_observation.temp_c);
    };
    
    //#PRIVATE FUNCTIONS

    var init = function() {
        self.view.classed("weather-view-controller", true);

        dataWeatherModel.subscribe(Notifications.data.WEATHER_CHANGED, self.onWeatherChanged);
    }();

    return self;
};