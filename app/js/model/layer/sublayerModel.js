/**
 *  Class SublayerModel
 *  Base Sublayer
 */
var SublayerModel = function(layer, name, icon, color) {
    var self = {};

    self.icon = icon;
    self.name = name;
    self.layer = layer;
    self.color = color;

    var _selected = false;
    /** PUBLIC FUNCTIONS**/


    /** GETTER SETTER FUNCTIONS**/

    self.toggleSelection = function() {
        self.selected = !_selected;
    };

    self.__defineSetter__("selected", function(flag){
        _selected = flag;
        notificationCenter.dispatch(Notifications.layer.SUBLAYER_SELECTION_CHANGED);
    });

    self.__defineGetter__("selected", function(){
        return _selected;
    });

    /** PRIVATE FUNCTIONS**/



    var init = function() {

    }();

    return self;
};