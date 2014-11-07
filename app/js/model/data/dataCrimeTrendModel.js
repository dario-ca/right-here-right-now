/**
 * Created by Luca on 06/11/2014.
 */

var crimeTrendModel = function(modelName,notification,interval) {
    //////////////////////////  DEBUG ///////////////////////////
    var debug = true;
    //////////////////////////  PRIVATE ATTRIBUTES ///////////////////////////
    var self = DataModel();
    var name = modelName;
    var fromTime = moment().subtract(5, 'years').format('YYYY-MM-DD');
    var rectangles = [];
    var mainUrl = "http://data.cityofchicago.org/resource/ijzp-q8t2.json";
    var tmpData = [];
    var incrementalID = 0;
    var numWaitingQueries = 0;
    var prefixQuery = self._proxyURL;
    var charAfterUrl = "&";
    var sqlSelect = [];
    var sqlGroupBy = [];
    var sqlOrder =[];
    //////////////////////////  PUBLIC ATTRIBUTES ///////////////////////////

    self._notification = notification;
    self.interval = interval;

    ////////////////////////// PRIVATE METHODS //////////////////////////

    //Function that perform a single query to the database on a single rectangle,
    //the query uses the selections, group by and order defined by the user
    var singleQuery = function(topLeftCord,botRightCord){
        // & or ? depending if there is a php server
        var queryString = charAfterUrl
        //select part
        for (var i = 0; i < sqlSelect.length; i++){
            if (i === 0){
                queryString += "&$select=";
            }
            queryString += sqlSelect[i];
            if (i !== sqlSelect.length - 1) {
                queryString += ",";
            }
        }
        //where part
        queryString += "&$where=date>'"+ fromTime  + "' AND within_box(location," + topLeftCord[0] + "," + topLeftCord[1] + "," +
            botRightCord[0]+ "," + botRightCord[1] +  ")";
        //group By
        for (var j = 0; j < sqlGroupBy.length; j++){
            if (j === 0) {
                queryString += "&$group=";
            }
            queryString += sqlGroupBy[j];
            if (j !== sqlGroupBy.length - 1) {
                queryString += ",";
            }
        }
        //order part
        for (var j = 0; j < sqlOrder.length; j++) {
            if (j === 0) {
                queryString += "&$order=";
            }
            queryString += sqlOrder[j];
            if (j !== sqlOrder.length - 1) {
                queryString += ",";
            }
        }
        queryString += "&$limit=10000";
        d3.json(prefixQuery + mainUrl + queryString, createCallBackData(incrementalID));
    };

    var sameTypeData = function(item1, item2, dontCareAttr){
        for (var attr in item1){
            if (item2[attr] !== item1[attr] && attr !== dontCareAttr){
                return false;
            }
        }
        return true;
    };

    //Create a Callback function invoked when the data are returned from SODA
    //@param id : identifier used for diversify different sets of queries.
    var createCallBackData = function (id) {
        var myId = id;
        return function(error, json) {
            var i = 0;
            var j = 0;
            var found = false;
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
                    found = false;
                    for(j = 0; j < tmpData.length; j++){
                        //tmpData[j] = tmpData[j] || 0;
                        if (sameTypeData(json[i],tmpData[j],"total")){
                            tmpData[j].total += parseInt(json[i].total,10);
                            found = true;
                        }
                    }
                    if (!found){
                        json[i].total = parseInt(json[i].total,10);
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

    self.addSqlSelect = function (strSelect){
        sqlSelect.push(strSelect);
        return self;
    }

    self.addSqlGroup = function (strGroup){
        sqlGroupBy.push(strGroup);
        return self;
    }

    self.addSqlOrder = function (strOrder){
        sqlOrder.push(strOrder);
        return self;
    }

    ////////////////////////// SUBSCRIBES //////////////////////////

    notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,callBackChangeAreas);

    return self;
};

var dataCrimeTrendMonthModel = crimeTrendModel("Trend total Crime (granularity month)",Notifications.data.CRIME_MONTH_TOTAL_CHANGED,300000);
dataCrimeTrendMonthModel.addSqlSelect("date_trunc_ym(date) AS month")
    .addSqlSelect("count(*) AS total")
    .addSqlGroup("month")
    .addSqlOrder("month");

var dataCrimeTrendTypeMonthModel = crimeTrendModel("Trend Crime for type (granularity month)",Notifications.data.CRIME_MONTH_TYPE_CHANGED,300000);
dataCrimeTrendTypeMonthModel.addSqlSelect("date_trunc_ym(date) AS month")
    .addSqlSelect("count(*) AS total")
    .addSqlSelect("primary_type")
    .addSqlGroup("month")
    .addSqlGroup("primary_type")
    .addSqlOrder("month");
