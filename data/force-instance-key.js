/**
 * Created by Admin on 17/07/2015.
 */
function id(d){return d;}
function mark_key(d, i) {
	if(!Array.isArray(this)) d.bb = this.getBBox();
	return (d.source ? (d.source + d.target) : d.name) + d.marker + i;
};
force.nodes().forEach(mark(instID));
force.links().forEach(mark(instID));
function mark(brand) {
	return function(d) {
		d.marker = brand
	}
}
