/**
 *  Class DataNotificationModel
 *
 *  This class maintain the changed data in order to produce notifications
 */

var DataNotificationModel = function(name) {
    var self = {};

    self.divvyData = undefined;
    self.busData = undefined;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.clearData = function() {
        self.divvyData = undefined;
        self.busData = undefined;
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var sendNotification = function() {
        notificationCenter.dispatch(Notifications.data.NOTIFICATION_AVAILABLE);
    };

    var onDivvyChange = function() {
        var data = dataDivvyModel.modifiedData;

        if(jQuery.isEmptyObject(data))
            return;

        // Make transformations on the data

        self.divvyData = data;
        sendNotification();
    };

    var onBusChange = function() {
        var data = dataBusModel.modifiedData;

        if(jQuery.isEmptyObject(data))
            return;

        // Make transformations on the data

        self.busData = data;
        sendNotification();
    };

    var testFunction = function() {
        console.log("DIVVY DATA CHANGED:");
        console.log(self.divvyData);
        console.log("BUS DATA CHANGED:");
        console.log(self.busData);
    };

    var init = function() {

        // Listen for data changed
        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED, onDivvyChange);
        dataBusModel.subscribe(Notifications.data.BUS_CHANGED, onBusChange);

        //notificationCenter.subscribe(Notifications.data.NOTIFICATION_AVAILABLE, testFunction);
    }();

    return self;
};

var dataNotificationModel = DataNotificationModel();