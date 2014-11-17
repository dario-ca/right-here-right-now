
var DataCrimeModel = function(modelName,colorCode,databaseMainUrl,notification,interval,jsonNameDateAttribute,numWeekFilter) {

    //////////////////////////  DEBUG ///////////////////////////
    var debug = false;

    //////////////////////////  PRIVATE ATTRIBUTES ///////////////////////////
    var self = DataModel();
    var name = modelName;
    var color = colorCode;
    var fromTime;
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
    self.crimeSelected=null;

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
                    tmpData.forEach(function(d){
                        d.color=color;
                    });
                    self.callback(tmpData);
                }
            }
        }

    };

    //Callback invoked when the selections areas are changed
    var callBackChangeAreas = function() {
        rectangles = selectionModel.getSelection();
        self.dataChanged();
    };

    //Callback function invoked when the time filter is changed
    var callBackChangeTimeFilter = function() {
        if (timeIntervalModel.timeInterval === TimeInterval.LAST_MONTH) {
            fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
        } else if (timeIntervalModel.timeInterval === TimeInterval.LAST_WEEK){
            fromTime = moment().subtract(weeksNum, 'weeks').format('YYYY-MM-DD');
        } else {
            console.log("Illegal state time interval");
        }
        self.dataChanged();
    };

    callBackChangeTimeFilter();
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

    self.giveWhereString = function(category){
        var string="(primary_type='"+category[0]+"'";
        for(var i=1;i<category.length;i++){
            string = string + " OR primary_type='"+category[i]+"'";
        }
        string=string+")";
        return string;
    }

    self.crimeClicked = function(crime,category) {
        self.crimeSelected = crime;
        DataCrimeModel.popupCategory=category;
        notificationCenter.dispatch(Notifications.data.crime.CRIME_SELECTION_CHANGED);
    };

    self.getSubTypes = function() {
        var outputTypes = [];
        var addValue = function(type) {
            var found = false;
            for (var i = 0; i < outputTypes.length; i++){
                if (outputTypes[i].name === type ){
                    outputTypes[i].total += 1;
                    found = true;
                }
            }
            if (!found) {
                outputTypes.push({
                    name: type,
                    total: 1
                })
            }
        };

        for (var i = 0; i < self.data.length; i++){
            addValue(self.data[i].primary_type);
        }

        return outputTypes;
    }

    ////////////////////////// SUBSCRIBES //////////////////////////

    notificationCenter.subscribe(Notifications.timeInterval.TIME_INTERVAL_CHANGED,callBackChangeTimeFilter);
    notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED,callBackChangeAreas);

    return self;
};

DataCrimeModel.popupCategory=null;

DataCrimeModel.categories = {

    CATEGORY_1 : ["BATTERY",
                    "ASSAULT",
                    "SEX OFFENSE",
                    "CRIM SEXUAL ASSAULT",
                    "ROBBERY",
                    "INTIMIDATION"],

    CATEGORY_2 : ["THEFT",
                    "BURGLARY",
                    "MOTOR VEHICLE THEFT"],

    CATEGORY_3 : ["PROSTITUTION",
                    "NARCOTICS",
                    "OBSCENITY",
                    "PUBLIC PEACE VIOLATION",
                    "CRIMINAL TRESPASS",
                    "WEAPONS VIOLATION",
                    "CRIMINAL DAMAGE",
                    "ARSON",
                    "HOMICIDE",
                    "KIDNAPPING"],

    CATEGORY_4 : ["DOMESTIC VIOLENCE",
                    "GAMBLING",
                    "STALKING",
                    "RITUALISM",
                    "DECEPTIVE PRACTICE",
                    "OTHER NARCOTIC VIOLATION",
                    "OTHER OFFENSE",
                    "LIQUOR LAW VIOLATION",
                    "INTERFERENCE WITH PUBLIC OFFICER",
                    "CONCEALED CARRY LICENSE VIOLATION",
                    "OFFENSES INVOLVING CHILDREN"]
};

DataCrimeModel.typesDangerCircle = ["BATTERY"];

DataCrimeModel.typesWarningCircle = [""];


var dataCrimeCategory1Model = DataCrimeModel("category1",Colors.layer.SECURITY_1,"http://data.cityofchicago.org/resource/ijzp-q8t2.json",Notifications.data.crime.CRIME_CATEGORY1_CHANGED,30000,"date",2);
dataCrimeCategory1Model.addSqlWhere(dataCrimeCategory1Model.giveWhereString(DataCrimeModel.categories.CATEGORY_1));

var dataCrimeCategory2Model = DataCrimeModel("category2",Colors.layer.SECURITY_2,"http://data.cityofchicago.org/resource/ijzp-q8t2.json",Notifications.data.crime.CRIME_CATEGORY2_CHANGED,30000,"date",2);
dataCrimeCategory2Model.addSqlWhere(dataCrimeCategory2Model.giveWhereString(DataCrimeModel.categories.CATEGORY_2));

var dataCrimeCategory3Model = DataCrimeModel("category3",Colors.layer.SECURITY_3,"http://data.cityofchicago.org/resource/ijzp-q8t2.json",Notifications.data.crime.CRIME_CATEGORY3_CHANGED,30000,"date",2);
dataCrimeCategory3Model.addSqlWhere(dataCrimeCategory3Model.giveWhereString(DataCrimeModel.categories.CATEGORY_3));

var dataCrimeCategory4Model = DataCrimeModel("category4",Colors.layer.SECURITY_4,"http://data.cityofchicago.org/resource/ijzp-q8t2.json",Notifications.data.crime.CRIME_CATEGORY4_CHANGED,30000,"date",2);
dataCrimeCategory4Model.addSqlWhere(dataCrimeCategory4Model.giveWhereString(DataCrimeModel.categories.CATEGORY_4));
