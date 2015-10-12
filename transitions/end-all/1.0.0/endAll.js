(function(d3) {
    if(!d3.cbTransition) d3.cbTransition = {};
    d3.cbTransition.endAll = function() {
        var groups = d3.map();
        return function endAll(transition, callback, group) {
            // invoke the last registerd callback after all of the members of the
            // transitions registered under the group namespace have completed.
            // e.g.
            //  trans1.call(d3.cbTransition.endAll, callback1, "myGroup")
            //  trans2.call(d3.cbTransition.endAll, callback2, "myGroup")
            // will invoke callback2 after all members of trans1 and trans2 are complete
            // (callback1 is ignored)

            // register the callback with ns as key (which is null if no group)
            var members;
            groups.set(group, (members = groups.get(group)) ? (members.push(callback), members) : [callback]);

            function callbackNS(context, args, namespace) {
                var g, cb = (g = groups.get(namespace)).pop();
                if(!g.length) {
                    cb.apply(context, args)
                    groups.remove(namespace)
                }
            }

            var n = 0;
            transition
                .each(function() { ++n; })
                .each("end.endAll", function() { if(!--n) callbackNS(this, arguments, group); })
                .each("interrupt.endAll", function() {
                    if(!--n) callbackNS(this, arguments, group);
                    console.log("interruption")
                });
            if(transition.empty()) callback();
        }
    }
})(d3);