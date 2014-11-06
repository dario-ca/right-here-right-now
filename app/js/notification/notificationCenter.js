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
        //not implemented yet

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
