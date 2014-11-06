function BusLayerController() {
    var self = MapLayerController();

    var onBusData = function() {
        // Takes all bus data
        positions = [[41.866320, -87.64, 157], [41.886320, -87.64, 66]]//, [41.906320, -87.64, 1], [41.926320, -87.64, 6666]];
        for(var i in positions) {
            var position = positions[i];
            var bus = ExternalSvgViewController("resource/sublayer/icon/bus.svg");

            bus.view.width = self.defaultIconSize;
            bus.view.height= self.defaultIconSize;

            var p = self.project(position[0], position[1]);
            bus.view.x = p.x;
            bus.view.y = p.y;

            self.view.append(bus);
        }
    };

    var init = function() {

        onBusData();

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