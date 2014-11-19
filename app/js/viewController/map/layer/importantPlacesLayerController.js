function ImportantPlacesLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _placesData=[];
    var _svgPlaces=[];
    var _popup=null;


    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var drawPlaces = function(){
        self.hidePlaces();
        _placesData.forEach(function(d){
            var placeIcon = self.createIcon(d.latitude, d.longitude,"resource/sublayer/icon/important-place.svg");
            _svgPlaces.push(placeIcon);

            placeIcon.view.onClick(function(){
                if(dataImportantPlacesModel.placeSelected!==null)
                    _popup.dispose();
                dataImportantPlacesModel.placeClicked(d);

                // Add the point to the selection
                if(selectionModel.selectionMode == SelectionMode.SELECTION_PATH) {
                    selectionModel.addPoint([d.latitude, d.longitude]);
                }
            });
        })
    };

    var onPlaceData = function(){
        _placesData=dataImportantPlacesModel.data;
        drawPlaces();
    };

    self.hidePlaces = function(){
        if(_popup!==null){
            _popup.dispose();
            dataImportantPlacesModel.placeSelected=null;
        }
    };

    var onPlaceSelected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataImportantPlacesModel.placeSelected!==null) {
            _popup = popupLayerController.openPopup(dataImportantPlacesModel.placeSelected.latitude, dataImportantPlacesModel.placeSelected.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(dataImportantPlacesModel.placeSelected.name);
            _popup.view.subtitle.text(dataImportantPlacesModel.placeSelected.address);
        }
    };

    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hidePlaces();
        self.super_dispose();
        dataImportantPlacesModel.unsubscribe(Notifications.data.PLACE_CHANGED, onPlaceData);
        dataImportantPlacesModel.unsubscribe(Notifications.data.PLACE_SELECTION_CHANGED, onPlaceSelected);
    };

    var init = function() {
        dataImportantPlacesModel.subscribe(Notifications.data.PLACE_CHANGED, onPlaceData);
        dataImportantPlacesModel.subscribe(Notifications.data.PLACE_SELECTION_CHANGED, onPlaceSelected);
    }();

    return self;
}