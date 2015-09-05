(function(d3) {

    d3.ui = d3.ui || {};

    d3.ui.log = function OutputLog(selector) {
        var outputLog = d3.select(selector)
            .style({
                "display"    : "inline-block",
                "font-size"  : "10px",
                "margin-left": "10px",
                padding      : "1em",
                "white-space": "pre",
                "background" : "#fd9801",
            });
        outputLog.writeLine = (function() {
            var s = "";
            return function(l, indent) {
                this.text((s += ((indent ? "  " : "") + l + "\n")));
            }
        })();
        return outputLog
    }
})(d3)

