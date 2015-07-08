function SliderControl(selector, title, value, domain, format) {
	var accessor = d3.functor(value), rangeMax = 1000,
			_scale = d3.scale.linear().domain(domain).range([0, rangeMax]),
			_$outputDiv = $("<div />", { class: "slider-value" }),
			_update = function (value) {
				_$outputDiv.css("left", 'calc( '
					+ (_$slider.position().left + _$slider.outerWidth()) + 'px + 1em )')
				_$outputDiv.text(d3.format(format)(value));
				$(".input").width(_$outputDiv.position().left + _$outputDiv.outerWidth() - _innerLeft)

			},

			_$slider = $(selector).slider({
				value: _scale(accessor()),
				max: rangeMax,
				slide: function (e, ui) {
					_update(_scale.invert(ui.value));
					accessor(_scale.invert(ui.value));
				}
			}),
			_$wrapper = _$slider.wrap("<div class='input'></div>")
			.before($("<div />").text(title + ":"))
			.after(_$outputDiv).parent(),
			_innerLeft = _$wrapper.children().first().position().left;

	_update(_scale.invert($(selector).slider("value")))

	return d3.select(selector)
};
