/**
 *  Class DataYelpModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataImportantPlaceModel = function(notification, term) {
    var self = DataModel();

    self._notification = notification;
    self.interval = 0;

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////

    var tempData;   // Contains the partial data

    self.placeSelected=null;


    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {

        tempData = [];  // Contains the partial data

        d3.json("data/important_places.json",function(json) {

            json.forEach(function(place){
                tempData.push(place);
            });

            self.callback(tempData);
        });
    };

    self.placeClicked = function(place) {
        if(self.placeSelected!==null && self.placeSelected.id === place.id){
            self.placeSelected=null;
        }else
            self.placeSelected = place;
        self.dispatch(Notifications.data.PLACE_SELECTION_CHANGED);
    };


    var init = function() {

        //TODO:pay attention to subscription, important places has to remain on map always if selected
        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.dataChanged);

    }();

    return self;
};

var dataImportantPlacesModel = DataImportantPlaceModel(Notifications.data.PLACE_CHANGED, "importantPlace");
