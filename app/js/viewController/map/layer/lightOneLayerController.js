function LightOneLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _name=dataLight1Model.name;
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
            /*lightIcon.view.onClick(function(){
                if(dataLight1Model.light1selected!==null)
                    _popup.dispose();
                dataLight1Model.light1Clicked(d);
            });*/
            lightIcon.view.onClick(function() {
                //if I am clicking on the same popup, remove it
                if (dataLight1Model.lightSelected !== null && dataLight1Model.lightSelected.service_request_number === d.service_request_number && _popup !== null){
                    _popup.dispose();
                    _popup=null;
                    dataLight1Model.lightClicked(null,null);
                }else{
                    dataLight1Model.lightClicked(d,_name);
                }
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

    var onLightSelected = function() {
        //if they are not clicking on me, I remove my popup if any
        if (Data311Model.lightPopup !== _name && _popup !== null) {
            _popup.dispose();
            dataLight1Model.lightSelected=null;
            _popup=null;
            //if they are clicking on me, I create the popup removing the old one if any
        }else if(Data311Model.lightPopup===_name){
            if(_popup!==null){
                _popup.dispose();
            }
            _popup = popupLayerController.openPopup(dataLight1Model.lightSelected.latitude, dataLight1Model.lightSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text("Single light Broken: "+dataLight1Model.lightSelected.status);
            _popup.view.subtitle.text(dataLight1Model.lightSelected.street_address);
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
        notificationCenter.unsubscribe(Notifications.data.LIGHT_SELECTION_CHANGED,onLightSelected);
    };

    var init = function() {
        dataLight1Model.subscribe(Notifications.data.LIGHT_OUT_SINGLE_CHANGED, onLightOneData);
        notificationCenter.subscribe(Notifications.data.LIGHT_SELECTION_CHANGED, onLightSelected);
    }();

    return self;
}