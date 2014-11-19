/**
 *  Class DataRestaurantModel
 *
 *  This class aggregate the data of the restaurants
 */

var DataRestaurantModel = function() {
    var self = DataModel();

    self._notification = Notifications.data.FOOD_CHANGED;

    self.restaurantSelected=null;


    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////


    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {
        dataYelpRestaurantModel.subscribe(Notifications.data.YELP_RESTAURANT_CHANGED, onDataChanged);
        dataFoodInspection.subscribe(Notifications.data.FOOD_INSPECTION_CHANGED, onDataChanged);
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var onDataChanged = function() {
        var restaurants    = dataYelpRestaurantModel.data;
        var foodInspection = dataFoodInspection.data;

        console.log(restaurants, foodInspection);

        if(restaurants == null)
            return;

        if(foodInspection != null)  // Are present the food inspections
            restaurants.forEach(function(restaurant) {
                var f = foodInspection.filter(function(fi) {
                    return distance([restaurant.location.coordinate.latitude, restaurant.location.coordinate.longitude],
                                     [fi.latitude, fi.longitude]) < 0.0005  /*&&
                                    stringDistance(restaurant.name, fi.aka_name) < 4*/;
                });
                if(f.length > 0) {
                    restaurant["food_inspection"] = f[0];
                    console.log(">>>>Food inspection non passata", restaurant);
                }
            });

        self.callback(restaurants);
    };

    var distance = function(p0, p1) {
        return Math.sqrt((p0[0]-p1[0])*(p0[0]-p1[0]) +
                         (p0[1]-p1[1])*(p0[1]-p1[1]));
    };

    self.restaurantClicked = function(restaurant) {
        if(self.restaurantSelected!==null && self.restaurantSelected.id === restaurant.id){
            self.restaurantSelected=null;
        }else
            self.restaurantSelected = restaurant;
        self.dispatch(Notifications.data.FOOD_SELECTION_CHANGED);
    };


    var init = function() {
        // Initialization functions
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.dataChanged);
    }();

    return self;
};

var dataRestaurantModel = DataRestaurantModel();