/**
 *
 * @constructor
 */
var SelectionMode = {
    SELECTION_NEARBY : "SELECTION_NEARBY",
    SELECTION_AREA: "SELECTION_AREA",
    SELECTION_PATH: "SELECTION_PATH",
    SELECTION_NONE: "SELECTION_NONE"
};


var SelectionModel = function() {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = {};
    var rectangles = [];

    var _selectionMode = SelectionMode.SELECTION_NONE;

    var Dx = 0.003;       // Width of the automatic selection around path
    var Dy = 0.003;

    self.points = [];   // Contains the selected points
    self.lines = [];    // Contains the lines that connects selected points

    ////////////////////////// PUBLIC ATTRIBUTES //////////////////////////

    self.selectedPoints = [];

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

        selectionChanged();
    };

    self.addPoint = function(point) {
        self.selectedPoints.push(point);
        notificationCenter.dispatch(Notifications.selection.SELECTION_POINTS_CHANGED);
    };

    self.removeSelection = function() {
        // Represent the actual selection
        rectangles = [];
        self.points = [];
        self.lines = [];

        selectionChanged();
    };

    self.removePath = function() {
        self.selectedPoints = [];
        self.removeSelection();
    };

    self.getSelection = function() {
        return rectangles;
    };

    /**
     * Get only one rectangle that circunscribe the selection
     * @returns {Array} [Rectangle]
     */
    self.getCircumscribedSelection = function() {
        var minLat = Number.MAX_VALUE;
        var maxLat = -Number.MAX_VALUE;
        var minLon = Number.MAX_VALUE;
        var maxLon = -Number.MAX_VALUE;

        if(rectangles.length <= 0)
            return [];

        rectangles.forEach(function(rectangle) {
            var points = rectangle.points;
            for(var i in points) {
                var point = points[i];
                if(point[0] < minLat)
                    minLat = point[0];
                if(point[0] > maxLat)
                    maxLat = point[0];
                if(point[1] < minLon)
                    minLon = point[1];
                if(point[1] > maxLon)
                    maxLon = point[1];
            }
        });

        var rectangle = Rectangle();
        rectangle.addPoint([minLat, minLon]);
        rectangle.addPoint([minLat, maxLon]);
        rectangle.addPoint([maxLat, maxLon]);
        rectangle.addPoint([maxLat, minLon]);

        return [rectangle];

    };

    self.isEmpty = function() {
        return rectangles == 0;
    };

    /**
     * point: {array} [lat, lon]
     * @return: {bool} true if point inside, false otherwise
     **/
    self.pointInside = function(point) {
        /*
        return _.filter(rectangles, function(rect) {
           return rect.pointInside(point);
        }).length > 0;
        */
        // Optimized version
        for(var i = 0; i < rectangles.length; i++) {
            if(rectangles[i].pointInside(point) == true)
                return true;
        }
        return false;
    };


    self.__defineSetter__("selectionMode", function(mode){
       _selectionMode = mode;
        notificationCenter.dispatch(Notifications.selection.SELECTION_MODE_CHANGED);
    });


    self.__defineGetter__("selectionMode", function(){
        return _selectionMode;
    });

    /**
     * Bad hack created in order to break the circular dependence between
     * DataModel -> SelectionModel -> DataGoogeDirectionModel -> DataModel -> ...
     */
    self.subscribeToGoogleDirections = function() {
        dataGoogleDirectionModel.subscribe(Notifications.data.DIRECTION_CHANGED, onDirectionChanged);
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var selectionChanged = function() {
        notificationCenter.dispatch(Notifications.selection.SELECTION_CHANGED);
    };

    var onDirectionChanged = function() {
        var routes = dataGoogleDirectionModel.data;

        self.removeSelection();  // remove old selection

        self.points = [];
        self.lines = [];

        var route = routes[0]; // Take only the first route

        if(route == undefined || route.legs == undefined)
            return;

        // Insert all the points
        route.legs.forEach(function(leg) {
            self.points.push([leg.start_location.lat, leg.start_location.lng]);
            self.points.push([leg.end_location.lat  , leg.end_location.lng  ]);
        });

        // Create lines and rectangles
        route.legs.forEach(function(leg) {
            leg.steps.forEach(function(step) {
                var start = step.start_location;
                var end  = step.end_location;

                // Create line
                self.lines.push([[start.lat, start.lng], [end.lat, end.lng]]);

                // Calculate the rectangles
                var a = [];
                var b = [];
                var c = [];
                var d = [];
                var e = [];
                var f = [];
                var g = [];
                var h = [];

                a[0] = start.lat - Dx;
                a[1] = start.lng + Dy;

                b[0] = start.lat + Dx;
                b[1] = start.lng + Dy;

                c[0] = start.lat + Dx;
                c[1] = start.lng - Dy;

                d[0] = start.lat - Dx;
                d[1] = start.lng - Dy;

                e[0] = end.lat - Dx;
                e[1] = end.lng + Dy;

                f[0] = end.lat + Dx;
                f[1] = end.lng + Dy;

                g[0] = end.lat + Dx;
                g[1] = end.lng - Dy;

                h[0] = end.lat - Dx;
                h[1] = end.lng - Dy;

                // Rectangle around start point
                var rectangle = Rectangle();
                rectangle.addPoint(a);
                rectangle.addPoint(b);
                rectangle.addPoint(c);
                rectangle.addPoint(d);
                rectangles.push(rectangle);

                // Rectangle between start point and end point
                rectangle = Rectangle();
                if(Math.abs(start.lng - end.lng) > Math.abs(start.lat - end.lat)) { // Semi-vertical rectangle
                    if(start.lng > end.lng) {
                        rectangle.addPoint(d);
                        rectangle.addPoint(c);
                        rectangle.addPoint(f);
                        rectangle.addPoint(e);

                    }
                    else {
                        rectangle.addPoint(h);
                        rectangle.addPoint(g);
                        rectangle.addPoint(b);
                        rectangle.addPoint(a);
                    }
                } else {
                    if(start.lat > end.lat) {
                        rectangle.addPoint(f);
                        rectangle.addPoint(a);
                        rectangle.addPoint(d);
                        rectangle.addPoint(g);

                    }
                    else {
                        rectangle.addPoint(b);
                        rectangle.addPoint(e);
                        rectangle.addPoint(h);
                        rectangle.addPoint(c);
                    }
                }
                rectangles.push(rectangle);
            });
        });

        var leg = route.legs[route.legs.length - 1];
        var step = leg.steps[leg.steps.length - 1];
        var end  = step.end_location;

        var e = [];
        var f = [];
        var g = [];
        var h = [];

        e[0] = end.lat - Dx;
        e[1] = end.lng + Dy;

        f[0] = end.lat + Dx;
        f[1] = end.lng + Dy;

        g[0] = end.lat + Dx;
        g[1] = end.lng - Dy;

        h[0] = end.lat - Dx;
        h[1] = end.lng - Dy;

        // Rectangle around final end point
        var rectangle = Rectangle();
        rectangle.addPoint(e);
        rectangle.addPoint(f);
        rectangle.addPoint(g);
        rectangle.addPoint(h);
        rectangles.push(rectangle);

        selectionChanged();
    };

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
        var maxLat = -Number.MAX_VALUE;
        var minLon = Number.MAX_VALUE;
        var maxLon = -Number.MAX_VALUE;
        for(var i in points) {
            var point = points[i];
            if(point[0] < minLat)
                minLat = point[0];
            if(point[0] > maxLat)
                maxLat = point[0];
            if(point[1] < minLon)
                minLon = point[1];
            if(point[1] > maxLon)
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

    self.pointInside = function(point) {

        if(points.length != 4)
            return false;
        /*
        return geolib.isPointInside(
            {latitude: point[0], longitude: point[1]},
            [
                {latitude: points[0][0], longitude: points[0][1]},
                {latitude: points[1][0], longitude: points[1][1]},
                {latitude: points[2][0], longitude: points[2][1]},
                {latitude: points[3][0], longitude: points[3][1]},
            ]
        );
        */

        // Superfast algorithm: all points same sign.
        //       (x        - xi          ) * (yi+1         - yi          ) - (xi+1         - xi          ) * (y        - yi          )
        var s0 = (point[0] - points[0][0]) * (points[1][1] - points[0][1]) - (points[1][0] - points[0][0]) * (point[1] - points[0][1]);
        var s1 = (point[0] - points[1][0]) * (points[2][1] - points[1][1]) - (points[2][0] - points[1][0]) * (point[1] - points[1][1]);
        var s2 = (point[0] - points[2][0]) * (points[3][1] - points[2][1]) - (points[3][0] - points[2][0]) * (point[1] - points[2][1]);
        var s3 = (point[0] - points[3][0]) * (points[0][1] - points[3][1]) - (points[0][0] - points[3][0]) * (point[1] - points[3][1]);

        if(Math.abs(
            (s0 > 0 ? 1 : -1) +
            (s1 > 0 ? 1 : -1) +
            (s2 > 0 ? 1 : -1) +
            (s3 > 0 ? 1 : -1)
            ) == 4)
            return true;
        else
            return false;
    };

    self.__defineGetter__("points", function() {
        return points;
    });

    return self;
};

var selectionModel = SelectionModel();

