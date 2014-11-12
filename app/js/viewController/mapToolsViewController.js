/**
 *  Controller with the tools for the map such as
 *  rectangle, nearby..
 */
var MapToolsViewController = function() {
    var self = SvgViewController();

    var _nearbyButton,
        _areaButton,
        _pathButton;

    //#PUBLIC FUNCTIONS

    self.onSelectionModeChanged = function() {

        switch(selectionModel.selectionMode) {
            case SelectionMode.SELECTION_NEARBY:
                _nearbyButton.selected = true;
                _areaButton.selected = false;
                _pathButton.selected = false;
                break;
            case SelectionMode.SELECTION_AREA:
                _nearbyButton.selected = false;
                _areaButton.selected = true;
                _pathButton.selected = false;
                break;
            case SelectionMode.SELECTION_PATH:
                _nearbyButton.selected = false;
                _areaButton.selected = false;
                _pathButton.selected = true;
                break;
            default:
                _nearbyButton.selected = false;
                _areaButton.selected = false;
                _pathButton.selected = false;
        }
    };

    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();


        _nearbyButton.view.width = "33.3%";
        _nearbyButton.view.x = "0%";

        _areaButton.view.width = "33.3%";
        _areaButton.view.x = "33.3%";

        _pathButton.view.width = "33.3%";
        _pathButton.view.x = "66.6%";

    };
    
    
    //#PRIVATE FUNCTIONS
    
    var addBehaviour = function() {
        _nearbyButton.onClick(function(){
            selectionModel.selectionMode = SelectionMode.SELECTION_NEARBY;
        });

        _areaButton.onClick(function(){
            selectionModel.selectionMode = SelectionMode.SELECTION_AREA;
        });

        _pathButton.onClick(function(){
            if(selectionModel.selectionMode == SelectionMode.SELECTION_PATH)
                selectionModel.selectionMode = SelectionMode.SELECTION_NONE;
            else
                selectionModel.selectionMode = SelectionMode.SELECTION_PATH;
        });
    };


    var init = function() {
        self.view.classed("map-tools-view-controller", true);

        _nearbyButton = ButtonViewController("NEARBY",
                                             "resource/mapTools/icon/nearby.svg",
                                             "resource/mapTools/icon/nearby-deselected.svg");
        _areaButton = ButtonViewController("AREA",
                                           "resource/mapTools/icon/area.svg",
                                            "resource/mapTools/icon/area-deselected.svg");
        _pathButton = ButtonViewController("PATH",
                                            "resource/mapTools/icon/path.svg",
                                            "resource/mapTools/icon/path-deselected.svg");

        self.view.append(_nearbyButton);
        self.view.append(_areaButton);
        self.view.append(_pathButton);

        addBehaviour();
        self.onSelectionModeChanged();

        notificationCenter.subscribe(Notifications.selection.SELECTION_MODE_CHANGED, self.onSelectionModeChanged);
    }();

    return self;
};