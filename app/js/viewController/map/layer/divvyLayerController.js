function DivvyLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var divvyData=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var drawStations = function(){
        divvyData.forEach(function(d){

            var divvyStationIcon = ExternalSvgViewController("resource/sublayer/icon/divvy-station.svg");
            self.view.append(divvyStationIcon);
            divvyStationIcon.view.width =self.defaultIconSize;
            divvyStationIcon.view.height=self.defaultIconSize;

            var position = self.project(d.latitude, d.longitude);
            divvyStationIcon.view.x = position.x;
            divvyStationIcon.view.y = position.y;

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
        console.log(divvyData);
    };

    var init = function() {

        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED,onDivvyData);





        /*var divvyStationIcon = ExternalSvgViewController("resource/sublayer/icon/divvy-station.svg");
        self.view.append(divvyStationIcon);
        divvyStationIcon.view.width =self.defaultIconSize;
        divvyStationIcon.view.height=self.defaultIconSize;
        var position = self.project(41.866320,-87.64 );
        divvyStationIcon.view.x = position.x;
        divvyStationIcon.view.y = position.y;

        divvyStationIcon.view.background.style("fill","red");*/

    }();


    return self;
}