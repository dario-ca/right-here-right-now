var SecurityGraphViewController = function (nameLayer, nameSubLayer) {
    var self = GraphViewController(nameLayer, nameSubLayer);
    var super_dispose = self.dispose;
    self.dispose = function () {
        super_dispose();
    };

    var init = function() {
        self.view.classed("security-graph-view-controller", true);
        self.addLegenda([{text:"Prova", color:Colors.graph.CHICAGO},
            {text:"SELECTION", color:Colors.graph.SELECTION}]);
        var pie = PieChartView([30,70],[Colors.graph.SELECTION, Colors.graph.CHICAGO]);
        self.view.append(pie);
        pie.width = "50%";
    }();

    return self;
};