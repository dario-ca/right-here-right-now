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

    //////////////////////////// PUBLIC METHODS //////////////////////////////



    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var drawSelections = function() {
        var selections = selectionModel.getSelection();

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

    };

    var movingMode = function() {
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