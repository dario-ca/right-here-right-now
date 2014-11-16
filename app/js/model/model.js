/**
 *  Class Model
 *  Base Sublayer
 */
var Model = function(name) {
    var self = {};

    self.layers = [];


    
    /** PUBLIC FUNCTIONS**/
    self.getLayerWithName = function(name) {
        var selectedLayer = null;
        if(name){
            self.layers.forEach(function(layer){
                if(layer.name.toUpperCase() === name.toUpperCase())
                    selectedLayer = layer;
            });
        }

        return selectedLayer;
    };


    /** PRIVATE FUNCTIONS**/



    var init = function() {

        //initialization stuff

    }();

    return self;
};

//Global accessible instance
var model = Model();

