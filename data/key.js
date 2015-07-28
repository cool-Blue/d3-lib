/**
 * Created by Admin on 23/07/2015.
 */
function key(attr/*primative or object {elem-attribute: data-value|function}*/, /*optional if attr is an object*/value, /*optional*/log) {
	//join data and elements where value of attr is value
	function _phase(that) {
		return Array.isArray(that) ? "data" : "element";
	}

	function _Key(that) {
		if (plural) {
			return {
				data: function(d, i, j) {
					var a, key = i + "_" + j;
					for (a in attr) {
						key += (typeof attr[a] === "function" ? attr[a](d, i, j) : attr[a]);
					}
					return key;
				},
				element: function(d, i, j) {
					var a, key =  i + "_" + j;
					for (a in attr) {
						key += d3.select(that).attr(a);
					}
					return key;
				}
			}
		} else {
			return {
				data: function(d, i, j) {
					return typeof value === "function" ? value(d, i, j) : value;
				},
				element: function(d, i, j) {
					return d3.select(that).attr(attr)
				}
			}
		}
	}

	var plural = typeof attr === "object";
	if (plural && arguments.length === 2) log = value;

	return function(d, i, j) {
		var key = _Key(this)[_phase(this)].call(this, d, i, j);
		if (log) log.push(i + "_" + _phase(this) + "_" + key);
		return key;
	};
}