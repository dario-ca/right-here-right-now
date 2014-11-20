/**
 *
 * @param data  array of values to be displayed. 2 for every labels
 * @param labels    labels to display
 * @param colors    2 colors
 * @param unit      text to display bottom right
 * @returns {*}
 * @constructor
 */
var VerticalBarView = function(data, labels, colors, unit, unit2) {
    if(! (data.length == 2*labels.length))
        console.warn("data and lablels  not one the double of the other");
    if(colors.length != 2)
        console.warn("colors.length != 2");

    var self = UISvgView();

    var yspacing = 18,
        xmargin  = 20,
        xlinemargin = 1,
        rectHeight = 6;


    var init = function() {
        self.classed("vertical-bar-view", true);
        self.setViewBox(0,0,450,150);
        //text
        var labelsSelection = self.selectAll("text").data(labels);
        var bars = self.selectAll("rect").data(data);
        labelsSelection.enter().append("text")
            .attr("y", function(d, i){return yspacing+ i*yspacing + "%"})
            .attr("dy", 6 + "%")
            .attr("x", xmargin + "%")
            .attr("fill","#FFFFFF")
            .attr("text-anchor","end")
            .attr("font-size", 10)
            .text(function(d){return d});

        //bars
        var x = d3.scale.linear().domain([0,d3.max(data)]).range([0,60]);
        bars.enter().append("rect")
            .attr("y", function(d, i){return yspacing + (Math.floor(i/2))*yspacing + ((i%2)*rectHeight) + "%"})
            .attr("x", function(d, i){return xlinemargin + xmargin + "%"})
            .attr("fill",function(d, i){return colors[i%2]})
            .attr("width",function(d){return x(d) + "%"} )
            .attr("height", rectHeight + "%");
        bars.enter()
            .append("text")
            .classed("inner-text",true)
            .attr("y", function(d, i){return yspacing + (Math.floor(i/2))*yspacing + ((i%2)*rectHeight) + "%"})
            .attr("x", function(d){return xlinemargin + xmargin + x(d) + "%"})
            .attr("dy", rectHeight + "%")
            .attr("fill","#FFFFFF")
            .attr("text-anchor",
                    function(d){
                        if(x(d) < 30)
                            return "start";
                        else return "end";
                    })
            .attr("font-size", 10)
            .text(function(d){return d3.round(d,1)});

        //line
        self.append("line")
            .attr("x1",(xmargin + xlinemargin) + "%")
            .attr("y1", 5 + "%")
            .attr("x2",(xmargin + xlinemargin) + "%")
            .attr("y2", (yspacing * labels.length + 20) + "%")
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 0.2 + "%");

        //unit
        self.append("text")
            .attr("x", 80 + "%")
            .attr("y", 93 + "%")
            .attr("stroke", "#FFFFFF")
            .attr("font-size", 10)
            .attr("text-anchor","end")
            .attr("stroke-width", 0.2 + "%")
            .text(unit);

        if(unit2) {
            //unit
            self.append("text")
                .attr("x", 80 + "%")
                .attr("y", 100 + "%")
                .attr("stroke", "#FFFFFF")
                .attr("font-size", 10)
                .attr("text-anchor","end")
                .attr("stroke-width", 0.2 + "%")
                .text(unit2);
        }


    }();

    return self;
};