/**
 *  Class UIBackgroundView
 *  Base class for the <div> element
 */
var UIBackgroundView = function() {

    var self = UIGView();
    var _rect;


    /** PUBLIC FUNCTIONS**/
    self.changeColor = function(color) {
        _rect.style("fill", color);
    };


    /** PRIVATE FUNCTIONS**/



    var init = function() {

        self.classed("ui-background-view", true);

        _rect = self.append("rect")
            .attr("width","100%")
            .attr("height","100%");

    }();

    return self;
};