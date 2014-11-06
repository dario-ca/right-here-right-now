function BusLayerController() {
    var self = MapLayerController();

    var onBusData = function() {
        // Takes all bus data
        vehicles = dataBusModel.data;
        for(var i in vehicles) {
            var vehicle = vehicles[i];
            var bus = ExternalSvgViewController("resource/sublayer/icon/bus.svg");

            bus.view.width = self.defaultIconSize;
            bus.view.height= self.defaultIconSize;

            var p = self.project(vehicle.lat, vehicle.lon);
            bus.view.x = p.x;
            bus.view.y = p.y;

            bus.view.busNumber.text(vehicle.rt);

            self.view.append(bus);
        }
    };

    var init = function() {

        dataBusModel.subscribe(Notifications.data.BUS_CHANGED, onBusData);

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