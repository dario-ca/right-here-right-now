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

    self.dispose = function () {
        super_dispose();
        dataBusModel.unsubscribe(Notifications.data.BUS_CHANGED,callBack);
        notificationCenter.unsubscribe(Notifications.selection.SELECTION_CHANGED,self.callBackLoading);
    };

    var callBack = function() {
        if (pieSelection) {
            pieSelection.remove();
        }
        if (!selectionModel.isEmpty() && dataBusModel.data){
            _dataPieSelection = getArrayData(dataBusModel.selection);
            self.loadingTitle.attr("visibility","hidden");
            self.selectRequireTitle.attr("visibility","hidden");
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
        return [data.notDelayedBusses, data.delayedBusses];
    };

    var init = function() {

        legendPies = self.addLegenda([{text:"In time", color:Colors.graph.IN_TIME},
            {text:"Late", color:Colors.graph.LATE}]);
        legendPies.view.attr("y",_yCenter - 20 + "%");

        titleSelection = self.addTitle("Selection",_xSelection + "%",((_yCenter - (dimensSquare/2) - 2.5) + "%"));

        self.addMessages("50%","50%");
        self.callBackLoading();
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,self.callBackLoading);
        dataBusModel.subscribe(Notifications.data.BUS_CHANGED,callBack);
    }();

    return self;
};