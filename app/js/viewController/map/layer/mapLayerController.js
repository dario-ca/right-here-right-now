/**
 * @class MapLayerController
 * @description
 */
var MapLayerController = function() {
    var self = SvgViewController();

    ////////////////////////// PUBLIC ATTRIBUTES //////////////////////////

    self.fixedSizeControllers = [];
    self.defaultIconSize=2;
    self.defaultCircleRatio=0.9;

    self.warningViews = [];
    self.dangerViews = [];

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////

    // Contains all the layers of the VC
    var _layerGroup;

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    var super_dispose = self.dispose;
    self.dispose = function() {
        super_dispose();
        self.clear();

    };


    self.clear = function() {
        self.warningViews.forEach(function(v) {
            v.dispose();
        });

        self.dangerViews.forEach(function(v) {
            v.dispose();
        });
    };


    /**
     * Getter for the layer group attribute
     *
     * Note: MapViewController needs self getter in order to remove layers from the map
     * @returns {*}
     */
    self.getLayerGroup = function() {
        return _layerGroup;
    };

    /**
     * Project the coordinate to a point coherent to the layer
     * @param lat
     * @param lng
     * @returns {Object} x:.., y:..
     */
    self.project = function(lat, lng) {
        return mapModel.projectAtDefaultZoom(lat,lng);
    };

    self.unproject = function(x, y) {
        return mapModel.unprojectAtDefaultZoom(x,y);
    };

    /**
     * Wrapper for the standard d3 projection
     */
    self.d3projection = function(latLng) {
       var point = self.project(latLng[1], latLng[0]);
       return [point.x, point.y];
    } ;


    /**
     * add the view controller to the list of object to be resized
     */
     self.fixControllerSize = function(viewController, centered) {
         self.fixedSizeControllers.push(viewController);
         viewController.fixWidth = viewController.view.width;
         viewController.fixHeight = viewController.view.height;
         viewController.fixAnchorCentered = centered;

         MapViewController.scaleController(viewController, mapModel.getZoom());

     };

    self.addWarning = function(lat, long, radius) {
        var circle = enhanceLayerController.addWarning(lat, long, radius);
        self.warningViews.push(circle);
        return circle;
    };

    self.addDanger = function(lat, long, radius) {
        var circle = enhanceLayerController.addDanger(lat, long, radius);
        self.dangerViews.push(circle);
        return circle;
    };



    /**
     * create the icon of the data to visualize
     */
    self.createIcon = function(latitude, longitude, path){
        var icon = ExternalSvgViewController(path);
        self.view.append(icon);
        icon.view.width =self.defaultIconSize;
        icon.view.height=self.defaultIconSize;


        var position = self.project(latitude, longitude);
        icon.view.x = position.x - self.defaultIconSize/2;
        icon.view.y = position.y - self.defaultIconSize/2;
        self.fixControllerSize(icon, true);

        return icon;
    };

    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        _layerGroup = L.layerGroup();
        var topLeftCoord = mapModel.getTopLeftCoordOfInterest();
        var bottomRightCoord = mapModel.getBottomRightCoordOfInterest();
        var topLeft = mapModel.projectAtDefaultZoom(topLeftCoord.lat,topLeftCoord.lng);
        var bottomRight =  mapModel.projectAtDefaultZoom(bottomRightCoord.lat,bottomRightCoord.lng);
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        self.view.setFrame(0,0,bottomRight.x,bottomRight.y);

    } ();

    return self;
};
