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
        mobilityLayer.addSublayer("Divvy",
                                  "resource/sublayer/icon/divvy-station.svg",
                                  Colors.layer.MOBILITY,
                                  [DivvyLayerController]);
        mobilityLayer.addSublayer("Buses",
                                  "resource/sublayer/icon/bus-no-number.svg",
                                  Colors.layer.MOBILITY,
                                  [BusLayerController]);


        var informationLayer = self.addLayer("INFORMATION");
        informationLayer.addSublayer("Potholes",
                                     "resource/sublayer/icon/pothole.svg",
                                     Colors.layer.INFORMATION,
                                     [PotholeLayerController]);
        informationLayer.addSublayer("Lights",
                                     "resource/sublayer/icon/light.svg",
                                     Colors.layer.INFORMATION,
                                     [LightOneLayerController]);
        informationLayer.addSublayer("Abandoned Vehicle",
                                     "resource/sublayer/icon/abandoned-vehicle.svg",
                                     Colors.layer.INFORMATION,
                                     [VehicleLayerController]);

        var securityLayer = self.addLayer("SECURITY");
        securityLayer.addSublayer("Personal Assault",
                                  "resource/sublayer/icon/assault.svg",
                                  Colors.layer.SECURITY_1,
                                  []);
        securityLayer.addSublayer("Property Crime",
                                    "resource/sublayer/icon/property.svg",
                                    Colors.layer.SECURITY_2,
                                    [CrimeLayerController]
                                );
        securityLayer.addSublayer("Mice",
                                    "resource/sublayer/icon/pothole.svg",
                                    Colors.layer.SECURITY_3,
                                    []);
        securityLayer.addSublayer("Pigeons",
                                    "resource/sublayer/icon/pothole.svg",
                                    Colors.layer.SECURITY_4,
                                    []);
    };


    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};


