var SecurityGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataChicago = [0,0,0,0];
    var _dataSelection = [0,0,0,0];
    var super_dispose = self.dispose;
    var barchart;
    var popC = dataPopulationModel.getPopulationInChicago();
    var popS = 1;
    var factor = 1000;
    var legendBar;

    self.dispose = function () {
        super_dispose();
        dataCrimeCategory1Model.unsubscribe(Notifications.data.CRIME_CATEGORY1_CHANGED,callBackDataSelection);
        dataCrimeCategory2Model.unsubscribe(Notifications.data.CRIME_CATEGORY2_CHANGED,callBackDataSelection);
        dataCrimeCategory3Model.unsubscribe(Notifications.data.CRIME_CATEGORY3_CHANGED,callBackDataSelection);
        dataCrimeCategory4Model.unsubscribe(Notifications.data.CRIME_CATEGORY4_CHANGED,callBackDataSelection);
        dataCrimeTypeCityModel.unsubscribe(Notifications.data.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
    };

    var callBackDataSelection = function() {
        popS = dataPopulationModel.getPopulationInCurrentSelection();
        if (barchart){
            barchart.remove();
        }
        if (!selectionModel.isEmpty()){
            _dataSelection = [dataCrimeCategory1Model.data.length,dataCrimeCategory2Model.data.length,dataCrimeCategory3Model.data.length,dataCrimeCategory4Model.data.length]
        } else {
            _dataSelection = [0,0,0,0];
        }
        addBarChart()

    };

    var callBackDataChicago = function() {
        if (barchart){
            barchart.remove();
        }
        var data = dataCrimeTypeCityModel.getCategories();
        if (data){
            _dataChicago = [data.CATEGORY_1, data.CATEGORY_2,data.CATEGORY_3,data.CATEGORY_4];
        } else {
            _dataChicago = [0,0,0,0];
        }
        addBarChart()
    };

    var getAlternateArray = function (dataChicago, dataSelection) {
        var tmpArray = [];
        var j = 0;
        for (var i = 0; i < dataChicago.length; i++) {
            tmpArray[j] = Number((dataChicago[i]/popC) * factor).toFixed(3);
            tmpArray[j+1] = Number((dataSelection[i]/popS) * factor).toFixed(3);
            j = j + 2;
        }
        return tmpArray;
    }
    var addBarChart = function() {
        barchart = HorizontalBarView(getAlternateArray(_dataChicago,_dataSelection),["Personal Assault","Category 2","cat 3", "cat 4"],[Colors.graph.CHICAGO, Colors.graph.SELECTION],"Crime/population");
        barchart.width = "90%";
        barchart.height = "900%";
        barchart.y = "50%";
        self.view.append(barchart);
    }

    var init = function() {

        dataCrimeTypeCityModel.fetchData();

        legendBar = self.addLegenda([{text:"Chicago", color:Colors.graph.CHICAGO},
            {text:"Selection", color:Colors.graph.SELECTION}]);

        dataCrimeCategory1Model.subscribe(Notifications.data.CRIME_CATEGORY1_CHANGED,callBackDataSelection);
        dataCrimeCategory2Model.subscribe(Notifications.data.CRIME_CATEGORY2_CHANGED,callBackDataSelection);
        dataCrimeCategory3Model.subscribe(Notifications.data.CRIME_CATEGORY3_CHANGED,callBackDataSelection);
        dataCrimeCategory4Model.subscribe(Notifications.data.CRIME_CATEGORY4_CHANGED,callBackDataSelection);
        dataCrimeTypeCityModel.subscribe(Notifications.data.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
    }();

    return self;



    return self;
};