/**
 *  controller for the selection on the left of the application
 */
var LayerSelectionViewController = function() {
    var self = SvgViewController();

    self.layerSelectionViewController = null;
    self.notificationsViewController = null;
    self.mapToolsViewController = null;


    var _lastWeekButton,
        _lastMonthButton;


    /**
     * @override
     * Called every time it is necessary to update the view layout
     */
    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();

        _lastWeekButton.view.width = "50%";
        _lastWeekButton.view.y = 0;

        _lastMonthButton.view.x = "50%";
        _lastMonthButton.view.width = "50%";
    };


    var init = function() {

        self.view.classed("layer-selection-view-controller", true);
        self.view.append(UIBackgroundView());

        var translateCoordinateSystemGroup =
            UISvgView()
                .setViewBox(0,0,300,46)
                .setFrame(0,0,"100%","100%")
                .setAspectRatioOptions("xMinYMax meet");

        self.view.append(translateCoordinateSystemGroup);


        _lastWeekButton = ButtonViewController();
        _lastWeekButton.view.background.hide();
        _lastWeekButton.view.title.text("LAST WEEK");
        translateCoordinateSystemGroup.append(_lastWeekButton);

        _lastMonthButton = ButtonViewController();
        _lastMonthButton.view.background.hide();
        _lastMonthButton.view.title.text("LAST MONTH");
        translateCoordinateSystemGroup.append(_lastMonthButton);

        _lastWeekButton.onClick(function(){
            _lastWeekButton.selected = true;
            _lastMonthButton.selected = false;
        });

        _lastMonthButton.onClick(function(){
            _lastMonthButton.selected = true;
            _lastWeekButton.selected = false;
        });





    }();

    return self;
};