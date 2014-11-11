/**
 *  Controller with takes care of displaying the notification popups
 */
var NotificationPopupsViewController = function() {
    var self = SvgViewController();

    var MAX_POPUP = 2;
    var POPUP_DURATION = 10000;

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



    var init = function() {
        self.view.classed("notifications-popups-view-controller", true);

        self.view.setViewBox(0, 0, _popupWidth, _popupHeight);

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

    }();

    return self;
};