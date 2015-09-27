(function(d3) {

    d3.ui = d3.ui || {};

    d3.ui.FpsMeter = function Histogram(on, style, config) {
        var BINS = 60;
        var _style   = merge({
                "background-color": 'black',
                display: "inline-block",
                margin: "0 0 0 6px"
            }, style),
            hist     = d3.select(on).append("div")
                .style(_style)
                .attr("id", "histogram")
                .append("svg")
                .style({display: "inline-block", overflow: "visible", margin: 0})
                .attr(merge({fill: "url(#xColor)"}, config)),
            plot     = hist.append("g")
                .attr(transplot(config.height))
                .classed("plot", true)
                .attr({"fill": "url(#xColor)"}),
            xAxis    = d3.svg.axis()
                .orient("bottom")
                .tickFormat("")
                .ticks(3)
                .tickSize(config.tickSize || 3),
            xG = hist.append("g")
                .attr({
                    "transform": "translate(0," + config.height + ")"
                })
            xFill = xG.append("g")
                .attr("id", "x-axis-fill")
                .attr({
                    "fill": "url(#xColor)", stroke: 'none'
                }),
            xLines = xG.append("g")
                .attr("id", "x-axis-stroke")
                .attr({
                    "fill": "none", stroke: _style["background-color"]//'rgba(207,203,196,0.8)'
                }),

            defs     = hist.append("defs"),
            gradient = defs.append("linearGradient")
                .attr({
                    id: "xColor", x1: "0%", y1: "0%", x2: "100%", y2: "0%",
                    gradientUnits: "userSpaceOnUse"
                });
        gradient.append("stop")
            .attr({"offset": "0%", "stop-color": "red"});
        gradient.append("stop")
            .attr({"offset": "50%", "stop-color": "orange"});
        gradient.append("stop")
            .attr({"offset": "100%", "stop-color": "green"});

        update(d3.range(BINS));

        function update(data) {
            if(!data || !data.length) return;
            var x    = d3.scale.linear()
                    .domain(config.domain || [0, d3.max(data, config.values)])
                    .range([0, config.width]),
                h    = makeHist(data, config.values, x),
                y    = d3.scale.linear()
                    .domain([0, d3.max(h, function(d) {return d.y})])
                    .range([0, config.height]),
                bars = plot.selectAll(".bar").data(h);

            bars.enter().append("rect")
                .attr("class", "bar")
                .attr({opactity: 1});

            bars.exit().remove();

            bars.attr("height", function(d) {
                return y(d.y)
            })
                .attr("width", function(d) {
                    return x(d.dx)
                })
                .attr("x", function(d) {
                    return x(d.x)
                });
            xAxis.scale(x);
            xFill.call(xAxis);
            xLines.call(xAxis);
        }

        return update;

        function makeHist(data, values, x) {
            var bins = d3.scale.ordinal()
                .domain(d3.range(BINS))
                .rangePoints(x.domain())
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
