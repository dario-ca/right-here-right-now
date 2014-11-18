/**
 *  Class DataGoogleDirectionModel
 *
 *  This class fetch the data of the directions provided by Google
 */

DataGoogleDirectionMode = {
    DRIVING: "driving",
    WALKING: "walking",
    BICYCLING: "bicycling",
    TRANSIT: "transit"
};

var DataGoogleDirectionModel = function(name) {
    var self = DataModel();

    self._key = "AIzaSyDlLNlABzcEMFAq45rokkTnjXRpkziGs4I";
    self._googleDirectionURL = "https://maps.googleapis.com/maps/api/directions/json";
    self._notification = Notifications.data.DIRECTION_CHANGED;
    self.interval = 0;
    self.duplicateCheck = false;    // Send notification every time new data arrive

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.mode = DataGoogleDirectionMode.DRIVING;

    self.fetchData = function() {
        // Discover the new coordinates
        var coordinates = selectionModel.selectedPoints;

        if(coordinates.length < 2)
            return; // Can't take the direction with only one point

        var origin =      "" + coordinates[0][0] + "," + coordinates[0][1];
        var waypoints = "";
        for(var i=1; i<coordinates.length - 1; i++) {
            var coordinate = coordinates[i];

            if(waypoints != "")
                waypoints += "|";

            waypoints += coordinate[0] + "," + coordinate[1];
        }
        var destination = "" + coordinates[coordinates.length - 1][0] + ","+coordinates[coordinates.length - 1][1];

        /*
        var origin = "41.8719273,-87.6511568";
        var destination = "41.8758623,-87.6207177";
        */

        var query;
        if(waypoints == "")
            query = "&origin=" + origin + "&mode=" + self.mode + "&destination=" + destination + "&key=" + self._key;
        else
            query = "&origin=" + origin + "&mode=" + self.mode + "&destination=" + destination + "&waypoints=" + waypoints + "&key=" + self._key;

        d3.json(self._proxyURL + self._googleDirectionURL + query, function(error, json) {
            if(error) {
                console.log("Error downloading the file "+ self._googleDirectionURL + query);
                return;
            }
            if(json.status == "OK")
                self.callback(json.routes);
        });
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var init = function() {

        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_PATH_CHANGED, self.fetchData);

    }();

    return self;
};

var dataGoogleDirectionModel = DataGoogleDirectionModel();

selectionModel.subscribeToGoogleDirections();