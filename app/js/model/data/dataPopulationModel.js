var DataPopulationModel = function() {

    var self = [];
    var populationJson;

    self.loadResources = function(callback) {
        d3.json("resource/population/population-by-block.json", function (json) {
            populationJson = json;
            callback(null,null);
        });
    };


    self.getPopulationInCurrentSelection = function() {
        var sumPopulation = 0;

        if(selectionModel.isEmpty()){
            sumPopulation = 0;
        } else {
            for(var i = 0; i < populationJson.length; i++){
                var item = populationJson[i];
                if(selectionModel.pointInside([item.lng,item.lat])){
                    sumPopulation += item.pop;
                }
            }
        }

        return sumPopulation;
    };


    self.getPopulationInChicago = function() {
        //only the CITY OF CHICAGO
        return 2695598;
    };


    self.getAreaSelectionInKM2 = function() {
        if(selectionModel.isEmpty()){
            return 0;
        } else {
            var sumArea = 0;
            selectionModel.getSelection().forEach(function(rect){
                var feature = { "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [ [rect.points[0][0],rect.points[0][1]],
                                [rect.points[1][0],rect.points[1][1]],
                                [rect.points[2][0],rect.points[2][1]],
                                [rect.points[3][0],rect.points[3][1]]]
                        ]
                    }
                };
                var featureReverse = { "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [ [rect.points[3][0],rect.points[3][1]],
                                [rect.points[2][0],rect.points[2][1]],
                                [rect.points[1][0],rect.points[1][1]],
                                [rect.points[0][0],rect.points[0][1]]]
                        ]
                    }
                };
                var area = d3.geo.area(feature);
                if(area > 2){
                    //poly reverse
                    sumArea += d3.geo.area(featureReverse);
                } else {
                    sumArea += area;
                }

            });
        }

        return 1482333771.4994986 * sumArea;
    };


    self.getAreaChicagoInKm2 = function() {
        //only the CITY of chicago
        return 606;
    };


    self.getDensityInCurrentSelectionInKm2 = function() {
        var area = self.getAreaSelectionInKM2();
        if(area > 0){
            return self.getPopulationInCurrentSelection() / area;
        } else {
            return 0;
        }
    };


    self.getDensityInChicagoInKm2 = function() {
        return 4447.4;
    };


    self.convertAreaInMiles2 = function(area){
        return area * 0.386101919641;
    };


    self.convertDensityInMiles = function(density){
        return density / 0.386101919641;
    };





    return self;

};

var dataPopulationModel = DataPopulationModel();