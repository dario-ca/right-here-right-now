/**
 * This class gives drag and drop features for the rectangular selection
 * SelectionRectangleViewController
 */

function SelectionRectangleViewController() {
    var self = MapLayerController();

    //////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var selectionRectangle = null;
    var startCoordinates = null;
    var stopCoordinates = null;
    var backGroundView = null;

    var mask;

    var polygons = [];   // Used in order to produce mask not rectangular
    self.lines = [];      // Contains the lines that connect the selected points
    self.points = [];     // Contains the selected point controllers

    //////////////////////////// PUBLIC METHODS //////////////////////////////



    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var drawSelections = function() {
        var selections = selectionModel.getSelection();
        var points = selectionModel.points;
        var lines = selectionModel.lines;

        // Remove lines
        self.lines.forEach(function(line) {
           line.remove();
        });
        self.lines = [];

        // Remove points
        self.points.forEach(function(point) {
           point.dispose();
        });
        self.points = [];

        selections.forEach(function(selection) {
            var polygon = mask.append("polygon")
                            .attr("fill", "#000000")
                            .attr("points",function(d) {
                                return selection.points.map(function(p) {
                                    var point = self.project(p[0], p[1]);
                                    return [point.x, point.y].join(",");
                                }).join(" ");
                            });
            polygons.push(polygon);
        });

        // Draw the lines that connects the selected points
        lines.forEach(function(line) {

            var p0 = self.project(line[0][0], line[0][1]);
            var p1 = self.project(line[1][0], line[1][1]);

            var l = self.view.append("line")
                .attr("x1", p0.x)
                .attr("y1", p0.y)
                .attr("x2", p1.x)
                .attr("y2", p1.y)
                .attr("stroke-width", 0.1)
                .attr("stroke", "black");

            self.lines.push(l);
        });

        // Draw the selected points
        points.forEach(function(point){
            var pointController = ExternalSvgViewController("resource/sublayer/icon/bus.svg");
            pointController.view.width = self.defaultIconSize;
            pointController.view.height= self.defaultIconSize;

            var p = self.project(point[0], point[1]);
            pointController.view.x = p.x;
            pointController.view.y = p.y;

            self.view.append(pointController);

            self.points.push(pointController);
        });
    };

    var removeSelection = function() {
        polygons.forEach(function(polygon) {
           polygon.remove();
        });
        polygon = [];
    };

    var updateSelection = function() {
        removeSelection();
        drawSelections();
    };

    var areaSelectionMode = function() {

        selectionModel.removePath();

        self.view.onDrag(function() {
                d3.event.sourceEvent.stopPropagation(); // Block the propagation of the drag signal
                startCoordinates = d3.mouse(self.view.node());

                if(selectionRectangle != null)
                    selectionRectangle.remove();

                selectionRectangle = mask
                    .append("rect")
                    .attr("x", startCoordinates[0])
                    .attr("y", startCoordinates[1])
                    .attr("fill", "#000000");

                // Remove the selection from the model
                selectionModel.removeSelection();
            },
            function() {
                d3.event.sourceEvent.stopPropagation(); // Block the propagation of the drag signal
                var relCoords = d3.mouse(self.view.node());
                if(selectionRectangle != undefined &&
                    startCoordinates != null) {
                    var width = relCoords[0] - startCoordinates[0];
                    var height = relCoords[1] - startCoordinates[1];
                    var coordinates = startCoordinates.slice();

                    if(width < 0) {
                        coordinates[0] += width;
                        width = -width;
                    }
                    if(height < 0) {
                        coordinates[1] += height;
                        height = -height;
                    }

                    selectionRectangle
                        .attr("x", coordinates[0])
                        .attr("y", coordinates[1])
                        .attr("width", width)
                        .attr("height", height);
                }
                stopCoordinates = relCoords;
            },
            function() {
                d3.event.sourceEvent.stopPropagation(); // Block the propagation of the drag signal
                selectionRectangle.remove();

                if(startCoordinates == null ||
                    stopCoordinates == null)
                    return;


                // Add the selection to the model
                var start = self.unproject(startCoordinates[0],
                    startCoordinates[1]);
                var stop = self.unproject(stopCoordinates[0],
                    stopCoordinates[1]);
                selectionModel.addRectangleSelection([start.lat, start.lng], [stop.lat, stop.lng]);
                startCoordinates = null;
                stopCoordinates = null;

                deselectAreaMode();
            });

    };

    var pathSelectionMode = function() {

        selectionModel.removePath();

        self.view.onClick(function() {
            var mouseCoordinates = d3.mouse(self.view.node());
            var coordinate = self.unproject(mouseCoordinates[0],
                                             mouseCoordinates[1]);
            selectionModel.addPoint([coordinate.lat, coordinate.lng]);
        });
    };

    var movingMode = function() {

        self.view.onClickRemove(); // No actions on click, propagate the signal

        self.view.onDrag(function(){},
                         function(){},
                         function(){}); // No actions on drag and drop, propagate the signal
    };

    var deselectAreaMode = function() {
        selectionModel.selectionMode = SelectionMode.SELECTION_NONE;
    };

    var updateSelectionMode = function() {
        switch(selectionModel.selectionMode) {
            case SelectionMode.SELECTION_AREA:
                areaSelectionMode();
                break;
            case SelectionMode.SELECTION_PATH:
                pathSelectionMode();
                break;
            default:
                movingMode();
                break;

        }
    };

    var init = function() {

        self.view.classed("selection-rectangle-view", true);

        // calculate coordinates for the svg
        self.view.append(UIBackgroundView());
        backGroundView = self.view.select("rect")
            .attr("mask","url(#mask)")
            .style("fill", "rgba(0,0,0,0.35)"); // Transparent background

        // Create mask
        mask = self.view.append("defs")
            .append("mask")
            .attr("id","mask");

        mask.append("rect")
            .attr("fill","#FFFFFF")
            .attr("x","0")
            .attr("y","0")
            .attr("height","100%")
            .attr("width","100%");

        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, updateSelection);
        notificationCenter.subscribe(Notifications.selection.SELECTION_MODE_CHANGED, updateSelectionMode);

    }();

    return self;
}