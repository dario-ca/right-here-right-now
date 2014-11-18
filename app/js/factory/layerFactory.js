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
        mobilityLayer.hasRelatedGraphs= true;
        mobilityLayer.addSublayer("Divvy",
                                  "resource/sublayer/icon/divvy-station.svg",
                                  Colors.layer.MOBILITY,
                                  [DivvyLayerController])
                                  .hasRelatedGraph = true;
        mobilityLayer.addSublayer("Buses",
                                  "resource/sublayer/icon/bus-no-number.svg",
                                  Colors.layer.MOBILITY,
                                  [BusLayerController])
                                  .hasRelatedGraph = true;


        var informationLayer = self.addLayer("INFORMATION");
        informationLayer.hasRelatedGraphs= true;
        informationLayer.addSublayer("Pothole",
                                     "resource/sublayer/icon/pothole.svg",
                                     Colors.layer.INFORMATION,
                                     [PotholeLayerController]);
        informationLayer.addSublayer("Light",
                                     "resource/sublayer/icon/light.svg",
                                     Colors.layer.INFORMATION,
                                     [LightOneLayerController,LightAllLayerController]);
        informationLayer.addSublayer("Abandoned Vehicle",
                                     "resource/sublayer/icon/abandoned-vehicle.svg",
                                     Colors.layer.INFORMATION,
                                     [VehicleLayerController]);

        var securityLayer = self.addLayer("SECURITY");
        securityLayer.hasRelatedGraphs= true;
        securityLayer.addSublayer("Personal Assault",
                                  "resource/sublayer/icon/assault.svg",
                                  Colors.layer.SECURITY_1,
                                  [Category1CrimeLayerController]);
        securityLayer.addSublayer("Property Crime",
                                    "resource/sublayer/icon/property.svg",
                                    Colors.layer.SECURITY_2,
                                    [Category2CrimeLayerController]
                                );
        securityLayer.addSublayer("Mice",
                                    "resource/sublayer/icon/unsafe.svg",
                                    Colors.layer.SECURITY_3,
                                    [Category3CrimeLayerController]);
        securityLayer.addSublayer("Pigeons",
                                    "resource/sublayer/icon/other.svg",
                                    Colors.layer.SECURITY_4,
                                    [Category4CrimeLayerController]);


        var pointOfInterestLayer = self.addLayer("POINT OF INTEREST");
        pointOfInterestLayer.addSublayer("Restaurant",
            "resource/sublayer/icon/restaurant.svg",
            Colors.layer.POINT_OF_INTEREST,
            [RestaurantLayerController]);
        pointOfInterestLayer.addSublayer("Bar",
            "resource/sublayer/icon/bar.svg",
            Colors.layer.POINT_OF_INTEREST,
            [BarLayerController]);
        pointOfInterestLayer.addSublayer("Important Place",
            "resource/sublayer/icon/important-place.svg",
            Colors.layer.POINT_OF_INTEREST,
            [ImportantPlacesLayerController]);
        
        var socialLayer = self.addLayer("SOCIAL");
        socialLayer.addSublayer("twitter",
            "resource/sublayer/icon/twitter.svg",
            Colors.layer.SOCIAL,
            [TwitterLayerController]);


    };


    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};


