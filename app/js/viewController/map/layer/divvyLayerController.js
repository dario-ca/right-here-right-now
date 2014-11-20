function DivvyLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _divvyData=[];
    var _svgStations=[];
    var _popup=null;


    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var drawStations = function(){
        self.hideStations();
        self.clear();   // Remove warnings
        
        _divvyData.forEach(function(d){
            var divvyStationIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/divvy-station.svg");
            _svgStations.push(divvyStationIcon);

            divvyStationIcon.view.background.style("fill",Colors.layer.MOBILITY);
            if(d.availableBikes==0 || d.availableDocks==0) {
                self.addWarning(d.latitude, d.longitude,self.defaultIconSize*self.defaultCircleRatio);
            }

            divvyStationIcon.view.onClick(function(){
                if(dataDivvyModel.stationSelected!==null)
                    _popup.dispose();
                dataDivvyModel.stationClicked(d);
            });
        })
    };

    var onDivvyData = function(){
        _divvyData=dataDivvyModel.data;
        drawStations();
    };

    self.hideStations = function(){
        _svgStations.forEach(function(d){
            d.dispose();
        });
        if(_popup!==null){
            _popup.dispose();
        }
        _svgStations=[];
    };

    var onStationSelected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataDivvyModel.stationSelected!==null && dataDivvyModel.stationSelected.availableBikes==0) {
            _popup = popupLayerController.openPopup(dataDivvyModel.stationSelected.latitude, dataDivvyModel.stationSelected.longitude, MapPopupType.POPUP_WARNING);
            _popup.view.title.text(dataDivvyModel.stationSelected.stationName);
            _popup.view.warning.text("No Available Bikes");
            _popup.view.subtitle.text(
                "Bikes: "+dataDivvyModel.stationSelected.availableBikes+
                " - Docks: "+dataDivvyModel.stationSelected.availableDocks);
        }else if(dataDivvyModel.stationSelected!==null && dataDivvyModel.stationSelected.availableDocks==0) {
            _popup = popupLayerController.openPopup(dataDivvyModel.stationSelected.latitude, dataDivvyModel.stationSelected.longitude, MapPopupType.POPUP_WARNING);
            _popup.view.title.text(dataDivvyModel.stationSelected.stationName);
            _popup.view.warning.text("No Available Docks");
            _popup.view.subtitle.text(
                "Bikes: "+dataDivvyModel.stationSelected.availableBikes+
                " - Docks: "+dataDivvyModel.stationSelected.availableDocks);
        }else if(dataDivvyModel.stationSelected!==null) {
            _popup = popupLayerController.openPopup(dataDivvyModel.stationSelected.latitude, dataDivvyModel.stationSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(dataDivvyModel.stationSelected.stationName);
            _popup.view.subtitle.text(
                "Bikes: "+dataDivvyModel.stationSelected.availableBikes+
                " - Docks: "+dataDivvyModel.stationSelected.availableDocks);
        }
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideStations();
        self.clear();   // Remove warnings
        self.super_dispose();
        dataDivvyModel.unsubscribe(Notifications.data.DIVVY_BIKES_CHANGED, onDivvyData);
        dataDivvyModel.unsubscribe(Notifications.data.DIVVY_BIKES_SELECTION_CHANGED, onStationSelected);

        // Disable notification
        dataNotificationModel.disableNotification(Notifications.data.DIVVY_BIKES_CHANGED);
    };

    var init = function() {
        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED, onDivvyData);
        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_SELECTION_CHANGED, onStationSelected);

        // Enable notification
        dataNotificationModel.enableNotification(Notifications.data.DIVVY_BIKES_CHANGED);
    }();

    return self;
}