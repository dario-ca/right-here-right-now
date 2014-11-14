function CrimeLayerController(name,notification,icon) {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _crimeData=[];
    var _svgCrimes=[];
    var _notification=notification;
    var _iconPath=icon;

    //name of the controller, needed in the switches
    var _name=name;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawCrimes = function(){
        self.hideCrimes();
        _crimeData.forEach(function(d){
            var crimeIcon = self.createIcon(d.latitude, d.longitude,_iconPath);
            _svgCrimes.push(crimeIcon);
            crimeIcon.view.background.style("fill", d.color);
        })
    };

    var onCrimeData = function(){
        switch(_name){
            case "category1":       _crimeData=dataCrimeCategory1Model.data;
                break;
            case "category2":       _crimeData=dataCrimeCategory2Model.data;
                break;
            case "category3":       _crimeData=dataCrimeCategory3Model.data;
                break;
            case "category4":       _crimeData=dataCrimeCategory4Model.data;
                break;
        }
        drawCrimes();
    };

    self.hideCrimes = function(){
        _svgCrimes.forEach(function(d){
            d.dispose();
        });
        _svgCrimes=[];
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideCrimes();
        self.super_dispose();
        switch(_name){
            case "category1":
                        dataCrimeCategory1Model.unsubscribe(Notifications.data.CATEGORY_1);
                        //dataCrimeCategory1Model.unsubscribe(Notifications.data.CATEGORY_1_SELECTION_CHANGED);
                break;
            case "category2":
                        dataCrimeCategory2Model.unsubscribe(Notifications.data.CATEGORY_2);
                        //dataCrimeCategory2Model.unsubscribe(Notifications.data.CATEGORY_2_SELECTION_CHANGED);
                break;
            case "category3":
                        dataCrimeCategory3Model.unsubscribe(Notifications.data.CATEGORY_3);
                        //dataCrimeCategory3Model.unsubscribe(Notifications.data.CATEGORY_3_SELECTION_CHANGED);
                break;
            case "category4":
                        dataCrimeCategory4Model.unsubscribe(Notifications.data.CATEGORY_4);
                        //dataCrimeCategory4Model.unsubscribe(Notifications.data.CATEGORY_4_SELECTION_CHANGED);
                break;
        }
    };

    var init = function() {
        self.view.classed("crime-layer-controller", true);

        switch(_name){
            case "category1":       dataCrimeCategory1Model.subscribe(_notification,onCrimeData);
                break;
            case "category2":       dataCrimeCategory2Model.subscribe(_notification,onCrimeData);
                break;
            case "category3":       dataCrimeCategory3Model.subscribe(_notification,onCrimeData);
                break;
            case "category4":       dataCrimeCategory4Model.subscribe(_notification,onCrimeData);
                break;
        }
    }();

    return self;
}


/**
 *  Helper functions for the different map layers
 */
var Category1CrimeLayerController = function() {
    return CrimeLayerController("category1",Notifications.data.crime.CRIME_CATEGORY1_CHANGED,"resource/sublayer/icon/assault.svg");
};

var Category2CrimeLayerController = function() {
    return CrimeLayerController("category2", Notifications.data.crime.CRIME_CATEGORY2_CHANGED, "resource/sublayer/icon/property.svg");
};

var Category3CrimeLayerController = function() {
    return CrimeLayerController("category3", Notifications.data.crime.CRIME_CATEGORY3_CHANGED, "resource/sublayer/icon/unsafe.svg");
};

var Category4CrimeLayerController = function() {
    return CrimeLayerController("category4", Notifications.data.crime.CRIME_CATEGORY4_CHANGED, "resource/sublayer/icon/other.svg");
};