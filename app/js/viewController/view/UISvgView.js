/**
 *  Class UISVGView
 */
var UISvgView = function() {
    var self = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    var uiView = UIView();
    //Inherit also from uiview
    for (var attribute in uiView) { self[attribute] = uiView[attribute]; }
    uiView.self = self;

    /** PUBLIC FUNCTIONS**/


    /**
     * Set the view viewBox
     * @param x
     * @param y
     * @param width
     * @param height
     */
    self.setViewBox = function(x, y, width, height) {
        self.attr("viewBox", x + " " + y + " " + width + " " + height);
    };

    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};