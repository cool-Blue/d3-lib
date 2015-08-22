/**
 * Created by cool.blue@y7mail.com on 22/08/2015.
 * Returns an afine transform that maps from top left to bottom left origin
 *  the transform is wrapped in an object that will be accepted by .attr() in d3
 * @height
 * 	input, this is the height of the plot area in pixels
 */

function transplot(yRange){
	return {"transform": "matrix(" + [1, 0, 0, -1, 0, yRange] + ")"};
}