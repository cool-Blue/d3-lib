	/**
	 * Line Chart
	 */
	var LineChart = (function() {

		// default configuration
		var _DEFAULT_CONFIG = {
			id: 'chart',
			marginTop: 10,
			marginRight: 10,
			marginBottom: 10,
			marginLeft: 10,
			width: 600,
			height: 140,
			x: function(d, i) {return i},
			y: function(d) {return d}
		};

		// configuration
		var _config = {};

		// scales
		var _scales = {};

		// line handle
		var _line =
			d3.svg.line()
				.interpolate('basis')
				.x(function(d) {
					return _scales.x(d._x);
				})
				.y(function(d) {
					return _scales.y(d._y);
				});

		// svg handle
		var _svg = null;

		// data array
		var _data = [];

		// get series range
		// first and last element are cut out to paint a more precise line
		var _seriesRange = function(accessor) {
			var seriesRanges = [];
			_data.map(function(series) {
				d3.extent(series.filter(function(d, i) {
					return i > 0 && i < series.length - 1;
				}), accessor).map(function(d) {
					seriesRanges.push(d);
				});
			});
			return d3.extent(seriesRanges);
		};

		return {

			/**
			 * getter/setter for configuration
			 * @param {object} config configuration
			 * @returns {*}
			 */
			config: function(config) {
				if (typeof config === 'undefined') {
					return _config;
				}
				_config = cloneMerge(config, _DEFAULT_CONFIG);

				var id = _config.id;
				var width = _config.width;
				var height = _config.height;
				var marginTop = _config.marginTop;
				var marginRight = _config.marginRight;
				var marginBottom = _config.marginBottom;
				var marginLeft = _config.marginLeft;

				// update scales
				_scales.x = d3.time.scale().range([0, width]);
				_scales.y = d3.scale.linear().range([height, 0]);
				_scales.color = d3.scale.category10();

				// init svg
				_svg = d3.select(id)
					.append('svg')
					.attr('width', width + marginLeft + marginRight)
					.attr('height', height + marginTop + marginBottom)
						.append('g')
						.attr('transform', 'translate(' + marginLeft + ',' + marginRight + ')');

				// clipping path
				_svg.append('defs').append('clipPath')
					.attr('id', 'clip')
					.append('rect')
					.attr('width', width - marginLeft - marginRight)
					.attr('height', height - marginTop - marginBottom)
					.attr('x', marginLeft)
					.attr('y', marginTop);

				return this;
			},

			/**
			 * getter/setter for data
			 * @param {array} data data
			 * @returns {*}
			 */
			data: function(data) {
				if (typeof data === 'undefined') {
					return _data;
				}

				_data = data.forEach(function(series,i) {
					series.forEach(function(d, i) {
						Object.defineProperties(d, {
							_x: {get: _config.x},
							_y: {get: _config.y}
						})
					})
				}) || _data;
				return this;
			},

			/**
			 * draw chart
			 * @param {function} ready ready callback
			 * @returns {LineChart}
			 */
			draw: function(ready) {

				if(!_data[0] || (_data[0].length < 3)) return;

				// update scale domains
				_scales.x.domain(_seriesRange(_config.x));

				_scales.y.domain(_seriesRange(_config.y));

				_svg.selectAll('.series')
					.data(_data)
					.enter()
						.append('g')
						.attr('clip-path', 'url(#clip)')
						.attr('class', 'series')
							.append('path')
							.attr('class', 'line')
							.attr('stroke', function(d, i) {
								return _scales.color(i);
							});

				_svg.selectAll('.line')
					.attr('d', function(d) {
						return _line(d);
					})
					.attr('transform', null)
					.transition()
					.duration(950)
					.ease('linear')
					.attr('transform', function(d) {
						return 'translate(' + _scales.x(d[0].timestamp) + ')';
					})
					.each('end', function(d, i) {
						if (i === _data.length - 1) {
							ready();
						}
					});

				return this;
			},

			/**
			 * get scales
			 * @returns {}
			 */
			scales: function() {
				return _scales;
			}

		};
		function cloneMerge(newValue, defaultValue) {
			var clone = {};
			for(var p in defaultValue) clone[p] = newValue[p] || defaultValue[p];
			return clone;
		}
	})();
