function CrimeLayerController(name,notification,icon) {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var crimeData=[];
    var svgCrimes=[];
    var _notification=notification;
    var _iconPath=icon;
    var _name=name;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawCrimes = function(){
        //TODO: remove crimes before update, now it removes every crime
        self.view.html("");
        crimeData.forEach(function(d){
            var crimeIcon = self.createIcon(d.latitude, d.longitude,_iconPath);
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
        switch(_name){
            case "narcotics":   crimeData=dataCrimeNarcoticsModel.data;
                break;
            case "robbery":     crimeData=dataCrimeRobberyModel.data;
        }
        drawCrimes();
    };

    var init = function() {
        switch(_name){
            case "narcotics":   dataCrimeNarcoticsModel.subscribe(_notification,onCrimeData);
                break;
            case "robbery":     dataCrimeRobberyModel.subscribe(_notification,onCrimeData);
        }
    }();

    return self;
}