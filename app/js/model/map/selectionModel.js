/**
 *
 * @constructor
 */
var SelectionModel = function() {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = {};
    var rectangles = [];


    ////////////////////////// PUBLIC METHODS //////////////////////////
    /*
     * point1 [lat, lon]
     * point2 [lat, lon]
     */
    self.addRectangleSelection = function(point1, point2) {
        var rectangle = Rectangle();
        rectangle.addPoint([point1[0], point1[1]]);
        rectangle.addPoint([point1[0], point2[1]]);
        rectangle.addPoint([point2[0], point2[1]]);
        rectangle.addPoint([point2[0], point1[1]]);
        rectangles.push(rectangle);
    }

    self.removeSelection = function() {
        var rectangles = [];
    }

    self.getSelection = function() {
        return rectangles;
    }


    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
    } ();

    return self;
};

var Rectangle = function() {
    var self = {};

    // {array} [latitude, longitude]
    var points = [];

    /**
     *
     * @returns Rectangle
     */
    self.circumscribed = function() {
        var minLat = Number.MAX_VALUE;
        var maxLat = Number.MIN_VALUE;
        var minLon = Number.MAX_VALUE;
        var maxLon = Number.MIN_VALUE;
        for(var i in points) {
            var point = points[i];
            if(point[0] < minLat)
                minLat = point[0];
            if(point[0] > maxLat)
                maxLat = point[0];
            if(point[1] < minLon)
                minLon = point[1];
            if(point[0] > maxLon)
                maxLon = point[1];
        }
        var rectangle = Rectangle();
        rectangle.addPoint([minLat, minLon]);
        rectangle.addPoint([minLat, maxLon]);
        rectangle.addPoint([maxLat, maxLon]);
        rectangle.addPoint([maxLat, minLon]);

        return rectangle;
    };

    self.addPoint = function(point) {
        points.push(point);
    };

    self.__defineGetter__("points", function() {
        return points;
    });

    return self;
};

var selectionModel = SelectionModel();
