/**
 * Created by Luca on 17/11/2014.
 */
var CtaGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var super_dispose = self.dispose;
    var pieSelection;
    var titleSelection;
    var dimensSquare = 80;
    self.dispose = function () {
        super_dispose();
    };

    var init = function() {
        self.view.classed("divvy-graph-view-controller", true);
        self.addLegenda([{text:"In time", color:Colors.graph.CHICAGO},
            {text:"Late", color:Colors.graph.SELECTION}]);

        pieSelection = PieChartView([30,70],[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.heigth = dimensSquare + "%";
        pieSelection.y = "50%";
        pieSelection.x = dimensSquare/2 + "%";
    }();

    return self;
};