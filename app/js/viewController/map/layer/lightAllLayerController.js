function LightAllLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _name= dataLightsAllModel.name;
    var _lightAllData=[];
    var _svgLightsAll=[];
    var _popup=null;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawLightsAll = function(){
        self.hideLights();
        _lightAllData.forEach(function(d){
            var lightIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/light.svg");
            _svgLightsAll.push(lightIcon);
            lightIcon.view.background.style("fill",function(){
                if(d.status==dataLightsAllModel.status.LIGHT_ALL_COMPLETED){
                    return Colors.lightAll.LIGHT_ALL_COMPLETED;
                }else if(d.status==dataLightsAllModel.status.LIGHT_ALL_COMPLETED_DUP){
                    return Colors.lightAll.LIGHT_ALL_COMPLETED_DUP;
                }else if(d.status==dataLightsAllModel.status.LIGHT_ALL_OPEN) {
                    return Colors.lightAll.LIGHT_ALL_OPEN;
                }else if(d.status==dataLightsAllModel.status.LIGHT_ALL_OPEN_DUP) {
                    return Colors.lightAll.LIGHT_ALL_OPEN_DUP;
                }
            });
            self.addWarning(d.latitude, d.longitude,self.defaultIconSize*self.defaultCircleRatio);
            lightIcon.view.onClick(function() {
                //if I am clicking on the same popup, remove it
                if (dataLightsAllModel.lightSelected !== null && dataLightsAllModel.lightSelected.service_request_number === d.service_request_number && _popup !== null){
                    _popup.dispose();
                    _popup=null;
                    dataLightsAllModel.lightClicked(null,null);
                }else{
                    dataLightsAllModel.lightClicked(d,_name);
                }
            });
        })
    };

    var onLightAllData = function(){
        _lightAllData=dataLightsAllModel.data;
        drawLightsAll();
    };

    var onLightSelected = function() {
        //if they are not clicking on me, I remove my popup if any
        if (Data311Model.lightPopup !== _name && _popup !== null) {
            _popup.dispose();
            dataLightsAllModel.lightSelected=null;
            _popup=null;
            //if they are clicking on me, I create the popup removing the old one if any
        }else if(Data311Model.lightPopup===_name){
            if(_popup!==null){
                _popup.dispose();
            }
            _popup = popupLayerController.openPopup(dataLightsAllModel.lightSelected.latitude, dataLightsAllModel.lightSelected.longitude, MapPopupType.POPUP_WARNING);
            _popup.view.title.text("Lights broken: "+dataLightsAllModel.lightSelected.status);
            _popup.view.warning.text("All street lights");
            _popup.view.subtitle.text(dataLightsAllModel.lightSelected.street_address);
        }

    };

    /////////////////////////// PUBLIC METHODS ////////////////////////////


    self.hideLights = function(){
        _svgLightsAll.forEach(function(d){
            d.dispose();
        });
        _svgLightsAll=[];
    };

    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideLights();
        self.super_dispose();
        dataLightsAllModel.unsubscribe(Notifications.data.LIGHT_OUT_ALL_CHANGED, onLightAllData);
        notificationCenter.unsubscribe(Notifications.data.LIGHT_SELECTION_CHANGED,onLightSelected);
    };

    var init = function() {
        dataLightsAllModel.subscribe(Notifications.data.LIGHT_OUT_ALL_CHANGED, onLightAllData);
        notificationCenter.subscribe(Notifications.data.LIGHT_SELECTION_CHANGED, onLightSelected);
    }();

    return self;
}