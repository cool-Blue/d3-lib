function Trajectory (path, domain) {
	var trajectory = {},
			_scale = d3.scale.linear().domain(domain);

	trajectory.bind = function bind (selection) {
		//console.log(/function\s+(\w*)\(/.exec(arguments.callee)[1])
		this.each(function (d, i) { this.___trajectory = trajectory })
			.attr("transform", _translate);
	};
	trajectory.translateTween = function translateTween (d) {
		var n = this, i = d3.interpolate(this.___currentValue, d)
		//console.log(/function\s+(\w*)\(/.exec(arguments.callee)[1])
		return function (t) {
			return _translate.call(n, i(t))
		}
	};
	trajectory.translate = _translate;
	return trajectory;

	function _length() {
		return path.node().getTotalLength()
	};
	function _pointAtLength(d) {
		return path.node().getPointAtLength(_scale(d) * _length());
	};
	function _translate(d, i) {
		var p = _pointAtLength(d), trans = path.attr("transform");
		this.___currentValue = d;
		console.log(/function\s+(\w*)\(/.exec(arguments.callee)[1] + "\t" + path.attr("transform") + " translate(" + p.x + "," + p.y + ")")
		return (trans ? trans + " " : "") + "translate(" + p.x + "," + p.y + ")";
	};

}
var closestPoint = (function () {
	var prev = 0;
	return function closestPoint(pathNode, point, marker) {
		var t = pathNode.getTransformToElement(pathNode.parentNode),
				pathLength = pathNode.getTotalLength(),
				precision = pathLength / pathNode.pathSegList.numberOfItems * 2,
				best,
				bestLength,
				bestDistance = Infinity;

		// linear scan for coarse approximation
		for (var scan, scanLength = prev, scanDistance; scanLength <= pathLength; scanLength += precision) {
			if ((scanDistance = distance2(scan = pointAtLength(scanLength))) < bestDistance) {
				best = scan, bestLength = scanLength, bestDistance = scanDistance;
			}
		}
		//console.log(best);

		// binary search for precise estimate
		precision *= .5;
		while (precision > .5) {
			var before,
					after,
					beforeLength,
					afterLength,
					beforeDistance,
					afterDistance;
			if ((beforeLength = bestLength - precision) >= 0
				&& (beforeDistance = distance2(before = pointAtLength(beforeLength))) < bestDistance) {
				best = before, bestLength = beforeLength, bestDistance = beforeDistance;
			} else if ((afterLength = bestLength + precision) <= pathLength
				&& (afterDistance = distance2(after = pointAtLength(afterLength))) < bestDistance) {
				best = after, bestLength = afterLength, bestDistance = afterDistance;
			} else {
				precision *= .5;
			}
			//console.log(best);
			//update(scanLength, marker);
		}

		prev = bestLength;
		best = [best.x, best.y];
		best.distance = Math.sqrt(bestDistance);
		return best;

		function pointAtLength(l) {
			return pathNode.getPointAtLength(l).matrixTransform(t)
		}

		function distance2(p) {
			var dx = p.x - point[0],
					dy = p.y - point[1];
			return dx * dx + dy * dy;
		}
	}
})();

var closestPointSeg = (function () {
	var prev = 0 , midPoints, prevSeg = 0;
	return function (group, path, marker) {
		var pathNode = path.node(),
				point = d3.mouse(group.node()),
				t = pathNode.getTransformToElement(pathNode.parentNode),
				pathLength = pathNode.getTotalLength(),
				precision = pathLength / pathNode.pathSegList.numberOfItems * 2,
				best,
				bestLength, bestSeg,
				bestDistance = Infinity;

		midPoints = midPoints || ClosestPoint2(svg, path, marker.node());

		// linear scan for coarse approximation
		for (var scan, scanSeg = prevSeg, scanDistance; scanSeg < midPoints.length; scanSeg++) {
			if ((scanDistance = distance2(scan = midPoints[scanSeg].matrixTransform(t))) < bestDistance) {
				best = scan, bestSeg = scanSeg, bestDistance = scanDistance;
			}
		}

		bestDistance = Infinity;

		for (var scan, scanLength = prev, scanDistance; scanLength <= pathLength; scanLength += precision) {
			if ((scanDistance = distance2(scan = pointAtLength(scanLength))) < bestDistance) {
				best = scan, bestLength = scanLength, bestDistance = scanDistance;
			}
		}
		//console.log(best);

		// binary search for precise estimate
		precision *= .5;
		while (precision > .5) {
			var before,
					after,
					beforeLength,
					afterLength,
					beforeDistance,
					afterDistance;
			if ((beforeLength = bestLength - precision) >= 0
				&& (beforeDistance = distance2(before = pointAtLength(beforeLength))) < bestDistance) {
				best = before, bestLength = beforeLength, bestDistance = beforeDistance;
			} else if ((afterLength = bestLength + precision) <= pathLength
				&& (afterDistance = distance2(after = pointAtLength(afterLength))) < bestDistance) {
				best = after, bestLength = afterLength, bestDistance = afterDistance;
			} else {
				precision *= .5;
			}
			//console.log(best);
			//update(scanLength, marker);
		}

		prev = bestLength;
		prevSeg = bestSeg;
		best = [best.x, best.y];
		best.distance = Math.sqrt(bestDistance);
		return best;

		function pointAtLength(l) {
			return pathNode.getPointAtLength(l).matrixTransform(t)
		}

		function distance2(p) {
			var dx = p.x - point[0],
					dy = p.y - point[1];
			return dx * dx + dy * dy;
		}
	}
})();

var ClosestPoint2 = function (group, path, under) {
	var owner = d3.select(path.node().ownerSVGElement),
			width = owner.attr("width"),
			height = owner.attr("height"),
			ownerTransf = owner.attr("transform"),
			pathTrans = path.attr("transform"),
			voronoi = d3.geom.voronoi()
				.clipExtent([[-width / 2, -height / 2], [width / 2, height / 2]])
				.x(function (d) { return d.x})
				.y(function (d) { return d.y}),
			cell = group.insert("g", function () { return under })
				.attr("class", "voronoi")
				.selectAll("g");

	resample(group, path, under);

	return sample(svg, path.node());

	function resample(svg, path, under) {
		cell = cell.data(voronoi(sample(svg, path.node())));
		cell.exit().remove();
		var cellEnter = cell.enter().append("g").attr("transform", pathTrans);
		cellEnter.append("circle").attr("r", 3.5).style({ stroke: "black" , fill: "none"});
		cellEnter.append("path");
		cell.select("circle").attr("transform", function (d) {
			return "translate(" + [d.point.x, d.point.y] + ")";
		});
		cell.select("path").attr("d", function (d) {
			return "M" + d.join("L") + "Z";
		});
	}

	function sample(svg, path) {
		var colours = d3.scale.category20(),
				segList = path.pathSegList,
				segs = segList.numberOfItems,
				t = path.getTransformToElement(path.parentNode),
				p = { x: 0, y: 0 },
				samples = [],
				p2prev
				splnr = Spliner();

		for (var k = 0; k < segs; k++) {
			var x, y, x1, y1, x2, y2,
					d = "M" + p.x + " " + p.y + " ",
					s = segList.getItem(k),
					tx, ty,
					pSVG = owner.node().createSVGPoint();

			if (hasAll(s, "x2", "y2")) {
				x2 = s.x2;
				y2 = s.y2;
				d += s.pathSegTypeAsLetter + x2 + " " + y2 + " ";
				p2prev.x = x2; p2prev.y = y2;
			}
			if (hasAll(s, "x1", "y1")) {
				x1 = s.x1;
				y1 = s.y1;
				d += d ? x1 + " " + y1 + " " : s.pathSegTypeAsLetter + x1 + " " + y1 + " ";
			}
			if (hasAll(s, "x", "y")) {
				p.x = x = s.x;
				p.y = y = s.y;
				d += d ? x + " " + y + " " : s.pathSegTypeAsLetter + x + " " + y + " ";
			}
			var seg = svg.append("g")
					.attr("transform", d3.select(path).attr("transform")),
					arc = seg.append("path").attr("d", d)
					.attr("stroke", colours(k % 20))
					.attr("stroke-width", 1)
					.attr("fill", "none")
					.on("mouseenter", (function (k, x, y, x1, y1, x2, y2) {
						return function (d, i) {
							log3.text(f(x) + ", " + f(y) + "\t:\t" + f(x1) + ", " + f(y1) + "\t:\t" + f(x2) + ", " + f(y2) + "\t\t: " + f(k))
						}
					})(k, x, y, x1, y1, x2, y2))
					.node(),
					midPoint = arc.getPointAtLength(arc.getTotalLength() / 2);
			seg.append("text").attr("x", midPoint.x).attr("y", midPoint.y).text(k).style("font-size", 8).attr("fill", colours(k % 20));

			seg.append("circle")
					.attr("fill", colours(k % 20))
					.attr("r", 3)
					.attr("cx", midPoint.x)
					.attr("cy", midPoint.y)
					.on("mouseenter", (function (k) {
						return function (d, i) {
							var c = d3.select(this);
							c = { cx: Number(c.attr("cx")), cy: Number(c.attr("cy")) }
							log3.text(f(c.cx) + ", " + f(c.cy) + "\t\t: " + f(k))
						}
					})(k))
			//samples.push([midPoint.x, midPoint.y])
			samples.push((pSVG.x = midPoint.x, pSVG.y = midPoint.y, pSVG))
		}
		return samples;

		function hasAll(o /*property list*/) {
			return [].slice.call(arguments, 1).every(function (p) {
				return p in o
			})
		}

		function Spliner() {
			var map = d3.map();
			map.set("S", "C");
			map.set("s", "c");
			map.set("T", "Q");
			map.set("t", "q");
			function _reflect (p1, p2) {
				return { x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y }
			}
			return {
				cp1: _reflect,
				type: map.get,
			}
		}
	}
};