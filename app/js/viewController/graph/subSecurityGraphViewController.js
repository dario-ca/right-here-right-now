/**
 * Created by Luca on 19/11/2014.
 */
var SubSecurityGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataChicago = null;
    var _dataSelection = null;
    var super_dispose = self.dispose;
    var barchart;
    var popC = dataPopulationModel.getPopulationInChicago();
    var popS = 1;
    var maxElem = 5;
    var sourceDataSelection;
    var notificationSelection;
    var legendBar;
    var arrayLabels;
    var factor = 100000;

    self.dispose = function () {
        super_dispose();
        dataCrimeTypeCityModel.unsubscribe(Notifications.data.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
        sourceDataSelection.unsubscribe(notificationSelection,callBackDataSelection);
    };

    var callBackDataSelection = function() {
        popS = dataPopulationModel.getPopulationInCurrentSelection();
        if (barchart){
            barchart.remove();
        }
        if (!selectionModel.isEmpty()&& sourceDataSelection.getSubTypes().length>= 1){
            _dataSelection = sourceDataSelection.getSubTypes();
        } else {
            _dataSelection = null;
        }
        addBarChart();
    };

    var callBackDataChicago = function() {
        if (barchart){
            barchart.remove();
        }
        if (dataCrimeTypeCityModel.data && dataCrimeTypeCityModel.data.length>= 1){
            _dataChicago = dataCrimeTypeCityModel.data;
        } else {
            _dataChicago = null;
        }
        addBarChart()
    };

    var getAlternateArray = function(dataChicago, dataSelection){
        var tmpArray = [];
        var tmpSele = [];
        arrayLabels = [];
        tmpSele = _.sortBy(dataSelection, function(num) {
            return -num.total;
        });
        var found;
        for (var i = 0; i < maxElem && i < dataSelection.length; i++) {
            found = false;

            //some names are too long, Dario has mapped them to a shorter name
            var label = null;
            if(DataCrimeModel.longToShortName[dataSelection[i].name]) {
                label = DataCrimeModel.longToShortName[dataSelection[i].name].toLowerCase();
            } else {
                label = dataSelection[i].name.toLowerCase();
            }

            arrayLabels.push(label);
            for (var j = 0; j < dataChicago.length; j++){
                if (dataSelection[i].name === dataChicago[j].name){
                    tmpArray.push((dataChicago[j].total/popC) * factor);
                    tmpArray.push((dataSelection[i].total/popS) * factor);
                    found = true;
                }
            }
            if (!found){
                tmpArray.push(0);
                tmpArray.push(Number((dataSelection[i].total/popS) * factor).toFixed(3));
            }
        }
        return tmpArray;
    }

    var addBarChart = function() {
        if (_dataChicago && _dataSelection){
            barchart = VerticalBarView(getAlternateArray(_dataChicago,_dataSelection),arrayLabels,[Colors.graph.CHICAGO, Colors.graph.SELECTION],
                "Crimes per ", d3.format(",")(factor) + " people");
            //barchart.width = "80%";
            //barchart.height = "50%";
            //barchart.y = "20%";
            self.view.append(barchart);
        }
    };

    var init = function() {

        switch (nameSubLayer){
            case "Personal Assault":;
                notificationSelection = Notifications.data.CRIME_CATEGORY1_CHANGED;
                sourceDataSelection = dataCrimeCategory1Model;
                break;
            case "Property Crime":
                notificationSelection = Notifications.data.CRIME_CATEGORY2_CHANGED;
                sourceDataSelection = dataCrimeCategory2Model;
                break;
            case "Mice":
                notificationSelection = Notifications.data.CRIME_CATEGORY3_CHANGED;
                sourceDataSelection = dataCrimeCategory3Model;
                break;
            case "Pigeons":
                notificationSelection = Notifications.data.CRIME_CATEGORY4_CHANGED;
                sourceDataSelection = dataCrimeCategory4Model;
                break;

        }
        dataCrimeTypeCityModel.fetchData();

        legendBar = self.addLegenda([{text:"Chicago", color:Colors.graph.CHICAGO},
            {text:"Selection", color:Colors.graph.SELECTION}]);

        dataCrimeTypeCityModel.subscribe(Notifications.data.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
        sourceDataSelection.subscribe(notificationSelection,callBackDataSelection);
    }();

    return self;
};