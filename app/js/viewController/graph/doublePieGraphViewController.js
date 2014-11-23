/**
 * Created by Luca on 18/11/2014.
 */
var DoublePieGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataPieChicago = [0,0];
    var _dataPieSelection = [0,0];
    var subLayer = nameSubLayer;
    var factor = 100;
    var super_dispose = self.dispose;
    var pieChicago;
    var pieSelection;
    var barchart;
    var titleChicago;
    var titleSelection;
    var mainTitle;
    var secondTitle;
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
    var loadingTitle;
    var selectRequireTitle;

    self.dispose = function () {
        super_dispose();
        sourceDataCity.unsubscribe(notificationCity,callBackDataChicago);
        sourceDataSelection.unsubscribe(notificationSelection,callBackDataSelection);
        notificationCenter.unsubscribe(Notifications.selection.SELECTION_CHANGED,self.callBackLoading);
    };

    var callBackDataSelection = function() {
        if (barchart){
            barchart.remove();
        }
        if (pieSelection) {
            pieSelection.remove();
        }
        if (!selectionModel.isEmpty()&& sourceDataSelection.getSubTypes().length>= 1){
            areaS = dataPopulationModel.getAreaSelectionInKM2();
            _dataPieSelection = getArrayData(sourceDataSelection.getSubTypes());
            self.loadingTitle.attr("visibility","hidden");
            self.selectRequireTitle.attr("visibility","hidden");
            addPieSelection();
        } else {
            _dataPieSelection = [0,0];
            areaS = 1;
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
        barchart = HorizontalBarView([(_dataPieChicago[0] / areaC)*factor,
            (_dataPieSelection[0] / areaS)*factor,
            (_dataPieChicago[1] / areaC)*factor,
            (_dataPieSelection[1] / areaS)*factor],
            ["Completed","Open"],
            [Colors.graph.CHICAGO, Colors.graph.SELECTION],"occurrences per","square mile");
        barchart.width = "80%";
        barchart.height = "50%";
        barchart.y = "25%";
        barchart.x = "10%";
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

        switch (subLayer){
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

        titleChicago = self.addTitle("Chicago",_xChicago + "%",((_yCenter - (dimensSquare/2) - 1.5) + "%"));
        titleSelection = self.addTitle("Selection", _xSelection + "%",((_yCenter - (dimensSquare/2) - 1.5) + "%"));
        mainTitle = self.addTitle("Comparison " + subLayer + " Density","50%" ,"20%");
        secondTitle = self.addTitle("Relative Status","50%" ,((_yCenter - (dimensSquare/2) - 5) + "%"));

        self.addMessages(_xSelection + "%", _yCenter + "%");
        self.callBackLoading();

        sourceDataCity.subscribe(notificationCity,callBackDataChicago);
        sourceDataSelection.subscribe(notificationSelection,callBackDataSelection);
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,self.callBackLoading);
    }();

    return self;
};