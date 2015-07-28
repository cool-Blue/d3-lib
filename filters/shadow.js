if(!filters) var filters = {};
// filter chain comes from:
// https://github.com/wbzyl/d3-notes/blob/master/hello-drop-shadow.html
// cpbotha added explanatory comments
// read more about SVG filter effects here: http://www.w3.org/TR/SVG/filters.html
filters.drop = function drop(svg, color, opacity){
	// filters go in defs element
	var id = "filter-drop-shadow",
			defs = svg.selectAll("defs").data([id]);
	defs.enter().append("defs");

	// create filter with id #drop-shadow
	// height=130% so that the shadow is not clipped
	var filter = defs.append("filter")
		.attr("id", function(d){return d})
		.attr({x: "-100%", y: "-100%", "height": "330%", "width": "330%"});

	// SourceAlpha refers to opacity of graphic that this filter will be applied to
	// convolve that with a Gaussian with standard deviation 3 and store result
	// in blur
	filter.append("feGaussianBlur")
		.attr("in", "SourceAlpha")
		.attr("stdDeviation",1)
		.attr("result", "blur");

	// translate output of Gaussian blur to the right and downwards with 2px
	// store result in offsetBlur
	filter.append("feOffset")
		.attr("in", "blur")
		.attr("dx", 2)
		.attr("dy", 2)
		.attr("result", "offsetBlur");

	filter.append("feFlood")
		.attr({"flood-color": color || "steelblue", "flood-opacity": opacity || "1"})
		.attr("result", "offsetColor");
	filter.append("feComposite")
		.attr({"in": "offsetColor", "in2": "offsetBlur", "operator": "in"})
		.attr("result", "offsetBlur");

	// overlay original SourceGraphic over translated blurred opacity by using
	// feMerge filter. Order of specifying inputs is important!
	var feMerge = filter.append("feMerge");

	feMerge.append("feMergeNode")
		.attr("in", "offsetBlur")
	feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");

	return "url(#" + id + ")"
}

filters.inset = function drop(svg, color, opacity){
	// filters go in defs element
	var id = "filter-inset-shadow",
			defs = svg.selectAll("defs").data([id]);
	defs.enter().append("defs");

	// create filter with id #drop-shadow
	// height=130% so that the shadow is not clipped
	var filter = defs.append("filter")
		.attr("id", id)
		.attr({x: "-50%", y: "-50%", "height": "200%", "width": "200%"});

	// invert the source image
	filter.append("feComponentTransfer")
		.attr("in", "SourceAlpha")
		.append("feFuncA")
		.attr({"type": "table", "tableValues": "1 0"})

	// SourceAlpha refers to opacity of graphic that this filter will be applied to
	// convolve that with a Gaussian
	filter.append("feGaussianBlur")
		.attr({"stdDeviation":3});

	// translate output of Gaussian blur to the right and downwards with 2px
	// store result in offsetBlur
	filter.append("feOffset")
		.attr("dx",5)
		.attr("dy",5)
		.attr("result", "offsetBlur");

	// flood the entire filter box
	filter.append("feFlood")
		.attr({"flood-color": color || "black", "flood-opacity": opacity || ".2"})
		.attr("result", "offsetColor");
	// mask the flood with the offset, inverted blur
	filter.append("feComposite")
		.attr({"in2": "offsetBlur", "operator": "in"});
	// then mask that with the source image
	filter.append("feComposite")
		.attr({"in2": "SourceAlpha", "operator": "in", result: "shadow"});

	// overlay original SourceGraphic over translated blurred opacity by using
	// feMerge filter. Order of specifying inputs is important!
	var feMerge = filter.append("feMerge");

	// merge with the shadow on top
	feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");
	feMerge.append("feMergeNode")
		.attr("in", "shadow")

	return "url(#" + id + ")"
}

filters.sphere = function drop(svg, baseColor, highlightColor) {
	// filters go in defs element
	var id = "filter-spherical-shading",
			defs = svg.selectAll("defs").data([id]);
	defs.enter().append("defs");
	var sphere = defs.append("radialGradient")
		.attr({"id": id, "cx": "50%", "cy": "50%", "r": "80%", "fx": "25%", "fy": "25%",});
	sphere.append("stop")
			.attr({"offset": "0%", "stop-color": highlightColor || "white"})
	sphere.append("stop")
			.attr({"offset": "75%", "stop-color": baseColor || "black"})
	return "url(#" + id + ")"
}
filters.bubble = function drop(svg, baseColor, opacity, highlightColor) {
	baseColor = baseColor || "black";
	opacity = opacity || 0.3;
	highlightColor = highlightColor || "white";
	var id = "filter-bubble-" + baseColor + "_" + highlightColor,
			defs = svg.selectAll("defs").data([id]),
			c = tinycolor(baseColor).toHsv(),
			stop1 = tinycolor({h: c.h, s: 100, v: 1}),
			stop2 = tinycolor({h: (c.h == 0) ? 0 : (c.h + 60)%360, s: 100, v: 0.75});

	defs.enter().append("defs");
	var sphere = defs.selectAll(".bubble").data([baseColor], function(d){return d}).enter()
		.append("radialGradient")
		.attr({"id": id, "cx": "50%", "cy": "50%", "r": "80%", "fx": "25%", "fy": "25%",});
	sphere.append("stop")
		.attr({"offset": "0", "stop-color": highlightColor || "white"})
	sphere.append("stop")
		.attr({"offset": "0.5", "stop-color": stop1.toHexString(), opacity: 0.65*opacity})
	sphere.append("stop")
		.attr({"offset": "1", "stop-color": stop2.toHexString(), opacity: 0.75*opacity})
	return "url(#" + id + ")"
}
