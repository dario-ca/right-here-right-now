var EnhanceIconModel = function() {
    var self = {};

    var _warningSelected = true;
    var _dangerSelected = true;


    self.__defineSetter__("warning", function(w){
        _warningSelected = w;
        notificationCenter.dispatch(Notifications.enhanceIcon.SELECTION_CHANGED);
    });

    self.__defineSetter__("danger", function(d){
        _dangerSelected = d;
        notificationCenter.dispatch(Notifications.enhanceIcon.SELECTION_CHANGED);
    });

    self.__defineGetter__("warning", function(){
       return _warningSelected;
    });

    self.__defineGetter__("danger", function(){
        return _dangerSelected;
    });



    var init = function() {

    };

    return self;
};

//global instance
var enhanceIconModel = EnhanceIconModel();