var Notifications = Notifications || {};

Notifications.layer = {
    SUBLAYER_SELECTION_CHANGED: "layer.SUBLAYER_SELECTION_CHANGED",
    LAYER_SELECTION_CHANGED: "layer.LAYER_SELECTION_CHANGED"
};

Notifications.data = {
    GENERIC_DATA_CHANGED: "data.GENERIC_DATA_CHANGED",
    POTHOLE_CHANGED: "data.POTHOLE_CHANGED",
    ABANDONED_VEHICLES_CHANGED: "data.ABANDONED_VEHICLES_CHANGED",
    LIGHT_OUT_SINGLE_CHANGED: "data.LIGHT_OUT_SINGLE_CHANGED",
    LIGHT_OUT_ALL_CHANGED: "data.LIGHT_OUT_SINGLE_CHANGED",
    DIVVY_BIKES_CHANGED: "data.DIVVY_BIKES_CHANGED",
    BUS_CHANGED: "data.BUS_CHANGED",
    BUS_SELECTION_CHANGED: "data.BUS_SELECTION_CHANGED",
    WEATHER_CHANGED: "data.WEATHER_CHANGED",
    /// CRIME notification
    CRIME_CHANGED: "data.CRIME_CHANGED", //Crime relative current selection updated
    CRIME_MONTH_TOTAL_CHANGED: "data.CRIME_MONTH_TOTAL_CHANGED", //Trend total Crime last 5 years relative current Selection with granularity month
    CRIME_MONTH_TYPE_CHANGED: "data.CRIME_MONTH_TOTAL_CHANGED", //Trend Crime last 5 years grouped by type relative current Selection with granularity month

    // For future uses
    YELP_FOOD_CHANGED: "data.YELP_FOOD_CHANGED",
    TWITTER_CHANGED: "data.TWITTER_CHANGED",
    FOOD_INSPECTION_CHANGED: "data.FOOD_INSPECTION_CHANGED",
    TRAFFIC_CONGESTION_CHANGED: "data.TRAFFIC_CONGESTION_CHANGED"
};

Notifications.selection = {
    SELECTION_CHANGED: "selection.SELECTION_CHANGED"
};


