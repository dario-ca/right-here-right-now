/**
 *  controller for the selection on the left of the application
 */
var LayerSelectionViewController = function() {
    var self = SvgViewController();

    self.layerSelectionViewController = null;
    self.notificationsViewController = null;
    self.mapToolsViewController = null;

    var _margin = {layer:13,
                   sublayer: 10,
                   labelLeft: 10,
                   checkboxRight : 10,
                    checkboxTop : 4,
                   sublayerLeft: 15};
    var _size = {checkbox: 8,
                 sublayerIcon: 8};

    var _layerTitle,
        _lastWeekButton,
        _lastMonthButton;


    var _layersSvg;
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

    
    self.onLayerSelectionChanged = function() {
        _layersSvg.view.html("");
        addLayers();
    };


    self.onTimeIntervalChanged = function() {
        _lastMonthButton.selected = timeIntervalModel.timeInterval == TimeInterval.LAST_MONTH;
        _lastWeekButton.selected = timeIntervalModel.timeInterval == TimeInterval.LAST_WEEK;
    };

    //#PRIVATE FUNCTIONS

    /**
     * Add layers title, sublayers and checkboxes
     */
    var addLayers = function() {

        var viewbox = {width: 100, height: 1};

        _layersSvg = SvgViewController();
        _layersSvg.view.width = "100%";
        _layersSvg.view.height = "80%";
        _layersSvg.view.y = "10%";
        _layersSvg.view.setViewBox(0, 0, viewbox.width, viewbox.height);

        self.view.append(_layersSvg);

        var yPos = 0;

        model.layers.forEach(function(layer){

            //Layer label
            var layerLabel = UIView(_layersSvg.view.append("text"));
            layerLabel.classed("layer-name-label", true);
            layerLabel.attr("x", _margin.labelLeft);
            layerLabel.attr("y", yPos + 10);
            layerLabel.text(layer.name);

            //Checkbox
            var checkbox = CheckboxViewController();
            checkbox.view.y = yPos + _margin.checkboxTop;
            checkbox.view.x = viewbox.width - _size.checkbox - _margin.checkboxRight ;
            checkbox.view.height = _size.checkbox;
            checkbox.selected = layer.selected;
            _layersSvg.view.append(checkbox);

            checkbox.onClick(function(){
               layer.toggleSelection();
            });

            //Layer sublayers
            layer.sublayers.forEach(function(sublayer){
                yPos += _margin.sublayer;

                //label sublayer
                var sublayerLabel = UIView(_layersSvg.view.append("text"));
                sublayerLabel.classed("sublayer-name-label", true);
                sublayerLabel.clickable = true;
                sublayerLabel.attr("x", _margin.sublayerLeft + _size.sublayerIcon + 2);
                sublayerLabel.attr("y", yPos + 10);
                sublayerLabel.text(sublayer.name);

                //icon sublayer
                var sublayerIcon = ExternalSvgViewController(sublayer.icon);
                sublayerIcon.view.classed("sublayer-icon", true);

                sublayerIcon.view.width = _size.sublayerIcon;
                sublayerIcon.view.height = _size.sublayerIcon;
                sublayerIcon.view.y = yPos + 4;
                sublayerIcon.view.x = _margin.sublayerLeft;
                sublayerIcon.view.clickable = true;
                _layersSvg.view.append(sublayerIcon);

                //click
                sublayerLabel.on("click", function() {
                    sublayer.toggleSelection();
                });

                sublayerIcon.view.on("click", function() {
                    sublayer.toggleSelection();
                });

                //Color
                if(sublayer.selected){
                    sublayerIcon.view.background.style("fill",sublayer.color);
                    sublayerLabel.style("fill",Colors.components.WHITE_SELECTED);

                } else {
                    sublayerIcon.view.background.style("fill",Colors.components.GREY_DESELECTED);
                    sublayerLabel.style("fill",Colors.components.GREY_DESELECTED);
                }

            });


            yPos += _margin.layer;
        });
    };



    var init = function() {

        self.view.classed("layer-selection-view-controller", true);
        self.view.append(UIBackgroundView());

        _layerTitle = ExternalSvgViewController("resource/view/layer-title.svg");
        _layerTitle.view.width = "40%";
        _layerTitle.view.x = "5%";
        _layerTitle.view.y = "3%";
        self.view.append(_layerTitle);


        //Layers
        addLayers();

        //Time Buttons
        var translateCoordinateSystemGroup =
            UISvgView()
                .setViewBox(0,0,300,46)
                .setFrame(0,0,"100%","100%")
                .setAspectRatioOptions("xMinYMax meet");

        self.view.append(translateCoordinateSystemGroup);

        _lastWeekButton = ButtonViewController();
        _lastWeekButton.view.background.hide();
        _lastWeekButton.view.title.text("LAST WEEK");
        _lastWeekButton.selected = timeIntervalModel.timeInterval == TimeInterval.LAST_WEEK;
        translateCoordinateSystemGroup.append(_lastWeekButton);

        _lastMonthButton = ButtonViewController();
        _lastMonthButton.view.background.hide();
        _lastMonthButton.view.title.text("LAST MONTH");
        _lastMonthButton.selected = timeIntervalModel.timeInterval == TimeInterval.LAST_MONTH;
        translateCoordinateSystemGroup.append(_lastMonthButton);

        _lastWeekButton.onClick(function(){
            timeIntervalModel.timeInterval = TimeInterval.LAST_WEEK;
        });

        _lastMonthButton.onClick(function(){
            timeIntervalModel.timeInterval = TimeInterval.LAST_MONTH;
        });


        //REGISTER TO CALLBACKS
        notificationCenter.subscribe(Notifications.layer.SUBLAYER_SELECTION_CHANGED, self.onLayerSelectionChanged);
        notificationCenter.subscribe(Notifications.timeInterval.TIME_INTERVAL_CHANGED, self.onTimeIntervalChanged);

    }();

    return self;
};