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
            crimeIcon.view.background.style("fill", d.color);
        })
    };

    var onCrimeData = function(){
        switch(_name){
            case "category1":       crimeData=dataCrimeCategory1Model.data;
                break;
            case "category2":       crimeData=dataCrimeCategory2Model.data;
                break;
            case "category3":       crimeData=dataCrimeCategory3Model.data;
                break;
            case "category4":       crimeData=dataCrimeCategory4Model.data;
                break;
        }
        drawCrimes();
    };

    var init = function() {
        switch(_name){
            case "category1":       dataCrimeCategory1Model.subscribe(_notification,onCrimeData);
                break;
            case "category2":       dataCrimeCategory2Model.subscribe(_notification,onCrimeData);
                break;
            case "category3":       dataCrimeCategory3Model.subscribe(_notification,onCrimeData);
                break;
            case "category4":       dataCrimeCategory4Model.subscribe(_notification,onCrimeData);
                break;
        }
    }();

    return self;
}