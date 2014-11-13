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
        _lastMonthButton,
        _realtimeButton;


    var _layersSvg;
    /**
     * @override
     * Called every time it is necessary to update the view layout
     */
    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();

        _lastWeekButton.view.width = "25%";

        _lastMonthButton.view.x = "25%";
        _lastMonthButton.view.width = "25%";

        _realtimeButton.view.x = "50%";
        _realtimeButton.view.width = "50%";
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

        var viewbox = {width: 200, height: 1};

        _layersSvg = SvgViewController();
        _layersSvg.view.width = "100%";
        _layersSvg.view.height = "80%";
        _layersSvg.view.y = "10%";
        _layersSvg.view.setViewBox(0, 0, viewbox.width, viewbox.height);

        self.view.append(_layersSvg);

        var yPos = 0,
            xPos = 0;
        var secondColumnX = viewbox.width / 2;




        model.layers.forEach(function(layer){

            switch(layer.name){
                case "MOBILITY":
                    yPos = 0;
                    xPos = secondColumnX;
                    break;
                case "INFORMATION":
                    yPos = 56;
                    xPos = 0;
                    break;
                case "SOCIAL":
                    yPos = 30;
                    xPos = secondColumnX;
                    break;
                case "POINT OF INTEREST":
                    yPos = 56;
                    xPos = secondColumnX;
                    break;
                default :
                    yPos = 0;
                    xPos = 0;
            };

            drawLayer(layer, xPos, yPos, viewbox);
            yPos += _margin.layer;
        });
    };


    var drawLayer = function(layer, xPos, yPos, viewbox) {

        //Layer label
        var layerLabel = UIView(_layersSvg.view.append("text"));
        layerLabel.classed("layer-name-label", true);
        layerLabel.attr("x", _margin.labelLeft + xPos);
        layerLabel.attr("y", yPos + 10);
        layerLabel.text(layer.name);

        //Checkbox
        var checkbox = CheckboxViewController();
        checkbox.view.y = yPos + _margin.checkboxTop;

        var marginRight = xPos > 0 ? viewbox.width : viewbox.width/2;
        checkbox.view.x = marginRight - _size.checkbox - _margin.checkboxRight ;
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
            sublayerLabel.attr("x", _margin.sublayerLeft + _size.sublayerIcon + 2  + xPos);
            sublayerLabel.attr("y", yPos + 10);
            sublayerLabel.text(sublayer.name);

            //icon sublayer
            var sublayerIcon = ExternalSvgViewController(sublayer.icon);
            sublayerIcon.view.classed("sublayer-icon", true);

            sublayerIcon.view.width = _size.sublayerIcon;
            sublayerIcon.view.height = _size.sublayerIcon;
            sublayerIcon.view.y = yPos + 4;
            sublayerIcon.view.x = _margin.sublayerLeft +  + xPos;
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

    };

    var init = function() {

        self.view.classed("layer-selection-view-controller", true);
        self.view.append(UIBackgroundView());

        _layerTitle = ExternalSvgViewController("resource/view/layer-title.svg");
        _layerTitle.view.width = "20%";
        _layerTitle.view.x = "5%";
        _layerTitle.view.y = "3%";
        self.view.append(_layerTitle);


        //draw separation line
        var separatorLine = UISvgView();
        separatorLine.classed("separator-line", true);
        var lineBackground = UIBackgroundView();
        lineBackground.changeColor(Colors.components.WHITE_SELECTED);
        separatorLine.append(lineBackground);
        separatorLine.setFrame("50%","10%",1,"100%");
        self.view.append(separatorLine);

        //Layers
        addLayers();

        //Time Buttons
        var translateCoordinateSystemGroup =
            UISvgView()
                .setViewBox(0,0,600,46)
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


        _realtimeButton = ButtonViewController("REALTIME", null, null, true);
        _realtimeButton.view.background.hide();
        _realtimeButton.selected = true;
        translateCoordinateSystemGroup.append(_realtimeButton);


        //REGISTER TO CALLBACKS
        notificationCenter.subscribe(Notifications.layer.SUBLAYER_SELECTION_CHANGED, self.onLayerSelectionChanged);
        notificationCenter.subscribe(Notifications.timeInterval.TIME_INTERVAL_CHANGED, self.onTimeIntervalChanged);

    }();

    return self;
};