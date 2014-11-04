/**
 *  Class ViewController
 */
var ViewController = function() {
    var self = {};

    self.view = null;
    self.children = [];

    /** PUBLIC FUNCTIONS**/

    self.addChild = function(childController) {
        self.view.append(childController.view);
        self.children.append(childController);
    };


    /**
     * Remove the view from the dom
     * Call dispose on every child
     */
    self.dispose = function() {
        self.children.forEach(function(child) {
            child.dispose();
        });

       self.view.remove();

    };


    /** PRIVATE FUNCTIONS**/


    var init = function() {


    }();

    return self;
};


/**
 *  Create a view controller with an SVG view
 */
var SvgViewController = function() {
    var viewController = ViewController();
    viewController.view = UISvgView();
};

/**
 *  Create a view controller with an G view
 */
var GViewController = function() {
    var viewController = ViewController();
    viewController.view = UIGView();
};

/**
 *  Create a view controller with an DIV view
 */
var DivViewController = function() {
    var viewController = ViewController();
    viewController.view = UIDivView();
};