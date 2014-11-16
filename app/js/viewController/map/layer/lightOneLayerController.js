function LightOneLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _lightOneData=[];
    var _svgLightsOne=[];
    var _popup=null;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawLightsOne = function(){
        self.hideLights();
        _lightOneData.forEach(function(d){
            var lightIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/light.svg");
            _svgLightsOne.push(lightIcon);
            lightIcon.view.background.style("fill",function(){
                if(d.status==dataLight1Model.status.LIGHT_ONE_COMPLETED){
                    return Colors.lightOne.LIGHT_ONE_COMPLETED;
                }else if(d.status==dataLight1Model.status.LIGHT_ONE_COMPLETED_DUP){
                    return Colors.lightOne.LIGHT_ONE_COMPLETED_DUP;
                }else if(d.status==dataLight1Model.status.LIGHT_ONE_OPEN) {
                    return Colors.lightOne.LIGHT_ONE_OPEN;
                }else if(d.status==dataLight1Model.status.LIGHT_ONE_OPEN_DUP) {
                    return Colors.lightOne.LIGHT_ONE_OPEN_DUP;
                }
            });
            lightIcon.view.onClick(function(){
                if(dataLight1Model.light1selected!==null)
                    _popup.dispose();
                dataLight1Model.light1Clicked(d);
            });
        })
    };

    var onLightOneData = function(){
        _lightOneData=dataLight1Model.data;
        drawLightsOne();
    };

    var onLight1Selected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataLight1Model.light1selected!==null) {
            _popup = popupLayerController.openPopup(dataLight1Model.light1selected.latitude, dataLight1Model.light1selected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text("Single light Broken: "+dataLight1Model.light1selected.status);
            _popup.view.subtitle.text(dataLight1Model.light1selected.street_address);
        }
    };

    /////////////////////////// PUBLIC METHODS ////////////////////////////


    self.hideLights = function(){
        _svgLightsOne.forEach(function(d){
            d.dispose();
        });
        _svgLightsOne=[];
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideLights();
        self.super_dispose();
        dataLight1Model.unsubscribe(Notifications.data.LIGHT_OUT_SINGLE_CHANGED, onLightOneData);
        dataLight1Model.unsubscribe(Notifications.data.LIGHT_OUT_SINGLE_SELECTION_CHANGED,onLight1Selected);
    };

    var init = function() {
        dataLight1Model.subscribe(Notifications.data.LIGHT_OUT_SINGLE_CHANGED, onLightOneData);
        dataLight1Model.subscribe(Notifications.data.LIGHT_OUT_SINGLE_SELECTION_CHANGED, onLight1Selected);
    }();

    return self;
}