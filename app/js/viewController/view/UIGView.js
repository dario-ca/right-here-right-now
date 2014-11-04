/**
 *  Class UIGView
 *  Base class for the <g> element
 */
var UIGView = function() {
    var self = UIView();
    self.__proto__ = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'g'));



    /** PUBLIC FUNCTIONS**/


    /**
     * Set the translation
     * @param x
     * @param y
     */
    self.setTranslation = function(x, y) {
        console.log("NOT REALLY IMPLEMENTED");
        self.attr("transform", "translate=(" + [x, y] + ")");
    };

    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};