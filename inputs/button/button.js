if(!inputs) var inputs = (function() {
    function button(selection, config, host) {
        // build an array of buttons on selection based on the structure of the config array
        return (selection.select ? selection : d3.select(selection))
            .selectAll("button")
            .data(config).enter().append("button")
            .attr("class", "g-button")
            // hook the events
            .each(function(config) {
                hookEvents.call(this, config)
                // set the initial value
                this.value = config.value;
                d3.select(this).classed("g-active", config.value);
            })
            .text(function(d) {
                return d.label;
            });
    };

	function toggle(selection, config, host) {
		// build an array of toggle buttons on selection based on the structure of the config array
		return (selection.select ? selection : d3.select(selection))
			.selectAll("button")
			.data(config).enter().append("button")
			.attr("class", "g-button")
			// hook the events
			.each(function(config) {
				hookEvents.call(this, config)
				// set the initial value
				this.value = config.value;
				d3.select(this).classed("g-active", config.value);
			})
			.text(function(d) {
				return d.label;
			}).on("click", function(d) {
				// hard-wire the toggle behaviour
				d3.event.stopPropagation();
				d3.select(this).classed("g-active", (d.value = (+d.value + 1) % 2));
                selection.call(updateGroup, d);
				// then process hooks
				d.on.click.apply(this, arguments)
			});
	}

	function number(selection, config, host) {
		return (selection.select ? selection : d3.select(selection))
			.selectAll("label")
			.data(config).enter().append("label")
			.attr("class", "g-number")
			.attr("for", IDp("name"))
			.text(IDp("label"))
			.append("input")
			.style("width", IDp("width", "8em"))
			.attr({
				id       : IDp("name"),
				class    : "inputs-number",
				type     : "number",
				min      : IDp("min"),
				max      : IDp("max"),
				step     : IDp("step"),
				inputmode: "numeric"
			})
			.property("value", IDp("value"))
			.each(hookEvents);
	}

	function hookEvents(config) {
		// store the DOM element
		var _control = this;
		// the bound data is the config object for the control
		// parse the keys and bind a listener to any key beginning with "on"
		Object.keys(config).filter(function(k) {
			return k.slice(0, 2) == "on";
		}).map(function(p, i, listeners) {
			// strip the event name off the listener
			var e = p.slice(2);

			if(!config.on)
			// lazily create a dispatch with the events found in config
				config.on = d3.dispatch
					.apply(null, listeners.map(function(l) {
						return l.slice(2);
					}));

			config.on.on(e, config[p]);
			// then hook the dispatch to the element event
			d3.select(_control).on(e, function() {
				config.on[e].apply(this, arguments)
			})

		});
	}
    function updateGroup(selection, source){
        if(source.value && source.group)
        // if grouped, dissable currently selected group sibling
            selection.each(function(b){
                d3.select(this).classed("g-active", !(b != source && b.group == source.group))
            });
    }

	return {
		button: button,
        toggle: toggle,
		number: number
	}
	function IDp(p, def) {
		return function(d) {
			return d[p] || def;
		}
	}
})();

