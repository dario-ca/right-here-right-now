function CrimeLayerController(name,notification,icon) {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var crimeData=[];
    var svgCrimes=[];
    var _notification=notification;
    var _iconPath=icon;

    //name of the controller, needed in the switches
    var _name=name;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawCrimes = function(){
        //TODO: remove crimes before update, now it removes every crime
        self.view.html("");
        crimeData.forEach(function(d){
            var crimeIcon = self.createIcon(d.latitude, d.longitude,_iconPath);
            svgCrimes.push(crimeIcon);
            crimeIcon.view.background.style("fill", d.color);
        })
    };

    var onCrimeData = function(){
        switch(_name){
            case "category1":       crimeData=dataCrimeCategory1Model.data;
                break;
            case "category2":       crimeData=dataCrimeCategory2Model.data;
                break;
            case "category3":       crimeData=dataCrimeCategory3Model.data;
                break;
            case "category4":       crimeData=dataCrimeCategory4Model.data;
                break;
        }
        drawCrimes();
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