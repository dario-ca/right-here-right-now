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


        var selectionRectangleLayer = SelectionRectangleViewController();
        self.mapViewController.addLayer(selectionRectangleLayer);

        //TODO: fix names and icons
        var crimeCategory1Layer = CrimeLayerController("category1",Notifications.data.crime.CRIME_CATEGORY1_CHANGED,"resource/sublayer/icon/pothole.svg");
        self.mapViewController.addLayer(crimeCategory1Layer);

        var crimeCategory2Layer = CrimeLayerController("category2",Notifications.data.crime.CRIME_CATEGORY2_CHANGED,"resource/sublayer/icon/light.svg");
        self.mapViewController.addLayer(crimeCategory2Layer);


    }();

    return self;
};