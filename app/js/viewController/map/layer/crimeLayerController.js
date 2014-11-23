function CrimeLayerController(name,notification,icon) {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _crimeData=[];
    var _svgCrimes=[];
    var _notification=notification;
    var _iconPath=icon;

    //name of the controller
    var _name=name;

    var currentCrimeCategoryModel=null;
    var _popup=null;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var giveCurrentCrimeCategoryModel = function(){
        switch(_name) {
            case "category1":
                currentCrimeCategoryModel = dataCrimeCategory1Model;
                self.z_index=4;
                break;
            case "category2":
                currentCrimeCategoryModel = dataCrimeCategory2Model;
                self.z_index=3;
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

            if(_.indexOf(DataCrimeModel.typesDangerLargerCircle, d.primary_type) !== -1){
                self.addDanger(d.latitude, d.longitude,self.defaultIconSize*self.defaultCircleRatio*1.4);
            }

            if(_.indexOf(DataCrimeModel.typesDangerCircle, d.primary_type) !== -1){
                self.addDanger(d.latitude, d.longitude,self.defaultIconSize*self.defaultCircleRatio);
            }
            if(_.indexOf(DataCrimeModel.typeWarningCircle, d.primary_type) !== -1){
                self.addWarning(d.latitude, d.longitude,self.defaultIconSize*self.defaultCircleRatio);
            }

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
        drawCrimes();
    };

    var onCrimeSelected = function() {
        //if they are not clicking on me, I remove my popup if any
        if (DataCrimeModel.popupCategory !== _name && _popup !== null) {
            _popup.dispose();
            currentCrimeCategoryModel.crimeSelected=null;
            _popup=null;
        //if they are clicking on me, I create the popup removing the old one if any
        }else if(DataCrimeModel.popupCategory===_name && (_.indexOf(DataCrimeModel.typesDangerCircle, currentCrimeCategoryModel.crimeSelected.primary_type) === -1) && (_.indexOf(DataCrimeModel.typesDangerLargerCircle, currentCrimeCategoryModel.crimeSelected.primary_type) === -1)&&(_.indexOf(DataCrimeModel.typeWarningCircle, currentCrimeCategoryModel.crimeSelected.primary_type) === -1)){
            if(_popup!==null){
                _popup.dispose();
            }
            _popup = popupLayerController.openPopup(currentCrimeCategoryModel.crimeSelected.latitude, currentCrimeCategoryModel.crimeSelected.longitude, MapPopupType.POPUP_CRIME);
            _popup.view.title.text(currentCrimeCategoryModel.crimeSelected.primary_type);
            _popup.view.subtitle.text(currentCrimeCategoryModel.crimeSelected.block);
        }else if(DataCrimeModel.popupCategory===_name && ((_.indexOf(DataCrimeModel.typesDangerCircle, currentCrimeCategoryModel.crimeSelected.primary_type) !== -1) || (_.indexOf(DataCrimeModel.typesDangerLargerCircle, currentCrimeCategoryModel.crimeSelected.primary_type) !== -1))){
            if(_popup!==null){
                _popup.dispose();
            }
            _popup = popupLayerController.openPopup(currentCrimeCategoryModel.crimeSelected.latitude, currentCrimeCategoryModel.crimeSelected.longitude, MapPopupType.POPUP_CRIME_DANGER);
            _popup.view.title.text(currentCrimeCategoryModel.crimeSelected.primary_type);
            _popup.view.subtitle.text(currentCrimeCategoryModel.crimeSelected.block);
        }else if(DataCrimeModel.popupCategory===_name && (_.indexOf(DataCrimeModel.typeWarningCircle, currentCrimeCategoryModel.crimeSelected.primary_type) !== -1)){
            if(_popup!==null){
                _popup.dispose();
            }
            _popup = popupLayerController.openPopup(currentCrimeCategoryModel.crimeSelected.latitude, currentCrimeCategoryModel.crimeSelected.longitude, MapPopupType.POPUP_CRIME_WARNING);
            _popup.view.title.text(currentCrimeCategoryModel.crimeSelected.primary_type);
            _popup.view.subtitle.text(currentCrimeCategoryModel.crimeSelected.block);
        }

    };

    self.hideCrimes = function(){
        _svgCrimes.forEach(function(d){
            d.dispose();
        });
        if(_popup!==null){
            _popup.dispose();
        }
        self.clear();
        _svgCrimes=[];
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideCrimes();
        self.super_dispose();

        currentCrimeCategoryModel.unsubscribe(_notification, onCrimeData);
        notificationCenter.unsubscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED, onCrimeSelected);

    };

    var init = function() {
        self.view.classed("crime-layer-controller", true);

        giveCurrentCrimeCategoryModel();
        currentCrimeCategoryModel.subscribe(_notification, onCrimeData);
        notificationCenter.subscribe(Notifications.data.crime.CRIME_SELECTION_CHANGED, onCrimeSelected);

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