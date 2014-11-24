/**
 *
 * @param data  array of values to be displayed. 2 for every labels
 * @param labels    labels to display
 * @param colors    2 colors
 * @param unit      text to display bottom right, maybe split in two lines
 * @returns {*}
 * @constructor
 */
var HorizontalBarView = function(data, labels, colors, unit, unit2) {
    if(! (data.length == 2*labels.length))
        console.warn("data and lablels  not one the double of the other");
    if(colors.length != 2)
        console.warn("colors.length != 2");

    var self = UISvgView();

    var numOfCouples = data.length / 2;

    var rightMargin = 15,
        xmargin  = 5,
        xlinemargin = 1,
        bottomLineMargin = 10,
        textTopMargin = 10,
        rectWidth = 8;

    var xspacing = (100 -  rightMargin) / (numOfCouples+1);


    var init = function() {
        self.classed("horizontal-bar-view", true);
        self.setViewBox(0,0,450,120);
        //text
        var labelsSelection = self.selectAll("text").data(labels);
        var bars = self.selectAll("rect").data(data);
        labelsSelection.enter().append("text")
            .attr("y", 100 - bottomLineMargin + "%")
            .attr("dy", 8 + "%")
            .attr("x", function(d, i){return xspacing+ i*xspacing + "%"})
            .attr("fill","#FFFFFF")
            .attr("text-anchor","middle")
            .attr("font-size", 10)
            .text(function(d){return d});

        //bars
        var y = d3.scale.linear().domain([0,d3.max(data)]).range([0,100 - bottomLineMargin - textTopMargin]);
        bars.enter().append("rect")
            .attr("x", function(d, i){
                if(i%2 == 0){
                    return xspacing + (xspacing*Math.floor(i/2)) - rectWidth + "%";
                } else {
                    return xspacing + (xspacing*Math.floor(i/2)) + "%";
                }
            })
            .attr("y", function(d){return 100 - bottomLineMargin - y(d) + "%"})
            .attr("fill",function(d, i){return colors[i%2]})
            .attr("width", rectWidth + "%")
            .attr("height", function(d){return y(d) + "%"} );

        bars.enter()
            .append("text")
            .classed("inner-text",true)
            .attr("y", function(d){return 100 - bottomLineMargin - y(d) + "%"})
            .attr("x", function(d, i){
                if(i%2 == 0){
                    return xspacing + (xspacing*Math.floor(i/2)) - rectWidth + "%";
                } else {
                    return xspacing + (xspacing*Math.floor(i/2)) + "%";
                }
            })
            .attr("dy", function(d) {
                if(y(d) > 15){
                    return textTopMargin + "%"
                } else {
                    return -1 + "%"
                }
            })
            .attr("dx", rectWidth / 2 + "%")
            .attr("fill","#FFFFFF")
            .attr("text-anchor","middle")
            .attr("font-size", 10)
            .text(function(d){return d3.round(d,1)});

        //line
        self.append("line")
            .attr("x1",(xmargin + xlinemargin) + "%")
            .attr("y1", 100 - bottomLineMargin + "%")
            .attr("x2",(100 - xlinemargin) + "%")
            .attr("y2", 100 - bottomLineMargin + "%")
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 0.2 + "%");

        //unit
        self.append("text")
            .attr("x", 100 - xlinemargin + "%")
            .attr("y", 98 + "%")
            .attr("stroke", "#FFFFFF")
            .attr("font-size", 10)
            .attr("text-anchor","end")
            .attr("stroke-width", 0.2 + "%")
            .text(unit);

        if(unit2){
            //unit
            self.append("text")
                .attr("x", 100 - xlinemargin + "%")
                .attr("y", 107 + "%")
                .attr("stroke", "#FFFFFF")
                .attr("font-size", 10)
                .attr("text-anchor","end")
                .attr("stroke-width", 0.2 + "%")
                .text(unit2);
        }


    }();

    return self;
};