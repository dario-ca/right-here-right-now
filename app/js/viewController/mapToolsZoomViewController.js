
var MapToolsZoomViewController = function() {
    var self = ExternalSvgViewController("resource/mapTools/maptoolzoom.svg");



    //#PRIVATE FUNCTIONS

    var addBehaviour = function() {
        self.view.zoomin.onClick(function(){
           mapModel.getLeafletMap().zoomIn();
        });

        self.view.zoomout.onClick(function(){
            mapModel.getLeafletMap().zoomOut();
        });

        self.view.map.onClick(function(){
            if(mapModel.getLeafletMap().hasLayer(mapTilesLayer.aerial)){
                mapModel.getLeafletMap().removeLayer(mapTilesLayer.aerial);
                mapModel.getLeafletMap().addLayer(mapTilesLayer.map);
            }
        });

        self.view.aerial.onClick(function(){
            if(mapModel.getLeafletMap().hasLayer(mapTilesLayer.map)){
                mapModel.getLeafletMap().removeLayer(mapTilesLayer.map);
                mapModel.getLeafletMap().addLayer(mapTilesLayer.aerial);
            }
        });
    };


    var init = function() {
        self.view.classed("map-tools-zoom-view-controller", true);
        self.view.attr("opacity",0.9);


        addBehaviour();


    }();

    return self;
};