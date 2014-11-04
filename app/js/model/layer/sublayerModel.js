/**
 *  Class SublayerModel
 *  Base Sublayer
 */
var SublayerModel = function(layer, name, icon) {
    var self = {};

    self.icon = icon;
    self.name = name;
    self.layer = layer;

    var _selected = false;
    /** PUBLIC FUNCTIONS**/


    /** GETTER SETTER FUNCTIONS**/

    self.__defineSetter__("selected", function(flag){
        _selected = flag;
        notificationCenter.dispatch(Notifications.layer.SUBLAYER_SELECTION_CHANGED);
    });

    self.__defineGetter__("selected", function(){
        return _selected;
    });

    /** PRIVATE FUNCTIONS**/



    var init = function() {

        //initialization stuff

    }();

    return self;
};