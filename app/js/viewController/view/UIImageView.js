/**
 *  Class UIImageView
 *  @param imageElement is optional
 */
var UIImageView = function(imageElement) {

    var self = null;
    if(imageElement){
        self = UIView(imageElement);
    } else {
        self = UIView(d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'image')));
    }



    /** PUBLIC FUNCTIONS**/

    self.__defineSetter__("imageSrc", function(imageSrc) {
        self.attr("xlink:href", imageSrc);
    });

    self.__defineGetter__("imageSrc", function(imageSrc) {
        return self.attr("xlink:href");
    });

    /** PRIVATE FUNCTIONS**/


    var init = function() {

        self.classed("ui-image-view", true);



    }();

    return self;
};