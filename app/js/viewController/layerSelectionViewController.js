/**
 *  controller for the selection on the left of the application
 */
var LayerSelectionViewController = function() {
    var self = SvgViewController();

    self.layerSelectionViewController = null;
    self.notificationsViewController = null;
    self.mapToolsViewController = null;

    var _margin = {layer:20,
                   sublayer: 12,
                   labelLeft: 10,
                   checkboxRight : 10,
                   sublayerLeft: 15};
    var _size = {checkbox: 8,
                 sublayerIcon: 9};

    var _layerTitle,
        _lastWeekButton,
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


    //#PRIVATE FUNCTIONS

    /**
     * Add layers title, sublayers and checkboxes
     */
    var addLayers = function() {

        var viewbox = {width: 100, height: 1};

        var layersSvg = SvgViewController();
        layersSvg.view.width = "100%";
        layersSvg.view.height = "80%";
        layersSvg.view.y = "10%";
        layersSvg.view.setViewBox(0, 0, viewbox.width, viewbox.height);

        self.view.append(layersSvg);

        var yPos = 0;

        model.layers.forEach(function(layer){

            //Layer label
            var layerLabel = UIView(layersSvg.view.append("text"));
            layerLabel.classed("layer-name-label", true);
            layerLabel.attr("x", _margin.labelLeft);
            layerLabel.attr("y", yPos + 10);
            layerLabel.text(layer.name);

            //Checkbox
            var checkbox = CheckboxViewController();
            checkbox.view.y = yPos + 3;
            checkbox.view.x = viewbox.width - _size.checkbox - _margin.checkboxRight ;
            checkbox.view.height = _size.checkbox;
            layersSvg.view.append(checkbox);

            //Layer sublayers
            layer.sublayers.forEach(function(sublayer){
                yPos += _margin.sublayer;

                //label sublayer
                var sublayerLabel = UIView(layersSvg.view.append("text"));
                sublayerLabel.classed("sublayer-name-label", true);
                sublayerLabel.attr("x", _margin.sublayerLeft + _size.sublayerIcon + 2);
                sublayerLabel.attr("y", yPos + 10);
                sublayerLabel.text(sublayer.name);

                //icon sublayer
                var sublayerIcon = UIImageView();
                sublayerIcon.classed("sublayer-icon", true);
                sublayerIcon.imageSrc = sublayer.icon;
                sublayerIcon.width = _size.sublayerIcon;
                sublayerIcon.height = _size.sublayerIcon;
                sublayerIcon.y = yPos + 4;
                sublayerIcon.x = _margin.sublayerLeft;
                layersSvg.view.append(sublayerIcon);

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
        translateCoordinateSystemGroup.append(_lastWeekButton);

        _lastMonthButton = ButtonViewController();
        _lastMonthButton.view.background.hide();
        _lastMonthButton.view.title.text("LAST MONTH");
        _lastMonthButton.selected = false; //TODO CHECK THE MODEL
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