var GraphsViewController = function() {
    var self = SvgViewController();

    var _layerButtons = [];
    var _sublayerIconViewController;
    var _graphsTitle;

    var buttonWidth = 20,
        sublayerIconWidth = 6,
        sublayerIconMargin = 3,
        sublayerIconMarginTop = 20;

    var _topViewController = null;
    var _bottomViewController = null;

    self.onLayerSelectionChanged = function() {
        _layerButtons.forEach(function(button){
            button.viewController.selected = button.layerName == graphsModel.layerSelected;
        });

        drawSublayerButtons();
        instantiateGraphs();
    };


    self.onSublayerSelectionChanged = function() {


        drawSublayerButtons();
        instantiateGraphs();
    };


    var instantiateGraphs = function() {

        if(_topViewController){
            _topViewController.dispose();
        }

        if(_bottomViewController){
            _bottomViewController.dispose();
        }


        if(!graphsModel.layerSelected)
            return;

        var layer = app.graphsFactory.layerGraphs[graphsModel.layerSelected];
        if(layer){

            if(layer.graph && layer.graph.class){
                setTopOrBottomViewController(layer.graph.class(graphsModel.layerSelected),
                    layer.graph.position);
            }

            var sublayer = layer.sublayers[graphsModel.sublayerSelected];


            if(sublayer){
                setTopOrBottomViewController(sublayer.graph.class(graphsModel.layerSelected, graphsModel.sublayerSelected),
                    sublayer.graph.position);
            }

        }
    };


    /**
     * @override
     * Called every time it is necessary to update the view layout
     */
    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();

        var current = 0;
        for(var i = 0; i < _layerButtons.length; i++){
            var button = _layerButtons[i].viewController;
            button.view.x = (i*buttonWidth) + "%";
            button.view.width = buttonWidth + "%";
        }

    };


    var setTopOrBottomViewController = function(viewController, position) {
        viewController.view.classed("graph-view-controller", true);
        viewController.view.width = (100 - sublayerIconMargin - sublayerIconWidth) + "%";

        if(position == GraphPosition.TOP){
            viewController.view.height = "45%";
            _topViewController = viewController;

        } else if(position == GraphPosition.BOTTOM){
            viewController.view.height = "45%";
            viewController.view.y = "50%";
            _bottomViewController = viewController;
        } else if(position == GraphPosition.FULL){
            viewController.view.height = "90%";

            _topViewController = viewController;
        }



        self.view.append(viewController)
    };



    var drawSublayerButtons = function() {
        _sublayerIconViewController.view.html("");
        var layer = model.getLayerWithName(graphsModel.layerSelected);
        if(layer) {
            var iconsCount = 0;
            layer.sublayers.forEach(function(sublayer){
                var icon = ExternalSvgViewController(sublayer.icon);
                icon.view.background.remove();
                var button = UIBackgroundView();
                button.attr("opacity", 0);
                icon.view.append(button);
                if(sublayer.name == graphsModel.sublayerSelected){
                    icon.view.selectAll("path").style("fill", Colors.components.WHITE_SELECTED);
                    _graphsTitle.view.title.text(sublayer.name);
                } else {
                    icon.view.selectAll("path").style("fill", Colors.components.GREY_DESELECTED);
                }

                icon.view.x = 0;
                icon.view.y = (iconsCount * (sublayerIconWidth + 3) + sublayerIconMarginTop) + "%";
                _sublayerIconViewController.view.append(icon);

                button.onClick(function(){
                    graphsModel.sublayerSelected = sublayer.name;
                });

                iconsCount++;
            });
        }
    };


    var init = function() {
        self.view.append(UIBackgroundView());

        //Time Buttons
        var translateCoordinateSystemGroup =
            UISvgView()
                .setFrame(0,0,"100%","100%")
                .setAspectRatioOptions("xMinYMax meet");

        self.view.append(translateCoordinateSystemGroup);


        //TITLE
        _graphsTitle = ExternalSvgViewController("resource/view/graphs-title.svg");
        _graphsTitle.view.title = "No sublayer selected";
        _graphsTitle.view.x = "3.5%";
        _graphsTitle.view.y = "2.2%";
        _graphsTitle.view.width = "40%";
        self.view.append(_graphsTitle);
        //BUTTON

        var buttonCount = 0;

        model.layers.forEach(function(layer){
            if(layer.hasRelatedGraphs){
                buttonCount += 1;
                var button = ButtonViewController();
                button.view.background.hide();
                button.view.title.text(layer.name);
                button.selected = layer.name == graphsModel.layerSelected;
                translateCoordinateSystemGroup.append(button);

                button.onClick(function(){
                    graphsModel.layerSelected = layer.name;
                    graphsModel.sublayerSelected = layer.sublayers[0].name;
                });

                _layerButtons.push({viewController:button, layerName:layer.name});
            }

        });

        translateCoordinateSystemGroup.setViewBox(0,0,260 * buttonCount,46);

        _sublayerIconViewController = SvgViewController();
        _sublayerIconViewController.view.classed("sublayer-icon-view-controller", true);
        _sublayerIconViewController.view.width = sublayerIconWidth + "%";
        _sublayerIconViewController.view.height = "100%";
        _sublayerIconViewController.view.x = (100 - sublayerIconWidth - sublayerIconMargin) + "%";
        _sublayerIconViewController.view.y = "0%";

        self.view.append(_sublayerIconViewController);

        drawSublayerButtons();

        notificationCenter.subscribe(Notifications.graphs.GRAPH_LAYER_SELECTED_CHANGED, self.onLayerSelectionChanged);
        notificationCenter.subscribe(Notifications.graphs.GRAPH_SUBLAYER_SELECTED_CHANGED, self.onSublayerSelectionChanged);
    }();

    return self;
};


