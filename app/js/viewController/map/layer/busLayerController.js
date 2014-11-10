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
            var busStop = ExternalSvgViewController("resource/sublayer/icon/bus.svg");
            busStop.view.width = self.defaultIconSize;
            busStop.view.height= self.defaultIconSize;

            var p = self.project(stop.lat, stop.lon);
            busStop.view.x = p.x;
            busStop.view.y = p.y;

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
        /*
        var map = mapModel.getLeafletMap();
        busRouteLayers.forEach(function(routeLayer){
            map.removeLayer(routeLayer);
        });
        */
        busRouteLayers.forEach(function(busStop) {
            busStop.dispose();
        });
        busRouteLayers = [];
    };

    var onBusData = function() {
        // Remove all busses
        self.children.forEach( function(child) {
            if(child.vehicle != undefined)
                child.dispose();    // It is a bus
        });
        self.children = [];

        // Takes all bus data
        vehicles = dataBusModel.data;
        vehicles.forEach(function(vehicle) {
            var bus = ExternalSvgViewController("resource/sublayer/icon/bus.svg");

            bus.view.width = self.defaultIconSize;
            bus.view.height= self.defaultIconSize;
            bus.vehicle = vehicle;

            var p = self.project(vehicle.lat, vehicle.lon);
            bus.view.x = p.x;
            bus.view.y = p.y;

            bus.view.busNumber.text(vehicle.rt);

            self.view.append(bus);

            // Add the interaction on
            bus.view.onClick(function() {
                dataBusModel.busClicked(bus.vehicle);
            });
        });
    };

    var onBusSelected = function() {
        if(dataBusModel.busSelected != null) {
            self.displayBusRoute(dataBusModel.busSelected.stops);
        }
        else
            self.hideBusRoutes();
    };

    var init = function() {

        dataBusModel.subscribe(Notifications.data.BUS_CHANGED, onBusData);
        dataBusModel.subscribe(Notifications.data.BUS_SELECTION_CHANGED, onBusSelected);

        /*
        //POPUP

        var popup = ExternalSvgViewController("resource/view/notification-popup.svg")
        self.view.append(popup);
        popup.view.width = 20;
        popup.view.height= 10;
        popup.view.title.text("prova");
        popup.view.subtitle.text("provaprova");
        popup.view.icon.imageSrc = "resource/sublayer/icon/assault.png";

        var position = self.project(41.866320,-87.64 );
        popup.view.x = position.x;
        popup.view.y = position.y;

        self.fixControllerSize(popup);


        //ICON

        var simpleIcon = SvgViewController();
        var image = UIImageView();
        image.imageSrc = "resource/sublayer/icon/assault.png";

        simpleIcon.view.width = 5;
        simpleIcon.view.height = 5;
        simpleIcon.view.append(image);
        simpleIcon.view.classed("dummy-icon", true);
        self.view.append(simpleIcon);

        var position2 = self.project(41.876320,-87.64 );
        simpleIcon.view.x = position2.x;
        simpleIcon.view.y = position2.y;
        */

    }();

    return self;
}