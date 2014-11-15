function VehicleLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _vehicleData=[];
    var _svgVehicles=[];
    var _popup=null;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawVehicles = function(){
        self.hideVehicles();
        _vehicleData.forEach(function(d){
            var vehicleIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/abandoned-vehicle.svg");
            _svgVehicles.push(vehicleIcon);
            vehicleIcon.view.background.style("fill",function(){
                if(d.status==dataVehiclesModel.status.VEHICLE_COMPLETED){
                    return Colors.vehicle.VEHICLE_COMPLETED;
                }else if(d.status==dataVehiclesModel.status.VEHICLE_COMPLETED_DUP){
                    return Colors.vehicle.VEHICLE_COMPLETED_DUP;
                }else if(d.status==dataVehiclesModel.status.VEHICLE_OPEN) {
                    return Colors.vehicle.VEHICLE_OPEN;
                }else if(d.status==dataVehiclesModel.status.VEHICLE_OPEN_DUP) {
                    return Colors.vehicle.VEHICLE_OPEN_DUP;
                }
            });
            vehicleIcon.view.onClick(function(){
                if(dataVehiclesModel.vehicleSelected!==null)
                    _popup.dispose();
                dataVehiclesModel.vehicleClicked(d);
            });
        })
    };

    var onVehicleSelected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataVehiclesModel.vehicleSelected!==null) {
            _popup = popupLayerController.openPopup(dataVehiclesModel.vehicleSelected.latitude, dataVehiclesModel.vehicleSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text("Abandoned Vehicle: "+dataVehiclesModel.vehicleSelected.status);
            _popup.view.subtitle.text(dataVehiclesModel.vehicleSelected.street_address);
        }
    };

    var onVehicleData = function(){
        _vehicleData=dataVehiclesModel.data;
        drawVehicles();
    };

    self.hideVehicles = function(){
        _svgVehicles.forEach(function(d){
            d.dispose();
        });
        _svgVehicles=[];
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideVehicles();
        self.super_dispose();
        dataVehiclesModel.unsubscribe(Notifications.data.ABANDONED_VEHICLES_CHANGED, onVehicleData);
        dataVehiclesModel.unsubscribe(Notifications.data.ABANDONED_VEHICLES_SELECTION_CHANGED, onVehicleSelected);
    };

    var init = function() {
        dataVehiclesModel.subscribe(Notifications.data.ABANDONED_VEHICLES_CHANGED, onVehicleData);
        dataVehiclesModel.subscribe(Notifications.data.ABANDONED_VEHICLES_SELECTION_CHANGED, onVehicleSelected);
    }();

    return self;
}