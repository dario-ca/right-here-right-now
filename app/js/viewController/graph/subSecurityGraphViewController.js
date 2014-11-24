/**
 * Created by Luca on 19/11/2014.
 */
var SubSecurityGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataChicago = [];
    var _dataSelection = [];
    var subLayer = nameSubLayer;
    var super_dispose = self.dispose;
    var barchart;
    var mainTitle;
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
        dataCrimeTypeCityModel.unsubscribe(Notifications.data.crime.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
        sourceDataSelection.unsubscribe(notificationSelection,callBackDataSelection);
        notificationCenter.unsubscribe(Notifications.selection.SELECTION_CHANGED,self.callBackLoading);
    };

    var callBackDataSelection = function() {
        popS = dataPopulationModel.getPopulationInCurrentSelection();
        if (popS === 0) {
            popS = 1;
        }
        if (barchart){
            barchart.remove();
        }
        if (!selectionModel.isEmpty()&& sourceDataSelection.getSubTypes().length>= 1){
            _dataSelection = sourceDataSelection.getSubTypes();
            self.loadingTitle.attr("visibility","hidden");
            self.selectRequireTitle.attr("visibility","hidden");
        } else {
            _dataSelection = [];
        }
        addBarChart();
    };

    var callBackDataChicago = function() {
        if (barchart){
            barchart.remove();
        }
        if (dataCrimeTypeCityModel.data && dataCrimeTypeCityModel.data.length>= 1){
            _dataChicago = dataCrimeTypeCityModel.data;
            self.loadingTitle.attr("visibility","hidden");
            self.selectRequireTitle.attr("visibility","hidden");
        } else {
            _dataChicago = [];
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
        for (var i = 0; i < maxElem && i < tmpSele.length; i++) {
            found = false;

            //some names are too long, Dario has mapped them to a shorter name
            var label = null;
            if(DataCrimeModel.longToShortName[tmpSele[i].name]) {
                label = DataCrimeModel.longToShortName[tmpSele[i].name].toLowerCase();
            } else {
                label = tmpSele[i].name.toLowerCase();
            }

            arrayLabels.push(label);
            for (var j = 0; j < dataChicago.length; j++){
                if (tmpSele[i].name === dataChicago[j].name){
                    tmpArray.push((dataChicago[j].total/popC) * factor);
                    tmpArray.push((tmpSele[i].total/popS) * factor);
                    found = true;
                }
            }
            if (!found){
                tmpArray.push(0);
                tmpArray.push((tmpSele[i].total/popS) * factor);
            }
        }
        return tmpArray;
    }

    var addBarChart = function() {
        barchart = VerticalBarView(getAlternateArray(_dataChicago,_dataSelection),arrayLabels,[Colors.graph.CHICAGO, Colors.graph.SELECTION],
            "Crimes per ", d3.format(",")(factor) + " people");
        barchart.y = "5%";
        self.view.append(barchart);
    };

    var init = function() {

        switch (subLayer){
            case "Personal Assault":
                notificationSelection = Notifications.data.crime.CRIME_CATEGORY1_CHANGED;
                sourceDataSelection = dataCrimeCategory1Model;
                break;
            case "Property Crime":
                notificationSelection = Notifications.data.crime.CRIME_CATEGORY2_CHANGED;
                sourceDataSelection = dataCrimeCategory2Model;
                break;
            case "Unsafe Area":
                notificationSelection = Notifications.data.crime.CRIME_CATEGORY3_CHANGED;
                sourceDataSelection = dataCrimeCategory3Model;
                break;
            case "Minor Crime":
                notificationSelection = Notifications.data.crime.CRIME_CATEGORY4_CHANGED;
                sourceDataSelection = dataCrimeCategory4Model;
                break;

        }
        dataCrimeTypeCityModel.fetchData();

        legendBar = self.addLegenda([{text:"Chicago", color:Colors.graph.CHICAGO},
            {text:"Selection", color:Colors.graph.SELECTION}]);

        mainTitle = self.addTitle("Common crimes of selection in "  + subLayer,"50%" ,"5%");

        self.addMessages("50%","25%");
        self.callBackLoading();
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,self.callBackLoading);
        dataCrimeTypeCityModel.subscribe(Notifications.data.crime.CRIME_TYPE_CITY_CHANGED,callBackDataChicago);
        sourceDataSelection.subscribe(notificationSelection,callBackDataSelection);
        callBackDataChicago();
    }();

    return self;
};