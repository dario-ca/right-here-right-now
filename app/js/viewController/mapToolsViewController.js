/**
 *  Controller with the tools for the map such as
 *  rectangle, nearby..
 */
var MapToolsViewController = function() {
    var self = SvgViewController();

    var _nearbyButton,
        _areaButton,
        _pathButton,
        _dangerButton,
        _warningButton;

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


    self.onEnhanceIconChanged = function() {
        _dangerButton.selected = enhanceIconModel.danger;
        _warningButton.selected = enhanceIconModel.warning;

    };


    self.super_updateView = self.updateView;
    self.updateView = function() {
        self.super_updateView();

        var buttonWidth = 19.6;
        var margin = 2;

        _nearbyButton.view.width = buttonWidth + "%";
        _nearbyButton.view.x = "0%";

        _areaButton.view.width = buttonWidth + "%";
        _areaButton.view.x = buttonWidth + "%";

        _pathButton.view.width = buttonWidth + "%";
        _pathButton.view.x = buttonWidth * 2 +  "%";

        _dangerButton.view.width = buttonWidth + "%";
        _dangerButton.view.x = buttonWidth * 3 + margin +  "%";

        _warningButton.view.width = buttonWidth + "%";
        _warningButton.view.x =  buttonWidth * 4 + margin + "%";

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

        _warningButton.onClick(function(){
            enhanceIconModel.warning = !enhanceIconModel.warning;
        });

        _dangerButton.onClick(function(){
            enhanceIconModel.danger = !enhanceIconModel.danger;
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

        _dangerButton = ButtonViewController("DANGER",
            "resource/mapTools/icon/danger.svg",
            "resource/mapTools/icon/warning-danger-deselected.svg");
        _dangerButton.selected = enhanceIconModel.danger;

        _warningButton = ButtonViewController("WARNING",
            "resource/mapTools/icon/warning.svg",
            "resource/mapTools/icon/warning-danger-deselected.svg");
        _warningButton.selected = enhanceIconModel.warning;

        self.view.append(_nearbyButton);
        self.view.append(_areaButton);
        self.view.append(_pathButton);

        self.view.append(_dangerButton);
        self.view.append(_warningButton);

        addBehaviour();
        self.onSelectionModeChanged();

        notificationCenter.subscribe(Notifications.selection.SELECTION_MODE_CHANGED, self.onSelectionModeChanged);
        notificationCenter.subscribe(Notifications.enhanceIcon.SELECTION_CHANGED, self.onEnhanceIconChanged);
    }();

    return self;
};