(function(d3){
    d3.ui = d3.ui || {};
    d3.ui.tooltip = function tooTip(config /*base, offset, style*/) {
        // designed to be used as an event listener where the callback context is the event source
        var base = config.base,
            tt = (base ?
                  base.append ? base : d3.select(base) :
                  d3.select("body")).append("div")
                .attr("class", "d3-ui-tool-tip")
                // defaults
                .style({
                    position: "absolute",
                    color: "black",
                    width: "10px",
                    padding: "0 1em 0 1em",
                    background: "#ccc",
                    'border-radius': "2px",
                    display: "none"
                })
                // merge client styles
                .style(config.style);
        return function(message) {
            // context is the event source
            return message ?
                   function() {
                       var rect = this.getBoundingClientRect(),
                           config_offset = config.offset,
                           top = config_offset && config_offset.top,
                           left = config_offset && config_offset.left;
                       tt
                           .style({
                               top: (top ? offset(top) : rect.bottom + 6) + "px",
                               left: (left ? offset(left) : (rect.right + rect.left) / 2) + "px",
                               display: "inline-block"
                           })
                           .text(message);
                       function offset(position){
                           return typeof position === "function" ?
                                  position(rect) :
                                  rect[position.ref] + position.offset;
                       }
                   }:
                   function() {
                       tt
                           .style({
                               display: "none"
                           })
                   };
        }
    }
})(d3);