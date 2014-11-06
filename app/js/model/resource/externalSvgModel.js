/**
 * Class in charge to preload all the svg
 * used for the external svg view controller
 */
var ExternalSvgModel = function() {
    var self = {};
    self.svgsData = {};

    var externalSvgPaths = ["resource/view/notification-popup.svg"];


    self.loadResources = function(callback){
        var queueList = queue();

        externalSvgPaths.forEach(function(path){
            queueList.defer(
                function(callback) {
                    d3.xml(path, 'image/svg+xml', function (error, data) {
                        if(error)console.warn(error);
                        self.svgsData[path] = data;
                        callback(null,null);
                    });
                }
            );
        });

        queueList.await(callback);

    };

    var init = function() {

    }();

    return self;
};

//Global istance
var externalSvgModel = ExternalSvgModel();