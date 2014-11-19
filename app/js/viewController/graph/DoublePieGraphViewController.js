/**
 * Created by Luca on 18/11/2014.
 */
var DoublePieGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataPieChicago = [0,0];
    var _dataPieSelection = [0,0];
    var factor = 100;
    var super_dispose = self.dispose;
    var pieChicago;
    var pieSelection;
    var barchart;
    var titleChicago;
    var titleSelection;
    var dimensSquare = 25;
    var _xChicago = 35;
    var _xSelection = 65;
    var _yCenter = 75;
    var areaC = dataPopulationModel.getAreaChicagoInKm2();
    var areaS = 1;
    var sourceDataCity;
    var sourceDataSelection;
    var notificationCity;
    var notificationSelection;
    var legendPies;
    var legendBar;

    self.dispose = function () {
        super_dispose();
        sourceDataCity.unsubscribe(notificationCity,callBackDataChicago);
        sourceDataSelection.unsubscribe(notificationSelection,callBackDataSelection);
    };

    var callBackDataSelection = function() {
        areaS = dataPopulationModel.getAreaSelectionInKM2();
        if (barchart){
            barchart.remove();
        }
        if (pieSelection) {
            pieSelection.remove();
        }
        if (!selectionModel.isEmpty()&& sourceDataSelection.getSubTypes().length>= 1){
            _dataPieSelection = getArrayData(sourceDataSelection.getSubTypes());
            addPieSelection();
        } else {
            _dataPieSelection = [0,0];
        }
        addBarChart()

    };

    var callBackDataChicago = function() {
        if (barchart){
            barchart.remove();
        }
        if (pieChicago){
            pieChicago.remove();
        }
        if (sourceDataCity.data && sourceDataCity.data.length>= 1){
            _dataPieChicago = getArrayData(sourceDataCity.data);
            addPieChicago()
        } else {
            _dataPieChicago = [0,0];
        }
        addBarChart()
    };

    var addPieChicago = function () {
        pieChicago = PieChartView(_dataPieChicago,[Colors.graph.COMPLETED, Colors.graph.OPEN]);
        self.view.append(pieChicago);
        pieChicago.width = dimensSquare + "%";
        pieChicago.height = dimensSquare + "%";
        pieChicago.y = _yCenter - (dimensSquare/2) + "%";
        pieChicago.x = _xChicago - (dimensSquare/2) + "%";
    };

    var addPieSelection = function() {
        pieSelection = PieChartView(_dataPieSelection,[Colors.graph.COMPLETED, Colors.graph.OPEN]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.height = dimensSquare + "%";
        pieSelection.y = _yCenter - (dimensSquare/2) + "%";
        pieSelection.x = _xSelection - (dimensSquare/2)  + "%";
    };

    var addBarChart = function() {
        barchart = HorizontalBarView([Number((_dataPieChicago[0] / areaC)*factor).toFixed(3),Number((_dataPieSelection[0] / areaS)*factor).toFixed(3),Number((_dataPieChicago[1] / areaC)*factor).toFixed(3),Number((_dataPieSelection[1] / areaS)*factor).toFixed(3)],["Completed","Open"],[Colors.graph.CHICAGO, Colors.graph.SELECTION],"sbaluba");
        barchart.width = "80%";
        barchart.height = "50%";
        barchart.y = "20%";
        self.view.append(barchart);
    }

    var getArrayData = function(data) {
        if (!data) {
            return null;
        }
        var tmpArray = [0,0];
        for (var i = 0; i<data.length; i++){
            if (data[i].name === "Completed"){
                tmpArray[0] = data[i].total;
            } else if (data[i].name === "Open"){
                tmpArray[1] = data[i].total;
            }
        }
        return tmpArray;
    }

    var init = function() {

        switch (nameSubLayer){
            case "Pothole":
                notificationCity = Notifications.data.POTHOLE_CITY_CHANGED;
                notificationSelection = Notifications.data.POTHOLE_CHANGED;
                sourceDataCity = dataPotholeCityModel;
                sourceDataSelection = dataPotholeModel;
                break;
            case "Abandoned Vehicle":
                notificationCity = Notifications.data.ABANDONED_VEHICLES_CITY_CHANGED;
                notificationSelection = Notifications.data.ABANDONED_VEHICLES_CHANGED;
                sourceDataCity = dataAbandonedCityModel;
                sourceDataSelection = dataVehiclesModel;
                break;
            case "Light":
                notificationCity = Notifications.data.LIGHT_OUT_SINGLE_CITY_CHANGED;
                notificationSelection = Notifications.data.LIGHT_OUT_SINGLE_CHANGED;
                sourceDataCity = dataLightOneCityModel;
                sourceDataSelection = dataLight1Model;
                break;

        }
        sourceDataCity.fetchData();

        legendBar = self.addLegenda([{text:"Chicago", color:Colors.graph.CHICAGO},
            {text:"Selection", color:Colors.graph.SELECTION}]);

        legendPies = self.addLegenda([{text:"Open", color:Colors.graph.OPEN},
            {text:"Completed", color:Colors.graph.COMPLETED}]);
        legendPies.view.attr("y",_yCenter - 20 + "%");

        titleChicago = self.addTitle("Chicago",_xChicago + "%",((_yCenter - (dimensSquare/2) - 2.5) + "%"));
        titleSelection = self.addTitle("Selection", _xSelection + "%",((_yCenter - (dimensSquare/2) - 2.5) + "%"));

        sourceDataCity.subscribe(notificationCity,callBackDataChicago);
        sourceDataSelection.subscribe(notificationSelection,callBackDataSelection);
    }();

    return self;
};