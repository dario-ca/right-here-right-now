function DivvyLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var divvyData=[];
    var divvyStationIcon=null;

    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var init = function() {

        divvyStationIcon = ExternalSvgViewController("resource/sublayer/icon/divvy-station.svg");
        self.view.append(divvyStationIcon);
        divvyStationIcon.view.width =self.defaultIconSize;
        divvyStationIcon.view.height=self.defaultIconSize;

        dataDivvyModel.subscribe(Notification.data.DIVVY_BIKES_CHANGED,callbackDivvyData);

        /*var position = self.project(41.866320,-87.64 );
        divvyStationIcon.view.x = position.x;
        divvyStationIcon.view.y = position.y;

        divvyStationIcon.view.background.style("fill","red");*/

    }();

    var drawStations = function(){
        divvyData.forEach(function(d){
            var position = self.project(d.latitude, d.longitude);
            divvyStationIcon.view.x = position.x;
            divvyStationIcon.view.y = position.y;
            divvyStationIcon.view.background.style("fill",function(){
/*                //station empty: no bikes
                if(){

                //station full: no slots
                }else if(){

                //station regular: bikes and slots
                }else{

                }*/
            });
        })
    };

    var callbackDivvyData = function(){
        divvyData=dataDivvyModel.data;
        drawStations();
        console.log(divvyData);
    };

    return self;
}