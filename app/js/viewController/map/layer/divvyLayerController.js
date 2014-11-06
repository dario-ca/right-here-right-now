function DivvyLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var divvyData=[];
    var svgStations=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    /*var createIcon = function(latitude, longitude, path){
        var icon = ExternalSvgViewController(path);
        self.view.append(icon);
        icon.view.width =self.defaultIconSize;
        icon.view.height=self.defaultIconSize;

        var position = self.project(latitude, longitude);
        icon.view.x = position.x;
        icon.view.y = position.y;

        return icon;
    };*/

    var drawStations = function(){
        //TODO: remove stations before update, now it removes every station
        self.view.html("");
        divvyData.forEach(function(d){
            console.log(d);
            var divvyStationIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/divvy-station.svg");
            svgStations.push(divvyStationIcon);
            divvyStationIcon.view.background.style("fill",function(){
                //station empty: no bikes
                if(d.availableBikes==0){
                    return Colors.station.DIVVY_STATION_EMPTY;
                //station full: no slots
                }else if(d.availableDocks==0){
                    return Colors.station.DIVVY_STATION_FULL;
                //station regular: bikes and slots
                }else{
                    return Colors.station.DIVVY_STATION_REGULAR;
                }
            });
        })
    };

    var onDivvyData = function(){
        divvyData=dataDivvyModel.data;
        drawStations();
    };

    var init = function() {
        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED,onDivvyData);
    }();

    return self;
}