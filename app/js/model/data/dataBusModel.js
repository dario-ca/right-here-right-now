/**
 *  Class DataBusModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataBusModel = function(name) {
    var self = DataModel();

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////

    self._stops = [];

    ////////////////////////// PUBLIC ATTRIBUTES //////////////////////////

    self._routesURL = "http://www.ctabustracker.com/bustime/api/v1/getroutes";
    self._directionURL = "http://www.ctabustracker.com/bustime/api/v1/getdirections";
    self._stopURL = "http://www.ctabustracker.com/bustime/api/v1/getstops";
    self._CTAKey = "zWKWa9p6ACYe4uQxTP8Qtjxcv";
    self._notification = Notifications.data.BUS_CHANGED;
    self.interval = 30000;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {

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
            for(var i in directions) {
                var dir = directions[i].dir;
                fetchStop(rt, dir);
            }
        });
    };

    var fetchStop = function(rt, dir) {
        d3.xml(self._stopURL + "&key=" + self._CTAKey + "&rt=" + rt + "&dir=" + dir, function(error, xml) {
            if(error) {
                // Error handling
                return;
            }
            var stops = xmlToJs(xml.lastChild.outerHTML);

            // Add the stop to stops
            var json = {};
            json.route.rt = rt;
            json.route.direction.dir = dir;
            json.route.direction.stops = stops["bustime-response"];
            addStop(json);
        });
    };

    var addStop = function(direction) {
        var route = self._stops.filter(function(stop) {
            return stop.route.rt        == direction.route.rt;
        });

        if(route != null) { // If the route already exists
            route.directions.push(direction.route.direction);
        }
        else {              // The route doesn't exists
            var route = {};
            route.rt = direction.route.rt;
            route.directions = [];
            route.directions.push(direction.route.direction);
            self._stops.push(route);
        }
    };

    return self;
};

var dataBusModel = DataBusModel();