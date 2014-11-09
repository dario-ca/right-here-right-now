/**
 *
 * @constructor
 */
var TimeIntervalModel = function() {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = {};

    var timeInterval = TimeInterval.LAST_WEEK;


    ////////////////////////// PUBLIC METHODS //////////////////////////
    self.__defineSetter__("timeInterval", function(ti) {
        timeInterval = ti;
        notificationCenter.dispatch(Notifications.timeInterval.TIME_INTERVAL_CHANGED);
    });

    self.__defineGetter__("timeInterval", function() {
       return  timeInterval;
    });

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var init = function() {
        // Emit the first signal when created in order to update the button
        notificationCenter.dispatch(Notifications.timeInterval.TIME_INTERVAL_CHANGED);
    } ();

    return self;
};

TimeInterval = {
    LAST_WEEK: "LAST_WEEK",
    LAST_MONTH: "LAST_MONTH"
}

var timeIntervalModel = TimeIntervalModel();
