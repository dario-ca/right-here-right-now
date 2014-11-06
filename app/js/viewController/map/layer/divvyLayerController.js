function DivvyLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var divvyData=[];
    var divvyStationIcon=null;

    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var drawStations = function(){
        divvyData.forEach(function(d){
            var position = self.project(d.latitude, d.longitude);
            divvyStationIcon.view.x = position.x;
            divvyStationIcon.view.y = position.y;
            divvyStationIcon.view.background.style("fill",function(){
                //station empty: no bikes
                if(d.availableBikes==0){
                    divvyStationIcon.view.background.style("fill","red");
                //station full: no slots
                }else if(d.availableDocks==0){
                    divvyStationIcon.view.background.style("fill","blue");
                //station regular: bikes and slots
                }else{
                    divvyStationIcon.view.background.style("fill","green");
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

        divvyStationIcon = ExternalSvgViewController("resource/sublayer/icon/divvy-station.svg");
        self.view.append(divvyStationIcon);
        divvyStationIcon.view.width =self.defaultIconSize;
        divvyStationIcon.view.height=self.defaultIconSize;

        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED,onDivvyData);

        var position = self.project(41.866320,-87.64 );
        divvyStationIcon.view.x = position.x;
        divvyStationIcon.view.y = position.y;

        divvyStationIcon.view.background.style("fill","red");

    }();


    return self;
}