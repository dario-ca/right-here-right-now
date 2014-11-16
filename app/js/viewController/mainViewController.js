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
    self.graphsViewController = null;


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
        self.layerSelectionViewController.view.width = "22%";
        self.layerSelectionViewController.view.height = "100%";
        self.view.append(self.layerSelectionViewController);

        //MAP TOOLS

        //translate to the bottom
        var mapToolsTranslateCoordinateSystemGroup = UISvgView()
                                                    .setViewBox(0,0,500,10.80)
                                                    .setFrame(0,0,"100%","100%")
                                                    .setAspectRatioOptions("xMinYMax meet");

        self.view.append(mapToolsTranslateCoordinateSystemGroup);

        self.mapToolsViewController = MapToolsViewController();
        self.mapToolsViewController.view.width = "36%";
        self.mapToolsViewController.view.height = "100%";
        self.mapToolsViewController.view.x = "34%";
        mapToolsTranslateCoordinateSystemGroup.append(self.mapToolsViewController);

        //NOTIFICATIONS POPUPS
        self.notificationsPopupViewController = NotificationPopupsViewController();
        self.notificationsPopupViewController.view.width = "16%";
        self.notificationsPopupViewController.view.height = "100%";
        self.notificationsPopupViewController.view.x = "22.2%";
        self.notificationsPopupViewController.view.y = "0.2%";
        self.view.append(self.notificationsPopupViewController);

        // WEATHER
        self.weatherViewController = WeatherViewController();
        self.weatherViewController.view.width = "8%";
        self.weatherViewController.view.height = "100%";
        self.weatherViewController.view.x = "62%";
        self.weatherViewController.view.y = "0.2%";
        self.view.append(self.weatherViewController);

        //GRAPHS
        self.graphsViewController = GraphsViewController();
        self.graphsViewController.view.width = "29.8%";
        self.graphsViewController.view.height = "100%";
        self.graphsViewController.view.x = "70.2%";
        self.graphsViewController.view.y = "0%";
        self.view.append(self.graphsViewController);

    }();

    return self;
};