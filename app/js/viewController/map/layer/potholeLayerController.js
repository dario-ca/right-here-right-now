function PotholeLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var potholeData=[];
    var svgPotholes=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////

   /* var createIcon = function(latitude, longitude, path){
        var icon = ExternalSvgViewController(path);
        self.view.append(icon);
        icon.view.width =self.defaultIconSize;
        icon.view.height=self.defaultIconSize;

        var position = self.project(latitude, longitude);
        icon.view.x = position.x;
        icon.view.y = position.y;

        return icon;
    };*/

    var drawPotholes = function(){
        //TODO: remove potholes before update, now it removes every pothole
        self.view.html("");
        potholeData.forEach(function(d){
            var potholeIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/pothole.svg");
            svgPotholes.push(potholeIcon);
            potholeIcon.view.background.style("fill",function(){
                if(d.status==dataPotholeModel.status.POTHOLE_OPEN){
                    return Colors.pothole.POTHOLE_OPEN;
                }else if(d.status==dataPotholeModel.status.POTHOLE_OPEN_DUP){
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

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.super_dispose();
        dataPotholeModel.unsubscribe(Notifications.data.POTHOLE_CHANGED);
    };

    var init = function() {
        self.view.classed("pothole-layer-controller", true);
        dataPotholeModel.subscribe(Notifications.data.POTHOLE_CHANGED,onPotholeData);
    }();


    return self;
}