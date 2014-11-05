/**
 *  Class ExternalSvgViewController
 */
var ExternalSvgViewController = function(svgPath) {
    var self = SvgViewController();

    var _svgPath = svgPath;

    /** PRIVATE FUNCTIONS**/

    var loadSvg = function() {
        d3.xml(_svgPath, 'image/svg+xml', function (error, data) {

            self.view.node().appendChild(data.documentElement);

            //Generate all getter
            self.view.selectAll("*")[0].forEach(function(node){
                var id = d3.select(node).attr("id");
                var d3Node = d3.select(node);
                var uiView = null;

                var tagName = $(node).prop("tagName").toLowerCase();

                //Wrap the svg element with ours high level class
                if(tagName == "svg") {
                    uiView = UISvgView(d3Node);
                } else if(tagName == "g") {
                    uiView = UIGView(d3Node);
                } else if(tagName == "image") {
                    uiView = UIImageView(d3Node);
                } else {
                    uiView = UIView(d3Node);
                }


                if(id) {
                    self.view.__defineGetter__(id, function(){
                        return uiView;
                    });
                }

            });

            //get the first child and adapt the viewBox
            var firstChild = UISvgView(self.view.select("*"));
            self.view.setViewBox(0,0,firstChild.width, firstChild.height);

        });
    };

    var init = function() {
        loadSvg();
    }();

    return self;
};