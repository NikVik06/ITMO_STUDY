(() => {
  // output/Main/foreign.js
  var alert = function (message2) {
    return function () {
      window.alert(message2);
    };
  };
  var preventDefault = function (event) {
    return function () {
      event.preventDefault();
    };
  };
  var _textContent = function (node) {
    return function () {
      return node.textContent !== null
        ? { tag: 'Just', value: node.textContent }
        : { tag: 'Nothing' };
    };
  };
  var processRequestJS = function (x) {
    return function (y) {
      return function (r) {
        return function () {
          console.log(
            '\u{1F7E2} PureScript \u0432\u044B\u0437\u044B\u0432\u0430\u0435\u0442 processRequest \u0441:',
            x,
            y,
            r
          );
          processRequest(x, y, r);
        };
      };
    };
  };
  var displayResultInTable = function (x) {
    return function (y) {
      return function (r) {
        return function (result) {
          return function (time2) {
            return function (execTime) {
              return function () {
                console.log(
                  '\u{1F7E2} PureScript.displayResultInTable: \u0414\u043E\u0431\u0430\u0432\u043B\u044F\u044E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442:',
                  x,
                  y,
                  r,
                  result
                );
                const noResults = document.querySelector('.no-results');
                if (noResults) {
                  noResults.remove();
                }
                const resultsBody = document.getElementById('results-body');
                if (!resultsBody) {
                  console.error('results-body \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D!');
                  return;
                }
                const newRow = resultsBody.insertRow(0);
                const rowX = newRow.insertCell(0);
                const rowY = newRow.insertCell(1);
                const rowR = newRow.insertCell(2);
                const rowResult = newRow.insertCell(3);
                const rowTime = newRow.insertCell(4);
                const rowExecTime = newRow.insertCell(5);
                rowX.innerText = x.toString();
                rowY.innerText = y.toString();
                rowR.innerText = r.toString();
                rowTime.innerText = time2;
                rowExecTime.innerText = execTime;
                rowResult.innerText = result.toString();
                newRow.className = result === true ? 'hit' : 'miss';
                console.log(
                  '\u2705 PureScript \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0443'
                );
              };
            };
          };
        };
      };
    };
  };
  var processRequestWithResult = function (x) {
    return function (y) {
      return function (r) {
        return function (onError, onSuccess) {
          console.log(
            '\u{1F7E1} PureScript.processRequestWithResult: \u041D\u0430\u0447\u0430\u043B\u043E \u0434\u043B\u044F',
            x,
            y,
            r
          );
          processRequest(x, y, r)
            .then(resultData => {
              console.log(
                '\u{1F7E2} PureScript.processRequestWithResult: \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u044B \u0434\u0430\u043D\u043D\u044B\u0435:',
                resultData
              );
              onSuccess(resultData)();
            })
            .catch(error3 => {
              console.error(
                '\u{1F534} PureScript.processRequestWithResult: \u041E\u0448\u0438\u0431\u043A\u0430:',
                error3
              );
              onError(error3.toString())();
            });
          return function (cancelError, cancelerError, cancelerSuccess) {
            console.log('processRequestWithResult: \u041E\u0442\u043C\u0435\u043D\u0430');
            cancelerSuccess();
          };
        };
      };
    };
  };
  window.processRequestWithResult = processRequestWithResult;
  var getItem = function (key) {
    return function () {
      return localStorage.getItem(key);
    };
  };
  var safeParseAndDisplay = function (json) {
    return function () {
      try {
        console.log(
          '\u{1F6E1}\uFE0F \u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0439 \u043F\u0430\u0440\u0441\u0438\u043D\u0433 \u0438 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435...'
        );
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) {
          console.error(
            '\u274C \u0414\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u043C\u0430\u0441\u0441\u0438\u0432\u043E\u043C'
          );
          return { tag: 'Nothing' };
        }
        let successCount = 0;
        for (let i = 0; i < parsed.length; i++) {
          try {
            const item = parsed[i];
            const x = safeNumber(item.x);
            const y = safeNumber(item.y);
            const r = safeNumber(item.r);
            const result = safeBoolean(item.result);
            const time2 = safeString(item.time);
            const execTime = safeString(item.execTime);
            displayResultInTable(x)(y)(r)(result)(time2)(execTime)();
            successCount++;
          } catch (itemError) {
            console.error(
              `\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0432 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0435 ${i}:`,
              itemError
            );
          }
        }
        return successCount;
      } catch (e) {
        console.error(
          '\u274C \u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0439 \u043F\u0430\u0440\u0441\u0438\u043D\u0433 \u043D\u0435 \u0443\u0434\u0430\u043B\u0441\u044F:',
          e
        );
        return 0;
      }
    };
  };
  function safeNumber(value12) {
    if (typeof value12 === 'number') return value12;
    if (typeof value12 === 'string') {
      const parsed = parseFloat(value12);
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  }
  function safeBoolean(value12) {
    if (typeof value12 === 'boolean') return value12;
    if (typeof value12 === 'string') return value12 === 'true' || value12 === '1';
    return false;
  }
  function safeString(value12) {
    if (typeof value12 === 'string') return value12;
    return 'N/A';
  }

  // output/Control.Apply/foreign.js
  var arrayApply = function (fs) {
    return function (xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l * k);
      var n = 0;
      for (var i = 0; i < l; i++) {
        var f = fs[i];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };

  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function (f) {
      return function (g) {
        return function (x) {
          return f(g(x));
        };
      };
    },
  };

  // output/Control.Category/index.js
  var identity = function (dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function (x) {
      return x;
    },
    Semigroupoid0: function () {
      return semigroupoidFn;
    },
  };

  // output/Data.Function/index.js
  var flip = function (f) {
    return function (b) {
      return function (a) {
        return f(a)(b);
      };
    };
  };
  var $$const = function (a) {
    return function (v) {
      return a;
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Type.Proxy/index.js
  var $$Proxy = /* @__PURE__ */ (function () {
    function $$Proxy2() {}
    $$Proxy2.value = new $$Proxy2();
    return $$Proxy2;
  })();

  // output/Data.Functor/index.js
  var map = function (dict) {
    return dict.map;
  };
  var $$void = function (dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var functorArray = {
    map: arrayMap,
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var applyArray = {
    apply: arrayApply,
    Functor0: function () {
      return functorArray;
    },
  };
  var apply = function (dict) {
    return dict.apply;
  };
  var applySecond = function (dictApply) {
    var apply1 = apply(dictApply);
    var map7 = map(dictApply.Functor0());
    return function (a) {
      return function (b) {
        return apply1(map7($$const(identity2))(a))(b);
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function (dict) {
    return dict.pure;
  };
  var when = function (dictApplicative) {
    var pure12 = pure(dictApplicative);
    return function (v) {
      return function (v1) {
        if (v) {
          return v1;
        }
        if (!v) {
          return pure12(unit);
        }
        throw new Error(
          'Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): ' +
            [v.constructor.name, v1.constructor.name]
        );
      };
    };
  };
  var liftA1 = function (dictApplicative) {
    var apply2 = apply(dictApplicative.Apply0());
    var pure12 = pure(dictApplicative);
    return function (f) {
      return function (a) {
        return apply2(pure12(f))(a);
      };
    };
  };

  // output/Control.Bind/foreign.js
  var arrayBind =
    typeof Array.prototype.flatMap === 'function'
      ? function (arr) {
          return function (f) {
            return arr.flatMap(f);
          };
        }
      : function (arr) {
          return function (f) {
            var result = [];
            var l = arr.length;
            for (var i = 0; i < l; i++) {
              var xs = f(arr[i]);
              var k = xs.length;
              for (var j = 0; j < k; j++) {
                result.push(xs[j]);
              }
            }
            return result;
          };
        };

  // output/Control.Bind/index.js
  var discard = function (dict) {
    return dict.discard;
  };
  var bindArray = {
    bind: arrayBind,
    Apply0: function () {
      return applyArray;
    },
  };
  var bind = function (dict) {
    return dict.bind;
  };
  var bindFlipped = function (dictBind) {
    return flip(bind(dictBind));
  };
  var discardUnit = {
    discard: function (dictBind) {
      return bind(dictBind);
    },
  };

  // output/Data.Array/foreign.js
  var replicateFill = function (count, value12) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value12);
  };
  var replicatePolyfill = function (count, value12) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value12;
    }
    return result;
  };
  var replicateImpl =
    typeof Array.prototype.fill === 'function' ? replicateFill : replicatePolyfill;
  var length = function (xs) {
    return xs.length;
  };
  var indexImpl = function (just, nothing, xs, i) {
    return i < 0 || i >= xs.length ? nothing : just(xs[i]);
  };
  var filterImpl = function (f, xs) {
    return xs.filter(f);
  };
  var sortByImpl = /* @__PURE__ */ (function () {
    function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to) {
      var mid;
      var i;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from2 + ((to - from2) >> 1);
      if (mid - from2 > 1) mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
      if (to - mid > 1) mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
      i = from2;
      j = mid;
      k = from2;
      while (i < mid && j < to) {
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare2(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function (compare2, fromOrdering, xs) {
      var out;
      if (xs.length < 2) return xs;
      out = xs.slice(0);
      mergeFromTo(compare2, fromOrdering, out, xs.slice(0), 0, xs.length);
      return out;
    };
  })();

  // output/Data.Semigroup/foreign.js
  var concatArray = function (xs) {
    return function (ys) {
      if (xs.length === 0) return ys;
      if (ys.length === 0) return xs;
      return xs.concat(ys);
    };
  };

  // output/Data.Symbol/index.js
  var reflectSymbol = function (dict) {
    return dict.reflectSymbol;
  };

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function (label4) {
    return function (rec) {
      return rec[label4];
    };
  };

  // output/Data.Semigroup/index.js
  var semigroupArray = {
    append: concatArray,
  };
  var append = function (dict) {
    return dict.append;
  };

  // output/Control.Monad/index.js
  var ap = function (dictMonad) {
    var bind3 = bind(dictMonad.Bind1());
    var pure3 = pure(dictMonad.Applicative0());
    return function (f) {
      return function (a) {
        return bind3(f)(function (f$prime) {
          return bind3(a)(function (a$prime) {
            return pure3(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Data.Bounded/foreign.js
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function (lt) {
    return function (eq4) {
      return function (gt) {
        return function (x) {
          return function (y) {
            return x < y ? lt : x === y ? eq4 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordNumberImpl = unsafeCompareImpl;
  var ordCharImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };
  var eqBooleanImpl = refEq;
  var eqIntImpl = refEq;
  var eqNumberImpl = refEq;
  var eqCharImpl = refEq;
  var eqArrayImpl = function (f) {
    return function (xs) {
      return function (ys) {
        if (xs.length !== ys.length) return false;
        for (var i = 0; i < xs.length; i++) {
          if (!f(xs[i])(ys[i])) return false;
        }
        return true;
      };
    };
  };

  // output/Data.Eq/index.js
  var eqNumber = {
    eq: eqNumberImpl,
  };
  var eqInt = {
    eq: eqIntImpl,
  };
  var eqChar = {
    eq: eqCharImpl,
  };
  var eqBoolean = {
    eq: eqBooleanImpl,
  };
  var eq = function (dict) {
    return dict.eq;
  };
  var eq2 = /* @__PURE__ */ eq(eqBoolean);
  var eqArray = function (dictEq) {
    return {
      eq: eqArrayImpl(eq(dictEq)),
    };
  };
  var notEq = function (dictEq) {
    var eq32 = eq(dictEq);
    return function (x) {
      return function (y) {
        return eq2(eq32(x)(y))(false);
      };
    };
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ (function () {
    function LT2() {}
    LT2.value = new LT2();
    return LT2;
  })();
  var GT = /* @__PURE__ */ (function () {
    function GT2() {}
    GT2.value = new GT2();
    return GT2;
  })();
  var EQ = /* @__PURE__ */ (function () {
    function EQ2() {}
    EQ2.value = new EQ2();
    return EQ2;
  })();
  var eqOrdering = {
    eq: function (v) {
      return function (v1) {
        if (v instanceof LT && v1 instanceof LT) {
          return true;
        }
        if (v instanceof GT && v1 instanceof GT) {
          return true;
        }
        if (v instanceof EQ && v1 instanceof EQ) {
          return true;
        }
        return false;
      };
    },
  };

  // output/Data.Ord/index.js
  var ordNumber = /* @__PURE__ */ (function () {
    return {
      compare: ordNumberImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function () {
        return eqNumber;
      },
    };
  })();
  var ordInt = /* @__PURE__ */ (function () {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function () {
        return eqInt;
      },
    };
  })();
  var ordChar = /* @__PURE__ */ (function () {
    return {
      compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function () {
        return eqChar;
      },
    };
  })();
  var compare = function (dict) {
    return dict.compare;
  };
  var comparing = function (dictOrd) {
    var compare3 = compare(dictOrd);
    return function (f) {
      return function (x) {
        return function (y) {
          return compare3(f(x))(f(y));
        };
      };
    };
  };

  // output/Data.Bounded/index.js
  var top = function (dict) {
    return dict.top;
  };
  var boundedChar = {
    top: topChar,
    bottom: bottomChar,
    Ord0: function () {
      return ordChar;
    },
  };
  var bottom = function (dict) {
    return dict.bottom;
  };

  // output/Data.Show/foreign.js
  var showIntImpl = function (n) {
    return n.toString();
  };
  var showNumberImpl = function (n) {
    var str = n.toString();
    return isNaN(str + '.0') ? str : str + '.0';
  };
  var showArrayImpl = function (f) {
    return function (xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return '[' + ss.join(',') + ']';
    };
  };

  // output/Data.Show/index.js
  var showRecordFields = function (dict) {
    return dict.showRecordFields;
  };
  var showRecord = function () {
    return function () {
      return function (dictShowRecordFields) {
        var showRecordFields1 = showRecordFields(dictShowRecordFields);
        return {
          show: function (record) {
            return '{' + (showRecordFields1($$Proxy.value)(record) + '}');
          },
        };
      };
    };
  };
  var showNumber = {
    show: showNumberImpl,
  };
  var showInt = {
    show: showIntImpl,
  };
  var show = function (dict) {
    return dict.show;
  };
  var showArray = function (dictShow) {
    return {
      show: showArrayImpl(show(dictShow)),
    };
  };
  var showRecordFieldsCons = function (dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function (dictShowRecordFields) {
      var showRecordFields1 = showRecordFields(dictShowRecordFields);
      return function (dictShow) {
        var show12 = show(dictShow);
        return {
          showRecordFields: function (v) {
            return function (record) {
              var tail = showRecordFields1($$Proxy.value)(record);
              var key = reflectSymbol2($$Proxy.value);
              var focus2 = unsafeGet(key)(record);
              return ' ' + (key + (': ' + (show12(focus2) + (',' + tail))));
            };
          },
        };
      };
    };
  };
  var showRecordFieldsConsNil = function (dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function (dictShow) {
      var show12 = show(dictShow);
      return {
        showRecordFields: function (v) {
          return function (record) {
            var key = reflectSymbol2($$Proxy.value);
            var focus2 = unsafeGet(key)(record);
            return ' ' + (key + (': ' + (show12(focus2) + ' ')));
          };
        },
      };
    };
  };

  // output/Data.Maybe/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ (function () {
    function Nothing2() {}
    Nothing2.value = new Nothing2();
    return Nothing2;
  })();
  var Just = /* @__PURE__ */ (function () {
    function Just2(value0) {
      this.value0 = value0;
    }
    Just2.create = function (value0) {
      return new Just2(value0);
    };
    return Just2;
  })();
  var showMaybe = function (dictShow) {
    var show4 = show(dictShow);
    return {
      show: function (v) {
        if (v instanceof Just) {
          return '(Just ' + (show4(v.value0) + ')');
        }
        if (v instanceof Nothing) {
          return 'Nothing';
        }
        throw new Error(
          'Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): ' +
            [v.constructor.name]
        );
      },
    };
  };
  var maybe = function (v) {
    return function (v1) {
      return function (v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        throw new Error(
          'Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): ' +
            [v.constructor.name, v1.constructor.name, v2.constructor.name]
        );
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var functorMaybe = {
    map: function (v) {
      return function (v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        return Nothing.value;
      };
    },
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function (a) {
    return maybe(a)(identity3);
  };
  var fromJust = function () {
    return function (v) {
      if (v instanceof Just) {
        return v.value0;
      }
      throw new Error(
        'Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): ' +
          [v.constructor.name]
      );
    };
  };
  var applyMaybe = {
    apply: function (v) {
      return function (v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        throw new Error(
          'Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): ' +
            [v.constructor.name, v1.constructor.name]
        );
      };
    },
    Functor0: function () {
      return functorMaybe;
    },
  };
  var bindMaybe = {
    bind: function (v) {
      return function (v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        throw new Error(
          'Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): ' +
            [v.constructor.name, v1.constructor.name]
        );
      };
    },
    Apply0: function () {
      return applyMaybe;
    },
  };

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ (function () {
    function Left2(value0) {
      this.value0 = value0;
    }
    Left2.create = function (value0) {
      return new Left2(value0);
    };
    return Left2;
  })();
  var Right = /* @__PURE__ */ (function () {
    function Right2(value0) {
      this.value0 = value0;
    }
    Right2.create = function (value0) {
      return new Right2(value0);
    };
    return Right2;
  })();
  var functorEither = {
    map: function (f) {
      return function (m) {
        if (m instanceof Left) {
          return new Left(m.value0);
        }
        if (m instanceof Right) {
          return new Right(f(m.value0));
        }
        throw new Error(
          'Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): ' +
            [m.constructor.name]
        );
      };
    },
  };
  var map3 = /* @__PURE__ */ map(functorEither);
  var either = function (v) {
    return function (v1) {
      return function (v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        throw new Error(
          'Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): ' +
            [v.constructor.name, v1.constructor.name, v2.constructor.name]
        );
      };
    };
  };
  var applyEither = {
    apply: function (v) {
      return function (v1) {
        if (v instanceof Left) {
          return new Left(v.value0);
        }
        if (v instanceof Right) {
          return map3(v.value0)(v1);
        }
        throw new Error(
          'Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): ' +
            [v.constructor.name, v1.constructor.name]
        );
      };
    },
    Functor0: function () {
      return functorEither;
    },
  };
  var bindEither = {
    bind: /* @__PURE__ */ either(function (e) {
      return function (v) {
        return new Left(e);
      };
    })(function (a) {
      return function (f) {
        return f(a);
      };
    }),
    Apply0: function () {
      return applyEither;
    },
  };
  var applicativeEither = /* @__PURE__ */ (function () {
    return {
      pure: Right.create,
      Apply0: function () {
        return applyEither;
      },
    };
  })();

  // output/Data.Monoid/index.js
  var mempty = function (dict) {
    return dict.mempty;
  };

  // output/Effect/foreign.js
  var pureE = function (a) {
    return function () {
      return a;
    };
  };
  var bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };

  // output/Effect/index.js
  var $runtime_lazy = function (name15, moduleName, init) {
    var state3 = 0;
    var val;
    return function (lineNumber) {
      if (state3 === 2) return val;
      if (state3 === 1)
        throw new ReferenceError(
          name15 +
            ' was needed before it finished initializing (module ' +
            moduleName +
            ', line ' +
            lineNumber +
            ')',
          moduleName,
          lineNumber
        );
      state3 = 1;
      val = init();
      state3 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function () {
      return applicativeEffect;
    },
    Bind1: function () {
      return bindEffect;
    },
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function () {
      return $lazy_applyEffect(0);
    },
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function () {
      return $lazy_applyEffect(0);
    },
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy('functorEffect', 'Effect', function () {
    return {
      map: liftA1(applicativeEffect),
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy('applyEffect', 'Effect', function () {
    return {
      apply: ap(monadEffect),
      Functor0: function () {
        return $lazy_functorEffect(0);
      },
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

  // output/Effect.Ref/foreign.js
  var _new = function (val) {
    return function () {
      return { value: val };
    };
  };
  var read = function (ref) {
    return function () {
      return ref.value;
    };
  };
  var modifyImpl = function (f) {
    return function (ref) {
      return function () {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var $$new = _new;
  var modify$prime = modifyImpl;
  var modify = function (f) {
    return modify$prime(function (s) {
      var s$prime = f(s);
      return {
        state: s$prime,
        value: s$prime,
      };
    });
  };
  var modify_ = function (f) {
    return function (s) {
      return $$void2(modify(f)(s));
    };
  };

  // output/Control.Monad.ST.Internal/foreign.js
  var map_ = function (f) {
    return function (a) {
      return function () {
        return f(a());
      };
    };
  };
  var pure_ = function (a) {
    return function () {
      return a;
    };
  };
  var bind_ = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
  var foreach = function (as) {
    return function (f) {
      return function () {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };

  // output/Control.Monad.ST.Internal/index.js
  var $runtime_lazy2 = function (name15, moduleName, init) {
    var state3 = 0;
    var val;
    return function (lineNumber) {
      if (state3 === 2) return val;
      if (state3 === 1)
        throw new ReferenceError(
          name15 +
            ' was needed before it finished initializing (module ' +
            moduleName +
            ', line ' +
            lineNumber +
            ')',
          moduleName,
          lineNumber
        );
      state3 = 1;
      val = init();
      state3 = 2;
      return val;
    };
  };
  var functorST = {
    map: map_,
  };
  var monadST = {
    Applicative0: function () {
      return applicativeST;
    },
    Bind1: function () {
      return bindST;
    },
  };
  var bindST = {
    bind: bind_,
    Apply0: function () {
      return $lazy_applyST(0);
    },
  };
  var applicativeST = {
    pure: pure_,
    Apply0: function () {
      return $lazy_applyST(0);
    },
  };
  var $lazy_applyST = /* @__PURE__ */ $runtime_lazy2(
    'applyST',
    'Control.Monad.ST.Internal',
    function () {
      return {
        apply: ap(monadST),
        Functor0: function () {
          return functorST;
        },
      };
    }
  );

  // output/Data.Array.ST/foreign.js
  function unsafeFreezeThawImpl(xs) {
    return xs;
  }
  var unsafeFreezeImpl = unsafeFreezeThawImpl;
  var unsafeThawImpl = unsafeFreezeThawImpl;
  var pushImpl = function (a, xs) {
    return xs.push(a);
  };

  // output/Control.Monad.ST.Uncurried/foreign.js
  var runSTFn1 = function runSTFn12(fn) {
    return function (a) {
      return function () {
        return fn(a);
      };
    };
  };
  var runSTFn2 = function runSTFn22(fn) {
    return function (a) {
      return function (b) {
        return function () {
          return fn(a, b);
        };
      };
    };
  };

  // output/Data.Array.ST/index.js
  var unsafeThaw = /* @__PURE__ */ runSTFn1(unsafeThawImpl);
  var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
  var push = /* @__PURE__ */ runSTFn2(pushImpl);

  // output/Data.Foldable/foreign.js
  var foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ (function () {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    Tuple2.create = function (value0) {
      return function (value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  })();
  var snd = function (v) {
    return v.value1;
  };
  var fst = function (v) {
    return v.value0;
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function (x) {
    return x;
  };

  // output/Data.Foldable/index.js
  var foldr = function (dict) {
    return dict.foldr;
  };
  var traverse_ = function (dictApplicative) {
    var applySecond2 = applySecond(dictApplicative.Apply0());
    var pure3 = pure(dictApplicative);
    return function (dictFoldable) {
      var foldr2 = foldr(dictFoldable);
      return function (f) {
        return foldr2(function ($454) {
          return applySecond2(f($454));
        })(pure3(unit));
      };
    };
  };
  var for_ = function (dictApplicative) {
    var traverse_1 = traverse_(dictApplicative);
    return function (dictFoldable) {
      return flip(traverse_1(dictFoldable));
    };
  };
  var foldMapDefaultR = function (dictFoldable) {
    var foldr2 = foldr(dictFoldable);
    return function (dictMonoid) {
      var append2 = append(dictMonoid.Semigroup0());
      var mempty2 = mempty(dictMonoid);
      return function (f) {
        return foldr2(function (x) {
          return function (acc) {
            return append2(f(x))(acc);
          };
        })(mempty2);
      };
    };
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
    },
  };

  // output/Data.Function.Uncurried/foreign.js
  var runFn2 = function (fn) {
    return function (a) {
      return function (b) {
        return fn(a, b);
      };
    };
  };
  var runFn3 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return fn(a, b, c);
        };
      };
    };
  };
  var runFn4 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };

  // output/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function (f) {
    return function (xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(i)(xs[i]);
      }
      return result;
    };
  };

  // output/Data.FunctorWithIndex/index.js
  var mapWithIndex = function (dict) {
    return dict.mapWithIndex;
  };
  var functorWithIndexArray = {
    mapWithIndex: mapWithIndexArray,
    Functor0: function () {
      return functorArray;
    },
  };

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function (isNothing2) {
    return function (fromJust5) {
      return function (fst2) {
        return function (snd2) {
          return function (f) {
            return function (b) {
              var result = [];
              var value12 = b;
              while (true) {
                var maybe2 = f(value12);
                if (isNothing2(maybe2)) return result;
                var tuple = fromJust5(maybe2);
                result.push(fst2(tuple));
                value12 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function (isNothing2) {
    return function (fromJust5) {
      return function (fst2) {
        return function (snd2) {
          return function (f) {
            return function (b) {
              var result = [];
              var value12 = b;
              while (true) {
                var tuple = f(value12);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2)) return result;
                value12 = fromJust5(maybe2);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var unfoldable1Array = {
    unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd),
  };

  // output/Data.Unfoldable/index.js
  var fromJust3 = /* @__PURE__ */ fromJust();
  var unfoldr = function (dict) {
    return dict.unfoldr;
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
    Unfoldable10: function () {
      return unfoldable1Array;
    },
  };

  // output/Data.Array/index.js
  var $$void3 = /* @__PURE__ */ $$void(functorST);
  var map1 = /* @__PURE__ */ map(functorArray);
  var map22 = /* @__PURE__ */ map(functorST);
  var fromJust4 = /* @__PURE__ */ fromJust();
  var when2 = /* @__PURE__ */ when(applicativeST);
  var notEq2 = /* @__PURE__ */ notEq(eqOrdering);
  var sortBy = function (comp) {
    return runFn3(sortByImpl)(comp)(function (v) {
      if (v instanceof GT) {
        return 1;
      }
      if (v instanceof EQ) {
        return 0;
      }
      if (v instanceof LT) {
        return -1 | 0;
      }
      throw new Error(
        'Failed pattern match at Data.Array (line 897, column 38 - line 900, column 11): ' +
          [v.constructor.name]
      );
    });
  };
  var sortWith = function (dictOrd) {
    var comparing2 = comparing(dictOrd);
    return function (f) {
      return sortBy(comparing2(f));
    };
  };
  var sortWith1 = /* @__PURE__ */ sortWith(ordInt);
  var singleton2 = function (a) {
    return [a];
  };
  var mapWithIndex2 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
  var index = /* @__PURE__ */ (function () {
    return runFn4(indexImpl)(Just.create)(Nothing.value);
  })();
  var last = function (xs) {
    return index(xs)((length(xs) - 1) | 0);
  };
  var head = function (xs) {
    return index(xs)(0);
  };
  var nubBy = function (comp) {
    return function (xs) {
      var indexedAndSorted = sortBy(function (x) {
        return function (y) {
          return comp(snd(x))(snd(y));
        };
      })(mapWithIndex2(Tuple.create)(xs));
      var v = head(indexedAndSorted);
      if (v instanceof Nothing) {
        return [];
      }
      if (v instanceof Just) {
        return map1(snd)(
          sortWith1(fst)(
            (function __do3() {
              var result = unsafeThaw(singleton2(v.value0))();
              foreach(indexedAndSorted)(function (v1) {
                return function __do4() {
                  var lst = map22(
                    /* @__PURE__ */ (function () {
                      var $183 = function ($185) {
                        return fromJust4(last($185));
                      };
                      return function ($184) {
                        return snd($183($184));
                      };
                    })()
                  )(unsafeFreeze(result))();
                  return when2(notEq2(comp(lst)(v1.value1))(EQ.value))($$void3(push(v1)(result)))();
                };
              })();
              return unsafeFreeze(result)();
            })()
          )
        );
      }
      throw new Error(
        'Failed pattern match at Data.Array (line 1115, column 17 - line 1123, column 28): ' +
          [v.constructor.name]
      );
    };
  };
  var nub = function (dictOrd) {
    return nubBy(compare(dictOrd));
  };
  var filter = /* @__PURE__ */ runFn2(filterImpl);
  var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
  var mapMaybe = function (f) {
    return concatMap(
      (function () {
        var $189 = maybe([])(singleton2);
        return function ($190) {
          return $189(f($190));
        };
      })()
    );
  };

  // output/Data.Nullable/foreign.js
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }

  // output/Data.Nullable/index.js
  var toMaybe = function (n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  function fromStringImpl(str, isFinite2, just, nothing) {
    var num = parseFloat(str);
    if (isFinite2(num)) {
      return just(num);
    } else {
      return nothing;
    }
  }

  // output/Data.Number/index.js
  var fromString = function (str) {
    return fromStringImpl(str, isFiniteImpl, Just.create, Nothing.value);
  };

  // output/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === 'function';
  var hasStringIterator =
    typeof Symbol !== 'undefined' &&
    Symbol != null &&
    typeof Symbol.iterator !== 'undefined' &&
    typeof String.prototype[Symbol.iterator] === 'function';
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === 'function';
  var hasCodePointAt = typeof String.prototype.codePointAt === 'function';
  var _unsafeCodePointAt0 = function (fallback) {
    return hasCodePointAt
      ? function (str) {
          return str.codePointAt(0);
        }
      : fallback;
  };
  var _toCodePointArray = function (fallback) {
    return function (unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function (str) {
          return Array.from(str, unsafeCodePointAt02);
        };
      }
      return fallback;
    };
  };

  // output/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output/Data.Enum/index.js
  var bottom1 = /* @__PURE__ */ bottom(boundedChar);
  var top1 = /* @__PURE__ */ top(boundedChar);
  var fromEnum = function (dict) {
    return dict.fromEnum;
  };
  var defaultSucc = function (toEnum$prime) {
    return function (fromEnum$prime) {
      return function (a) {
        return toEnum$prime((fromEnum$prime(a) + 1) | 0);
      };
    };
  };
  var defaultPred = function (toEnum$prime) {
    return function (fromEnum$prime) {
      return function (a) {
        return toEnum$prime((fromEnum$prime(a) - 1) | 0);
      };
    };
  };
  var charToEnum = function (v) {
    if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
      return new Just(fromCharCode(v));
    }
    return Nothing.value;
  };
  var enumChar = {
    succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
    pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
    Ord0: function () {
      return ordChar;
    },
  };
  var boundedEnumChar = /* @__PURE__ */ (function () {
    return {
      cardinality: (toCharCode(top1) - toCharCode(bottom1)) | 0,
      toEnum: charToEnum,
      fromEnum: toCharCode,
      Bounded0: function () {
        return boundedChar;
      },
      Enum1: function () {
        return enumChar;
      },
    };
  })();

  // output/Data.String.CodeUnits/foreign.js
  var length2 = function (s) {
    return s.length;
  };
  var drop = function (n) {
    return function (s) {
      return s.substring(n);
    };
  };

  // output/Data.String.Unsafe/foreign.js
  var charAt = function (i) {
    return function (s) {
      if (i >= 0 && i < s.length) return s.charAt(i);
      throw new Error('Data.String.Unsafe.charAt: Invalid index.');
    };
  };

  // output/Data.String.CodePoints/index.js
  var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
  var map4 = /* @__PURE__ */ map(functorMaybe);
  var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
  var unsurrogate = function (lead) {
    return function (trail) {
      return (((((((lead - 55296) | 0) * 1024) | 0) + ((trail - 56320) | 0)) | 0) + 65536) | 0;
    };
  };
  var isTrail = function (cu) {
    return 56320 <= cu && cu <= 57343;
  };
  var isLead = function (cu) {
    return 55296 <= cu && cu <= 56319;
  };
  var uncons = function (s) {
    var v = length2(s);
    if (v === 0) {
      return Nothing.value;
    }
    if (v === 1) {
      return new Just({
        head: fromEnum2(charAt(0)(s)),
        tail: '',
      });
    }
    var cu1 = fromEnum2(charAt(1)(s));
    var cu0 = fromEnum2(charAt(0)(s));
    var $43 = isLead(cu0) && isTrail(cu1);
    if ($43) {
      return new Just({
        head: unsurrogate(cu0)(cu1),
        tail: drop(2)(s),
      });
    }
    return new Just({
      head: cu0,
      tail: drop(1)(s),
    });
  };
  var unconsButWithTuple = function (s) {
    return map4(function (v) {
      return new Tuple(v.head, v.tail);
    })(uncons(s));
  };
  var toCodePointArrayFallback = function (s) {
    return unfoldr2(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function (s) {
    var cu0 = fromEnum2(charAt(0)(s));
    var $47 = isLead(cu0) && length2(s) > 1;
    if ($47) {
      var cu1 = fromEnum2(charAt(1)(s));
      var $48 = isTrail(cu1);
      if ($48) {
        return unsurrogate(cu0)(cu1);
      }
      return cu0;
    }
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray =
    /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var length3 = function ($74) {
    return length(toCodePointArray($74));
  };

  // output/Effect.Aff/foreign.js
  var Aff = (function () {
    var EMPTY = {};
    var PURE = 'Pure';
    var THROW = 'Throw';
    var CATCH = 'Catch';
    var SYNC = 'Sync';
    var ASYNC = 'Async';
    var BIND = 'Bind';
    var BRACKET = 'Bracket';
    var FORK = 'Fork';
    var SEQ = 'Sequential';
    var MAP = 'Map';
    var APPLY = 'Apply';
    var ALT = 'Alt';
    var CONS = 'Cons';
    var RESUME = 'Resume';
    var RELEASE = 'Release';
    var FINALIZER = 'Finalizer';
    var FINALIZED = 'Finalized';
    var FORKED = 'Forked';
    var FIBER = 'Fiber';
    var THUNK = 'Thunk';
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function (_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler(error3) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error3) {
        setTimeout(function () {
          throw error3;
        }, 0);
      }
    }
    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error3) {
        return left(error3);
      }
    }
    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error3) {
        k(left(error3))();
        return nonCanceler;
      }
    }
    var Scheduler = (function () {
      var limit = 1024;
      var size3 = 0;
      var ix = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size3 !== 0) {
          size3--;
          thunk = queue[ix];
          queue[ix] = void 0;
          ix = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }
      return {
        isDraining: function () {
          return draining;
        },
        enqueue: function (cb) {
          var i, tmp;
          if (size3 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix + size3) % limit] = cb;
          size3++;
          if (!draining) {
            drain();
          }
        },
      };
    })();
    function Supervisor(util) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function (fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function (result) {
              return function () {
                count--;
                delete fibers[fid];
              };
            },
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function () {
          return count === 0;
        },
        killAll: function (killError, cb) {
          return function () {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function (result) {
                return function () {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function () {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function (error3) {
              return new Aff2(SYNC, function () {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        },
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step2 = aff;
      var fail = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run3(localRunTick) {
        var tmp, result, attempt2;
        while (true) {
          tmp = null;
          result = null;
          attempt2 = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step2 = bhead(step2);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail = util.left(e);
                step2 = null;
              }
              break;
            case STEP_RESULT:
              if (util.isLeft(step2)) {
                status = RETURN;
                fail = step2;
                step2 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step2 = util.fromRight(step2);
              }
              break;
            case CONTINUE:
              switch (step2.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step2._2;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step2 = util.right(step2._1);
                  } else {
                    status = STEP_BIND;
                    step2 = step2._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step2 = runSync(util.left, util.right, step2._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step2 = runAsync(util.left, step2._1, function (result2) {
                    return function () {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function () {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step2 = result2;
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail = util.left(step2._1);
                  step2 = null;
                  break;
                // Enqueue the Catch so that we can call the error handler later on
                // in case of an exception.
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(
                      CONS,
                      step2,
                      new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt),
                      interrupt
                    );
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                // Enqueue the Bracket so that we can call the appropriate handlers
                // after resource acquisition.
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(
                      CONS,
                      step2,
                      new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt),
                      interrupt
                    );
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util, supervisor, step2._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step2._1) {
                    tmp.run();
                  }
                  step2 = util.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step2 = sequential2(util, supervisor, step2._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step2 = interrupt || fail || step2;
              } else {
                tmp = attempts._3;
                attempt2 = attempts._1;
                attempts = attempts._2;
                switch (attempt2.tag) {
                  // We cannot recover from an unmasked interrupt. Otherwise we should
                  // continue stepping, or run the exception handler if an exception
                  // was raised.
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail) {
                      status = CONTINUE;
                      step2 = attempt2._2(util.fromLeft(fail));
                      fail = null;
                    }
                    break;
                  // We cannot resume from an unmasked interrupt or exception.
                  case RESUME:
                    if ((interrupt && interrupt !== tmp && bracketCount === 0) || fail) {
                      status = RETURN;
                    } else {
                      bhead = attempt2._1;
                      btail = attempt2._2;
                      status = STEP_BIND;
                      step2 = util.fromRight(step2);
                    }
                    break;
                  // If we have a bracket, we should enqueue the handlers,
                  // and continue with the success branch only if the fiber has
                  // not been interrupted. If the bracket acquisition failed, we
                  // should not run either.
                  case BRACKET:
                    bracketCount--;
                    if (fail === null) {
                      result = util.fromRight(step2);
                      attempts = new Aff2(
                        CONS,
                        new Aff2(RELEASE, attempt2._2, result),
                        attempts,
                        tmp
                      );
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step2 = attempt2._3(result);
                      }
                    }
                    break;
                  // Enqueue the appropriate handler. We increase the bracket count
                  // because it should not be cancelled.
                  case RELEASE:
                    attempts = new Aff2(
                      CONS,
                      new Aff2(FINALIZED, step2, fail),
                      attempts,
                      interrupt
                    );
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step2 = attempt2._1.killed(util.fromLeft(interrupt))(attempt2._2);
                    } else if (fail) {
                      step2 = attempt2._1.failed(util.fromLeft(fail))(attempt2._2);
                    } else {
                      step2 = attempt2._1.completed(util.fromRight(step2))(attempt2._2);
                    }
                    fail = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(
                      CONS,
                      new Aff2(FINALIZED, step2, fail),
                      attempts,
                      interrupt
                    );
                    status = CONTINUE;
                    step2 = attempt2._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step2 = attempt2._1;
                    fail = attempt2._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step2));
                }
              }
              joins = null;
              if (interrupt && fail) {
                setTimeout(function () {
                  throw util.fromLeft(fail);
                }, 0);
              } else if (util.isLeft(step2) && rethrow) {
                setTimeout(function () {
                  if (rethrow) {
                    throw util.fromLeft(step2);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join3) {
        return function () {
          if (status === COMPLETED) {
            rethrow = rethrow && join3.rethrow;
            join3.handler(step2)();
            return function () {};
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join3;
          return function () {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill(error3, cb) {
        return function () {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function () {};
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function () {
              return cb(util.right(void 0));
            },
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util.left(error3);
              status = COMPLETED;
              step2 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(
                    CONS,
                    new Aff2(FINALIZER, step2(error3)),
                    attempts,
                    interrupt
                  );
                }
                status = RETURN;
                step2 = null;
                fail = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step2 = null;
                fail = null;
              }
          }
          return canceler;
        };
      }
      function join2(cb) {
        return function () {
          var canceler = onComplete({
            rethrow: false,
            handler: cb,
          })();
          if (status === SUSPENDED) {
            run3(runTick);
          }
          return canceler;
        };
      }
      return {
        kill,
        join: join2,
        onComplete,
        isSuspended: function () {
          return status === SUSPENDED;
        },
        run: function () {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function () {
                run3(runTick);
              });
            } else {
              run3(runTick);
            }
          }
        },
      };
    }
    function runPar(util, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error('[ParAff] Early exit');
      var interrupt = null;
      var root = EMPTY;
      function kill(error3, par2, cb2) {
        var step2 = par2;
        var head2 = null;
        var tail = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop: while (true) {
          tmp = null;
          switch (step2.tag) {
            case FORKED:
              if (step2._3 === EMPTY) {
                tmp = fibers[step2._1];
                kills2[count++] = tmp.kill(error3, function (result) {
                  return function () {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head2 === null) {
                break loop;
              }
              step2 = head2._2;
              if (tail === null) {
                head2 = null;
              } else {
                head2 = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step2 = step2._2;
              break;
            case APPLY:
            case ALT:
              if (head2) {
                tail = new Aff2(CONS, head2, tail);
              }
              head2 = step2;
              step2 = step2._1;
              break;
          }
        }
        if (count === 0) {
          cb2(util.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join2(result, head2, tail) {
        var fail, step2, lhs, rhs, tmp, kid;
        if (util.isLeft(result)) {
          fail = result;
          step2 = null;
        } else {
          step2 = result;
          fail = null;
        }
        loop: while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head2 === null) {
            cb(fail || step2)();
            return;
          }
          if (head2._3 !== EMPTY) {
            return;
          }
          switch (head2.tag) {
            case MAP:
              if (fail === null) {
                head2._3 = util.right(head2._1(util.fromRight(step2)));
                step2 = head2._3;
              } else {
                head2._3 = fail;
              }
              break;
            case APPLY:
              lhs = head2._1._3;
              rhs = head2._2._3;
              if (fail) {
                head2._3 = fail;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail === lhs ? head2._2 : head2._1, function () {
                  return function () {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join2(fail, null, null);
                    } else {
                      join2(fail, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step2 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head2._3 = step2;
              }
              break;
            case ALT:
              lhs = head2._1._3;
              rhs = head2._2._3;
              if ((lhs === EMPTY && util.isLeft(rhs)) || (rhs === EMPTY && util.isLeft(lhs))) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail = step2 === lhs ? rhs : lhs;
                step2 = null;
                head2._3 = fail;
              } else {
                head2._3 = step2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step2 === lhs ? head2._2 : head2._1, function () {
                  return function () {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join2(step2, null, null);
                    } else {
                      join2(step2, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head2 = null;
          } else {
            head2 = tail._1;
            tail = tail._2;
          }
        }
      }
      function resolve(fiber) {
        return function (result) {
          return function () {
            delete fibers[fiber._1];
            fiber._3 = result;
            join2(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step2 = par;
        var head2 = null;
        var tail = null;
        var tmp, fid;
        loop: while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step2.tag) {
                case MAP:
                  if (head2) {
                    tail = new Aff2(CONS, head2, tail);
                  }
                  head2 = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                  step2 = step2._2;
                  break;
                case APPLY:
                  if (head2) {
                    tail = new Aff2(CONS, head2, tail);
                  }
                  head2 = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                case ALT:
                  if (head2) {
                    tail = new Aff2(CONS, head2, tail);
                  }
                  head2 = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step2;
                  step2 = new Aff2(FORKED, fid, new Aff2(CONS, head2, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step2),
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head2 === null) {
                break loop;
              }
              if (head2._1 === EMPTY) {
                head2._1 = step2;
                status = CONTINUE;
                step2 = head2._2;
                head2._2 = EMPTY;
              } else {
                head2._2 = step2;
                step2 = head2;
                if (tail === null) {
                  head2 = null;
                } else {
                  head2 = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
        root = step2;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error3, cb2) {
        interrupt = util.left(error3);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill(error3, root, cb2);
        return function (killError) {
          return new Aff2(ASYNC, function (killCb) {
            return function () {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler;
            };
          });
        };
      }
      run3();
      return function (killError) {
        return new Aff2(ASYNC, function (killCb) {
          return function () {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential2(util, supervisor, par) {
      return new Aff2(ASYNC, function (cb) {
        return function () {
          return runPar(util, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler;
    return Aff2;
  })();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  var _liftEffect = Aff.Sync;
  var makeAff = Aff.Async;
  var _sequential = Aff.Seq;

  // output/Effect.Console/foreign.js
  var log2 = function (s) {
    return function () {
      console.log(s);
    };
  };

  // output/Web.DOM.Document/foreign.js
  var getEffProp = function (name15) {
    return function (doc) {
      return function () {
        return doc[name15];
      };
    };
  };
  var url = getEffProp('URL');
  var documentURI = getEffProp('documentURI');
  var origin = getEffProp('origin');
  var compatMode = getEffProp('compatMode');
  var characterSet = getEffProp('characterSet');
  var contentType = getEffProp('contentType');
  var _documentElement = getEffProp('documentElement');

  // output/Web.Internal.FFI/foreign.js
  function _unsafeReadProtoTagged(nothing, just, name15, value12) {
    if (typeof window !== 'undefined') {
      var ty = window[name15];
      if (ty != null && value12 instanceof ty) {
        return just(value12);
      }
    }
    var obj = value12;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name15) {
        return just(value12);
      } else if (constructorName === 'Object') {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = function (name15) {
    return function (value12) {
      return _unsafeReadProtoTagged(Nothing.value, Just.create, name15, value12);
    };
  };

  // output/Web.DOM.Document/index.js
  var toParentNode = unsafeCoerce2;

  // output/Web.DOM.Element/foreign.js
  var getProp = function (name15) {
    return function (doctype) {
      return doctype[name15];
    };
  };
  var _namespaceURI = getProp('namespaceURI');
  var _prefix = getProp('prefix');
  var localName = getProp('localName');
  var tagName = getProp('tagName');
  function setAttribute(name15) {
    return function (value12) {
      return function (element) {
        return function () {
          element.setAttribute(name15, value12);
        };
      };
    };
  }
  function _getAttribute(name15) {
    return function (element) {
      return function () {
        return element.getAttribute(name15);
      };
    };
  }

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp2 = function (name15) {
    return function (node) {
      return function () {
        return node[name15];
      };
    };
  };
  var children = getEffProp2('children');
  var _firstElementChild = getEffProp2('firstElementChild');
  var _lastElementChild = getEffProp2('lastElementChild');
  var childElementCount = getEffProp2('childElementCount');
  function querySelectorAll(selector) {
    return function (node) {
      return function () {
        return node.querySelectorAll(selector);
      };
    };
  }

  // output/Web.DOM.Element/index.js
  var map5 = /* @__PURE__ */ map(functorEffect);
  var toNode = unsafeCoerce2;
  var toEventTarget = unsafeCoerce2;
  var getAttribute = function (attr) {
    var $6 = map5(toMaybe);
    var $7 = _getAttribute(attr);
    return function ($8) {
      return $6($7($8));
    };
  };
  var fromNode = /* @__PURE__ */ unsafeReadProtoTagged('Element');

  // output/Web.DOM.NodeList/foreign.js
  function toArray(list) {
    return function () {
      return [].slice.call(list);
    };
  }

  // output/Web.DOM.NonElementParentNode/foreign.js
  function _getElementById(id2) {
    return function (node) {
      return function () {
        return node.getElementById(id2);
      };
    };
  }

  // output/Web.DOM.NonElementParentNode/index.js
  var map6 = /* @__PURE__ */ map(functorEffect);
  var getElementById = function (eid) {
    var $2 = map6(toMaybe);
    var $3 = _getElementById(eid);
    return function ($4) {
      return $2($3($4));
    };
  };

  // output/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function () {
      return function (event) {
        return fn(event)();
      };
    };
  }
  function addEventListener(type) {
    return function (listener) {
      return function (useCapture) {
        return function (target5) {
          return function () {
            return target5.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output/Web.HTML/foreign.js
  var windowImpl = function () {
    return window;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var toNonElementParentNode = unsafeCoerce2;
  var toDocument = unsafeCoerce2;

  // output/Web.HTML.HTMLInputElement/foreign.js
  function checked(input) {
    return function () {
      return input.checked;
    };
  }
  function value3(input) {
    return function () {
      return input.value;
    };
  }

  // output/Web.HTML.HTMLInputElement/index.js
  var fromElement = /* @__PURE__ */ unsafeReadProtoTagged('HTMLInputElement');

  // output/Web.HTML.Window/foreign.js
  function document2(window2) {
    return function () {
      return window2.document;
    };
  }

  // output/Main/index.js
  var discard2 = /* @__PURE__ */ discard(discardUnit);
  var discard1 = /* @__PURE__ */ discard2(bindEither);
  var pure2 = /* @__PURE__ */ pure(applicativeEither);
  var bind2 = /* @__PURE__ */ bind(bindEither);
  var eq3 = /* @__PURE__ */ eq(/* @__PURE__ */ eqArray(eqNumber));
  var pure1 = /* @__PURE__ */ pure(applicativeEffect);
  var show2 = /* @__PURE__ */ show(showInt);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
  var bind22 = /* @__PURE__ */ bind(bindMaybe);
  var show1 = /* @__PURE__ */ show(showNumber);
  var $$void4 = /* @__PURE__ */ $$void(functorEffect);
  var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindEffect);
  var nub2 = /* @__PURE__ */ nub(ordNumber);
  var append1 = /* @__PURE__ */ append(semigroupArray);
  var showRecord2 = /* @__PURE__ */ showRecord()();
  var showRecordFieldsCons2 = /* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function () {
      return 'r';
    },
  });
  var showRecordFieldsCons1 = /* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function () {
      return 'x';
    },
  });
  var showRecordFieldsConsNil2 = /* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function () {
      return 'y';
    },
  });
  var showArray2 = /* @__PURE__ */ showArray(showNumber);
  var show22 = /* @__PURE__ */ show(
    /* @__PURE__ */ showRecord2(
      /* @__PURE__ */ showRecordFieldsCons2(
        /* @__PURE__ */ showRecordFieldsCons1(
          /* @__PURE__ */ showRecordFieldsConsNil2(/* @__PURE__ */ showMaybe(showNumber))
        )(showNumber)
      )(showArray2)
    )
  );
  var show3 = /* @__PURE__ */ show(
    /* @__PURE__ */ showRecord2(
      /* @__PURE__ */ showRecordFieldsCons2(
        /* @__PURE__ */ showRecordFieldsCons1(/* @__PURE__ */ showRecordFieldsConsNil2(showNumber))(
          showNumber
        )
      )(showArray2)
    )
  );
  var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableArray);
  var validateState = function (state3) {
    return discard1(
      (function () {
        var $70 = state3.x < -5 || state3.x > 3;
        if ($70) {
          return new Left(
            'X \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435 \u043E\u0442 -5 \u0434\u043E 3'
          );
        }
        return pure2(unit);
      })()
    )(function () {
      return bind2(
        (function () {
          if (state3.y instanceof Just) {
            return new Right(state3.y.value0);
          }
          if (state3.y instanceof Nothing) {
            return new Left(
              '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 Y'
            );
          }
          throw new Error(
            'Failed pattern match at Main (line 253, column 8 - line 255, column 42): ' +
              [state3.y.constructor.name]
          );
        })()
      )(function (y) {
        return discard1(
          (function () {
            var $73 = eq3(state3.r)([]);
            if ($73) {
              return new Left(
                '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 R'
              );
            }
            return pure2(unit);
          })()
        )(function () {
          return new Right({
            x: state3.x,
            y,
            r: state3.r,
          });
        });
      });
    });
  };
  var textContent = function (node) {
    return function __do3() {
      var content3 = _textContent(node)();
      return fromMaybe('')(content3);
    };
  };
  var safeRestoreHistory = function (json) {
    return function __do3() {
      var count = safeParseAndDisplay(json)();
      var $76 = count > 0;
      if ($76) {
        return log2(
          '\u2705 \u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E ' +
            (show2(count) + ' \u0437\u0430\u043F\u0438\u0441\u0435\u0439')
        )();
      }
      return log2(
        '\u274C \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E'
      )();
    };
  };
  var restoreHistory = function __do() {
    log2(
      'PureScript: \u0412\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u043C \u0438\u0441\u0442\u043E\u0440\u0438\u044E...'
    )();
    var resultsJson = getItem('results')();
    var v = toMaybe(resultsJson);
    if (v instanceof Nothing) {
      return log2(
        '\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430'
      )();
    }
    if (v instanceof Just) {
      log2(
        '\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u044B \u0434\u0430\u043D\u043D\u044B\u0435 \u0438\u0437 localStorage, \u0434\u043B\u0438\u043D\u0430: ' +
          (show2(length3(v.value0)) + ' chars')
      )();
      return safeRestoreHistory(v.value0)();
    }
    throw new Error(
      'Failed pattern match at Main (line 172, column 3 - line 178, column 30): ' +
        [v.constructor.name]
    );
  };
  var parseNumber = function (str) {
    return fromString(str);
  };
  var initYButtons = function (appStateRef) {
    return function (doc) {
      return function __do3() {
        var nodeList = querySelectorAll('.y-btn')(toParentNode(doc))();
        var nodes = toArray(nodeList)();
        var buttons = mapMaybe(fromNode)(nodes);
        log2(
          '\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043A\u043D\u043E\u043F\u043E\u043A Y: ' +
            show2(length(buttons))
        )();
        return traverse_2(function (btnElement) {
          return function __do4() {
            var listener = eventListener(function (v) {
              return function __do5() {
                var allButtons = querySelectorAll('.y-btn')(toParentNode(doc))();
                var allButtonsNodes = toArray(allButtons)();
                var allButtonsElements = mapMaybe(fromNode)(allButtonsNodes);
                traverse_2(function (b) {
                  return function __do6() {
                    setAttribute('style')('')(b)();
                    return setAttribute('active')('false')(b)();
                  };
                })(allButtonsElements)();
                setAttribute('style')('background-color: #3498db; color: white;')(btnElement)();
                setAttribute('active')('true')(btnElement)();
                var maybeVal = getAttribute('data-value')(btnElement)();
                var v1 = bind22(maybeVal)(parseNumber);
                if (v1 instanceof Nothing) {
                  var btnText = textContent(toNode(btnElement))();
                  var v2 = parseNumber(btnText);
                  if (v2 instanceof Nothing) {
                    return log2(
                      '\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 Y: ' +
                        btnText
                    )();
                  }
                  if (v2 instanceof Just) {
                    modify_(function (v3) {
                      return {
                        r: v3.r,
                        x: v3.x,
                        y: new Just(v2.value0),
                      };
                    })(appStateRef)();
                    return log2('Selected Y = ' + show1(v2.value0))();
                  }
                  throw new Error(
                    'Failed pattern match at Main (line 118, column 11 - line 122, column 49): ' +
                      [v2.constructor.name]
                  );
                }
                if (v1 instanceof Just) {
                  modify_(function (v22) {
                    return {
                      r: v22.r,
                      x: v22.x,
                      y: new Just(v1.value0),
                    };
                  })(appStateRef)();
                  return log2('Selected Y = ' + show1(v1.value0))();
                }
                throw new Error(
                  'Failed pattern match at Main (line 115, column 7 - line 125, column 45): ' +
                    [v1.constructor.name]
                );
              };
            })();
            return $$void4(addEventListener('click')(listener)(false)(toEventTarget(btnElement)))();
          };
        })(buttons)();
      };
    };
  };
  var initXInput = function (appStateRef) {
    return function __do3() {
      var htmlDoc = bindFlipped2(document2)(windowImpl)();
      var maybeElement = getElementById('x')(toNonElementParentNode(htmlDoc))();
      if (maybeElement instanceof Nothing) {
        return log2('x input not found')();
      }
      if (maybeElement instanceof Just) {
        var maybeHtmlInput = fromElement(maybeElement.value0);
        if (maybeHtmlInput instanceof Nothing) {
          return log2('x is not input')();
        }
        if (maybeHtmlInput instanceof Just) {
          var listener = eventListener(function (v) {
            return function __do4() {
              var val = value3(maybeHtmlInput.value0)();
              var parsed = fromMaybe(0)(parseNumber(val));
              return modify_(function (v1) {
                return {
                  r: v1.r,
                  y: v1.y,
                  x: parsed,
                };
              })(appStateRef)();
            };
          })();
          return $$void4(
            addEventListener('input')(listener)(false)(toEventTarget(maybeElement.value0))
          )();
        }
        throw new Error(
          'Failed pattern match at Main (line 81, column 7 - line 88, column 93): ' +
            [maybeHtmlInput.constructor.name]
        );
      }
      throw new Error(
        'Failed pattern match at Main (line 77, column 3 - line 88, column 93): ' +
          [maybeElement.constructor.name]
      );
    };
  };
  var initRCheckboxes = function (appStateRef) {
    return function (doc) {
      return function __do3() {
        var nodeList = querySelectorAll('input[name="r"]')(toParentNode(doc))();
        var nodes = toArray(nodeList)();
        var checkboxes = mapMaybe(fromNode)(nodes);
        log2(
          '\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0447\u0435\u043A\u0431\u043E\u043A\u0441\u043E\u0432 R: ' +
            show2(length(checkboxes))
        )();
        return traverse_2(function (cbElement) {
          var maybeHtmlInput = fromElement(cbElement);
          if (maybeHtmlInput instanceof Nothing) {
            return pure1(unit);
          }
          if (maybeHtmlInput instanceof Just) {
            return function __do4() {
              var listener = eventListener(function (v) {
                return function __do5() {
                  var isChecked = checked(maybeHtmlInput.value0)();
                  var maybeVal = getAttribute('value')(cbElement)();
                  var v1 = bind22(maybeVal)(parseNumber);
                  if (v1 instanceof Nothing) {
                    return unit;
                  }
                  if (v1 instanceof Just) {
                    return modify_(function (st) {
                      var newR = (function () {
                        if (isChecked) {
                          return nub2(append1(st.r)([v1.value0]));
                        }
                        return filter(function (v2) {
                          return v2 !== v1.value0;
                        })(st.r);
                      })();
                      return {
                        x: st.x,
                        y: st.y,
                        r: newR,
                      };
                    })(appStateRef)();
                  }
                  throw new Error(
                    'Failed pattern match at Main (line 145, column 11 - line 153, column 28): ' +
                      [v1.constructor.name]
                  );
                };
              })();
              return $$void4(
                addEventListener('change')(listener)(false)(toEventTarget(cbElement))
              )();
            };
          }
          throw new Error(
            'Failed pattern match at Main (line 139, column 5 - line 154, column 94): ' +
              [maybeHtmlInput.constructor.name]
          );
        })(checkboxes)();
      };
    };
  };
  var initFormSubmit = function (appStateRef) {
    return function __do3() {
      var htmlDoc = bindFlipped2(document2)(windowImpl)();
      var maybeForm = getElementById('point-form')(toNonElementParentNode(htmlDoc))();
      if (maybeForm instanceof Nothing) {
        return log2('Form not found')();
      }
      if (maybeForm instanceof Just) {
        var listener = eventListener(function (e) {
          return function __do4() {
            preventDefault(e)();
            var state3 = read(appStateRef)();
            log2(
              '\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0434 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0435\u0439: ' +
                show22(state3)
            )();
            var v = validateState(state3);
            if (v instanceof Left) {
              log2(
                '\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438: ' +
                  v.value0
              )();
              return alert(v.value0)();
            }
            if (v instanceof Right) {
              log2(
                '\u0412\u0430\u043B\u0438\u0434\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435: ' +
                  show3(v.value0)
              )();
              return for_2(v.value0.r)(function (rVal) {
                return function __do5() {
                  processRequestJS(v.value0.x)(v.value0.y)(rVal)();
                  return log2(
                    '\u0412\u044B\u0437\u0432\u0430\u043D processRequestJS \u0441 R=' + show1(rVal)
                  )();
                };
              })();
            }
            throw new Error(
              'Failed pattern match at Main (line 202, column 9 - line 212, column 64): ' +
                [v.constructor.name]
            );
          };
        })();
        return $$void4(
          addEventListener('submit')(listener)(false)(toEventTarget(maybeForm.value0))
        )();
      }
      throw new Error(
        'Failed pattern match at Main (line 194, column 3 - line 219, column 87): ' +
          [maybeForm.constructor.name]
      );
    };
  };
  var main = function __do2() {
    log2('Starting PureScript app...')();
    var htmlDoc = bindFlipped2(document2)(windowImpl)();
    var doc = toDocument(htmlDoc);
    var appStateRef = $$new({
      x: 0,
      y: Nothing.value,
      r: [],
    })();
    restoreHistory();
    initXInput(appStateRef)();
    initYButtons(appStateRef)(doc)();
    initRCheckboxes(appStateRef)(doc)();
    initFormSubmit(appStateRef)();
    return log2('Initialization complete.')();
  };

  // <stdin>
  main();
})();
