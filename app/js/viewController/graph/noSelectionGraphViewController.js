var NoSelectionGraphViewController = function(layer, sublayer) {
    var self = GraphViewController(layer, sublayer);//ExternalSvgViewController("resource/graph/no-selection.svg");

    var init = function() {
        self.addLegenda([{text:"CHICAGO", color:Colors.graph.CHICAGO},
                        {text:"SELECTION", color:Colors.graph.SELECTION}]);
    }();

    return self;
};