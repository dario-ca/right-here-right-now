var GraphsFactory = function() {
    var self = {};

    self.layerGraphs = [];

    self.populateGraphs = function() {
        self.layerGraphs = {

            "SECURITY": {
                graph: {class: SecurityGraphViewController, position: GraphPosition.TOP},
                sublayers: {
                    "Personal Assault": {
                        graph: {class: SubSecurityGraphViewController, position: GraphPosition.BOTTOM}
                    },
                    "Property Crime": {
                        graph: {class: SubSecurityGraphViewController, position: GraphPosition.BOTTOM}
                    },
                    "Mice": {
                        graph: {class: SubSecurityGraphViewController, position: GraphPosition.BOTTOM}
                    },
                    "Pigeons": {
                        graph: {class: SubSecurityGraphViewController, position: GraphPosition.BOTTOM}
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
            },
            "INFORMATION": {
                sublayers: {
                    "Pothole": {
                        graph: {class: DoublePieGraphViewController, position: GraphPosition.FULL}
                    },
                    "Light": {
                        graph: {class: DoublePieGraphViewController, position: GraphPosition.FULL}
                    },
                    "Abandoned Vehicle": {
                        graph: {class: DoublePieGraphViewController, position: GraphPosition.FULL}
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