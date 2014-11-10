/**
 *  Class DataDivvyModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataDivvyModel = function(name) {
    var self = DataModel();

    self._divvyURL = "http://www.divvybikes.com/stations/json/";
    self._notification = Notifications.data.DIVVY_BIKES_CHANGED;
    self.interval = 30000;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {
        d3.json(self._proxyURL + self._divvyURL, function(error, json) {
            if(error) {
                console.log("Error downloading the file "+self._divvyURL);
                return;
            }
            self.callback(geoFilter(json.stationBeanList));
        });
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    /**
     * This function is automatically called for filtering data.
     * @param data to be filtered
     */
    var geoFilter = function(data) {
        var newData = data.filter(function(d) {
            //console.log([d.latitude, d.longitude]);
            //console.log(selectionModel.pointInside([d.latitude, d.longitude]));
            return selectionModel.pointInside([d.latitude, d.longitude]);
        });

        return newData;
    };

    var init = function() {

        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.dataChanged);

    }();

    return self;
};

var dataDivvyModel = DataDivvyModel();