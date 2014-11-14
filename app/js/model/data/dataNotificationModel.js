/**
 *  Class DataNotificationModel
 *
 *  This class maintain the changed data in order to produce notifications
 */

var DataNotificationModel = function(name) {
    var self = {};

    var divvyData;
    var busData;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    var sendNotification = function() {
        notificationCenter.dispatch(Notifications.data.NOTIFICATION_AVAILABLE);
    };

    var onDivvyChange = function() {
        var data = dataDivvyModel.modifiedData;

        if(jQuery.isEmptyObject(data))
            return;

        // Make transformations on the data

        divvyData = data;
        sendNotification();
    };

    var onBusChange = function() {
        var data = dataBusModel.modifiedData;

        if(jQuery.isEmptyObject(data))
            return;

        // Make transformations on the data

        busData = data;
        sendNotification();
    };

    var testFunction = function() {
        console.log("DIVVY DATA CHANGED:");
        console.log(divvyData);
        console.log("BUS DATA CHANGED:");
        console.log(busData);
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var init = function() {

        // Listen for data changed
        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED, onDivvyChange);
        dataBusModel.subscribe(Notifications.data.BUS_CHANGED, onBusChange);

        notificationCenter.subscribe(Notifications.data.NOTIFICATION_AVAILABLE, testFunction);
    }();

    return self;
};

var dataNotificationModel = DataNotificationModel();