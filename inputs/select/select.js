(function() {
	// Example
	// <script src="https://gitcdn.xyz/repo/cool-Blue/d3-lib/master/inputs/select/select.js"></script>
	//
	//		isoLines = d3.ui.select({
	//			base: inputs,
	// 			onUpdate: update,
	//			data: [{text: "show lines", value: "#ccc"}, {text: "hide lines", value: "none"}]
	//		}),
	//
	//		.style("stroke", isoLines.value());
	//

	d3.ui = d3.ui || {};
	d3.ui.select = function (options) {
		// add a select element on base with options matching data
		// if the text and value is the same then data is scalar array
		// 	otherwise the data elements must have text and value fields
		//
		var base = (options.base ? (options.base.append ? options.base : d3.select(options.base))
															: "body")
			.append("select")
			.on(options.on || "input", options.onUpdate)  // bind the listener to the outer element
			.selectAll("option")
			.data(options.data);
		base.enter().append("option");
		base.exit().remove();
		return base.attr("value", function (d) {
			return d.value || d;
		}).text(function (d) {
			return d.text || d
		})
		.call(function () { //add a custom property to the final selection
			if (options.hook) options.hook();
			this.value = function () {
				return this[0].parentNode.value
			}
		});
	}
	//experiment with chaining...
	d3.ui.select2 = function (base){
		var _base, _on, _onUpdate, _data;
		function select(){}
		d3_ui_select.base = function(base){
			_base = (base.append ? base : d3.select(base)).append("select");
			return this;
		}
		function on(on, listener) {
			if (arguments.length == 1) return _on;
			return this.on(_on || "input", _onUpdate)
		}
	}

})(d3)
