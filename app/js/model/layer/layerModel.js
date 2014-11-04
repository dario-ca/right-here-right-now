/**
 *  Class LayerModel
 *  Base Sublayer
 */
var LayerModel = function(name) {
    var self = {};

    self.sublayers = [];


    /** PUBLIC FUNCTIONS**/

    self.addSublayer = function(name, icon) {
        var sublayer = SublayerModel(self, name, icon);
        self.sublayers.push(sublayer);
        return sublayer;
    };

    self.toggleSelection = function() {
      if(self.selected == LayerSelectionMode.SELECTED || self.selected == LayerSelectionMode.SEMI_SELECTED){
          self.selected = false;
      } else if(self.selected == LayerSelectionMode.DESELECTED){
          self.selected = true;
      }
    };

    /** GETTER SETTER FUNCTIONS**/
    self.__defineSetter__("selected", function(flag){
        self.sublayers.forEach(function(sublayer){
            sublayer.selected = flag;
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

