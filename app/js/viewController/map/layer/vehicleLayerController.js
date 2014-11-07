function VehicleLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var vehicleData=[];
    var svgVehicles=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawVehicles = function(){
        //TODO: remove vehicles before update, now it removes every vehicle
        self.view.html("");
        vehicleData.forEach(function(d){
            var vehicleIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/abandoned-vehicle.svg");
            svgVehicles.push(vehicleIcon);
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
        })
    };

    var onVehicleData = function(){
        vehicleData=dataVehiclesModel.data;
        drawVehicles();
    };

    var init = function() {
        dataVehiclesModel.subscribe(Notifications.data.ABANDONED_VEHICLES_CHANGED,onVehicleData);
    }();

    return self;
}