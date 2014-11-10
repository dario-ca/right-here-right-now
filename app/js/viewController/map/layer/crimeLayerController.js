function CrimeLayerController(name,notification,icon) {
    var self = MapLayerController();

    /////////////////////////// PRIVATE ATTRIBUTES ////////////////////////////

    var crimeData=[];
    var svgCrimes=[];
    var _notification=notification;
    var _iconPath=icon;

    //name of the controller, needed in the switches
    var _name=name;

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var drawCrimes = function(){
        //TODO: remove crimes before update, now it removes every crime
        self.view.html("");
        crimeData.forEach(function(d){
            var crimeIcon = self.createIcon(d.latitude, d.longitude,_iconPath);
            svgCrimes.push(crimeIcon);
            //TODO:check icon
            crimeIcon.view.background.style("fill","red");
        })
    };

    var onCrimeData = function(){
        switch(_name){
            case "category1":       crimeData=dataCrimeCategory1Model.data;
                break;
            case "category2":       crimeData=dataCrimeCategory2Model.data;
        }
        drawCrimes();
    };

    var init = function() {
        switch(_name){
            case "category1":       dataCrimeCategory1Model.subscribe(_notification,onCrimeData);
                break;
            case "category2":       dataCrimeCategory2Model.subscribe(_notification,onCrimeData);
        }
    }();

    return self;
}