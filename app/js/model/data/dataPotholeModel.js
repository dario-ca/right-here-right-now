/**
 *  Class DataPotholeModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataPotholeModel = function(name) {
    var self = DataModel();

    ////////////////////////// PUBLIC ATTRIBUTES ///////////////////////////

    self._potholesURL = "http://data.cityofchicago.org/resource/7as2-ds3y.json";
    self._notification = Notifications.data.POTHOLE_CHANGED;
    self.interval = 30000;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {
        d3.json(self._proxyURL + self._potholesURL, function(error, json) {
            if(error) {
                console.log("Error downloading the file "+self._potholesURL);
                return;
            }
            self.callback(json);
        });
    };

    return self;
};

var dataPotholeModel = DataPotholeModel();

DataPotholeModel.status = {
    POTHOLE_OPEN: "Open",
    POTHOLE_OPEN_DUP: "Open - Dup",
    POTHOLE_COMPLETED: "Completed"
}