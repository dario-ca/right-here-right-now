var GraphsFactory = function() {
    var self = {};

    self.layerGraphs = [];

    self.populateGraphs = function() {
        self.layerGraphs = {

            "SECURITY": {
                graph: {class: SecurityGraphViewController, position: GraphPosition.TOP},
                sublayers: {
                    "Personal Assault": {
                        graph: {class: NoSelectionGraphViewController, position: GraphPosition.BOTTOM}
                    },
                    "Property Crime": {
                        graph: {class: NoSelectionGraphViewController, position: GraphPosition.BOTTOM}
                    }
                }

            },
            "MOBILITY": {
                sublayers: {
                    "Divvy": {
                        graph: {class: DivvyGraphViewController, position: GraphPosition.FULL}
                    },
                    "Buses": {
                        graph: {class: CtaGraphViewController, position: GraphPosition.FULL}
                    }
                }
            }

        }
    };

    var init = function(){



    }();

    return self;
};

var GraphPosition = {
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    FULL: "FULL"
};