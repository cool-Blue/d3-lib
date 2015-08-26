/**
 * Created by Admin on 26/08/2015.
 */
/**
 *
 * @param context
 * @param source
 * @param target
 * @param events
 * @returns target
 */
function bindevents(context, source, target, events){
	// events
	// rebind on and all of the events as methods on fdg
	return d3.rebind.bind(context, source, target, "on").apply(context, events);
}