/**
 *  Class DataYelpModel
 *
 *  This class fetch the data of the potholes of Chicago city
 */

var DataYelpModel = function(notification, term) {
    var self = DataModel();

    self._notification = notification;
    self.interval = 120000;

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var customer_key = "E1wtlLW7YM3i4uBpc3Cn5A";
    var customer_secret = "4Zd1k4ERC8PDzAg9oksW_t0lw7w";
    var _yelpURL = "http://api.yelp.com/v2/search";
    var terms = term; //"term=cream+puffs&location=San+Francisco";
    var token_public = '5N-egiQwfvcKydR-pYrYzyA4wn_QqZu_';
    var token_secret = 'Fe7g29LlohGjz_ASGFqQX0dboMM';

    var maxBusiness = 100;

    var tempData;   // Contains the partial data

    self.barSelected=null;


    ////////////////////////// PUBLIC METHODS //////////////////////////

    self.fetchData = function() {

        var selection = selectionModel.getCircumscribedSelection();

        var q = queue(15);
        tempData = [];  // Contains the partial data

        // For all rectangle in the selection
        selection.forEach(function(rectangle) {

            var bounds = rectangle.circumscribed();

            q.defer(function(callback){ self.fetchSingleData(bounds, 0, callback); });
        });

        // When all data arrived call that callback
        q.await(function() {
            self.callback(tempData);
        });
    };

    self.barClicked = function(bar) {
        if(self.barSelected!==null && self.barSelected.id === bar.id){
            self.barSelected=null;
        }else
            self.barSelected = bar;
        self.dispatch(Notifications.data.BAR_SELECTION_CHANGED);
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    self.fetchSingleData = function(bounds, offsetNumber, callback) {

        // Calculate the search terms
        var sw = bounds.points[0];
        var ne = bounds.points[2];
        var searchTerms = "term="+terms+"&bounds="+sw[0]+","+sw[1]+"|"+ne[0]+","+ne[1];
        var limit  = "limit=20";        // Yelp API limits the result to 20
        var sort = "sort=0";            // Sort businesses for highest rated
        var offset = "offset=" + offsetNumber; // Add an offset, used in multiple queries

        var oauth = OAuth({
            consumer: {
                public: customer_key,
                secret: customer_secret
            },
            signature_method: 'HMAC-SHA1'
        });

        var token = {
            public: token_public,
            secret: token_secret
        };

        var request_data = {
            url: _yelpURL+"?"+searchTerms+"&"+limit+"&"+sort+"&"+offset,
            method: 'GET',
            data: {
                status: ''
            }
        };

        // Make the connection using OAuth 1.0 library
        $.ajax({
            url: self._proxyURL + request_data.url.replace("?","&"),
            type: request_data.method,
            data: oauth.authorize(request_data, token),
            headers: oauth.toHeader(oauth.authorize(request_data, token))
        }).done(function(data) {

            // Filters data for location
            var filteredData = data.businesses.filter(function(b) {
                var c = b.location.coordinate;
                return selectionModel.pointInside([c.latitude, c.longitude]);
            });

            tempData = tempData.concat(filteredData);

            // TODO: check if the graphic layer is overloaded
            self.callback(tempData);

            if(offsetNumber+20 >= maxBusiness ||
               data.total < offsetNumber+20)
                callback();
            else
                self.fetchSingleData(bounds, offsetNumber+20, callback)
        }).fail(function() {
            callback();
        })
    };


    var init = function() {

        // Listen for the selection update notification and call fetch when it changes
        notificationCenter.subscribe(Notifications.selection.SELECTION_CHANGED, self.dataChanged);

    }();

    return self;
};

var dataYelpRestaurantModel = DataYelpModel(Notifications.data.YELP_RESTAURANT_CHANGED, "food");
var dataYelpBarModel = DataYelpModel(Notifications.data.BAR_CHANGED, "bar");
