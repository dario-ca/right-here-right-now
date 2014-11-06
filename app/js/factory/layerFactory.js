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
        mobilityLayer.addSublayer("Divvy", "resource/sublayer/icon/divvy-station.svg");
        mobilityLayer.addSublayer("Buses", "resource/sublayer/icon/bus.svg");

        var informationLayer = self.addLayer("INFORMATION");
        informationLayer.addSublayer("Potholes", "resource/sublayer/icon/pothole.svg");
        informationLayer.addSublayer("Lights", "resource/sublayer/icon/light.svg");
        informationLayer.addSublayer("Abandoned Vehicle", "resource/sublayer/icon/abandoned-vehicle.svg");

        var securityLayer = self.addLayer("SECURITY");
        securityLayer.addSublayer("Murder", "resource/sublayer/icon/pothole.svg");
        securityLayer.addSublayer("Kidnapping", "resource/sublayer/icon/pothole.svg");
        securityLayer.addSublayer("Mice", "resource/sublayer/icon/pothole.svg");
        securityLayer.addSublayer("Pigeons", "resource/sublayer/icon/pothole.svg");

    };


    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};


