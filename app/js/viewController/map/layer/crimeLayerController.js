function CrimeLayerController(name,notification,icon) {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _crimeData=[];
    var _svgCrimes=[];
    var _notification=notification;
    var _iconPath=icon;

    //name of the controller, needed in the switches
    var _name=name;

    var currentCrimeCategoryModel=null;
    var _popup=null;


    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var giveCurrentCrimeCategoryModel = function(){
        switch(_name) {
            case "category1":
                currentCrimeCategoryModel = dataCrimeCategory1Model;
                break;
            case "category2":
                currentCrimeCategoryModel = dataCrimeCategory2Model;
                break;
            case "category3":
                currentCrimeCategoryModel = dataCrimeCategory3Model;
                break;
            case "category4":
                currentCrimeCategoryModel = dataCrimeCategory4Model;
                break;
        }
    };

    var drawCrimes = function(){
        self.hideCrimes();
        _crimeData.forEach(function(d){
            var crimeIcon = self.createIcon(d.latitude, d.longitude,_iconPath);
            _svgCrimes.push(crimeIcon);
            crimeIcon.view.background.style("fill", d.color);
            crimeIcon.view.onClick(function() {
                //if I am clicking on the same popup, remove it
                if (currentCrimeCategoryModel.crimeSelected !== null && currentCrimeCategoryModel.crimeSelected.id === d.id && _popup !== null){
                    _popup.dispose();
                    _popup=null;
                    currentCrimeCategoryModel.crimeClicked(null,null);
                }else{
                    currentCrimeCategoryModel.crimeClicked(d,_name);
                }
            });
        })
    };


    var onCrimeData = function(){
        _crimeData=currentCrimeCategoryModel.data;
        /*switch(_name){
            case "category1":       _crimeData=dataCrimeCategory1Model.data;
                break;
            case "category2":       _crimeData=dataCrimeCategory2Model.data;
                break;
            case "category3":       _crimeData=dataCrimeCategory3Model.data;
                break;
            case "category4":       _crimeData=dataCrimeCategory4Model.data;
                break;
        }*/
        drawCrimes();
    };

    //TODO:big problem, never entered first condition, problem with notifications I think
    var onCrimeSelected = function() {
        //console.log("I am controller of: "+_name+", and categoryOfPopup is: "+DataCrimeModel.popupCategory);
        //if they are not clicking on me, I remove my popup if any
        if (DataCrimeModel.popupCategory !== _name && _popup !== null) {
            _popup.dispose();
            currentCrimeCategoryModel.crimeSelected=null;
            _popup=null;
        //if they are clicking on me, I create the popup removing the old one if any
        }else if(DataCrimeModel.popupCategory===_name){
            if(_popup!==null){
                _popup.dispose();
            }
            _popup = popupLayerController.openPopup(currentCrimeCategoryModel.crimeSelected.latitude, currentCrimeCategoryModel.crimeSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(_name);
            _popup.view.subtitle.text(currentCrimeCategoryModel.crimeSelected.id);
        }

        /*if(_popup!==null){
            console.log(_popup);
            _popup.dispose();
        }
        if(currentCrimeCategoryModel.crimeSelected!==null && DataCrimeModel.popupCategory===_name) {
            console.log(DataCrimeModel.popupCategory);
            _popup = popupLayerController.openPopup(currentCrimeCategoryModel.crimeSelected.latitude, currentCrimeCategoryModel.crimeSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(_name);
            _popup.view.subtitle.text(currentCrimeCategoryModel.crimeSelected.id);
        }*/
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
                        dataCrimeCategory1Model.unsubscribe(Notifications.data.crime.CRIME_CATEGORY1_CHANGED);
                        dataCrimeCategory1Model.unsubscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED);
                break;
            case "category2":
                        dataCrimeCategory2Model.unsubscribe(Notifications.data.crime.CRIME_CATEGORY2_CHANGED);
                        dataCrimeCategory2Model.unsubscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED);
                break;
            case "category3":
                        dataCrimeCategory3Model.unsubscribe(Notifications.data.crime.CRIME_CATEGORY3_CHANGED);
                        dataCrimeCategory3Model.unsubscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED);
                break;
            case "category4":
                        dataCrimeCategory4Model.unsubscribe(Notifications.data.crime.CRIME_CATEGORY4_CHANGED);
                        dataCrimeCategory4Model.unsubscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED);
                break;
        }
    };

    var init = function() {
        self.view.classed("crime-layer-controller", true);

        giveCurrentCrimeCategoryModel();
        //console.log(currentCrimeCategoryModel);
        //console.log("I am controller of: "+_name+", I am alive!");

        switch(_name){
            case "category1":
                {
                    dataCrimeCategory1Model.subscribe(_notification, onCrimeData);
                    dataCrimeCategory1Model.subscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED, onCrimeSelected);
                }break;
            case "category2":
                {
                    dataCrimeCategory2Model.subscribe(_notification, onCrimeData);
                    dataCrimeCategory2Model.subscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED, onCrimeSelected);
                }break;
            case "category3":
                {
                    dataCrimeCategory3Model.subscribe(_notification, onCrimeData);
                    dataCrimeCategory3Model.subscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED, onCrimeSelected);
                }break;
            case "category4":
                {
                    dataCrimeCategory4Model.subscribe(_notification, onCrimeData);
                    dataCrimeCategory4Model.subscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED, onCrimeSelected);
                }break;
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