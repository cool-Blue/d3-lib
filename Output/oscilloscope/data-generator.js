	/**
	 * Data Generator
	 */
	var DataGenerator = (function() {

		// number of series
		var _numberOfSeries = 1;

		// number of data points
		var _numberOfDataPoints = 40;

		// start at timestamp
		var _startTimestampAt = new Date().getTime();

		// start at value
		var _startValueAt = 50;

		// incrementTo (i days by default)
		var _incrementTo = function(c, i) {
			var date = new Date(c);
			date.setDate(date.getDate() + i);
			return date.getTime();
		};

		// data array
		var _data = [];

		// create normal distribution of num numbers with mean and deviation
		var _distribute = function(num, mean, deviation) {
			return d3.range(num).map(d3.random.normal(mean, deviation));
		};

		// shift directions
		var _SHIFT_TO_LEFT = -1;
		var _SHIFT_TO_RIGHT = 1;

		// shift data by num positions to direction (-1 for left, 1 for right)
		var _shift = function(direction, num) {
			for (var i=0, n=_data.length; i<n; i++) {
				if (direction === _SHIFT_TO_LEFT) {
					for (j=0; j<num; j++) {
						var newValue = _data[i].shift();
						newValue.timestamp = _incrementTo(_data[i][_data[i].length - 1].timestamp, 1);
						_data[i].push(newValue);
					}
				}
				if (direction === _SHIFT_TO_RIGHT) {
					for (j=0; j<num; j++) {
						var newValue = _data[i].pop();
						newValue.timestamp = _incrementTo(_data[i][0].timestamp, -1);
						_data[i].unshift(newValue);
					}
				}
			}
		};

		return {

			/**
			 * getter/setter for number of series
			 * @param {number} num number of series to generate
			 * @returns {*}
			 */
			numberOfSeries: function(num) {
				if (typeof num === 'undefined') {
					return _numberOfSeries;
				}
				_numberOfSeries = num;
				return this;
			},

			/**
			 * getter/setter for number of data points
			 * @param {number} num number of data points to generate
			 * @returns {*}
			 */
			numberOfDataPoints: function(num) {
				if (typeof num === 'undefined') {
					return _numberOfDataPoints;
				}
				_numberOfDataPoints = num;
				return this;
			},

			/**
			 * getter/setter for start timestamp
			 * @param {number} start start timestamp
			 * @returns {*}
			 */
			startTimestampAt: function(start) {
				if (typeof start === 'undefined') {
					return _startTimestampAt;
				}
				_startTimestampAt = start;
				return this;
			},

			/**
			 * getter/setter for start value
			 * @param {number} start start value
			 * @returns {*}
			 */
			startValueAt: function(start) {
				if (typeof start === 'undefined') {
					return _startValueAt;
				}
				_startValueAt = start;
				return this;
			},

			/**
			 * getter/setter for increment to callback
			 * @param {function} inc increment callback
			 * @returns {*}
			 */
			incrementTo: function(inc) {
				if (typeof inc === 'undefined') {
					return _incrementTo;
				}
				_incrementTo = inc;
				return this;
			},

			/**
			 * generate data
			 * @param {number} mean mean for normal distribution
			 * @param {number} deviation deviation for normal distribution
			 * @returns {DataGenerator}
			 */
			generate: function(mean, deviation) {

				var m = mean || 0;
				var d = deviation || 0.2;

				for (var i=0; i<_numberOfSeries; i++) {
					_data[i] = [];
					var distribution = d3.range(_numberOfDataPoints).map(d3.random.normal(m, d));
					for (var j=0; j<_numberOfDataPoints; j++) {
						_data[i][j] = {
							timestamp: _incrementTo(_startTimestampAt, j),
							value: _startValueAt + distribution[j]
						};
					}
				}

				return this;
			},

			/**
			 * shift data points to the left by num positions
			 * @param {number} num number of positions to shift
			 */
			shiftToLeft: function(num) {
				_shift(_SHIFT_TO_LEFT, num);
				return this;
			},

			/**
			 * shift data points to the right by num positions
			 * @param {number} num number of positions to shift
			 */
			shiftToRight: function(num) {
				_shift(_SHIFT_TO_RIGHT, num);
				return this;
			},

			get: function() {
				return _data;
			}

		};

	})();
