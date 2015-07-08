elapsedTime.start = function (aveWindow) {
	this.aveLap = this.AveLap(aveWindow || 1000)
	this.startTime = window.performance.now()
	this.lapTime = this.startTime
	this.ticks = 0
	this.update(0)
	this.running = true
	return this
}
elapsedTime.lap = function () {
	if (this.running) {
		this.lastLap = (window.performance.now() - this.lapTime) / 1000
		this.lapTime = window.performance.now()
	}
	return this
}
elapsedTime.AveLap = function (aveWindow) {
	var _i = 0, _aveP = 0, _history = [];
	this.AveLap.window = aveWindow = aveWindow || this.AveLap.window
	return function (this_lap) {
		this_lap = this_lap || this.lap().lastLap
		if (!this.AveLap.window) return _aveP = _i++ ? (_aveP + this_lap / (_i - 1)) * (_i - 1) / _i : this.lap().lastLap;
		if (this_lap) _history.push(this_lap);
		for (; _history.length > this.AveLap.window;) {
			_history.shift()
		}
		return _history.reduce(function (ave, t, i, h) {
			return ave + t / h.length
		}, 0)
	}
}
elapsedTime.AveLap.window = null
elapsedTime.t = function () {
	return d3.format(",.3f")((window.performance.now() - this.startTime) / 1000)
}
elapsedTime.mark = function (f) {
	if (this.running) {
		var _tMark = (window.performance.now() - this.startTime);
		this.ticks += 1
		if (!f) {
			this.update(_tMark / 1000)
		} else if (f.call) {
			f.call(this, _tMark)
		} else this.update(f)
	} else {
		_tMark = 0
		//this.start()
	}
	return this
}
elapsedTime.message(function (value) {
	return 'time elapsed : ' + d3.format(",.3f")(value)
			+ ' sec\t' + d3.format(",d")(this.ticks)
});
elapsedTime.stop = function (value) {
	this.running = false
	return this
}
elapsedTime.timestamp = function (message) {
	if (this.consoleOn) {
		this.mark(function (t) {
			console.log(d3.format(",.6f")(t / 1000) + (message ? "\t" + message : ""))
		})
	}
}
elapsedTime.consoleOn = false;

