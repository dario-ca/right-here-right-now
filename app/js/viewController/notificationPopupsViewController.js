/**
 *  Controller with takes care of displaying the notification popups
 */
var NotificationPopupsViewController = function() {
    var self = SvgViewController();

    var MAX_POPUP = 5;
    var POPUP_DURATION = 20000;

    var _notificationPopups = [];
    var _popupWidth = 100;
    var _popupHeight = 20;


    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();
    };


    /**
     * Add a notification popup
     */
    self.addNotificationPopup = function(title, subtitle, icon){

        //Push down the others
        for(var i = 0; i < _notificationPopups.length; i++){
            var popup = _notificationPopups[i];
            var oldY = popup.view.y;
            popup.view.transition().attr("y", oldY + _popupHeight);

            if(_notificationPopups.length >= MAX_POPUP){
                if(i == _notificationPopups.length - MAX_POPUP) {
                    popup.view.style("opacity", 0.5);
                } else if(i < _notificationPopups.length - MAX_POPUP) {
                    popup.view.style("opacity", 0);
                }
            }

        }


        var notificationPopup = ExternalSvgViewController("resource/view/notification-popup.svg");
        notificationPopup.view.title.text(title);
        notificationPopup.view.subtitle.text(subtitle);
        notificationPopup.view.icon.imageSrc = icon;
        notificationPopup.view.style("opacity", 1);


        self.view.append(notificationPopup);
        _notificationPopups.push(notificationPopup);

        window.setTimeout(function(){
            _notificationPopups = _.without(_notificationPopups, notificationPopup);
            notificationPopup.dispose();

        },POPUP_DURATION);

        notificationPopup.view.y = 0;

        return notificationPopup;
    };

    //#PRIVATE FUNCTIONS

    var notificationAvailable = function() {
        console.log("New notification available");
        var divvyData = dataNotificationModel.divvyData;
        var busData = dataNotificationModel.busData;
        var twitterData = dataNotificationModel.twitterData;

        dataNotificationModel.clearData();  // Delete already notified data

        if(divvyData != undefined)
            divvyData.forEach(function(station) {
                var message;

                if(station.availableDocks == station.totalDock)
                    message = "Divvy station empty";
                else if(station.availableDocks == 0)
                    message = "Divvy station full";
                else
                    return; // Do not notify stations that are not empty and not full

                self.addNotificationPopup(message, station.stationName,
                    "resource/sublayer/icon/divvy-station.svg");
                console.log(station);
            });

        if(busData != undefined)
            busData.forEach(function(bus) {
                if(bus.dly == undefined)
                    return; // Do not consider bus in time

                console.log(bus);
                self.addNotificationPopup("Delayed bus", "Bus: "+bus.rt,
                    "resource/sublayer/icon/bus-no-number.svg");
            });

        if(twitterData != undefined)
            twitterData.forEach(function(tweet) {
                console.log(tweet);
                self.addNotificationPopup("New tweet from "+tweet.user.name, tweet.text.substring(0,40),
                    "resource/sublayer/icon/twitter.svg");
            });
    };



    var init = function() {
        self.view.classed("notifications-popups-view-controller", true);

        self.view.setViewBox(0, 0, _popupWidth, _popupHeight);

        /*

        var i = 0;

        window.setInterval(function(){
            i++;
            self.addNotificationPopup("Abandoned Vehicle ", "somewhere",
                "resource/sublayer/icon/abandoned-vehicle.svg");
        },25000);

        window.setInterval(function(){
            i++;
            self.addNotificationPopup("Divvy Station Empty", "The bikes station ... has no more bikes",
                "resource/sublayer/icon/divvy-station.svg");
        },11000);

        window.setInterval(function(){
            i++;
            self.addNotificationPopup("Light broken", "Light in street ... broke",
                "resource/sublayer/icon/light.svg");
        },6000);

        window.setInterval(function(){
            i++;
            self.addNotificationPopup("OH MY GOD THEY KILLED KENNY!", "",
                "resource/sublayer/icon/assault.svg");
        },15000);

        window.setInterval(function(){
            i++;
            self.addNotificationPopup("Mouse", "Mouse spotted close to UIC",
                "resource/sublayer/icon/unsafe.svg");
        },19000);
        */

        // Subscription to notifications
        notificationCenter.subscribe(Notifications.data.NOTIFICATION_AVAILABLE, notificationAvailable);

    }();

    return self;
};