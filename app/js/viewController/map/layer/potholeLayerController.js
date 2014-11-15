function PotholeLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _potholeData=[];
    var _svgPotholes=[];
    var _popup=null;

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
        self.hidePotholes();
        _potholeData.forEach(function(d){
            var potholeIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/pothole.svg");
            _svgPotholes.push(potholeIcon);
            potholeIcon.view.background.style("fill",function(){
                if(d.status==dataPotholeModel.status.POTHOLE_OPEN){
                    return Colors.pothole.POTHOLE_OPEN;
                }else if(d.status==dataPotholeModel.status.POTHOLE_OPEN_DUP){
                    return Colors.pothole.POTHOLE_OPEN_DUP;
                }else{
                    return Colors.pothole.POTHOLE_COMPLETED;
                }
            });
            potholeIcon.view.onClick(function(){
                if(dataPotholeModel.potholeSelected!==null)
                    _popup.dispose();
                dataPotholeModel.potholeClicked(d);
            });
        })
    };

    var onPotholeSelected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataPotholeModel.potholeSelected!==null) {
            _popup = popupLayerController.openPopup(dataPotholeModel.potholeSelected.latitude, dataPotholeModel.potholeSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(dataPotholeModel.potholeSelected.type_of_service_request+": "+dataPotholeModel.potholeSelected.status);
            _popup.view.subtitle.text(dataPotholeModel.potholeSelected.street_address);
        }
    };

    var onPotholeData = function(){
        _potholeData=dataPotholeModel.data;
        drawPotholes();
    };

    self.hidePotholes = function(){
        _svgPotholes.forEach(function(d){
            d.dispose();
        });
        _svgPotholes=[];
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hidePotholes();
        self.super_dispose();
        dataPotholeModel.unsubscribe(Notifications.data.POTHOLE_CHANGED);
        dataPotholeModel.unsubscribe(Notifications.data.POTHOLE_SELECTION_CHANGED);
    };

    var init = function() {
        self.view.classed("pothole-layer-controller", true);
        dataPotholeModel.subscribe(Notifications.data.POTHOLE_CHANGED,onPotholeData);
        dataPotholeModel.subscribe(Notifications.data.POTHOLE_SELECTION_CHANGED, onPotholeSelected);
    }();


    return self;
}