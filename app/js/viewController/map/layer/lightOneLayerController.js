function LightOneLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _lightOneData=[];
    var _svgLightsOne=[];

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
        })
    };

    var onLightOneData = function(){
        _lightOneData=dataLight1Model.data;
        drawLightsOne();
    };

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
        dataLight1Model.unsubscribe(Notifications.data.LIGHT_OUT_SINGLE_CHANGED);
        //dataLight1Model.unsubscribe(Notifications.data.LIGHT_OUT_SINGLE_SELECTION_CHANGED);
    };

    var init = function() {
        dataLight1Model.subscribe(Notifications.data.LIGHT_OUT_SINGLE_CHANGED,onLightOneData);
    }();

    return self;
}