function CrimeNarcoticsLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var crimeData=[];
    var svgCrimes=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawCrimes = function(){
        //TODO: remove crimes before update, now it removes every crime
        self.view.html("");
        crimeData.forEach(function(d){
            var crimeIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/pothole.svg");
            svgCrimes.push(crimeIcon);
            crimeIcon.view.background.style("fill","red");
           /* crimeIcon.view.background.style("fill",function(){
                if(d.status==dataVehiclesModel.status.VEHICLE_COMPLETED){
                    return Colors.vehicle.VEHICLE_COMPLETED;
                }else if(d.status==dataVehiclesModel.status.VEHICLE_COMPLETED_DUP){
                    return Colors.vehicle.VEHICLE_COMPLETED_DUP;
                }else if(d.status==dataVehiclesModel.status.VEHICLE_OPEN) {
                    return Colors.vehicle.VEHICLE_OPEN;
                }else if(d.status==dataVehiclesModel.status.VEHICLE_OPEN_DUP) {
                    return Colors.vehicle.VEHICLE_OPEN_DUP;
                }
            });*/
        })
    };

    var onCrimeData = function(){
        crimeData=dataCrimeNarcoticsModel.data;
        drawCrimes();
    };

    var init = function() {
        dataCrimeNarcoticsModel.subscribe(Notifications.data.crime.CRIME_NARCOTICS_CHANGED,onCrimeData);
    }();

    return self;
}