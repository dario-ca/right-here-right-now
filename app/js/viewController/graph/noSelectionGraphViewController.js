var NoSelectionGraphViewController = function(layer, sublayer) {
    var self = GraphViewController(layer, sublayer);//ExternalSvgViewController("resource/graph/no-selection.svg");

    var init = function() {
        self.addLegenda([{text:"CHICAGO", color:Colors.graph.CHICAGO},
                        {text:"SELECTION", color:Colors.graph.SELECTION}]);


        var verticalBar = VerticalBarView([100,10,30,80,30,60,80,30],
            ["Prova", "Bau", "Ciao", "XXXXX"],
            [Colors.graph.CHICAGO, Colors.graph.SELECTION],
            "crimes / population"
        );
        self.view.append(verticalBar);
    }();

    return self;
};