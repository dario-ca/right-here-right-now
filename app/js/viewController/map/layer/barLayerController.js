function BarLayerController() {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var _barData=[];
    var _svgBars=[];
    var _popup=null;


    /////////////////////////// PRIVATE METHODS ////////////////////////////


    var drawBar = function(){
        self.hideBars();
        _barData.forEach(function(d){
            var barIcon = self.createIcon(d.location.coordinate.latitude, d.location.coordinate.longitude,"resource/sublayer/icon/bar.svg");
            _svgBars.push(barIcon);

            barIcon.view.onClick(function(){
                if(dataYelpBarModel.barSelected!==null)
                    _popup.dispose();
                dataYelpBarModel.barClicked(d);
            });
        })
    };

    var onBarData = function(){
        _barData=dataYelpBarModel.data;
        drawBar();
    };

    self.hideBars = function(){
        _svgBars.forEach(function(d){
            d.dispose();
        });
        if(_popup!==null){
            _popup.dispose();
        }
        _svgBars=[];
    };

    var onBarSelected = function() {
        if(_popup!==null)
            _popup.dispose();
        if(dataYelpBarModel.barSelected!==null) {
            _popup = popupLayerController.openPopup(dataYelpBarModel.barSelected.location.coordinate.latitude, dataYelpBarModel.barSelected.location.coordinate.longitude, MapPopupType.POPUP_SIMPLE);
            _popup.view.title.text(dataYelpBarModel.barSelected.name);
            _popup.view.subtitle.text(dataYelpBarModel.barSelected.location.display_address[0]);
        }
    };

    self.super_dispose = self.dispose;
    self.dispose = function() {
        self.hideBars();
        self.super_dispose();
        dataYelpBarModel.unsubscribe(Notifications.data.BAR_CHANGED, onBarData);
        dataYelpBarModel.unsubscribe(Notifications.data.BAR_SELECTION_CHANGED, onBarSelected);
    };

    var init = function() {
        dataYelpBarModel.subscribe(Notifications.data.BAR_CHANGED, onBarData);
        dataYelpBarModel.subscribe(Notifications.data.BAR_SELECTION_CHANGED, onBarSelected);
    }();

    return self;
}