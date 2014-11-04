/**
 *  Class UIView
 */
var UIView = function() {
    var self = {};

    /** PUBLIC FUNCTIONS**/

    /**
     * Add a subview to the currentView
     * @param subview (UIView)
     *
     * Try to avoid this function, and use only appendTo
     * If you find this function useful, ask Francesco
     */
    /*self.add = function(subview) {
        self.node().appendChild(subview.node());
    };*/

    /**
     * Append the current view to the given d3Element (parent view)
     * @param d3Element
     */
    self.appendTo = function(d3Element) {
        $(d3Element.node()).append(function(){return self.node()});
        return self;

    };


    self.__defineSetter__("id", function(a){
        self.attr("id", a);
    });

    self.__defineGetter__("id", function(){
        return self.attr("id");
    });




    /** PRIVATE FUNCTIONS**/



    var init = function() {


    }();

    return self;
};