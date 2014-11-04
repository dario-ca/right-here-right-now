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





    /** PRIVATE FUNCTIONS**/

    var privateFunction = function(variable) {

    };



    var init = function() {


    }();

    return self;
};