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
    self._CTAKey = "zWKWa9p6ACYe4uQxTP8Qtjxcv"; // "kv6yHNkUrkZJkjA8u7V5sxNTq"; //"fnWCmHX2a2c6XNm84WFmheDVf";// "zWKWa9p6ACYe4uQxTP8Qtjxcv";
    self._notification = Notifications.data.BUS_CHANGED;
    self.interval = 30000;

    self.busSelected = null;

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
            self.callback(geoFilter(tempData));
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
                vehicles.vehicle.forEach(function(v) {
                    var dir;

                    // Calculate the direction using the angle
                    if(v.hdg > 315 || v.hdg < 135) {
                        dir = 0;
                    }
                    else {
                        dir = 1;
                    }
                    if(line.directions.length == 1) // Only one direction
                        dir = 0;
                    v.stops = line.directions[dir].stops;
                });
                tempData = $.merge(tempData, vehicles.vehicle);
            }
            else {
                var dir;

                // Calculate the direction using the angle
                if(vehicles.vehicle.hdg > 315 || vehicles.vehicle.hdg < 135) {
                    dir = 0;
                }
                else {
                    dir = 1;
                }
                if(line.directions.length == 1) // Only one direction
                    dir = 0;
                vehicles.vehicle.stops = line.directions[dir].stops;
                tempData.push(vehicles.vehicle);
            }

            callback(null, null);
        });
        setTimeout(function(){callback(null, null);}, 5000);    // After five seconds call callback

    };

    self.fetchStaticData = function() {
        fetchRoutes();
    };

    self.getLineStops = function(rt, dir) {
        var stops = [];
        stops.push.apply(stops,
            self._lines.filter(function(line) {
                return line.rt == rt;
            })[0].directions[dir].stops
            );
        return stops;
    };

    self.busClicked = function(bus) {
        if(self.busSelected == null)
            self.busSelected = bus;
        else
            self.busSelected = null;
        self.dispatch(Notifications.data.BUS_SELECTION_CHANGED);
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

            // Use an heuristic for ordering the stations
            //json.route.direction.stops = heuristicStopOrdering(json.route.direction.stops);

            addStop(json);
        });
    };

    /**
     * This function try to order the stops with an heuristic algorithm
     * similar to density based clustering
     * @stops {Array} stop
     */
    var heuristicStopOrdering = function(stops) {
        var maxDistance = 0;
        var maxIndexes = [];

        // Find the two more distant stations
        for(var i in stops) {
            for(var j in stops) {
                if(i == j)
                    continue;

                var stop0 = stops[i];
                var stop1 = stops[j];
                var distance = Math.sqrt(Math.pow(stop0.lat-stop1.lat, 2) +
                                         Math.pow(stop0.lon-stop1.lon, 2));
                if(distance > maxDistance) {
                    maxIndexes = [i, j];
                    maxDistance = distance;
                }
            }
        }

        // If distance == 0 between stops they are already ordered
        if(maxIndexes.length == 0)
            return stops;

        var s = stops.slice();
        var index = maxIndexes[0];
        var orderedStops = [];
        while(s.length > 0) {
            var stop = s.splice(index, 1)[0];
            var minDistance = Number.MAX_VALUE;
            var minIndex = -1;

            // Find the closest stop to the current one
            for(var j in s) {

                var stop1 = s[j];

                if(stop1 == stop)
                    continue;

                var distance = Math.sqrt(Math.pow(stop.lat-stop1.lat, 2) +
                Math.pow(stop.lon-stop1.lon, 2));
                if(distance < minDistance) {
                    minIndex = j;
                    minDistance = distance;
                }
            }

            if(minIndex != -1) {
                orderedStops.push(stop);
                index = minIndex;
            }

        }
        return orderedStops;

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

    /**
     * This function is automatically called for filtering data.
     * @param data to be filtered
     */
    var geoFilter = function(data) {
        var newData = data.filter(function(d) {
            return selectionModel.pointInside([d.lat, d.lon]);
        });

        return newData;
    };

    var init = function() {
        //TODO BUS DISABLED
        //console.warn("bus disabled");
        self.fetchStaticData();

        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.dataRequested);

    }();

    return self;
};

var dataBusModel = DataBusModel();