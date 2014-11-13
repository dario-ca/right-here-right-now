var ButtonViewController = function(title, icon, deselectedIcon, double) {
    var self;
    if (icon) {
        self = ExternalSvgViewController("resource/view/button-with-icon.svg");
    } else if (double) {
        self = ExternalSvgViewController("resource/view/button-double.svg");
    } else {
        self = ExternalSvgViewController("resource/view/button.svg");
    }






    var _selected;

    self.__defineGetter__("selected", function(){
       return _selected;
    });

    self.__defineSetter__("selected", function(selected){
        _selected = selected;
        if(selected){
            self.view.classed("selected", true);
            self.view.highlightLine.show();
            self.view.title.style("fill", Colors.components.WHITE_SELECTED);
            if(icon)
                self.view.icon.imageSrc = icon;
        } else {
            self.view.classed("selected", false);
            self.view.highlightLine.hide();
            self.view.title.style("fill", Colors.components.GREY_DESELECTED);
            if(deselectedIcon)
                self.view.icon.imageSrc = deselectedIcon;
        }
    });


    self.onClick = function(callback) {
        self.view.onClick(callback);
    };


    var init = function () {
        self.view.classed("button-view-controller", true);
        self.view.title.classed("unselectable", true);
        self.selected = true;

        if(title){
            self.view.title.text(title);
        }

        if(icon){
            self.view.icon.imageSrc = icon;
        }

    }();

    return self;
};