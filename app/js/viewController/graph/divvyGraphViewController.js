/**
 * Created by Luca on 17/11/2014.
 */
var DivvyGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var super_dispose = self.dispose;
    var pieChicago;
    var pieSelection;
    var titleChicago;
    var titleSelection;
    var dimensSquare = 40;
    var _xChicago = 10;
    var _xSelection = 55;
    self.dispose = function () {
        super_dispose();
    };

    var init = function() {
        self.view.classed("divvy-graph-view-controller", true);
        self.addLegenda([{text:"Full", color:Colors.graph.CHICAGO},
            {text:"Empty", color:Colors.graph.SELECTION}]);
        pieChicago = PieChartView([30,70],[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieChicago);
        pieChicago.width = dimensSquare + "%";
        pieChicago.height = dimensSquare + "%";
        pieChicago.y = 50 - (dimensSquare/2) + "%";
        pieChicago.x = _xChicago + "%";

        titleChicago = self.view.append("text");
        titleChicago.text("Chicago");
        titleChicago.attr("y",((50 - (dimensSquare/2) - 2.5) + "%"));
        titleChicago.attr("x",_xChicago + "%");
        titleChicago.attr("width",dimensSquare + "%");
        titleChicago.attr("height", "10%");
        titleChicago.classed("label-single-graph",true);
        self.view.append(titleChicago);

        pieSelection = PieChartView([30,70],[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pieSelection);
        pieSelection.width = dimensSquare + "%";
        pieSelection.height = dimensSquare + "%";
        pieSelection.y = 50 - (dimensSquare/2) + "%";
        pieSelection.x = _xSelection + "%";

        titleSelection = self.view.append("text");
        titleSelection.text("Selection");
        titleSelection.attr("y",((50 - (dimensSquare/2) - 2.5) + "%"));
        titleSelection.attr("x",_xSelection + "%");
        titleSelection.attr("width",dimensSquare + "%");
        titleSelection.attr("height", "10%");
        titleSelection.classed("label-single-graph",true);
        self.view.append(titleSelection);
    }();

    return self;
};