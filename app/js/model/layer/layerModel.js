/**
 *  Class LayerModel
 *  Base Sublayer
 */
var LayerModel = function(name) {
    var self = {};

    self.sublayers = [];
    self.name = name;
    //whether or not the graph is linked to some graphs on the right
    self.hasRelatedGraphs = false;

    /** PUBLIC FUNCTIONS**/

    self.addSublayer = function(name, icon, color, mapLayers) {
        var sublayer = SublayerModel(self, name, icon, color, mapLayers);
        self.sublayers.push(sublayer);
        return sublayer;
    };

    self.toggleSelection = function() {
      if(self.selected === LayerSelectionMode.SELECTED){
          self.selected = LayerSelectionMode.DESELECTED;
      } else if(self.selected === LayerSelectionMode.DESELECTED  || self.selected === LayerSelectionMode.SEMI_SELECTED){
          self.selected = LayerSelectionMode.SELECTED;
      }
    };

    /** GETTER SETTER FUNCTIONS**/
    self.__defineSetter__("selected", function(flag){
        self.sublayers.forEach(function(sublayer){
            if(flag == LayerSelectionMode.SELECTED)
                sublayer.selected = true;
            if(flag == LayerSelectionMode.DESELECTED)
                sublayer.selected = false;
        });
    });


    self.__defineGetter__("selected", function(){
        var allSelected = true;
        var allDeselected = true;
        self.sublayers.forEach(function(sublayer){
            if(sublayer.selected){
                allDeselected = false;
            } else if (!sublayer.selected){
                allSelected = false;
            }
        });

        if(allSelected){
            return LayerSelectionMode.SELECTED;
        } else if (allDeselected) {
            return LayerSelectionMode.DESELECTED;
        } else {
            return LayerSelectionMode.SEMI_SELECTED;
        }

    });


    /** PRIVATE FUNCTIONS**/



    var init = function() {

        //initialization stuff

    }();

    return self;
};


var LayerSelectionMode = {
  SELECTED : "SELECTED",
  DESELECTED : "DESELECTED",
  SEMI_SELECTED : "SEMI_SELECTED"
};

