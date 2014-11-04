/**
 *  Class Application
 */
var Application = function() {
    var self = {};


    var _privateVar = 1;

    self.publicVar = 5;

    /** PUBLIC FUNCTIONS**/

    /**
     * Documentation
     * @param a    dummy var
     */
    self.publicFunction = function(a) {

    };


    /*
    self.__defineGetter__("a", function(){
        return something;
    });
    */


    /** PRIVATE FUNCTIONS**/

    var privateFunction = function(variable) {

    };



    var init = function() {

        var layerFactory = LayerFactory();
        layerFactory.populateLayers();

    }();

    return self;
};