/**
 *  Main window of the application
 */
var WindowController = function() {
    var self = DivViewController();

    self.mapViewController = null;


    var init = function() {

        self.view.classed("window-controller", true);


        self.mapViewController = MapViewController();
        self.view.append(self.mapViewController);

        var dummyLayer = DummyLayerController();
        self.mapViewController.addLayer(dummyLayer);


    }();

    return self;
};