/**
 *  Class DataModel
 */

var DataModel = function(name) {
    var self = NotificationCenter();

    self._proxyURL = "proxy.php?csurl=";
    self._notification = Notifications.data.GENERIC_DATA_CHANGED;  // Must be reimplemented in all subclasses
    var _observers = 0;
    var _active = false;    // Will not fetch
    var _timer = null;

    ////////////////////////// PUBLIC ATTRIBUTES ///////////////////////////

    self.data = null;               // Contains the data downloaded

    self.modifiedData = null;

    self.duplicateCheck = true;     // If true check for duplicates and doesn't send notification if found

    /* Contains the interval (in milli-seconds) of re-fetching (0 if no automatic re-fetch) */
    self.interval = 0;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    var super_subscribe = self.subscribe;
    self.subscribe = function(notification, callback) {
        super_subscribe(notification, callback);

        _observers++;

        self.dataRequested();

        if(_active == true && self.data != null) {
            // Data is already present, call callback
            callback();
        }
    };

    /**
     * Use this when the selection is activated
     */
    self.startFetching = function() {
        _active = true;
        self.fetchData();

        // start timer
        if(self.interval > 0) {
            _timer = setInterval(function () {
                self.fetchData();
            }, self.interval);
        }
    };

    self.stopFetching = function() {
        _active = false;
        clearInterval(_timer);
    };

    /**
     * This function evaluate if the new data must be fetched
     */
    self.dataRequested = function() {

        // Fetch data and enable timer
        if(_observers > 0 &&
            _active == false &&
            selectionModel.isEmpty() == false) {
            self.startFetching();
        }
        else if(selectionModel.isEmpty() == true &&
                _observers > 0) {
            self.data = [];
            self.dispatch(self._notification);
        }
    };


    /**
     * Call this function when data change
     */
    self.dataChanged = function() {
        self.stopFetching();
        self.dataRequested();
    };

    var super_unsubscribe = self.unsubscribe;
    self.unsubscribe = function(notification, callback) {
        var unsubscribed = super_unsubscribe(notification, callback);

        if(unsubscribed)
            _observers--;

        // Disable timer if no observers are present
        if(_observers <= 0 && _active == true && _timer != null) {
            self.stopFetching();
        }
    };

    self.fetchData = function() {
        // Must be reimplemented in all subclasses
    };

    /*
     * Called by the subclass when data is ready
     */
    self.callback = function(data) {
        if(self.duplicateCheck) {
            if (compare(data, self.data) === false) {

                if(jQuery.isEmptyObject( self.data ) == false) {
                    // Save the differences between new and old data
                    //                              NEW   OLD
                    self.modifiedData = differences(data, self.data);
                }

                // Update the data
                self.data = data;

                self.dispatch(self._notification);
            }
        }
        else {
            self.data = data;
            self.dispatch(self._notification);
        }
    };


    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////

    var init = function() {

        // Listen for the selection update notification and call fetch when it changes

    }();

    return self;
};

/*
 * Comparison function for object differences
 */
var compare = function( x, y ) {
    if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

    if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for ( var p in x ) {
        if ( ! x.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor

        if ( ! y.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if ( x[ p ] === y[ p ] ) continue;
        // if they have the same strict value or identity then they are equal

        if ( typeof( x[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if ( ! arguments.callee( x[ p ],  y[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }

    for ( p in y ) {
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
};

/*
    Create an object with the differences between two objects
    x: new object
    y: old object
 */
var differences = function( x, y ) {
    if ( x === y ) return {};
    // if both x and y are null or undefined and exactly the same

    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return x;
    // if they are not strictly equal, they both need to be Objects

    if ( x.constructor !== y.constructor ) return {};
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.


    if(Array.isArray(y)) {
        var o = [];

        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;
            // other properties were tested using x.constructor === y.constructor

            /*
            if (!y.hasOwnProperty(p)) {
                o.push(x[p]);
            }
            */
            // allows to compare x[ p ] and y[ p ] when set to undefined

            if(y.filter(function(e) {
                    return compare(e, x[p]);
                }).length > 0)
                continue;
            // if they have the same strict value or identity then they are equal

            o.push(x[p]);
            /*
            if (typeof( x[p] ) !== "object") {
                o.push(x[p]);
            }
            */
            // Numbers, Strings, Functions, Booleans must be strictly equal

        }
        return o;
    }
    else {  // It is an object
        var o = {};

        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;
            // other properties were tested using x.constructor === y.constructor

            if (!y.hasOwnProperty(p)) {
                o[p] = x[p];
            }
            // allows to compare x[ p ] and y[ p ] when set to undefined

            if (x[p] === y[p]) continue;
            // if they have the same strict value or identity then they are equal

            if (typeof( x[p] ) !== "object") {
                o[p] = x[p];
                continue;
            }
            // Numbers, Strings, Functions, Booleans must be strictly equal

            o[p] = arguments.callee(x[p], y[p]);
            // Objects and Arrays must be tested recursively
        }
    }

    return o;

};