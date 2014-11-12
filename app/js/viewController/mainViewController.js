/**
 *  main Controller of the application
 */
var MainViewController = function() {
    var self = SvgViewController();

    self.layerSelectionViewController = null;
    self.notificationsViewController = null;
    self.mapToolsViewController = null;
    self.notificationsPopupViewController = null;
    self.weatherViewController = null;


    /**
     * @override
     * Called every time it is necessary to update the view layout
     */
    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();
    };


    var init = function() {

        //LAYER SELECTION

        self.view.classed("main-view-controller", true);
        self.view.width = "100%";
        self.view.height = "100%";

        self.layerSelectionViewController = LayerSelectionViewController();
        self.layerSelectionViewController.view.width = "14%";
        self.layerSelectionViewController.view.height = "100%";
        self.view.append(self.layerSelectionViewController);

        //MAP TOOLS

        //translate to the bottom
        var mapToolsTranslateCoordinateSystemGroup = UISvgView()
                                                    .setViewBox(0,0,500,10.3)
                                                    .setFrame(0,0,"100%","100%")
                                                    .setAspectRatioOptions("xMinYMax meet");

        self.view.append(mapToolsTranslateCoordinateSystemGroup);

        self.mapToolsViewController = MapToolsViewController();
        self.mapToolsViewController.view.width = "20%";
        self.mapToolsViewController.view.height = "100%";
        self.mapToolsViewController.view.x = "40%";
        mapToolsTranslateCoordinateSystemGroup.append(self.mapToolsViewController);

        //NOTIFICATIONS POPUPS
        self.notificationsPopupViewController = NotificationPopupsViewController();
        self.notificationsPopupViewController.view.width = "16%";
        self.notificationsPopupViewController.view.height = "100%";
        self.notificationsPopupViewController.view.x = "15%";
        self.notificationsPopupViewController.view.y = "0.2%";
        self.view.append(self.notificationsPopupViewController);

        // WEATHER
        self.weatherViewController = WeatherViewController();


    }();

    return self;
};