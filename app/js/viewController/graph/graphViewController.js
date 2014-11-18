/**
 * Implementation of the base class for grap
 * @params layer, sublayer: the name of the layer and the sublayer associated to this object
 */
var GraphViewController = function(layer, sublayer) {
    var self = SvgViewController();
    var _noSelectionViewController;


    self.addLegenda = function(items/*[{text:, color:},{..},]*/) {
        var legenda = ExternalSvgViewController("resource/graph/legenda.svg");
        legenda.view.width = "20%";
        legenda.view.x = "80%";
        for(var i = 0; i < 4; i++){
            var circle = legenda.view["circle"+(i+1)];
            var text = legenda.view["text"+(i+1)];

            if(items.length > i){
                text.text(items[i].text);
                circle.attr("fill", items[i].color);
            } else {
                circle.hide();
                text.hide();
            }
        }
        self.view.append(legenda);
        return legenda;
    };


    self.showNoSelection = function() {
        self.view.html("");
        _noSelectionViewController = ExternalSvgViewController("resource/graph/no-selection.svg");
        self.view.append(_noSelectionViewController);
    };


    self.hideNoSelection = function() {
        if(_noSelectionViewController){
            _noSelectionViewController.dispose();
        }
    };


    var init = function() {
        self.view.classed("graph-view-controller", true);
    };

    return self;
};