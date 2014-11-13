/**
 *  Controller that update the weather conditions
 *
 */
var WeatherViewController = function() {
    var self = SvgViewController();

    //#PUBLIC FUNCTIONS

    self.onWeatherChanged = function() {

        var weather =  dataWeatherModel.data;

        if(weather == null || weather == undefined || weather.current_observation == undefined)
            return;

        // Manage the weather that change
        console.log("New weather: ",weather.current_observation.weather,
                                    weather.current_observation.temp_f,
                                    weather.current_observation.temp_c);
    };
    
    //#PRIVATE FUNCTIONS

    var init = function() {
        self.view.classed("weather-view-controller", true);

        dataWeatherModel.subscribe(Notifications.data.WEATHER_CHANGED, self.onWeatherChanged);
    }();

    return self;
};