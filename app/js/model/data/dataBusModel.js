/**
 *  Class DataBusModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataBusModel = function(name) {
    var self = DataModel();

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////

    self._lines = [];

    ////////////////////////// PUBLIC ATTRIBUTES //////////////////////////

    self._routesURL = "http://www.ctabustracker.com/bustime/api/v1/getroutes";
    self._directionURL = "http://www.ctabustracker.com/bustime/api/v1/getdirections";
    self._stopURL = "http://www.ctabustracker.com/bustime/api/v1/getstops";
    self._vehicleURL = "http://www.ctabustracker.com/bustime/api/v1/getvehicles";
    self._CTAKey = "kv6yHNkUrkZJkjA8u7V5sxNTq"; //"fnWCmHX2a2c6XNm84WFmheDVf";// "zWKWa9p6ACYe4uQxTP8Qtjxcv";
    self._notification = Notifications.data.BUS_CHANGED;
    self.interval = 30000;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    /*
     * Fetch all the busses in the selected area
     */
    self.fetchData = function() {
        var lines = self._lines.filter(function(line){
                        return line.directions.filter(function(direction) {
                                    return direction.stops.filter(function(stop) {
                                                return selectionModel.pointInside([stop.lat, stop.lon]);
                                            }).length > 0;
                               }).length > 0;
                    });


        // Temporary data
        var tempData = [];

        var q = queue(15);

        // Fetch all the busses for all the bus lines
        for(var i in lines) {
            var line = lines[i];

            q.defer(function(callback){ self.fetchVehicle(callback, line, tempData); });   // Add the function to the queue
        }

        // When all data arrived call that callback
        q.await(function() {
            self.callback(tempData);
        });
    };

    self.fetchVehicle = function(callback, line, tempData) {
        d3.xml(self._proxyURL + self._vehicleURL + "&key=" + self._CTAKey + "&rt=" + line.rt, function(error, xml) {
            if (error) {
                // Error handling
                callback(null, null);
                return;
            }

            var vehicles = xmlToJs(xml.lastChild.outerHTML)["bustime-response"];

            if (vehicles.hasOwnProperty("error")) {
                callback(null, null);
                return; // An error is occurred
            }

            if (Object.prototype.toString.call(vehicles.vehicle) === '[object Array]') {
                tempData = $.merge(tempData, vehicles.vehicle);
            }
            else {
                tempData.push(vehicles.vehicle);
            }

            callback(null, null);
        });
        setTimeout(function(){callback(null, null);}, 5000);    // After five seconds call callback

    };

    self.fetchStaticData = function() {
        fetchRoutes();
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var xmlToJs = function(xml) {
        var x2js = new X2JS();
        return x2js.xml_str2json( xml );
    };

    var fetchRoutes = function() {
        d3.xml(self._proxyURL + self._routesURL + "&key=" + self._CTAKey, function(error, xml) {
            if(error) {
                // Error handling
                return;
            }
            var routes = xmlToJs(xml.lastChild.outerHTML)["bustime-response"]["route"];
            for(var i in routes) {
                var route = routes[i];
                fetchDirection(route.rt);
            }
        });
    };

    var fetchDirection = function(rt) {
        d3.xml(self._proxyURL + self._directionURL + "&key=" + self._CTAKey + "&rt=" + rt, function(error, xml) {
            if(error) {
                // Error handling
                return;
            }
            var directions = xmlToJs(xml.lastChild.outerHTML)["bustime-response"]["dir"];
            if( Object.prototype.toString.call( directions ) === '[object Array]' ) {
                for (var i in directions) {
                    var dir = directions[i];

                    if (dir == null)
                        return;

                    fetchStop(rt, dir);
                }
            }
            else {
                fetchStop(rt, directions);
            }
        });
    };

    var fetchStop = function(rt, dir) {
        d3.xml(self._proxyURL + self._stopURL + "&key=" + self._CTAKey + "&rt=" + rt + "&dir=" + dir, function(error, xml) {
            if(error) {
                // Error handling
                return;
            }
            var stops = xmlToJs(xml.lastChild.outerHTML)["bustime-response"]["stop"];

            // Add the stop to stops
            var json = {};
            json.route = {};
            json.route.rt = rt;
            json.route.direction = {};
            json.route.direction.dir = dir;
            if( Object.prototype.toString.call( stops ) === '[object Array]' ) {
                json.route.direction.stops = stops; // Is an array
            }
            else {
                json.route.direction.stops = [stops];
            }
            addStop(json);
        });
    };

    var addStop = function(direction) {
        var route = self._lines.filter(function(stop) {
            return stop.rt == direction.route.rt;
        });

        if(route.length > 0) { // If the route already exists
            route[0].directions.push(direction.route.direction);
        }
        else {              // The route doesn't exists
            var route = {};
            route.rt = direction.route.rt;
            route.directions = [];
            route.directions.push(direction.route.direction);
            self._lines.push(route);
        }
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
        self.fetchStaticData();

        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.startFetching);

    }();

    return self;
};

var dataBusModel = DataBusModel();