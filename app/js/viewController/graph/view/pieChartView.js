/**
 * Created by Luca on 17/11/2014.
 */
var PieChartView = function(data, colors) {
    var self = UISvgView();
    var w = 500; //viewBox dimensions
    var h = 500;
    var outerRadius = w / 2;
    var innerRadius = 0;
    var pie = d3.layout.pie();
    var _data = data;
    var totalSum = function() {
        var tmpSum= 0;
        for (var i = 0; i < data.length; i++){
            tmpSum += +data[i];
        }
        if (tmpSum === 0) {
            return 1;
        }
        return tmpSum;
    }();

    var _colors = colors;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var arcs;

    var init = function () {
        self.attr("viewBox", "0 0 " + w + " " + h)
            .attr("preserveAspectRatio","xMidYMid meet")
            .classed("view-piechart-graph", true);

        arcs = self.selectAll("g.arc")
            .data(pie(_data))
            .enter()
            .append("g")
            .attr("class", "piechart-arc")
            .style("fill", function(d, i) {
                return colors[i];
            })
            .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

        arcs.append("path")
            .attr("d", arc);

        arcs.append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d)[0]*1.2 + ", " + arc.centroid(d)[1]*1.2 + ")";
            })
            .attr("text-anchor", "middle")
            .attr("class","piechart-label")
            .attr("font-size", h/15)
            .text(function(d,i) {
                return Number((d.value/totalSum)*100).toFixed(1) + "%";
            });

    }();

    return self;
}