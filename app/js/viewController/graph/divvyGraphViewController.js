/**
 * Created by Luca on 17/11/2014.
 */
var DivvyGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataPieChicago = [1,1];
    var _dataPieSelection = [1,1];
    var super_dispose = self.dispose;
    var pieChicago;
    var pieSelection;
    var titleChicago;
    var titleSelection;
    var dimensSquare = 25;
    var _xChicago = 35;
    var _xSelection = 65;
    var _yCenter = 50;
    var legendPies;
    self.dispose = function () {
        super_dispose();
        dataDivvyModel.unsubscribe(Notifications.data.DIVVY_BIKES_CHANGED,callBack);
    };

    var callBack = function() {
        if (pieSelection) {
            pieSelection.remove();
        }
        if (pieChicago) {
            pieChicago.remove();
        }
        if (!selectionModel.isEmpty()){
            _dataPieSelection = getArrayData(dataDivvyModel.selection);
            addPieSelection();
        } else {
            _dataPieSelection = [0,0];
        }
        _dataPieChicago = getArrayData(dataDivvyModel.city);
        addPieChicago();

    };

    var addPieChicago = function () {
        pieChicago = PieChartView(_dataPieChicago,[Colors.graph.DIVVY_FULL, Colors.graph.DIVVY_EMPTY]);
        self.view.append(pieChicago);
        pieChicago.width = dimensSquare + "%";
        pieChicago.height = dimensSquare + "%";
        pieChicago.y = _yCenter - (dimensSquare/2) + "%";
        pieChicago.x = _xChicago - (dimensSquare/2) + "%";
    };

    var addPieSelection = function() {
        pieSelection = PieChartView(_dataPieSelection,[Colors.graph.DIVVY_FULL, Colors.graph.DIVVY_EMPTY]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.height = dimensSquare + "%";
        pieSelection.y = _yCenter - (dimensSquare/2) + "%";
        pieSelection.x = _xSelection - (dimensSquare/2)  + "%";
    };

    //bikesAvailable: 530
    //placesAvailable: 1165
    var getArrayData = function(data) {
        if (!data) {
            return null;
        }
        return [data.bikesAvailable, data.placesAvailable];
    }

    var init = function() {

        legendPies = self.addLegenda([{text:"Full slots", color:Colors.graph.DIVVY_FULL},
            {text:"Empty slots", color:Colors.graph.DIVVY_EMPTY}]);
        legendPies.view.attr("y",_yCenter - 20 + "%");

        titleChicago = self.addTitle("Chicago","35%",((_yCenter - (dimensSquare/2) - 2.5) + "%"));
        titleSelection = self.addTitle("Selection","65%",((_yCenter - (dimensSquare/2) - 2.5) + "%"));

        dataDivvyModel.subscribe(Notifications.data.DIVVY_BIKES_CHANGED,callBack);
    }();

    return self;
};