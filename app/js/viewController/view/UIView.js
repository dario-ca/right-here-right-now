/**
 *  Class UIView
 */
var UIView = function() {
    var self = {};

    /** PUBLIC FUNCTIONS**/

    /**
     * Add a subview to the currentView
     * @param subview (UIView)
     */
    self.add = function(subview) {
        self.node().appendChild(subview.node());
    };

    /**
     * Append the current view to the given d3Element (parent view)
     * @param d3Element
     */
    self.appendTo = function(d3Element) {
        $(d3Element.node()).append(function(){return self.node()});
        console.log(b);
    };


    self.__defineSetter__("self", function(newSelf) {
       self = newSelf;
    });

    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};