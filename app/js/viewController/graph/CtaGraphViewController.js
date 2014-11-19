/**
 * Created by Luca on 17/11/2014.
 */
var CtaGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var _dataPieSelection = [1,1];
    var super_dispose = self.dispose;
    var pieSelection;
    var titleSelection;
    var dimensSquare = 40;
    var _xSelection = 50;
    var _yCenter = 50;
    var legendPies;
    dataDivvyModel.selection
    self.dispose = function () {
        super_dispose();
        dataDivvyModel.unsubscribe(Notifications.data.BUS_CHANGED,callBack);
    };

    var callBack = function() {
        if (pieSelection) {
            pieSelection.remove();
        }
        if (!selectionModel.isEmpty()){
            _dataPieSelection = getArrayData(dataDivvyModel.selection);
            addPieSelection();
        } else {
            _dataPieSelection = [0,0];
        }

    };

    var addPieSelection = function() {
        pieSelection = PieChartView(_dataPieSelection,[Colors.graph.IN_TIME, Colors.graph.LATE]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.height = dimensSquare + "%";
        pieSelection.y = _yCenter - (dimensSquare/2) + "%";
        pieSelection.x = _xSelection - (dimensSquare/2)  + "%";
    };

    var getArrayData = function(data) {
        if (!data) {
            return null;
        }
        return [data.bikesAvailable, data.placesAvailable];
    }

    var init = function() {

        _dataPieSelection = getArrayData(dataDivvyModel.selection) || [1,1];

        legendPies = self.addLegenda([{text:"In time", color:Colors.graph.IN_TIME},
            {text:"Late", color:Colors.graph.LATE}]);
        legendPies.view.attr("y",_yCenter - 20 + "%");

        addPieSelection();
        titleSelection = self.addTitle("Selection",_xSelection + "%",((_yCenter - (dimensSquare/2) - 2.5) + "%"));

        dataDivvyModel.subscribe(Notifications.data.BUS_CHANGED,callBack);
    }();

    return self;
};