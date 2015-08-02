if(!inputs) var inputs = {};
inputs.toggle = function(selection, config, host) {
// build an array of toggle buttons on selection based on the structure of the config array
	var events = ["click", "mouseover", "mouseout"],
			_buttons = (selection.select ? selection : d3.select(selection))
				.selectAll("button")
				.data(config).enter().append("button")
				.attr("class", "g-button")
				// hook the events
				.each(function(d){
					var b = this;
					Object.keys(d).map(function(p) {
						var l = p.match(/^on(.*)/);
						if(l = l && l[1]) {
							// if the key is a listener
							// create a dispatch and register the listener
							if(!d._on) d._on = d3.dispatch.apply(null, events);
							d._on.on(l, d[p]);
							// then hook the dispatch to the element event
							d3.select(b).on(l, function(){
								d._on[l].apply(this, arguments)
							})
						}
					});
					// set the initial value
					this.value = d.value;
					d3.select(this).classed("g-active", d.value);
				})
				.text(function(d) {
					return d.label;
				}).on("click", function(d) {
					// hard-wire the toggle behaviour
					d3.event.stopPropagation();
					d3.select(this).classed("g-active", (d.value = (+d.value + 1) % 2));
					// then process hooks
					d._on.click.apply(this, arguments)
				});
}