function EnhanceIconLayerController() {
    var self = MapLayerController();


    var _warningCircles = [],
        _dangerCircles = [];

    var _circleOpacity = 0.6;

    self.onEnhanceIconChanged = function() {

        if(enhanceIconModel.danger){
            _dangerCircles.forEach(function(c){
                c.attr("opacity", _circleOpacity);
            });
        } else {
            _dangerCircles.forEach(function(c){
                c.attr("opacity", 0);
            });
        }


        if(enhanceIconModel.warning) {
            _warningCircles.forEach(function(c){
                c.attr("opacity", _circleOpacity);
            });
        } else {
            _warningCircles.forEach(function(c){
                c.attr("opacity", 0);
            });
        }

    };


    self.addWarning = function(lat, lng, radius) {
        var circle = addCircle(lat, lng, radius);
        circle.style("fill", Colors.enhanceIcon.WARNING);
        _warningCircles.push(circle);
        return circle;
    };


    self.addDanger = function(lat, lng, radius) {
        var circle = addCircle(lat, lng, radius);
        circle.style("fill", Colors.enhanceIcon.DANGER);
        _dangerCircles.push(circle);
        return circle;
    };


    var addCircle = function(lat, lng, radius) {
        var point = self.project(lat,lng);

        var circle = self.view.append("circle")
                            .attr("r", radius)
                            .attr("opacity", _circleOpacity)
                            .attr("cx", point.x)
                            .attr("cy", point.y);
        circle.classed("enhance-icon", true);
        return circle;
    };


    var init = function() {
        self.view.classed("enhance-icon-layer-controller", true);
        notificationCenter.subscribe(Notifications.enhanceIcon.SELECTION_CHANGED, self.onEnhanceIconChanged);

    }();

    return self;
};

