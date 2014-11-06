function PotholeLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var potholeData=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var createIcon = function(latitude, longitude, path){
        var icon = ExternalSvgViewController(path);
        self.view.append(icon);
        icon.view.width =self.defaultIconSize;
        icon.view.height=self.defaultIconSize;

        var position = self.project(latitude, longitude);
        icon.view.x = position.x;
        icon.view.y = position.y;

        return icon;
    };

    var drawPotholes = function(){
        potholeData.forEach(function(d){
            var potholeIcon = createIcon(d.latitude, d.longitude,"resource/sublayer/icon/pothole.svg");
            potholeIcon.view.background.style("fill",function(){
                if(d.status==DataPotholeModel.status.POTHOLE_OPEN){
                    return Colors.pothole.POTHOLE_OPEN;
                }else if(d.status==DataPotholeModel.status.POTHOLE_OPEN_DUP){
                    return Colors.pothole.POTHOLE_OPEN_DUP;
                }else{
                    return Colors.pothole.POTHOLE_COMPLETED;
                }
            });
        })
    };

    var onPotholeData = function(){
        potholeData=dataPotholeModel.data;
        drawPotholes();
    };

    var init = function() {
        dataPotholeModel.subscribe(Notifications.data.POTHOLE_CHANGED,onPotholeData);
    }();


    return self;
}