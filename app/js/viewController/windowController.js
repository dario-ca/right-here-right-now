/**
 *  Main window of the application
 */
var WindowController = function() {
    var self = DivViewController();

    self.mapViewController = null;
    self.mainViewController = null;

    var init = function() {

        self.view.classed("window-controller", true);

        self.mainViewController = MainViewController();
        self.view.append(self.mainViewController);

        self.mapViewController = MapViewController();
        self.view.append(self.mapViewController);


        var divvyLayer = DivvyLayerController();
        self.mapViewController.addLayer(divvyLayer);

        var busLayer = BusLayerController();
        self.mapViewController.addLayer(busLayer);

        var potholeLayer = PotholeLayerController();
        self.mapViewController.addLayer(potholeLayer);




    }();

    return self;
};