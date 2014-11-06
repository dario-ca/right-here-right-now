/**
 *  Class DataModel
 */

var DataModel = function(name) {
    var self = NotificationCenter();

    self._proxyURL = "proxy.php?csurl=";
    self._notification = Notification.data.GENERIC_DATA_CHANGED;  // Must be reimplemented in all subclasses
    var _observers = 0;
    var _active = false;    // Will not fetch
    var _timer = null;

    /** PUBLIC ATTRIBUTES**/

    self.data = null;   // Contains the data downloaded

    /* Contains the interval (in seconds) of re-fetching (0 if no automatic re-fetch) */
    self.interval = 0;


    /** PUBLIC FUNCTIONS**/

    var super_subscribe = self.subscribe;
    self.subscribe = function(notification, callback) {
        super_subscribe(notification, callback);

        _observers++;

        // Fetch data and enable timer
        if(_observers > 0 && _active == false) {
            _active = true;
            self.fetchData();

            // start timer
            if(self.interval > 0) {
                _timer = setInterval(function () {
                    self.fetchData();
                }, self.interval);
            }
        }
    };

    var super_unsubscribe = self.subscribe;
    self.unsubscribe = function(notification, callback) {
        super_unsubscribe(notification, callback);

        _observers--;

        // Disable timer if no observers are present
        if(_observers <= 0 && _active == true && _timer != null) {
            _active = false;
            clearInterval(_timer);
        }
    };

    self.fetchData = function() {
        // Must be reimplemented in all subclasses
    };

    /*
     * Called by the subclass when data is ready
     */
    self.callback = function(data) {
        if(compare(data, self.data) === false) {
            self.data = data;
            self.dispatch(self._notification);
        }
    };

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