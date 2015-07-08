//based on http://xaedes.de/dev/transitions/
function resumed_ease( ease, elapsed, dirn) {
  var y = typeof ease == "function" ? ease : d3.ease.call(d3, ease);
  return function( x_resumed ) {
    //map x so that [0, 1] returns [elapsed, 1]
    var x_original = d3.scale
        .linear()
        .domain(dirn)
        .range([elapsed,dirn[1]])
    ( x_resumed );
    // map y so that [0, 1] returns [y(elapsed), 1]
     var y_of_x = d3.scale
        .linear()
        .domain([ y(elapsed), dirn[1]])
        .range(dirn)
    ( y ( x_original ) );
    console.log("x_resumed:\t" + f(x_resumed) + "\tx_original:\t" + f(x_original) + "\ty(x_original):\t" + f(y_of_x));

    return y_of_x;
  };
  function f(x) {
    return d3.format(">8,.4f")(x);
  }
}
function easeResume (transition, ease, dirn) {
  var y = typeof ease == "function" ? ease : d3.ease.call(d3, ease),
      time = this.duration(),
      //use the first node as a place to keep time
      n = d3.select(this.node());

  if (n.attr("T") === null) n.attr("T",0);

  var pos = getPosition(), timeLeft =  time * (dirn[1] ? (1- pos) : pos);

  console.log(timeLeft + "\t" + dirn[1]);

  n.transition("timer")
      .each(function(d){return d})
      .duration( timeLeft )
      .ease( "linear" )
      .attr("T", dirn[1])
      .each("interrupt", console.log("n interrupted!"));
      //.each("end", function() {
      //    n.attr("T", dirn[1])
      //});

  this.ease(resumed_ease(y, getPosition(), dirn))
      .each("end", function(d, i){
        //stop timer transition
        n.transition("timer").duration(0);
        transition.___event_end.call(this, d, i, "hooked")
      })
      .each("interrupt", function(d, i){
        //stop timer transition
        n.transition("timer").duration(0);
        transition.___event_int.call(this, d, i, "hooked")
      })
      .duration( timeLeft ); //time * (+timeLeft ? timeLeft : dirn) );
  //this.ease(ease)

  function getPosition() {
    return n.attr("T")
  }
}