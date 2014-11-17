/**
 * Created by Luca on 17/11/2014.
 */
var DivvyGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var super_dispose = self.dispose;
    var pieChicago;
    var pieSelection;
    var dimensSquare = 40;
    self.dispose = function () {
        super_dispose();
    };

    var init = function() {
        self.view.classed("divvy-graph-view-controller", true);
        self.addLegenda([{text:"Prova", color:Colors.graph.CHICAGO},
            {text:"SELECTION", color:Colors.graph.SELECTION}]);
        pieChicago = PieChartView([30,70],[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieChicago);
        pieChicago.width = dimensSquare + "%";
        pieChicago.heigth = dimensSquare + "%";
        pieChicago.y = dimensSquare/2 + "%";
        pieChicago.x = "10%";

        pieSelection = PieChartView([30,70],[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.heigth = dimensSquare + "%";
        pieSelection.y = dimensSquare/2 + "%";
        pieSelection.x = "55%";
    }();

    return self;
};