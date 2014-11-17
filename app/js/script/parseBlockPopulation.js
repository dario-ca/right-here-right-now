
d3.json("resource/population.json", function(popjson) {


    d3.json("resource/file.geojson", function (json) {
        var population = []
        console.log(json.features.length);
        var counter = 0;
        var noBlockCounter = 0;
        json.features.forEach(function (feature) {
            var coord = d3.geo.centroid(feature);
            var description = feature.properties.description;
            var myRegexp = /TRACT_BLOC<\/span>:<\/strong> <span class=\"atr-value\">(\d*)<\/span>/g;
            var match = myRegexp.exec(description);
            var blockCode = match[1];

            var populationValue = -1;
            for(var i = 0; i < popjson.length; i++){
                if(blockCode.indexOf(popjson[i].census_block) > -1){
                    populationValue = parseInt(popjson[i].total_population);
                    break;
                };
            }
            if(populationValue < 0){
                console.warn(blockCode + " has no population entry");
                noBlockCounter++;
            }
            counter += 1;
            if(counter % 2000 == 0){
                console.log(counter + " skipped " + noBlockCounter);
            }
            population.push({lat: coord[0], lng: coord[1], blockCode: blockCode, population: populationValue});
        });

        d3.select("body").html(JSON.stringify(population));

    });

});