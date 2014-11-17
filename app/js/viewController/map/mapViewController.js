var popupLayerController = null;
var enhanceLayerController = null;
/**
 * @class: MapViewController
 */
function MapViewController() {
    // Call the base class constructor
    var self = DivViewController();

    /////////////////////////// PRIVATE ATTRIBUTES /////////////////////////// 

    var _mapContainer;
    var _defaultZoom = 13;
    
    var _mapID = {
        aerial: 'macs91.k25dm9i2',
        map: 'krbalmryde.jk1dm68f'
    };
    var _mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    var _mapAttribution = 'Map data &copy; ' +
        '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';

    // Make out Map-layer object, self is what contains the actual map itself
    var _mapTilesLayer;

    // svg elements
    var _svgLayer;
    var _svgLayerGroup;

    var layerViewControllers = [],
        //list of already visible sublayers
        visibleSublayers = [];//{sublayerName : [layerViewControllers]}

    
    /////////////////////////// PUBLIC METHODS ///////////////////////////

    self.addLayer = function(layerController) {
        self.addChildController(layerController);
        layerViewControllers.push(layerController);
        layerController.view.appendTo(_svgLayerGroup);

        //bring the popups to front again
        popupLayerController.view.bringToFront();
    };


    self.removeLayer = function(layerController) {
        self.removeChildController(layerController);
        layerViewControllers = _.without(layerViewControllers, layerController);
    };


    self.onMapReset = function() {

        //UPDATE THE SIZE AND POSITION OF THE SVG LAYER
        //in order to be big as chicago
        var topLeftCoord = mapModel.getTopLeftCoordOfInterest();
        var bottomRightCoord = mapModel.getBottomRightCoordOfInterest();

        //fixed points
        var topLeft = _mapContainer.latLngToLayerPoint(topLeftCoord);
        var bottomRight = _mapContainer.latLngToLayerPoint(bottomRightCoord);
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        //project at a fixed zoom level
        var viewBoxTopLeft = mapModel.projectAtDefaultZoom(topLeftCoord.lat,topLeftCoord.lng);
        var viewBoxBottomRight =  mapModel.projectAtDefaultZoom(bottomRightCoord.lat,bottomRightCoord.lng);
        var viewBoxWidth = viewBoxBottomRight.x - viewBoxTopLeft.x;
        var viewBoxHeight = viewBoxBottomRight.y - viewBoxTopLeft.y;


        _svgLayer.setFrame(0,0,width,height);
        _svgLayer.setViewBox(0,0,viewBoxWidth,viewBoxHeight);
        _svgLayer.style("top",topLeft.y + "px");
        _svgLayer.style("left",topLeft.x + "px");

        _svgLayerGroup.attr("transform","translate(" + [-viewBoxTopLeft.x,-viewBoxTopLeft.y] + ")");


        //Scale object that must be scaled
        layerViewControllers.forEach(function(layer){
            //TODO Why fixedSizeControllers is sometime undefined?
            if(layer.fixedSizeControllers){
                layer.fixedSizeControllers.forEach(function(controller){
                    MapViewController.scaleController(controller, _mapContainer.getZoom());

                });
            } else {
                console.warn("fixedSizeControllers is undefined");
            }

        });


        //show again what's hidden in onZoomReset
         _svgLayerGroup.attr("opacity",1);
    };


    self.onZoomStart = function() {
      //when the zoom start hide everything
        _svgLayerGroup.attr("opacity",0);
    };


    self.onSublayerSelectionChanged = function() {
        model.layers.forEach(function(layer) {
            layer.sublayers.forEach(function(sublayer){
                //add the missing
                if(sublayer.selected && !visibleSublayers[sublayer.name]) {
                    visibleSublayers[sublayer.name] = [];
                    sublayer.mapLayers.forEach(function(layerViewControllerClass) {
                        var layerViewController = layerViewControllerClass();
                        visibleSublayers[sublayer.name].push(layerViewController);
                        self.addLayer(layerViewController);
                    });
                }
                //remove
                if(!sublayer.selected && visibleSublayers[sublayer.name]) {
                    visibleSublayers[sublayer.name].forEach(function(layerViewController){
                        self.removeLayer(layerViewController);
                    });
                    visibleSublayers[sublayer.name] = null;
                }
            });
        });
    };



    /**
     * @override
     */
    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();
        _mapContainer.invalidateSize();
    };

    /////////////////////////// PRIVATE METHODS ///////////////////////////


    var cleanMap = function() {

    };


    var init = function() {

        self.view.classed("map-view-controller", true);

        // Initializing the _mapTilesLayer
        _mapTilesLayer = L.tileLayer(_mapURL, {
            id: _mapID.map,
            maxZoom: 20,
            attribution: _mapAttribution
        });

        // Draw the map container box
        _mapContainer = L.map(self.view.node());

        _mapContainer.setView(mapModel.getDefaultFocusPoint(), _defaultZoom);
        mapModel.setMap(_mapContainer);

        var tileLayers = {
            aerial: L.tileLayer(_mapURL, {
                id: _mapID.aerial,
                maxZoom: 20,
                attribution: _mapAttribution
            }),
            map: L.tileLayer(_mapURL, {
                id: _mapID.map,
                maxZoom: 20,
                attribution: _mapAttribution
            })
        };

        // Add the base map layer to the map container box
        _mapContainer.addLayer(tileLayers.map);

        L.control.layers(tileLayers,[], {position: "topleft"}).addTo(_mapContainer);

        _svgLayer = UISvgView();
        _svgLayer.classed("map-layers-container", true);
        _svgLayerGroup = _svgLayer.append("g");
        // append the svgLayer to the map
        d3.select(_mapContainer.getPanes().overlayPane).append(function() {
            return _svgLayer.node();
        });

        // Subscribe to notifications

        //map
        _mapContainer.on("viewreset", self.onMapReset);
        _mapContainer.on("zoomstart", self.onZoomStart);

        //layers
        notificationCenter.subscribe(Notifications.layer.SUBLAYER_SELECTION_CHANGED, self.onSublayerSelectionChanged);


        popupLayerController = PopupLayerController();
        self.addLayer(popupLayerController);

        enhanceLayerController = EnhanceIconLayerController();
        self.addLayer(enhanceLayerController);



        // call first map reset
        self.onMapReset();

    } ();

    return self;
}


MapViewController.scaleController = function(controller, zoomLevel){
    var zoomFactor = 1;
    if(zoomLevel > 13) {
        zoomFactor = 1 / ((zoomLevel-13)*2);
    }

    var oldWidth = controller.view.width;
    var oldHeight = controller.view.height;

    controller.view.width = controller.fixWidth * zoomFactor;
    controller.view.height = controller.fixHeight * zoomFactor;

    if(controller.fixAnchorCentered){
        controller.view.x += (oldWidth - controller.view.width)/2;
        controller.view.y += (oldHeight - controller.view.height)/2;
    }
};
