var NoSelectionGraphViewController = function(layer, sublayer) {
    var self = GraphViewController(layer, sublayer);//ExternalSvgViewController("resource/graph/no-selection.svg");

    var init = function() {
        self.addLegenda([{text:"CHICAGO", color:Colors.graph.CHICAGO},
                        {text:"SELECTION", color:Colors.graph.SELECTION}]);


        if(sublayer == "Property Crime"){
            var verticalBar = HorizontalBarView([100,10,30,80],
                ["Prova", "Bau"],
                [Colors.graph.CHICAGO, Colors.graph.SELECTION],
                "crimes / population"
            );
        } else {
            var verticalBar = VerticalBarView([100,10,30,80,30,60,80,30],
                ["Prova", "Bau", "Ciao", "XXXXX"],
                [Colors.graph.CHICAGO, Colors.graph.SELECTION],
                "crimes / population"
            );
        }

        self.view.append(verticalBar);
    }();

    return self;
};