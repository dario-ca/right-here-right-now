/**
 *  main Controller of the application
 */
var MainViewController = function() {
    var self = SvgViewController();

    self.layerSelectionViewController = null;
    self.notificationsViewController = null;
    self.mapToolsViewController = null;



    /**
     * @override
     * Called every time it is necessary to update the view layout
     */
    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();
    };


    var init = function() {

        self.view.classed("main-view-controller", true);
        self.view.width = "100%";
        self.view.height = "100%";

        self.layerSelectionViewController = LayerSelectionViewController();
        self.layerSelectionViewController.view.width = "14%";
        self.layerSelectionViewController.view.height = "100%";
        self.view.append(self.layerSelectionViewController);

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



    }();

    return self;
};