function RestaurantLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _restaurantData=[];
    var _svgRestaurants=[];
    var _popup=null;


    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var drawRestaurant = function(){
        self.hideRestaurants();
        _restaurantData.forEach(function(d){
            var restaurantIcon = self.createIcon(d.location.coordinate.latitude, d.location.coordinate.longitude,"resource/sublayer/icon/restaurant.svg");
            _svgRestaurants.push(restaurantIcon);

            if(d.food_inspection !== undefined) {
                self.addWarning(d.location.coordinate.latitude, d.location.coordinate.longitude,self.defaultIconSize*self.defaultCircleRatio);
            }

            restaurantIcon.view.onClick(function(){
                if(dataRestaurantModel.restaurantSelected!==null)
                    _popup.dispose();
                console.log(d);
                dataRestaurantModel.restaurantClicked(d);
            });
        })
    };

    var onRestaurantData = function(){
        _restaurantData=dataRestaurantModel.data;
        drawRestaurant();
    };

    self.hideRestaurants = function(){
        _svgRestaurants.forEach(function(d){
            d.dispose();
        });
        _svgRestaurants=[];
    };

    var onRestaurantSelected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataRestaurantModel.restaurantSelected!==null) {
            _popup = popupLayerController.openPopup(dataRestaurantModel.restaurantSelected.location.coordinate.latitude, dataRestaurantModel.restaurantSelected.location.coordinate.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(dataRestaurantModel.restaurantSelected.name);
            _popup.view.subtitle.text(dataRestaurantModel.restaurantSelected.location.display_address[0]);
        }
    };

    //TODO:check implementation of unsubscribe
    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideRestaurants();
        self.super_dispose();
        dataRestaurantModel.unsubscribe(Notifications.data.FOOD_CHANGED, onRestaurantData);
        dataRestaurantModel.unsubscribe(Notifications.data.FOOD_SELECTION_CHANGED, onRestaurantSelected);
    };

    var init = function() {
        dataRestaurantModel.subscribe(Notifications.data.FOOD_CHANGED, onRestaurantData);
        dataRestaurantModel.subscribe(Notifications.data.FOOD_SELECTION_CHANGED, onRestaurantSelected);
    }();

    return self;
}