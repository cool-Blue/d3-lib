function Output_old(container, on, before) {
	//private instance state
	var _nullText = "waiting...",
			_div = d3.select(container)
				.insert(on, before)
				.text(_nullText),
			_textContent,
			_tagText = "",
			_message = function (v) { return typeof v != "undefined" ? v : _textContent },
			_fmt = " >7,d";

	//immutable, public class interface
	//copied to each instance, this is not shared code!
	//return Object.create((Output.prototype = Object.defineProperties({
	//	update: function (message) {
	//		/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
	//		var args = new Array(arguments.length);
	//		for (var i = 0; i < args.length ; ++i) args[i] = arguments[i];
  //
	//		_div.text(_tagText + (_tagText ? ": " : "")
	//							+ ((message ? (typeof message === "function" ? message : _message) : _message))
	//								.apply(this, args));
	//		return this;
	//	},
	//	tagText: function (text) {
	//		return text ? (_tagText = text, this) : _tagText;
	//	},
	//	text: function (text) {
	//		if (!typeof text === "undefined") _div.text(_textContent = text ? text : _nullText); return this;
	//		return _textContent;
	//	},
	//	message: function (m) {
	//		_message = function () {
	//			/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
	//			var args = new Array(arguments.length);
	//			for (var i = 0; i < args.length ; ++i) args[i] = arguments[i];
  //
	//			return d3.functor(m).apply(this, args)
	//		};
	//		return this;
	//	},
	//	f: function f(x) {
	//		return Array.isArray(x) ? x.map(f) : d3.format(_fmt)(parseInt(x));
	//	},
	//	format: function (f) {
	//		return f ? (_fmt = f, this) : _fmt;
	//	},
	//	base: d3.select(container).node(),
	//}, {//properties with special requirements
	//	tag: {
	//		get: function () {
	//			return tag_getter.call(this, _tagText)
	//		}
	//	},
	//})));
	return Object.create(Output.prototype = Object.defineProperties({
		update: function (message) {
			/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
			var args = new Array(arguments.length);
			for (var i = 0; i < args.length; ++i) args[i] = arguments[i];

			_div.text(_tagText + (_tagText ? ": " : "")
					+ ((message ? (typeof message === "function" ? message : _message) : _message))
							.apply(this, args));
			return this;
		},
		tagText: function (text) {
			return text ? (_tagText = text, this) : _tagText;
		},
		text: function (text) {
			if (!typeof text === "undefined") _div.text(_textContent = text ? text : _nullText);
			return this;
			return _textContent;
		},
		message: function (m) {
			_message = function () {
				/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
				var args = new Array(arguments.length);
				for (var i = 0; i < args.length; ++i) args[i] = arguments[i];

				return d3.functor(m).apply(this, args)
			};
			return this;
		},
		f: function f(x) {
			return Array.isArray(x) ? x.map(f) : d3.format(_fmt)(parseInt(x));
		},
		format: function (f) {
			return f ? (_fmt = f, this) : _fmt;
		},
		base: d3.select(container).node(),
	}, {//properties with special requirements
		tag: {
			get: function () {
				return tag_getter.call(this, _tagText)
			}
		},
	}));
}

function Output(container, on, before) {
	//private instance state
	var _nullText = "waiting...",
			_div = d3.select(container)
					.insert(on, before)
					.text(_nullText),
			_textContent,
			_tagText = "",
			_message = function (v) {
				return typeof v != "undefined" ? this.f(v) : _textContent
			},
			_fmt = " >7,d";
	//public reference
	//produce new instance
	return {
		update: function (message) {
			/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
			var args = new Array(arguments.length);
			for (var i = 0; i < args.length; ++i) args[i] = arguments[i];

			_div.text(_tagText + (_tagText ? ": " : "")
					+ ((message ? (typeof message === "function" ? message : _message) : _message))
							.apply(this, args));
			return this;
		},
		tagText: function (text) {
			return text ? (_tagText = text, this) : _tagText;
		},
		text: function (text) {
			if (!typeof text === "undefined") _div.text(_textContent = text ? text : _nullText);
			return this;
			return _textContent;
		},
		message: function (m) {
			_message = function () {
				/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
				var args = new Array(arguments.length);
				for (var i = 0; i < args.length; ++i) args[i] = arguments[i];
				return d3.functor(m).apply(this, args)
			};
			return this;
		},
		f: function f(x) {
			return Array.isArray(x) ? x.map(f) : d3.format(_fmt)(x);
		},
		format: function (f) {
			return f ? (_fmt = f, this) : _fmt;
		},
		base: d3.select(container).node(),
		get tag() {
			return tag_getter.call(this, _tagText)
		},
	};
}

function Output2(container, on, before) {
	//private instance state
	var _nullText = "waiting...",
			_div = d3.select(container)
				.insert(on, before)
				.text(_nullText),
			_textContent,
			_tagText = "",
			_message = function () { return _textContent },
			_fmt = "5,d",
			_f = function f(x) {
				return d3.format(_fmt)(parseInt(x));
			};
	//private class methods
	//Note
	//  Must be inside the function block otherwise
	//  these functions cannot write private instance state
	//  this is because assigning to the arguments will only
	//  make them reference something else, it doesn't change
	//  the object they were originaly referencing!
	function update(_div, _tagText, _message, message) {
		/*[].slice.call(arguments, 3) is an anti-pattern that kills optimisation*/
		var args = new Array(arguments.length);
		for (var i = 0; i < args.length ; ++i) args[i] = arguments[i];

		_div.text(_tagText + (_tagText ? ": " : "") + ((message ? (_message = d3.functor(message))
				: _message)).apply(this, args.slice(3)));
		return this;
	}
	function message(_message, m) {
		_message = function () {
			/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
			var args = new Array(arguments.length);
			for (var i = 0; i < args.length ; ++i) args[i] = arguments[i];

			return d3.functor(m).apply(this, args)
		};
		return this;
	}
	function tagText(_tagText, text) {
		return text ? (_tagText.value = text, this) : _tagText.value;
	}
	function tag_getter(_tagText) {
		return _tagText
	}
	function format(_fmt, f) {
		return text ? (_fmt = f, this) : _fmt;
	}
	function applyFormat(_fmt, x) {
		return Array.isArray(x) ? x.map(applyFormat) : d3.format(_fmt)(parseInt(x));
	}
	//public instance interface
	return Object.create(Object.defineProperties({
		update: (function (message) {
			return update.call(this, _div, _tagText, _message, message)
		}),
		message: function (m) {
			return message.call(this, _message, m)
		},
		tagText: function (text) {
			return tagText.call(this, { value: _tagText }, text);
		},
		f: function (x) {
			return applyFormat.call(this, _fmt, x)
		},
		format: function (f) {
			return format.call(this, _fmt, f)
		},
	}, {//getters and setters
		tag: {
			get: function () {
				return tag_getter.call(this, _tagText)
			}
		}
	}));

}

outputs = {
	OutputDiv: function OutputDiv(classes) {
		//constructor
		function _OutputDiv(on, style, before) {
			//private instance state
			var _sel = d3.select(on), id = ~~(Math.random() * 1000),
				defStyle = {
					margin            : '10px 10px 10px 0',
					padding           : '3px 3px 3px 3px',
					display           : 'inline-block',
					'background-color': '#ccc',
					'white-space': 'pre'
				};
			if (before) {
				_sel = _sel.insert('div', before)
			} else {
				_sel = _sel.append('div')
			}
			_sel = _sel.style(style ? style : defStyle)
				.attr("id", "ouputDiv_" + id)
				.attr("class", "ouputDiv");

			//public instance state
			this.selection = _sel
		}

		//public class methods
		//this is shared code but can't access instance state
		_OutputDiv.prototype.update = function (value) {
			this.selection.text(this.message(value));
			return this
		};
		_OutputDiv.prototype.message = function (value) {
			return value
		};
		//create and initialise new instance
		classes.classOutputDiv = _OutputDiv;
		return function (on, style, before) {
			return new _OutputDiv(on, style, before)
		};
	},
	//ANTI-PATTERN
	//this pattern fails!
	Output3  : function (classes) {
		//constructor
		function _Output(container, on, before) {
			//private instance state
			var _nullText = "waiting...",
				_div = d3.select(container)
					.insert(on, before)
					.text(_nullText),
				_textContent,
				_tagText = "",
				_message = function (v) {
					return typeof v != "undefined" ? v : _textContent
				},
				_fmt = "5,d";

			//public instance interface
			_Output.prototype.update = update.bind(this, _div, _tagText, _message);
			_Output.prototype.message = message.bind(this, _message);
			_Output.prototype.tagText = tagText.bind(this, _tagText);
			_Output.prototype.f = f.bind(this, _fmt);
			_Output.prototype.format = format.bind(this, _fmt);
			Object.defineProperties(_Output.prototype, {//getters and setters
				tag: {
					get         : tag_getter.bind(this, _tagText),
					configurable: true,
				}
			});
		}

		//private class methods
		//Note
		//  Must be inside the function block otherwise
		//  these functions cannot write private instance state
		//  this is because assigning to the arguments will only
		//  make them reference something else, it doesn't change
		//  the object they were originaly referencing!
		function update(_div, _tagText, _message, message) {
			/*[].slice.call(arguments, 3) is an anti-pattern that kills optimisation*/
			var args = new Array(arguments.length);
			for (var i = 0; i < args.length; ++i) args[i] = arguments[i];

			_div.text(_tagText + (_tagText ? ": " : "") + ((message ? (_message = d3.functor(message))
					: _message)).apply(this, args.slice(3)));
			return this;
		}

		function message(_message, m) {
			_message = function () {
				/*.apply(this, arguments) is an anti-pattern that kills optimisation (leaks argument)*/
				var args = new Array(arguments.length);
				for (var i = 0; i < args.length; ++i) args[i] = arguments[i];

				return d3.functor(m).apply(this, args)
			};
			return this;
		}

		function tagText(_tagText, text) {
			return text ? (_tagText.value = text, this) : _tagText.value;
		}

		function tag_getter(_tagText) {
			return _tagText
		}

		function f(_fmt, x) {
			return Array.isArray(x) ? x.map(f) : d3.format(_fmt)(parseInt(x));
		}

		function format(_fmt, f) {
			return text ? (_fmt = f, this) : _fmt;
		}

		//create and initialise new instance
		classes.classOutput = _Output;
		return function (container, on, before) {
			return new _Output(container, on, before)
		};
	},
};