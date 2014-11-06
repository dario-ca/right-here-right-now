/**
 *  main Controller of the application
 */
var MainViewController = function() {
    var self = SvgViewController();

    self.mapViewController = null;

    /**
     * @override
     * Called every time it is necessary to update the view layout
     */
    self.updateView = function() {
        self.children.forEach(function(child) {
            child.updateView();
        });
    };


    var init = function() {

        self.view.classed("window-controller", true);


        self.mapViewController = MapViewController();
        self.view.append(self.mapViewController);

        var dummyLayer = DummyLayerController();
        self.mapViewController.addLayer(dummyLayer);


    }();

    return self;
};