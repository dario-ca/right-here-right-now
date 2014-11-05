/**
 * @class MapLayerController
 * @description
 */
var MapLayerController = function() {
    var self = SvgViewController();

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////

    // Contains all the layers of the VC
    var _layerGroup;
    self.fixedSizeControllers = [];

    //////////////////////////// PUBLIC METHODS ////////////////////////////
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

    /**
     * Wrapper for the standard d3 projection
     */
    self.d3projection = function(latLng) {
       var point = self.project(latLng[1], latLng[0]);
       return [point.x, point.y];
    } ;


    /**
     * add the view controller to the list of object to be resizes
     */
     self.fixControllerSize = function(viewController) {
        self.fixedSizeControllers.push(viewController);
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
