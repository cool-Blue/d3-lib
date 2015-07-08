/// <reference path="../../SO Questions/Pie Chart/d3/d3 CB.js" />
function get_browser_info() {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\w,\.]+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return { name: 'IE', version: (tem[1] || '') };
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/)
		if (tem != null) { return { name: 'Opera', version: tem[1] }; }
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
	return M[0] + "\tversion: " + M[1]
};
function setAttributes(e, desc) {
	var ns;
	for (var attr in desc) {
		if (ns = d3_ns.qualify(attr))
			e.setAttributeNS(ns, attr, desc[attr]);
		else
			e.setAttribute(attr, desc[attr]);
	}
	return e;
}
var d3_nsPrefix = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
d3_ns = {
	prefix: d3_nsPrefix,
	qualify: function (name) {
		var i = name.indexOf(":"), prefix = name;
		if (i >= 0) {
			prefix = name.slice(0, i);
			name = name.slice(i + 1);
		}
		//simplified by nailing it to a piece of wood...
		return d3_nsPrefix.hasOwnProperty(prefix) ? d3_nsPrefix[prefix] : null;
	}
};
