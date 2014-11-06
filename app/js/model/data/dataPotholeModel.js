/**
 *  Class DataPotholeModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataPotholeModel = function(name) {
    //////////////////////////  PRIVATE ATTRIBUTES ///////////////////////////
    var self = DataModel();
    var fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD'); //TODO remove hardcode
    var rectangles = [];
    var _potholesURL = "http://data.cityofchicago.org/resource/7as2-ds3y.json";
    var tmpData = [];
    var incrementalID = 0;
    var numWaitingQueries = 0;
    var prefixQuery = self._proxyURL;

    //////////////////////////  PUBLIC ATTRIBUTES ///////////////////////////

    self._notification = Notifications.data.POTHOLE_CHANGED;
    self.interval = 30000;

    ////////////////////////// PRIVATE METHODS //////////////////////////

    //Function that perform a single query to the database on a single rectangle,
    //the query is filtered depending on the state of the object for what concern time
    var singleQuery = function(topLeftCord,botRightCord){
        var queryString = "?$where=creation_date>'"+ fromTime  + "' AND within_box(location," + topLeftCord + "," +
            botRightCord +  ")";
        d3.json(prefixQuery + _potholesURL + queryString, createCallBackData(incrementalID));
    }

    //Create a Callback function invoked when the data are returned from SODA
    //@param id : identifier used for diversify different sets of queries.
    var createCallBackData = function (id) {
        var myId = id;
        return function(error, json) {
            var i = 0;
            if (error) {
                console.log("Error downloading the file " + _potholesURL);
                tmpData = [];
                incrementalID += 1;
                return;
            }
            if (myId === incrementalID) {
                //query for the right selections
                numWaitingQueries -= 1;
                for (i = 0; i < json.length; i++){
                    if (selectionModel.pointInside([json[i].latitude,json[i].longitude])){
                        tmpData.push(json[i]);
                    }
                }
                if (numWaitingQueries === 0) {
                    //last query has arrived update state
                    console.log(myId);
                    console.log(tmpData);
                    self.callback(tmpData);
                }
            }
        }

    }

    //Callback invoked when the selections areas are changed
    var callBackChangeAreas = function() {
        //TODO check this implementation
        rectangles = selectionModel.getSelection();
        self.fetchData();
        //TODO reset timer
    }

    //Callback function invoked when the time filter is changed
    var callBackChangeTimeFilter = function() {
        //TODO finish implementation, dependency on notification
        if (/*timeFilterModel.mode == "month"*/true) {
            fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
        } else {
            fromTime = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
        }
        self.fetchData();
        //TODO reset timer
    }


    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {
        var topLeft = "";
        var botRight = "";
        numWaitingQueries = 0;
        incrementalID += 1;
        tmpData = [];
        for (var i = 0; i < rectangles.length; i++){
            numWaitingQueries +=1;
            topLeft = rectangles[i].circumscribed().points[3][0] + "," + rectangles[i].circumscribed().points[3][1];
            botRight = rectangles[i].circumscribed().points[1][0] + "," + rectangles[i].circumscribed().points[1][1];
            singleQuery(topLeft,botRight);
        }
    };

    self.phpServerEnabled = function (val) {
        if (val){
            prefixQuery = self._proxyURL;
        } else {
            prefixQuery = "";
        }
    }

    ////////////////////////// SUBSCRIBES //////////////////////////

    //TODO subscribe change time filter
    notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,callBackChangeAreas);

    return self;
};

var dataPotholeModel = DataPotholeModel();

DataPotholeModel.status = {
    POTHOLE_OPEN: "Open",
    POTHOLE_OPEN_DUP: "Open - Dup",
    POTHOLE_COMPLETED: "Completed"
}