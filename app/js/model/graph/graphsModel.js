var GraphsModel = function() {
    var self = {};

    var _layerSelected = null,
        _sublayerSelected = null;


    self.__defineSetter__("layerSelected", function(name){
        if(_layerSelected != name){
            _layerSelected = name;
            notificationCenter.dispatch(Notifications.graphs.GRAPH_LAYER_SELECTED_CHANGED);
        }
    });


    self.__defineGetter__("layerSelected", function(){
        return _layerSelected;
    });


    self.__defineSetter__("sublayerSelected", function(name){
        if(_sublayerSelected != name){
            _sublayerSelected = name;
            notificationCenter.dispatch(Notifications.graphs.GRAPH_SUBLAYER_SELECTED_CHANGED);
        }
    });


    self.__defineGetter__("sublayerSelected", function(){
        return _sublayerSelected;
    });


    var init = function() {

    }();

    return self;
};

//global accessible instance
var graphsModel = GraphsModel();