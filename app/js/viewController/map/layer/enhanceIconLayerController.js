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
        var viewController = addCircle(lat, lng, radius);
        var circle = viewController.view.circle;
        circle.style("fill", Colors.enhanceIcon.WARNING);
        _warningCircles.push(circle);
        return viewController;
    };


    self.addDanger = function(lat, lng, radius) {
        var viewController = addCircle(lat, lng, radius);
        var circle = viewController.view.circle;
        circle.style("fill", Colors.enhanceIcon.DANGER);
        _dangerCircles.push(circle);
        return viewController;
    };


    var addCircle = function(lat, lng, radius) {
        var point = self.project(lat,lng);
        var viewController = SvgViewController();
        viewController.view.width = radius * 2;
        viewController.view.height = radius * 2;
        viewController.view.x = point.x - viewController.view.width/2;
        viewController.view.y = point.y - viewController.view.height/2;
        viewController.view.setViewBox(0,0,1,1);
        var circle = viewController.view.append("circle")
                            .attr("r", 0.5)
                            .attr("opacity", _circleOpacity)
                            .attr("cx", 0.5)
                            .attr("cy", 0.5);

        self.view.append(viewController);
        viewController.view.circle = circle
        self.fixControllerSize(viewController, true);

        circle.classed("enhance-icon", true);
        return viewController;
    };


    var init = function() {
        self.view.classed("enhance-icon-layer-controller", true);
        notificationCenter.subscribe(Notifications.enhanceIcon.SELECTION_CHANGED, self.onEnhanceIconChanged);

    }();

    return self;
};

