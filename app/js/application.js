/**
 *  Class Application
 */
var Application = function() {
    var self = {};


    self.mainWindow = null;

    /** PUBLIC FUNCTIONS**/

    /**
     * Documentation
     * @param a    dummy var
     */
    self.publicFunction = function(a) {

    };


    /*
    self.__defineGetter__("a", function(){
        return something;
    });
    */


    /** PRIVATE FUNCTIONS**/

    var privateFunction = function(variable) {

    };

    /**
     * Load basic resources before the start of the application
     */
    var loadResources = function(callback) {
        queue()
            .defer(externalSvgModel.loadResources)
            .await(callback)
    };

    /**
     * Start the application
     */
    var setUp = function() {
        var layerFactory = LayerFactory();
        layerFactory.populateLayers();


        var body = d3.select("body");

        self.mainWindow = WindowController();
        self.mainWindow.view.appendTo(body);
        self.mainWindow.updateView();

        graphsModel.layerSelected = "SECURITY";
    };


    var init = function() {

        loadResources(function(){
            setUp();

        });

    }();

    return self;
};