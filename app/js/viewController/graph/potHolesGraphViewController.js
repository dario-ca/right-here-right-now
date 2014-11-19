/**
 * Created by Luca on 17/11/2014.
 */
var PotHolesGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataPieChicago = [1,1];
    var _dataPieSelection = [1,1];
    var super_dispose = self.dispose;
    var pieChicago;
    var pieSelection;
    var titleChicago;
    var titleSelection;
    var dimensSquare = 40;
    var _xChicago = 10;
    var _xSelection = 55;
    var _yCenter = 85;

    self.dispose = function () {
        super_dispose();
    };

    var callBackDataSelection = function() {
       _dataPieSelection = getArrayData(dataPotholeModel.getSubTypes());
        pieSelection.remove();
        addPieSelection();
    };

    var callBackDataChicago = function() {
        _dataPieChicago = getArrayData(dataPotholeCityModel.data);
        console.log(dataPotholeCityModel.data);
        pieChicago.remove();
        addPieChicago();
    };

    var addPieChicago = function () {
        pieChicago = PieChartView(_dataPieChicago,[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieChicago);
        pieChicago.width = dimensSquare + "%";
        pieChicago.height = dimensSquare + "%";
        pieChicago.y = _yCenter - (dimensSquare/2) + "%";
        pieChicago.x = _xChicago + "%";
    };

    var addPieSelection = function() {
        pieSelection = PieChartView(_dataPieSelection,[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.height = dimensSquare + "%";
        pieSelection.y = _yCenter - (dimensSquare/2) + "%";
        pieSelection.x = _xSelection + "%";
    };

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
        _dataPieChicago = getArrayData(dataPotholeCityModel.data) || [1,1];
        _dataPieSelection = getArrayData(dataPotholeModel.getSubTypes()) || [1,1];

        self.view.classed("pothole-graph-view-controller", true);
        self.addLegenda([{text:"Open", color:Colors.graph.CHICAGO},
            {text:"Closed", color:Colors.graph.SELECTION}]);

        addPieChicago();

        titleChicago = self.view.append("text");
        titleChicago.text("Chicago");
        titleChicago.attr("y",((_yCenter - (dimensSquare/2) - 2.5) + "%"));
        titleChicago.attr("x",_xChicago + "%");
        titleChicago.attr("width",dimensSquare + "%");
        titleChicago.attr("height", "10%");
        titleChicago.classed("label-single-graph",true);
        self.view.append(titleChicago);

        addPieSelection();

        titleSelection = self.view.append("text");
        titleSelection.text("Selection");
        titleSelection.attr("y",((_yCenter - (dimensSquare/2) - 2.5) + "%"));
        titleSelection.attr("x",_xSelection + "%");
        titleSelection.attr("width",dimensSquare + "%");
        titleSelection.attr("height", "10%");
        titleSelection.classed("label-single-graph",true);
        self.view.append(titleSelection);

        dataPotholeCityModel.subscribe(Notifications.data.POTHOLE_CITY_CHANGED,callBackDataChicago);
        dataPotholeModel.subscribe(Notifications.data.POTHOLE_CHANGED,callBackDataSelection);
    }();

    return self;
};