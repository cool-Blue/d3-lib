(function(d3) {

    var exports = d3.cbPlot = d3.coolPlot || {};

    /**
     * Created by cool.blue@y7mail.com on 22/08/2015.
     * Returns an afine transform that maps from top left to bottom left origin
     *  the transform is wrapped in an object that will be accepted by .attr() in d3
     * @param height
     *    - height of the plot area in pixels
     * @returns
     *  - attr object
     */

    function transplot(yRange) {
        return {"transform": "matrix(" + [1, 0, 0, -1, 0, yRange] + ")"};
    }

    /**
     * Reverses the local mirroring of transplot
     * @returns {{transform: string}}
     */
    function transflip() {
        return {"transform": "matrix(" + [1, 0, 0, -1, 0, 0] + ")"};
    }

    /**
     *
     * @param tickSize
     * @returns {tickSize}
     */
    function tickSize(tickSize) {
        var axis      = this,
            tickSize0 = Math.max(axis.innerTickSize(), 0),
            tickSize1 = Math.max(tickSize, 0),
            padding   = Math.max(axis.tickPadding(), 0) + tickSize0 - tickSize1;
        axis.innerTickSize(tickSize).tickPadding(padding);
        return this;
    }

    function tickSubdivide(n) {
        var axis = this, scale = axis.scale(),
            tickLabels = scale.ticks;

        function coolAxis(selection) {
            selection.call(axis);
            selection.each(function(){
                var g = d3.select(this), t = tickLabels(),
                    minorTicks = g.selectAll(".tick.minor")
                        .data(scale.ticks(axis.ticks()[0] * n), function(d) { return d; });
                minorTicks.enter().insert("g", ".domain").attr("class", "tick minor")
                    .attr({
                        "transform": function(d) {return "translate(0," + scale(d) + ")"}
                    })
                    .append("line")
                    .transition("minor")
                    .attr({
                        "y2": 0,
                        "x2": -3
                    });
                minorTicks.exit().remove();
            })
        }

        return d3.rebind.bind(null, coolAxis, axis).apply(null, Object.keys(axis));
    }

    /**
     * Axis constructor that returns custom behaviour on d3.svg.axis
     *
     */
    function d3TransfAxis() {
        var axis = d3.svg.axis();

        function transAxis(g) {
            g.call(axis).selectAll(".tick text, .tick line").attr(transflip())
            if(d3.select(g.node()).classed("x")) g.selectAll(".domain").attr(transflip());
        }

        axis.tickSize = tickSize.bind(axis);
        d3.rebind.bind(null, transAxis, axis).apply(null, Object.keys(axis))
        return transAxis;
    }
    exports.transplot = transplot;
    exports.transflip = transflip;

    exports.d3Axis = function d3Axis() {
        var axis = d3.svg.axis();
        axis.tickSize = tickSize.bind(axis);
        axis.tickSubdivide = tickSubdivide.bind(axis);
        return axis;
    }
})(d3)