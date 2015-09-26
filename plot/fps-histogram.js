(function(d3) {

    d3.ui = d3.ui || {};

    d3.ui.FpsMeter = function Histogram(on, style, config) {
    var hist = d3.select(on).append("div")
            .style({
                "background-color": 'rgba(207,203,196,0.1)',
                display: "inline-block",
                margin: "0 0 0 6px"
            })
            .attr("id", "histogram")
            .append("svg")
            .style(merge({display: "inline-block", overflow: "visible"}, style))
            .attr(config),
        plot = hist.append("g")
            .attr(transplot(config.height)),
        xG = hist.append("g")
            .attr("id", "x-axis-g")
            .attr({"fill": "none", stroke: 'rgba(207,203,196,0.3)',
            "transform": "translate(0," + config.height + ")"}),

        defs = hist.append("defs"),
        gradient = defs.append("linearGradient")
                .attr({id: "xColor", x1: "0%",  y1: "0%", x2: "100%", y2: "0%"});
        gradient.append("stop")
                .attr({"offset": "0%", "stop-color": "red", "stop-opacity": "0.8"});
        gradient.append("stop")
                .attr({"offset": "50%", "stop-color": "orange", "stop-opacity": "1"});
        gradient.append("stop")
                .attr({"offset": "100%", "stop-color": "green", "stop-opacity": "0.8"});

    function update(data) {
        if (!data || !data.length) return;
        var x = d3.scale.linear()
                .domain(config.domain || [0, d3.max(data, config.values)])
                .range([0, config.width]),
            h = makeHist(data, config.values, x),
            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat("")
                .ticks(3)
                .tickSize(config.tickSize || 3),
            y = d3.scale.linear()
                .domain([0,d3.max(h, function(d){return d.y})])
                .range([0,config.height]),
            bars = plot.selectAll(".bar").data(h);

        bars.enter().append("rect")
            .attr("class", "bar")
            .style({fill: "orange", stroke: "none"});

        bars.exit().remove();

        bars.attr("height", function(d) {
            return y(d.y)
        })
            .attr("width", function(d) {
                return x(d.dx)
            })
            .attr("x", function(d){
                return x(d.x)
            });
        xG.call(xAxis);
        xG.selectAll(".domain").attr({"fill": "url(#xColor)", opacity: 0.6})
    }

    return update;

    function makeHist(data, values, x) {
        var bins = d3.scale.ordinal()
            .domain(d3.range(100))
            .rangeBands(x.domain())
            .range();
        return d3.layout.histogram()
            .bins(bins)
            .value(values)(data)
    }

    function merge(source, target) {
        for(var p in source) if(target && !target.hasOwnProperty(p)) target[p] = source[p];
        return target;
    }
}

})(d3)
