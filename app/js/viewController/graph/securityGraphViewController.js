var SecurityGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataChicago = [0,0,0,0];
    var _dataSelection = [0,0,0,0];
    var super_dispose = self.dispose;
    var barchart;
    var popC = dataPopulationModel.getPopulationInChicago();
    var popS = 1;
    var factor = 100000;
    var legendBar;
    var mainTitle;

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
        if (popS === 0) {
           popS = 1;
        }
        if (barchart){
            barchart.remove();
        }
        if (!selectionModel.isEmpty() && dataCrimeCategory1Model.data && dataCrimeCategory2Model.data && dataCrimeCategory3Model.data && dataCrimeCategory4Model.data){
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
            tmpArray[j] = (dataChicago[i]/popC) * factor;
            tmpArray[j+1] = (dataSelection[i]/popS) * factor;
            j = j + 2;
        }
        return tmpArray;
    };


    var addBarChart = function() {
        barchart = HorizontalBarView(getAlternateArray(_dataChicago,_dataSelection),["Personal Assault","Property Crime","Unsafe Area", "Minor Crime"],
            [Colors.graph.CHICAGO, Colors.graph.SELECTION],
            "Crimes per ", d3.format(",")(factor) + " people");
        barchart.width = "90%";
        barchart.height = "90%";
        barchart.y = "25%";
        self.view.append(barchart);
    };


    var init = function() {

        dataCrimeTypeCityModel.fetchData();

        legendBar = self.addLegenda([{text:"Chicago", color:Colors.graph.CHICAGO},
            {text:"Selection", color:Colors.graph.SELECTION}]);

        mainTitle = self.addTitle("Comparison Crime Density","50%" ,"20%");

        dataCrimeCategory1Model.subscribe(Notifications.data.crime.CRIME_CATEGORY1_CHANGED,callBackDataSelection);
        dataCrimeCategory2Model.subscribe(Notifications.data.crime.CRIME_CATEGORY2_CHANGED,callBackDataSelection);
        dataCrimeCategory3Model.subscribe(Notifications.data.crime.CRIME_CATEGORY3_CHANGED,callBackDataSelection);
        dataCrimeCategory4Model.subscribe(Notifications.data.crime.CRIME_CATEGORY4_CHANGED,callBackDataSelection);
        dataCrimeTypeCityModel.subscribe(Notifications.data.crime.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
    }();

    return self;
};