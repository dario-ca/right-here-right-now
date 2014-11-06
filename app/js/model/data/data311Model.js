/**
 * Created by Luca on 06/11/2014.
 */


/**
 * Abstract class for retrive data relative a desired area from the 311 database
 * @param name: Name of the class
 * @param mainUrl: main url of the database
 * @param notification: notification invoked when the data are updated
 * @param interval: delay between updates
 * @param nameDateAttribute: name of the date attribute of the json returned
 * @returns {*} a dataModel
 * @constructor
 */
var Data311Model = function(name,mainUrl,notification,interval,nameDateAttribute) {
    //////////////////////////  DEBUG ///////////////////////////
    var debug = true;
    //////////////////////////  PRIVATE ATTRIBUTES ///////////////////////////
    var self = DataModel();
    var name = name;
    var fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD'); //TODO remove hardcode
    var rectangles = [];
    var mainUrl = mainUrl;
    var tmpData = [];
    var nameDateAttribute = nameDateAttribute;
    var incrementalID = 0;
    var numWaitingQueries = 0;
    var prefixQuery = self._proxyURL;
    var charAfterUrl = "&";

    //////////////////////////  PUBLIC ATTRIBUTES ///////////////////////////

    self._notification = notification;
    self.interval = interval;

    ////////////////////////// PRIVATE METHODS //////////////////////////

    //Function that perform a single query to the database on a single rectangle,
    //the query is filtered on time and on position
    var singleQuery = function(topLeftCord,botRightCord){
        var queryString = charAfterUrl + "$where=" + nameDateAttribute + ">'"+ fromTime  + "' AND latitude<" +
            topLeftCord[0] + " AND longitude>" + topLeftCord[1] + " AND latitude>" + botRightCord[0] + " AND longitude<" + botRightCord[1];
        d3.json(prefixQuery + mainUrl + queryString, createCallBackData(incrementalID));
    }

    //Create a Callback function invoked when the data are returned from SODA
    //@param id : identifier used for diversify different sets of queries.
    var createCallBackData = function (id) {
        var myId = id;
        return function(error, json) {
            var i = 0;
            if (error) {
                console.log("Error downloading the data of " + name + ":" + mainUrl );
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
                    if (debug){
                        console.log(name + " request ID: " + myId);
                        console.log(tmpData);
                    }
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
            topLeft = [rectangles[i].circumscribed().points[3][0], rectangles[i].circumscribed().points[3][1]];
            botRight = [rectangles[i].circumscribed().points[1][0],rectangles[i].circumscribed().points[1][1]];
            singleQuery(topLeft,botRight);
        }
    };

    self.phpServerEnabled = function (val) {
        if (val){
            prefixQuery = self._proxyURL;
            charAfterUrl = "&";
        } else {
            prefixQuery = "";
            charAfterUrl = "?";
        }
    }

    ////////////////////////// SUBSCRIBES //////////////////////////

    //TODO subscribe change time filter
    notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,callBackChangeAreas);

    return self;
};

var dataPotholeModel = Data311Model("Potholes","http://data.cityofchicago.org/resource/7as2-ds3y.json",Notifications.data.POTHOLE_CHANGED,30000,"creation_date");
var dataVehiclesModel = Data311Model("Abandoned Vehicles","http://data.cityofchicago.org/resource/3c9v-pnva.json",Notifications.data.ABANDONED_VEHICLES_CHANGED,30000,"creation_date");
var dataLightsAllModel = Data311Model("All lights out","http://data.cityofchicago.org/resource/zuxi-7xem.json",Notifications.data.LIGHT_OUT_ALL_CHANGED,30000,"creation_date");
var dataLight1Model = Data311Model("One light out","http://data.cityofchicago.org/resource/3aav-uy2v.json",Notifications.data.LIGHT_OUT_SINGLE_CHANGED,30000,"creation_date");
var dataFoodInspection = Data311Model("Food insoections","http://data.cityofchicago.org/resource/4ijn-s7e5.json",Notifications.data.FOOD_INSPECTION_CHANGED,30000,"inspection_date");

////////////////////////// STATUS //////////////////////////
DataPotholeModel.status = {
    POTHOLE_OPEN: "Open",
    POTHOLE_OPEN_DUP: "Open - Dup",
    POTHOLE_COMPLETED: "Completed"
}