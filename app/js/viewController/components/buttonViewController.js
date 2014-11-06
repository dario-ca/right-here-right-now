var ButtonViewController = function() {
    var self = ExternalSvgViewController("resource/view/button.svg");

    var _selected;

    self.__defineGetter__("selected", function(){
       return _selected;
    });

    self.__defineSetter__("selected", function(selected){
        _selected = selected;
        if(selected){
            self.view.classed("selected", true);
            self.view.highlightLine.show();
        } else {
            self.view.classed("selected", false);
            self.view.highlightLine.hide();
        }
    });


    self.onClick = function(callback) {
        self.view.onClick(callback);
    };


    var init = function () {
        self.view.classed("button-view-controller", true);
        self.view.title.classed("unselectable", true);
        self.selected = true;
    }();

    return self;
};