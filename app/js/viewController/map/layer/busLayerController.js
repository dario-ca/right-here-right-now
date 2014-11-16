function BusLayerController() {
    var self = MapLayerController();

    var busRouteLayers = [];

    /**
     * Display the bus route
     * @param rt: bus line number
     */
    // TODO: delete commented code
    /*
    self.displayBusRoute = function(rt, dir) {

        var stops = dataBusModel.getLineStops(rt, dir);
        var latLon = [];
        stops.forEach(function(stop) {
            latLon.push(L.latLng(stop.lat, stop.lon));
        });

        var routeLayer = L.Routing.control({
            plan: L.Routing.plan(latLon,
                { waypointIcon: L.icon({
                    iconUrl: "resource/sublayer/icon/bus_stop.png",
                    iconAnchor: L.point(12, 41)
                })
            }),
            fitSelectedRoutes: false,
            lineOptions: {
                styles: [
                    {color: 'black', opacity: 0, weight: 0},
                    {color: 'blue', opacity: 0, weight: 0},
                    {color: 'red', opacity: 0, weight: 2}
                ]
            }
        });
        var map = mapModel.getLeafletMap();
        map.addLayer(routeLayer);
    };
    */

    /**
     * Display the bus stops
     * @param stops
     */
    self.displayBusRoute = function(stops) {

        stops.forEach(function(stop) {
            // TODO: add the bus stop icon
            var busStop = self.createIcon(stop.lat, stop.lon, "resource/sublayer/icon/bus.svg");

            self.view.append(busStop);
            busRouteLayers.push(busStop);
        });

        // TODO: delete commented code
        /*
        // Extract latitude and longitude
        var latLon = [];
        stops.forEach(function(stop) {
            latLon.push(L.latLng(stop.lat, stop.lon));
        });

        var routeLayer = L.Routing.control({
            plan: L.Routing.plan(latLon,
                { waypointIcon: L.icon({
                    iconUrl: "resource/sublayer/icon/bus_stop.png",
                    iconAnchor: L.point(12, 41)
                    }),
                draggableWaypoints: false,
                addWaypoints: false
            }),
            fitSelectedRoutes: false,
            lineOptions: {
                styles: [
                    {color: 'black', opacity: 0, weight: 0},
                    {color: 'blue', opacity: 0, weight: 0},
                    {color: 'red', opacity: 0, weight: 0}
                ]
            }
        });
        var map = mapModel.getLeafletMap();
        map.addLayer(routeLayer);
        busRouteLayers.push(routeLayer);
        */
    };

    self.hideBusRoutes = function() {
        busRouteLayers.forEach(function(busStop) {
            busStop.dispose();
        });
        busRouteLayers = [];
    };

    var onBusData = function() {
        self.clear();  // Remove warnings and dangers

        // Remove all busses
        self.children.forEach( function(child) {
            if(child.vehicle != undefined) {  // It is a bus
                //child.dispose();
                child.displayed = false;
            }
        });
        //self.children = [];

        // Takes all bus data
        vehicles = dataBusModel.data;
        vehicles.forEach(function(vehicle) {
            var bus = null;// ExternalSvgViewController("resource/sublayer/icon/bus.svg");

            // Retrieve the bus contoller that have vehicle.vid
            var busses = self.children.filter(function(b) {
                if(b.vehicle == undefined)
                    return false;
                return b.vehicle.vid == vehicle.vid;
            });

            if(busses.length > 0) {
                bus = busses[0];
                bus.displayed = true;

                var p = self.project(vehicle.lat, vehicle.lon);
                bus.view
                    .transition()
                    .attr("x", p.x)
                    .attr("y", p.y)
                    .duration(1000);
            }
            else {
                bus = self.createIcon(vehicle.lat, vehicle.lon, "resource/sublayer/icon/bus.svg");

            }



            bus.vehicle = vehicle;

            bus.view.busNumber.text(vehicle.rt);

            self.view.append(bus);

            // Eventually add a warning if the vehicle is delayed
            if(vehicle.dly != undefined || 1==1) {
                self.addWarning(vehicle.lat, vehicle.lon, 0.8);
            }

            // Add the interaction on
            bus.view.onClick(function() {
                dataBusModel.busClicked(bus.vehicle);
            });
        });

        var newChildren = [];
        self.children.forEach( function(child) {
            if(child.vehicle != undefined &&
                child.displayed == false) {  // It is a bus
                child.dispose();
            }
            else {
                newChildren.push(child);
            }
        });
        self.children = newChildren;
    };

    var onBusSelected = function() {
        if(dataBusModel.busSelected != null) {
            self.displayBusRoute(dataBusModel.busSelected.stops);
            var popup = popupLayerController.openPopup(dataBusModel.busSelected.lat, dataBusModel.busSelected.lon, MapPopupType.POPUP_BUS);
            popup.view.title.text("Bus "+dataBusModel.busSelected.rt);
            popup.view.destination.text(dataBusModel.busSelected.des);

            if(dataBusModel.busSelected.dly != undefined) {
                popup.view.delay.text("No delay");
            }
            else {
                popup.view.delay.text("Delay");
            }
        }
        else
            self.hideBusRoutes();
    };

    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideBusRoutes();
        self.clear();
        self.super_dispose();
        dataBusModel.unsubscribe(Notifications.data.BUS_CHANGED, onBusData);
        dataBusModel.unsubscribe(Notifications.data.BUS_SELECTION_CHANGED, onBusSelected);
    };

    var init = function() {

        dataBusModel.subscribe(Notifications.data.BUS_CHANGED, onBusData);
        dataBusModel.subscribe(Notifications.data.BUS_SELECTION_CHANGED, onBusSelected);

    }();

    return self;
}