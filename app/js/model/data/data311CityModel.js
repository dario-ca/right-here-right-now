/**
 * Created by Luca on 16/11/2014.
 */
var data311CityModel = function(modelName, mainURL, dateField,notification,interval,numweek) {
    //////////////////////////  DEBUG ///////////////////////////
    var debug = false;
    //////////////////////////  PRIVATE ATTRIBUTES ///////////////////////////
    var self = DataModel();
    var name = modelName;
    var fromTime = "";
    var dateName = dateField;
    var mainUrl = mainURL;
    var prefixQuery = self._proxyURL;
    var numweek = numweek || 1;
    var charAfterUrl = "&";
    var sqlSelect = [];
    var sqlGroupBy = [];
    var sqlOrder =[];
    var sqlWhere = [];
    //////////////////////////  PUBLIC ATTRIBUTES ///////////////////////////

    self._notification = notification;
    self.interval = interval;

    ////////////////////////// PRIVATE METHODS //////////////////////////


    var callBackChangeTimeFilter = function() {
        if (timeIntervalModel.timeInterval === TimeInterval.LAST_MONTH) {
            fromTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
        } else if (timeIntervalModel.timeInterval === TimeInterval.LAST_WEEK){
            fromTime = moment().subtract(numweek, 'weeks').format('YYYY-MM-DD');
        } else {
            console.log("Illegal state time interval");
        }
        self.dataChanged();
    };

    callBackChangeTimeFilter();
    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {
        // & or ? depending if there is a php server
        var queryString = charAfterUrl;
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
        queryString += "&$where=" + dateName + ">'"+ fromTime + "'";
        for (var i = 0; i < sqlWhere.length; i++){
            if (i === 0){
                queryString += " AND ";
            }
            queryString += sqlWhere[i];
            if (i !== sqlWhere.length - 1) {
                queryString += " AND ";
            }
        }
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
        d3.json(prefixQuery + mainUrl + queryString, function (error, json){
            if (error) {
                console.log("Error downloading the data of " + name + ":" + mainUrl);
                return;
            }
            if (debug){
                console.log(json);
            }
            self.callback(json);
        });
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
    };

    self.addSqlGroup = function (strGroup){
        sqlGroupBy.push(strGroup);
        return self;
    };

    self.addSqlOrder = function (strOrder){
        sqlOrder.push(strOrder);
        return self;
    };

    self.addSqlWhere = function (str){
        sqlWhere.push(str);
        return self;
    };

    ////////////////////////// SUBSCRIBES //////////////////////////

    notificationCenter.subscribe(Notifications.timeInterval.TIME_INTERVAL_CHANGED,callBackChangeTimeFilter);

    return self;
};

var dataPotholeCityModel = data311CityModel("PotHoleCity","http://data.cityofchicago.org/resource/7as2-ds3y.json","creation_date",Notifications.data.POTHOLE_CITY_CHANGED,300000);
dataPotholeCityModel.addSqlSelect("status AS name")
    .addSqlSelect("count(*) AS total")
    .addSqlWhere("status!='Completed - Dup'")
    .addSqlWhere("status!='Open - Dup'")
    .addSqlGroup("status");

var dataAbandonedCityModel = data311CityModel("AbandonedCity","http://data.cityofchicago.org/resource/3c9v-pnva.json","creation_date",Notifications.data.ABANDONED_VEHICLES_CITY_CHANGED,300000);
dataAbandonedCityModel.addSqlSelect("status AS name")
    .addSqlSelect("count(*) AS total")
    .addSqlGroup("status");

var dataLightAllCityModel = data311CityModel("LightAllCity","http://data.cityofchicago.org/resource/zuxi-7xem.json","creation_date",Notifications.data.LIGHT_OUT_ALL_CITY_CHANGED,300000);
dataLightAllCityModel.addSqlSelect("status AS name")
    .addSqlSelect("count(*) AS total")
    .addSqlGroup("status");

var dataLightOneCityModel = data311CityModel("LightOneCity","http://data.cityofchicago.org/resource/3aav-uy2v.json","creation_date",Notifications.data.LIGHT_OUT_SINGLE_CITY_CHANGED,300000);
dataLightOneCityModel.addSqlSelect("status AS name")
    .addSqlSelect("count(*) AS total")
    .addSqlGroup("status");

var dataFoodInspCityModel = data311CityModel("FoodInspectionCity","http://data.cityofchicago.org/resource/4ijn-s7e5.json","inspection_date",Notifications.data.FOOD_INSPECTION_CITY_CHANGED,300000);
dataFoodInspCityModel.addSqlSelect("results AS name")
    .addSqlSelect("count(*) AS total")
    .addSqlGroup("results");

var dataCrimeTypeCityModel = data311CityModel("CrimeTypeCityModel","http://data.cityofchicago.org/resource/ijzp-q8t2.json","date",Notifications.data.crime.CRIME_TYPE_CITY_CHANGED,300000,2);
dataCrimeTypeCityModel.addSqlSelect("count(*) AS total")
    .addSqlSelect("primary_type AS name")
    .addSqlGroup("primary_type");

dataCrimeTypeCityModel.getCategories = function () {
    var outPut = {
        CATEGORY_1: 0,
        CATEGORY_2: 0,
        CATEGORY_3: 0,
        CATEGORY_4: 0
    };
    for (var i = 0; i < dataCrimeTypeCityModel.data.length; i++) {
        for (var cat in DataCrimeModel.categories) {
            if (DataCrimeModel.categories[cat].indexOf(dataCrimeTypeCityModel.data[i].primary_type) !== -1){
                outPut[cat] += +dataCrimeTypeCityModel.data[i].total;
            }
        }
    }
    return outPut;
};