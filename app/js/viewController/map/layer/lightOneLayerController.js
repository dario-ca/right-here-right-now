function LightOneLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var lightOneData=[];
    var svgLightsOne=[];

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawLightsOne = function(){
        //TODO: remove lights before update, now it removes every light
        self.view.html("");
        lightOneData.forEach(function(d){
            var lightIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/light.svg");
            svgLightsOne.push(lightIcon);
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
        lightOneData=dataLight1Model.data;
        drawLightsOne();
    };

    var init = function() {
        dataLight1Model.subscribe(Notifications.data.LIGHT_OUT_SINGLE_CHANGED,onLightOneData);
    }();

    return self;
}