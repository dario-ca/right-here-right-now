/**
 *  Class NotificationCenter
 */

var NotificationCenter = function() {
    var self = {};


    var _callbacks = [];


    /** PUBLIC FUNCTIONS**/

    /**

     */
    self.subscribe = function(notification, callback) {
        _callbacks.push({notification : notification, callback : callback});

    };

    self.unsubscribe = function(notification, callback) {
        var index = -1;
        for(var i=0; i<_callbacks.length; i++) {
            var c = _callbacks[i];
            if(c.notification == notification &&
                c.callback == callback) {
                index = i;
                break;
            }
        }
        if(index >= 0) {
            _callbacks.splice(index,1);
            return true;
        }
        else {
            return false;
        }


    };

    self.dispatch = function(notification) {
        _.filter(_callbacks,
            function(c){return c.notification === notification})
            .forEach(
                function(c){c.callback();}
            );
    };


    /** PRIVATE FUNCTIONS**/

    var privateFunction = function(variable) {

    };



    var init = function() {

        //initialization stuff

    }();

    return self;
};

//global notification center
var notificationCenter = NotificationCenter();
