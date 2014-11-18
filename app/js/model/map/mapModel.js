/**
 *
 * @constructor
 */
var MapModel = function() {
    // PRIVATE ATTRIBUTES
    var self = {};

    var _map;

    // This is the default latitude and longitude of the Map center.

//    latitude:41.869912359714654, longitude:-87.64772415161133
    var  _focusPoint = { latitude:41.876320, longitude:-87.572841 };
    var _topLeftCoord = new L.latLng(/*41.978353*/42.1, /*-87.707857*/-88.0);
    var _bottomRightCoord = new L.latLng(/*41.788746*/41.1, /*-87.580715*/-87.0);
    var _defaultZoomForProjecting = 10;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    /**
     *
     * @returns {Array} [latitude, longitude]
     */
    self.getMapBounds = function() {
        return _map.getBounds();
    };


    /**
     *
     */
    self.getTopLeftCoordOfInterest = function() {
        return _topLeftCoord;
    } ;

    /**
     *
     */
    self.getBottomRightCoordOfInterest = function() {
        return _bottomRightCoord;
    };


    /**
     *
     */
    self.projectAtDefaultZoom = function(lat,long) {
        if(!isNaN(lat) && !isNaN(long)){
            return _map.project(new L.LatLng(lat,long), _defaultZoomForProjecting);
        } else {
            return L.point(0,0);
        }

    };

    self.unprojectAtDefaultZoom = function(x,y) {
        return _map.unproject(new L.Point(x,y), _defaultZoomForProjecting);
    };


    /**
     *
     */
    self.getZoom = function() {
        return _map.getZoom();
    };

    /**
     *
     * @returns {*[]}
     */
    self.getDefaultFocusPoint = function() {
        return [
            _focusPoint.latitude,
            _focusPoint.longitude
        ];
    };

    /**
     * Set the current leaflet map object to be used with self model
     * @param map
     */
    self.setMap = function(map) {
        _map = map;
        _map.on("move", function(){
            //_parentModel.getNotificationCenter().dispatch(Notifications.mapController.MAP_POSITION_OR_ZOOM_CHANGED)
        });

        _map.on("zoomend", function(){
            //_parentModel.getNotificationCenter().dispatch(Notifications.mapController.ZOOM_CHANGED);
        });
    };

    self.getLeafletMap = function() {
        return _map;
    };


    /**
     *
     * @param lat
     * @param long
     * @returns {*}
     */
    self.fromLatLngToLayerPoint = function(lat,long){
        return _map.latLngToLayerPoint(new L.LatLng(lat, long));
    } ;

    /**
     *
     * @param x
     * @param y
     * @returns {*}
     */
    self.layerPointToLatLng = function(x,y){
        return _map.layerPointToLatLng(new L.Point(x, y));
    } ;






    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
    } ();

    return self;
};

//Global
var mapModel = MapModel();