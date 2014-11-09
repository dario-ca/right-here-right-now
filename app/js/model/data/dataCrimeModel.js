
var DataCrimeModel = function(modelName,databaseMainUrl,notification,interval,jsonNameDateAttribute,numWeekFilter) {
    //////////////////////////  DEBUG ///////////////////////////
    var debug = false;
    //////////////////////////  PRIVATE ATTRIBUTES ///////////////////////////
    var self = DataModel();
    var name = modelName;
    var fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD'); //TODO remove hardcode
    var rectangles = [];
    var mainUrl = databaseMainUrl;
    var tmpData = [];
    var nameDateAttribute = jsonNameDateAttribute;
    var incrementalID = 0;
    var numWaitingQueries = 0;
    var prefixQuery = self._proxyURL;
    var charAfterUrl = "&";
    var weeksNum = numWeekFilter || 1;
    var sqlWhere = [];
    //////////////////////////  PUBLIC ATTRIBUTES ///////////////////////////

    self._notification = notification;
    self.interval = interval;

    ////////////////////////// PRIVATE METHODS //////////////////////////

    //Function that perform a single query to the database on a single rectangle,
    //the query is filtered on time and on position
    var singleQuery = function(topLeftCord,botRightCord){
        var queryString = charAfterUrl + "$where=" + nameDateAttribute + ">'"+ fromTime  + "' AND latitude<" +
            topLeftCord[0] + " AND longitude>" + topLeftCord[1] + " AND latitude>" + botRightCord[0] + " AND longitude<" + botRightCord[1];
        for (var i = 0; i < sqlWhere.length; i++){
            if (i === 0){
                queryString += " AND ";
            }
            queryString += sqlWhere[i];
            if (i !== sqlWhere.length - 1) {
                queryString += " AND ";
            }
        }
        queryString += "&$limit=10000";
        d3.json(prefixQuery + mainUrl + queryString, createCallBackData(incrementalID));
    };

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

    };

    //Callback invoked when the selections areas are changed
    var callBackChangeAreas = function() {
        //TODO check this implementation
        rectangles = selectionModel.getSelection();
        self.fetchData();
        //TODO reset timer
    };

    //Callback function invoked when the time filter is changed
    var callBackChangeTimeFilter = function() {
        //TODO finish implementation, dependency on notification
        if (/*timeFilterModel.mode == "month"*/true) {
            fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
        } else {
            fromTime = moment().subtract(weeksNum, 'weeks').format('YYYY-MM-DD');
        }
        self.fetchData();
        //TODO reset timer
    };

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

    //Change the the query depending if the php proxy is active or not
    self.proxyPhpQueries = function (val) {
        if (val){
            prefixQuery = self._proxyURL;
            charAfterUrl = "&";
        } else {
            prefixQuery = "";
            charAfterUrl = "?";
        }
    };

    self.addSqlWhere = function (str){
        sqlWhere.push(str);
        return self;
    }

    ////////////////////////// SUBSCRIBES //////////////////////////

    //TODO subscribe change time filter
    notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,callBackChangeAreas);

    return self;
};

var dataCrimeNarcoticsModel = DataCrimeModel("Crimes","http://data.cityofchicago.org/resource/ijzp-q8t2.json",Notifications.data.crime.CRIME_NARCOTICS_CHANGED,30000,"date",2);
dataCrimeNarcoticsModel.addSqlWhere("primary_type='NARCOTICS'");

var dataCrimeRobberyModel = DataCrimeModel("Crimes","http://data.cityofchicago.org/resource/ijzp-q8t2.json",Notifications.data.crime.CRIME_ROBBERY_CHANGED,30000,"date",2);
dataCrimeRobberyModel.addSqlWhere("primary_type='ROBBERY'");