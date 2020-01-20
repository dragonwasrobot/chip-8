(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ay.N === region.aJ.N)
	{
		return 'on line ' + region.ay.N;
	}
	return 'on lines ' + region.ay.N + ' through ' + region.aJ.N;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bE,
		impl.b2,
		impl.bZ,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		t: func(record.t),
		az: record.az,
		av: record.av
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.t;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.az;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.av) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bE,
		impl.b2,
		impl.bZ,
		function(sendToApp, initialModel) {
			var view = impl.b4;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bE,
		impl.b2,
		impl.bZ,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ax && impl.ax(sendToApp)
			var view = impl.b4;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bp);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.b1) && (_VirtualDom_doc.title = title = doc.b1);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bP;
	var onUrlRequest = impl.bQ;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ax: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.a1 === next.a1
							&& curr.aP === next.aP
							&& curr.a_.a === next.a_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bE: function(flags)
		{
			return A3(impl.bE, flags, _Browser_getUrl(), key);
		},
		b4: impl.b4,
		b2: impl.b2,
		bZ: impl.bZ
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bC: 'hidden', br: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bC: 'mozHidden', br: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bC: 'msHidden', br: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bC: 'webkitHidden', br: 'webkitvisibilitychange' }
		: { bC: 'hidden', br: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ba: _Browser_getScene(),
		bj: {
			an: _Browser_window.pageXOffset,
			ao: _Browser_window.pageYOffset,
			I: _Browser_doc.documentElement.clientWidth,
			B: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		I: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		B: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ba: {
				I: node.scrollWidth,
				B: node.scrollHeight
			},
			bj: {
				an: node.scrollLeft,
				ao: node.scrollTop,
				I: node.clientWidth,
				B: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ba: _Browser_getScene(),
			bj: {
				an: x,
				ao: y,
				I: _Browser_doc.documentElement.clientWidth,
				B: _Browser_doc.documentElement.clientHeight
			},
			bv: {
				an: x + rect.left,
				ao: y + rect.top,
				I: rect.width,
				B: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.bx.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.bx.b, xhr)); });
		$elm$core$Maybe$isJust(request.bi) && _Http_track(router, xhr, request.bi.a);

		try {
			xhr.open(request.bF, request.b3, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.b3));
		}

		_Http_configureRequest(xhr, request);

		request.bp.a && xhr.setRequestHeader('Content-Type', request.bp.a);
		xhr.send(request.bp.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.aO; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.b0.a || 0;
	xhr.responseType = request.bx.d;
	xhr.withCredentials = request.bm;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		b3: xhr.responseURL,
		bX: xhr.status,
		bY: xhr.statusText,
		aO: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			bW: event.loaded,
			bb: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			bT: event.loaded,
			bb: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.c) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.e);
		} else {
			var treeLen = builder.c * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.f) : builder.f;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.c);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.e);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{f: nodeList, c: (len / $elm$core$Array$branchFactor) | 0, e: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aL: fragment, aP: host, aY: path, a_: port_, a1: protocol, a2: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$KeyCode$KeyCode = $elm$core$Basics$identity;
var $author$project$Games$blinky = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('ArrowLeft', 7),
			_Utils_Tuple2('ArrowRight', 8),
			_Utils_Tuple2('ArrowUp', 3),
			_Utils_Tuple2('ArrowDown', 6)
		]);
	return {p: controls, r: 'BLINKY'};
}();
var $author$project$Games$brix = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('ArrowLeft', 4),
			_Utils_Tuple2('ArrowRight', 6)
		]);
	return {p: controls, r: 'BRIX'};
}();
var $author$project$Games$connect4 = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('ArrowLeft', 4),
			_Utils_Tuple2('ArrowRight', 6),
			_Utils_Tuple2(' ', 5)
		]);
	return {p: controls, r: 'CONNECT4'};
}();
var $author$project$Games$hidden = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('ArrowLeft', 4),
			_Utils_Tuple2('ArrowRight', 6),
			_Utils_Tuple2(' ', 5),
			_Utils_Tuple2('ArrowUp', 2),
			_Utils_Tuple2('ArrowDown', 8)
		]);
	return {p: controls, r: 'HIDDEN'};
}();
var $author$project$Games$invaders = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('ArrowLeft', 4),
			_Utils_Tuple2(' ', 5),
			_Utils_Tuple2('ArrowRight', 6)
		]);
	return {p: controls, r: 'INVADERS'};
}();
var $author$project$Games$pong = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('w', 1),
			_Utils_Tuple2('s', 4),
			_Utils_Tuple2('i', 12),
			_Utils_Tuple2('k', 13)
		]);
	return {p: controls, r: 'PONG'};
}();
var $author$project$Games$tetris = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('ArrowLeft', 5),
			_Utils_Tuple2('ArrowRight', 6),
			_Utils_Tuple2(' ', 4),
			_Utils_Tuple2('ArrowDown', 7)
		]);
	return {p: controls, r: 'TETRIS'};
}();
var $author$project$Games$tictac = function () {
	var controls = _List_fromArray(
		[
			_Utils_Tuple2('5', 1),
			_Utils_Tuple2('6', 2),
			_Utils_Tuple2('7', 3),
			_Utils_Tuple2('r', 4),
			_Utils_Tuple2('t', 5),
			_Utils_Tuple2('y', 6),
			_Utils_Tuple2('f', 7),
			_Utils_Tuple2('g', 8),
			_Utils_Tuple2('h', 9)
		]);
	return {p: controls, r: 'TICTAC'};
}();
var $author$project$Games$init = _List_fromArray(
	[$author$project$Games$blinky, $author$project$Games$brix, $author$project$Games$connect4, $author$project$Games$hidden, $author$project$Games$invaders, $author$project$Games$pong, $author$project$Games$tetris, $author$project$Games$tictac]);
var $author$project$Display$init = function () {
	var _v0 = _Utils_Tuple2(64, 32);
	var width = _v0.a;
	var height = _v0.b;
	return A2(
		$elm$core$Array$initialize,
		width,
		function (_v1) {
			return A2(
				$elm$core$Array$initialize,
				height,
				function (_v2) {
					return false;
				});
		});
}();
var $author$project$Flags$init = {ai: false, W: $elm$core$Maybe$Nothing};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $author$project$Keypad$init = A3(
	$elm$core$List$foldl,
	function (idx) {
		return A2($elm$core$Dict$insert, idx, false);
	},
	$elm$core$Dict$empty,
	A2($elm$core$List$range, 0, 16));
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$Memory$memorySize = 4096;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Memory$setCell = F3(
	function (index, value, memory) {
		return (_Utils_cmp(index, $author$project$Memory$memorySize) > -1) ? $elm$core$Result$Err('Memory index out of bounds') : $elm$core$Result$Ok(
			A3($elm$core$Array$set, index, value, memory));
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Memory$copySpriteCell = F3(
	function (sprites, idx, memory) {
		return A2(
			$elm$core$Maybe$withDefault,
			memory,
			A2(
				$elm$core$Maybe$andThen,
				function (spriteValue) {
					return $elm$core$Result$toMaybe(
						A3($author$project$Memory$setCell, idx, spriteValue, memory));
				},
				A2($elm$core$Array$get, idx, sprites)));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{f: nodeList, c: nodeListSize, e: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Memory$hardcodedSprites = function () {
	var spriteF = _List_fromArray(
		[240, 128, 240, 128, 128]);
	var spriteE = _List_fromArray(
		[240, 128, 240, 128, 240]);
	var spriteD = _List_fromArray(
		[224, 144, 144, 144, 224]);
	var spriteC = _List_fromArray(
		[240, 128, 128, 128, 240]);
	var spriteB = _List_fromArray(
		[224, 144, 224, 144, 224]);
	var spriteA = _List_fromArray(
		[240, 144, 240, 144, 144]);
	var sprite9 = _List_fromArray(
		[240, 144, 240, 16, 240]);
	var sprite8 = _List_fromArray(
		[240, 144, 240, 144, 240]);
	var sprite7 = _List_fromArray(
		[240, 16, 32, 64, 64]);
	var sprite6 = _List_fromArray(
		[240, 128, 240, 144, 240]);
	var sprite5 = _List_fromArray(
		[240, 128, 240, 16, 240]);
	var sprite4 = _List_fromArray(
		[144, 144, 240, 16, 16]);
	var sprite3 = _List_fromArray(
		[240, 16, 240, 16, 240]);
	var sprite2 = _List_fromArray(
		[240, 16, 240, 128, 240]);
	var sprite1 = _List_fromArray(
		[32, 96, 32, 32, 112]);
	var sprite0 = _List_fromArray(
		[240, 144, 144, 144, 240]);
	return _Utils_ap(
		sprite0,
		_Utils_ap(
			sprite1,
			_Utils_ap(
				sprite2,
				_Utils_ap(
					sprite3,
					_Utils_ap(
						sprite4,
						_Utils_ap(
							sprite5,
							_Utils_ap(
								sprite6,
								_Utils_ap(
									sprite7,
									_Utils_ap(
										sprite8,
										_Utils_ap(
											sprite9,
											_Utils_ap(
												spriteA,
												_Utils_ap(
													spriteB,
													_Utils_ap(
														spriteC,
														_Utils_ap(
															spriteD,
															_Utils_ap(spriteE, spriteF)))))))))))))));
}();
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$Memory$addSpritesToMemory = function (memory) {
	var sprites = $elm$core$Array$fromList($author$project$Memory$hardcodedSprites);
	var rangeToUpdate = A2(
		$elm$core$List$range,
		0,
		$elm$core$Array$length(sprites));
	return A3(
		$elm$core$List$foldl,
		$author$project$Memory$copySpriteCell(sprites),
		memory,
		rangeToUpdate);
};
var $author$project$Memory$init = function () {
	var emptyMemory = A2(
		$elm$core$Array$initialize,
		$author$project$Memory$memorySize,
		function (_v0) {
			return 0;
		});
	return $author$project$Memory$addSpritesToMemory(emptyMemory);
}();
var $author$project$Registers$dataRegisterCount = 16;
var $author$project$Registers$initDataRegisters = A2(
	$elm$core$Array$initialize,
	$author$project$Registers$dataRegisterCount,
	function (_v0) {
		return 0;
	});
var $author$project$Registers$init = {X: 0, L: $author$project$Registers$initDataRegisters, Z: 0, D: 0, ak: 0, R: 0};
var $author$project$Stack$stackSize = 16;
var $author$project$Stack$init = A2(
	$elm$core$Array$initialize,
	$author$project$Stack$stackSize,
	function (_v0) {
		return 0;
	});
var $author$project$Timers$Timers = $elm$core$Basics$identity;
var $author$project$Timers$Delay = $elm$core$Basics$identity;
var $author$project$Timers$initDelay = {ai: false, bh: (1 / 60) * 1000};
var $author$project$Timers$init = $author$project$Timers$initDelay;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $author$project$VirtualMachine$init = {
	bu: $author$project$Display$init,
	aa: $author$project$Flags$init,
	ac: $author$project$Keypad$init,
	ae: $author$project$Memory$init,
	ag: $elm$random$Random$initialSeed(49317),
	ah: $author$project$Registers$init,
	al: $author$project$Stack$init,
	am: $author$project$Timers$init
};
var $author$project$Main$initModel = {aq: $elm$core$Maybe$Nothing, ab: $author$project$Games$init, F: $elm$core$Maybe$Nothing, b: $author$project$VirtualMachine$init};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Main$initModel, $elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Msg$ClockTick = function (a) {
	return {$: 4, a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {a0: processes, bg: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.a0;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.bg);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Flags$isRunning = function (flags) {
	return flags.ai;
};
var $author$project$Flags$isWaitingForInput = function (flags) {
	var _v0 = flags.W;
	if (!_v0.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$clockSubscriptions = function (flags) {
	return ($author$project$Flags$isWaitingForInput(flags) || (!$author$project$Flags$isRunning(flags))) ? _List_Nil : _List_fromArray(
		[
			A2($elm$time$Time$every, 1000 / 600, $author$project$Msg$ClockTick)
		]);
};
var $author$project$VirtualMachine$getFlags = function (virtualMachine) {
	return virtualMachine.aa;
};
var $author$project$Msg$KeyDown = function (a) {
	return {$: 1, a: a};
};
var $author$project$Msg$KeyPress = function (a) {
	return {$: 2, a: a};
};
var $author$project$Msg$KeyUp = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$KeyCode$toKeyCode = F2(
	function (controls, candidate) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm_community$list_extra$List$Extra$find,
				function (_v0) {
					var str = _v0.a;
					return _Utils_eq(str, candidate);
				},
				controls));
	});
var $author$project$KeyCode$decoder = function (keyMapping) {
	return A2(
		$elm$json$Json$Decode$map,
		$author$project$KeyCode$toKeyCode(keyMapping),
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {aZ: pids, bf: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aK: event, aR: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.aZ,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.aR;
		var event = _v0.aK;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.bf);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $elm$browser$Browser$Events$onKeyPress = A2($elm$browser$Browser$Events$on, 0, 'keypress');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, 0, 'keyup');
var $author$project$Main$keyboardSubscriptions = F2(
	function (flags, maybeGame) {
		var _v0 = _Utils_Tuple2(
			$author$project$Flags$isRunning(flags),
			maybeGame);
		if (_v0.a && (!_v0.b.$)) {
			var game = _v0.b.a;
			var keyDecoder = function (toMsg) {
				return A2(
					$elm$json$Json$Decode$map,
					toMsg,
					$author$project$KeyCode$decoder(game.p));
			};
			return _List_fromArray(
				[
					$elm$browser$Browser$Events$onKeyUp(
					keyDecoder($author$project$Msg$KeyUp)),
					$elm$browser$Browser$Events$onKeyDown(
					keyDecoder($author$project$Msg$KeyDown)),
					$elm$browser$Browser$Events$onKeyPress(
					keyDecoder($author$project$Msg$KeyPress))
				]);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Main$subscriptions = function (model) {
	var maybeGame = model.F;
	var flags = $author$project$VirtualMachine$getFlags(model.b);
	var subscriptionList = _Utils_ap(
		A2($author$project$Main$keyboardSubscriptions, flags, maybeGame),
		$author$project$Main$clockSubscriptions(flags));
	return $elm$core$Platform$Sub$batch(subscriptionList);
};
var $author$project$KeyCode$nibbleValue = function (_v0) {
	var keyCode = _v0;
	return keyCode;
};
var $author$project$Keypad$addKeyPress = F2(
	function (keyCode, keysPressed) {
		return A3(
			$elm$core$Dict$insert,
			$author$project$KeyCode$nibbleValue(keyCode),
			true,
			keysPressed);
	});
var $author$project$VirtualMachine$getRegisters = function (virtualMachine) {
	return virtualMachine.ah;
};
var $author$project$Flags$getWaitingForInputRegister = function (flags) {
	return flags.W;
};
var $author$project$Registers$setDataRegister = F3(
	function (index, value, registers) {
		var updatedDataRegisters = A3($elm$core$Array$set, index, value, registers.L);
		return (_Utils_cmp(index, $author$project$Registers$dataRegisterCount) > 0) ? $elm$core$Result$Err('Register index out of bounds') : $elm$core$Result$Ok(
			_Utils_update(
				registers,
				{L: updatedDataRegisters}));
	});
var $author$project$VirtualMachine$setFlags = F2(
	function (flags, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{aa: flags});
	});
var $author$project$VirtualMachine$setRegisters = F2(
	function (registers, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{ah: registers});
	});
var $author$project$Flags$setWaitingForInputRegister = F2(
	function (waitingForInputRegister, flags) {
		return _Utils_update(
			flags,
			{W: waitingForInputRegister});
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$checkIfWaitingForKeyPress = F2(
	function (keyCode, virtualMachine) {
		var _v0 = $author$project$Flags$getWaitingForInputRegister(
			$author$project$VirtualMachine$getFlags(virtualMachine));
		if (!_v0.$) {
			var registerX = _v0.a;
			var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
			var newRegisters = A2(
				$elm$core$Result$withDefault,
				registers,
				A3(
					$author$project$Registers$setDataRegister,
					registerX,
					$author$project$KeyCode$nibbleValue(keyCode),
					registers));
			var newFlags = A2(
				$author$project$Flags$setWaitingForInputRegister,
				$elm$core$Maybe$Nothing,
				$author$project$VirtualMachine$getFlags(virtualMachine));
			return _Utils_Tuple2(
				A2(
					$author$project$VirtualMachine$setRegisters,
					newRegisters,
					A2($author$project$VirtualMachine$setFlags, newFlags, virtualMachine)),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(virtualMachine, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$VirtualMachine$getKeypad = function (virtualMachine) {
	return virtualMachine.ac;
};
var $author$project$VirtualMachine$setKeypad = F2(
	function (keypad, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{ac: keypad});
	});
var $author$project$Main$addKeyCode = F2(
	function (maybeKeyCode, model) {
		if (!maybeKeyCode.$) {
			var keyCode = maybeKeyCode.a;
			var newKeypad = A2(
				$author$project$Keypad$addKeyPress,
				keyCode,
				$author$project$VirtualMachine$getKeypad(model.b));
			var _v1 = A2(
				$author$project$Main$checkIfWaitingForKeyPress,
				keyCode,
				A2($author$project$VirtualMachine$setKeypad, newKeypad, model.b));
			var newVirtualMachine = _v1.a;
			var cmd = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{b: newVirtualMachine}),
				cmd);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $author$project$FetchDecodeExecuteLoop$getNibble = F2(
	function (n, opcode) {
		return A2(
			$elm$core$List$member,
			n,
			_List_fromArray(
				[0, 1, 2, 3])) ? $elm$core$Result$Ok(
			A2($elm$core$Basics$modBy, 65535, opcode << (4 * n)) >> 12) : $elm$core$Result$Err(
			'expected \'n\' to be in [0,1,2,3] was \'' + ($elm$core$String$fromInt(n) + '\''));
	});
var $author$project$VirtualMachine$setDisplay = F2(
	function (display, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{bu: display});
	});
var $author$project$Instructions$clearDisplay = function (virtualMachine) {
	return _Utils_Tuple2(
		A2($author$project$VirtualMachine$setDisplay, $author$project$Display$init, virtualMachine),
		$elm$core$Platform$Cmd$none);
};
var $author$project$FetchDecodeExecuteLoop$getByte = function (opcode) {
	return A2($elm$core$Basics$modBy, 65535, opcode << 8) >> 8;
};
var $author$project$Registers$getStackPointer = function (registers) {
	return registers.R;
};
var $author$project$Registers$decrementStackPointer = function (registers) {
	return _Utils_update(
		registers,
		{
			R: $author$project$Registers$getStackPointer(registers) - 1
		});
};
var $author$project$VirtualMachine$getStack = function (virtualMachine) {
	return virtualMachine.al;
};
var $author$project$Stack$pop = F2(
	function (stackPointer, stack) {
		return (_Utils_cmp(stackPointer, $author$project$Stack$stackSize) > -1) ? $elm$core$Result$Err('Stack pointer out of bounds') : $elm$core$Result$Ok(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Array$get, stackPointer, stack)));
	});
var $author$project$Registers$setProgramCounter = F2(
	function (programCounter, registers) {
		return _Utils_update(
			registers,
			{D: programCounter});
	});
var $author$project$Instructions$returnFromSubroutine = function (virtualMachine) {
	var addressAtTopOfStack = A2(
		$elm$core$Result$withDefault,
		0,
		A2(
			$author$project$Stack$pop,
			$author$project$Registers$getStackPointer(
				$author$project$VirtualMachine$getRegisters(virtualMachine)),
			$author$project$VirtualMachine$getStack(virtualMachine)));
	var newRegisters = $author$project$Registers$decrementStackPointer(
		A2(
			$author$project$Registers$setProgramCounter,
			addressAtTopOfStack,
			$author$project$VirtualMachine$getRegisters(virtualMachine)));
	return _Utils_Tuple2(
		A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
		$elm$core$Platform$Cmd$none);
};
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$FetchDecodeExecuteLoop$toHex = function (_int) {
	return $elm$core$String$toUpper(
		$rtfeldman$elm_hex$Hex$toString(_int));
};
var $author$project$FetchDecodeExecuteLoop$handle0 = F2(
	function (virtualMachine, opcode) {
		var _v0 = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		switch (_v0) {
			case 224:
				return $elm$core$Result$Ok(
					$author$project$Instructions$clearDisplay(virtualMachine));
			case 238:
				return $elm$core$Result$Ok(
					$author$project$Instructions$returnFromSubroutine(virtualMachine));
			default:
				return $elm$core$Result$Err(
					'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode));
		}
	});
var $author$project$FetchDecodeExecuteLoop$dropFirstNibble = function (opcode) {
	return A2($elm$core$Basics$modBy, 65535, opcode << 4) >> 4;
};
var $author$project$Registers$getProgramCounter = function (registers) {
	return registers.D;
};
var $author$project$Registers$decrementProgramCounter = function (registers) {
	return _Utils_update(
		registers,
		{
			D: $author$project$Registers$getProgramCounter(registers) - 2
		});
};
var $author$project$Instructions$jumpAbsolute = F2(
	function (virtualMachine, location) {
		var newRegisters = $author$project$Registers$decrementProgramCounter(
			A2(
				$author$project$Registers$setProgramCounter,
				location,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle1 = F2(
	function (virtualMachine, opcode) {
		return $elm$core$Result$Ok(
			A2(
				$author$project$Instructions$jumpAbsolute,
				virtualMachine,
				$author$project$FetchDecodeExecuteLoop$dropFirstNibble(opcode)));
	});
var $author$project$Registers$incrementStackPointer = function (registers) {
	return _Utils_update(
		registers,
		{
			R: $author$project$Registers$getStackPointer(registers) + 1
		});
};
var $author$project$Stack$put = F3(
	function (stackPointer, value, stack) {
		return (_Utils_cmp(stackPointer, $author$project$Stack$stackSize) > -1) ? $elm$core$Result$Err('Stack pointer out of bounds') : $elm$core$Result$Ok(
			A3($elm$core$Array$set, stackPointer, value, stack));
	});
var $author$project$VirtualMachine$setStack = F2(
	function (stack, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{al: stack});
	});
var $author$project$Instructions$callSubroutine = F2(
	function (virtualMachine, location) {
		var stack = $author$project$VirtualMachine$getStack(virtualMachine);
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var oldProgramCounter = $author$project$Registers$getProgramCounter(registers);
		var newRegisters = $author$project$Registers$decrementProgramCounter(
			A2(
				$author$project$Registers$setProgramCounter,
				location,
				$author$project$Registers$incrementStackPointer(registers)));
		var newStack = A2(
			$elm$core$Result$withDefault,
			stack,
			A3(
				$author$project$Stack$put,
				$author$project$Registers$getStackPointer(newRegisters),
				oldProgramCounter,
				stack));
		var newVirtualMachine = A2(
			$author$project$VirtualMachine$setStack,
			newStack,
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine));
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle2 = F2(
	function (virtualMachine, opcode) {
		return $elm$core$Result$Ok(
			A2(
				$author$project$Instructions$callSubroutine,
				virtualMachine,
				$author$project$FetchDecodeExecuteLoop$dropFirstNibble(opcode)));
	});
var $author$project$Registers$getDataRegister = F2(
	function (index, registers) {
		return (_Utils_cmp(index, $author$project$Registers$dataRegisterCount) > -1) ? $elm$core$Result$Err(
			'Data register index out of bounds: ' + $elm$core$String$fromInt(index)) : $elm$core$Result$Ok(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Array$get, index, registers.L)));
	});
var $author$project$Registers$incrementProgramCounter = function (registers) {
	return _Utils_update(
		registers,
		{
			D: $author$project$Registers$getProgramCounter(registers) + 2
		});
};
var $author$project$Instructions$skipNextIfEqualConstant = F3(
	function (virtualMachine, register, _byte) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, register, registers));
		var newRegisters = _Utils_eq(registerValue, _byte) ? $author$project$Registers$incrementProgramCounter(registers) : registers;
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle3 = F2(
	function (virtualMachine, opcode) {
		var value = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		var register = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		return $elm$core$Result$Ok(
			A3($author$project$Instructions$skipNextIfEqualConstant, virtualMachine, register, value));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Instructions$skipNextIfNotEqualConstant = F3(
	function (virtualMachine, register, value) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, register, registers));
		var newRegisters = (!_Utils_eq(registerValue, value)) ? $author$project$Registers$incrementProgramCounter(registers) : registers;
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle4 = F2(
	function (virtualMachine, opcode) {
		var value = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		var register = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		return $elm$core$Result$Ok(
			A3($author$project$Instructions$skipNextIfNotEqualConstant, virtualMachine, register, value));
	});
var $author$project$Instructions$skipNextIfRegistersEqual = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerValueY = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerValueX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisters = _Utils_eq(registerValueX, registerValueY) ? $author$project$Registers$incrementProgramCounter(
			$author$project$VirtualMachine$getRegisters(virtualMachine)) : $author$project$VirtualMachine$getRegisters(virtualMachine);
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle5 = F2(
	function (virtualMachine, opcode) {
		var registerY = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 2, opcode));
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		return (!(!A2(
			$elm$core$Result$withDefault,
			-1,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 3, opcode)))) ? $elm$core$Result$Err(
			'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode)) : $elm$core$Result$Ok(
			A3($author$project$Instructions$skipNextIfRegistersEqual, virtualMachine, registerX, registerY));
	});
var $author$project$Instructions$setRegisterToConstant = F3(
	function (virtualMachine, register, value) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, register, value, registers));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle6 = F2(
	function (virtualMachine, opcode) {
		var value = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		return $elm$core$Result$Ok(
			A3($author$project$Instructions$setRegisterToConstant, virtualMachine, registerX, value));
	});
var $author$project$Instructions$addToRegister = F3(
	function (virtualMachine, register, value) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var currentRegisterValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, register, registers));
		var newRegisterValue = A2($elm$core$Basics$modBy, 256, currentRegisterValue + value);
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, register, newRegisterValue, registers));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle7 = F2(
	function (virtualMachine, opcode) {
		var value = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		return $elm$core$Result$Ok(
			A3($author$project$Instructions$addToRegister, virtualMachine, registerX, value));
	});
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Instructions$setRegisterAdd = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var registerSum = registerXValue + registerYValue;
		var carryValue = (registerSum > 255) ? 1 : 0;
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A2(
				$elm$core$Result$andThen,
				A2($author$project$Registers$setDataRegister, 15, carryValue),
				A3(
					$author$project$Registers$setDataRegister,
					registerX,
					A2($elm$core$Basics$modBy, 256, registerSum),
					registers)));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setRegisterAnd = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, registerX, registerXValue & registerYValue, registers));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $author$project$Instructions$setRegisterOr = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, registerX, registerXValue | registerYValue, registers));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setRegisterShiftLeft = F2(
	function (virtualMachine, registerX) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisterValue = A2($elm$core$Basics$modBy, 256, registerXValue * 2);
		var carryValue = registerXValue >> 7;
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A2(
				$elm$core$Result$andThen,
				A2($author$project$Registers$setDataRegister, registerX, newRegisterValue),
				A3($author$project$Registers$setDataRegister, 15, carryValue, registers)));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setRegisterShiftRight = F2(
	function (virtualMachine, registerX) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A2(
				$elm$core$Result$andThen,
				A2($author$project$Registers$setDataRegister, registerX, (registerXValue / 2) | 0),
				A3(
					$author$project$Registers$setDataRegister,
					15,
					A2($elm$core$Basics$modBy, 2, registerXValue),
					registers)));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setRegisterSub = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisterValue = ((registerXValue - registerYValue) < 0) ? ((registerXValue - registerYValue) + 256) : (registerXValue - registerYValue);
		var carryValue = (_Utils_cmp(registerXValue, registerYValue) > 0) ? 1 : 0;
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A2(
				$elm$core$Result$andThen,
				A2($author$project$Registers$setDataRegister, 15, carryValue),
				A3($author$project$Registers$setDataRegister, registerX, newRegisterValue, registers)));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setRegisterSubFlipped = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisterValue = ((registerYValue - registerXValue) < 0) ? ((registerYValue - registerXValue) + 256) : (registerYValue - registerXValue);
		var carryValue = (_Utils_cmp(registerYValue, registerXValue) > 0) ? 1 : 0;
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A2(
				$elm$core$Result$andThen,
				A2($author$project$Registers$setDataRegister, 15, carryValue),
				A3($author$project$Registers$setDataRegister, registerX, newRegisterValue, registers)));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setRegisterToRegister = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var newRegisterXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, registerX, newRegisterXValue, registers));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $author$project$Instructions$setRegisterXor = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, registerX, registerXValue ^ registerYValue, registers));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle8 = F2(
	function (virtualMachine, opcode) {
		var registerY = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 2, opcode));
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		var nibble = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 3, opcode));
		switch (nibble) {
			case 0:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterToRegister, virtualMachine, registerX, registerY));
			case 1:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterOr, virtualMachine, registerX, registerY));
			case 2:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterAnd, virtualMachine, registerX, registerY));
			case 3:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterXor, virtualMachine, registerX, registerY));
			case 4:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterAdd, virtualMachine, registerX, registerY));
			case 5:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterSub, virtualMachine, registerX, registerY));
			case 6:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$setRegisterShiftRight, virtualMachine, registerX));
			case 7:
				return $elm$core$Result$Ok(
					A3($author$project$Instructions$setRegisterSubFlipped, virtualMachine, registerX, registerY));
			case 14:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$setRegisterShiftLeft, virtualMachine, registerX));
			default:
				return $elm$core$Result$Err(
					'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode));
		}
	});
var $author$project$Instructions$skipNextIfRegistersNotEqual = F3(
	function (virtualMachine, registerX, registerY) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerYValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerY, registers));
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var newRegisters = (!_Utils_eq(registerXValue, registerYValue)) ? $author$project$Registers$incrementProgramCounter(registers) : registers;
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handle9 = F2(
	function (virtualMachine, opcode) {
		var registerY = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 2, opcode));
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		var nibble = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 3, opcode));
		return (!(!nibble)) ? $elm$core$Result$Err(
			'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode)) : $elm$core$Result$Ok(
			A3($author$project$Instructions$skipNextIfRegistersNotEqual, virtualMachine, registerX, registerY));
	});
var $author$project$Registers$setAddressRegister = F2(
	function (address, registers) {
		return _Utils_update(
			registers,
			{X: address});
	});
var $author$project$Instructions$setAddressRegisterToConstant = F2(
	function (virtualMachine, location) {
		var newRegisters = A2(
			$author$project$Registers$setAddressRegister,
			location,
			$author$project$VirtualMachine$getRegisters(virtualMachine));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handleA = F2(
	function (virtualMachine, opcode) {
		return $elm$core$Result$Ok(
			A2(
				$author$project$Instructions$setAddressRegisterToConstant,
				virtualMachine,
				$author$project$FetchDecodeExecuteLoop$dropFirstNibble(opcode)));
	});
var $author$project$Instructions$jumpRelative = F2(
	function (virtualMachine, location) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var newProgramCounter = location + A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, 0, registers));
		var newRegisters = A2(
			$author$project$Registers$setProgramCounter,
			newProgramCounter,
			$author$project$VirtualMachine$getRegisters(virtualMachine));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handleB = F2(
	function (virtualMachine, opcode) {
		return $elm$core$Result$Ok(
			A2(
				$author$project$Instructions$jumpRelative,
				virtualMachine,
				$author$project$FetchDecodeExecuteLoop$dropFirstNibble(opcode)));
	});
var $author$project$VirtualMachine$getRandomSeed = function (virtualMachine) {
	return virtualMachine.ag;
};
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $author$project$VirtualMachine$setRandomSeed = F2(
	function (seed, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{ag: seed});
	});
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $author$project$Instructions$setRegisterRandom = F3(
	function (virtualMachine, registerX, value) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var _v0 = A2(
			$elm$random$Random$step,
			A2($elm$random$Random$int, 0, 255),
			$author$project$VirtualMachine$getRandomSeed(virtualMachine));
		var random = _v0.a;
		var newSeed = _v0.b;
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, registerX, random & value, registers));
		return _Utils_Tuple2(
			A2(
				$author$project$VirtualMachine$setRandomSeed,
				newSeed,
				A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine)),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handleC = F2(
	function (virtualMachine, opcode) {
		var value = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		return $elm$core$Result$Ok(
			A3($author$project$Instructions$setRegisterRandom, virtualMachine, registerX, value));
	});
var $author$project$Registers$getAddressRegister = function (registers) {
	return registers.X;
};
var $author$project$Memory$getCell = F2(
	function (index, memory) {
		return (_Utils_cmp(index, $author$project$Memory$memorySize) > -1) ? $elm$core$Result$Err('Memory index out of bounds') : $elm$core$Result$Ok(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Array$get, index, memory)));
	});
var $author$project$VirtualMachine$getMemory = function (virtualMachine) {
	return virtualMachine.ae;
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $fredcy$elm_parseint$ParseInt$InvalidChar = function (a) {
	return {$: 0, a: a};
};
var $fredcy$elm_parseint$ParseInt$OutOfRange = function (a) {
	return {$: 1, a: a};
};
var $fredcy$elm_parseint$ParseInt$charOffset = F2(
	function (basis, c) {
		return $elm$core$Char$toCode(c) - $elm$core$Char$toCode(basis);
	});
var $fredcy$elm_parseint$ParseInt$isBetween = F3(
	function (lower, upper, c) {
		var ci = $elm$core$Char$toCode(c);
		return (_Utils_cmp(
			$elm$core$Char$toCode(lower),
			ci) < 1) && (_Utils_cmp(
			ci,
			$elm$core$Char$toCode(upper)) < 1);
	});
var $fredcy$elm_parseint$ParseInt$intFromChar = F2(
	function (radix, c) {
		var validInt = function (i) {
			return (_Utils_cmp(i, radix) < 0) ? $elm$core$Result$Ok(i) : $elm$core$Result$Err(
				$fredcy$elm_parseint$ParseInt$OutOfRange(c));
		};
		var toInt = A3($fredcy$elm_parseint$ParseInt$isBetween, '0', '9', c) ? $elm$core$Result$Ok(
			A2($fredcy$elm_parseint$ParseInt$charOffset, '0', c)) : (A3($fredcy$elm_parseint$ParseInt$isBetween, 'a', 'z', c) ? $elm$core$Result$Ok(
			10 + A2($fredcy$elm_parseint$ParseInt$charOffset, 'a', c)) : (A3($fredcy$elm_parseint$ParseInt$isBetween, 'A', 'Z', c) ? $elm$core$Result$Ok(
			10 + A2($fredcy$elm_parseint$ParseInt$charOffset, 'A', c)) : $elm$core$Result$Err(
			$fredcy$elm_parseint$ParseInt$InvalidChar(c))));
		return A2($elm$core$Result$andThen, validInt, toInt);
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $fredcy$elm_parseint$ParseInt$charFromInt = function (i) {
	return (i < 10) ? $elm$core$Char$fromCode(
		i + $elm$core$Char$toCode('0')) : ((i < 36) ? $elm$core$Char$fromCode(
		(i - 10) + $elm$core$Char$toCode('A')) : '?');
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $fredcy$elm_parseint$ParseInt$toRadixUnsafe = F2(
	function (radix, i) {
		return (_Utils_cmp(i, radix) < 0) ? $elm$core$String$fromChar(
			$fredcy$elm_parseint$ParseInt$charFromInt(i)) : _Utils_ap(
			A2($fredcy$elm_parseint$ParseInt$toRadixUnsafe, radix, (i / radix) | 0),
			$elm$core$String$fromChar(
				$fredcy$elm_parseint$ParseInt$charFromInt(
					A2($elm$core$Basics$modBy, radix, i))));
	});
var $author$project$Instructions$hexToBitPattern = function (number) {
	var radix = 2;
	var paddingByte = '00000000';
	var binaryString = _Utils_ap(
		paddingByte,
		A2($fredcy$elm_parseint$ParseInt$toRadixUnsafe, radix, number));
	var trimmedString = A2(
		$elm$core$String$dropLeft,
		$elm$core$String$length(binaryString) - 8,
		binaryString);
	return A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$toMaybe,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$withDefault(0),
				function (x) {
					return x > 0;
				})),
		A2(
			$elm$core$List$map,
			$fredcy$elm_parseint$ParseInt$intFromChar(radix),
			$elm$core$String$toList(trimmedString)));
};
var $elm_community$list_extra$List$Extra$indexedFoldl = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _v0) {
				var i = _v0.a;
				var thisAcc = _v0.b;
				return _Utils_Tuple2(
					i + 1,
					A3(func, i, x, thisAcc));
			});
		return A3(
			$elm$core$List$foldl,
			step,
			_Utils_Tuple2(0, acc),
			list).b;
	});
var $author$project$Instructions$calculatePosition = F4(
	function (registers, register, idx, max) {
		var registerValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, register, registers));
		return A2($elm$core$Basics$modBy, max, registerValue + idx);
	});
var $author$project$Display$getCell = F3(
	function (display, column, row) {
		var value = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$andThen,
				$elm$core$Array$get(row),
				A2($elm$core$Array$get, column, display)));
		return {Y: column, aw: row, aC: value};
	});
var $author$project$VirtualMachine$getDisplay = function (virtualMachine) {
	return virtualMachine.bu;
};
var $author$project$Display$setCell = F2(
	function (cell, display) {
		var updatedColumn = A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Array$empty,
			A2(
				$elm$core$Maybe$map,
				A2($elm$core$Array$set, cell.aw, cell.aC),
				A2($elm$core$Array$get, cell.Y, display)));
		return A3($elm$core$Array$set, cell.Y, updatedColumn, display);
	});
var $elm$core$Basics$xor = _Basics_xor;
var $author$project$Instructions$setBit = F4(
	function (x, y, newBitValue, virtualMachine) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var display = $author$project$VirtualMachine$getDisplay(virtualMachine);
		var oldBitValue = A3($author$project$Display$getCell, display, x, y).aC;
		var carry = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, 15, registers));
		var newCarry = ((!carry) && (oldBitValue && newBitValue)) ? 1 : carry;
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, 15, newCarry, registers));
		var _v0 = _Utils_Tuple2(64, 32);
		var displayWidth = _v0.a;
		var displayHeight = _v0.b;
		var newY = (_Utils_cmp(y, displayHeight - 1) > 0) ? (y - displayHeight) : y;
		var newX = (_Utils_cmp(x, displayWidth - 1) > 0) ? (x - displayWidth) : x;
		var newDisplay = A2(
			$author$project$Display$setCell,
			{Y: newX, aw: newY, aC: oldBitValue !== newBitValue},
			display);
		return A2(
			$author$project$VirtualMachine$setDisplay,
			newDisplay,
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine));
	});
var $author$project$Instructions$setBitForRowColumn = F6(
	function (_v0, _v1, row, column, bit, virtualMachine) {
		var displayWidth = _v0.a;
		var displayHeight = _v0.b;
		var registerX = _v1.a;
		var registerY = _v1.b;
		return A4(
			$author$project$Instructions$setBit,
			A4(
				$author$project$Instructions$calculatePosition,
				$author$project$VirtualMachine$getRegisters(virtualMachine),
				registerX,
				column,
				displayWidth),
			A4(
				$author$project$Instructions$calculatePosition,
				$author$project$VirtualMachine$getRegisters(virtualMachine),
				registerY,
				row,
				displayHeight),
			bit,
			virtualMachine);
	});
var $author$project$Instructions$setBitsForRow = F5(
	function (display, registers, row, bits, virtualMachine) {
		return A3(
			$elm_community$list_extra$List$Extra$indexedFoldl,
			A3($author$project$Instructions$setBitForRowColumn, display, registers, row),
			virtualMachine,
			bits);
	});
var $author$project$Instructions$displaySprite = F4(
	function (virtualMachine, registerX, registerY, n) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var memory = $author$project$VirtualMachine$getMemory(virtualMachine);
		var display = _Utils_Tuple2(64, 32);
		var addressRegister = $author$project$Registers$getAddressRegister(registers);
		var sprites = $elm$core$Array$toList(
			A2(
				$elm$core$Array$initialize,
				n,
				function (i) {
					return A2(
						$elm$core$Result$withDefault,
						0,
						A2($author$project$Memory$getCell, addressRegister + i, memory));
				}));
		var newVirtualMachine = A3(
			$elm_community$list_extra$List$Extra$indexedFoldl,
			F3(
				function (row, sprite, accVirtualMachine) {
					return A5(
						$author$project$Instructions$setBitsForRow,
						display,
						_Utils_Tuple2(registerX, registerY),
						row,
						$author$project$Instructions$hexToBitPattern(sprite),
						accVirtualMachine);
				}),
			A2(
				$author$project$VirtualMachine$setRegisters,
				A2(
					$elm$core$Result$withDefault,
					registers,
					A3($author$project$Registers$setDataRegister, 15, 0, registers)),
				virtualMachine),
			sprites);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handleD = F2(
	function (virtualMachine, opcode) {
		var registerY = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 2, opcode));
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		var n = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 3, opcode));
		return $elm$core$Result$Ok(
			A4($author$project$Instructions$displaySprite, virtualMachine, registerX, registerY, n));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Keypad$getKeysPressed = function (keyPad) {
	return A2(
		$elm$core$List$map,
		$elm$core$Tuple$first,
		A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$second,
				$elm$core$Basics$eq(true)),
			$elm$core$Dict$toList(keyPad)));
};
var $author$project$Instructions$skipNextIfKeyNotPressed = F2(
	function (virtualMachine, registerX) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Registers$getDataRegister, registerX, registers));
		var keysPressed = $author$project$Keypad$getKeysPressed(
			$author$project$VirtualMachine$getKeypad(virtualMachine));
		var newRegisters = (!A2($elm$core$List$member, registerXValue, keysPressed)) ? $author$project$Registers$incrementProgramCounter(registers) : registers;
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$skipNextIfKeyPressed = F2(
	function (virtualMachine, registerX) {
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$author$project$Registers$getDataRegister,
				registerX,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		var keysPressed = $author$project$Keypad$getKeysPressed(
			$author$project$VirtualMachine$getKeypad(virtualMachine));
		var newRegisters = A2($elm$core$List$member, registerXValue, keysPressed) ? $author$project$Registers$incrementProgramCounter(
			$author$project$VirtualMachine$getRegisters(virtualMachine)) : $author$project$VirtualMachine$getRegisters(virtualMachine);
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handleE = F2(
	function (virtualMachine, opcode) {
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		var _byte = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		switch (_byte) {
			case 158:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$skipNextIfKeyPressed, virtualMachine, registerX));
			case 161:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$skipNextIfKeyNotPressed, virtualMachine, registerX));
			default:
				return $elm$core$Result$Err(
					'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode));
		}
	});
var $author$project$Instructions$addToAddressRegister = F2(
	function (virtualMachine, registerX) {
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$author$project$Registers$getDataRegister,
				registerX,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		var newAddressRegister = registerXValue + $author$project$Registers$getAddressRegister(
			$author$project$VirtualMachine$getRegisters(virtualMachine));
		var newRegisters = A2(
			$author$project$Registers$setAddressRegister,
			newAddressRegister,
			$author$project$VirtualMachine$getRegisters(virtualMachine));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$readRegistersFromAddressRegister = F2(
	function (virtualMachine, registerX) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var memory = $author$project$VirtualMachine$getMemory(virtualMachine);
		var addressRegister = $author$project$Registers$getAddressRegister(registers);
		var newRegisters = A3(
			$elm$core$List$foldl,
			F2(
				function (registerY, accRegisters) {
					return A2(
						$elm$core$Result$withDefault,
						accRegisters,
						A3(
							$author$project$Registers$setDataRegister,
							registerY,
							A2(
								$elm$core$Result$withDefault,
								0,
								A2($author$project$Memory$getCell, addressRegister + registerY, memory)),
							accRegisters));
				}),
			registers,
			A2($elm$core$List$range, 0, registerX));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$setAddressRegisterToSpriteLocation = F2(
	function (virtualMachine, registerX) {
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$author$project$Registers$getDataRegister,
				registerX,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		var newRegisters = A2(
			$author$project$Registers$setAddressRegister,
			registerXValue * 5,
			$author$project$VirtualMachine$getRegisters(virtualMachine));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$VirtualMachine$getTimers = function (virtualMachine) {
	return virtualMachine.am;
};
var $author$project$Registers$setDelayTimer = F2(
	function (delay, registers) {
		return _Utils_update(
			registers,
			{Z: delay});
	});
var $author$project$VirtualMachine$setTimers = F2(
	function (timers, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{am: timers});
	});
var $author$project$Timers$getDelay = function (_v0) {
	var delay = _v0;
	return delay;
};
var $author$project$Timers$isRunning = function (_v0) {
	var delay = _v0;
	return delay.ai;
};
var $author$project$Timers$setDelay = F2(
	function (delay, _v0) {
		return delay;
	});
var $author$project$Timers$setRunning = F2(
	function (running, _v0) {
		var delay = _v0;
		return _Utils_update(
			delay,
			{ai: running});
	});
var $author$project$Msg$DelayTick = {$: 3};
var $author$project$Registers$getDelayTimer = function (registers) {
	return registers.Z;
};
var $author$project$Timers$getTickLength = function (_v0) {
	var delay = _v0;
	return delay.bh;
};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Timers$setTimeout = F2(
	function (time, msg) {
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				return msg;
			},
			$elm$core$Process$sleep(time));
	});
var $author$project$Timers$tick = F2(
	function (registers, timers) {
		var delayTimer = $author$project$Registers$getDelayTimer(registers);
		var delay = $author$project$Timers$getDelay(timers);
		return ($author$project$Timers$isRunning(delay) && (delayTimer > 0)) ? _Utils_Tuple2(
			_Utils_Tuple2(
				A2($author$project$Registers$setDelayTimer, delayTimer - 1, registers),
				timers),
			A2(
				$author$project$Timers$setTimeout,
				$author$project$Timers$getTickLength(delay),
				$author$project$Msg$DelayTick)) : _Utils_Tuple2(
			_Utils_Tuple2(
				registers,
				A2(
					$author$project$Timers$setDelay,
					A2($author$project$Timers$setRunning, false, delay),
					timers)),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Timers$startDelayTimer = F2(
	function (registers, timers) {
		if (!$author$project$Timers$isRunning(
			$author$project$Timers$getDelay(timers))) {
			var flip = F3(
				function (f, a, b) {
					return A2(f, b, a);
				});
			var updatedTimers = A2(
				flip($author$project$Timers$setDelay),
				timers,
				A2(
					$author$project$Timers$setRunning,
					true,
					$author$project$Timers$getDelay(timers)));
			return A2($author$project$Timers$tick, registers, updatedTimers);
		} else {
			return _Utils_Tuple2(
				_Utils_Tuple2(registers, timers),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Instructions$setDelayTimerToRegisterValue = F2(
	function (virtualMachine, registerX) {
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$author$project$Registers$getDataRegister,
				registerX,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		var _v0 = A2(
			$author$project$Timers$startDelayTimer,
			A2(
				$author$project$Registers$setDelayTimer,
				registerXValue,
				$author$project$VirtualMachine$getRegisters(virtualMachine)),
			$author$project$VirtualMachine$getTimers(virtualMachine));
		var _v1 = _v0.a;
		var newRegisters = _v1.a;
		var newTimers = _v1.b;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			A2(
				$author$project$VirtualMachine$setRegisters,
				newRegisters,
				A2($author$project$VirtualMachine$setTimers, newTimers, virtualMachine)),
			cmd);
	});
var $author$project$Instructions$setRegisterToDelayTimer = F2(
	function (virtualMachine, registerX) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var delayTimer = $author$project$Registers$getDelayTimer(registers);
		var newRegisters = A2(
			$elm$core$Result$withDefault,
			registers,
			A3($author$project$Registers$setDataRegister, registerX, delayTimer, registers));
		var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, virtualMachine);
		return _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none);
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Timers$playSound = _Platform_outgoingPort('playSound', $elm$json$Json$Encode$int);
var $author$project$Instructions$setSoundTimerToRegisterValue = F2(
	function (virtualMachine, registerX) {
		var newSoundTimer = A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$author$project$Registers$getDataRegister,
				registerX,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		var cmd = $author$project$Timers$playSound(newSoundTimer);
		return _Utils_Tuple2(virtualMachine, cmd);
	});
var $author$project$VirtualMachine$setMemory = F2(
	function (memory, virtualMachine) {
		return _Utils_update(
			virtualMachine,
			{ae: memory});
	});
var $author$project$Instructions$storeBcdOfRegister = F2(
	function (virtualMachine, registerX) {
		var registerXValue = A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$author$project$Registers$getDataRegister,
				registerX,
				$author$project$VirtualMachine$getRegisters(virtualMachine)));
		var memory = $author$project$VirtualMachine$getMemory(virtualMachine);
		var addressRegister = $author$project$Registers$getAddressRegister(
			$author$project$VirtualMachine$getRegisters(virtualMachine));
		var newMemory = A2(
			$elm$core$Result$withDefault,
			memory,
			A2(
				$elm$core$Result$andThen,
				A2(
					$author$project$Memory$setCell,
					addressRegister + 2,
					A2($elm$core$Basics$modBy, 10, registerXValue)),
				A2(
					$elm$core$Result$andThen,
					A2(
						$author$project$Memory$setCell,
						addressRegister + 1,
						(A2($elm$core$Basics$modBy, 100, registerXValue) / 10) | 0),
					A3($author$project$Memory$setCell, addressRegister, (registerXValue / 100) | 0, memory))));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setMemory, newMemory, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$storeRegistersAtAddressRegister = F2(
	function (virtualMachine, registerX) {
		var registers = $author$project$VirtualMachine$getRegisters(virtualMachine);
		var addressRegister = $author$project$Registers$getAddressRegister(registers);
		var newMemory = A3(
			$elm$core$List$foldl,
			F2(
				function (registerY, accMemory) {
					return A2(
						$elm$core$Result$withDefault,
						accMemory,
						A3(
							$author$project$Memory$setCell,
							addressRegister + registerY,
							A2(
								$elm$core$Result$withDefault,
								0,
								A2($author$project$Registers$getDataRegister, registerY, registers)),
							accMemory));
				}),
			$author$project$VirtualMachine$getMemory(virtualMachine),
			A2($elm$core$List$range, 0, registerX));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setMemory, newMemory, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Instructions$waitForKeyPress = F2(
	function (virtualMachine, registerX) {
		var newFlags = A2(
			$author$project$Flags$setWaitingForInputRegister,
			$elm$core$Maybe$Just(registerX),
			$author$project$VirtualMachine$getFlags(virtualMachine));
		return _Utils_Tuple2(
			A2($author$project$VirtualMachine$setFlags, newFlags, virtualMachine),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$FetchDecodeExecuteLoop$handleF = F2(
	function (virtualMachine, opcode) {
		var registerX = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 1, opcode));
		var _byte = $author$project$FetchDecodeExecuteLoop$getByte(opcode);
		switch (_byte) {
			case 7:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$setRegisterToDelayTimer, virtualMachine, registerX));
			case 10:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$waitForKeyPress, virtualMachine, registerX));
			case 21:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$setDelayTimerToRegisterValue, virtualMachine, registerX));
			case 24:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$setSoundTimerToRegisterValue, virtualMachine, registerX));
			case 30:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$addToAddressRegister, virtualMachine, registerX));
			case 41:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$setAddressRegisterToSpriteLocation, virtualMachine, registerX));
			case 51:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$storeBcdOfRegister, virtualMachine, registerX));
			case 85:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$storeRegistersAtAddressRegister, virtualMachine, registerX));
			case 101:
				return $elm$core$Result$Ok(
					A2($author$project$Instructions$readRegistersFromAddressRegister, virtualMachine, registerX));
			default:
				return $elm$core$Result$Err(
					'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode));
		}
	});
var $author$project$FetchDecodeExecuteLoop$executeOpcode = F2(
	function (virtualMachine, opcode) {
		var _v0 = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$FetchDecodeExecuteLoop$getNibble, 0, opcode));
		switch (_v0) {
			case 0:
				return A2($author$project$FetchDecodeExecuteLoop$handle0, virtualMachine, opcode);
			case 1:
				return A2($author$project$FetchDecodeExecuteLoop$handle1, virtualMachine, opcode);
			case 2:
				return A2($author$project$FetchDecodeExecuteLoop$handle2, virtualMachine, opcode);
			case 3:
				return A2($author$project$FetchDecodeExecuteLoop$handle3, virtualMachine, opcode);
			case 4:
				return A2($author$project$FetchDecodeExecuteLoop$handle4, virtualMachine, opcode);
			case 5:
				return A2($author$project$FetchDecodeExecuteLoop$handle5, virtualMachine, opcode);
			case 6:
				return A2($author$project$FetchDecodeExecuteLoop$handle6, virtualMachine, opcode);
			case 7:
				return A2($author$project$FetchDecodeExecuteLoop$handle7, virtualMachine, opcode);
			case 8:
				return A2($author$project$FetchDecodeExecuteLoop$handle8, virtualMachine, opcode);
			case 9:
				return A2($author$project$FetchDecodeExecuteLoop$handle9, virtualMachine, opcode);
			case 10:
				return A2($author$project$FetchDecodeExecuteLoop$handleA, virtualMachine, opcode);
			case 11:
				return A2($author$project$FetchDecodeExecuteLoop$handleB, virtualMachine, opcode);
			case 12:
				return A2($author$project$FetchDecodeExecuteLoop$handleC, virtualMachine, opcode);
			case 13:
				return A2($author$project$FetchDecodeExecuteLoop$handleD, virtualMachine, opcode);
			case 14:
				return A2($author$project$FetchDecodeExecuteLoop$handleE, virtualMachine, opcode);
			case 15:
				return A2($author$project$FetchDecodeExecuteLoop$handleF, virtualMachine, opcode);
			default:
				return $elm$core$Result$Err(
					'Unknown opcode: ' + $author$project$FetchDecodeExecuteLoop$toHex(opcode));
		}
	});
var $author$project$FetchDecodeExecuteLoop$fetchOpcode = F2(
	function (memory, programCounter) {
		var secondByte = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Memory$getCell, programCounter + 1, memory));
		var firstByte = A2(
			$elm$core$Result$withDefault,
			0,
			A2($author$project$Memory$getCell, programCounter, memory));
		return (firstByte << 8) | secondByte;
	});
var $author$project$FetchDecodeExecuteLoop$performCycle = F2(
	function (flags, virtualMachine) {
		if ($author$project$Flags$isWaitingForInput(flags)) {
			return _Utils_Tuple2(virtualMachine, $elm$core$Platform$Cmd$none);
		} else {
			var programCounter = $author$project$Registers$getProgramCounter(
				$author$project$VirtualMachine$getRegisters(virtualMachine));
			var memory = $author$project$VirtualMachine$getMemory(virtualMachine);
			var opcode = A2($author$project$FetchDecodeExecuteLoop$fetchOpcode, memory, programCounter);
			var _v0 = function () {
				var _v1 = A2($author$project$FetchDecodeExecuteLoop$executeOpcode, virtualMachine, opcode);
				if (!_v1.$) {
					var result = _v1.a;
					return result;
				} else {
					return _Utils_Tuple2(virtualMachine, $elm$core$Platform$Cmd$none);
				}
			}();
			var resultVirtualMachine = _v0.a;
			var resultCmd = _v0.b;
			var newRegisters = $author$project$Registers$incrementProgramCounter(
				$author$project$VirtualMachine$getRegisters(resultVirtualMachine));
			var newVirtualMachine = A2($author$project$VirtualMachine$setRegisters, newRegisters, resultVirtualMachine);
			return _Utils_Tuple2(newVirtualMachine, resultCmd);
		}
	});
var $author$project$FetchDecodeExecuteLoop$tick = F2(
	function (instructions, virtualMachine) {
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, _v2) {
					var accVirtualMachine = _v2.a;
					var accCmds = _v2.b;
					var flags = $author$project$VirtualMachine$getFlags(accVirtualMachine);
					var _v3 = A2($author$project$FetchDecodeExecuteLoop$performCycle, flags, accVirtualMachine);
					var updatedVirtualMachine = _v3.a;
					var cmd = _v3.b;
					return _Utils_Tuple2(
						updatedVirtualMachine,
						A2($elm$core$List$cons, cmd, accCmds));
				}),
			_Utils_Tuple2(virtualMachine, _List_Nil),
			A2($elm$core$List$range, 0, instructions));
		var newVirtualMachine = _v0.a;
		var newCmds = _v0.b;
		return $elm$core$List$isEmpty(newCmds) ? _Utils_Tuple2(newVirtualMachine, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			newVirtualMachine,
			$elm$core$Platform$Cmd$batch(
				$elm$core$List$reverse(newCmds)));
	});
var $author$project$Main$clockTick = function (model) {
	var tickSpeed = 2;
	var flags = $author$project$VirtualMachine$getFlags(model.b);
	var running = $author$project$Flags$isRunning(flags);
	var waitingForInput = $author$project$Flags$isWaitingForInput(flags);
	if (running && (!waitingForInput)) {
		var _v0 = A2($author$project$FetchDecodeExecuteLoop$tick, tickSpeed, model.b);
		var newVirtualMachine = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{b: newVirtualMachine}),
			cmd);
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Main$delayTick = function (model) {
	var _v0 = A2(
		$author$project$Timers$tick,
		$author$project$VirtualMachine$getRegisters(model.b),
		$author$project$VirtualMachine$getTimers(model.b));
	var _v1 = _v0.a;
	var newRegisters = _v1.a;
	var newTimers = _v1.b;
	var cmd = _v0.b;
	var newVirtualMachine = A2(
		$author$project$VirtualMachine$setTimers,
		newTimers,
		A2($author$project$VirtualMachine$setRegisters, newRegisters, model.b));
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{b: newVirtualMachine}),
		cmd);
};
var $author$project$Flags$setRunning = F2(
	function (running, flags) {
		return _Utils_update(
			flags,
			{ai: running});
	});
var $author$project$Main$readProgram = F2(
	function (programBytesResult, model) {
		if (programBytesResult.$ === 1) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		} else {
			var programBytes = programBytesResult.a;
			var programStart = 512;
			var newRegisters = A2(
				$author$project$Registers$setProgramCounter,
				programStart,
				A2(
					$author$project$Registers$setAddressRegister,
					0,
					$author$project$VirtualMachine$getRegisters(model.b)));
			var newFlags = A2(
				$author$project$Flags$setRunning,
				true,
				$author$project$VirtualMachine$getFlags(model.b));
			var memory = $author$project$VirtualMachine$getMemory(model.b);
			var newMemory = A3(
				$elm_community$list_extra$List$Extra$indexedFoldl,
				F3(
					function (idx, value, accMemory) {
						return A2(
							$elm$core$Result$withDefault,
							accMemory,
							A3($author$project$Memory$setCell, programStart + idx, value, accMemory));
					}),
				memory,
				$elm$core$Array$toList(programBytes));
			var newVirtualMachine = A2(
				$author$project$VirtualMachine$setFlags,
				newFlags,
				A2(
					$author$project$VirtualMachine$setRegisters,
					newRegisters,
					A2($author$project$VirtualMachine$setMemory, newMemory, model.b)));
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{b: newVirtualMachine}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Msg$LoadedGame = function (a) {
	return {$: 7, a: a};
};
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $author$project$Request$listStep = F2(
	function (decoder, _v0) {
		var n = _v0.a;
		var xs = _v0.b;
		return (n <= 0) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				$elm$core$List$reverse(xs))) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (x) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						n - 1,
						A2($elm$core$List$cons, x, xs)));
			},
			decoder);
	});
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $author$project$Request$byteListDecoder = F2(
	function (decoder, width) {
		return A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(width, _List_Nil),
			$author$project$Request$listStep(decoder));
	});
var $elm$bytes$Bytes$Decode$unsignedInt8 = _Bytes_read_u8;
var $author$project$Request$romDecoder = function (width) {
	return A2(
		$elm$bytes$Bytes$Decode$map,
		$elm$core$Array$fromList,
		A2($author$project$Request$byteListDecoder, $elm$bytes$Bytes$Decode$unsignedInt8, width));
};
var $elm$bytes$Bytes$width = _Bytes_width;
var $author$project$Request$decodeBytesResponse = function (response) {
	switch (response.$) {
		case 0:
			var url = response.a;
			return $elm$core$Result$Err(
				$elm$http$Http$BadUrl(url));
		case 1:
			return $elm$core$Result$Err($elm$http$Http$Timeout);
		case 2:
			return $elm$core$Result$Err($elm$http$Http$NetworkError);
		case 3:
			var metadata = response.a;
			return $elm$core$Result$Err(
				$elm$http$Http$BadStatus(metadata.bX));
		default:
			var bytes = response.b;
			var _v1 = A2(
				$elm$bytes$Bytes$Decode$decode,
				$author$project$Request$romDecoder(
					$elm$bytes$Bytes$width(bytes)),
				bytes);
			if (!_v1.$) {
				var rom = _v1.a;
				return $elm$core$Result$Ok(rom);
			} else {
				return $elm$core$Result$Err(
					$elm$http$Http$BadBody('Could not decode bytes payload'));
			}
	}
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectBytesResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'arraybuffer',
			_Http_toDataView,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {a4: reqs, bf: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.bi;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.a4));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.bf)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					bm: r.bm,
					bp: r.bp,
					bx: A2(_Http_mapExpect, func, r.bx),
					aO: r.aO,
					bF: r.bF,
					b0: r.b0,
					bi: r.bi,
					b3: r.b3
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{bm: false, bp: r.bp, bx: r.bx, aO: r.aO, bF: r.bF, b0: r.b0, bi: r.bi, b3: r.b3}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{bp: $elm$http$Http$emptyBody, bx: r.bx, aO: _List_Nil, bF: 'GET', b0: $elm$core$Maybe$Nothing, bi: $elm$core$Maybe$Nothing, b3: r.b3});
};
var $author$project$Request$romsUrlPrefix = '/roms/';
var $author$project$Request$fetchRom = F2(
	function (romName, toMsg) {
		return $elm$http$Http$get(
			{
				bx: A2($elm$http$Http$expectBytesResponse, toMsg, $author$project$Request$decodeBytesResponse),
				b3: _Utils_ap($author$project$Request$romsUrlPrefix, romName)
			});
	});
var $author$project$Main$loadGame = function (gameName) {
	return A2($author$project$Request$fetchRom, gameName, $author$project$Msg$LoadedGame);
};
var $author$project$Main$selectGame = F2(
	function (gameName, model) {
		var selectedGame = A2(
			$elm_community$list_extra$List$Extra$find,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.r;
				},
				$elm$core$Basics$eq(gameName)),
			model.ab);
		var newVirtualMachine = $author$project$VirtualMachine$init;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{aq: $elm$core$Maybe$Nothing, F: selectedGame, b: newVirtualMachine}),
			$author$project$Main$loadGame(gameName));
	});
var $author$project$Main$reloadGame = function (model) {
	var _v0 = model.F;
	if (!_v0.$) {
		var game = _v0.a;
		var _v1 = A2($author$project$Main$selectGame, game.r, model);
		var newModel = _v1.a;
		var cmd = _v1.b;
		return _Utils_Tuple2(newModel, cmd);
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Keypad$removeKeyPress = F2(
	function (keyCode, keysPressed) {
		return A3(
			$elm$core$Dict$insert,
			$author$project$KeyCode$nibbleValue(keyCode),
			false,
			keysPressed);
	});
var $author$project$Main$removeKeyCode = F2(
	function (maybeKeyCode, model) {
		if (!maybeKeyCode.$) {
			var keyCode = maybeKeyCode.a;
			var newKeypad = A2(
				$author$project$Keypad$removeKeyPress,
				keyCode,
				$author$project$VirtualMachine$getKeypad(model.b));
			var newVirtualMachine = A2($author$project$VirtualMachine$setKeypad, newKeypad, model.b);
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{b: newVirtualMachine}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 1:
				var maybeKeyCode = msg.a;
				return A2($author$project$Main$addKeyCode, maybeKeyCode, model);
			case 0:
				var maybeKeyCode = msg.a;
				return A2($author$project$Main$removeKeyCode, maybeKeyCode, model);
			case 2:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 3:
				return $author$project$Main$delayTick(model);
			case 4:
				return $author$project$Main$clockTick(model);
			case 5:
				var gameName = msg.a;
				return A2($author$project$Main$selectGame, gameName, model);
			case 6:
				return $author$project$Main$reloadGame(model);
			default:
				var gameBytesResult = msg.a;
				return A2($author$project$Main$readProgram, gameBytesResult, model);
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $joakin$elm_canvas$Canvas$Commands = $elm$core$Basics$identity;
var $joakin$elm_canvas$Canvas$addTo = F2(
	function (_v0, cmd) {
		var list = _v0;
		return A2($elm$core$List$cons, cmd, list);
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $joakin$elm_canvas$Canvas$fn = F2(
	function (name, args) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('function')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2(
					'args',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, args))
				]));
	});
var $joakin$elm_canvas$Canvas$clearRect = F5(
	function (x, y, width, height, cmds) {
		return A2(
			$joakin$elm_canvas$Canvas$addTo,
			cmds,
			A2(
				$joakin$elm_canvas$Canvas$fn,
				'clearRect',
				_List_fromArray(
					[
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(width),
						$elm$json$Json$Encode$float(height)
					])));
	});
var $elm$html$Html$canvas = _VirtualDom_node('canvas');
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $joakin$elm_canvas$Canvas$commands = function (_v0) {
	var list = _v0;
	return A2(
		$elm$html$Html$Attributes$property,
		'cmds',
		A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, list));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $joakin$elm_canvas$Canvas$element = F4(
	function (w, h, attrs, cmds) {
		return A3(
			$elm$html$Html$node,
			'elm-canvas',
			_List_fromArray(
				[
					$joakin$elm_canvas$Canvas$commands(cmds)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$canvas,
					$elm$core$List$concat(
						_List_fromArray(
							[
								_List_fromArray(
								[
									$elm$html$Html$Attributes$height(h),
									$elm$html$Html$Attributes$width(w)
								]),
								attrs
							])),
					_List_Nil)
				]));
	});
var $joakin$elm_canvas$Canvas$empty = _List_Nil;
var $author$project$Main$cellSize = 10;
var $author$project$Main$height = 32 * $author$project$Main$cellSize;
var $author$project$Main$backgroundColor = {K: 227, M: 246, Q: 253};
var $author$project$Main$cellColor = {K: 41, M: 37, Q: 33};
var $joakin$elm_canvas$Canvas$fillRect = F5(
	function (x, y, w, h, cmds) {
		return A2(
			$joakin$elm_canvas$Canvas$addTo,
			cmds,
			A2(
				$joakin$elm_canvas$Canvas$fn,
				'fillRect',
				_List_fromArray(
					[
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(w),
						$elm$json$Json$Encode$float(h)
					])));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $joakin$elm_canvas$CanvasColor$fmod = F2(
	function (f, n) {
		var integer = $elm$core$Basics$floor(f);
		return ((integer % n) + f) - integer;
	});
var $joakin$elm_canvas$CanvasColor$hslToRgb = F3(
	function (hue, saturation, lightness) {
		var normHue = hue / $elm$core$Basics$degrees(60);
		var chroma = (1 - $elm$core$Basics$abs((2 * lightness) - 1)) * saturation;
		var m = lightness - (chroma / 2);
		var x = chroma * (1 - $elm$core$Basics$abs(
			A2($joakin$elm_canvas$CanvasColor$fmod, normHue, 2) - 1));
		var _v0 = (normHue < 0) ? _Utils_Tuple3(0, 0, 0) : ((normHue < 1) ? _Utils_Tuple3(chroma, x, 0) : ((normHue < 2) ? _Utils_Tuple3(x, chroma, 0) : ((normHue < 3) ? _Utils_Tuple3(0, chroma, x) : ((normHue < 4) ? _Utils_Tuple3(0, x, chroma) : ((normHue < 5) ? _Utils_Tuple3(x, 0, chroma) : ((normHue < 6) ? _Utils_Tuple3(chroma, 0, x) : _Utils_Tuple3(0, 0, 0)))))));
		var r = _v0.a;
		var g = _v0.b;
		var b = _v0.c;
		return _Utils_Tuple3(r + m, g + m, b + m);
	});
var $elm$core$Basics$round = _Basics_round;
var $joakin$elm_canvas$CanvasColor$toRgb = function (color) {
	if (!color.$) {
		var r = color.a;
		var g = color.b;
		var b = color.c;
		var a = color.d;
		return {bn: a, K: b, M: g, Q: r};
	} else {
		var h = color.a;
		var s = color.b;
		var l = color.c;
		var a = color.d;
		var _v1 = A3($joakin$elm_canvas$CanvasColor$hslToRgb, h, s, l);
		var r = _v1.a;
		var g = _v1.b;
		var b = _v1.c;
		return {
			bn: a,
			K: $elm$core$Basics$round(255 * b),
			M: $elm$core$Basics$round(255 * g),
			Q: $elm$core$Basics$round(255 * r)
		};
	}
};
var $joakin$elm_canvas$Canvas$colorToCSSString = function (color) {
	var _v0 = $joakin$elm_canvas$CanvasColor$toRgb(color);
	var red = _v0.Q;
	var green = _v0.M;
	var blue = _v0.K;
	var alpha = _v0.bn;
	return 'rgba(' + ($elm$core$String$fromInt(red) + (', ' + ($elm$core$String$fromInt(green) + (', ' + ($elm$core$String$fromInt(blue) + (', ' + ($elm$core$String$fromFloat(alpha) + ')')))))));
};
var $joakin$elm_canvas$Canvas$field = F2(
	function (name, value) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('field')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2('value', value)
				]));
	});
var $joakin$elm_canvas$Canvas$fillStyle = F2(
	function (color, cmds) {
		return A2(
			$joakin$elm_canvas$Canvas$addTo,
			cmds,
			A2(
				$joakin$elm_canvas$Canvas$field,
				'fillStyle',
				$elm$json$Json$Encode$string(
					$joakin$elm_canvas$Canvas$colorToCSSString(color))));
	});
var $joakin$elm_canvas$CanvasColor$RGBA = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $joakin$elm_canvas$CanvasColor$rgba = $joakin$elm_canvas$CanvasColor$RGBA;
var $author$project$Main$renderCell = F4(
	function (rowIdx, columnIdx, cellValue, commands) {
		var color = cellValue ? A4($joakin$elm_canvas$CanvasColor$rgba, $author$project$Main$cellColor.Q, $author$project$Main$cellColor.M, $author$project$Main$cellColor.K, 1) : A4($joakin$elm_canvas$CanvasColor$rgba, $author$project$Main$backgroundColor.Q, $author$project$Main$backgroundColor.M, $author$project$Main$backgroundColor.K, 1);
		var _v0 = _Utils_Tuple2(rowIdx * $author$project$Main$cellSize, columnIdx * $author$project$Main$cellSize);
		var x = _v0.a;
		var y = _v0.b;
		return A5(
			$joakin$elm_canvas$Canvas$fillRect,
			x,
			y,
			$author$project$Main$cellSize,
			$author$project$Main$cellSize,
			A2($joakin$elm_canvas$Canvas$fillStyle, color, commands));
	});
var $author$project$Main$renderCellRow = F3(
	function (rowIdx, rowCells, commands) {
		return A3(
			$elm_community$list_extra$List$Extra$indexedFoldl,
			$author$project$Main$renderCell(rowIdx),
			commands,
			$elm$core$Array$toList(rowCells));
	});
var $author$project$Main$renderDisplay = F2(
	function (displayCells, commands) {
		return A3(
			$elm_community$list_extra$List$Extra$indexedFoldl,
			$author$project$Main$renderCellRow,
			commands,
			$elm$core$Array$toList(displayCells));
	});
var $author$project$Main$width = 64 * $author$project$Main$cellSize;
var $author$project$Main$viewCanvas = function (model) {
	return A4(
		$joakin$elm_canvas$Canvas$element,
		$author$project$Main$width,
		$author$project$Main$height,
		_List_Nil,
		A2(
			$author$project$Main$renderDisplay,
			model.b.bu,
			A5($joakin$elm_canvas$Canvas$clearRect, 0, 0, $author$project$Main$width, $author$project$Main$height, $joakin$elm_canvas$Canvas$empty)));
};
var $author$project$Msg$ReloadGame = {$: 6};
var $author$project$Msg$SelectGame = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $author$project$Main$onChange = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue));
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewGameSelector = function (model) {
	var reloadButton = _List_fromArray(
		[
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('game-reload'),
					$elm$html$Html$Attributes$class('nes-btn is-warning'),
					A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
					$elm$html$Html$Events$onClick($author$project$Msg$ReloadGame)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('RELOAD')
				]))
		]);
	var gameOption = function (game) {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(game.r)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(game.r)
				]));
	};
	var gameOptions = A2(
		$elm$core$List$cons,
		A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value('')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('SELECT GAME')
				])),
		A2($elm$core$List$map, gameOption, model.ab));
	var gameSelector = _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nes-select'),
					A2($elm$html$Html$Attributes$style, 'width', '15%'),
					A2($elm$html$Html$Attributes$style, 'left', '42.5%'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '1em')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('game-selector'),
							$author$project$Main$onChange($author$project$Msg$SelectGame)
						]),
					gameOptions)
				]))
		]);
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('games-container')
			]),
		_Utils_ap(gameSelector, reloadButton));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Main$viewHeader = A2(
	$elm$html$Html$h1,
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('CHIP-8 EMULATOR')
		]));
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Main$prettyPrintKey = function (keyStr) {
	switch (keyStr) {
		case ' ':
			return 'SPACE';
		case 'ArrowLeft':
			return 'LEFT ARROW';
		case 'ArrowUp':
			return 'UP ARROW';
		case 'ArrowRight':
			return 'RIGHT ARROW';
		case 'ArrowDown':
			return 'DOWN ARROW';
		default:
			var alphaNumeric = keyStr;
			return $elm$core$String$toUpper(alphaNumeric);
	}
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Main$viewKeyMapping = function (model) {
	var toListItems = F2(
		function (_v1, acc) {
			var keyStr = _v1.a;
			return A2(
				$elm$core$List$cons,
				A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Main$prettyPrintKey(keyStr))
						])),
				acc);
		});
	var keyMapping = function () {
		var _v0 = model.F;
		if (!_v0.$) {
			var game = _v0.a;
			return game.p;
		} else {
			return _List_Nil;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('key-mapping-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('CONTROLS')
					])),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('key-mapping')
					]),
				A3($elm$core$List$foldl, toListItems, _List_Nil, keyMapping))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin-top', '1em')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewHeader,
				$author$project$Main$viewCanvas(model),
				$author$project$Main$viewGameSelector(model),
				$author$project$Main$viewKeyMapping(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{bE: $author$project$Main$init, bZ: $author$project$Main$subscriptions, b2: $author$project$Main$update, b4: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));