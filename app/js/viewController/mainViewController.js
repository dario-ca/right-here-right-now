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

    }();

    return self;
};