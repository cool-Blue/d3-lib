(function(d3) {
    d3.ui = d3.ui || {};
    d3.ui.number = function(config){
        // returns a function that returns an array of values from the input array
        // accepts a config object consisting of attribute and event members
        // each having a varying and a uniform member
        // attributes.varying is the minimum structure of the config object and must be an array
        // the keys of events.varying and events.uniform must be valid event names with
        // the values on events.varying being functions accepting elements of the varying attributes
        // as input and returning event callback functions
        // the values of events.uniform must be event callback functions
        var attributes = config.attributes,
            s = inputDiv.selectAll(".time")
                .data(attributes.varying)
                .enter().append("input")
                .attr({
                    id: function(v) {return v.name + "-selector"},
                    type: "number"
                })
                // use the first varying as a schema
                .attr(Object.keys(attributes.varying[0]).reduce(function(o, a) {
                    return (o[a] = function(d) {return d[a]}, o)
                }, {}))
                .attr(attributes.uniform);
        if(config.events){
            if(config.events.uniform)
                s.each(function(){
                    var n = d3.select(this), events = config.events.uniform;
                    Object.keys(config.events.uniform).forEach(function(e, i){
                        n.on(e, events[e])
                    })
                });
            if(config.events.varying)
                s.each(function(v){
                    var n = d3.select(this), events = config.events.varying;
                    Object.keys(config.events.varying).forEach(function(e){
                        n.on(e, events[e](v))
                    })
                });
        }
        return function(){
            var values = [];
            s.each(function(){
                values.push(d3.select(this).property("value"));
            });
            return  values;
        }
    }
})(d3)