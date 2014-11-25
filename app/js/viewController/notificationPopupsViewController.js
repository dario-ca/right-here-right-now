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
            });

        if(busData != undefined)
            busData.forEach(function(bus) {
                if(bus.dly == undefined)
                    return; // Do not consider bus in time

                self.addNotificationPopup("Delayed bus", "Bus: "+bus.rt,
                    "resource/sublayer/icon/bus-no-number.svg");
            });

        if(twitterData != undefined)
            twitterData.forEach(function(tweet) {
                self.addNotificationPopup("New tweet from "+tweet.user.name, tweet.text.substring(0,40),
                    "resource/sublayer/icon/twitter.svg");
            });
    };



    var init = function() {
        self.view.classed("notifications-popups-view-controller", true);

        self.view.setViewBox(0, 0, _popupWidth, _popupHeight);

        var count = 0;
        window.setTimeout(function(){
            if(model.getLayerWithName("SOCIAL").getSublayerWithName("twitter").selected){
                count ++;
                if(count == 1) {
                    self.addNotificationPopup("Tweet from: Jenni Brambilla", "OMG I've met an handsome Italian guy",
                        "resource/sublayer/icon/twitter.svg");
                }
                if(count == 2){
                    self.addNotificationPopup("Tweet from: Rocky89", "Work out works fine",
                        "resource/sublayer/icon/twitter.svg");
                }
            }
        },30000);
/*
        var i = 0;

        window.setTimeout(function(){
            i++;
            self.addNotificationPopup("Abandoned Vehicle ", "near 809 S Damen Avenue ",
                "resource/sublayer/icon/abandoned-vehicle.svg");
        },5000);

        window.setTimeout(function(){
            i++;
            self.addNotificationPopup("Tweet from: Antionetta94", "Just met an handsome italian guy!",
                "resource/sublayer/icon/twitter.svg");
        },6000);

        window.setTimeout(function(){
            i++;
            self.addNotificationPopup("Divvy Station Empty", "UIC Campus East",
                "resource/sublayer/icon/divvy-station.svg");
        },9000);

        window.setTimeout(function(){
            i++;
            self.addNotificationPopup("Tweet from: Killer Kenny", "OMG Delicious dinner at Sbarro",
                "resource/sublayer/icon/twitter.svg");
        },10000);


        window.setTimeout(function(){
            i++;
            self.addNotificationPopup("Light broken", "Light in Tailor Street is broken",
                "resource/sublayer/icon/light.svg");
        },13000);

        /*window.setTimeout(function(){
            i++;
            self.addNotificationPopup("OH MY GOD THEY KILLED KENNY!", "",
                "resource/sublayer/icon/assault.svg");
        },15000);

        window.setTimeout(function(){
            i++;
            self.addNotificationPopup("Bus Delayed", "Line 157",
                "resource/sublayer/icon/bus-no-number.svg");
        },18000);

*/
        // Subscription to notifications
        notificationCenter.subscribe(Notifications.data.NOTIFICATION_AVAILABLE, notificationAvailable);

    }();

    return self;
};