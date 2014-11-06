/**
 *  Class LayerFactory
 */
var LayerFactory = function() {
    var self = {};


    /** PUBLIC FUNCTIONS**/

    self.addLayer = function(name) {
        var layer = LayerModel(name);
        model.layers.push(layer);
        return layer;
    };


    self.populateLayers = function() {

        var mobilityLayer = self.addLayer("MOBILITY");
        mobilityLayer.addSublayer("Divvy", "resources/sublayer/divvy.png");
        mobilityLayer.addSublayer("Buses", "resources/sublayer/buses.png");

        var informationLayer = self.addLayer("INFORMATION");
        informationLayer.addSublayer("Potholes", "resources/sublayer/potholes.png");
        informationLayer.addSublayer("Lights", "resources/sublayer/lights.png");
        informationLayer.addSublayer("Abandoned Vehicle", "resources/sublayer/abandoned_vehicle.png");

    };


    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};


