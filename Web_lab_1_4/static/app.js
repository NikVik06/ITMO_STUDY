(function () {
  'use strict';

  // ES модули для PureScript
  const alert$1 = function (message) {
    return function () {
      window.alert(message);
    };
  };

  const preventDefault = function (event) {
    return function () {
      event.preventDefault();
    };
  };

  const _textContent = function (node) {
    return function () {
      return node.textContent !== null
        ? { tag: 'Just', value: node.textContent }
        : { tag: 'Nothing' };
    };
  };

  const processRequestJS = function (x) {
    return function (y) {
      return function (r) {
        return function () {
          console.log('PureScript вызывает processRequest с:', x, y, r);
          // Вызываем вашу оригинальную функцию
          processRequest(x, y, r);
        };
      };
    };
  };

  const displayResultInTable = function (x) {
    return function (y) {
      return function (r) {
        return function (result) {
          return function (time) {
            return function (execTime) {
              return function () {
                console.log(x, y, r, result);

                const noResults = document.querySelector('.no-results');
                if (noResults) {
                  noResults.remove();
                }

                const resultsBody = document.getElementById('results-body');
                if (!resultsBody) {
                  console.error('results-body не найден!');
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
                rowTime.innerText = time;
                rowExecTime.innerText = execTime;
                rowResult.innerText = result.toString();

                newRow.className = result === true ? 'hit' : 'miss';
              };
            };
          };
        };
      };
    };
  };

  const processRequestWithResult = function (x) {
    return function (y) {
      return function (r) {
        return function (onError, onSuccess) {
          console.log('PureScript.processRequestWithResult: Начало для', x, y, r);

          processRequest(x, y, r)
            .then(resultData => {
              console.log('PureScript.processRequestWithResult: Получены данные:', resultData);
              onSuccess(resultData)();
            })
            .catch(error => {
              console.error('PureScript.processRequestWithResult: Ошибка:', error);
              onError(error.toString())();
            });

          return function (cancelError, cancelerError, cancelerSuccess) {
            console.log('processRequestWithResult: Отмена');
            cancelerSuccess();
          };
        };
      };
    };
  };

  window.processRequestWithResult = processRequestWithResult;

  const getItem = function (key) {
    return function () {
      return localStorage.getItem(key);
    };
  };

  const setItem = function (key) {
    return function (value) {
      return function () {
        localStorage.setItem(key, value);
      };
    };
  };

  const clearStorage = function () {
    return function () {
      localStorage.clear();
    };
  };

  const stringify = function (results) {
    try {
      const simplified = results.map(item => ({
        x: item.x,
        y: item.y,
        r: item.r,
        result: item.result,
        time: item.time,
        execTime: item.execTime,
      }));
      return JSON.stringify(simplified);
    } catch (e) {
      console.error('stringify: Ошибка:', e);
      return '[]';
    }
  };

  const parseResults = function (json) {
    try {
      console.log('parseResults: Парсим JSON, длина:', json.length);
      const parsed = JSON.parse(json);

      if (Array.isArray(parsed)) {
        console.log('parseResults: Это массив, элементов:', parsed.length);

        const results = [];

        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];

          try {
            const x = safeParseNumber(item.x, 'x', i);
            const y = safeParseNumber(item.y, 'y', i);
            const r = safeParseNumber(item.r, 'r', i);

            // Обработка result
            let result = false;
            if (typeof item.result === 'boolean') {
              result = item.result;
            } else if (typeof item.result === 'string') {
              result = item.result === 'true' || item.result === '1';
            } else if (item.result !== undefined) {
              console.warn(
                ` Неизвестный тип result в элементе ${i}:`,
                typeof item.result,
                item.result
              );
            }

            const time = item.time || 'N/A';
            const execTime = item.execTime || 'N/A';

            results.push({
              x: x,
              y: y,
              r: r,
              result: result,
              time: time,
              execTime: execTime,
            });
          } catch (itemError) {
            console.error(` Ошибка парсинга элемента ${i}:`, itemError, item);
          }
        }

        console.log('parseResults: Успешно обработано', results.length, 'записей из', parsed.length);
        return {
          tag: 'Just',
          value: results,
        };
      } else {
        console.error('parseResults: Это не массив:', typeof parsed);
      }
    } catch (e) {
      console.error('parseResults: Ошибка парсинга JSON:', e);
    }
    return { tag: 'Nothing' };
  };

  function safeParseNumber(value, fieldName, index) {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    console.warn(`Проблема с полем ${fieldName} в элементе ${index}:`, value);
    return 0;
  }

  const safeParseAndDisplay = function (json) {
    return function () {
      try {
        console.log('Парсинг и отображение...');
        const parsed = JSON.parse(json);

        if (!Array.isArray(parsed)) {
          console.error('Данные не являются массивом');
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
            const time = safeString(item.time);
            const execTime = safeString(item.execTime);
            displayResultInTable(x)(y)(r)(result)(time)(execTime)();
            successCount++;
          } catch (itemError) {
            console.error(`Ошибка в элементе ${i}:`, itemError);
          }
        }

        return successCount;
      } catch (e) {
        console.error('Парсинг не удался:', e);
        return 0;
      }
    };
  };

  function safeNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  }

  function safeBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true' || value === '1';
    return false;
  }

  function safeString(value) {
    if (typeof value === 'string') return value;
    return 'N/A';
  }

  const arrayApply = function (fs) {
    return function (xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l*k);
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

  // Generated by purs version 0.15.15
  var semigroupoidFn = {
      compose: function (f) {
          return function (g) {
              return function (x) {
                  return f(g(x));
              };
          };
      }
  };
  var compose = function (dict) {
      return dict.compose;
  };
  var composeFlipped = function (dictSemigroupoid) {
      var compose1 = compose(dictSemigroupoid);
      return function (f) {
          return function (g) {
              return compose1(g)(f);
          };
      };
  };

  // Generated by purs version 0.15.15
  var identity$9 = function (dict) {
      return dict.identity;
  };
  var categoryFn = {
      identity: function (x) {
          return x;
      },
      Semigroupoid0: function () {
          return semigroupoidFn;
      }
  };

  // Generated by purs version 0.15.15
  var otherwise = true;

  // Generated by purs version 0.15.15
  var on = function (f) {
      return function (g) {
          return function (x) {
              return function (y) {
                  return f(g(x))(g(y));
              };
          };
      };
  };
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
  var applyN = function (f) {
      var go = function ($copy_n) {
          return function ($copy_acc) {
              var $tco_var_n = $copy_n;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(n, acc) {
                  if (n <= 0) {
                      $tco_done = true;
                      return acc;
                  };
                  if (otherwise) {
                      $tco_var_n = n - 1 | 0;
                      $copy_acc = f(acc);
                      return;
                  };
                  throw new Error("Failed pattern match at Data.Function (line 107, column 3 - line 109, column 37): " + [ n.constructor.name, acc.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_n, $copy_acc);
              };
              return $tco_result;
          };
      };
      return go;
  };
  var applyFlipped = function (x) {
      return function (f) {
          return f(x);
      };
  };
  var apply$5 = function (f) {
      return function (x) {
          return f(x);
      };
  };

  const arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  const unit = undefined;

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var $$Proxy = /* #__PURE__ */ (function () {
      function $$Proxy() {

      };
      $$Proxy.value = new $$Proxy();
      return $$Proxy;
  })();

  // Generated by purs version 0.15.15
  var map$o = function (dict) {
      return dict.map;
  };
  var mapFlipped = function (dictFunctor) {
      var map1 = map$o(dictFunctor);
      return function (fa) {
          return function (f) {
              return map1(f)(fa);
          };
      };
  };
  var $$void$5 = function (dictFunctor) {
      return map$o(dictFunctor)($$const(unit));
  };
  var voidLeft$1 = function (dictFunctor) {
      var map1 = map$o(dictFunctor);
      return function (f) {
          return function (x) {
              return map1($$const(x))(f);
          };
      };
  };
  var voidRight = function (dictFunctor) {
      var map1 = map$o(dictFunctor);
      return function (x) {
          return map1($$const(x));
      };
  };
  var functorProxy = {
      map: function (v) {
          return function (v1) {
              return $$Proxy.value;
          };
      }
  };
  var functorFn = {
      map: /* #__PURE__ */ compose(semigroupoidFn)
  };
  var functorArray = {
      map: arrayMap
  };
  var flap = function (dictFunctor) {
      var map1 = map$o(dictFunctor);
      return function (ff) {
          return function (x) {
              return map1(function (f) {
                  return f(x);
              })(ff);
          };
      };
  };

  // Generated by purs version 0.15.15
  var identity$8 = /* #__PURE__ */ identity$9(categoryFn);
  var applyProxy = {
      apply: function (v) {
          return function (v1) {
              return $$Proxy.value;
          };
      },
      Functor0: function () {
          return functorProxy;
      }
  };
  var applyFn = {
      apply: function (f) {
          return function (g) {
              return function (x) {
                  return f(x)(g(x));
              };
          };
      },
      Functor0: function () {
          return functorFn;
      }
  };
  var applyArray = {
      apply: arrayApply,
      Functor0: function () {
          return functorArray;
      }
  };
  var apply$4 = function (dict) {
      return dict.apply;
  };
  var applyFirst$1 = function (dictApply) {
      var apply1 = apply$4(dictApply);
      var map = map$o(dictApply.Functor0());
      return function (a) {
          return function (b) {
              return apply1(map($$const)(a))(b);
          };
      };
  };
  var applySecond = function (dictApply) {
      var apply1 = apply$4(dictApply);
      var map = map$o(dictApply.Functor0());
      return function (a) {
          return function (b) {
              return apply1(map($$const(identity$8))(a))(b);
          };
      };
  };
  var lift2$2 = function (dictApply) {
      var apply1 = apply$4(dictApply);
      var map = map$o(dictApply.Functor0());
      return function (f) {
          return function (a) {
              return function (b) {
                  return apply1(map(f)(a))(b);
              };
          };
      };
  };
  var lift3 = function (dictApply) {
      var apply1 = apply$4(dictApply);
      var map = map$o(dictApply.Functor0());
      return function (f) {
          return function (a) {
              return function (b) {
                  return function (c) {
                      return apply1(apply1(map(f)(a))(b))(c);
                  };
              };
          };
      };
  };
  var lift4 = function (dictApply) {
      var apply1 = apply$4(dictApply);
      var map = map$o(dictApply.Functor0());
      return function (f) {
          return function (a) {
              return function (b) {
                  return function (c) {
                      return function (d) {
                          return apply1(apply1(apply1(map(f)(a))(b))(c))(d);
                      };
                  };
              };
          };
      };
  };
  var lift5 = function (dictApply) {
      var apply1 = apply$4(dictApply);
      var map = map$o(dictApply.Functor0());
      return function (f) {
          return function (a) {
              return function (b) {
                  return function (c) {
                      return function (d) {
                          return function (e) {
                              return apply1(apply1(apply1(apply1(map(f)(a))(b))(c))(d))(e);
                          };
                      };
                  };
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var pure$2 = function (dict) {
      return dict.pure;
  };
  var unless = function (dictApplicative) {
      var pure1 = pure$2(dictApplicative);
      return function (v) {
          return function (v1) {
              if (!v) {
                  return v1;
              };
              if (v) {
                  return pure1(unit);
              };
              throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
  };
  var when$1 = function (dictApplicative) {
      var pure1 = pure$2(dictApplicative);
      return function (v) {
          return function (v1) {
              if (v) {
                  return v1;
              };
              if (!v) {
                  return pure1(unit);
              };
              throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
  };
  var liftA1 = function (dictApplicative) {
      var apply = apply$4(dictApplicative.Apply0());
      var pure1 = pure$2(dictApplicative);
      return function (f) {
          return function (a) {
              return apply(pure1(f))(a);
          };
      };
  };
  var applicativeProxy = {
      pure: function (v) {
          return $$Proxy.value;
      },
      Apply0: function () {
          return applyProxy;
      }
  };
  var applicativeFn = {
      pure: function (x) {
          return function (v) {
              return x;
          };
      },
      Apply0: function () {
          return applyFn;
      }
  };
  var applicativeArray = {
      pure: function (x) {
          return [ x ];
      },
      Apply0: function () {
          return applyArray;
      }
  };

  const arrayBind =
    typeof Array.prototype.flatMap === "function"
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

  // Generated by purs version 0.15.15
  var identity$7 = /* #__PURE__ */ identity$9(categoryFn);
  var discard$2 = function (dict) {
      return dict.discard;
  };
  var bindProxy = {
      bind: function (v) {
          return function (v1) {
              return $$Proxy.value;
          };
      },
      Apply0: function () {
          return applyProxy;
      }
  };
  var bindFn = {
      bind: function (m) {
          return function (f) {
              return function (x) {
                  return f(m(x))(x);
              };
          };
      },
      Apply0: function () {
          return applyFn;
      }
  };
  var bindArray = {
      bind: arrayBind,
      Apply0: function () {
          return applyArray;
      }
  };
  var bind$4 = function (dict) {
      return dict.bind;
  };
  var bindFlipped$3 = function (dictBind) {
      return flip(bind$4(dictBind));
  };
  var composeKleisliFlipped = function (dictBind) {
      var bindFlipped1 = bindFlipped$3(dictBind);
      return function (f) {
          return function (g) {
              return function (a) {
                  return bindFlipped1(f)(g(a));
              };
          };
      };
  };
  var composeKleisli = function (dictBind) {
      var bind1 = bind$4(dictBind);
      return function (f) {
          return function (g) {
              return function (a) {
                  return bind1(f(a))(g);
              };
          };
      };
  };
  var discardProxy = {
      discard: function (dictBind) {
          return bind$4(dictBind);
      }
  };
  var discardUnit = {
      discard: function (dictBind) {
          return bind$4(dictBind);
      }
  };
  var ifM = function (dictBind) {
      var bind1 = bind$4(dictBind);
      return function (cond) {
          return function (t) {
              return function (f) {
                  return bind1(cond)(function (cond$prime) {
                      if (cond$prime) {
                          return t;
                      };
                      return f;
                  });
              };
          };
      };
  };
  var join = function (dictBind) {
      var bind1 = bind$4(dictBind);
      return function (m) {
          return bind1(m)(identity$7);
      };
  };

  //------------------------------------------------------------------------------
  // Array creation --------------------------------------------------------------
  //------------------------------------------------------------------------------

  const rangeImpl = function (start, end) {
    var step = start > end ? -1 : 1;
    var result = new Array(step * (end - start) + 1);
    var i = start, n = 0;
    while (i !== end) {
      result[n++] = i;
      i += step;
    }
    result[n] = i;
    return result;
  };

  var replicateFill = function (count, value) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value);
  };

  var replicatePolyfill = function (count, value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };

  // In browsers that have Array.prototype.fill we use it, as it's faster.
  const replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;

  const fromFoldableImpl = (function () {
    function Cons(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    var emptyList = {};

    function curryCons(head) {
      return function (tail) {
        return new Cons(head, tail);
      };
    }

    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }

    return function (foldr, xs) {
      return listToArray(foldr(curryCons)(emptyList)(xs));
    };
  })();

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const length$7 = function (xs) {
    return xs.length;
  };

  //------------------------------------------------------------------------------
  // Non-indexed reads -----------------------------------------------------------
  //------------------------------------------------------------------------------

  const unconsImpl = function (empty, next, xs) {
    return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
  };

  //------------------------------------------------------------------------------
  // Indexed operations ----------------------------------------------------------
  //------------------------------------------------------------------------------

  const indexImpl = function (just, nothing, xs, i) {
    return i < 0 || i >= xs.length ? nothing :  just(xs[i]);
  };

  const findMapImpl = function (nothing, isJust, f, xs) {
    for (var i = 0; i < xs.length; i++) {
      var result = f(xs[i]);
      if (isJust(result)) return result;
    }
    return nothing;
  };

  const findIndexImpl = function (just, nothing, f, xs) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (f(xs[i])) return just(i);
    }
    return nothing;
  };

  const findLastIndexImpl = function (just, nothing, f, xs) {
    for (var i = xs.length - 1; i >= 0; i--) {
      if (f(xs[i])) return just(i);
    }
    return nothing;
  };

  const _insertAt = function (just, nothing, i, a, l) {
    if (i < 0 || i > l.length) return nothing;
    var l1 = l.slice();
    l1.splice(i, 0, a);
    return just(l1);
  };

  const _deleteAt = function (just, nothing, i, l) {
    if (i < 0 || i >= l.length) return nothing;
    var l1 = l.slice();
    l1.splice(i, 1);
    return just(l1);
  };

  const _updateAt = function (just, nothing, i, a, l) {
    if (i < 0 || i >= l.length) return nothing;
    var l1 = l.slice();
    l1[i] = a;
    return just(l1);
  };

  //------------------------------------------------------------------------------
  // Transformations -------------------------------------------------------------
  //------------------------------------------------------------------------------

  const reverse = function (l) {
    return l.slice().reverse();
  };

  const concat = function (xss) {
    if (xss.length <= 10000) {
      // This method is faster, but it crashes on big arrays.
      // So we use it when can and fallback to simple variant otherwise.
      return Array.prototype.concat.apply([], xss);
    }

    var result = [];
    for (var i = 0, l = xss.length; i < l; i++) {
      var xs = xss[i];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };

  const filterImpl = function (f, xs) {
    return xs.filter(f);
  };

  const partitionImpl = function (f, xs) {
    var yes = [];
    var no  = [];
    for (var i = 0; i < xs.length; i++) {
      var x = xs[i];
      if (f(x))
        yes.push(x);
      else
        no.push(x);
    }
    return { yes: yes, no: no };
  };

  const scanlImpl = function (f, b, xs) {
    var len = xs.length;
    var acc = b;
    var out = new Array(len);
    for (var i = 0; i < len; i++) {
      acc = f(acc)(xs[i]);
      out[i] = acc;
    }
    return out;
  };

  const scanrImpl = function (f, b, xs) {
    var len = xs.length;
    var acc = b;
    var out = new Array(len);
    for (var i = len - 1; i >= 0; i--) {
      acc = f(xs[i])(acc);
      out[i] = acc;
    }
    return out;
  };

  //------------------------------------------------------------------------------
  // Sorting ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const sortByImpl$1 = (function () {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i;
      var j;
      var k;
      var x;
      var y;
      var c;

      mid = from + ((to - from) >> 1);
      if (mid - from > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);

      i = from;
      j = mid;
      k = from;
      while (i < mid && j < to) {
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        }
        else {
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

    return function (compare, fromOrdering, xs) {
      var out;

      if (xs.length < 2) return xs;

      out = xs.slice(0);
      mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);

      return out;
    };
  })();

  //------------------------------------------------------------------------------
  // Subarrays -------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const sliceImpl = function (s, e, l) {
    return l.slice(s, e);
  };

  //------------------------------------------------------------------------------
  // Zipping ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const zipWithImpl = function (f, xs, ys) {
    var l = xs.length < ys.length ? xs.length : ys.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(xs[i])(ys[i]);
    }
    return result;
  };

  //------------------------------------------------------------------------------
  // Folding ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const anyImpl = function (p, xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      if (p(xs[i])) return true;
    }
    return false;
  };

  const allImpl = function (p, xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      if (!p(xs[i])) return false;
    }
    return true;
  };

  //------------------------------------------------------------------------------
  // Partial ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const unsafeIndexImpl = function (xs, n) {
    return xs[n];
  };

  const concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };

  const concatArray = function (xs) {
    return function (ys) {
      if (xs.length === 0) return ys;
      if (ys.length === 0) return xs;
      return xs.concat(ys);
    };
  };

  // module Data.Symbol

  const unsafeCoerce$1 = function (arg) {
    return arg;
  };

  // Generated by purs version 0.15.15
  var reifySymbol = function (s) {
      return function (f) {
          return unsafeCoerce$1(function (dictIsSymbol) {
              return f(dictIsSymbol);
          })({
              reflectSymbol: function (v) {
                  return s;
              }
          })($$Proxy.value);
      };
  };
  var reflectSymbol = function (dict) {
      return dict.reflectSymbol;
  };

  // Generated by purs version 0.15.15
  var Void = function (x) {
      return x;
  };
  var absurd = function (a) {
      var spin = function ($copy_v) {
          var $tco_result;
          function $tco_loop(v) {
              $copy_v = v;
              return;
          };
          while (!false) {
              $tco_result = $tco_loop($copy_v);
          };
          return $tco_result;
      };
      return spin(a);
  };

  const unsafeHas = function (label) {
    return function (rec) {
      return {}.hasOwnProperty.call(rec, label);
    };
  };

  const unsafeGet = function (label) {
    return function (rec) {
      return rec[label];
    };
  };

  const unsafeSet = function (label) {
    return function (value) {
      return function (rec) {
        var copy = {};
        for (var key in rec) {
          if ({}.hasOwnProperty.call(rec, key)) {
            copy[key] = rec[key];
          }
        }
        copy[label] = value;
        return copy;
      };
    };
  };

  const unsafeDelete = function (label) {
    return function (rec) {
      var copy = {};
      for (var key in rec) {
        if (key !== label && {}.hasOwnProperty.call(rec, key)) {
          copy[key] = rec[key];
        }
      }
      return copy;
    };
  };

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var semigroupVoid = {
      append: function (v) {
          return absurd;
      }
  };
  var semigroupUnit = {
      append: function (v) {
          return function (v1) {
              return unit;
          };
      }
  };
  var semigroupString = {
      append: concatString
  };
  var semigroupRecordNil = {
      appendRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      }
  };
  var semigroupProxy = {
      append: function (v) {
          return function (v1) {
              return $$Proxy.value;
          };
      }
  };
  var semigroupArray = {
      append: concatArray
  };
  var appendRecord = function (dict) {
      return dict.appendRecord;
  };
  var semigroupRecord$1 = function () {
      return function (dictSemigroupRecord) {
          return {
              append: appendRecord(dictSemigroupRecord)($$Proxy.value)
          };
      };
  };
  var append$1 = function (dict) {
      return dict.append;
  };
  var semigroupFn = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return {
          append: function (f) {
              return function (g) {
                  return function (x) {
                      return append1(f(x))(g(x));
                  };
              };
          }
      };
  };
  var semigroupRecordCons = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function () {
          return function (dictSemigroupRecord) {
              var appendRecord1 = appendRecord(dictSemigroupRecord);
              return function (dictSemigroup) {
                  var append1 = append$1(dictSemigroup);
                  return {
                      appendRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = appendRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(append1(get(ra))(get(rb)))(tail);
                              };
                          };
                      }
                  };
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var altArray = {
      alt: /* #__PURE__ */ append$1(semigroupArray),
      Functor0: function () {
          return functorArray;
      }
  };
  var alt$3 = function (dict) {
      return dict.alt;
  };

  // Generated by purs version 0.15.15
  var $runtime_lazy$3 = function (name, moduleName, init) {
      var state = 0;
      var val;
      return function (lineNumber) {
          if (state === 2) return val;
          if (state === 1) throw new ReferenceError(name + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
          state = 1;
          val = init();
          state = 2;
          return val;
      };
  };
  var lazyUnit = {
      defer: function (v) {
          return unit;
      }
  };
  var lazyFn = {
      defer: function (f) {
          return function (x) {
              return f(unit)(x);
          };
      }
  };
  var defer$1 = function (dict) {
      return dict.defer;
  };
  var fix = function (dictLazy) {
      var defer1 = defer$1(dictLazy);
      return function (f) {
          var $lazy_go = $runtime_lazy$3("go", "Control.Lazy", function () {
              return defer1(function (v) {
                  return f($lazy_go(25));
              });
          });
          var go = $lazy_go(25);
          return go;
      };
  };

  // Generated by purs version 0.15.15
  var whenM = function (dictMonad) {
      var bind = bind$4(dictMonad.Bind1());
      var when = when$1(dictMonad.Applicative0());
      return function (mb) {
          return function (m) {
              return bind(mb)(function (b) {
                  return when(b)(m);
              });
          };
      };
  };
  var unlessM = function (dictMonad) {
      var bind = bind$4(dictMonad.Bind1());
      var unless$1 = unless(dictMonad.Applicative0());
      return function (mb) {
          return function (m) {
              return bind(mb)(function (b) {
                  return unless$1(b)(m);
              });
          };
      };
  };
  var monadProxy = {
      Applicative0: function () {
          return applicativeProxy;
      },
      Bind1: function () {
          return bindProxy;
      }
  };
  var monadFn = {
      Applicative0: function () {
          return applicativeFn;
      },
      Bind1: function () {
          return bindFn;
      }
  };
  var monadArray = {
      Applicative0: function () {
          return applicativeArray;
      },
      Bind1: function () {
          return bindArray;
      }
  };
  var liftM1 = function (dictMonad) {
      var bind = bind$4(dictMonad.Bind1());
      var pure = pure$2(dictMonad.Applicative0());
      return function (f) {
          return function (a) {
              return bind(a)(function (a$prime) {
                  return pure(f(a$prime));
              });
          };
      };
  };
  var ap = function (dictMonad) {
      var bind = bind$4(dictMonad.Bind1());
      var pure = pure$2(dictMonad.Applicative0());
      return function (f) {
          return function (a) {
              return bind(f)(function (f$prime) {
                  return bind(a)(function (a$prime) {
                      return pure(f$prime(a$prime));
                  });
              });
          };
      };
  };

  const topInt = 2147483647;
  const bottomInt = -2147483648;

  const topChar = String.fromCharCode(65535);
  const bottomChar = String.fromCharCode(0);

  const topNumber = Number.POSITIVE_INFINITY;
  const bottomNumber = Number.NEGATIVE_INFINITY;

  var unsafeCompareImpl = function (lt) {
    return function (eq) {
      return function (gt) {
        return function (x) {
          return function (y) {
            return x < y ? lt : x === y ? eq : gt;
          };
        };
      };
    };
  };

  const ordBooleanImpl = unsafeCompareImpl;
  const ordIntImpl = unsafeCompareImpl;
  const ordNumberImpl = unsafeCompareImpl;
  const ordStringImpl = unsafeCompareImpl;
  const ordCharImpl = unsafeCompareImpl;

  const ordArrayImpl = function (f) {
    return function (xs) {
      return function (ys) {
        var i = 0;
        var xlen = xs.length;
        var ylen = ys.length;
        while (i < xlen && i < ylen) {
          var x = xs[i];
          var y = ys[i];
          var o = f(x)(y);
          if (o !== 0) {
            return o;
          }
          i++;
        }
        if (xlen === ylen) {
          return 0;
        } else if (xlen > ylen) {
          return -1;
        } else {
          return 1;
        }
      };
    };
  };

  var refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };

  const eqBooleanImpl = refEq;
  const eqIntImpl = refEq;
  const eqNumberImpl = refEq;
  const eqCharImpl = refEq;
  const eqStringImpl = refEq;

  const eqArrayImpl = function (f) {
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

  // Generated by purs version 0.15.15
  var eqVoid = {
      eq: function (v) {
          return function (v1) {
              return true;
          };
      }
  };
  var eqUnit = {
      eq: function (v) {
          return function (v1) {
              return true;
          };
      }
  };
  var eqString = {
      eq: eqStringImpl
  };
  var eqRowNil = {
      eqRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return true;
              };
          };
      }
  };
  var eqRecord = function (dict) {
      return dict.eqRecord;
  };
  var eqRec$1 = function () {
      return function (dictEqRecord) {
          return {
              eq: eqRecord(dictEqRecord)($$Proxy.value)
          };
      };
  };
  var eqProxy = {
      eq: function (v) {
          return function (v1) {
              return true;
          };
      }
  };
  var eqNumber = {
      eq: eqNumberImpl
  };
  var eqInt = {
      eq: eqIntImpl
  };
  var eqChar = {
      eq: eqCharImpl
  };
  var eqBoolean = {
      eq: eqBooleanImpl
  };
  var eq1$3 = function (dict) {
      return dict.eq1;
  };
  var eq$2 = function (dict) {
      return dict.eq;
  };
  var eq2 = /* #__PURE__ */ eq$2(eqBoolean);
  var eqArray = function (dictEq) {
      return {
          eq: eqArrayImpl(eq$2(dictEq))
      };
  };
  var eq1Array = {
      eq1: function (dictEq) {
          return eq$2(eqArray(dictEq));
      }
  };
  var eqRowCons = function (dictEqRecord) {
      var eqRecord1 = eqRecord(dictEqRecord);
      return function () {
          return function (dictIsSymbol) {
              var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
              return function (dictEq) {
                  var eq3 = eq$2(dictEq);
                  return {
                      eqRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = eqRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var get = unsafeGet(key);
                                  return eq3(get(ra))(get(rb)) && tail;
                              };
                          };
                      }
                  };
              };
          };
      };
  };
  var notEq$2 = function (dictEq) {
      var eq3 = eq$2(dictEq);
      return function (x) {
          return function (y) {
              return eq2(eq3(x)(y))(false);
          };
      };
  };
  var notEq1 = function (dictEq1) {
      var eq11 = eq1$3(dictEq1);
      return function (dictEq) {
          var eq12 = eq11(dictEq);
          return function (x) {
              return function (y) {
                  return eq2(eq12(x)(y))(false);
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var LT = /* #__PURE__ */ (function () {
      function LT() {

      };
      LT.value = new LT();
      return LT;
  })();
  var GT = /* #__PURE__ */ (function () {
      function GT() {

      };
      GT.value = new GT();
      return GT;
  })();
  var EQ = /* #__PURE__ */ (function () {
      function EQ() {

      };
      EQ.value = new EQ();
      return EQ;
  })();
  var showOrdering = {
      show: function (v) {
          if (v instanceof LT) {
              return "LT";
          };
          if (v instanceof GT) {
              return "GT";
          };
          if (v instanceof EQ) {
              return "EQ";
          };
          throw new Error("Failed pattern match at Data.Ordering (line 26, column 1 - line 29, column 17): " + [ v.constructor.name ]);
      }
  };
  var semigroupOrdering = {
      append: function (v) {
          return function (v1) {
              if (v instanceof LT) {
                  return LT.value;
              };
              if (v instanceof GT) {
                  return GT.value;
              };
              if (v instanceof EQ) {
                  return v1;
              };
              throw new Error("Failed pattern match at Data.Ordering (line 21, column 1 - line 24, column 18): " + [ v.constructor.name, v1.constructor.name ]);
          };
      }
  };
  var invert = function (v) {
      if (v instanceof GT) {
          return LT.value;
      };
      if (v instanceof EQ) {
          return EQ.value;
      };
      if (v instanceof LT) {
          return GT.value;
      };
      throw new Error("Failed pattern match at Data.Ordering (line 33, column 1 - line 33, column 31): " + [ v.constructor.name ]);
  };
  var eqOrdering = {
      eq: function (v) {
          return function (v1) {
              if (v instanceof LT && v1 instanceof LT) {
                  return true;
              };
              if (v instanceof GT && v1 instanceof GT) {
                  return true;
              };
              if (v instanceof EQ && v1 instanceof EQ) {
                  return true;
              };
              return false;
          };
      }
  };

  const intSub = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x - y | 0;
    };
  };

  const numSub = function (n1) {
    return function (n2) {
      return n1 - n2;
    };
  };

  const intAdd = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x + y | 0;
    };
  };

  const intMul = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x * y | 0;
    };
  };

  const numAdd = function (n1) {
    return function (n2) {
      return n1 + n2;
    };
  };

  const numMul = function (n1) {
    return function (n2) {
      return n1 * n2;
    };
  };

  // Generated by purs version 0.15.15
  var zeroRecord = function (dict) {
      return dict.zeroRecord;
  };
  var zero = function (dict) {
      return dict.zero;
  };
  var semiringUnit = {
      add: function (v) {
          return function (v1) {
              return unit;
          };
      },
      zero: unit,
      mul: function (v) {
          return function (v1) {
              return unit;
          };
      },
      one: unit
  };
  var semiringRecordNil = {
      addRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      },
      mulRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      },
      oneRecord: function (v) {
          return function (v1) {
              return {};
          };
      },
      zeroRecord: function (v) {
          return function (v1) {
              return {};
          };
      }
  };
  var semiringProxy = /* #__PURE__ */ (function () {
      return {
          add: function (v) {
              return function (v1) {
                  return $$Proxy.value;
              };
          },
          mul: function (v) {
              return function (v1) {
                  return $$Proxy.value;
              };
          },
          one: $$Proxy.value,
          zero: $$Proxy.value
      };
  })();
  var semiringNumber = {
      add: numAdd,
      zero: 0.0,
      mul: numMul,
      one: 1.0
  };
  var semiringInt = {
      add: intAdd,
      zero: 0,
      mul: intMul,
      one: 1
  };
  var oneRecord = function (dict) {
      return dict.oneRecord;
  };
  var one = function (dict) {
      return dict.one;
  };
  var mulRecord = function (dict) {
      return dict.mulRecord;
  };
  var mul = function (dict) {
      return dict.mul;
  };
  var addRecord = function (dict) {
      return dict.addRecord;
  };
  var semiringRecord$1 = function () {
      return function (dictSemiringRecord) {
          return {
              add: addRecord(dictSemiringRecord)($$Proxy.value),
              mul: mulRecord(dictSemiringRecord)($$Proxy.value),
              one: oneRecord(dictSemiringRecord)($$Proxy.value)($$Proxy.value),
              zero: zeroRecord(dictSemiringRecord)($$Proxy.value)($$Proxy.value)
          };
      };
  };
  var add = function (dict) {
      return dict.add;
  };
  var semiringFn = function (dictSemiring) {
      var add1 = add(dictSemiring);
      var zero1 = zero(dictSemiring);
      var mul1 = mul(dictSemiring);
      var one1 = one(dictSemiring);
      return {
          add: function (f) {
              return function (g) {
                  return function (x) {
                      return add1(f(x))(g(x));
                  };
              };
          },
          zero: function (v) {
              return zero1;
          },
          mul: function (f) {
              return function (g) {
                  return function (x) {
                      return mul1(f(x))(g(x));
                  };
              };
          },
          one: function (v) {
              return one1;
          }
      };
  };
  var semiringRecordCons = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function () {
          return function (dictSemiringRecord) {
              var addRecord1 = addRecord(dictSemiringRecord);
              var mulRecord1 = mulRecord(dictSemiringRecord);
              var oneRecord1 = oneRecord(dictSemiringRecord);
              var zeroRecord1 = zeroRecord(dictSemiringRecord);
              return function (dictSemiring) {
                  var add1 = add(dictSemiring);
                  var mul1 = mul(dictSemiring);
                  var one1 = one(dictSemiring);
                  var zero1 = zero(dictSemiring);
                  return {
                      addRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = addRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(add1(get(ra))(get(rb)))(tail);
                              };
                          };
                      },
                      mulRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = mulRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(mul1(get(ra))(get(rb)))(tail);
                              };
                          };
                      },
                      oneRecord: function (v) {
                          return function (v1) {
                              var tail = oneRecord1($$Proxy.value)($$Proxy.value);
                              var key = reflectSymbol$1($$Proxy.value);
                              var insert = unsafeSet(key);
                              return insert(one1)(tail);
                          };
                      },
                      zeroRecord: function (v) {
                          return function (v1) {
                              var tail = zeroRecord1($$Proxy.value)($$Proxy.value);
                              var key = reflectSymbol$1($$Proxy.value);
                              var insert = unsafeSet(key);
                              return insert(zero1)(tail);
                          };
                      }
                  };
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var semiringRecord = /* #__PURE__ */ semiringRecord$1();
  var subRecord = function (dict) {
      return dict.subRecord;
  };
  var sub = function (dict) {
      return dict.sub;
  };
  var ringUnit = {
      sub: function (v) {
          return function (v1) {
              return unit;
          };
      },
      Semiring0: function () {
          return semiringUnit;
      }
  };
  var ringRecordNil = {
      subRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      },
      SemiringRecord0: function () {
          return semiringRecordNil;
      }
  };
  var ringRecordCons = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      var semiringRecordCons$1 = semiringRecordCons(dictIsSymbol)();
      return function () {
          return function (dictRingRecord) {
              var subRecord1 = subRecord(dictRingRecord);
              var semiringRecordCons1 = semiringRecordCons$1(dictRingRecord.SemiringRecord0());
              return function (dictRing) {
                  var sub1 = sub(dictRing);
                  var semiringRecordCons2 = semiringRecordCons1(dictRing.Semiring0());
                  return {
                      subRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = subRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(sub1(get(ra))(get(rb)))(tail);
                              };
                          };
                      },
                      SemiringRecord0: function () {
                          return semiringRecordCons2;
                      }
                  };
              };
          };
      };
  };
  var ringRecord$1 = function () {
      return function (dictRingRecord) {
          var semiringRecord1 = semiringRecord(dictRingRecord.SemiringRecord0());
          return {
              sub: subRecord(dictRingRecord)($$Proxy.value),
              Semiring0: function () {
                  return semiringRecord1;
              }
          };
      };
  };
  var ringProxy = {
      sub: function (v) {
          return function (v1) {
              return $$Proxy.value;
          };
      },
      Semiring0: function () {
          return semiringProxy;
      }
  };
  var ringNumber = {
      sub: numSub,
      Semiring0: function () {
          return semiringNumber;
      }
  };
  var ringInt = {
      sub: intSub,
      Semiring0: function () {
          return semiringInt;
      }
  };
  var ringFn = function (dictRing) {
      var sub1 = sub(dictRing);
      var semiringFn$1 = semiringFn(dictRing.Semiring0());
      return {
          sub: function (f) {
              return function (g) {
                  return function (x) {
                      return sub1(f(x))(g(x));
                  };
              };
          },
          Semiring0: function () {
              return semiringFn$1;
          }
      };
  };
  var negate = function (dictRing) {
      var sub1 = sub(dictRing);
      var zero$1 = zero(dictRing.Semiring0());
      return function (a) {
          return sub1(zero$1)(a);
      };
  };

  // Generated by purs version 0.15.15
  var eqRec = /* #__PURE__ */ eqRec$1();
  var notEq$1 = /* #__PURE__ */ notEq$2(eqOrdering);
  var ordVoid = {
      compare: function (v) {
          return function (v1) {
              return EQ.value;
          };
      },
      Eq0: function () {
          return eqVoid;
      }
  };
  var ordUnit = {
      compare: function (v) {
          return function (v1) {
              return EQ.value;
          };
      },
      Eq0: function () {
          return eqUnit;
      }
  };
  var ordString = /* #__PURE__ */ (function () {
      return {
          compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
          Eq0: function () {
              return eqString;
          }
      };
  })();
  var ordRecordNil = {
      compareRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return EQ.value;
              };
          };
      },
      EqRecord0: function () {
          return eqRowNil;
      }
  };
  var ordProxy = {
      compare: function (v) {
          return function (v1) {
              return EQ.value;
          };
      },
      Eq0: function () {
          return eqProxy;
      }
  };
  var ordOrdering = {
      compare: function (v) {
          return function (v1) {
              if (v instanceof LT && v1 instanceof LT) {
                  return EQ.value;
              };
              if (v instanceof EQ && v1 instanceof EQ) {
                  return EQ.value;
              };
              if (v instanceof GT && v1 instanceof GT) {
                  return EQ.value;
              };
              if (v instanceof LT) {
                  return LT.value;
              };
              if (v instanceof EQ && v1 instanceof LT) {
                  return GT.value;
              };
              if (v instanceof EQ && v1 instanceof GT) {
                  return LT.value;
              };
              if (v instanceof GT) {
                  return GT.value;
              };
              throw new Error("Failed pattern match at Data.Ord (line 126, column 1 - line 133, column 20): " + [ v.constructor.name, v1.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqOrdering;
      }
  };
  var ordNumber = /* #__PURE__ */ (function () {
      return {
          compare: ordNumberImpl(LT.value)(EQ.value)(GT.value),
          Eq0: function () {
              return eqNumber;
          }
      };
  })();
  var ordInt = /* #__PURE__ */ (function () {
      return {
          compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
          Eq0: function () {
              return eqInt;
          }
      };
  })();
  var ordChar = /* #__PURE__ */ (function () {
      return {
          compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
          Eq0: function () {
              return eqChar;
          }
      };
  })();
  var ordBoolean = /* #__PURE__ */ (function () {
      return {
          compare: ordBooleanImpl(LT.value)(EQ.value)(GT.value),
          Eq0: function () {
              return eqBoolean;
          }
      };
  })();
  var compareRecord = function (dict) {
      return dict.compareRecord;
  };
  var ordRecord$1 = function () {
      return function (dictOrdRecord) {
          var eqRec1 = eqRec(dictOrdRecord.EqRecord0());
          return {
              compare: compareRecord(dictOrdRecord)($$Proxy.value),
              Eq0: function () {
                  return eqRec1;
              }
          };
      };
  };
  var compare1$1 = function (dict) {
      return dict.compare1;
  };
  var compare$3 = function (dict) {
      return dict.compare;
  };
  var compare2 = /* #__PURE__ */ compare$3(ordInt);
  var comparing = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (f) {
          return function (x) {
              return function (y) {
                  return compare3(f(x))(f(y));
              };
          };
      };
  };
  var greaterThan = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (a1) {
          return function (a2) {
              var v = compare3(a1)(a2);
              if (v instanceof GT) {
                  return true;
              };
              return false;
          };
      };
  };
  var greaterThanOrEq = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (a1) {
          return function (a2) {
              var v = compare3(a1)(a2);
              if (v instanceof LT) {
                  return false;
              };
              return true;
          };
      };
  };
  var lessThan = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (a1) {
          return function (a2) {
              var v = compare3(a1)(a2);
              if (v instanceof LT) {
                  return true;
              };
              return false;
          };
      };
  };
  var signum = function (dictOrd) {
      var lessThan1 = lessThan(dictOrd);
      var greaterThan1 = greaterThan(dictOrd);
      return function (dictRing) {
          var Semiring0 = dictRing.Semiring0();
          var zero$1 = zero(Semiring0);
          var negate1 = negate(dictRing);
          var one$1 = one(Semiring0);
          return function (x) {
              var $89 = lessThan1(x)(zero$1);
              if ($89) {
                  return negate1(one$1);
              };
              var $90 = greaterThan1(x)(zero$1);
              if ($90) {
                  return one$1;
              };
              return x;
          };
      };
  };
  var lessThanOrEq = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (a1) {
          return function (a2) {
              var v = compare3(a1)(a2);
              if (v instanceof GT) {
                  return false;
              };
              return true;
          };
      };
  };
  var max$4 = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (x) {
          return function (y) {
              var v = compare3(x)(y);
              if (v instanceof LT) {
                  return y;
              };
              if (v instanceof EQ) {
                  return x;
              };
              if (v instanceof GT) {
                  return x;
              };
              throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [ v.constructor.name ]);
          };
      };
  };
  var min$3 = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      return function (x) {
          return function (y) {
              var v = compare3(x)(y);
              if (v instanceof LT) {
                  return x;
              };
              if (v instanceof EQ) {
                  return x;
              };
              if (v instanceof GT) {
                  return y;
              };
              throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [ v.constructor.name ]);
          };
      };
  };
  var ordArray = function (dictOrd) {
      var compare3 = compare$3(dictOrd);
      var eqArray$1 = eqArray(dictOrd.Eq0());
      return {
          compare: (function () {
              var toDelta = function (x) {
                  return function (y) {
                      var v = compare3(x)(y);
                      if (v instanceof EQ) {
                          return 0;
                      };
                      if (v instanceof LT) {
                          return 1;
                      };
                      if (v instanceof GT) {
                          return -1 | 0;
                      };
                      throw new Error("Failed pattern match at Data.Ord (line 79, column 7 - line 82, column 17): " + [ v.constructor.name ]);
                  };
              };
              return function (xs) {
                  return function (ys) {
                      return compare2(0)(ordArrayImpl(toDelta)(xs)(ys));
                  };
              };
          })(),
          Eq0: function () {
              return eqArray$1;
          }
      };
  };
  var ord1Array = {
      compare1: function (dictOrd) {
          return compare$3(ordArray(dictOrd));
      },
      Eq10: function () {
          return eq1Array;
      }
  };
  var ordRecordCons = function (dictOrdRecord) {
      var compareRecord1 = compareRecord(dictOrdRecord);
      var eqRowCons$1 = eqRowCons(dictOrdRecord.EqRecord0())();
      return function () {
          return function (dictIsSymbol) {
              var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
              var eqRowCons1 = eqRowCons$1(dictIsSymbol);
              return function (dictOrd) {
                  var compare3 = compare$3(dictOrd);
                  var eqRowCons2 = eqRowCons1(dictOrd.Eq0());
                  return {
                      compareRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var left = compare3(unsafeGet(key)(ra))(unsafeGet(key)(rb));
                                  var $95 = notEq$1(left)(EQ.value);
                                  if ($95) {
                                      return left;
                                  };
                                  return compareRecord1($$Proxy.value)(ra)(rb);
                              };
                          };
                      },
                      EqRecord0: function () {
                          return eqRowCons2;
                      }
                  };
              };
          };
      };
  };
  var clamp = function (dictOrd) {
      var min1 = min$3(dictOrd);
      var max1 = max$4(dictOrd);
      return function (low) {
          return function (hi) {
              return function (x) {
                  return min1(hi)(max1(low)(x));
              };
          };
      };
  };
  var between = function (dictOrd) {
      var lessThan1 = lessThan(dictOrd);
      var greaterThan1 = greaterThan(dictOrd);
      return function (low) {
          return function (hi) {
              return function (x) {
                  if (lessThan1(x)(low)) {
                      return false;
                  };
                  if (greaterThan1(x)(hi)) {
                      return false;
                  };
                  return true;
              };
          };
      };
  };
  var abs$1 = function (dictOrd) {
      var greaterThanOrEq1 = greaterThanOrEq(dictOrd);
      return function (dictRing) {
          var zero$1 = zero(dictRing.Semiring0());
          var negate1 = negate(dictRing);
          return function (x) {
              var $99 = greaterThanOrEq1(x)(zero$1);
              if ($99) {
                  return x;
              };
              return negate1(x);
          };
      };
  };

  // Generated by purs version 0.15.15
  var ordRecord = /* #__PURE__ */ ordRecord$1();
  var topRecord = function (dict) {
      return dict.topRecord;
  };
  var top$2 = function (dict) {
      return dict.top;
  };
  var boundedUnit = {
      top: unit,
      bottom: unit,
      Ord0: function () {
          return ordUnit;
      }
  };
  var boundedRecordNil = {
      topRecord: function (v) {
          return function (v1) {
              return {};
          };
      },
      bottomRecord: function (v) {
          return function (v1) {
              return {};
          };
      },
      OrdRecord0: function () {
          return ordRecordNil;
      }
  };
  var boundedProxy = /* #__PURE__ */ (function () {
      return {
          bottom: $$Proxy.value,
          top: $$Proxy.value,
          Ord0: function () {
              return ordProxy;
          }
      };
  })();
  var boundedOrdering = /* #__PURE__ */ (function () {
      return {
          top: GT.value,
          bottom: LT.value,
          Ord0: function () {
              return ordOrdering;
          }
      };
  })();
  var boundedNumber = {
      top: topNumber,
      bottom: bottomNumber,
      Ord0: function () {
          return ordNumber;
      }
  };
  var boundedInt = {
      top: topInt,
      bottom: bottomInt,
      Ord0: function () {
          return ordInt;
      }
  };
  var boundedChar = {
      top: topChar,
      bottom: bottomChar,
      Ord0: function () {
          return ordChar;
      }
  };
  var boundedBoolean = {
      top: true,
      bottom: false,
      Ord0: function () {
          return ordBoolean;
      }
  };
  var bottomRecord = function (dict) {
      return dict.bottomRecord;
  };
  var boundedRecord = function () {
      return function (dictBoundedRecord) {
          var ordRecord1 = ordRecord(dictBoundedRecord.OrdRecord0());
          return {
              top: topRecord(dictBoundedRecord)($$Proxy.value)($$Proxy.value),
              bottom: bottomRecord(dictBoundedRecord)($$Proxy.value)($$Proxy.value),
              Ord0: function () {
                  return ordRecord1;
              }
          };
      };
  };
  var bottom$2 = function (dict) {
      return dict.bottom;
  };
  var boundedRecordCons = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function (dictBounded) {
          var top1 = top$2(dictBounded);
          var bottom1 = bottom$2(dictBounded);
          var Ord0 = dictBounded.Ord0();
          return function () {
              return function () {
                  return function (dictBoundedRecord) {
                      var topRecord1 = topRecord(dictBoundedRecord);
                      var bottomRecord1 = bottomRecord(dictBoundedRecord);
                      var ordRecordCons$1 = ordRecordCons(dictBoundedRecord.OrdRecord0())()(dictIsSymbol)(Ord0);
                      return {
                          topRecord: function (v) {
                              return function (rowProxy) {
                                  var tail = topRecord1($$Proxy.value)(rowProxy);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  return insert(top1)(tail);
                              };
                          },
                          bottomRecord: function (v) {
                              return function (rowProxy) {
                                  var tail = bottomRecord1($$Proxy.value)(rowProxy);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  return insert(bottom1)(tail);
                              };
                          },
                          OrdRecord0: function () {
                              return ordRecordCons$1;
                          }
                      };
                  };
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var invariantMultiplicative = {
      imap: function (f) {
          return function (v) {
              return function (v1) {
                  return f(v1);
              };
          };
      }
  };
  var invariantEndo = {
      imap: function (ab) {
          return function (ba) {
              return function (v) {
                  return function ($42) {
                      return ab(v(ba($42)));
                  };
              };
          };
      }
  };
  var invariantDual = {
      imap: function (f) {
          return function (v) {
              return function (v1) {
                  return f(v1);
              };
          };
      }
  };
  var invariantDisj = {
      imap: function (f) {
          return function (v) {
              return function (v1) {
                  return f(v1);
              };
          };
      }
  };
  var invariantConj = {
      imap: function (f) {
          return function (v) {
              return function (v1) {
                  return f(v1);
              };
          };
      }
  };
  var invariantAdditive = {
      imap: function (f) {
          return function (v) {
              return function (v1) {
                  return f(v1);
              };
          };
      }
  };
  var imapF = function (dictFunctor) {
      var map = map$o(dictFunctor);
      return function (f) {
          return function (v) {
              return map(f);
          };
      };
  };
  var invariantArray = {
      imap: /* #__PURE__ */ imapF(functorArray)
  };
  var invariantFn = {
      imap: /* #__PURE__ */ imapF(functorFn)
  };
  var imap = function (dict) {
      return dict.imap;
  };
  var invariantAlternate = function (dictInvariant) {
      var imap1 = imap(dictInvariant);
      return {
          imap: function (f) {
              return function (g) {
                  return function (v) {
                      return imap1(f)(g)(v);
                  };
              };
          }
      };
  };

  const showIntImpl = function (n) {
    return n.toString();
  };

  const showNumberImpl = function (n) {
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
  };

  const showCharImpl = function (c) {
    var code = c.charCodeAt(0);
    if (code < 0x20 || code === 0x7F) {
      switch (c) {
        case "\x07": return "'\\a'";
        case "\b": return "'\\b'";
        case "\f": return "'\\f'";
        case "\n": return "'\\n'";
        case "\r": return "'\\r'";
        case "\t": return "'\\t'";
        case "\v": return "'\\v'";
      }
      return "'\\" + code.toString(10) + "'";
    }
    return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
  };

  const showStringImpl = function (s) {
    var l = s.length;
    return "\"" + s.replace(
      /[\0-\x1F\x7F"\\]/g, // eslint-disable-line no-control-regex
      function (c, i) {
        switch (c) {
          case "\"":
          case "\\":
            return "\\" + c;
          case "\x07": return "\\a";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\t": return "\\t";
          case "\v": return "\\v";
        }
        var k = i + 1;
        var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty;
      }
    ) + "\"";
  };

  const showArrayImpl = function (f) {
    return function (xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // Generated by purs version 0.15.15
  var showVoid = {
      show: absurd
  };
  var showUnit = {
      show: function (v) {
          return "unit";
      }
  };
  var showString = {
      show: showStringImpl
  };
  var showRecordFieldsNil = {
      showRecordFields: function (v) {
          return function (v1) {
              return "";
          };
      }
  };
  var showRecordFields = function (dict) {
      return dict.showRecordFields;
  };
  var showRecord$1 = function () {
      return function () {
          return function (dictShowRecordFields) {
              var showRecordFields1 = showRecordFields(dictShowRecordFields);
              return {
                  show: function (record) {
                      return "{" + (showRecordFields1($$Proxy.value)(record) + "}");
                  }
              };
          };
      };
  };
  var showProxy = {
      show: function (v) {
          return "Proxy";
      }
  };
  var showNumber = {
      show: showNumberImpl
  };
  var showInt = {
      show: showIntImpl
  };
  var showChar = {
      show: showCharImpl
  };
  var showBoolean = {
      show: function (v) {
          if (v) {
              return "true";
          };
          if (!v) {
              return "false";
          };
          throw new Error("Failed pattern match at Data.Show (line 29, column 1 - line 31, column 23): " + [ v.constructor.name ]);
      }
  };
  var show$4 = function (dict) {
      return dict.show;
  };
  var showArray$1 = function (dictShow) {
      return {
          show: showArrayImpl(show$4(dictShow))
      };
  };
  var showRecordFieldsCons$1 = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function (dictShowRecordFields) {
          var showRecordFields1 = showRecordFields(dictShowRecordFields);
          return function (dictShow) {
              var show1 = show$4(dictShow);
              return {
                  showRecordFields: function (v) {
                      return function (record) {
                          var tail = showRecordFields1($$Proxy.value)(record);
                          var key = reflectSymbol$1($$Proxy.value);
                          var focus = unsafeGet(key)(record);
                          return " " + (key + (": " + (show1(focus) + ("," + tail))));
                      };
                  }
              };
          };
      };
  };
  var showRecordFieldsConsNil$1 = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function (dictShow) {
          var show1 = show$4(dictShow);
          return {
              showRecordFields: function (v) {
                  return function (record) {
                      var key = reflectSymbol$1($$Proxy.value);
                      var focus = unsafeGet(key)(record);
                      return " " + (key + (": " + (show1(focus) + " ")));
                  };
              }
          };
      };
  };

  // Generated by purs version 0.15.15
  var show$3 = /* #__PURE__ */ show$4(showString);
  var Inl = /* #__PURE__ */ (function () {
      function Inl(value0) {
          this.value0 = value0;
      };
      Inl.create = function (value0) {
          return new Inl(value0);
      };
      return Inl;
  })();
  var Inr = /* #__PURE__ */ (function () {
      function Inr(value0) {
          this.value0 = value0;
      };
      Inr.create = function (value0) {
          return new Inr(value0);
      };
      return Inr;
  })();
  var Product$1 = /* #__PURE__ */ (function () {
      function Product(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Product.create = function (value0) {
          return function (value1) {
              return new Product(value0, value1);
          };
      };
      return Product;
  })();
  var NoConstructors = function (x) {
      return x;
  };
  var NoArguments = /* #__PURE__ */ (function () {
      function NoArguments() {

      };
      NoArguments.value = new NoArguments();
      return NoArguments;
  })();
  var Constructor = function (x) {
      return x;
  };
  var Argument = function (x) {
      return x;
  };
  var to = function (dict) {
      return dict.to;
  };
  var showSum = function (dictShow) {
      var show1 = show$4(dictShow);
      return function (dictShow1) {
          var show2 = show$4(dictShow1);
          return {
              show: function (v) {
                  if (v instanceof Inl) {
                      return "(Inl " + (show1(v.value0) + ")");
                  };
                  if (v instanceof Inr) {
                      return "(Inr " + (show2(v.value0) + ")");
                  };
                  throw new Error("Failed pattern match at Data.Generic.Rep (line 32, column 1 - line 34, column 42): " + [ v.constructor.name ]);
              }
          };
      };
  };
  var showProduct$1 = function (dictShow) {
      var show1 = show$4(dictShow);
      return function (dictShow1) {
          var show2 = show$4(dictShow1);
          return {
              show: function (v) {
                  return "(Product " + (show1(v.value0) + (" " + (show2(v.value1) + ")")));
              }
          };
      };
  };
  var showNoArguments = {
      show: function (v) {
          return "NoArguments";
      }
  };
  var showConstructor = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function (dictShow) {
          var show1 = show$4(dictShow);
          return {
              show: function (v) {
                  return "(Constructor @" + (show$3(reflectSymbol$1($$Proxy.value)) + (" " + (show1(v) + ")")));
              }
          };
      };
  };
  var showArgument = function (dictShow) {
      var show1 = show$4(dictShow);
      return {
          show: function (v) {
              return "(Argument " + (show1(v) + ")");
          }
      };
  };
  var repOf = function (dictGeneric) {
      return function (v) {
          return $$Proxy.value;
      };
  };
  var from = function (dict) {
      return dict.from;
  };

  // Generated by purs version 0.15.15
  var identity$6 = /* #__PURE__ */ identity$9(categoryFn);
  var Nothing = /* #__PURE__ */ (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = /* #__PURE__ */ (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var showMaybe = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              if (v instanceof Just) {
                  return "(Just " + (show(v.value0) + ")");
              };
              if (v instanceof Nothing) {
                  return "Nothing";
              };
              throw new Error("Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): " + [ v.constructor.name ]);
          }
      };
  };
  var semigroupMaybe = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return {
          append: function (v) {
              return function (v1) {
                  if (v instanceof Nothing) {
                      return v1;
                  };
                  if (v1 instanceof Nothing) {
                      return v;
                  };
                  if (v instanceof Just && v1 instanceof Just) {
                      return new Just(append1(v.value0)(v1.value0));
                  };
                  throw new Error("Failed pattern match at Data.Maybe (line 182, column 1 - line 185, column 43): " + [ v.constructor.name, v1.constructor.name ]);
              };
          }
      };
  };
  var optional = function (dictAlt) {
      var alt = alt$3(dictAlt);
      var map1 = map$o(dictAlt.Functor0());
      return function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          return function (a) {
              return alt(map1(Just.create)(a))(pure(Nothing.value));
          };
      };
  };
  var monoidMaybe = function (dictSemigroup) {
      var semigroupMaybe1 = semigroupMaybe(dictSemigroup);
      return {
          mempty: Nothing.value,
          Semigroup0: function () {
              return semigroupMaybe1;
          }
      };
  };
  var maybe$prime = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v(unit);
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe (line 250, column 1 - line 250, column 62): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var isNothing = /* #__PURE__ */ maybe(true)(/* #__PURE__ */ $$const(false));
  var isJust = /* #__PURE__ */ maybe(false)(/* #__PURE__ */ $$const(true));
  var genericMaybe = {
      to: function (x) {
          if (x instanceof Inl) {
              return Nothing.value;
          };
          if (x instanceof Inr) {
              return new Just(x.value0);
          };
          throw new Error("Failed pattern match at Data.Maybe (line 227, column 1 - line 227, column 52): " + [ x.constructor.name ]);
      },
      from: function (x) {
          if (x instanceof Nothing) {
              return new Inl(NoArguments.value);
          };
          if (x instanceof Just) {
              return new Inr(x.value0);
          };
          throw new Error("Failed pattern match at Data.Maybe (line 227, column 1 - line 227, column 52): " + [ x.constructor.name ]);
      }
  };
  var functorMaybe = {
      map: function (v) {
          return function (v1) {
              if (v1 instanceof Just) {
                  return new Just(v(v1.value0));
              };
              return Nothing.value;
          };
      }
  };
  var map$n = /* #__PURE__ */ map$o(functorMaybe);
  var invariantMaybe = {
      imap: /* #__PURE__ */ imapF(functorMaybe)
  };
  var fromMaybe$prime = function (a) {
      return maybe$prime(a)(identity$6);
  };
  var fromMaybe$1 = function (a) {
      return maybe(a)(identity$6);
  };
  var fromJust$4 = function () {
      return function (v) {
          if (v instanceof Just) {
              return v.value0;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [ v.constructor.name ]);
      };
  };
  var extendMaybe = {
      extend: function (v) {
          return function (v1) {
              if (v1 instanceof Nothing) {
                  return Nothing.value;
              };
              return new Just(v(v1));
          };
      },
      Functor0: function () {
          return functorMaybe;
      }
  };
  var eqMaybe = function (dictEq) {
      var eq = eq$2(dictEq);
      return {
          eq: function (x) {
              return function (y) {
                  if (x instanceof Nothing && y instanceof Nothing) {
                      return true;
                  };
                  if (x instanceof Just && y instanceof Just) {
                      return eq(x.value0)(y.value0);
                  };
                  return false;
              };
          }
      };
  };
  var ordMaybe = function (dictOrd) {
      var compare = compare$3(dictOrd);
      var eqMaybe1 = eqMaybe(dictOrd.Eq0());
      return {
          compare: function (x) {
              return function (y) {
                  if (x instanceof Nothing && y instanceof Nothing) {
                      return EQ.value;
                  };
                  if (x instanceof Nothing) {
                      return LT.value;
                  };
                  if (y instanceof Nothing) {
                      return GT.value;
                  };
                  if (x instanceof Just && y instanceof Just) {
                      return compare(x.value0)(y.value0);
                  };
                  throw new Error("Failed pattern match at Data.Maybe (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
              };
          },
          Eq0: function () {
              return eqMaybe1;
          }
      };
  };
  var eq1Maybe = {
      eq1: function (dictEq) {
          return eq$2(eqMaybe(dictEq));
      }
  };
  var ord1Maybe = {
      compare1: function (dictOrd) {
          return compare$3(ordMaybe(dictOrd));
      },
      Eq10: function () {
          return eq1Maybe;
      }
  };
  var boundedMaybe = function (dictBounded) {
      var ordMaybe1 = ordMaybe(dictBounded.Ord0());
      return {
          top: new Just(top$2(dictBounded)),
          bottom: Nothing.value,
          Ord0: function () {
              return ordMaybe1;
          }
      };
  };
  var applyMaybe = {
      apply: function (v) {
          return function (v1) {
              if (v instanceof Just) {
                  return map$n(v.value0)(v1);
              };
              if (v instanceof Nothing) {
                  return Nothing.value;
              };
              throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [ v.constructor.name, v1.constructor.name ]);
          };
      },
      Functor0: function () {
          return functorMaybe;
      }
  };
  var apply$3 = /* #__PURE__ */ apply$4(applyMaybe);
  var bindMaybe = {
      bind: function (v) {
          return function (v1) {
              if (v instanceof Just) {
                  return v1(v.value0);
              };
              if (v instanceof Nothing) {
                  return Nothing.value;
              };
              throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [ v.constructor.name, v1.constructor.name ]);
          };
      },
      Apply0: function () {
          return applyMaybe;
      }
  };
  var semiringMaybe = function (dictSemiring) {
      var add$1 = add(dictSemiring);
      var mul$1 = mul(dictSemiring);
      return {
          zero: Nothing.value,
          one: new Just(one(dictSemiring)),
          add: function (v) {
              return function (v1) {
                  if (v instanceof Nothing) {
                      return v1;
                  };
                  if (v1 instanceof Nothing) {
                      return v;
                  };
                  if (v instanceof Just && v1 instanceof Just) {
                      return new Just(add$1(v.value0)(v1.value0));
                  };
                  throw new Error("Failed pattern match at Data.Maybe (line 190, column 1 - line 198, column 28): " + [ v.constructor.name, v1.constructor.name ]);
              };
          },
          mul: function (x) {
              return function (y) {
                  return apply$3(map$n(mul$1)(x))(y);
              };
          }
      };
  };
  var applicativeMaybe = /* #__PURE__ */ (function () {
      return {
          pure: Just.create,
          Apply0: function () {
              return applyMaybe;
          }
      };
  })();
  var monadMaybe = {
      Applicative0: function () {
          return applicativeMaybe;
      },
      Bind1: function () {
          return bindMaybe;
      }
  };
  var altMaybe = {
      alt: function (v) {
          return function (v1) {
              if (v instanceof Nothing) {
                  return v1;
              };
              return v;
          };
      },
      Functor0: function () {
          return functorMaybe;
      }
  };
  var plusMaybe = /* #__PURE__ */ (function () {
      return {
          empty: Nothing.value,
          Alt0: function () {
              return altMaybe;
          }
      };
  })();
  var alternativeMaybe = {
      Applicative0: function () {
          return applicativeMaybe;
      },
      Plus1: function () {
          return plusMaybe;
      }
  };

  // Generated by purs version 0.15.15
  var Left = /* #__PURE__ */ (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = /* #__PURE__ */ (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var showEither = function (dictShow) {
      var show = show$4(dictShow);
      return function (dictShow1) {
          var show1 = show$4(dictShow1);
          return {
              show: function (v) {
                  if (v instanceof Left) {
                      return "(Left " + (show(v.value0) + ")");
                  };
                  if (v instanceof Right) {
                      return "(Right " + (show1(v.value0) + ")");
                  };
                  throw new Error("Failed pattern match at Data.Either (line 173, column 1 - line 175, column 46): " + [ v.constructor.name ]);
              }
          };
      };
  };
  var note$prime = function (f) {
      return maybe$prime(function ($138) {
          return Left.create(f($138));
      })(Right.create);
  };
  var note = function (a) {
      return maybe(new Left(a))(Right.create);
  };
  var genericEither = {
      to: function (x) {
          if (x instanceof Inl) {
              return new Left(x.value0);
          };
          if (x instanceof Inr) {
              return new Right(x.value0);
          };
          throw new Error("Failed pattern match at Data.Either (line 33, column 1 - line 33, column 56): " + [ x.constructor.name ]);
      },
      from: function (x) {
          if (x instanceof Left) {
              return new Inl(x.value0);
          };
          if (x instanceof Right) {
              return new Inr(x.value0);
          };
          throw new Error("Failed pattern match at Data.Either (line 33, column 1 - line 33, column 56): " + [ x.constructor.name ]);
      }
  };
  var functorEither = {
      map: function (f) {
          return function (m) {
              if (m instanceof Left) {
                  return new Left(m.value0);
              };
              if (m instanceof Right) {
                  return new Right(f(m.value0));
              };
              throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [ m.constructor.name ]);
          };
      }
  };
  var map$m = /* #__PURE__ */ map$o(functorEither);
  var invariantEither = {
      imap: /* #__PURE__ */ imapF(functorEither)
  };
  var fromRight$prime = function (v) {
      return function (v1) {
          if (v1 instanceof Right) {
              return v1.value0;
          };
          return v(unit);
      };
  };
  var fromRight = function (v) {
      return function (v1) {
          if (v1 instanceof Right) {
              return v1.value0;
          };
          return v;
      };
  };
  var fromLeft$prime = function (v) {
      return function (v1) {
          if (v1 instanceof Left) {
              return v1.value0;
          };
          return v(unit);
      };
  };
  var fromLeft = function (v) {
      return function (v1) {
          if (v1 instanceof Left) {
              return v1.value0;
          };
          return v;
      };
  };
  var extendEither = {
      extend: function (v) {
          return function (v1) {
              if (v1 instanceof Left) {
                  return new Left(v1.value0);
              };
              return new Right(v(v1));
          };
      },
      Functor0: function () {
          return functorEither;
      }
  };
  var eqEither = function (dictEq) {
      var eq = eq$2(dictEq);
      return function (dictEq1) {
          var eq1 = eq$2(dictEq1);
          return {
              eq: function (x) {
                  return function (y) {
                      if (x instanceof Left && y instanceof Left) {
                          return eq(x.value0)(y.value0);
                      };
                      if (x instanceof Right && y instanceof Right) {
                          return eq1(x.value0)(y.value0);
                      };
                      return false;
                  };
              }
          };
      };
  };
  var ordEither = function (dictOrd) {
      var compare = compare$3(dictOrd);
      var eqEither1 = eqEither(dictOrd.Eq0());
      return function (dictOrd1) {
          var compare1 = compare$3(dictOrd1);
          var eqEither2 = eqEither1(dictOrd1.Eq0());
          return {
              compare: function (x) {
                  return function (y) {
                      if (x instanceof Left && y instanceof Left) {
                          return compare(x.value0)(y.value0);
                      };
                      if (x instanceof Left) {
                          return LT.value;
                      };
                      if (y instanceof Left) {
                          return GT.value;
                      };
                      if (x instanceof Right && y instanceof Right) {
                          return compare1(x.value0)(y.value0);
                      };
                      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
                  };
              },
              Eq0: function () {
                  return eqEither2;
              }
          };
      };
  };
  var eq1Either = function (dictEq) {
      var eqEither1 = eqEither(dictEq);
      return {
          eq1: function (dictEq1) {
              return eq$2(eqEither1(dictEq1));
          }
      };
  };
  var ord1Either = function (dictOrd) {
      var ordEither1 = ordEither(dictOrd);
      var eq1Either1 = eq1Either(dictOrd.Eq0());
      return {
          compare1: function (dictOrd1) {
              return compare$3(ordEither1(dictOrd1));
          },
          Eq10: function () {
              return eq1Either1;
          }
      };
  };
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var hush = /* #__PURE__ */ (function () {
      return either($$const(Nothing.value))(Just.create);
  })();
  var isLeft = /* #__PURE__ */ either(/* #__PURE__ */ $$const(true))(/* #__PURE__ */ $$const(false));
  var isRight = /* #__PURE__ */ either(/* #__PURE__ */ $$const(false))(/* #__PURE__ */ $$const(true));
  var choose = function (dictAlt) {
      var alt = alt$3(dictAlt);
      var map1 = map$o(dictAlt.Functor0());
      return function (a) {
          return function (b) {
              return alt(map1(Left.create)(a))(map1(Right.create)(b));
          };
      };
  };
  var boundedEither = function (dictBounded) {
      var bottom = bottom$2(dictBounded);
      var ordEither1 = ordEither(dictBounded.Ord0());
      return function (dictBounded1) {
          var ordEither2 = ordEither1(dictBounded1.Ord0());
          return {
              top: new Right(top$2(dictBounded1)),
              bottom: new Left(bottom),
              Ord0: function () {
                  return ordEither2;
              }
          };
      };
  };
  var blush = /* #__PURE__ */ (function () {
      return either(Just.create)($$const(Nothing.value));
  })();
  var applyEither = {
      apply: function (v) {
          return function (v1) {
              if (v instanceof Left) {
                  return new Left(v.value0);
              };
              if (v instanceof Right) {
                  return map$m(v.value0)(v1);
              };
              throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [ v.constructor.name, v1.constructor.name ]);
          };
      },
      Functor0: function () {
          return functorEither;
      }
  };
  var apply$2 = /* #__PURE__ */ apply$4(applyEither);
  var bindEither = {
      bind: /* #__PURE__ */ either(function (e) {
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
      }
  };
  var semigroupEither = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return {
          append: function (x) {
              return function (y) {
                  return apply$2(map$m(append1)(x))(y);
              };
          }
      };
  };
  var applicativeEither = /* #__PURE__ */ (function () {
      return {
          pure: Right.create,
          Apply0: function () {
              return applyEither;
          }
      };
  })();
  var monadEither = {
      Applicative0: function () {
          return applicativeEither;
      },
      Bind1: function () {
          return bindEither;
      }
  };
  var altEither = {
      alt: function (v) {
          return function (v1) {
              if (v instanceof Left) {
                  return v1;
              };
              return v;
          };
      },
      Functor0: function () {
          return functorEither;
      }
  };

  // Generated by purs version 0.15.15
  var Identity = function (x) {
      return x;
  };
  var showIdentity = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Identity " + (show(v) + ")");
          }
      };
  };
  var semiringIdentity = function (dictSemiring) {
      return dictSemiring;
  };
  var semigroupIdentity = function (dictSemigroup) {
      return dictSemigroup;
  };
  var ringIdentity = function (dictRing) {
      return dictRing;
  };
  var ordIdentity = function (dictOrd) {
      return dictOrd;
  };
  var newtypeIdentity = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidIdentity = function (dictMonoid) {
      return dictMonoid;
  };
  var lazyIdentity = function (dictLazy) {
      return dictLazy;
  };
  var heytingAlgebraIdentity = function (dictHeytingAlgebra) {
      return dictHeytingAlgebra;
  };
  var functorIdentity = {
      map: function (f) {
          return function (m) {
              return f(m);
          };
      }
  };
  var invariantIdentity = {
      imap: /* #__PURE__ */ imapF(functorIdentity)
  };
  var extendIdentity = {
      extend: function (f) {
          return function (m) {
              return f(m);
          };
      },
      Functor0: function () {
          return functorIdentity;
      }
  };
  var euclideanRingIdentity = function (dictEuclideanRing) {
      return dictEuclideanRing;
  };
  var eqIdentity = function (dictEq) {
      return dictEq;
  };
  var eq1Identity = {
      eq1: function (dictEq) {
          return eq$2(eqIdentity(dictEq));
      }
  };
  var ord1Identity = {
      compare1: function (dictOrd) {
          return compare$3(ordIdentity(dictOrd));
      },
      Eq10: function () {
          return eq1Identity;
      }
  };
  var comonadIdentity = {
      extract: function (v) {
          return v;
      },
      Extend0: function () {
          return extendIdentity;
      }
  };
  var commutativeRingIdentity = function (dictCommutativeRing) {
      return dictCommutativeRing;
  };
  var boundedIdentity = function (dictBounded) {
      return dictBounded;
  };
  var booleanAlgebraIdentity = function (dictBooleanAlgebra) {
      return dictBooleanAlgebra;
  };
  var applyIdentity = {
      apply: function (v) {
          return function (v1) {
              return v(v1);
          };
      },
      Functor0: function () {
          return functorIdentity;
      }
  };
  var bindIdentity = {
      bind: function (v) {
          return function (f) {
              return f(v);
          };
      },
      Apply0: function () {
          return applyIdentity;
      }
  };
  var applicativeIdentity = {
      pure: Identity,
      Apply0: function () {
          return applyIdentity;
      }
  };
  var monadIdentity = {
      Applicative0: function () {
          return applicativeIdentity;
      },
      Bind1: function () {
          return bindIdentity;
      }
  };
  var altIdentity = {
      alt: function (x) {
          return function (v) {
              return x;
          };
      },
      Functor0: function () {
          return functorIdentity;
      }
  };

  const intDegree = function (x) {
    return Math.min(Math.abs(x), 2147483647);
  };

  // See the Euclidean definition in
  // https://en.m.wikipedia.org/wiki/Modulo_operation.
  const intDiv = function (x) {
    return function (y) {
      if (y === 0) return 0;
      return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
    };
  };

  const intMod = function (x) {
    return function (y) {
      if (y === 0) return 0;
      var yy = Math.abs(y);
      return ((x % yy) + yy) % yy;
    };
  };

  const numDiv = function (n1) {
    return function (n2) {
      return n1 / n2;
    };
  };

  // Generated by purs version 0.15.15
  var ringRecord = /* #__PURE__ */ ringRecord$1();
  var commutativeRingUnit = {
      Ring0: function () {
          return ringUnit;
      }
  };
  var commutativeRingRecordNil = {
      RingRecord0: function () {
          return ringRecordNil;
      }
  };
  var commutativeRingRecordCons = function (dictIsSymbol) {
      var ringRecordCons$1 = ringRecordCons(dictIsSymbol)();
      return function () {
          return function (dictCommutativeRingRecord) {
              var ringRecordCons1 = ringRecordCons$1(dictCommutativeRingRecord.RingRecord0());
              return function (dictCommutativeRing) {
                  var ringRecordCons2 = ringRecordCons1(dictCommutativeRing.Ring0());
                  return {
                      RingRecord0: function () {
                          return ringRecordCons2;
                      }
                  };
              };
          };
      };
  };
  var commutativeRingRecord = function () {
      return function (dictCommutativeRingRecord) {
          var ringRecord1 = ringRecord(dictCommutativeRingRecord.RingRecord0());
          return {
              Ring0: function () {
                  return ringRecord1;
              }
          };
      };
  };
  var commutativeRingProxy = {
      Ring0: function () {
          return ringProxy;
      }
  };
  var commutativeRingNumber = {
      Ring0: function () {
          return ringNumber;
      }
  };
  var commutativeRingInt = {
      Ring0: function () {
          return ringInt;
      }
  };
  var commutativeRingFn = function (dictCommutativeRing) {
      var ringFn$1 = ringFn(dictCommutativeRing.Ring0());
      return {
          Ring0: function () {
              return ringFn$1;
          }
      };
  };

  // Generated by purs version 0.15.15
  var mod$2 = function (dict) {
      return dict.mod;
  };
  var gcd = function (dictEq) {
      var eq = eq$2(dictEq);
      return function (dictEuclideanRing) {
          var zero$1 = zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0());
          var mod1 = mod$2(dictEuclideanRing);
          return function (a) {
              return function (b) {
                  var $24 = eq(b)(zero$1);
                  if ($24) {
                      return a;
                  };
                  return gcd(dictEq)(dictEuclideanRing)(b)(mod1(a)(b));
              };
          };
      };
  };
  var euclideanRingNumber = {
      degree: function (v) {
          return 1;
      },
      div: numDiv,
      mod: function (v) {
          return function (v1) {
              return 0.0;
          };
      },
      CommutativeRing0: function () {
          return commutativeRingNumber;
      }
  };
  var euclideanRingInt = {
      degree: intDegree,
      div: intDiv,
      mod: intMod,
      CommutativeRing0: function () {
          return commutativeRingInt;
      }
  };
  var div$2 = function (dict) {
      return dict.div;
  };
  var lcm = function (dictEq) {
      var eq = eq$2(dictEq);
      var gcd1 = gcd(dictEq);
      return function (dictEuclideanRing) {
          var Semiring0 = ((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0();
          var zero$1 = zero(Semiring0);
          var div1 = div$2(dictEuclideanRing);
          var mul$1 = mul(Semiring0);
          var gcd2 = gcd1(dictEuclideanRing);
          return function (a) {
              return function (b) {
                  var $26 = eq(a)(zero$1) || eq(b)(zero$1);
                  if ($26) {
                      return zero$1;
                  };
                  return div1(mul$1(a)(b))(gcd2(a)(b));
              };
          };
      };
  };
  var degree = function (dict) {
      return dict.degree;
  };

  // Generated by purs version 0.15.15
  var semigroupRecord = /* #__PURE__ */ semigroupRecord$1();
  var mod$1 = /* #__PURE__ */ mod$2(euclideanRingInt);
  var div$1 = /* #__PURE__ */ div$2(euclideanRingInt);
  var monoidUnit = {
      mempty: unit,
      Semigroup0: function () {
          return semigroupUnit;
      }
  };
  var monoidString = {
      mempty: "",
      Semigroup0: function () {
          return semigroupString;
      }
  };
  var monoidRecordNil = {
      memptyRecord: function (v) {
          return {};
      },
      SemigroupRecord0: function () {
          return semigroupRecordNil;
      }
  };
  var monoidOrdering = /* #__PURE__ */ (function () {
      return {
          mempty: EQ.value,
          Semigroup0: function () {
              return semigroupOrdering;
          }
      };
  })();
  var monoidArray = {
      mempty: [  ],
      Semigroup0: function () {
          return semigroupArray;
      }
  };
  var memptyRecord = function (dict) {
      return dict.memptyRecord;
  };
  var monoidRecord = function () {
      return function (dictMonoidRecord) {
          var semigroupRecord1 = semigroupRecord(dictMonoidRecord.SemigroupRecord0());
          return {
              mempty: memptyRecord(dictMonoidRecord)($$Proxy.value),
              Semigroup0: function () {
                  return semigroupRecord1;
              }
          };
      };
  };
  var mempty = function (dict) {
      return dict.mempty;
  };
  var monoidFn = function (dictMonoid) {
      var mempty1 = mempty(dictMonoid);
      var semigroupFn$1 = semigroupFn(dictMonoid.Semigroup0());
      return {
          mempty: function (v) {
              return mempty1;
          },
          Semigroup0: function () {
              return semigroupFn$1;
          }
      };
  };
  var monoidRecordCons = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      var semigroupRecordCons$1 = semigroupRecordCons(dictIsSymbol)();
      return function (dictMonoid) {
          var mempty1 = mempty(dictMonoid);
          var Semigroup0 = dictMonoid.Semigroup0();
          return function () {
              return function (dictMonoidRecord) {
                  var memptyRecord1 = memptyRecord(dictMonoidRecord);
                  var semigroupRecordCons1 = semigroupRecordCons$1(dictMonoidRecord.SemigroupRecord0())(Semigroup0);
                  return {
                      memptyRecord: function (v) {
                          var tail = memptyRecord1($$Proxy.value);
                          var key = reflectSymbol$1($$Proxy.value);
                          var insert = unsafeSet(key);
                          return insert(mempty1)(tail);
                      },
                      SemigroupRecord0: function () {
                          return semigroupRecordCons1;
                      }
                  };
              };
          };
      };
  };
  var power = function (dictMonoid) {
      var mempty1 = mempty(dictMonoid);
      var append = append$1(dictMonoid.Semigroup0());
      return function (x) {
          var go = function (p) {
              if (p <= 0) {
                  return mempty1;
              };
              if (p === 1) {
                  return x;
              };
              if (mod$1(p)(2) === 0) {
                  var x$prime = go(div$1(p)(2));
                  return append(x$prime)(x$prime);
              };
              if (otherwise) {
                  var x$prime = go(div$1(p)(2));
                  return append(x$prime)(append(x$prime)(x));
              };
              throw new Error("Failed pattern match at Data.Monoid (line 88, column 3 - line 88, column 17): " + [ p.constructor.name ]);
          };
          return go;
      };
  };
  var guard$2 = function (dictMonoid) {
      var mempty1 = mempty(dictMonoid);
      return function (v) {
          return function (v1) {
              if (v) {
                  return v1;
              };
              if (!v) {
                  return mempty1;
              };
              throw new Error("Failed pattern match at Data.Monoid (line 96, column 1 - line 96, column 49): " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
  };

  const pureE = function (a) {
    return function () {
      return a;
    };
  };

  const bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };

  const untilE = function (f) {
    return function () {
      while (!f());
    };
  };

  const whileE = function (f) {
    return function (a) {
      return function () {
        while (f()) {
          a();
        }
      };
    };
  };

  const forE = function (lo) {
    return function (hi) {
      return function (f) {
        return function () {
          for (var i = lo; i < hi; i++) {
            f(i)();
          }
        };
      };
    };
  };

  const foreachE = function (as) {
    return function (f) {
      return function () {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };

  // Generated by purs version 0.15.15
  var $runtime_lazy$2 = function (name, moduleName, init) {
      var state = 0;
      var val;
      return function (lineNumber) {
          if (state === 2) return val;
          if (state === 1) throw new ReferenceError(name + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
          state = 1;
          val = init();
          state = 2;
          return val;
      };
  };
  var monadEffect = {
      Applicative0: function () {
          return applicativeEffect;
      },
      Bind1: function () {
          return bindEffect;
      }
  };
  var bindEffect = {
      bind: bindE,
      Apply0: function () {
          return $lazy_applyEffect(0);
      }
  };
  var applicativeEffect = {
      pure: pureE,
      Apply0: function () {
          return $lazy_applyEffect(0);
      }
  };
  var $lazy_functorEffect = /* #__PURE__ */ $runtime_lazy$2("functorEffect", "Effect", function () {
      return {
          map: liftA1(applicativeEffect)
      };
  });
  var $lazy_applyEffect = /* #__PURE__ */ $runtime_lazy$2("applyEffect", "Effect", function () {
      return {
          apply: ap(monadEffect),
          Functor0: function () {
              return $lazy_functorEffect(0);
          }
      };
  });
  var functorEffect = /* #__PURE__ */ $lazy_functorEffect(20);
  var applyEffect = /* #__PURE__ */ $lazy_applyEffect(23);
  var lift2$1 = /* #__PURE__ */ lift2$2(applyEffect);
  var semigroupEffect = function (dictSemigroup) {
      return {
          append: lift2$1(append$1(dictSemigroup))
      };
  };
  var monoidEffect = function (dictMonoid) {
      var semigroupEffect1 = semigroupEffect(dictMonoid.Semigroup0());
      return {
          mempty: pureE(mempty(dictMonoid)),
          Semigroup0: function () {
              return semigroupEffect1;
          }
      };
  };

  const _new = function (val) {
    return function () {
      return { value: val };
    };
  };

  const newWithSelf = function (f) {
    return function () {
      var ref = { value: null };
      ref.value = f(ref);
      return ref;
    };
  };

  const read$1 = function (ref) {
    return function () {
      return ref.value;
    };
  };

  const modifyImpl$1 = function (f) {
    return function (ref) {
      return function () {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };

  const write$1 = function (val) {
    return function (ref) {
      return function () {
        ref.value = val;
      };
    };
  };

  // Generated by purs version 0.15.15
  var $$void$4 = /* #__PURE__ */ $$void$5(functorEffect);
  var $$new = _new;
  var modify$prime$1 = modifyImpl$1;
  var modify$3 = function (f) {
      return modify$prime$1(function (s) {
          var s$prime = f(s);
          return {
              state: s$prime,
              value: s$prime
          };
      });
  };
  var modify_ = function (f) {
      return function (s) {
          return $$void$4(modify$3(f)(s));
      };
  };

  // Generated by purs version 0.15.15
  var bindFlipped$2 = /* #__PURE__ */ bindFlipped$3(bindEffect);
  var map$l = /* #__PURE__ */ map$o(functorEffect);
  var Loop = /* #__PURE__ */ (function () {
      function Loop(value0) {
          this.value0 = value0;
      };
      Loop.create = function (value0) {
          return new Loop(value0);
      };
      return Loop;
  })();
  var Done = /* #__PURE__ */ (function () {
      function Done(value0) {
          this.value0 = value0;
      };
      Done.create = function (value0) {
          return new Done(value0);
      };
      return Done;
  })();
  var tailRecM = function (dict) {
      return dict.tailRecM;
  };
  var tailRecM2 = function (dictMonadRec) {
      var tailRecM1 = tailRecM(dictMonadRec);
      return function (f) {
          return function (a) {
              return function (b) {
                  return tailRecM1(function (o) {
                      return f(o.a)(o.b);
                  })({
                      a: a,
                      b: b
                  });
              };
          };
      };
  };
  var tailRecM3 = function (dictMonadRec) {
      var tailRecM1 = tailRecM(dictMonadRec);
      return function (f) {
          return function (a) {
              return function (b) {
                  return function (c) {
                      return tailRecM1(function (o) {
                          return f(o.a)(o.b)(o.c);
                      })({
                          a: a,
                          b: b,
                          c: c
                      });
                  };
              };
          };
      };
  };
  var untilJust = function (dictMonadRec) {
      var tailRecM1 = tailRecM(dictMonadRec);
      var mapFlipped$1 = mapFlipped((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0());
      return function (m) {
          return tailRecM1(function (v) {
              return mapFlipped$1(m)(function (v1) {
                  if (v1 instanceof Nothing) {
                      return new Loop(unit);
                  };
                  if (v1 instanceof Just) {
                      return new Done(v1.value0);
                  };
                  throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 179, column 43 - line 181, column 19): " + [ v1.constructor.name ]);
              });
          })(unit);
      };
  };
  var whileJust = function (dictMonoid) {
      var append = append$1(dictMonoid.Semigroup0());
      var mempty$1 = mempty(dictMonoid);
      return function (dictMonadRec) {
          var tailRecM1 = tailRecM(dictMonadRec);
          var mapFlipped$1 = mapFlipped((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0());
          return function (m) {
              return tailRecM1(function (v) {
                  return mapFlipped$1(m)(function (v1) {
                      if (v1 instanceof Nothing) {
                          return new Done(v);
                      };
                      if (v1 instanceof Just) {
                          return new Loop(append(v)(v1.value0));
                      };
                      throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 172, column 45 - line 174, column 26): " + [ v1.constructor.name ]);
                  });
              })(mempty$1);
          };
      };
  };
  var tailRec = function (f) {
      var go = function ($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
              if (v instanceof Loop) {
                  $copy_v = f(v.value0);
                  return;
              };
              if (v instanceof Done) {
                  $tco_done = true;
                  return v.value0;
              };
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 103, column 3 - line 103, column 25): " + [ v.constructor.name ]);
          };
          while (!$tco_done) {
              $tco_result = $tco_loop($copy_v);
          };
          return $tco_result;
      };
      return function ($85) {
          return go(f($85));
      };
  };
  var tailRec2 = function (f) {
      return function (a) {
          return function (b) {
              return tailRec(function (o) {
                  return f(o.a)(o.b);
              })({
                  a: a,
                  b: b
              });
          };
      };
  };
  var tailRec3 = function (f) {
      return function (a) {
          return function (b) {
              return function (c) {
                  return tailRec(function (o) {
                      return f(o.a)(o.b)(o.c);
                  })({
                      a: a,
                      b: b,
                      c: c
                  });
              };
          };
      };
  };
  var monadRecMaybe = {
      tailRecM: function (f) {
          return function (a0) {
              var g = function (v) {
                  if (v instanceof Nothing) {
                      return new Done(Nothing.value);
                  };
                  if (v instanceof Just && v.value0 instanceof Loop) {
                      return new Loop(f(v.value0.value0));
                  };
                  if (v instanceof Just && v.value0 instanceof Done) {
                      return new Done(new Just(v.value0.value0));
                  };
                  throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 153, column 7 - line 153, column 31): " + [ v.constructor.name ]);
              };
              return tailRec(g)(f(a0));
          };
      },
      Monad0: function () {
          return monadMaybe;
      }
  };
  var monadRecIdentity = {
      tailRecM: function (f) {
          var runIdentity = function (v) {
              return v;
          };
          var $86 = tailRec(function ($88) {
              return runIdentity(f($88));
          });
          return function ($87) {
              return Identity($86($87));
          };
      },
      Monad0: function () {
          return monadIdentity;
      }
  };
  var monadRecFunction = {
      tailRecM: function (f) {
          return function (a0) {
              return function (e) {
                  return tailRec(function (a) {
                      return f(a)(e);
                  })(a0);
              };
          };
      },
      Monad0: function () {
          return monadFn;
      }
  };
  var monadRecEither = {
      tailRecM: function (f) {
          return function (a0) {
              var g = function (v) {
                  if (v instanceof Left) {
                      return new Done(new Left(v.value0));
                  };
                  if (v instanceof Right && v.value0 instanceof Loop) {
                      return new Loop(f(v.value0.value0));
                  };
                  if (v instanceof Right && v.value0 instanceof Done) {
                      return new Done(new Right(v.value0.value0));
                  };
                  throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 145, column 7 - line 145, column 33): " + [ v.constructor.name ]);
              };
              return tailRec(g)(f(a0));
          };
      },
      Monad0: function () {
          return monadEither;
      }
  };
  var monadRecEffect = {
      tailRecM: function (f) {
          return function (a) {
              var fromDone = function (v) {
                  if (v instanceof Done) {
                      return v.value0;
                  };
                  throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 137, column 30 - line 137, column 44): " + [ v.constructor.name ]);
              };
              return function __do() {
                  var r = bindFlipped$2($$new)(f(a))();
                  (function () {
                      while (!(function __do() {
                          var v = read$1(r)();
                          if (v instanceof Loop) {
                              var e = f(v.value0)();
                              write$1(e)(r)();
                              return false;
                          };
                          if (v instanceof Done) {
                              return true;
                          };
                          throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 128, column 22 - line 133, column 28): " + [ v.constructor.name ]);
                      })()) {

                      };
                      return {};
                  })();
                  return map$l(fromDone)(read$1(r))();
              };
          };
      },
      Monad0: function () {
          return monadEffect;
      }
  };
  var loop3 = function (a) {
      return function (b) {
          return function (c) {
              return new Loop({
                  a: a,
                  b: b,
                  c: c
              });
          };
      };
  };
  var loop2 = function (a) {
      return function (b) {
          return new Loop({
              a: a,
              b: b
          });
      };
  };
  var functorStep = {
      map: function (f) {
          return function (m) {
              if (m instanceof Loop) {
                  return new Loop(m.value0);
              };
              if (m instanceof Done) {
                  return new Done(f(m.value0));
              };
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 0, column 0 - line 0, column 0): " + [ m.constructor.name ]);
          };
      }
  };
  var forever = function (dictMonadRec) {
      var tailRecM1 = tailRecM(dictMonadRec);
      var voidRight$1 = voidRight((((dictMonadRec.Monad0()).Bind1()).Apply0()).Functor0());
      return function (ma) {
          return tailRecM1(function (u) {
              return voidRight$1(new Loop(u))(ma);
          })(unit);
      };
  };
  var bifunctorStep = {
      bimap: function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Loop) {
                      return new Loop(v(v2.value0));
                  };
                  if (v2 instanceof Done) {
                      return new Done(v1(v2.value0));
                  };
                  throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 33, column 1 - line 35, column 34): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
              };
          };
      }
  };

  const map_ = function (f) {
    return function (a) {
      return function () {
        return f(a());
      };
    };
  };

  const pure_ = function (a) {
    return function () {
      return a;
    };
  };

  const bind_ = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };

  const run$1 = function (f) {
    return f();
  };

  function whileST(f) {
    return function (a) {
      return function () {
        while (f()) {
          a();
        }
      };
    };
  }

  function forST(lo) {
    return function (hi) {
      return function (f) {
        return function () {
          for (var i = lo; i < hi; i++) {
            f(i)();
          }
        };
      };
    };
  }

  const foreach = function (as) {
    return function (f) {
      return function () {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };

  function newSTRef(val) {
    return function () {
      return { value: val };
    };
  }

  const read = function (ref) {
    return function () {
      return ref.value;
    };
  };

  const modifyImpl = function (f) {
    return function (ref) {
      return function () {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };

  const write = function (a) {
    return function (ref) {
      return function () {
        return ref.value = a; // eslint-disable-line no-return-assign
      };
    };
  };

  // Generated by purs version 0.15.15
  var $runtime_lazy$1 = function (name, moduleName, init) {
      var state = 0;
      var val;
      return function (lineNumber) {
          if (state === 2) return val;
          if (state === 1) throw new ReferenceError(name + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
          state = 1;
          val = init();
          state = 2;
          return val;
      };
  };
  var modify$prime = modifyImpl;
  var modify$2 = function (f) {
      return modify$prime(function (s) {
          var s$prime = f(s);
          return {
              state: s$prime,
              value: s$prime
          };
      });
  };
  var functorST = {
      map: map_
  };
  var map$k = /* #__PURE__ */ map$o(functorST);
  var $$void$3 = /* #__PURE__ */ $$void$5(functorST);
  var monadST = {
      Applicative0: function () {
          return applicativeST;
      },
      Bind1: function () {
          return bindST;
      }
  };
  var bindST = {
      bind: bind_,
      Apply0: function () {
          return $lazy_applyST(0);
      }
  };
  var applicativeST = {
      pure: pure_,
      Apply0: function () {
          return $lazy_applyST(0);
      }
  };
  var $lazy_applyST = /* #__PURE__ */ $runtime_lazy$1("applyST", "Control.Monad.ST.Internal", function () {
      return {
          apply: ap(monadST),
          Functor0: function () {
              return functorST;
          }
      };
  });
  var applyST = /* #__PURE__ */ $lazy_applyST(47);
  var lift2 = /* #__PURE__ */ lift2$2(applyST);
  var bind$3 = /* #__PURE__ */ bind$4(bindST);
  var bindFlipped$1 = /* #__PURE__ */ bindFlipped$3(bindST);
  var discard$1 = /* #__PURE__ */ discard$2(discardUnit)(bindST);
  var pure$1 = /* #__PURE__ */ pure$2(applicativeST);
  var semigroupST = function (dictSemigroup) {
      return {
          append: lift2(append$1(dictSemigroup))
      };
  };
  var monadRecST = {
      tailRecM: function (f) {
          return function (a) {
              var isLooping = function (v) {
                  if (v instanceof Loop) {
                      return true;
                  };
                  return false;
              };
              var fromDone = function (v) {
                  if (v instanceof Done) {
                      return v.value0;
                  };
                  throw new Error("Failed pattern match at Control.Monad.ST.Internal (line 70, column 32 - line 70, column 46): " + [ v.constructor.name ]);
              };
              return bind$3(bindFlipped$1(newSTRef)(f(a)))(function (r) {
                  return discard$1(whileST(map$k(isLooping)(read(r)))(bind$3(read(r))(function (v) {
                      if (v instanceof Loop) {
                          return bind$3(f(v.value0))(function (e) {
                              return $$void$3(write(e)(r));
                          });
                      };
                      if (v instanceof Done) {
                          return pure$1(unit);
                      };
                      throw new Error("Failed pattern match at Control.Monad.ST.Internal (line 62, column 18 - line 66, column 28): " + [ v.constructor.name ]);
                  })))(function () {
                      return map$k(fromDone)(read(r));
                  });
              });
          };
      },
      Monad0: function () {
          return monadST;
      }
  };
  var monoidST = function (dictMonoid) {
      var semigroupST1 = semigroupST(dictMonoid.Semigroup0());
      return {
          mempty: pure$1(mempty(dictMonoid)),
          Semigroup0: function () {
              return semigroupST1;
          }
      };
  };

  function newSTArray() {
    return [];
  }

  const peekImpl = function (just, nothing, i, xs) {
    return i >= 0 && i < xs.length ? just(xs[i]) : nothing;
  };

  const pokeImpl = function (i, a, xs) {
    var ret = i >= 0 && i < xs.length;
    if (ret) xs[i] = a;
    return ret;
  };

  const lengthImpl = function (xs) {
    return xs.length;
  };

  const popImpl = function (just, nothing, xs) {
    return xs.length > 0 ? just(xs.pop()) : nothing;
  };

  const pushAllImpl = function (as, xs) {
    return xs.push.apply(xs, as);
  };

  const shiftImpl = function (just, nothing, xs) {
    return xs.length > 0 ? just(xs.shift()) : nothing;
  };

  const unshiftAllImpl = function (as, xs) {
    return xs.unshift.apply(xs, as);
  };

  const spliceImpl = function (i, howMany, bs, xs) {
    return xs.splice.apply(xs, [i, howMany].concat(bs));
  };

  function unsafeFreezeThawImpl(xs) {
    return xs;
  }

  const unsafeFreezeImpl = unsafeFreezeThawImpl;

  const unsafeThawImpl = unsafeFreezeThawImpl;

  function copyImpl(xs) {
    return xs.slice();
  }

  const freezeImpl = copyImpl;

  const thawImpl = copyImpl;

  const cloneImpl = copyImpl;

  const sortByImpl = (function () {
    function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i;
      var j;
      var k;
      var x;
      var y;
      var c;

      mid = from + ((to - from) >> 1);
      if (mid - from > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);

      i = from;
      j = mid;
      k = from;
      while (i < mid && j < to) {
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare(x)(y));
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

    return function (compare, fromOrdering, xs) {
      if (xs.length < 2) return xs;

      mergeFromTo(compare, fromOrdering, xs, xs.slice(0), 0, xs.length);

      return xs;
    };
  })();

  const toAssocArrayImpl = function (xs) {
    var n = xs.length;
    var as = new Array(n);
    for (var i = 0; i < n; i++) as[i] = { value: xs[i], index: i };
    return as;
  };

  const pushImpl = function (a, xs) {
    return xs.push(a);
  };

  const mkSTFn1 = function mkSTFn1(fn) {
    return function(x) {
      return fn(x)();
    };
  };
    
  const mkSTFn2 = function mkSTFn2(fn) {
    return function(a, b) {
      return fn(a)(b)();
    };
  };
    
  const mkSTFn3 = function mkSTFn3(fn) {
    return function(a, b, c) {
      return fn(a)(b)(c)();
    };
  };
    
  const mkSTFn4 = function mkSTFn4(fn) {
    return function(a, b, c, d) {
      return fn(a)(b)(c)(d)();
    };
  };
    
  const mkSTFn5 = function mkSTFn5(fn) {
    return function(a, b, c, d, e) {
      return fn(a)(b)(c)(d)(e)();
    };
  };
    
  const mkSTFn6 = function mkSTFn6(fn) {
    return function(a, b, c, d, e, f) {
      return fn(a)(b)(c)(d)(e)(f)();
    };
  };
    
  const mkSTFn7 = function mkSTFn7(fn) {
    return function(a, b, c, d, e, f, g) {
      return fn(a)(b)(c)(d)(e)(f)(g)();
    };
  };
    
  const mkSTFn8 = function mkSTFn8(fn) {
    return function(a, b, c, d, e, f, g, h) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)();
    };
  };
    
  const mkSTFn9 = function mkSTFn9(fn) {
    return function(a, b, c, d, e, f, g, h, i) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)();
    };
  };
    
  const mkSTFn10 = function mkSTFn10(fn) {
    return function(a, b, c, d, e, f, g, h, i, j) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)();
    };
  };
    
  const runSTFn1 = function runSTFn1(fn) {
    return function(a) {
      return function() {
        return fn(a);
      };
    };
  };
    
  const runSTFn2 = function runSTFn2(fn) {
    return function(a) {
      return function(b) {
        return function() {
          return fn(a, b);
        };
      };
    };
  };
    
  const runSTFn3 = function runSTFn3(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function() {
            return fn(a, b, c);
          };
        };
      };
    };
  };
    
  const runSTFn4 = function runSTFn4(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function() {
              return fn(a, b, c, d);
            };
          };
        };
      };
    };
  };
    
  const runSTFn5 = function runSTFn5(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function() {
                return fn(a, b, c, d, e);
              };
            };
          };
        };
      };
    };
  };
    
  const runSTFn6 = function runSTFn6(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function() {
                  return fn(a, b, c, d, e, f);
                };
              };
            };
          };
        };
      };
    };
  };
    
  const runSTFn7 = function runSTFn7(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function() {
                    return fn(a, b, c, d, e, f, g);
                  };
                };
              };
            };
          };
        };
      };
    };
  };
    
  const runSTFn8 = function runSTFn8(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function(h) {
                    return function() {
                      return fn(a, b, c, d, e, f, g, h);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
    
  const runSTFn9 = function runSTFn9(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function(h) {
                    return function(i) {
                      return function() {
                        return fn(a, b, c, d, e, f, g, h, i);
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
    
  const runSTFn10 = function runSTFn10(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function(h) {
                    return function(i) {
                      return function(j) {
                        return function() {
                          return fn(a, b, c, d, e, f, g, h, i, j);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var bind$2 = /* #__PURE__ */ bind$4(bindST);
  var unshiftAll = /* #__PURE__ */ runSTFn2(unshiftAllImpl);
  var unshift = function (a) {
      return runSTFn2(unshiftAllImpl)([ a ]);
  };
  var unsafeThaw = /* #__PURE__ */ runSTFn1(unsafeThawImpl);
  var unsafeFreeze = /* #__PURE__ */ runSTFn1(unsafeFreezeImpl);
  var toAssocArray = /* #__PURE__ */ runSTFn1(toAssocArrayImpl);
  var thaw = /* #__PURE__ */ runSTFn1(thawImpl);
  var withArray = function (f) {
      return function (xs) {
          return function __do() {
              var result = thaw(xs)();
              f(result)();
              return unsafeFreeze(result)();
          };
      };
  };
  var splice = /* #__PURE__ */ runSTFn4(spliceImpl);
  var sortBy$1 = function (comp) {
      return runSTFn3(sortByImpl)(comp)(function (v) {
          if (v instanceof GT) {
              return 1;
          };
          if (v instanceof EQ) {
              return 0;
          };
          if (v instanceof LT) {
              return -1 | 0;
          };
          throw new Error("Failed pattern match at Data.Array.ST (line 129, column 40 - line 132, column 11): " + [ v.constructor.name ]);
      });
  };
  var sortWith$1 = function (dictOrd) {
      var comparing$1 = comparing(dictOrd);
      return function (f) {
          return sortBy$1(comparing$1(f));
      };
  };
  var sort$1 = function (dictOrd) {
      return sortBy$1(compare$3(dictOrd));
  };
  var shift = /* #__PURE__ */ (function () {
      return runSTFn3(shiftImpl)(Just.create)(Nothing.value);
  })();
  var run = function (st) {
      return bind$2(st)(unsafeFreeze)();
  };
  var pushAll$1 = /* #__PURE__ */ runSTFn2(pushAllImpl);
  var push = /* #__PURE__ */ runSTFn2(pushImpl);
  var pop = /* #__PURE__ */ (function () {
      return runSTFn3(popImpl)(Just.create)(Nothing.value);
  })();
  var poke = /* #__PURE__ */ runSTFn3(pokeImpl);
  var peek$1 = /* #__PURE__ */ (function () {
      return runSTFn4(peekImpl)(Just.create)(Nothing.value);
  })();
  var modify$1 = function (i) {
      return function (f) {
          return function (xs) {
              return function __do() {
                  var entry = peek$1(i)(xs)();
                  if (entry instanceof Just) {
                      return poke(i)(f(entry.value0))(xs)();
                  };
                  if (entry instanceof Nothing) {
                      return false;
                  };
                  throw new Error("Failed pattern match at Data.Array.ST (line 234, column 3 - line 236, column 26): " + [ entry.constructor.name ]);
              };
          };
      };
  };
  var length$6 = /* #__PURE__ */ runSTFn1(lengthImpl);
  var freeze = /* #__PURE__ */ runSTFn1(freezeImpl);
  var clone = /* #__PURE__ */ runSTFn1(cloneImpl);

  const boolConj = function (b1) {
    return function (b2) {
      return b1 && b2;
    };
  };

  const boolDisj = function (b1) {
    return function (b2) {
      return b1 || b2;
    };
  };

  const boolNot = function (b) {
    return !b;
  };

  // Generated by purs version 0.15.15
  var ttRecord = function (dict) {
      return dict.ttRecord;
  };
  var tt = function (dict) {
      return dict.tt;
  };
  var notRecord = function (dict) {
      return dict.notRecord;
  };
  var not$1 = function (dict) {
      return dict.not;
  };
  var impliesRecord = function (dict) {
      return dict.impliesRecord;
  };
  var implies = function (dict) {
      return dict.implies;
  };
  var heytingAlgebraUnit = {
      ff: unit,
      tt: unit,
      implies: function (v) {
          return function (v1) {
              return unit;
          };
      },
      conj: function (v) {
          return function (v1) {
              return unit;
          };
      },
      disj: function (v) {
          return function (v1) {
              return unit;
          };
      },
      not: function (v) {
          return unit;
      }
  };
  var heytingAlgebraRecordNil = {
      conjRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      },
      disjRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      },
      ffRecord: function (v) {
          return function (v1) {
              return {};
          };
      },
      impliesRecord: function (v) {
          return function (v1) {
              return function (v2) {
                  return {};
              };
          };
      },
      notRecord: function (v) {
          return function (v1) {
              return {};
          };
      },
      ttRecord: function (v) {
          return function (v1) {
              return {};
          };
      }
  };
  var heytingAlgebraProxy = /* #__PURE__ */ (function () {
      return {
          conj: function (v) {
              return function (v1) {
                  return $$Proxy.value;
              };
          },
          disj: function (v) {
              return function (v1) {
                  return $$Proxy.value;
              };
          },
          implies: function (v) {
              return function (v1) {
                  return $$Proxy.value;
              };
          },
          ff: $$Proxy.value,
          not: function (v) {
              return $$Proxy.value;
          },
          tt: $$Proxy.value
      };
  })();
  var ffRecord = function (dict) {
      return dict.ffRecord;
  };
  var ff = function (dict) {
      return dict.ff;
  };
  var disjRecord = function (dict) {
      return dict.disjRecord;
  };
  var disj = function (dict) {
      return dict.disj;
  };
  var heytingAlgebraBoolean = {
      ff: false,
      tt: true,
      implies: function (a) {
          return function (b) {
              return disj(heytingAlgebraBoolean)(not$1(heytingAlgebraBoolean)(a))(b);
          };
      },
      conj: boolConj,
      disj: boolDisj,
      not: boolNot
  };
  var conjRecord = function (dict) {
      return dict.conjRecord;
  };
  var heytingAlgebraRecord = function () {
      return function (dictHeytingAlgebraRecord) {
          return {
              ff: ffRecord(dictHeytingAlgebraRecord)($$Proxy.value)($$Proxy.value),
              tt: ttRecord(dictHeytingAlgebraRecord)($$Proxy.value)($$Proxy.value),
              conj: conjRecord(dictHeytingAlgebraRecord)($$Proxy.value),
              disj: disjRecord(dictHeytingAlgebraRecord)($$Proxy.value),
              implies: impliesRecord(dictHeytingAlgebraRecord)($$Proxy.value),
              not: notRecord(dictHeytingAlgebraRecord)($$Proxy.value)
          };
      };
  };
  var conj = function (dict) {
      return dict.conj;
  };
  var heytingAlgebraFunction = function (dictHeytingAlgebra) {
      var ff1 = ff(dictHeytingAlgebra);
      var tt1 = tt(dictHeytingAlgebra);
      var implies1 = implies(dictHeytingAlgebra);
      var conj1 = conj(dictHeytingAlgebra);
      var disj1 = disj(dictHeytingAlgebra);
      var not1 = not$1(dictHeytingAlgebra);
      return {
          ff: function (v) {
              return ff1;
          },
          tt: function (v) {
              return tt1;
          },
          implies: function (f) {
              return function (g) {
                  return function (a) {
                      return implies1(f(a))(g(a));
                  };
              };
          },
          conj: function (f) {
              return function (g) {
                  return function (a) {
                      return conj1(f(a))(g(a));
                  };
              };
          },
          disj: function (f) {
              return function (g) {
                  return function (a) {
                      return disj1(f(a))(g(a));
                  };
              };
          },
          not: function (f) {
              return function (a) {
                  return not1(f(a));
              };
          }
      };
  };
  var heytingAlgebraRecordCons = function (dictIsSymbol) {
      var reflectSymbol$1 = reflectSymbol(dictIsSymbol);
      return function () {
          return function (dictHeytingAlgebraRecord) {
              var conjRecord1 = conjRecord(dictHeytingAlgebraRecord);
              var disjRecord1 = disjRecord(dictHeytingAlgebraRecord);
              var impliesRecord1 = impliesRecord(dictHeytingAlgebraRecord);
              var ffRecord1 = ffRecord(dictHeytingAlgebraRecord);
              var notRecord1 = notRecord(dictHeytingAlgebraRecord);
              var ttRecord1 = ttRecord(dictHeytingAlgebraRecord);
              return function (dictHeytingAlgebra) {
                  var conj1 = conj(dictHeytingAlgebra);
                  var disj1 = disj(dictHeytingAlgebra);
                  var implies1 = implies(dictHeytingAlgebra);
                  var ff1 = ff(dictHeytingAlgebra);
                  var not1 = not$1(dictHeytingAlgebra);
                  var tt1 = tt(dictHeytingAlgebra);
                  return {
                      conjRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = conjRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(conj1(get(ra))(get(rb)))(tail);
                              };
                          };
                      },
                      disjRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = disjRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(disj1(get(ra))(get(rb)))(tail);
                              };
                          };
                      },
                      impliesRecord: function (v) {
                          return function (ra) {
                              return function (rb) {
                                  var tail = impliesRecord1($$Proxy.value)(ra)(rb);
                                  var key = reflectSymbol$1($$Proxy.value);
                                  var insert = unsafeSet(key);
                                  var get = unsafeGet(key);
                                  return insert(implies1(get(ra))(get(rb)))(tail);
                              };
                          };
                      },
                      ffRecord: function (v) {
                          return function (row) {
                              var tail = ffRecord1($$Proxy.value)(row);
                              var key = reflectSymbol$1($$Proxy.value);
                              var insert = unsafeSet(key);
                              return insert(ff1)(tail);
                          };
                      },
                      notRecord: function (v) {
                          return function (row) {
                              var tail = notRecord1($$Proxy.value)(row);
                              var key = reflectSymbol$1($$Proxy.value);
                              var insert = unsafeSet(key);
                              var get = unsafeGet(key);
                              return insert(not1(get(row)))(tail);
                          };
                      },
                      ttRecord: function (v) {
                          return function (row) {
                              var tail = ttRecord1($$Proxy.value)(row);
                              var key = reflectSymbol$1($$Proxy.value);
                              var insert = unsafeSet(key);
                              return insert(tt1)(tail);
                          };
                      }
                  };
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var map$j = /* #__PURE__ */ map$o(functorST);
  var not = /* #__PURE__ */ not$1(heytingAlgebraBoolean);
  var $$void$2 = /* #__PURE__ */ $$void$5(functorST);
  var Iterator = /* #__PURE__ */ (function () {
      function Iterator(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Iterator.create = function (value0) {
          return function (value1) {
              return new Iterator(value0, value1);
          };
      };
      return Iterator;
  })();
  var peek = function (v) {
      return function __do() {
          var i = read(v.value1)();
          return v.value0(i);
      };
  };
  var next = function (v) {
      return function __do() {
          var i = read(v.value1)();
          modify$2(function (v1) {
              return v1 + 1 | 0;
          })(v.value1)();
          return v.value0(i);
      };
  };
  var pushWhile = function (p) {
      return function (iter) {
          return function (array) {
              return function __do() {
                  var $$break = newSTRef(false)();
                  while (map$j(not)(read($$break))()) {
                      (function __do() {
                          var mx = peek(iter)();
                          if (mx instanceof Just && p(mx.value0)) {
                              push(mx.value0)(array)();
                              return $$void$2(next(iter))();
                          };
                          return $$void$2(write(true)($$break))();
                      })();
                  };
                  return {};
              };
          };
      };
  };
  var pushAll = /* #__PURE__ */ pushWhile(/* #__PURE__ */ $$const(true));
  var iterator = function (f) {
      return map$j(Iterator.create(f))(newSTRef(0));
  };
  var iterate = function (iter) {
      return function (f) {
          return function __do() {
              var $$break = newSTRef(false)();
              while (map$j(not)(read($$break))()) {
                  (function __do() {
                      var mx = next(iter)();
                      if (mx instanceof Just) {
                          return f(mx.value0)();
                      };
                      if (mx instanceof Nothing) {
                          return $$void$2(write(true)($$break))();
                      };
                      throw new Error("Failed pattern match at Data.Array.ST.Iterator (line 42, column 5 - line 44, column 47): " + [ mx.constructor.name ]);
                  })();
              };
              return {};
          };
      };
  };
  var exhausted = /* #__PURE__ */ (function () {
      var $20 = map$j(isNothing);
      return function ($21) {
          return $20(peek($21));
      };
  })();

  const foldrArray = function (f) {
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

  const foldlArray = function (f) {
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

  // Generated by purs version 0.15.15
  var plusArray = {
      empty: [  ],
      Alt0: function () {
          return altArray;
      }
  };
  var empty = function (dict) {
      return dict.empty;
  };

  const arrayExtend = function(f) {
    return function(xs) {
      return xs.map(function (_, i, xs) {
        return f(xs.slice(i));
      });
    };
  };

  // Generated by purs version 0.15.15
  var identity$5 = /* #__PURE__ */ identity$9(categoryFn);
  var extendFn = function (dictSemigroup) {
      var append = append$1(dictSemigroup);
      return {
          extend: function (f) {
              return function (g) {
                  return function (w) {
                      return f(function (w$prime) {
                          return g(append(w)(w$prime));
                      });
                  };
              };
          },
          Functor0: function () {
              return functorFn;
          }
      };
  };
  var extendArray = {
      extend: arrayExtend,
      Functor0: function () {
          return functorArray;
      }
  };
  var extend = function (dict) {
      return dict.extend;
  };
  var extendFlipped = function (dictExtend) {
      var extend1 = extend(dictExtend);
      return function (w) {
          return function (f) {
              return extend1(f)(w);
          };
      };
  };
  var duplicate = function (dictExtend) {
      return extend(dictExtend)(identity$5);
  };
  var composeCoKleisliFlipped = function (dictExtend) {
      var extend1 = extend(dictExtend);
      return function (f) {
          return function (g) {
              return function (w) {
                  return f(extend1(g)(w));
              };
          };
      };
  };
  var composeCoKleisli = function (dictExtend) {
      var extend1 = extend(dictExtend);
      return function (f) {
          return function (g) {
              return function (w) {
                  return g(extend1(f)(w));
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var extract = function (dict) {
      return dict.extract;
  };

  // Generated by purs version 0.15.15
  var Tuple = /* #__PURE__ */ (function () {
      function Tuple(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Tuple.create = function (value0) {
          return function (value1) {
              return new Tuple(value0, value1);
          };
      };
      return Tuple;
  })();
  var uncurry = function (f) {
      return function (v) {
          return f(v.value0)(v.value1);
      };
  };
  var swap = function (v) {
      return new Tuple(v.value1, v.value0);
  };
  var snd = function (v) {
      return v.value1;
  };
  var showTuple = function (dictShow) {
      var show = show$4(dictShow);
      return function (dictShow1) {
          var show1 = show$4(dictShow1);
          return {
              show: function (v) {
                  return "(Tuple " + (show(v.value0) + (" " + (show1(v.value1) + ")")));
              }
          };
      };
  };
  var semiringTuple = function (dictSemiring) {
      var add$1 = add(dictSemiring);
      var one$1 = one(dictSemiring);
      var mul$1 = mul(dictSemiring);
      var zero$1 = zero(dictSemiring);
      return function (dictSemiring1) {
          var add1 = add(dictSemiring1);
          var mul1 = mul(dictSemiring1);
          return {
              add: function (v) {
                  return function (v1) {
                      return new Tuple(add$1(v.value0)(v1.value0), add1(v.value1)(v1.value1));
                  };
              },
              one: new Tuple(one$1, one(dictSemiring1)),
              mul: function (v) {
                  return function (v1) {
                      return new Tuple(mul$1(v.value0)(v1.value0), mul1(v.value1)(v1.value1));
                  };
              },
              zero: new Tuple(zero$1, zero(dictSemiring1))
          };
      };
  };
  var semigroupoidTuple = {
      compose: function (v) {
          return function (v1) {
              return new Tuple(v1.value0, v.value1);
          };
      }
  };
  var semigroupTuple = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return function (dictSemigroup1) {
          var append2 = append$1(dictSemigroup1);
          return {
              append: function (v) {
                  return function (v1) {
                      return new Tuple(append1(v.value0)(v1.value0), append2(v.value1)(v1.value1));
                  };
              }
          };
      };
  };
  var ringTuple = function (dictRing) {
      var sub$1 = sub(dictRing);
      var semiringTuple1 = semiringTuple(dictRing.Semiring0());
      return function (dictRing1) {
          var sub1 = sub(dictRing1);
          var semiringTuple2 = semiringTuple1(dictRing1.Semiring0());
          return {
              sub: function (v) {
                  return function (v1) {
                      return new Tuple(sub$1(v.value0)(v1.value0), sub1(v.value1)(v1.value1));
                  };
              },
              Semiring0: function () {
                  return semiringTuple2;
              }
          };
      };
  };
  var monoidTuple = function (dictMonoid) {
      var mempty$1 = mempty(dictMonoid);
      var semigroupTuple1 = semigroupTuple(dictMonoid.Semigroup0());
      return function (dictMonoid1) {
          var semigroupTuple2 = semigroupTuple1(dictMonoid1.Semigroup0());
          return {
              mempty: new Tuple(mempty$1, mempty(dictMonoid1)),
              Semigroup0: function () {
                  return semigroupTuple2;
              }
          };
      };
  };
  var heytingAlgebraTuple = function (dictHeytingAlgebra) {
      var tt$1 = tt(dictHeytingAlgebra);
      var ff$1 = ff(dictHeytingAlgebra);
      var implies$1 = implies(dictHeytingAlgebra);
      var conj1 = conj(dictHeytingAlgebra);
      var disj$1 = disj(dictHeytingAlgebra);
      var not = not$1(dictHeytingAlgebra);
      return function (dictHeytingAlgebra1) {
          var implies1 = implies(dictHeytingAlgebra1);
          var conj2 = conj(dictHeytingAlgebra1);
          var disj1 = disj(dictHeytingAlgebra1);
          var not1 = not$1(dictHeytingAlgebra1);
          return {
              tt: new Tuple(tt$1, tt(dictHeytingAlgebra1)),
              ff: new Tuple(ff$1, ff(dictHeytingAlgebra1)),
              implies: function (v) {
                  return function (v1) {
                      return new Tuple(implies$1(v.value0)(v1.value0), implies1(v.value1)(v1.value1));
                  };
              },
              conj: function (v) {
                  return function (v1) {
                      return new Tuple(conj1(v.value0)(v1.value0), conj2(v.value1)(v1.value1));
                  };
              },
              disj: function (v) {
                  return function (v1) {
                      return new Tuple(disj$1(v.value0)(v1.value0), disj1(v.value1)(v1.value1));
                  };
              },
              not: function (v) {
                  return new Tuple(not(v.value0), not1(v.value1));
              }
          };
      };
  };
  var genericTuple = {
      to: function (x) {
          return new Tuple(x.value0, x.value1);
      },
      from: function (x) {
          return new Product$1(x.value0, x.value1);
      }
  };
  var functorTuple = {
      map: function (f) {
          return function (m) {
              return new Tuple(m.value0, f(m.value1));
          };
      }
  };
  var invariantTuple = {
      imap: /* #__PURE__ */ imapF(functorTuple)
  };
  var fst = function (v) {
      return v.value0;
  };
  var lazyTuple = function (dictLazy) {
      var defer = defer$1(dictLazy);
      return function (dictLazy1) {
          var defer1 = defer$1(dictLazy1);
          return {
              defer: function (f) {
                  return new Tuple(defer(function (v) {
                      return fst(f(unit));
                  }), defer1(function (v) {
                      return snd(f(unit));
                  }));
              }
          };
      };
  };
  var extendTuple = {
      extend: function (f) {
          return function (v) {
              return new Tuple(v.value0, f(v));
          };
      },
      Functor0: function () {
          return functorTuple;
      }
  };
  var eqTuple = function (dictEq) {
      var eq = eq$2(dictEq);
      return function (dictEq1) {
          var eq1 = eq$2(dictEq1);
          return {
              eq: function (x) {
                  return function (y) {
                      return eq(x.value0)(y.value0) && eq1(x.value1)(y.value1);
                  };
              }
          };
      };
  };
  var ordTuple = function (dictOrd) {
      var compare = compare$3(dictOrd);
      var eqTuple1 = eqTuple(dictOrd.Eq0());
      return function (dictOrd1) {
          var compare1 = compare$3(dictOrd1);
          var eqTuple2 = eqTuple1(dictOrd1.Eq0());
          return {
              compare: function (x) {
                  return function (y) {
                      var v = compare(x.value0)(y.value0);
                      if (v instanceof LT) {
                          return LT.value;
                      };
                      if (v instanceof GT) {
                          return GT.value;
                      };
                      return compare1(x.value1)(y.value1);
                  };
              },
              Eq0: function () {
                  return eqTuple2;
              }
          };
      };
  };
  var eq1Tuple = function (dictEq) {
      var eqTuple1 = eqTuple(dictEq);
      return {
          eq1: function (dictEq1) {
              return eq$2(eqTuple1(dictEq1));
          }
      };
  };
  var ord1Tuple = function (dictOrd) {
      var ordTuple1 = ordTuple(dictOrd);
      var eq1Tuple1 = eq1Tuple(dictOrd.Eq0());
      return {
          compare1: function (dictOrd1) {
              return compare$3(ordTuple1(dictOrd1));
          },
          Eq10: function () {
              return eq1Tuple1;
          }
      };
  };
  var curry = function (f) {
      return function (a) {
          return function (b) {
              return f(new Tuple(a, b));
          };
      };
  };
  var comonadTuple = {
      extract: snd,
      Extend0: function () {
          return extendTuple;
      }
  };
  var commutativeRingTuple = function (dictCommutativeRing) {
      var ringTuple1 = ringTuple(dictCommutativeRing.Ring0());
      return function (dictCommutativeRing1) {
          var ringTuple2 = ringTuple1(dictCommutativeRing1.Ring0());
          return {
              Ring0: function () {
                  return ringTuple2;
              }
          };
      };
  };
  var boundedTuple = function (dictBounded) {
      var top = top$2(dictBounded);
      var bottom = bottom$2(dictBounded);
      var ordTuple1 = ordTuple(dictBounded.Ord0());
      return function (dictBounded1) {
          var ordTuple2 = ordTuple1(dictBounded1.Ord0());
          return {
              top: new Tuple(top, top$2(dictBounded1)),
              bottom: new Tuple(bottom, bottom$2(dictBounded1)),
              Ord0: function () {
                  return ordTuple2;
              }
          };
      };
  };
  var booleanAlgebraTuple = function (dictBooleanAlgebra) {
      var heytingAlgebraTuple1 = heytingAlgebraTuple(dictBooleanAlgebra.HeytingAlgebra0());
      return function (dictBooleanAlgebra1) {
          var heytingAlgebraTuple2 = heytingAlgebraTuple1(dictBooleanAlgebra1.HeytingAlgebra0());
          return {
              HeytingAlgebra0: function () {
                  return heytingAlgebraTuple2;
              }
          };
      };
  };
  var applyTuple = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return {
          apply: function (v) {
              return function (v1) {
                  return new Tuple(append1(v.value0)(v1.value0), v.value1(v1.value1));
              };
          },
          Functor0: function () {
              return functorTuple;
          }
      };
  };
  var bindTuple = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      var applyTuple1 = applyTuple(dictSemigroup);
      return {
          bind: function (v) {
              return function (f) {
                  var v1 = f(v.value1);
                  return new Tuple(append1(v.value0)(v1.value0), v1.value1);
              };
          },
          Apply0: function () {
              return applyTuple1;
          }
      };
  };
  var applicativeTuple = function (dictMonoid) {
      var applyTuple1 = applyTuple(dictMonoid.Semigroup0());
      return {
          pure: Tuple.create(mempty(dictMonoid)),
          Apply0: function () {
              return applyTuple1;
          }
      };
  };
  var monadTuple = function (dictMonoid) {
      var applicativeTuple1 = applicativeTuple(dictMonoid);
      var bindTuple1 = bindTuple(dictMonoid.Semigroup0());
      return {
          Applicative0: function () {
              return applicativeTuple1;
          },
          Bind1: function () {
              return bindTuple1;
          }
      };
  };

  // Generated by purs version 0.15.15
  var identity$4 = /* #__PURE__ */ identity$9(categoryFn);
  var bimap$3 = function (dict) {
      return dict.bimap;
  };
  var bivoid = function (dictBifunctor) {
      return bimap$3(dictBifunctor)($$const(unit))($$const(unit));
  };
  var lmap = function (dictBifunctor) {
      var bimap1 = bimap$3(dictBifunctor);
      return function (f) {
          return bimap1(f)(identity$4);
      };
  };
  var rmap = function (dictBifunctor) {
      return bimap$3(dictBifunctor)(identity$4);
  };
  var bifunctorTuple = {
      bimap: function (f) {
          return function (g) {
              return function (v) {
                  return new Tuple(f(v.value0), g(v.value1));
              };
          };
      }
  };
  var bifunctorEither = {
      bimap: function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Left) {
                      return new Left(v(v2.value0));
                  };
                  if (v2 instanceof Right) {
                      return new Right(v1(v2.value0));
                  };
                  throw new Error("Failed pattern match at Data.Bifunctor (line 38, column 1 - line 40, column 36): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
              };
          };
      }
  };
  var bifunctorConst = {
      bimap: function (f) {
          return function (v) {
              return function (v1) {
                  return f(v1);
              };
          };
      }
  };

  // Generated by purs version 0.15.15
  var bimap$2 = /* #__PURE__ */ bimap$3(bifunctorEither);
  var Coproduct = function (x) {
      return x;
  };
  var showCoproduct = function (dictShow) {
      var show = show$4(dictShow);
      return function (dictShow1) {
          var show1 = show$4(dictShow1);
          return {
              show: function (v) {
                  if (v instanceof Left) {
                      return "(left " + (show(v.value0) + ")");
                  };
                  if (v instanceof Right) {
                      return "(right " + (show1(v.value0) + ")");
                  };
                  throw new Error("Failed pattern match at Data.Functor.Coproduct (line 63, column 1 - line 65, column 60): " + [ v.constructor.name ]);
              }
          };
      };
  };
  var right = function (ga) {
      return new Right(ga);
  };
  var newtypeCoproduct = {
      Coercible0: function () {
          return undefined;
      }
  };
  var left = function (fa) {
      return new Left(fa);
  };
  var functorCoproduct = function (dictFunctor) {
      var map = map$o(dictFunctor);
      return function (dictFunctor1) {
          var map1 = map$o(dictFunctor1);
          return {
              map: function (f) {
                  return function (v) {
                      return bimap$2(map(f))(map1(f))(v);
                  };
              }
          };
      };
  };
  var eq1Coproduct = function (dictEq1) {
      var eq1 = eq1$3(dictEq1);
      return function (dictEq11) {
          var eq11 = eq1$3(dictEq11);
          return {
              eq1: function (dictEq) {
                  var eq12 = eq1(dictEq);
                  var eq13 = eq11(dictEq);
                  return function (v) {
                      return function (v1) {
                          if (v instanceof Left && v1 instanceof Left) {
                              return eq12(v.value0)(v1.value0);
                          };
                          if (v instanceof Right && v1 instanceof Right) {
                              return eq13(v.value0)(v1.value0);
                          };
                          return false;
                      };
                  };
              }
          };
      };
  };
  var eqCoproduct = function (dictEq1) {
      var eq1Coproduct1 = eq1Coproduct(dictEq1);
      return function (dictEq11) {
          var eq1 = eq1$3(eq1Coproduct1(dictEq11));
          return function (dictEq) {
              return {
                  eq: eq1(dictEq)
              };
          };
      };
  };
  var ord1Coproduct = function (dictOrd1) {
      var compare1 = compare1$1(dictOrd1);
      var eq1Coproduct1 = eq1Coproduct(dictOrd1.Eq10());
      return function (dictOrd11) {
          var compare11 = compare1$1(dictOrd11);
          var eq1Coproduct2 = eq1Coproduct1(dictOrd11.Eq10());
          return {
              compare1: function (dictOrd) {
                  var compare12 = compare1(dictOrd);
                  var compare13 = compare11(dictOrd);
                  return function (v) {
                      return function (v1) {
                          if (v instanceof Left && v1 instanceof Left) {
                              return compare12(v.value0)(v1.value0);
                          };
                          if (v instanceof Left) {
                              return LT.value;
                          };
                          if (v1 instanceof Left) {
                              return GT.value;
                          };
                          if (v instanceof Right && v1 instanceof Right) {
                              return compare13(v.value0)(v1.value0);
                          };
                          throw new Error("Failed pattern match at Data.Functor.Coproduct (line 57, column 5 - line 61, column 43): " + [ v.constructor.name, v1.constructor.name ]);
                      };
                  };
              },
              Eq10: function () {
                  return eq1Coproduct2;
              }
          };
      };
  };
  var ordCoproduct = function (dictOrd1) {
      var ord1Coproduct1 = ord1Coproduct(dictOrd1);
      var eqCoproduct1 = eqCoproduct(dictOrd1.Eq10());
      return function (dictOrd11) {
          var compare1 = compare1$1(ord1Coproduct1(dictOrd11));
          var eqCoproduct2 = eqCoproduct1(dictOrd11.Eq10());
          return function (dictOrd) {
              var eqCoproduct3 = eqCoproduct2(dictOrd.Eq0());
              return {
                  compare: compare1(dictOrd),
                  Eq0: function () {
                      return eqCoproduct3;
                  }
              };
          };
      };
  };
  var coproduct = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Functor.Coproduct (line 27, column 1 - line 27, column 78): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var extendCoproduct = function (dictExtend) {
      var extend$1 = extend(dictExtend);
      var functorCoproduct1 = functorCoproduct(dictExtend.Functor0());
      return function (dictExtend1) {
          var extend1 = extend(dictExtend1);
          var functorCoproduct2 = functorCoproduct1(dictExtend1.Functor0());
          return {
              extend: function (f) {
                  var $106 = coproduct((function () {
                      var $108 = extend$1(function ($110) {
                          return f(Coproduct(Left.create($110)));
                      });
                      return function ($109) {
                          return Left.create($108($109));
                      };
                  })())((function () {
                      var $111 = extend1(function ($113) {
                          return f(Coproduct(Right.create($113)));
                      });
                      return function ($112) {
                          return Right.create($111($112));
                      };
                  })());
                  return function ($107) {
                      return Coproduct($106($107));
                  };
              },
              Functor0: function () {
                  return functorCoproduct2;
              }
          };
      };
  };
  var comonadCoproduct = function (dictComonad) {
      var extract$1 = extract(dictComonad);
      var extendCoproduct1 = extendCoproduct(dictComonad.Extend0());
      return function (dictComonad1) {
          var extendCoproduct2 = extendCoproduct1(dictComonad1.Extend0());
          return {
              extract: coproduct(extract$1)(extract(dictComonad1)),
              Extend0: function () {
                  return extendCoproduct2;
              }
          };
      };
  };
  var bihoistCoproduct = function (natF) {
      return function (natG) {
          return function (v) {
              return bimap$2(natF)(natG)(v);
          };
      };
  };

  // Generated by purs version 0.15.15
  var First = function (x) {
      return x;
  };
  var showFirst = function (dictShow) {
      var show = show$4(showMaybe(dictShow));
      return {
          show: function (v) {
              return "First (" + (show(v) + ")");
          }
      };
  };
  var semigroupFirst = {
      append: function (v) {
          return function (v1) {
              if (v instanceof Just) {
                  return v;
              };
              return v1;
          };
      }
  };
  var ordFirst = function (dictOrd) {
      return ordMaybe(dictOrd);
  };
  var ord1First = ord1Maybe;
  var newtypeFirst$1 = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidFirst = /* #__PURE__ */ (function () {
      return {
          mempty: Nothing.value,
          Semigroup0: function () {
              return semigroupFirst;
          }
      };
  })();
  var monadFirst = monadMaybe;
  var invariantFirst = invariantMaybe;
  var functorFirst = functorMaybe;
  var extendFirst = extendMaybe;
  var eqFirst = function (dictEq) {
      return eqMaybe(dictEq);
  };
  var eq1First = eq1Maybe;
  var boundedFirst = function (dictBounded) {
      return boundedMaybe(dictBounded);
  };
  var bindFirst = bindMaybe;
  var applyFirst = applyMaybe;
  var applicativeFirst = applicativeMaybe;
  var altFirst = {
      alt: /* #__PURE__ */ append$1(semigroupFirst),
      Functor0: function () {
          return functorFirst;
      }
  };
  var plusFirst = {
      empty: /* #__PURE__ */ mempty(monoidFirst),
      Alt0: function () {
          return altFirst;
      }
  };
  var alternativeFirst = {
      Applicative0: function () {
          return applicativeFirst;
      },
      Plus1: function () {
          return plusFirst;
      }
  };

  // Generated by purs version 0.15.15
  var Conj = function (x) {
      return x;
  };
  var showConj = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Conj " + (show(v) + ")");
          }
      };
  };
  var semiringConj = function (dictHeytingAlgebra) {
      var conj$1 = conj(dictHeytingAlgebra);
      var disj$1 = disj(dictHeytingAlgebra);
      return {
          zero: tt(dictHeytingAlgebra),
          one: ff(dictHeytingAlgebra),
          add: function (v) {
              return function (v1) {
                  return conj$1(v)(v1);
              };
          },
          mul: function (v) {
              return function (v1) {
                  return disj$1(v)(v1);
              };
          }
      };
  };
  var semigroupConj = function (dictHeytingAlgebra) {
      var conj$1 = conj(dictHeytingAlgebra);
      return {
          append: function (v) {
              return function (v1) {
                  return conj$1(v)(v1);
              };
          }
      };
  };
  var ordConj = function (dictOrd) {
      return dictOrd;
  };
  var monoidConj = function (dictHeytingAlgebra) {
      var semigroupConj1 = semigroupConj(dictHeytingAlgebra);
      return {
          mempty: tt(dictHeytingAlgebra),
          Semigroup0: function () {
              return semigroupConj1;
          }
      };
  };
  var functorConj = {
      map: function (f) {
          return function (m) {
              return f(m);
          };
      }
  };
  var eqConj = function (dictEq) {
      return dictEq;
  };
  var eq1Conj = {
      eq1: function (dictEq) {
          return eq$2(eqConj(dictEq));
      }
  };
  var ord1Conj = {
      compare1: function (dictOrd) {
          return compare$3(ordConj(dictOrd));
      },
      Eq10: function () {
          return eq1Conj;
      }
  };
  var boundedConj = function (dictBounded) {
      return dictBounded;
  };
  var applyConj = {
      apply: function (v) {
          return function (v1) {
              return v(v1);
          };
      },
      Functor0: function () {
          return functorConj;
      }
  };
  var bindConj = {
      bind: function (v) {
          return function (f) {
              return f(v);
          };
      },
      Apply0: function () {
          return applyConj;
      }
  };
  var applicativeConj = {
      pure: Conj,
      Apply0: function () {
          return applyConj;
      }
  };
  var monadConj = {
      Applicative0: function () {
          return applicativeConj;
      },
      Bind1: function () {
          return bindConj;
      }
  };

  // Generated by purs version 0.15.15
  var Disj = function (x) {
      return x;
  };
  var showDisj = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Disj " + (show(v) + ")");
          }
      };
  };
  var semiringDisj = function (dictHeytingAlgebra) {
      var disj$1 = disj(dictHeytingAlgebra);
      var conj$1 = conj(dictHeytingAlgebra);
      return {
          zero: ff(dictHeytingAlgebra),
          one: tt(dictHeytingAlgebra),
          add: function (v) {
              return function (v1) {
                  return disj$1(v)(v1);
              };
          },
          mul: function (v) {
              return function (v1) {
                  return conj$1(v)(v1);
              };
          }
      };
  };
  var semigroupDisj = function (dictHeytingAlgebra) {
      var disj$1 = disj(dictHeytingAlgebra);
      return {
          append: function (v) {
              return function (v1) {
                  return disj$1(v)(v1);
              };
          }
      };
  };
  var ordDisj = function (dictOrd) {
      return dictOrd;
  };
  var monoidDisj = function (dictHeytingAlgebra) {
      var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
      return {
          mempty: ff(dictHeytingAlgebra),
          Semigroup0: function () {
              return semigroupDisj1;
          }
      };
  };
  var functorDisj = {
      map: function (f) {
          return function (m) {
              return f(m);
          };
      }
  };
  var eqDisj = function (dictEq) {
      return dictEq;
  };
  var eq1Disj = {
      eq1: function (dictEq) {
          return eq$2(eqDisj(dictEq));
      }
  };
  var ord1Disj = {
      compare1: function (dictOrd) {
          return compare$3(ordDisj(dictOrd));
      },
      Eq10: function () {
          return eq1Disj;
      }
  };
  var boundedDisj = function (dictBounded) {
      return dictBounded;
  };
  var applyDisj = {
      apply: function (v) {
          return function (v1) {
              return v(v1);
          };
      },
      Functor0: function () {
          return functorDisj;
      }
  };
  var bindDisj = {
      bind: function (v) {
          return function (f) {
              return f(v);
          };
      },
      Apply0: function () {
          return applyDisj;
      }
  };
  var applicativeDisj = {
      pure: Disj,
      Apply0: function () {
          return applyDisj;
      }
  };
  var monadDisj = {
      Applicative0: function () {
          return applicativeDisj;
      },
      Bind1: function () {
          return bindDisj;
      }
  };

  // Generated by purs version 0.15.15
  var Dual = function (x) {
      return x;
  };
  var showDual = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Dual " + (show(v) + ")");
          }
      };
  };
  var semigroupDual$1 = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return {
          append: function (v) {
              return function (v1) {
                  return append1(v1)(v);
              };
          }
      };
  };
  var ordDual = function (dictOrd) {
      return dictOrd;
  };
  var monoidDual$1 = function (dictMonoid) {
      var semigroupDual1 = semigroupDual$1(dictMonoid.Semigroup0());
      return {
          mempty: mempty(dictMonoid),
          Semigroup0: function () {
              return semigroupDual1;
          }
      };
  };
  var functorDual = {
      map: function (f) {
          return function (m) {
              return f(m);
          };
      }
  };
  var eqDual = function (dictEq) {
      return dictEq;
  };
  var eq1Dual = {
      eq1: function (dictEq) {
          return eq$2(eqDual(dictEq));
      }
  };
  var ord1Dual = {
      compare1: function (dictOrd) {
          return compare$3(ordDual(dictOrd));
      },
      Eq10: function () {
          return eq1Dual;
      }
  };
  var boundedDual = function (dictBounded) {
      return dictBounded;
  };
  var applyDual = {
      apply: function (v) {
          return function (v1) {
              return v(v1);
          };
      },
      Functor0: function () {
          return functorDual;
      }
  };
  var bindDual = {
      bind: function (v) {
          return function (f) {
              return f(v);
          };
      },
      Apply0: function () {
          return applyDual;
      }
  };
  var applicativeDual = {
      pure: Dual,
      Apply0: function () {
          return applyDual;
      }
  };
  var monadDual = {
      Applicative0: function () {
          return applicativeDual;
      },
      Bind1: function () {
          return bindDual;
      }
  };

  // Generated by purs version 0.15.15
  var Endo = function (x) {
      return x;
  };
  var showEndo = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Endo " + (show(v) + ")");
          }
      };
  };
  var semigroupEndo = function (dictSemigroupoid) {
      var compose$1 = compose(dictSemigroupoid);
      return {
          append: function (v) {
              return function (v1) {
                  return compose$1(v)(v1);
              };
          }
      };
  };
  var ordEndo = function (dictOrd) {
      return dictOrd;
  };
  var monoidEndo$1 = function (dictCategory) {
      var semigroupEndo1 = semigroupEndo(dictCategory.Semigroupoid0());
      return {
          mempty: identity$9(dictCategory),
          Semigroup0: function () {
              return semigroupEndo1;
          }
      };
  };
  var eqEndo = function (dictEq) {
      return dictEq;
  };
  var boundedEndo = function (dictBounded) {
      return dictBounded;
  };

  // module Unsafe.Coerce

  const unsafeCoerce = function (x) {
    return x;
  };

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var coerce$1 = function () {
      return unsafeCoerce;
  };

  // Generated by purs version 0.15.15
  var coerce = /* #__PURE__ */ coerce$1();
  var wrap$1 = function () {
      return coerce;
  };
  var wrap1 = /* #__PURE__ */ wrap$1();
  var unwrap$2 = function () {
      return coerce;
  };
  var unwrap1 = /* #__PURE__ */ unwrap$2();
  var underF2 = function () {
      return function () {
          return function () {
              return function () {
                  return function (v) {
                      return coerce;
                  };
              };
          };
      };
  };
  var underF = function () {
      return function () {
          return function () {
              return function () {
                  return function (v) {
                      return coerce;
                  };
              };
          };
      };
  };
  var under2 = function () {
      return function () {
          return function (v) {
              return coerce;
          };
      };
  };
  var under = function () {
      return function () {
          return function (v) {
              return coerce;
          };
      };
  };
  var un = function () {
      return function (v) {
          return unwrap1;
      };
  };
  var traverse$2 = function () {
      return function () {
          return function (v) {
              return coerce;
          };
      };
  };
  var overF2 = function () {
      return function () {
          return function () {
              return function () {
                  return function (v) {
                      return coerce;
                  };
              };
          };
      };
  };
  var overF = function () {
      return function () {
          return function () {
              return function () {
                  return function (v) {
                      return coerce;
                  };
              };
          };
      };
  };
  var over2 = function () {
      return function () {
          return function (v) {
              return coerce;
          };
      };
  };
  var over = function () {
      return function () {
          return function (v) {
              return coerce;
          };
      };
  };
  var newtypeMultiplicative = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeLast$1 = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeFirst = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeEndo = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeDual = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeDisj = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeConj = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeAdditive = {
      Coercible0: function () {
          return undefined;
      }
  };
  var modify = function () {
      return function (fn) {
          return function (t) {
              return wrap1(fn(unwrap1(t)));
          };
      };
  };
  var collect = function () {
      return function () {
          return function (v) {
              return coerce;
          };
      };
  };
  var alaF$2 = function () {
      return function () {
          return function () {
              return function () {
                  return function (v) {
                      return coerce;
                  };
              };
          };
      };
  };
  var ala$1 = function () {
      return function () {
          return function () {
              return function (v) {
                  return function (f) {
                      return coerce(f(wrap1));
                  };
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var identity$3 = /* #__PURE__ */ identity$9(categoryFn);
  var eq1$2 = /* #__PURE__ */ eq$2(eqOrdering);
  var unwrap$1 = /* #__PURE__ */ unwrap$2();
  var monoidEndo = /* #__PURE__ */ monoidEndo$1(categoryFn);
  var monoidDual = /* #__PURE__ */ monoidDual$1(monoidEndo);
  var alaF$1 = /* #__PURE__ */ alaF$2()()()();
  var foldr$1 = function (dict) {
      return dict.foldr;
  };
  var indexr = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      return function (idx) {
          var go = function (a) {
              return function (cursor) {
                  if (cursor.elem instanceof Just) {
                      return cursor;
                  };
                  var $292 = cursor.pos === idx;
                  if ($292) {
                      return {
                          elem: new Just(a),
                          pos: cursor.pos
                      };
                  };
                  return {
                      pos: cursor.pos + 1 | 0,
                      elem: cursor.elem
                  };
              };
          };
          var $451 = foldr2(go)({
              elem: Nothing.value,
              pos: 0
          });
          return function ($452) {
              return (function (v) {
                  return v.elem;
              })($451($452));
          };
      };
  };
  var $$null$2 = function (dictFoldable) {
      return foldr$1(dictFoldable)(function (v) {
          return function (v1) {
              return false;
          };
      })(true);
  };
  var oneOf = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      return function (dictPlus) {
          return foldr2(alt$3(dictPlus.Alt0()))(empty(dictPlus));
      };
  };
  var oneOfMap = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      return function (dictPlus) {
          var alt = alt$3(dictPlus.Alt0());
          var empty$1 = empty(dictPlus);
          return function (f) {
              return foldr2(function ($453) {
                  return alt(f($453));
              })(empty$1);
          };
      };
  };
  var traverse_$2 = function (dictApplicative) {
      var applySecond$1 = applySecond(dictApplicative.Apply0());
      var pure = pure$2(dictApplicative);
      return function (dictFoldable) {
          var foldr2 = foldr$1(dictFoldable);
          return function (f) {
              return foldr2(function ($454) {
                  return applySecond$1(f($454));
              })(pure(unit));
          };
      };
  };
  var for_$1 = function (dictApplicative) {
      var traverse_1 = traverse_$2(dictApplicative);
      return function (dictFoldable) {
          return flip(traverse_1(dictFoldable));
      };
  };
  var sequence_ = function (dictApplicative) {
      var traverse_1 = traverse_$2(dictApplicative);
      return function (dictFoldable) {
          return traverse_1(dictFoldable)(identity$3);
      };
  };
  var foldl$1 = function (dict) {
      return dict.foldl;
  };
  var indexl = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (idx) {
          var go = function (cursor) {
              return function (a) {
                  if (cursor.elem instanceof Just) {
                      return cursor;
                  };
                  var $296 = cursor.pos === idx;
                  if ($296) {
                      return {
                          elem: new Just(a),
                          pos: cursor.pos
                      };
                  };
                  return {
                      pos: cursor.pos + 1 | 0,
                      elem: cursor.elem
                  };
              };
          };
          var $455 = foldl2(go)({
              elem: Nothing.value,
              pos: 0
          });
          return function ($456) {
              return (function (v) {
                  return v.elem;
              })($455($456));
          };
      };
  };
  var intercalate$2 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (dictMonoid) {
          var append = append$1(dictMonoid.Semigroup0());
          var mempty$1 = mempty(dictMonoid);
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (v1) {
                          if (v.init) {
                              return {
                                  init: false,
                                  acc: v1
                              };
                          };
                          return {
                              init: false,
                              acc: append(v.acc)(append(sep)(v1))
                          };
                      };
                  };
                  return (foldl2(go)({
                      init: true,
                      acc: mempty$1
                  })(xs)).acc;
              };
          };
      };
  };
  var length$5 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (dictSemiring) {
          var add1 = add(dictSemiring);
          var one$1 = one(dictSemiring);
          return foldl2(function (c) {
              return function (v) {
                  return add1(one$1)(c);
              };
          })(zero(dictSemiring));
      };
  };
  var maximumBy$1 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (cmp) {
          var max$prime = function (v) {
              return function (v1) {
                  if (v instanceof Nothing) {
                      return new Just(v1);
                  };
                  if (v instanceof Just) {
                      return new Just((function () {
                          var $303 = eq1$2(cmp(v.value0)(v1))(GT.value);
                          if ($303) {
                              return v.value0;
                          };
                          return v1;
                      })());
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 441, column 3 - line 441, column 27): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
          return foldl2(max$prime)(Nothing.value);
      };
  };
  var maximum$1 = function (dictOrd) {
      var compare = compare$3(dictOrd);
      return function (dictFoldable) {
          return maximumBy$1(dictFoldable)(compare);
      };
  };
  var minimumBy$1 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (cmp) {
          var min$prime = function (v) {
              return function (v1) {
                  if (v instanceof Nothing) {
                      return new Just(v1);
                  };
                  if (v instanceof Just) {
                      return new Just((function () {
                          var $307 = eq1$2(cmp(v.value0)(v1))(LT.value);
                          if ($307) {
                              return v.value0;
                          };
                          return v1;
                      })());
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 454, column 3 - line 454, column 27): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
          return foldl2(min$prime)(Nothing.value);
      };
  };
  var minimum$1 = function (dictOrd) {
      var compare = compare$3(dictOrd);
      return function (dictFoldable) {
          return minimumBy$1(dictFoldable)(compare);
      };
  };
  var product$1 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (dictSemiring) {
          return foldl2(mul(dictSemiring))(one(dictSemiring));
      };
  };
  var sum = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (dictSemiring) {
          return foldl2(add(dictSemiring))(zero(dictSemiring));
      };
  };
  var foldableTuple$1 = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v.value1)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v.value1);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v.value1);
              };
          };
      }
  };
  var foldableMultiplicative$1 = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      }
  };
  var foldableMaybe = {
      foldr: function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Nothing) {
                      return v1;
                  };
                  if (v2 instanceof Just) {
                      return v(v2.value0)(v1);
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
              };
          };
      },
      foldl: function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Nothing) {
                      return v1;
                  };
                  if (v2 instanceof Just) {
                      return v(v1)(v2.value0);
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
              };
          };
      },
      foldMap: function (dictMonoid) {
          var mempty$1 = mempty(dictMonoid);
          return function (v) {
              return function (v1) {
                  if (v1 instanceof Nothing) {
                      return mempty$1;
                  };
                  if (v1 instanceof Just) {
                      return v(v1.value0);
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
      }
  };
  var foldr1$1 = /* #__PURE__ */ foldr$1(foldableMaybe);
  var foldl1$1 = /* #__PURE__ */ foldl$1(foldableMaybe);
  var foldableIdentity$1 = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      }
  };
  var foldableEither = {
      foldr: function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Left) {
                      return v1;
                  };
                  if (v2 instanceof Right) {
                      return v(v2.value0)(v1);
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
              };
          };
      },
      foldl: function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Left) {
                      return v1;
                  };
                  if (v2 instanceof Right) {
                      return v(v1)(v2.value0);
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
              };
          };
      },
      foldMap: function (dictMonoid) {
          var mempty$1 = mempty(dictMonoid);
          return function (v) {
              return function (v1) {
                  if (v1 instanceof Left) {
                      return mempty$1;
                  };
                  if (v1 instanceof Right) {
                      return v(v1.value0);
                  };
                  throw new Error("Failed pattern match at Data.Foldable (line 181, column 1 - line 187, column 28): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
      }
  };
  var foldableDual$1 = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      }
  };
  var foldableDisj = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      }
  };
  var foldableConst = {
      foldr: function (v) {
          return function (z) {
              return function (v1) {
                  return z;
              };
          };
      },
      foldl: function (v) {
          return function (z) {
              return function (v1) {
                  return z;
              };
          };
      },
      foldMap: function (dictMonoid) {
          var mempty$1 = mempty(dictMonoid);
          return function (v) {
              return function (v1) {
                  return mempty$1;
              };
          };
      }
  };
  var foldableConj = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      }
  };
  var foldableAdditive = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return f(v)(z);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return f(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      }
  };
  var foldMapDefaultR = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      return function (dictMonoid) {
          var append = append$1(dictMonoid.Semigroup0());
          var mempty$1 = mempty(dictMonoid);
          return function (f) {
              return foldr2(function (x) {
                  return function (acc) {
                      return append(f(x))(acc);
                  };
              })(mempty$1);
          };
      };
  };
  var foldableArray = {
      foldr: foldrArray,
      foldl: foldlArray,
      foldMap: function (dictMonoid) {
          return foldMapDefaultR(foldableArray)(dictMonoid);
      }
  };
  var foldMapDefaultL = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (dictMonoid) {
          var append = append$1(dictMonoid.Semigroup0());
          var mempty$1 = mempty(dictMonoid);
          return function (f) {
              return foldl2(function (acc) {
                  return function (x) {
                      return append(acc)(f(x));
                  };
              })(mempty$1);
          };
      };
  };
  var foldMap$1 = function (dict) {
      return dict.foldMap;
  };
  var foldMap1$2 = /* #__PURE__ */ foldMap$1(foldableMaybe);
  var foldableApp = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      var foldl2 = foldl$1(dictFoldable);
      var foldMap2 = foldMap$1(dictFoldable);
      return {
          foldr: function (f) {
              return function (i) {
                  return function (v) {
                      return foldr2(f)(i)(v);
                  };
              };
          },
          foldl: function (f) {
              return function (i) {
                  return function (v) {
                      return foldl2(f)(i)(v);
                  };
              };
          },
          foldMap: function (dictMonoid) {
              var foldMap3 = foldMap2(dictMonoid);
              return function (f) {
                  return function (v) {
                      return foldMap3(f)(v);
                  };
              };
          }
      };
  };
  var foldableCompose = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      var foldl2 = foldl$1(dictFoldable);
      var foldMap2 = foldMap$1(dictFoldable);
      return function (dictFoldable1) {
          var foldr3 = foldr$1(dictFoldable1);
          var foldl3 = foldl$1(dictFoldable1);
          var foldMap3 = foldMap$1(dictFoldable1);
          return {
              foldr: function (f) {
                  return function (i) {
                      return function (v) {
                          return foldr2(flip(foldr3(f)))(i)(v);
                      };
                  };
              },
              foldl: function (f) {
                  return function (i) {
                      return function (v) {
                          return foldl2(foldl3(f))(i)(v);
                      };
                  };
              },
              foldMap: function (dictMonoid) {
                  var foldMap4 = foldMap2(dictMonoid);
                  var foldMap5 = foldMap3(dictMonoid);
                  return function (f) {
                      return function (v) {
                          return foldMap4(foldMap5(f))(v);
                      };
                  };
              }
          };
      };
  };
  var foldableCoproduct = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      var foldl2 = foldl$1(dictFoldable);
      var foldMap2 = foldMap$1(dictFoldable);
      return function (dictFoldable1) {
          var foldr3 = foldr$1(dictFoldable1);
          var foldl3 = foldl$1(dictFoldable1);
          var foldMap3 = foldMap$1(dictFoldable1);
          return {
              foldr: function (f) {
                  return function (z) {
                      return coproduct(foldr2(f)(z))(foldr3(f)(z));
                  };
              },
              foldl: function (f) {
                  return function (z) {
                      return coproduct(foldl2(f)(z))(foldl3(f)(z));
                  };
              },
              foldMap: function (dictMonoid) {
                  var foldMap4 = foldMap2(dictMonoid);
                  var foldMap5 = foldMap3(dictMonoid);
                  return function (f) {
                      return coproduct(foldMap4(f))(foldMap5(f));
                  };
              }
          };
      };
  };
  var foldableFirst = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return foldr1$1(f)(z)(v);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return foldl1$1(f)(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          var foldMap2 = foldMap1$2(dictMonoid);
          return function (f) {
              return function (v) {
                  return foldMap2(f)(v);
              };
          };
      }
  };
  var foldableLast = {
      foldr: function (f) {
          return function (z) {
              return function (v) {
                  return foldr1$1(f)(z)(v);
              };
          };
      },
      foldl: function (f) {
          return function (z) {
              return function (v) {
                  return foldl1$1(f)(z)(v);
              };
          };
      },
      foldMap: function (dictMonoid) {
          var foldMap2 = foldMap1$2(dictMonoid);
          return function (f) {
              return function (v) {
                  return foldMap2(f)(v);
              };
          };
      }
  };
  var foldableProduct = function (dictFoldable) {
      var foldr2 = foldr$1(dictFoldable);
      var foldl2 = foldl$1(dictFoldable);
      var foldMap2 = foldMap$1(dictFoldable);
      return function (dictFoldable1) {
          var foldr3 = foldr$1(dictFoldable1);
          var foldl3 = foldl$1(dictFoldable1);
          var foldMap3 = foldMap$1(dictFoldable1);
          return {
              foldr: function (f) {
                  return function (z) {
                      return function (v) {
                          return foldr2(f)(foldr3(f)(z)(v.value1))(v.value0);
                      };
                  };
              },
              foldl: function (f) {
                  return function (z) {
                      return function (v) {
                          return foldl3(f)(foldl2(f)(z)(v.value0))(v.value1);
                      };
                  };
              },
              foldMap: function (dictMonoid) {
                  var append = append$1(dictMonoid.Semigroup0());
                  var foldMap4 = foldMap2(dictMonoid);
                  var foldMap5 = foldMap3(dictMonoid);
                  return function (f) {
                      return function (v) {
                          return append(foldMap4(f)(v.value0))(foldMap5(f)(v.value1));
                      };
                  };
              }
          };
      };
  };
  var foldlDefault = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable)(monoidDual);
      return function (c) {
          return function (u) {
              return function (xs) {
                  return unwrap$1(unwrap$1(foldMap2((function () {
                      var $457 = flip(c);
                      return function ($458) {
                          return Dual(Endo($457($458)));
                      };
                  })())(xs)))(u);
              };
          };
      };
  };
  var foldrDefault = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable)(monoidEndo);
      return function (c) {
          return function (u) {
              return function (xs) {
                  return unwrap$1(foldMap2(function ($459) {
                      return Endo(c($459));
                  })(xs))(u);
              };
          };
      };
  };
  var lookup = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable)(monoidFirst);
      return function (dictEq) {
          var eq2 = eq$2(dictEq);
          return function (a) {
              var $460 = foldMap2(function (v) {
                  var $444 = eq2(a)(v.value0);
                  if ($444) {
                      return new Just(v.value1);
                  };
                  return Nothing.value;
              });
              return function ($461) {
                  return unwrap$1($460($461));
              };
          };
      };
  };
  var surroundMap = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable)(monoidEndo);
      return function (dictSemigroup) {
          var append = append$1(dictSemigroup);
          return function (d) {
              return function (t) {
                  return function (f) {
                      var joined = function (a) {
                          return function (m) {
                              return append(d)(append(t(a))(m));
                          };
                      };
                      return unwrap$1(foldMap2(joined)(f))(d);
                  };
              };
          };
      };
  };
  var surround = function (dictFoldable) {
      var surroundMap1 = surroundMap(dictFoldable);
      return function (dictSemigroup) {
          var surroundMap2 = surroundMap1(dictSemigroup);
          return function (d) {
              return surroundMap2(d)(identity$3);
          };
      };
  };
  var foldM$1 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (dictMonad) {
          var bind = bind$4(dictMonad.Bind1());
          var pure = pure$2(dictMonad.Applicative0());
          return function (f) {
              return function (b0) {
                  return foldl2(function (b) {
                      return function (a) {
                          return bind(b)(flip(f)(a));
                      };
                  })(pure(b0));
              };
          };
      };
  };
  var fold$1 = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable);
      return function (dictMonoid) {
          return foldMap2(dictMonoid)(identity$3);
      };
  };
  var findMap$1 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (p) {
          var go = function (v) {
              return function (v1) {
                  if (v instanceof Nothing) {
                      return p(v1);
                  };
                  return v;
              };
          };
          return foldl2(go)(Nothing.value);
      };
  };
  var find$1 = function (dictFoldable) {
      var foldl2 = foldl$1(dictFoldable);
      return function (p) {
          var go = function (v) {
              return function (v1) {
                  if (v instanceof Nothing && p(v1)) {
                      return new Just(v1);
                  };
                  return v;
              };
          };
          return foldl2(go)(Nothing.value);
      };
  };
  var any$1 = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable);
      return function (dictHeytingAlgebra) {
          return alaF$1(Disj)(foldMap2(monoidDisj(dictHeytingAlgebra)));
      };
  };
  var elem$1 = function (dictFoldable) {
      var any1 = any$1(dictFoldable)(heytingAlgebraBoolean);
      return function (dictEq) {
          var $462 = eq$2(dictEq);
          return function ($463) {
              return any1($462($463));
          };
      };
  };
  var notElem$1 = function (dictFoldable) {
      var elem1 = elem$1(dictFoldable);
      return function (dictEq) {
          var elem2 = elem1(dictEq);
          return function (x) {
              var $464 = elem2(x);
              return function ($465) {
                  return !$464($465);
              };
          };
      };
  };
  var or = function (dictFoldable) {
      var any1 = any$1(dictFoldable);
      return function (dictHeytingAlgebra) {
          return any1(dictHeytingAlgebra)(identity$3);
      };
  };
  var all$1 = function (dictFoldable) {
      var foldMap2 = foldMap$1(dictFoldable);
      return function (dictHeytingAlgebra) {
          return alaF$1(Conj)(foldMap2(monoidConj(dictHeytingAlgebra)));
      };
  };
  var and = function (dictFoldable) {
      var all1 = all$1(dictFoldable);
      return function (dictHeytingAlgebra) {
          return all1(dictHeytingAlgebra)(identity$3);
      };
  };

  // module Data.Function.Uncurried

  const mkFn0 = function (fn) {
    return function () {
      return fn();
    };
  };

  const mkFn2 = function (fn) {
    /* jshint maxparams: 2 */
    return function (a, b) {
      return fn(a)(b);
    };
  };

  const mkFn3 = function (fn) {
    /* jshint maxparams: 3 */
    return function (a, b, c) {
      return fn(a)(b)(c);
    };
  };

  const mkFn4 = function (fn) {
    /* jshint maxparams: 4 */
    return function (a, b, c, d) {
      return fn(a)(b)(c)(d);
    };
  };

  const mkFn5 = function (fn) {
    /* jshint maxparams: 5 */
    return function (a, b, c, d, e) {
      return fn(a)(b)(c)(d)(e);
    };
  };

  const mkFn6 = function (fn) {
    /* jshint maxparams: 6 */
    return function (a, b, c, d, e, f) {
      return fn(a)(b)(c)(d)(e)(f);
    };
  };

  const mkFn7 = function (fn) {
    /* jshint maxparams: 7 */
    return function (a, b, c, d, e, f, g) {
      return fn(a)(b)(c)(d)(e)(f)(g);
    };
  };

  const mkFn8 = function (fn) {
    /* jshint maxparams: 8 */
    return function (a, b, c, d, e, f, g, h) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h);
    };
  };

  const mkFn9 = function (fn) {
    /* jshint maxparams: 9 */
    return function (a, b, c, d, e, f, g, h, i) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)(i);
    };
  };

  const mkFn10 = function (fn) {
    /* jshint maxparams: 10 */
    return function (a, b, c, d, e, f, g, h, i, j) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j);
    };
  };

  const runFn0 = function (fn) {
    return fn();
  };

  const runFn2 = function (fn) {
    return function (a) {
      return function (b) {
        return fn(a, b);
      };
    };
  };

  const runFn3 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return fn(a, b, c);
        };
      };
    };
  };

  const runFn4 = function (fn) {
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

  const runFn5 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return fn(a, b, c, d, e);
            };
          };
        };
      };
    };
  };

  const runFn6 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return function (f) {
                return fn(a, b, c, d, e, f);
              };
            };
          };
        };
      };
    };
  };

  const runFn7 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return function (f) {
                return function (g) {
                  return fn(a, b, c, d, e, f, g);
                };
              };
            };
          };
        };
      };
    };
  };

  const runFn8 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return function (f) {
                return function (g) {
                  return function (h) {
                    return fn(a, b, c, d, e, f, g, h);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  const runFn9 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return function (f) {
                return function (g) {
                  return function (h) {
                    return function (i) {
                      return fn(a, b, c, d, e, f, g, h, i);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  const runFn10 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return function (e) {
              return function (f) {
                return function (g) {
                  return function (h) {
                    return function (i) {
                      return function (j) {
                        return fn(a, b, c, d, e, f, g, h, i, j);
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Generated by purs version 0.15.15
  var runFn1 = function (f) {
      return f;
  };
  var mkFn1 = function (f) {
      return f;
  };

  const mapWithIndexArray = function (f) {
    return function (xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(i)(xs[i]);
      }
      return result;
    };
  };

  // Generated by purs version 0.15.15
  var Const = function (x) {
      return x;
  };
  var showConst = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Const " + (show(v) + ")");
          }
      };
  };
  var semiringConst = function (dictSemiring) {
      return dictSemiring;
  };
  var semigroupoidConst = {
      compose: function (v) {
          return function (v1) {
              return v1;
          };
      }
  };
  var semigroupConst = function (dictSemigroup) {
      return dictSemigroup;
  };
  var ringConst = function (dictRing) {
      return dictRing;
  };
  var ordConst = function (dictOrd) {
      return dictOrd;
  };
  var newtypeConst = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidConst = function (dictMonoid) {
      return dictMonoid;
  };
  var heytingAlgebraConst = function (dictHeytingAlgebra) {
      return dictHeytingAlgebra;
  };
  var functorConst = {
      map: function (f) {
          return function (m) {
              return m;
          };
      }
  };
  var invariantConst = {
      imap: /* #__PURE__ */ imapF(functorConst)
  };
  var euclideanRingConst = function (dictEuclideanRing) {
      return dictEuclideanRing;
  };
  var eqConst = function (dictEq) {
      return dictEq;
  };
  var eq1Const = function (dictEq) {
      var eq = eq$2(eqConst(dictEq));
      return {
          eq1: function (dictEq1) {
              return eq;
          }
      };
  };
  var ord1Const = function (dictOrd) {
      var compare = compare$3(ordConst(dictOrd));
      var eq1Const1 = eq1Const(dictOrd.Eq0());
      return {
          compare1: function (dictOrd1) {
              return compare;
          },
          Eq10: function () {
              return eq1Const1;
          }
      };
  };
  var commutativeRingConst = function (dictCommutativeRing) {
      return dictCommutativeRing;
  };
  var boundedConst = function (dictBounded) {
      return dictBounded;
  };
  var booleanAlgebraConst = function (dictBooleanAlgebra) {
      return dictBooleanAlgebra;
  };
  var applyConst = function (dictSemigroup) {
      var append1 = append$1(dictSemigroup);
      return {
          apply: function (v) {
              return function (v1) {
                  return append1(v)(v1);
              };
          },
          Functor0: function () {
              return functorConst;
          }
      };
  };
  var applicativeConst = function (dictMonoid) {
      var mempty$1 = mempty(dictMonoid);
      var applyConst1 = applyConst(dictMonoid.Semigroup0());
      return {
          pure: function (v) {
              return mempty$1;
          },
          Apply0: function () {
              return applyConst1;
          }
      };
  };

  // Generated by purs version 0.15.15
  var App = function (x) {
      return x;
  };
  var showApp = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(App " + (show(v) + ")");
          }
      };
  };
  var semigroupApp = function (dictApply) {
      var lift2 = lift2$2(dictApply);
      return function (dictSemigroup) {
          var append1 = append$1(dictSemigroup);
          return {
              append: function (v) {
                  return function (v1) {
                      return lift2(append1)(v)(v1);
                  };
              }
          };
      };
  };
  var plusApp = function (dictPlus) {
      return dictPlus;
  };
  var newtypeApp = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidApp = function (dictApplicative) {
      var pure = pure$2(dictApplicative);
      var semigroupApp1 = semigroupApp(dictApplicative.Apply0());
      return function (dictMonoid) {
          var semigroupApp2 = semigroupApp1(dictMonoid.Semigroup0());
          return {
              mempty: pure(mempty(dictMonoid)),
              Semigroup0: function () {
                  return semigroupApp2;
              }
          };
      };
  };
  var monadPlusApp = function (dictMonadPlus) {
      return dictMonadPlus;
  };
  var monadApp = function (dictMonad) {
      return dictMonad;
  };
  var lazyApp = function (dictLazy) {
      return dictLazy;
  };
  var hoistLowerApp = unsafeCoerce;
  var hoistLiftApp = unsafeCoerce;
  var hoistApp = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorApp = function (dictFunctor) {
      return dictFunctor;
  };
  var extendApp = function (dictExtend) {
      return dictExtend;
  };
  var eqApp = function (dictEq1) {
      var eq1 = eq1$3(dictEq1);
      return function (dictEq) {
          var eq11 = eq1(dictEq);
          return {
              eq: function (x) {
                  return function (y) {
                      return eq11(x)(y);
                  };
              }
          };
      };
  };
  var ordApp = function (dictOrd1) {
      var compare1 = compare1$1(dictOrd1);
      var eqApp1 = eqApp(dictOrd1.Eq10());
      return function (dictOrd) {
          var compare11 = compare1(dictOrd);
          var eqApp2 = eqApp1(dictOrd.Eq0());
          return {
              compare: function (x) {
                  return function (y) {
                      return compare11(x)(y);
                  };
              },
              Eq0: function () {
                  return eqApp2;
              }
          };
      };
  };
  var eq1App = function (dictEq1) {
      var eqApp1 = eqApp(dictEq1);
      return {
          eq1: function (dictEq) {
              return eq$2(eqApp1(dictEq));
          }
      };
  };
  var ord1App = function (dictOrd1) {
      var ordApp1 = ordApp(dictOrd1);
      var eq1App1 = eq1App(dictOrd1.Eq10());
      return {
          compare1: function (dictOrd) {
              return compare$3(ordApp1(dictOrd));
          },
          Eq10: function () {
              return eq1App1;
          }
      };
  };
  var comonadApp = function (dictComonad) {
      return dictComonad;
  };
  var bindApp = function (dictBind) {
      return dictBind;
  };
  var applyApp = function (dictApply) {
      return dictApply;
  };
  var applicativeApp = function (dictApplicative) {
      return dictApplicative;
  };
  var alternativeApp = function (dictAlternative) {
      return dictAlternative;
  };
  var altApp = function (dictAlt) {
      return dictAlt;
  };

  // Generated by purs version 0.15.15
  var Compose = function (x) {
      return x;
  };
  var showCompose = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Compose " + (show(v) + ")");
          }
      };
  };
  var newtypeCompose = {
      Coercible0: function () {
          return undefined;
      }
  };
  var functorCompose = function (dictFunctor) {
      var map = map$o(dictFunctor);
      return function (dictFunctor1) {
          var map1 = map$o(dictFunctor1);
          return {
              map: function (f) {
                  return function (v) {
                      return map(map1(f))(v);
                  };
              }
          };
      };
  };
  var eqCompose = function (dictEq1) {
      var eq1 = eq1$3(dictEq1);
      return function (dictEq11) {
          var eqApp$1 = eqApp(dictEq11);
          return function (dictEq) {
              var eq11 = eq1(eqApp$1(dictEq));
              return {
                  eq: function (v) {
                      return function (v1) {
                          return eq11(hoistLiftApp(v))(hoistLiftApp(v1));
                      };
                  }
              };
          };
      };
  };
  var ordCompose = function (dictOrd1) {
      var compare1 = compare1$1(dictOrd1);
      var eqCompose1 = eqCompose(dictOrd1.Eq10());
      return function (dictOrd11) {
          var ordApp$1 = ordApp(dictOrd11);
          var eqCompose2 = eqCompose1(dictOrd11.Eq10());
          return function (dictOrd) {
              var compare11 = compare1(ordApp$1(dictOrd));
              var eqCompose3 = eqCompose2(dictOrd.Eq0());
              return {
                  compare: function (v) {
                      return function (v1) {
                          return compare11(hoistLiftApp(v))(hoistLiftApp(v1));
                      };
                  },
                  Eq0: function () {
                      return eqCompose3;
                  }
              };
          };
      };
  };
  var eq1Compose = function (dictEq1) {
      var eqCompose1 = eqCompose(dictEq1);
      return function (dictEq11) {
          var eqCompose2 = eqCompose1(dictEq11);
          return {
              eq1: function (dictEq) {
                  return eq$2(eqCompose2(dictEq));
              }
          };
      };
  };
  var ord1Compose = function (dictOrd1) {
      var ordCompose1 = ordCompose(dictOrd1);
      var eq1Compose1 = eq1Compose(dictOrd1.Eq10());
      return function (dictOrd11) {
          var ordCompose2 = ordCompose1(dictOrd11);
          var eq1Compose2 = eq1Compose1(dictOrd11.Eq10());
          return {
              compare1: function (dictOrd) {
                  return compare$3(ordCompose2(dictOrd));
              },
              Eq10: function () {
                  return eq1Compose2;
              }
          };
      };
  };
  var bihoistCompose = function (dictFunctor) {
      var map = map$o(dictFunctor);
      return function (natF) {
          return function (natG) {
              return function (v) {
                  return natF(map(natG)(v));
              };
          };
      };
  };
  var applyCompose = function (dictApply) {
      var apply = apply$4(dictApply);
      var Functor0 = dictApply.Functor0();
      var map = map$o(Functor0);
      var functorCompose1 = functorCompose(Functor0);
      return function (dictApply1) {
          var apply1 = apply$4(dictApply1);
          var functorCompose2 = functorCompose1(dictApply1.Functor0());
          return {
              apply: function (v) {
                  return function (v1) {
                      return apply(map(apply1)(v))(v1);
                  };
              },
              Functor0: function () {
                  return functorCompose2;
              }
          };
      };
  };
  var applicativeCompose = function (dictApplicative) {
      var pure = pure$2(dictApplicative);
      var applyCompose1 = applyCompose(dictApplicative.Apply0());
      return function (dictApplicative1) {
          var applyCompose2 = applyCompose1(dictApplicative1.Apply0());
          return {
              pure: (function () {
                  var $112 = pure$2(dictApplicative1);
                  return function ($113) {
                      return Compose(pure($112($113)));
                  };
              })(),
              Apply0: function () {
                  return applyCompose2;
              }
          };
      };
  };
  var altCompose = function (dictAlt) {
      var alt = alt$3(dictAlt);
      var functorCompose1 = functorCompose(dictAlt.Functor0());
      return function (dictFunctor) {
          var functorCompose2 = functorCompose1(dictFunctor);
          return {
              alt: function (v) {
                  return function (v1) {
                      return alt(v)(v1);
                  };
              },
              Functor0: function () {
                  return functorCompose2;
              }
          };
      };
  };
  var plusCompose = function (dictPlus) {
      var empty$1 = empty(dictPlus);
      var altCompose1 = altCompose(dictPlus.Alt0());
      return function (dictFunctor) {
          var altCompose2 = altCompose1(dictFunctor);
          return {
              empty: empty$1,
              Alt0: function () {
                  return altCompose2;
              }
          };
      };
  };
  var alternativeCompose = function (dictAlternative) {
      var applicativeCompose1 = applicativeCompose(dictAlternative.Applicative0());
      var plusCompose1 = plusCompose(dictAlternative.Plus1());
      return function (dictApplicative) {
          var applicativeCompose2 = applicativeCompose1(dictApplicative);
          var plusCompose2 = plusCompose1((dictApplicative.Apply0()).Functor0());
          return {
              Applicative0: function () {
                  return applicativeCompose2;
              },
              Plus1: function () {
                  return plusCompose2;
              }
          };
      };
  };

  // Generated by purs version 0.15.15
  var bimap$1 = /* #__PURE__ */ bimap$3(bifunctorTuple);
  var unwrap = /* #__PURE__ */ unwrap$2();
  var Product = function (x) {
      return x;
  };
  var showProduct = function (dictShow) {
      var show = show$4(dictShow);
      return function (dictShow1) {
          var show1 = show$4(dictShow1);
          return {
              show: function (v) {
                  return "(product " + (show(v.value0) + (" " + (show1(v.value1) + ")")));
              }
          };
      };
  };
  var product = function (fa) {
      return function (ga) {
          return new Tuple(fa, ga);
      };
  };
  var newtypeProduct = {
      Coercible0: function () {
          return undefined;
      }
  };
  var functorProduct = function (dictFunctor) {
      var map = map$o(dictFunctor);
      return function (dictFunctor1) {
          var map1 = map$o(dictFunctor1);
          return {
              map: function (f) {
                  return function (v) {
                      return bimap$1(map(f))(map1(f))(v);
                  };
              }
          };
      };
  };
  var eq1Product = function (dictEq1) {
      var eq1 = eq1$3(dictEq1);
      return function (dictEq11) {
          var eq11 = eq1$3(dictEq11);
          return {
              eq1: function (dictEq) {
                  var eq12 = eq1(dictEq);
                  var eq13 = eq11(dictEq);
                  return function (v) {
                      return function (v1) {
                          return eq12(v.value0)(v1.value0) && eq13(v.value1)(v1.value1);
                      };
                  };
              }
          };
      };
  };
  var eqProduct = function (dictEq1) {
      var eq1Product1 = eq1Product(dictEq1);
      return function (dictEq11) {
          var eq1 = eq1$3(eq1Product1(dictEq11));
          return function (dictEq) {
              return {
                  eq: eq1(dictEq)
              };
          };
      };
  };
  var ord1Product = function (dictOrd1) {
      var compare1 = compare1$1(dictOrd1);
      var eq1Product1 = eq1Product(dictOrd1.Eq10());
      return function (dictOrd11) {
          var compare11 = compare1$1(dictOrd11);
          var eq1Product2 = eq1Product1(dictOrd11.Eq10());
          return {
              compare1: function (dictOrd) {
                  var compare12 = compare1(dictOrd);
                  var compare13 = compare11(dictOrd);
                  return function (v) {
                      return function (v1) {
                          var v2 = compare12(v.value0)(v1.value0);
                          if (v2 instanceof EQ) {
                              return compare13(v.value1)(v1.value1);
                          };
                          return v2;
                      };
                  };
              },
              Eq10: function () {
                  return eq1Product2;
              }
          };
      };
  };
  var ordProduct = function (dictOrd1) {
      var ord1Product1 = ord1Product(dictOrd1);
      var eqProduct1 = eqProduct(dictOrd1.Eq10());
      return function (dictOrd11) {
          var compare1 = compare1$1(ord1Product1(dictOrd11));
          var eqProduct2 = eqProduct1(dictOrd11.Eq10());
          return function (dictOrd) {
              var eqProduct3 = eqProduct2(dictOrd.Eq0());
              return {
                  compare: compare1(dictOrd),
                  Eq0: function () {
                      return eqProduct3;
                  }
              };
          };
      };
  };
  var bihoistProduct = function (natF) {
      return function (natG) {
          return function (v) {
              return bimap$1(natF)(natG)(v);
          };
      };
  };
  var applyProduct = function (dictApply) {
      var apply = apply$4(dictApply);
      var functorProduct1 = functorProduct(dictApply.Functor0());
      return function (dictApply1) {
          var apply1 = apply$4(dictApply1);
          var functorProduct2 = functorProduct1(dictApply1.Functor0());
          return {
              apply: function (v) {
                  return function (v1) {
                      return product(apply(v.value0)(v1.value0))(apply1(v.value1)(v1.value1));
                  };
              },
              Functor0: function () {
                  return functorProduct2;
              }
          };
      };
  };
  var bindProduct = function (dictBind) {
      var bind = bind$4(dictBind);
      var applyProduct1 = applyProduct(dictBind.Apply0());
      return function (dictBind1) {
          var bind1 = bind$4(dictBind1);
          var applyProduct2 = applyProduct1(dictBind1.Apply0());
          return {
              bind: function (v) {
                  return function (f) {
                      return product(bind(v.value0)(function ($128) {
                          return fst(unwrap(f($128)));
                      }))(bind1(v.value1)(function ($129) {
                          return snd(unwrap(f($129)));
                      }));
                  };
              },
              Apply0: function () {
                  return applyProduct2;
              }
          };
      };
  };
  var applicativeProduct = function (dictApplicative) {
      var pure = pure$2(dictApplicative);
      var applyProduct1 = applyProduct(dictApplicative.Apply0());
      return function (dictApplicative1) {
          var pure1 = pure$2(dictApplicative1);
          var applyProduct2 = applyProduct1(dictApplicative1.Apply0());
          return {
              pure: function (a) {
                  return product(pure(a))(pure1(a));
              },
              Apply0: function () {
                  return applyProduct2;
              }
          };
      };
  };
  var monadProduct = function (dictMonad) {
      var applicativeProduct1 = applicativeProduct(dictMonad.Applicative0());
      var bindProduct1 = bindProduct(dictMonad.Bind1());
      return function (dictMonad1) {
          var applicativeProduct2 = applicativeProduct1(dictMonad1.Applicative0());
          var bindProduct2 = bindProduct1(dictMonad1.Bind1());
          return {
              Applicative0: function () {
                  return applicativeProduct2;
              },
              Bind1: function () {
                  return bindProduct2;
              }
          };
      };
  };

  // Generated by purs version 0.15.15
  var Last = function (x) {
      return x;
  };
  var showLast = function (dictShow) {
      var show = show$4(showMaybe(dictShow));
      return {
          show: function (v) {
              return "(Last " + (show(v) + ")");
          }
      };
  };
  var semigroupLast = {
      append: function (v) {
          return function (v1) {
              if (v1 instanceof Just) {
                  return v1;
              };
              if (v1 instanceof Nothing) {
                  return v;
              };
              throw new Error("Failed pattern match at Data.Maybe.Last (line 54, column 1 - line 56, column 36): " + [ v.constructor.name, v1.constructor.name ]);
          };
      }
  };
  var ordLast = function (dictOrd) {
      return ordMaybe(dictOrd);
  };
  var ord1Last = ord1Maybe;
  var newtypeLast = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidLast = /* #__PURE__ */ (function () {
      return {
          mempty: Nothing.value,
          Semigroup0: function () {
              return semigroupLast;
          }
      };
  })();
  var monadLast = monadMaybe;
  var invariantLast = invariantMaybe;
  var functorLast = functorMaybe;
  var extendLast = extendMaybe;
  var eqLast = function (dictEq) {
      return eqMaybe(dictEq);
  };
  var eq1Last = eq1Maybe;
  var boundedLast = function (dictBounded) {
      return boundedMaybe(dictBounded);
  };
  var bindLast = bindMaybe;
  var applyLast = applyMaybe;
  var applicativeLast = applicativeMaybe;
  var altLast = {
      alt: /* #__PURE__ */ append$1(semigroupLast),
      Functor0: function () {
          return functorLast;
      }
  };
  var plusLast = {
      empty: /* #__PURE__ */ mempty(monoidLast),
      Alt0: function () {
          return altLast;
      }
  };
  var alternativeLast = {
      Applicative0: function () {
          return applicativeLast;
      },
      Plus1: function () {
          return plusLast;
      }
  };

  // Generated by purs version 0.15.15
  var Additive = function (x) {
      return x;
  };
  var showAdditive = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Additive " + (show(v) + ")");
          }
      };
  };
  var semigroupAdditive = function (dictSemiring) {
      var add$1 = add(dictSemiring);
      return {
          append: function (v) {
              return function (v1) {
                  return add$1(v)(v1);
              };
          }
      };
  };
  var ordAdditive = function (dictOrd) {
      return dictOrd;
  };
  var monoidAdditive = function (dictSemiring) {
      var semigroupAdditive1 = semigroupAdditive(dictSemiring);
      return {
          mempty: zero(dictSemiring),
          Semigroup0: function () {
              return semigroupAdditive1;
          }
      };
  };
  var functorAdditive = {
      map: function (f) {
          return function (m) {
              return f(m);
          };
      }
  };
  var eqAdditive = function (dictEq) {
      return dictEq;
  };
  var eq1Additive = {
      eq1: function (dictEq) {
          return eq$2(eqAdditive(dictEq));
      }
  };
  var ord1Additive = {
      compare1: function (dictOrd) {
          return compare$3(ordAdditive(dictOrd));
      },
      Eq10: function () {
          return eq1Additive;
      }
  };
  var boundedAdditive = function (dictBounded) {
      return dictBounded;
  };
  var applyAdditive = {
      apply: function (v) {
          return function (v1) {
              return v(v1);
          };
      },
      Functor0: function () {
          return functorAdditive;
      }
  };
  var bindAdditive = {
      bind: function (v) {
          return function (f) {
              return f(v);
          };
      },
      Apply0: function () {
          return applyAdditive;
      }
  };
  var applicativeAdditive = {
      pure: Additive,
      Apply0: function () {
          return applyAdditive;
      }
  };
  var monadAdditive = {
      Applicative0: function () {
          return applicativeAdditive;
      },
      Bind1: function () {
          return bindAdditive;
      }
  };

  // Generated by purs version 0.15.15
  var Multiplicative = function (x) {
      return x;
  };
  var showMultiplicative = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Multiplicative " + (show(v) + ")");
          }
      };
  };
  var semigroupMultiplicative = function (dictSemiring) {
      var mul$1 = mul(dictSemiring);
      return {
          append: function (v) {
              return function (v1) {
                  return mul$1(v)(v1);
              };
          }
      };
  };
  var ordMultiplicative = function (dictOrd) {
      return dictOrd;
  };
  var monoidMultiplicative = function (dictSemiring) {
      var semigroupMultiplicative1 = semigroupMultiplicative(dictSemiring);
      return {
          mempty: one(dictSemiring),
          Semigroup0: function () {
              return semigroupMultiplicative1;
          }
      };
  };
  var functorMultiplicative = {
      map: function (f) {
          return function (m) {
              return f(m);
          };
      }
  };
  var eqMultiplicative = function (dictEq) {
      return dictEq;
  };
  var eq1Multiplicative = {
      eq1: function (dictEq) {
          return eq$2(eqMultiplicative(dictEq));
      }
  };
  var ord1Multiplicative = {
      compare1: function (dictOrd) {
          return compare$3(ordMultiplicative(dictOrd));
      },
      Eq10: function () {
          return eq1Multiplicative;
      }
  };
  var boundedMultiplicative = function (dictBounded) {
      return dictBounded;
  };
  var applyMultiplicative = {
      apply: function (v) {
          return function (v1) {
              return v(v1);
          };
      },
      Functor0: function () {
          return functorMultiplicative;
      }
  };
  var bindMultiplicative = {
      bind: function (v) {
          return function (f) {
              return f(v);
          };
      },
      Apply0: function () {
          return applyMultiplicative;
      }
  };
  var applicativeMultiplicative = {
      pure: Multiplicative,
      Apply0: function () {
          return applyMultiplicative;
      }
  };
  var monadMultiplicative = {
      Applicative0: function () {
          return applicativeMultiplicative;
      },
      Bind1: function () {
          return bindMultiplicative;
      }
  };

  // Generated by purs version 0.15.15
  var map$i = /* #__PURE__ */ map$o(functorTuple);
  var bimap = /* #__PURE__ */ bimap$3(bifunctorTuple);
  var map1$1 = /* #__PURE__ */ map$o(functorMultiplicative);
  var map2$1 = /* #__PURE__ */ map$o(functorMaybe);
  var map3 = /* #__PURE__ */ map$o(functorLast);
  var map4 = /* #__PURE__ */ map$o(functorFirst);
  var map5 = /* #__PURE__ */ map$o(functorEither);
  var map6 = /* #__PURE__ */ map$o(functorDual);
  var map7 = /* #__PURE__ */ map$o(functorDisj);
  var bimap1 = /* #__PURE__ */ bimap$3(bifunctorEither);
  var map8 = /* #__PURE__ */ map$o(functorConj);
  var map9 = /* #__PURE__ */ map$o(functorAdditive);
  var mapWithIndex$1 = function (dict) {
      return dict.mapWithIndex;
  };
  var mapDefault = function (dictFunctorWithIndex) {
      var mapWithIndex1 = mapWithIndex$1(dictFunctorWithIndex);
      return function (f) {
          return mapWithIndex1($$const(f));
      };
  };
  var functorWithIndexTuple = {
      mapWithIndex: function (f) {
          return map$i(f(unit));
      },
      Functor0: function () {
          return functorTuple;
      }
  };
  var functorWithIndexProduct = function (dictFunctorWithIndex) {
      var mapWithIndex1 = mapWithIndex$1(dictFunctorWithIndex);
      var functorProduct$1 = functorProduct(dictFunctorWithIndex.Functor0());
      return function (dictFunctorWithIndex1) {
          var mapWithIndex2 = mapWithIndex$1(dictFunctorWithIndex1);
          var functorProduct1 = functorProduct$1(dictFunctorWithIndex1.Functor0());
          return {
              mapWithIndex: function (f) {
                  return function (v) {
                      return bimap(mapWithIndex1(function ($63) {
                          return f(Left.create($63));
                      }))(mapWithIndex2(function ($64) {
                          return f(Right.create($64));
                      }))(v);
                  };
              },
              Functor0: function () {
                  return functorProduct1;
              }
          };
      };
  };
  var functorWithIndexMultiplicative = {
      mapWithIndex: function (f) {
          return map1$1(f(unit));
      },
      Functor0: function () {
          return functorMultiplicative;
      }
  };
  var functorWithIndexMaybe = {
      mapWithIndex: function (f) {
          return map2$1(f(unit));
      },
      Functor0: function () {
          return functorMaybe;
      }
  };
  var functorWithIndexLast = {
      mapWithIndex: function (f) {
          return map3(f(unit));
      },
      Functor0: function () {
          return functorLast;
      }
  };
  var functorWithIndexIdentity = {
      mapWithIndex: function (f) {
          return function (v) {
              return f(unit)(v);
          };
      },
      Functor0: function () {
          return functorIdentity;
      }
  };
  var functorWithIndexFirst = {
      mapWithIndex: function (f) {
          return map4(f(unit));
      },
      Functor0: function () {
          return functorFirst;
      }
  };
  var functorWithIndexEither = {
      mapWithIndex: function (f) {
          return map5(f(unit));
      },
      Functor0: function () {
          return functorEither;
      }
  };
  var functorWithIndexDual = {
      mapWithIndex: function (f) {
          return map6(f(unit));
      },
      Functor0: function () {
          return functorDual;
      }
  };
  var functorWithIndexDisj = {
      mapWithIndex: function (f) {
          return map7(f(unit));
      },
      Functor0: function () {
          return functorDisj;
      }
  };
  var functorWithIndexCoproduct = function (dictFunctorWithIndex) {
      var mapWithIndex1 = mapWithIndex$1(dictFunctorWithIndex);
      var functorCoproduct$1 = functorCoproduct(dictFunctorWithIndex.Functor0());
      return function (dictFunctorWithIndex1) {
          var mapWithIndex2 = mapWithIndex$1(dictFunctorWithIndex1);
          var functorCoproduct1 = functorCoproduct$1(dictFunctorWithIndex1.Functor0());
          return {
              mapWithIndex: function (f) {
                  return function (v) {
                      return bimap1(mapWithIndex1(function ($65) {
                          return f(Left.create($65));
                      }))(mapWithIndex2(function ($66) {
                          return f(Right.create($66));
                      }))(v);
                  };
              },
              Functor0: function () {
                  return functorCoproduct1;
              }
          };
      };
  };
  var functorWithIndexConst = {
      mapWithIndex: function (v) {
          return function (v1) {
              return v1;
          };
      },
      Functor0: function () {
          return functorConst;
      }
  };
  var functorWithIndexConj = {
      mapWithIndex: function (f) {
          return map8(f(unit));
      },
      Functor0: function () {
          return functorConj;
      }
  };
  var functorWithIndexCompose = function (dictFunctorWithIndex) {
      var mapWithIndex1 = mapWithIndex$1(dictFunctorWithIndex);
      var functorCompose$1 = functorCompose(dictFunctorWithIndex.Functor0());
      return function (dictFunctorWithIndex1) {
          var mapWithIndex2 = mapWithIndex$1(dictFunctorWithIndex1);
          var functorCompose1 = functorCompose$1(dictFunctorWithIndex1.Functor0());
          return {
              mapWithIndex: function (f) {
                  return function (v) {
                      return mapWithIndex1((function () {
                          var $67 = curry(f);
                          return function ($68) {
                              return mapWithIndex2($67($68));
                          };
                      })())(v);
                  };
              },
              Functor0: function () {
                  return functorCompose1;
              }
          };
      };
  };
  var functorWithIndexArray = {
      mapWithIndex: mapWithIndexArray,
      Functor0: function () {
          return functorArray;
      }
  };
  var functorWithIndexApp = function (dictFunctorWithIndex) {
      var mapWithIndex1 = mapWithIndex$1(dictFunctorWithIndex);
      var functorApp$1 = functorApp(dictFunctorWithIndex.Functor0());
      return {
          mapWithIndex: function (f) {
              return function (v) {
                  return mapWithIndex1(f)(v);
              };
          },
          Functor0: function () {
              return functorApp$1;
          }
      };
  };
  var functorWithIndexAdditive = {
      mapWithIndex: function (f) {
          return map9(f(unit));
      },
      Functor0: function () {
          return functorAdditive;
      }
  };

  // jshint maxparams: 3

  const traverseArrayImpl = (function () {
    function array1(a) {
      return [a];
    }

    function array2(a) {
      return function (b) {
        return [a, b];
      };
    }

    function array3(a) {
      return function (b) {
        return function (c) {
          return [a, b, c];
        };
      };
    }

    function concat2(xs) {
      return function (ys) {
        return xs.concat(ys);
      };
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            return function (array) {
              function go(bot, top) {
                switch (top - bot) {
                case 0: return pure([]);
                case 1: return map(array1)(f(array[bot]));
                case 2: return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3: return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  // This slightly tricky pivot selection aims to produce two
                  // even-length partitions where possible.
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat2)(go(bot, pivot)))(go(pivot, top));
                }
              }
              return go(0, array.length);
            };
          };
        };
      };
    };
  })();

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var StateR = function (x) {
      return x;
  };
  var StateL = function (x) {
      return x;
  };
  var stateR = function (v) {
      return v;
  };
  var stateL = function (v) {
      return v;
  };
  var functorStateR = {
      map: function (f) {
          return function (k) {
              return function (s) {
                  var v = stateR(k)(s);
                  return {
                      accum: v.accum,
                      value: f(v.value)
                  };
              };
          };
      }
  };
  var functorStateL = {
      map: function (f) {
          return function (k) {
              return function (s) {
                  var v = stateL(k)(s);
                  return {
                      accum: v.accum,
                      value: f(v.value)
                  };
              };
          };
      }
  };
  var applyStateR = {
      apply: function (f) {
          return function (x) {
              return function (s) {
                  var v = stateR(x)(s);
                  var v1 = stateR(f)(v.accum);
                  return {
                      accum: v1.accum,
                      value: v1.value(v.value)
                  };
              };
          };
      },
      Functor0: function () {
          return functorStateR;
      }
  };
  var applyStateL = {
      apply: function (f) {
          return function (x) {
              return function (s) {
                  var v = stateL(f)(s);
                  var v1 = stateL(x)(v.accum);
                  return {
                      accum: v1.accum,
                      value: v.value(v1.value)
                  };
              };
          };
      },
      Functor0: function () {
          return functorStateL;
      }
  };
  var applicativeStateR = {
      pure: function (a) {
          return function (s) {
              return {
                  accum: s,
                  value: a
              };
          };
      },
      Apply0: function () {
          return applyStateR;
      }
  };
  var applicativeStateL = {
      pure: function (a) {
          return function (s) {
              return {
                  accum: s,
                  value: a
              };
          };
      },
      Apply0: function () {
          return applyStateL;
      }
  };

  // Generated by purs version 0.15.15
  var identity$2 = /* #__PURE__ */ identity$9(categoryFn);
  var traverse$1 = function (dict) {
      return dict.traverse;
  };
  var traversableTuple$1 = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Tuple.create(v.value0))(f(v.value1));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Tuple.create(v.value0))(v.value1);
          };
      },
      Functor0: function () {
          return functorTuple;
      },
      Foldable1: function () {
          return foldableTuple$1;
      }
  };
  var traversableMultiplicative$1 = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Multiplicative)(f(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Multiplicative)(v);
          };
      },
      Functor0: function () {
          return functorMultiplicative;
      },
      Foldable1: function () {
          return foldableMultiplicative$1;
      }
  };
  var traversableMaybe = {
      traverse: function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return function (v1) {
                  if (v1 instanceof Nothing) {
                      return pure(Nothing.value);
                  };
                  if (v1 instanceof Just) {
                      return map(Just.create)(v(v1.value0));
                  };
                  throw new Error("Failed pattern match at Data.Traversable (line 115, column 1 - line 119, column 33): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
      },
      sequence: function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              if (v instanceof Nothing) {
                  return pure(Nothing.value);
              };
              if (v instanceof Just) {
                  return map(Just.create)(v.value0);
              };
              throw new Error("Failed pattern match at Data.Traversable (line 115, column 1 - line 119, column 33): " + [ v.constructor.name ]);
          };
      },
      Functor0: function () {
          return functorMaybe;
      },
      Foldable1: function () {
          return foldableMaybe;
      }
  };
  var traverse1$1 = /* #__PURE__ */ traverse$1(traversableMaybe);
  var traversableIdentity$1 = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Identity)(f(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Identity)(v);
          };
      },
      Functor0: function () {
          return functorIdentity;
      },
      Foldable1: function () {
          return foldableIdentity$1;
      }
  };
  var traversableEither = {
      traverse: function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return function (v1) {
                  if (v1 instanceof Left) {
                      return pure(new Left(v1.value0));
                  };
                  if (v1 instanceof Right) {
                      return map(Right.create)(v(v1.value0));
                  };
                  throw new Error("Failed pattern match at Data.Traversable (line 149, column 1 - line 153, column 36): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
      },
      sequence: function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              if (v instanceof Left) {
                  return pure(new Left(v.value0));
              };
              if (v instanceof Right) {
                  return map(Right.create)(v.value0);
              };
              throw new Error("Failed pattern match at Data.Traversable (line 149, column 1 - line 153, column 36): " + [ v.constructor.name ]);
          };
      },
      Functor0: function () {
          return functorEither;
      },
      Foldable1: function () {
          return foldableEither;
      }
  };
  var traversableDual$1 = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Dual)(f(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Dual)(v);
          };
      },
      Functor0: function () {
          return functorDual;
      },
      Foldable1: function () {
          return foldableDual$1;
      }
  };
  var traversableDisj = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Disj)(f(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Disj)(v);
          };
      },
      Functor0: function () {
          return functorDisj;
      },
      Foldable1: function () {
          return foldableDisj;
      }
  };
  var traversableConst = {
      traverse: function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          return function (v) {
              return function (v1) {
                  return pure(v1);
              };
          };
      },
      sequence: function (dictApplicative) {
          var pure = pure$2(dictApplicative);
          return function (v) {
              return pure(v);
          };
      },
      Functor0: function () {
          return functorConst;
      },
      Foldable1: function () {
          return foldableConst;
      }
  };
  var traversableConj = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Conj)(f(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Conj)(v);
          };
      },
      Functor0: function () {
          return functorConj;
      },
      Foldable1: function () {
          return foldableConj;
      }
  };
  var traversableCompose = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable);
      var functorCompose$1 = functorCompose(dictTraversable.Functor0());
      var foldableCompose$1 = foldableCompose(dictTraversable.Foldable1());
      return function (dictTraversable1) {
          var traverse3 = traverse$1(dictTraversable1);
          var functorCompose1 = functorCompose$1(dictTraversable1.Functor0());
          var foldableCompose1 = foldableCompose$1(dictTraversable1.Foldable1());
          return {
              traverse: function (dictApplicative) {
                  var map = map$o((dictApplicative.Apply0()).Functor0());
                  var traverse4 = traverse2(dictApplicative);
                  var traverse5 = traverse3(dictApplicative);
                  return function (f) {
                      return function (v) {
                          return map(Compose)(traverse4(traverse5(f))(v));
                      };
                  };
              },
              sequence: function (dictApplicative) {
                  return traverse$1(traversableCompose(dictTraversable)(dictTraversable1))(dictApplicative)(identity$2);
              },
              Functor0: function () {
                  return functorCompose1;
              },
              Foldable1: function () {
                  return foldableCompose1;
              }
          };
      };
  };
  var traversableAdditive = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (f) {
              return function (v) {
                  return map(Additive)(f(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          return function (v) {
              return map(Additive)(v);
          };
      },
      Functor0: function () {
          return functorAdditive;
      },
      Foldable1: function () {
          return foldableAdditive;
      }
  };
  var sequenceDefault = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable);
      return function (dictApplicative) {
          return traverse2(dictApplicative)(identity$2);
      };
  };
  var traversableArray = {
      traverse: function (dictApplicative) {
          var Apply0 = dictApplicative.Apply0();
          return traverseArrayImpl(apply$4(Apply0))(map$o(Apply0.Functor0()))(pure$2(dictApplicative));
      },
      sequence: function (dictApplicative) {
          return sequenceDefault(traversableArray)(dictApplicative);
      },
      Functor0: function () {
          return functorArray;
      },
      Foldable1: function () {
          return foldableArray;
      }
  };
  var sequence$1 = function (dict) {
      return dict.sequence;
  };
  var sequence1$1 = /* #__PURE__ */ sequence$1(traversableMaybe);
  var traversableApp = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable);
      var sequence2 = sequence$1(dictTraversable);
      var functorApp$1 = functorApp(dictTraversable.Functor0());
      var foldableApp$1 = foldableApp(dictTraversable.Foldable1());
      return {
          traverse: function (dictApplicative) {
              var map = map$o((dictApplicative.Apply0()).Functor0());
              var traverse3 = traverse2(dictApplicative);
              return function (f) {
                  return function (v) {
                      return map(App)(traverse3(f)(v));
                  };
              };
          },
          sequence: function (dictApplicative) {
              var map = map$o((dictApplicative.Apply0()).Functor0());
              var sequence3 = sequence2(dictApplicative);
              return function (v) {
                  return map(App)(sequence3(v));
              };
          },
          Functor0: function () {
              return functorApp$1;
          },
          Foldable1: function () {
              return foldableApp$1;
          }
      };
  };
  var traversableCoproduct = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable);
      var sequence2 = sequence$1(dictTraversable);
      var functorCoproduct$1 = functorCoproduct(dictTraversable.Functor0());
      var foldableCoproduct$1 = foldableCoproduct(dictTraversable.Foldable1());
      return function (dictTraversable1) {
          var traverse3 = traverse$1(dictTraversable1);
          var sequence3 = sequence$1(dictTraversable1);
          var functorCoproduct1 = functorCoproduct$1(dictTraversable1.Functor0());
          var foldableCoproduct1 = foldableCoproduct$1(dictTraversable1.Foldable1());
          return {
              traverse: function (dictApplicative) {
                  var map = map$o((dictApplicative.Apply0()).Functor0());
                  var traverse4 = traverse2(dictApplicative);
                  var traverse5 = traverse3(dictApplicative);
                  return function (f) {
                      return coproduct((function () {
                          var $313 = map(function ($316) {
                              return Coproduct(Left.create($316));
                          });
                          var $314 = traverse4(f);
                          return function ($315) {
                              return $313($314($315));
                          };
                      })())((function () {
                          var $317 = map(function ($320) {
                              return Coproduct(Right.create($320));
                          });
                          var $318 = traverse5(f);
                          return function ($319) {
                              return $317($318($319));
                          };
                      })());
                  };
              },
              sequence: function (dictApplicative) {
                  var map = map$o((dictApplicative.Apply0()).Functor0());
                  return coproduct((function () {
                      var $321 = map(function ($324) {
                          return Coproduct(Left.create($324));
                      });
                      var $322 = sequence2(dictApplicative);
                      return function ($323) {
                          return $321($322($323));
                      };
                  })())((function () {
                      var $325 = map(function ($328) {
                          return Coproduct(Right.create($328));
                      });
                      var $326 = sequence3(dictApplicative);
                      return function ($327) {
                          return $325($326($327));
                      };
                  })());
              },
              Functor0: function () {
                  return functorCoproduct1;
              },
              Foldable1: function () {
                  return foldableCoproduct1;
              }
          };
      };
  };
  var traversableFirst = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          var traverse2 = traverse1$1(dictApplicative);
          return function (f) {
              return function (v) {
                  return map(First)(traverse2(f)(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          var sequence2 = sequence1$1(dictApplicative);
          return function (v) {
              return map(First)(sequence2(v));
          };
      },
      Functor0: function () {
          return functorFirst;
      },
      Foldable1: function () {
          return foldableFirst;
      }
  };
  var traversableLast = {
      traverse: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          var traverse2 = traverse1$1(dictApplicative);
          return function (f) {
              return function (v) {
                  return map(Last)(traverse2(f)(v));
              };
          };
      },
      sequence: function (dictApplicative) {
          var map = map$o((dictApplicative.Apply0()).Functor0());
          var sequence2 = sequence1$1(dictApplicative);
          return function (v) {
              return map(Last)(sequence2(v));
          };
      },
      Functor0: function () {
          return functorLast;
      },
      Foldable1: function () {
          return foldableLast;
      }
  };
  var traversableProduct = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable);
      var sequence2 = sequence$1(dictTraversable);
      var functorProduct$1 = functorProduct(dictTraversable.Functor0());
      var foldableProduct$1 = foldableProduct(dictTraversable.Foldable1());
      return function (dictTraversable1) {
          var traverse3 = traverse$1(dictTraversable1);
          var sequence3 = sequence$1(dictTraversable1);
          var functorProduct1 = functorProduct$1(dictTraversable1.Functor0());
          var foldableProduct1 = foldableProduct$1(dictTraversable1.Foldable1());
          return {
              traverse: function (dictApplicative) {
                  var lift2 = lift2$2(dictApplicative.Apply0());
                  var traverse4 = traverse2(dictApplicative);
                  var traverse5 = traverse3(dictApplicative);
                  return function (f) {
                      return function (v) {
                          return lift2(product)(traverse4(f)(v.value0))(traverse5(f)(v.value1));
                      };
                  };
              },
              sequence: function (dictApplicative) {
                  var lift2 = lift2$2(dictApplicative.Apply0());
                  var sequence4 = sequence2(dictApplicative);
                  var sequence5 = sequence3(dictApplicative);
                  return function (v) {
                      return lift2(product)(sequence4(v.value0))(sequence5(v.value1));
                  };
              },
              Functor0: function () {
                  return functorProduct1;
              },
              Foldable1: function () {
                  return foldableProduct1;
              }
          };
      };
  };
  var traverseDefault = function (dictTraversable) {
      var sequence2 = sequence$1(dictTraversable);
      var map = map$o(dictTraversable.Functor0());
      return function (dictApplicative) {
          var sequence3 = sequence2(dictApplicative);
          return function (f) {
              return function (ta) {
                  return sequence3(map(f)(ta));
              };
          };
      };
  };
  var mapAccumR = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable)(applicativeStateR);
      return function (f) {
          return function (s0) {
              return function (xs) {
                  return stateR(traverse2(function (a) {
                      return function (s) {
                          return f(s)(a);
                      };
                  })(xs))(s0);
              };
          };
      };
  };
  var scanr$1 = function (dictTraversable) {
      var mapAccumR1 = mapAccumR(dictTraversable);
      return function (f) {
          return function (b0) {
              return function (xs) {
                  return (mapAccumR1(function (b) {
                      return function (a) {
                          var b$prime = f(a)(b);
                          return {
                              accum: b$prime,
                              value: b$prime
                          };
                      };
                  })(b0)(xs)).value;
              };
          };
      };
  };
  var mapAccumL = function (dictTraversable) {
      var traverse2 = traverse$1(dictTraversable)(applicativeStateL);
      return function (f) {
          return function (s0) {
              return function (xs) {
                  return stateL(traverse2(function (a) {
                      return function (s) {
                          return f(s)(a);
                      };
                  })(xs))(s0);
              };
          };
      };
  };
  var scanl$1 = function (dictTraversable) {
      var mapAccumL1 = mapAccumL(dictTraversable);
      return function (f) {
          return function (b0) {
              return function (xs) {
                  return (mapAccumL1(function (b) {
                      return function (a) {
                          var b$prime = f(b)(a);
                          return {
                              accum: b$prime,
                              value: b$prime
                          };
                      };
                  })(b0)(xs)).value;
              };
          };
      };
  };
  var $$for = function (dictApplicative) {
      return function (dictTraversable) {
          var traverse2 = traverse$1(dictTraversable)(dictApplicative);
          return function (x) {
              return function (f) {
                  return traverse2(f)(x);
              };
          };
      };
  };

  const unfoldrArrayImpl = function (isNothing) {
    return function (fromJust) {
      return function (fst) {
        return function (snd) {
          return function (f) {
            return function (b) {
              var result = [];
              var value = b;
              while (true) { // eslint-disable-line no-constant-condition
                var maybe = f(value);
                if (isNothing(maybe)) return result;
                var tuple = fromJust(maybe);
                result.push(fst(tuple));
                value = snd(tuple);
              }
            };
          };
        };
      };
    };
  };

  const unfoldr1ArrayImpl = function (isNothing) {
    return function (fromJust) {
      return function (fst) {
        return function (snd) {
          return function (f) {
            return function (b) {
              var result = [];
              var value = b;
              while (true) { // eslint-disable-line no-constant-condition
                var tuple = f(value);
                result.push(fst(tuple));
                var maybe = snd(tuple);
                if (isNothing(maybe)) return result;
                value = fromJust(maybe);
              }
            };
          };
        };
      };
    };
  };

  // Generated by purs version 0.15.15
  var Max = function (x) {
      return x;
  };
  var showMax = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Max " + (show(v) + ")");
          }
      };
  };
  var semigroupMax = function (dictOrd) {
      var max = max$4(dictOrd);
      return {
          append: function (v) {
              return function (v1) {
                  return max(v)(v1);
              };
          }
      };
  };
  var newtypeMax = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidMax = function (dictBounded) {
      var semigroupMax1 = semigroupMax(dictBounded.Ord0());
      return {
          mempty: bottom$2(dictBounded),
          Semigroup0: function () {
              return semigroupMax1;
          }
      };
  };
  var eqMax = function (dictEq) {
      return dictEq;
  };
  var ordMax = function (dictOrd) {
      var compare = compare$3(dictOrd);
      var eqMax1 = eqMax(dictOrd.Eq0());
      return {
          compare: function (v) {
              return function (v1) {
                  return compare(v)(v1);
              };
          },
          Eq0: function () {
              return eqMax1;
          }
      };
  };

  // Generated by purs version 0.15.15
  var Min = function (x) {
      return x;
  };
  var showMin = function (dictShow) {
      var show = show$4(dictShow);
      return {
          show: function (v) {
              return "(Min " + (show(v) + ")");
          }
      };
  };
  var semigroupMin = function (dictOrd) {
      var min = min$3(dictOrd);
      return {
          append: function (v) {
              return function (v1) {
                  return min(v)(v1);
              };
          }
      };
  };
  var newtypeMin = {
      Coercible0: function () {
          return undefined;
      }
  };
  var monoidMin = function (dictBounded) {
      var semigroupMin1 = semigroupMin(dictBounded.Ord0());
      return {
          mempty: top$2(dictBounded),
          Semigroup0: function () {
              return semigroupMin1;
          }
      };
  };
  var eqMin = function (dictEq) {
      return dictEq;
  };
  var ordMin = function (dictOrd) {
      var compare = compare$3(dictOrd);
      var eqMin1 = eqMin(dictOrd.Eq0());
      return {
          compare: function (v) {
              return function (v1) {
                  return compare(v)(v1);
              };
          },
          Eq0: function () {
              return eqMin1;
          }
      };
  };

  // Generated by purs version 0.15.15
  var eq$1 = /* #__PURE__ */ eq$2(eqOrdering);
  var alaF = /* #__PURE__ */ alaF$2()()()();
  var identity$1 = /* #__PURE__ */ identity$9(categoryFn);
  var ala = /* #__PURE__ */ ala$1()()();
  var JoinWith = function (x) {
      return x;
  };
  var FoldRight1 = /* #__PURE__ */ (function () {
      function FoldRight1(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      FoldRight1.create = function (value0) {
          return function (value1) {
              return new FoldRight1(value0, value1);
          };
      };
      return FoldRight1;
  })();
  var Act = function (x) {
      return x;
  };
  var semigroupJoinWith = function (dictSemigroup) {
      var append = append$1(dictSemigroup);
      return {
          append: function (v) {
              return function (v1) {
                  return function (j) {
                      return append(v(j))(append(j)(v1(j)));
                  };
              };
          }
      };
  };
  var semigroupAct = function (dictApply) {
      var applySecond$1 = applySecond(dictApply);
      return {
          append: function (v) {
              return function (v1) {
                  return applySecond$1(v)(v1);
              };
          }
      };
  };
  var runFoldRight1 = function (v) {
      return v.value0(v.value1);
  };
  var mkFoldRight1 = /* #__PURE__ */ (function () {
      return FoldRight1.create($$const);
  })();
  var joinee = function (v) {
      return v;
  };
  var getAct = function (v) {
      return v;
  };
  var foldr1 = function (dict) {
      return dict.foldr1;
  };
  var foldl1 = function (dict) {
      return dict.foldl1;
  };
  var maximumBy = function (dictFoldable1) {
      var foldl11 = foldl1(dictFoldable1);
      return function (cmp) {
          return foldl11(function (x) {
              return function (y) {
                  var $120 = eq$1(cmp(x)(y))(GT.value);
                  if ($120) {
                      return x;
                  };
                  return y;
              };
          });
      };
  };
  var minimumBy = function (dictFoldable1) {
      var foldl11 = foldl1(dictFoldable1);
      return function (cmp) {
          return foldl11(function (x) {
              return function (y) {
                  var $121 = eq$1(cmp(x)(y))(LT.value);
                  if ($121) {
                      return x;
                  };
                  return y;
              };
          });
      };
  };
  var foldableTuple = {
      foldMap1: function (dictSemigroup) {
          return function (f) {
              return function (v) {
                  return f(v.value1);
              };
          };
      },
      foldr1: function (v) {
          return function (v1) {
              return v1.value1;
          };
      },
      foldl1: function (v) {
          return function (v1) {
              return v1.value1;
          };
      },
      Foldable0: function () {
          return foldableTuple$1;
      }
  };
  var foldableMultiplicative = {
      foldr1: function (v) {
          return function (v1) {
              return v1;
          };
      },
      foldl1: function (v) {
          return function (v1) {
              return v1;
          };
      },
      foldMap1: function (dictSemigroup) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      },
      Foldable0: function () {
          return foldableMultiplicative$1;
      }
  };
  var foldableIdentity = {
      foldMap1: function (dictSemigroup) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      },
      foldl1: function (v) {
          return function (v1) {
              return v1;
          };
      },
      foldr1: function (v) {
          return function (v1) {
              return v1;
          };
      },
      Foldable0: function () {
          return foldableIdentity$1;
      }
  };
  var foldableDual = {
      foldr1: function (v) {
          return function (v1) {
              return v1;
          };
      },
      foldl1: function (v) {
          return function (v1) {
              return v1;
          };
      },
      foldMap1: function (dictSemigroup) {
          return function (f) {
              return function (v) {
                  return f(v);
              };
          };
      },
      Foldable0: function () {
          return foldableDual$1;
      }
  };
  var foldRight1Semigroup = {
      append: function (v) {
          return function (v1) {
              return new FoldRight1(function (a) {
                  return function (f) {
                      return v.value0(f(v.value1)(v1.value0(a)(f)))(f);
                  };
              }, v1.value1);
          };
      }
  };
  var semigroupDual = /* #__PURE__ */ semigroupDual$1(foldRight1Semigroup);
  var foldMap1DefaultR = function (dictFoldable1) {
      var foldr11 = foldr1(dictFoldable1);
      return function (dictFunctor) {
          var map = map$o(dictFunctor);
          return function (dictSemigroup) {
              var append = append$1(dictSemigroup);
              return function (f) {
                  var $159 = foldr11(append);
                  var $160 = map(f);
                  return function ($161) {
                      return $159($160($161));
                  };
              };
          };
      };
  };
  var foldMap1DefaultL = function (dictFoldable1) {
      var foldl11 = foldl1(dictFoldable1);
      return function (dictFunctor) {
          var map = map$o(dictFunctor);
          return function (dictSemigroup) {
              var append = append$1(dictSemigroup);
              return function (f) {
                  var $162 = foldl11(append);
                  var $163 = map(f);
                  return function ($164) {
                      return $162($163($164));
                  };
              };
          };
      };
  };
  var foldMap1$1 = function (dict) {
      return dict.foldMap1;
  };
  var foldl1Default = function (dictFoldable1) {
      var $165 = flip((function () {
          var $167 = alaF(Dual)(foldMap1$1(dictFoldable1)(semigroupDual))(mkFoldRight1);
          return function ($168) {
              return runFoldRight1($167($168));
          };
      })());
      return function ($166) {
          return $165(flip($166));
      };
  };
  var foldr1Default = function (dictFoldable1) {
      return flip((function () {
          var $169 = foldMap1$1(dictFoldable1)(foldRight1Semigroup)(mkFoldRight1);
          return function ($170) {
              return runFoldRight1($169($170));
          };
      })());
  };
  var intercalateMap = function (dictFoldable1) {
      var foldMap11 = foldMap1$1(dictFoldable1);
      return function (dictSemigroup) {
          var foldMap12 = foldMap11(semigroupJoinWith(dictSemigroup));
          return function (j) {
              return function (f) {
                  return function (foldable) {
                      return joinee(foldMap12(function ($171) {
                          return JoinWith($$const(f($171)));
                      })(foldable))(j);
                  };
              };
          };
      };
  };
  var intercalate$1 = function (dictFoldable1) {
      var intercalateMap1 = intercalateMap(dictFoldable1);
      return function (dictSemigroup) {
          return flip(intercalateMap1(dictSemigroup))(identity$1);
      };
  };
  var maximum = function (dictOrd) {
      var semigroupMax$1 = semigroupMax(dictOrd);
      return function (dictFoldable1) {
          return ala(Max)(foldMap1$1(dictFoldable1)(semigroupMax$1));
      };
  };
  var minimum = function (dictOrd) {
      var semigroupMin$1 = semigroupMin(dictOrd);
      return function (dictFoldable1) {
          return ala(Min)(foldMap1$1(dictFoldable1)(semigroupMin$1));
      };
  };
  var traverse1_ = function (dictFoldable1) {
      var foldMap11 = foldMap1$1(dictFoldable1);
      return function (dictApply) {
          var voidRight$1 = voidRight(dictApply.Functor0());
          var foldMap12 = foldMap11(semigroupAct(dictApply));
          return function (f) {
              return function (t) {
                  return voidRight$1(unit)(getAct(foldMap12(function ($172) {
                      return Act(f($172));
                  })(t)));
              };
          };
      };
  };
  var for1_ = function (dictFoldable1) {
      var traverse1_1 = traverse1_(dictFoldable1);
      return function (dictApply) {
          return flip(traverse1_1(dictApply));
      };
  };
  var sequence1_ = function (dictFoldable1) {
      var traverse1_1 = traverse1_(dictFoldable1);
      return function (dictApply) {
          return traverse1_1(dictApply)(identity$1);
      };
  };
  var fold1$1 = function (dictFoldable1) {
      var foldMap11 = foldMap1$1(dictFoldable1);
      return function (dictSemigroup) {
          return foldMap11(dictSemigroup)(identity$1);
      };
  };

  // Generated by purs version 0.15.15
  var identity = /* #__PURE__ */ identity$9(categoryFn);
  var traverse1 = function (dict) {
      return dict.traverse1;
  };
  var traversableTuple = {
      traverse1: function (dictApply) {
          var map = map$o(dictApply.Functor0());
          return function (f) {
              return function (v) {
                  return map(Tuple.create(v.value0))(f(v.value1));
              };
          };
      },
      sequence1: function (dictApply) {
          var map = map$o(dictApply.Functor0());
          return function (v) {
              return map(Tuple.create(v.value0))(v.value1);
          };
      },
      Foldable10: function () {
          return foldableTuple;
      },
      Traversable1: function () {
          return traversableTuple$1;
      }
  };
  var traversableIdentity = {
      traverse1: function (dictApply) {
          var map = map$o(dictApply.Functor0());
          return function (f) {
              return function (v) {
                  return map(Identity)(f(v));
              };
          };
      },
      sequence1: function (dictApply) {
          var map = map$o(dictApply.Functor0());
          return function (v) {
              return map(Identity)(v);
          };
      },
      Foldable10: function () {
          return foldableIdentity;
      },
      Traversable1: function () {
          return traversableIdentity$1;
      }
  };
  var sequence1Default = function (dictTraversable1) {
      var traverse11 = traverse1(dictTraversable1);
      return function (dictApply) {
          return traverse11(dictApply)(identity);
      };
  };
  var traversableDual = {
      traverse1: function (dictApply) {
          var map = map$o(dictApply.Functor0());
          return function (f) {
              return function (v) {
                  return map(Dual)(f(v));
              };
          };
      },
      sequence1: function (dictApply) {
          return sequence1Default(traversableDual)(dictApply);
      },
      Foldable10: function () {
          return foldableDual;
      },
      Traversable1: function () {
          return traversableDual$1;
      }
  };
  var traversableMultiplicative = {
      traverse1: function (dictApply) {
          var map = map$o(dictApply.Functor0());
          return function (f) {
              return function (v) {
                  return map(Multiplicative)(f(v));
              };
          };
      },
      sequence1: function (dictApply) {
          return sequence1Default(traversableMultiplicative)(dictApply);
      },
      Foldable10: function () {
          return foldableMultiplicative;
      },
      Traversable1: function () {
          return traversableMultiplicative$1;
      }
  };
  var sequence1 = function (dict) {
      return dict.sequence1;
  };
  var traverse1Default = function (dictTraversable1) {
      var sequence11 = sequence1(dictTraversable1);
      var map = map$o((dictTraversable1.Traversable1()).Functor0());
      return function (dictApply) {
          var sequence12 = sequence11(dictApply);
          return function (f) {
              return function (ta) {
                  return sequence12(map(f)(ta));
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var fromJust$3 = /* #__PURE__ */ fromJust$4();
  var unfoldr1 = function (dict) {
      return dict.unfoldr1;
  };
  var unfoldable1Maybe = {
      unfoldr1: function (f) {
          return function (b) {
              return new Just(fst(f(b)));
          };
      }
  };
  var unfoldable1Array = {
      unfoldr1: /* #__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust$3)(fst)(snd)
  };
  var replicate1 = function (dictUnfoldable1) {
      var unfoldr11 = unfoldr1(dictUnfoldable1);
      return function (n) {
          return function (v) {
              var step = function (i) {
                  if (i <= 0) {
                      return new Tuple(v, Nothing.value);
                  };
                  if (otherwise) {
                      return new Tuple(v, new Just(i - 1 | 0));
                  };
                  throw new Error("Failed pattern match at Data.Unfoldable1 (line 68, column 5 - line 68, column 39): " + [ i.constructor.name ]);
              };
              return unfoldr11(step)(n - 1 | 0);
          };
      };
  };
  var replicate1A = function (dictApply) {
      return function (dictUnfoldable1) {
          var replicate11 = replicate1(dictUnfoldable1);
          return function (dictTraversable1) {
              var sequence1$1 = sequence1(dictTraversable1)(dictApply);
              return function (n) {
                  return function (m) {
                      return sequence1$1(replicate11(n)(m));
                  };
              };
          };
      };
  };
  var singleton$3 = function (dictUnfoldable1) {
      return replicate1(dictUnfoldable1)(1);
  };
  var range$1 = function (dictUnfoldable1) {
      var unfoldr11 = unfoldr1(dictUnfoldable1);
      return function (start) {
          return function (end) {
              var go = function (delta) {
                  return function (i) {
                      var i$prime = i + delta | 0;
                      return new Tuple(i, (function () {
                          var $25 = i === end;
                          if ($25) {
                              return Nothing.value;
                          };
                          return new Just(i$prime);
                      })());
                  };
              };
              var delta = (function () {
                  var $26 = end >= start;
                  if ($26) {
                      return 1;
                  };
                  return -1 | 0;
              })();
              return unfoldr11(go(delta))(start);
          };
      };
  };
  var iterateN = function (dictUnfoldable1) {
      var unfoldr11 = unfoldr1(dictUnfoldable1);
      return function (n) {
          return function (f) {
              return function (s) {
                  var go = function (v) {
                      return new Tuple(v.value0, (function () {
                          var $28 = v.value1 > 0;
                          if ($28) {
                              return new Just(new Tuple(f(v.value0), v.value1 - 1 | 0));
                          };
                          return Nothing.value;
                      })());
                  };
                  return unfoldr11(go)(new Tuple(s, n - 1 | 0));
              };
          };
      };
  };

  // Generated by purs version 0.15.15
  var map$h = /* #__PURE__ */ map$o(functorMaybe);
  var fromJust$2 = /* #__PURE__ */ fromJust$4();
  var unfoldr$1 = function (dict) {
      return dict.unfoldr;
  };
  var unfoldableMaybe = {
      unfoldr: function (f) {
          return function (b) {
              return map$h(fst)(f(b));
          };
      },
      Unfoldable10: function () {
          return unfoldable1Maybe;
      }
  };
  var unfoldableArray = {
      unfoldr: /* #__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust$2)(fst)(snd),
      Unfoldable10: function () {
          return unfoldable1Array;
      }
  };
  var replicate$1 = function (dictUnfoldable) {
      var unfoldr1 = unfoldr$1(dictUnfoldable);
      return function (n) {
          return function (v) {
              var step = function (i) {
                  var $17 = i <= 0;
                  if ($17) {
                      return Nothing.value;
                  };
                  return new Just(new Tuple(v, i - 1 | 0));
              };
              return unfoldr1(step)(n);
          };
      };
  };
  var replicateA = function (dictApplicative) {
      return function (dictUnfoldable) {
          var replicate1 = replicate$1(dictUnfoldable);
          return function (dictTraversable) {
              var sequence = sequence$1(dictTraversable)(dictApplicative);
              return function (n) {
                  return function (m) {
                      return sequence(replicate1(n)(m));
                  };
              };
          };
      };
  };
  var none = function (dictUnfoldable) {
      return unfoldr$1(dictUnfoldable)($$const(Nothing.value))(unit);
  };
  var fromMaybe = function (dictUnfoldable) {
      return unfoldr$1(dictUnfoldable)(function (b) {
          return map$h(flip(Tuple.create)(Nothing.value))(b);
      });
  };

  // Generated by purs version 0.15.15
  var sequence = /* #__PURE__ */ sequence$1(traversableArray);
  var traverse_$1 = /* #__PURE__ */ traverse_$2(applicativeST);
  var $$void$1 = /* #__PURE__ */ $$void$5(functorST);
  var intercalate1 = /* #__PURE__ */ intercalate$2(foldableArray);
  var apply$1 = /* #__PURE__ */ apply$4(applyMaybe);
  var map$g = /* #__PURE__ */ map$o(functorMaybe);
  var map1 = /* #__PURE__ */ map$o(functorArray);
  var map2 = /* #__PURE__ */ map$o(functorST);
  var fromJust$1 = /* #__PURE__ */ fromJust$4();
  var when = /* #__PURE__ */ when$1(applicativeST);
  var notEq = /* #__PURE__ */ notEq$2(eqOrdering);
  var eq1$1 = /* #__PURE__ */ eq$2(eqOrdering);
  var foldMap1 = /* #__PURE__ */ foldMap$1(foldableArray);
  var fold1 = /* #__PURE__ */ fold$1(foldableArray);
  var append = /* #__PURE__ */ append$1(semigroupArray);
  var traverse = /* #__PURE__ */ traverse$1(traversableArray);
  var zipWith = /* #__PURE__ */ runFn3(zipWithImpl);
  var zipWithA = function (dictApplicative) {
      var sequence1 = sequence(dictApplicative);
      return function (f) {
          return function (xs) {
              return function (ys) {
                  return sequence1(zipWith(f)(xs)(ys));
              };
          };
      };
  };
  var zip = /* #__PURE__ */ (function () {
      return zipWith(Tuple.create);
  })();
  var updateAtIndices = function (dictFoldable) {
      var traverse_1 = traverse_$1(dictFoldable);
      return function (us) {
          return function (xs) {
              return withArray(function (res) {
                  return traverse_1(function (v) {
                      return poke(v.value0)(v.value1)(res);
                  })(us);
              })(xs)();
          };
      };
  };
  var updateAt = /* #__PURE__ */ (function () {
      return runFn5(_updateAt)(Just.create)(Nothing.value);
  })();
  var unsafeIndex = function () {
      return runFn2(unsafeIndexImpl);
  };
  var unsafeIndex1 = /* #__PURE__ */ unsafeIndex();
  var uncons$2 = /* #__PURE__ */ (function () {
      return runFn3(unconsImpl)($$const(Nothing.value))(function (x) {
          return function (xs) {
              return new Just({
                  head: x,
                  tail: xs
              });
          };
      });
  })();
  var toUnfoldable = function (dictUnfoldable) {
      var unfoldr = unfoldr$1(dictUnfoldable);
      return function (xs) {
          var len = length$7(xs);
          var f = function (i) {
              if (i < len) {
                  return new Just(new Tuple(unsafeIndex1(xs)(i), i + 1 | 0));
              };
              if (otherwise) {
                  return Nothing.value;
              };
              throw new Error("Failed pattern match at Data.Array (line 163, column 3 - line 165, column 26): " + [ i.constructor.name ]);
          };
          return unfoldr(f)(0);
      };
  };
  var tail = /* #__PURE__ */ (function () {
      return runFn3(unconsImpl)($$const(Nothing.value))(function (v) {
          return function (xs) {
              return new Just(xs);
          };
      });
  })();
  var sortBy = function (comp) {
      return runFn3(sortByImpl$1)(comp)(function (v) {
          if (v instanceof GT) {
              return 1;
          };
          if (v instanceof EQ) {
              return 0;
          };
          if (v instanceof LT) {
              return -1 | 0;
          };
          throw new Error("Failed pattern match at Data.Array (line 897, column 38 - line 900, column 11): " + [ v.constructor.name ]);
      });
  };
  var sortWith = function (dictOrd) {
      var comparing$1 = comparing(dictOrd);
      return function (f) {
          return sortBy(comparing$1(f));
      };
  };
  var sortWith1 = /* #__PURE__ */ sortWith(ordInt);
  var sort = function (dictOrd) {
      var compare = compare$3(dictOrd);
      return function (xs) {
          return sortBy(compare)(xs);
      };
  };
  var snoc = function (xs) {
      return function (x) {
          return withArray(push(x))(xs)();
      };
  };
  var slice$1 = /* #__PURE__ */ runFn3(sliceImpl);
  var splitAt$2 = function (v) {
      return function (v1) {
          if (v <= 0) {
              return {
                  before: [  ],
                  after: v1
              };
          };
          return {
              before: slice$1(0)(v)(v1),
              after: slice$1(v)(length$7(v1))(v1)
          };
      };
  };
  var take$2 = function (n) {
      return function (xs) {
          var $152 = n < 1;
          if ($152) {
              return [  ];
          };
          return slice$1(0)(n)(xs);
      };
  };
  var singleton$2 = function (a) {
      return [ a ];
  };
  var scanr = /* #__PURE__ */ runFn3(scanrImpl);
  var scanl = /* #__PURE__ */ runFn3(scanlImpl);
  var replicate = /* #__PURE__ */ runFn2(replicateImpl);
  var range = /* #__PURE__ */ runFn2(rangeImpl);
  var partition = /* #__PURE__ */ runFn2(partitionImpl);
  var $$null$1 = function (xs) {
      return length$7(xs) === 0;
  };
  var modifyAtIndices = function (dictFoldable) {
      var traverse_1 = traverse_$1(dictFoldable);
      return function (is) {
          return function (f) {
              return function (xs) {
                  return withArray(function (res) {
                      return traverse_1(function (i) {
                          return modify$1(i)(f)(res);
                      })(is);
                  })(xs)();
              };
          };
      };
  };
  var mapWithIndex = /* #__PURE__ */ mapWithIndex$1(functorWithIndexArray);
  var intersperse = function (a) {
      return function (arr) {
          var v = length$7(arr);
          if (v < 2) {
              return arr;
          };
          if (otherwise) {
              return run((function () {
                  var unsafeGetElem = function (idx) {
                      return unsafeIndex1(arr)(idx);
                  };
                  return function __do() {
                      var out = newSTArray();
                      push(unsafeGetElem(0))(out)();
                      forST(1)(v)(function (idx) {
                          return function __do() {
                              push(a)(out)();
                              return $$void$1(push(unsafeGetElem(idx))(out))();
                          };
                      })();
                      return out;
                  };
              })());
          };
          throw new Error("Failed pattern match at Data.Array (line 623, column 21 - line 633, column 17): " + [ v.constructor.name ]);
      };
  };
  var intercalate = function (dictMonoid) {
      return intercalate1(dictMonoid);
  };
  var insertAt = /* #__PURE__ */ (function () {
      return runFn5(_insertAt)(Just.create)(Nothing.value);
  })();
  var init = function (xs) {
      if ($$null$1(xs)) {
          return Nothing.value;
      };
      if (otherwise) {
          return new Just(slice$1(0)(length$7(xs) - 1 | 0)(xs));
      };
      throw new Error("Failed pattern match at Data.Array (line 351, column 1 - line 351, column 45): " + [ xs.constructor.name ]);
  };
  var index$1 = /* #__PURE__ */ (function () {
      return runFn4(indexImpl)(Just.create)(Nothing.value);
  })();
  var last = function (xs) {
      return index$1(xs)(length$7(xs) - 1 | 0);
  };
  var unsnoc = function (xs) {
      return apply$1(map$g(function (v) {
          return function (v1) {
              return {
                  init: v,
                  last: v1
              };
          };
      })(init(xs)))(last(xs));
  };
  var modifyAt = function (i) {
      return function (f) {
          return function (xs) {
              var go = function (x) {
                  return updateAt(i)(f(x))(xs);
              };
              return maybe(Nothing.value)(go)(index$1(xs)(i));
          };
      };
  };
  var span$1 = function (p) {
      return function (arr) {
          var go = function ($copy_i) {
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(i) {
                  var v = index$1(arr)(i);
                  if (v instanceof Just) {
                      var $156 = p(v.value0);
                      if ($156) {
                          $copy_i = i + 1 | 0;
                          return;
                      };
                      $tco_done = true;
                      return new Just(i);
                  };
                  if (v instanceof Nothing) {
                      $tco_done = true;
                      return Nothing.value;
                  };
                  throw new Error("Failed pattern match at Data.Array (line 1035, column 5 - line 1037, column 25): " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($copy_i);
              };
              return $tco_result;
          };
          var breakIndex = go(0);
          if (breakIndex instanceof Just && breakIndex.value0 === 0) {
              return {
                  init: [  ],
                  rest: arr
              };
          };
          if (breakIndex instanceof Just) {
              return {
                  init: slice$1(0)(breakIndex.value0)(arr),
                  rest: slice$1(breakIndex.value0)(length$7(arr))(arr)
              };
          };
          if (breakIndex instanceof Nothing) {
              return {
                  init: arr,
                  rest: [  ]
              };
          };
          throw new Error("Failed pattern match at Data.Array (line 1022, column 3 - line 1028, column 30): " + [ breakIndex.constructor.name ]);
      };
  };
  var takeWhile$2 = function (p) {
      return function (xs) {
          return (span$1(p)(xs)).init;
      };
  };
  var unzip = function (xs) {
      return (function __do() {
          var fsts = newSTArray();
          var snds = newSTArray();
          var iter = iterator(function (v) {
              return index$1(xs)(v);
          })();
          iterate(iter)(function (v) {
              return function __do() {
                  $$void$1(push(v.value0)(fsts))();
                  return $$void$1(push(v.value1)(snds))();
              };
          })();
          var fsts$prime = unsafeFreeze(fsts)();
          var snds$prime = unsafeFreeze(snds)();
          return new Tuple(fsts$prime, snds$prime);
      })();
  };
  var head$1 = function (xs) {
      return index$1(xs)(0);
  };
  var nubBy = function (comp) {
      return function (xs) {
          var indexedAndSorted = sortBy(function (x) {
              return function (y) {
                  return comp(snd(x))(snd(y));
              };
          })(mapWithIndex(Tuple.create)(xs));
          var v = head$1(indexedAndSorted);
          if (v instanceof Nothing) {
              return [  ];
          };
          if (v instanceof Just) {
              return map1(snd)(sortWith1(fst)((function __do() {
                  var result = unsafeThaw(singleton$2(v.value0))();
                  foreach(indexedAndSorted)(function (v1) {
                      return function __do() {
                          var lst = map2((function () {
                              var $183 = function ($185) {
                                  return fromJust$1(last($185));
                              };
                              return function ($184) {
                                  return snd($183($184));
                              };
                          })())(unsafeFreeze(result))();
                          return when(notEq(comp(lst)(v1.value1))(EQ.value))($$void$1(push(v1)(result)))();
                      };
                  })();
                  return unsafeFreeze(result)();
              })()));
          };
          throw new Error("Failed pattern match at Data.Array (line 1115, column 17 - line 1123, column 28): " + [ v.constructor.name ]);
      };
  };
  var nub$1 = function (dictOrd) {
      return nubBy(compare$3(dictOrd));
  };
  var groupBy = function (op) {
      return function (xs) {
          return (function __do() {
              var result = newSTArray();
              var iter = iterator(function (v) {
                  return index$1(xs)(v);
              })();
              iterate(iter)(function (x) {
                  return $$void$1(function __do() {
                      var sub1 = newSTArray();
                      push(x)(sub1)();
                      pushWhile(op(x))(iter)(sub1)();
                      var grp = unsafeFreeze(sub1)();
                      return push(grp)(result)();
                  });
              })();
              return unsafeFreeze(result)();
          })();
      };
  };
  var groupAllBy = function (cmp) {
      var $186 = groupBy(function (x) {
          return function (y) {
              return eq1$1(cmp(x)(y))(EQ.value);
          };
      });
      var $187 = sortBy(cmp);
      return function ($188) {
          return $186($187($188));
      };
  };
  var groupAll = function (dictOrd) {
      return groupAllBy(compare$3(dictOrd));
  };
  var group$1 = function (dictEq) {
      var eq2 = eq$2(dictEq);
      return function (xs) {
          return groupBy(eq2)(xs);
      };
  };
  var fromFoldable = function (dictFoldable) {
      return runFn2(fromFoldableImpl)(foldr$1(dictFoldable));
  };
  var foldr = /* #__PURE__ */ foldr$1(foldableArray);
  var foldl = /* #__PURE__ */ foldl$1(foldableArray);
  var transpose = function (xs) {
      var buildNext = function (idx) {
          return flip(foldl)(Nothing.value)(function (acc) {
              return function (nextArr) {
                  return maybe(acc)(function (el) {
                      return new Just(maybe([ el ])(flip(snoc)(el))(acc));
                  })(index$1(nextArr)(idx));
              };
          })(xs);
      };
      var go = function ($copy_idx) {
          return function ($copy_allArrays) {
              var $tco_var_idx = $copy_idx;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(idx, allArrays) {
                  var v = buildNext(idx);
                  if (v instanceof Nothing) {
                      $tco_done = true;
                      return allArrays;
                  };
                  if (v instanceof Just) {
                      $tco_var_idx = idx + 1 | 0;
                      $copy_allArrays = snoc(allArrays)(v.value0);
                      return;
                  };
                  throw new Error("Failed pattern match at Data.Array (line 837, column 22 - line 839, column 52): " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_idx, $copy_allArrays);
              };
              return $tco_result;
          };
      };
      return go(0)([  ]);
  };
  var foldRecM = function (dictMonadRec) {
      var Monad0 = dictMonadRec.Monad0();
      var pure1 = pure$2(Monad0.Applicative0());
      var bind1 = bind$4(Monad0.Bind1());
      var tailRecM2$1 = tailRecM2(dictMonadRec);
      return function (f) {
          return function (b) {
              return function (array) {
                  var go = function (res) {
                      return function (i) {
                          if (i >= length$7(array)) {
                              return pure1(new Done(res));
                          };
                          if (otherwise) {
                              return bind1(f(res)(unsafeIndex1(array)(i)))(function (res$prime) {
                                  return pure1(new Loop({
                                      a: res$prime,
                                      b: i + 1 | 0
                                  }));
                              });
                          };
                          throw new Error("Failed pattern match at Data.Array (line 1349, column 3 - line 1353, column 42): " + [ res.constructor.name, i.constructor.name ]);
                      };
                  };
                  return tailRecM2$1(go)(b)(0);
              };
          };
      };
  };
  var foldMap = function (dictMonoid) {
      return foldMap1(dictMonoid);
  };
  var foldM = function (dictMonad) {
      var pure1 = pure$2(dictMonad.Applicative0());
      var bind1 = bind$4(dictMonad.Bind1());
      return function (f) {
          return function (b) {
              return runFn3(unconsImpl)(function (v) {
                  return pure1(b);
              })(function (a) {
                  return function (as) {
                      return bind1(f(b)(a))(function (b$prime) {
                          return foldM(dictMonad)(f)(b$prime)(as);
                      });
                  };
              });
          };
      };
  };
  var fold = function (dictMonoid) {
      return fold1(dictMonoid);
  };
  var findMap = /* #__PURE__ */ (function () {
      return runFn4(findMapImpl)(Nothing.value)(isJust);
  })();
  var findLastIndex = /* #__PURE__ */ (function () {
      return runFn4(findLastIndexImpl)(Just.create)(Nothing.value);
  })();
  var insertBy = function (cmp) {
      return function (x) {
          return function (ys) {
              var i = maybe(0)(function (v) {
                  return v + 1 | 0;
              })(findLastIndex(function (y) {
                  return eq1$1(cmp(x)(y))(GT.value);
              })(ys));
              return fromJust$1(insertAt(i)(x)(ys));
          };
      };
  };
  var insert = function (dictOrd) {
      return insertBy(compare$3(dictOrd));
  };
  var findIndex = /* #__PURE__ */ (function () {
      return runFn4(findIndexImpl)(Just.create)(Nothing.value);
  })();
  var find = function (f) {
      return function (xs) {
          return map$g(unsafeIndex1(xs))(findIndex(f)(xs));
      };
  };
  var filter = /* #__PURE__ */ runFn2(filterImpl);
  var intersectBy = function (eq2) {
      return function (xs) {
          return function (ys) {
              return filter(function (x) {
                  return isJust(findIndex(eq2(x))(ys));
              })(xs);
          };
      };
  };
  var intersect = function (dictEq) {
      return intersectBy(eq$2(dictEq));
  };
  var elemLastIndex = function (dictEq) {
      var eq2 = eq$2(dictEq);
      return function (x) {
          return findLastIndex(function (v) {
              return eq2(v)(x);
          });
      };
  };
  var elemIndex = function (dictEq) {
      var eq2 = eq$2(dictEq);
      return function (x) {
          return findIndex(function (v) {
              return eq2(v)(x);
          });
      };
  };
  var notElem = function (dictEq) {
      var elemIndex1 = elemIndex(dictEq);
      return function (a) {
          return function (arr) {
              return isNothing(elemIndex1(a)(arr));
          };
      };
  };
  var elem = function (dictEq) {
      var elemIndex1 = elemIndex(dictEq);
      return function (a) {
          return function (arr) {
              return isJust(elemIndex1(a)(arr));
          };
      };
  };
  var dropWhile$2 = function (p) {
      return function (xs) {
          return (span$1(p)(xs)).rest;
      };
  };
  var dropEnd = function (n) {
      return function (xs) {
          return take$2(length$7(xs) - n | 0)(xs);
      };
  };
  var drop$2 = function (n) {
      return function (xs) {
          var $173 = n < 1;
          if ($173) {
              return xs;
          };
          return slice$1(n)(length$7(xs))(xs);
      };
  };
  var takeEnd = function (n) {
      return function (xs) {
          return drop$2(length$7(xs) - n | 0)(xs);
      };
  };
  var deleteAt = /* #__PURE__ */ (function () {
      return runFn4(_deleteAt)(Just.create)(Nothing.value);
  })();
  var deleteBy = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2.length === 0) {
                  return [  ];
              };
              return maybe(v2)(function (i) {
                  return fromJust$1(deleteAt(i)(v2));
              })(findIndex(v(v1))(v2));
          };
      };
  };
  var $$delete = function (dictEq) {
      return deleteBy(eq$2(dictEq));
  };
  var difference = function (dictEq) {
      return foldr($$delete(dictEq));
  };
  var cons = function (x) {
      return function (xs) {
          return append([ x ])(xs);
      };
  };
  var some = function (dictAlternative) {
      var apply1 = apply$4((dictAlternative.Applicative0()).Apply0());
      var map3 = map$o(((dictAlternative.Plus1()).Alt0()).Functor0());
      return function (dictLazy) {
          var defer = defer$1(dictLazy);
          return function (v) {
              return apply1(map3(cons)(v))(defer(function (v1) {
                  return many(dictAlternative)(dictLazy)(v);
              }));
          };
      };
  };
  var many = function (dictAlternative) {
      var alt = alt$3((dictAlternative.Plus1()).Alt0());
      var pure1 = pure$2(dictAlternative.Applicative0());
      return function (dictLazy) {
          return function (v) {
              return alt(some(dictAlternative)(dictLazy)(v))(pure1([  ]));
          };
      };
  };
  var concatMap = /* #__PURE__ */ flip(/* #__PURE__ */ bind$4(bindArray));
  var mapMaybe = function (f) {
      return concatMap((function () {
          var $189 = maybe([  ])(singleton$2);
          return function ($190) {
              return $189(f($190));
          };
      })());
  };
  var filterA = function (dictApplicative) {
      var traverse1 = traverse(dictApplicative);
      var map3 = map$o((dictApplicative.Apply0()).Functor0());
      return function (p) {
          var $191 = map3(mapMaybe(function (v) {
              if (v.value1) {
                  return new Just(v.value0);
              };
              return Nothing.value;
          }));
          var $192 = traverse1(function (x) {
              return map3(Tuple.create(x))(p(x));
          });
          return function ($193) {
              return $191($192($193));
          };
      };
  };
  var catMaybes = /* #__PURE__ */ mapMaybe(/* #__PURE__ */ identity$9(categoryFn));
  var any = /* #__PURE__ */ runFn2(anyImpl);
  var nubByEq = function (eq2) {
      return function (xs) {
          return (function __do() {
              var arr = newSTArray();
              foreach(xs)(function (x) {
                  return function __do() {
                      var e = map2((function () {
                          var $194 = any(function (v) {
                              return eq2(v)(x);
                          });
                          return function ($195) {
                              return !$194($195);
                          };
                      })())(unsafeFreeze(arr))();
                      return when(e)($$void$1(push(x)(arr)))();
                  };
              })();
              return unsafeFreeze(arr)();
          })();
      };
  };
  var nubEq = function (dictEq) {
      return nubByEq(eq$2(dictEq));
  };
  var unionBy = function (eq2) {
      return function (xs) {
          return function (ys) {
              return append(xs)(foldl(flip(deleteBy(eq2)))(nubByEq(eq2)(ys))(xs));
          };
      };
  };
  var union = function (dictEq) {
      return unionBy(eq$2(dictEq));
  };
  var alterAt = function (i) {
      return function (f) {
          return function (xs) {
              var go = function (x) {
                  var v = f(x);
                  if (v instanceof Nothing) {
                      return deleteAt(i)(xs);
                  };
                  if (v instanceof Just) {
                      return updateAt(i)(v.value0)(xs);
                  };
                  throw new Error("Failed pattern match at Data.Array (line 601, column 10 - line 603, column 32): " + [ v.constructor.name ]);
              };
              return maybe(Nothing.value)(go)(index$1(xs)(i));
          };
      };
  };
  var all = /* #__PURE__ */ runFn2(allImpl);

  /* eslint-disable no-eq-null, eqeqeq */

  const nullImpl = null;

  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }

  function notNull(x) {
    return x;
  }

  // Generated by purs version 0.15.15
  var toNullable = /* #__PURE__ */ maybe(nullImpl)(notNull);
  var toMaybe = function (n) {
      return nullable(n, Nothing.value, Just.create);
  };
  var showNullable = function (dictShow) {
      return {
          show: (function () {
              var $17 = maybe("null")(show$4(dictShow));
              return function ($18) {
                  return $17(toMaybe($18));
              };
          })()
      };
  };
  var eqNullable = function (dictEq) {
      return {
          eq: on(eq$2(eqMaybe(dictEq)))(toMaybe)
      };
  };
  var ordNullable = function (dictOrd) {
      var eqNullable1 = eqNullable(dictOrd.Eq0());
      return {
          compare: on(compare$3(ordMaybe(dictOrd)))(toMaybe),
          Eq0: function () {
              return eqNullable1;
          }
      };
  };
  var eq1Nullable = {
      eq1: function (dictEq) {
          return eq$2(eqNullable(dictEq));
      }
  };
  var ord1Nullable = {
      compare1: function (dictOrd) {
          return compare$3(ordNullable(dictOrd));
      },
      Eq10: function () {
          return eq1Nullable;
      }
  };

  /* globals exports */
  const nan = NaN;
  const isNaNImpl = isNaN;
  const infinity = Infinity;
  const isFiniteImpl = isFinite;

  function fromStringImpl(str, isFinite, just, nothing) {
    var num = parseFloat(str);
    if (isFinite(num)) {
      return just(num);
    } else {
      return nothing;
    }
  }

  const abs = Math.abs;

  const acos = Math.acos;

  const asin = Math.asin;

  const atan = Math.atan;

  const atan2 = function (y) {
    return function (x) {
      return Math.atan2(y, x);
    };
  };

  const ceil$1 = Math.ceil;

  const cos = Math.cos;

  const exp = Math.exp;

  const floor$1 = Math.floor;

  const log$1 = Math.log;

  const max$3 = function (n1) {
    return function (n2) {
      return Math.max(n1, n2);
    };
  };

  const min$2 = function (n1) {
    return function (n2) {
      return Math.min(n1, n2);
    };
  };

  const pow$1 = function (n) {
    return function (p) {
      return Math.pow(n, p);
    };
  };

  const remainder = function (n) {
    return function (m) {
      return n % m;
    };
  };

  const round$1 = Math.round;

  const sign = Math.sign ? Math.sign : function(x) {
    return x === 0 || x !== x ? x : (x < 0 ? -1 : 1);
  };

  const sin = Math.sin;

  const sqrt = Math.sqrt;

  const tan = Math.tan;

  const trunc$1 = Math.trunc ? Math.trunc : function(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };

  // Generated by purs version 0.15.15
  var tau = 6.283185307179586;
  var sqrt2 = 1.4142135623730951;
  var sqrt1_2 = 0.7071067811865476;
  var pi = 3.141592653589793;
  var log2e = 1.4426950408889634;
  var log10e = 0.4342944819032518;
  var ln2 = 0.6931471805599453;
  var ln10 = 2.302585092994046;
  var fromString$1 = function (str) {
      return fromStringImpl(str, isFiniteImpl, Just.create, Nothing.value);
  };
  var e = 2.718281828459045;

  /* global Symbol */

  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator =
    typeof Symbol !== "undefined" &&
    Symbol != null &&
    typeof Symbol.iterator !== "undefined" &&
    typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";

  const _unsafeCodePointAt0 = function (fallback) {
    return hasCodePointAt
      ? function (str) { return str.codePointAt(0); }
      : fallback;
  };

  const _codePointAt = function (fallback) {
    return function (Just) {
      return function (Nothing) {
        return function (unsafeCodePointAt0) {
          return function (index) {
            return function (str) {
              var length = str.length;
              if (index < 0 || index >= length) return Nothing;
              if (hasStringIterator) {
                var iter = str[Symbol.iterator]();
                for (var i = index;; --i) {
                  var o = iter.next();
                  if (o.done) return Nothing;
                  if (i === 0) return Just(unsafeCodePointAt0(o.value));
                }
              }
              return fallback(index)(str);
            };
          };
        };
      };
    };
  };

  const _countPrefix = function (fallback) {
    return function (unsafeCodePointAt0) {
      if (hasStringIterator) {
        return function (pred) {
          return function (str) {
            var iter = str[Symbol.iterator]();
            for (var cpCount = 0; ; ++cpCount) {
              var o = iter.next();
              if (o.done) return cpCount;
              var cp = unsafeCodePointAt0(o.value);
              if (!pred(cp)) return cpCount;
            }
          };
        };
      }
      return fallback;
    };
  };

  const _fromCodePointArray = function (singleton) {
    return hasFromCodePoint
      ? function (cps) {
        // Function.prototype.apply will fail for very large second parameters,
        // so we don't use it for arrays with 10,000 or more entries.
        if (cps.length < 10e3) {
          return String.fromCodePoint.apply(String, cps);
        }
        return cps.map(singleton).join("");
      }
      : function (cps) {
        return cps.map(singleton).join("");
      };
  };

  const _singleton = function (fallback) {
    return hasFromCodePoint ? String.fromCodePoint : fallback;
  };

  const _take = function (fallback) {
    return function (n) {
      if (hasStringIterator) {
        return function (str) {
          var accum = "";
          var iter = str[Symbol.iterator]();
          for (var i = 0; i < n; ++i) {
            var o = iter.next();
            if (o.done) return accum;
            accum += o.value;
          }
          return accum;
        };
      }
      return fallback(n);
    };
  };

  const _toCodePointArray = function (fallback) {
    return function (unsafeCodePointAt0) {
      if (hasArrayFrom) {
        return function (str) {
          return Array.from(str, unsafeCodePointAt0);
        };
      }
      return fallback;
    };
  };

  function toCharCode(c) {
    return c.charCodeAt(0);
  }

  function fromCharCode$1(c) {
    return String.fromCharCode(c);
  }

  // Generated by purs version 0.15.15
  var guard$1 = function (dictAlternative) {
      var pure = pure$2(dictAlternative.Applicative0());
      var empty$1 = empty(dictAlternative.Plus1());
      return function (v) {
          if (v) {
              return pure(unit);
          };
          if (!v) {
              return empty$1;
          };
          throw new Error("Failed pattern match at Control.Alternative (line 48, column 1 - line 48, column 54): " + [ v.constructor.name ]);
      };
  };
  var alternativeArray = {
      Applicative0: function () {
          return applicativeArray;
      },
      Plus1: function () {
          return plusArray;
      }
  };

  // Generated by purs version 0.15.15
  var apply = /* #__PURE__ */ apply$4(applyFn);
  var show$2 = /* #__PURE__ */ show$4(showInt);
  var map$f = /* #__PURE__ */ map$o(functorMaybe);
  var top$1 = /* #__PURE__ */ top$2(boundedInt);
  var bottom$1 = /* #__PURE__ */ bottom$2(boundedInt);
  var bind$1 = /* #__PURE__ */ bind$4(bindMaybe);
  var voidLeft = /* #__PURE__ */ voidLeft$1(functorMaybe);
  var guard = /* #__PURE__ */ guard$1(alternativeMaybe);
  var fromJust = /* #__PURE__ */ fromJust$4();
  var bottom1 = /* #__PURE__ */ bottom$2(boundedChar);
  var top1 = /* #__PURE__ */ top$2(boundedChar);
  var Cardinality = function (x) {
      return x;
  };
  var toEnum$2 = function (dict) {
      return dict.toEnum;
  };
  var succ = function (dict) {
      return dict.succ;
  };
  var upFromIncluding = function (dictEnum) {
      var succ1 = succ(dictEnum);
      return function (dictUnfoldable1) {
          return unfoldr1(dictUnfoldable1)(apply(Tuple.create)(succ1));
      };
  };
  var showCardinality = {
      show: function (v) {
          return "(Cardinality " + (show$2(v) + ")");
      }
  };
  var pred = function (dict) {
      return dict.pred;
  };
  var ordCardinality = ordInt;
  var newtypeCardinality = {
      Coercible0: function () {
          return undefined;
      }
  };
  var fromEnum$1 = function (dict) {
      return dict.fromEnum;
  };
  var toEnumWithDefaults = function (dictBoundedEnum) {
      var toEnum1 = toEnum$2(dictBoundedEnum);
      var fromEnum1 = fromEnum$1(dictBoundedEnum);
      var bottom2 = bottom$2(dictBoundedEnum.Bounded0());
      return function (low) {
          return function (high) {
              return function (x) {
                  var v = toEnum1(x);
                  if (v instanceof Just) {
                      return v.value0;
                  };
                  if (v instanceof Nothing) {
                      var $140 = x < fromEnum1(bottom2);
                      if ($140) {
                          return low;
                      };
                      return high;
                  };
                  throw new Error("Failed pattern match at Data.Enum (line 158, column 33 - line 160, column 62): " + [ v.constructor.name ]);
              };
          };
      };
  };
  var eqCardinality = eqInt;
  var enumUnit = /* #__PURE__ */ (function () {
      return {
          succ: $$const(Nothing.value),
          pred: $$const(Nothing.value),
          Ord0: function () {
              return ordUnit;
          }
      };
  })();
  var enumTuple = function (dictEnum) {
      var succ1 = succ(dictEnum);
      var pred1 = pred(dictEnum);
      var ordTuple$1 = ordTuple(dictEnum.Ord0());
      return function (dictBoundedEnum) {
          var Bounded0 = dictBoundedEnum.Bounded0();
          var bottom2 = bottom$2(Bounded0);
          var Enum1 = dictBoundedEnum.Enum1();
          var succ2 = succ(Enum1);
          var top2 = top$2(Bounded0);
          var pred2 = pred(Enum1);
          var ordTuple1 = ordTuple$1(Enum1.Ord0());
          return {
              succ: function (v) {
                  return maybe(map$f(flip(Tuple.create)(bottom2))(succ1(v.value0)))((function () {
                      var $183 = Tuple.create(v.value0);
                      return function ($184) {
                          return Just.create($183($184));
                      };
                  })())(succ2(v.value1));
              },
              pred: function (v) {
                  return maybe(map$f(flip(Tuple.create)(top2))(pred1(v.value0)))((function () {
                      var $185 = Tuple.create(v.value0);
                      return function ($186) {
                          return Just.create($185($186));
                      };
                  })())(pred2(v.value1));
              },
              Ord0: function () {
                  return ordTuple1;
              }
          };
      };
  };
  var enumOrdering = {
      succ: function (v) {
          if (v instanceof LT) {
              return new Just(EQ.value);
          };
          if (v instanceof EQ) {
              return new Just(GT.value);
          };
          if (v instanceof GT) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Enum (line 72, column 1 - line 78, column 20): " + [ v.constructor.name ]);
      },
      pred: function (v) {
          if (v instanceof LT) {
              return Nothing.value;
          };
          if (v instanceof EQ) {
              return new Just(LT.value);
          };
          if (v instanceof GT) {
              return new Just(EQ.value);
          };
          throw new Error("Failed pattern match at Data.Enum (line 72, column 1 - line 78, column 20): " + [ v.constructor.name ]);
      },
      Ord0: function () {
          return ordOrdering;
      }
  };
  var enumMaybe = function (dictBoundedEnum) {
      var bottom2 = bottom$2(dictBoundedEnum.Bounded0());
      var Enum1 = dictBoundedEnum.Enum1();
      var succ1 = succ(Enum1);
      var pred1 = pred(Enum1);
      var ordMaybe$1 = ordMaybe(Enum1.Ord0());
      return {
          succ: function (v) {
              if (v instanceof Nothing) {
                  return new Just(new Just(bottom2));
              };
              if (v instanceof Just) {
                  return map$f(Just.create)(succ1(v.value0));
              };
              throw new Error("Failed pattern match at Data.Enum (line 80, column 1 - line 84, column 32): " + [ v.constructor.name ]);
          },
          pred: function (v) {
              if (v instanceof Nothing) {
                  return Nothing.value;
              };
              if (v instanceof Just) {
                  return new Just(pred1(v.value0));
              };
              throw new Error("Failed pattern match at Data.Enum (line 80, column 1 - line 84, column 32): " + [ v.constructor.name ]);
          },
          Ord0: function () {
              return ordMaybe$1;
          }
      };
  };
  var enumInt = {
      succ: function (n) {
          var $153 = n < top$1;
          if ($153) {
              return new Just(n + 1 | 0);
          };
          return Nothing.value;
      },
      pred: function (n) {
          var $154 = n > bottom$1;
          if ($154) {
              return new Just(n - 1 | 0);
          };
          return Nothing.value;
      },
      Ord0: function () {
          return ordInt;
      }
  };
  var enumFromTo = function (dictEnum) {
      var Ord0 = dictEnum.Ord0();
      var eq1 = eq$2(Ord0.Eq0());
      var lessThan1 = lessThan(Ord0);
      var succ1 = succ(dictEnum);
      var lessThanOrEq1 = lessThanOrEq(Ord0);
      var pred1 = pred(dictEnum);
      var greaterThanOrEq1 = greaterThanOrEq(Ord0);
      return function (dictUnfoldable1) {
          var singleton = singleton$3(dictUnfoldable1);
          var unfoldr1$1 = unfoldr1(dictUnfoldable1);
          var go = function (step) {
              return function (op) {
                  return function (to) {
                      return function (a) {
                          return new Tuple(a, bind$1(step(a))(function (a$prime) {
                              return voidLeft(guard(op(a$prime)(to)))(a$prime);
                          }));
                      };
                  };
              };
          };
          return function (v) {
              return function (v1) {
                  if (eq1(v)(v1)) {
                      return singleton(v);
                  };
                  if (lessThan1(v)(v1)) {
                      return unfoldr1$1(go(succ1)(lessThanOrEq1)(v1))(v);
                  };
                  if (otherwise) {
                      return unfoldr1$1(go(pred1)(greaterThanOrEq1)(v1))(v);
                  };
                  throw new Error("Failed pattern match at Data.Enum (line 186, column 14 - line 190, column 51): " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
      };
  };
  var enumFromThenTo = function (dictUnfoldable) {
      var unfoldr = unfoldr$1(dictUnfoldable);
      return function (dictFunctor) {
          var map1 = map$o(dictFunctor);
          return function (dictBoundedEnum) {
              var fromEnum1 = fromEnum$1(dictBoundedEnum);
              var toEnum1 = toEnum$2(dictBoundedEnum);
              var go = function (step) {
                  return function (to) {
                      return function (e) {
                          if (e <= to) {
                              return new Just(new Tuple(e, e + step | 0));
                          };
                          if (otherwise) {
                              return Nothing.value;
                          };
                          throw new Error("Failed pattern match at Data.Enum (line 217, column 5 - line 219, column 28): " + [ step.constructor.name, to.constructor.name, e.constructor.name ]);
                      };
                  };
              };
              return function (a) {
                  return function (b) {
                      return function (c) {
                          var c$prime = fromEnum1(c);
                          var b$prime = fromEnum1(b);
                          var a$prime = fromEnum1(a);
                          return map1(function ($187) {
                              return fromJust(toEnum1($187));
                          })(unfoldr(go(b$prime - a$prime | 0)(c$prime))(a$prime));
                      };
                  };
              };
          };
      };
  };
  var enumEither = function (dictBoundedEnum) {
      var Enum1 = dictBoundedEnum.Enum1();
      var succ1 = succ(Enum1);
      var pred1 = pred(Enum1);
      var top2 = top$2(dictBoundedEnum.Bounded0());
      var ordEither$1 = ordEither(Enum1.Ord0());
      return function (dictBoundedEnum1) {
          var bottom2 = bottom$2(dictBoundedEnum1.Bounded0());
          var Enum11 = dictBoundedEnum1.Enum1();
          var succ2 = succ(Enum11);
          var pred2 = pred(Enum11);
          var ordEither1 = ordEither$1(Enum11.Ord0());
          return {
              succ: function (v) {
                  if (v instanceof Left) {
                      return maybe(new Just(new Right(bottom2)))(function ($188) {
                          return Just.create(Left.create($188));
                      })(succ1(v.value0));
                  };
                  if (v instanceof Right) {
                      return maybe(Nothing.value)(function ($189) {
                          return Just.create(Right.create($189));
                      })(succ2(v.value0));
                  };
                  throw new Error("Failed pattern match at Data.Enum (line 86, column 1 - line 90, column 69): " + [ v.constructor.name ]);
              },
              pred: function (v) {
                  if (v instanceof Left) {
                      return maybe(Nothing.value)(function ($190) {
                          return Just.create(Left.create($190));
                      })(pred1(v.value0));
                  };
                  if (v instanceof Right) {
                      return maybe(new Just(new Left(top2)))(function ($191) {
                          return Just.create(Right.create($191));
                      })(pred2(v.value0));
                  };
                  throw new Error("Failed pattern match at Data.Enum (line 86, column 1 - line 90, column 69): " + [ v.constructor.name ]);
              },
              Ord0: function () {
                  return ordEither1;
              }
          };
      };
  };
  var enumBoolean = {
      succ: function (v) {
          if (!v) {
              return new Just(true);
          };
          return Nothing.value;
      },
      pred: function (v) {
          if (v) {
              return new Just(false);
          };
          return Nothing.value;
      },
      Ord0: function () {
          return ordBoolean;
      }
  };
  var downFromIncluding = function (dictEnum) {
      var pred1 = pred(dictEnum);
      return function (dictUnfoldable1) {
          return unfoldr1(dictUnfoldable1)(apply(Tuple.create)(pred1));
      };
  };
  var diag = function (a) {
      return new Tuple(a, a);
  };
  var downFrom = function (dictEnum) {
      var pred1 = pred(dictEnum);
      return function (dictUnfoldable) {
          return unfoldr$1(dictUnfoldable)((function () {
              var $192 = map$f(diag);
              return function ($193) {
                  return $192(pred1($193));
              };
          })());
      };
  };
  var upFrom = function (dictEnum) {
      var succ1 = succ(dictEnum);
      return function (dictUnfoldable) {
          return unfoldr$1(dictUnfoldable)((function () {
              var $194 = map$f(diag);
              return function ($195) {
                  return $194(succ1($195));
              };
          })());
      };
  };
  var defaultToEnum = function (dictBounded) {
      var bottom2 = bottom$2(dictBounded);
      return function (dictEnum) {
          var succ1 = succ(dictEnum);
          return function (i$prime) {
              var go = function ($copy_i) {
                  return function ($copy_x) {
                      var $tco_var_i = $copy_i;
                      var $tco_done = false;
                      var $tco_result;
                      function $tco_loop(i, x) {
                          var $168 = i === 0;
                          if ($168) {
                              $tco_done = true;
                              return new Just(x);
                          };
                          var v = succ1(x);
                          if (v instanceof Just) {
                              $tco_var_i = i - 1 | 0;
                              $copy_x = v.value0;
                              return;
                          };
                          if (v instanceof Nothing) {
                              $tco_done = true;
                              return Nothing.value;
                          };
                          throw new Error("Failed pattern match at Data.Enum (line 296, column 12 - line 298, column 33): " + [ v.constructor.name ]);
                      };
                      while (!$tco_done) {
                          $tco_result = $tco_loop($tco_var_i, $copy_x);
                      };
                      return $tco_result;
                  };
              };
              var $171 = i$prime < 0;
              if ($171) {
                  return Nothing.value;
              };
              return go(i$prime)(bottom2);
          };
      };
  };
  var defaultSucc = function (toEnum$prime) {
      return function (fromEnum$prime) {
          return function (a) {
              return toEnum$prime(fromEnum$prime(a) + 1 | 0);
          };
      };
  };
  var defaultPred = function (toEnum$prime) {
      return function (fromEnum$prime) {
          return function (a) {
              return toEnum$prime(fromEnum$prime(a) - 1 | 0);
          };
      };
  };
  var defaultFromEnum = function (dictEnum) {
      var pred1 = pred(dictEnum);
      var go = function ($copy_i) {
          return function ($copy_x) {
              var $tco_var_i = $copy_i;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(i, x) {
                  var v = pred1(x);
                  if (v instanceof Just) {
                      $tco_var_i = i + 1 | 0;
                      $copy_x = v.value0;
                      return;
                  };
                  if (v instanceof Nothing) {
                      $tco_done = true;
                      return i;
                  };
                  throw new Error("Failed pattern match at Data.Enum (line 309, column 5 - line 311, column 19): " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_i, $copy_x);
              };
              return $tco_result;
          };
      };
      return go(0);
  };
  var defaultCardinality = function (dictBounded) {
      var bottom2 = bottom$2(dictBounded);
      return function (dictEnum) {
          var succ1 = succ(dictEnum);
          var go = function ($copy_i) {
              return function ($copy_x) {
                  var $tco_var_i = $copy_i;
                  var $tco_done = false;
                  var $tco_result;
                  function $tco_loop(i, x) {
                      var v = succ1(x);
                      if (v instanceof Just) {
                          $tco_var_i = i + 1 | 0;
                          $copy_x = v.value0;
                          return;
                      };
                      if (v instanceof Nothing) {
                          $tco_done = true;
                          return i;
                      };
                      throw new Error("Failed pattern match at Data.Enum (line 276, column 5 - line 278, column 19): " + [ v.constructor.name ]);
                  };
                  while (!$tco_done) {
                      $tco_result = $tco_loop($tco_var_i, $copy_x);
                  };
                  return $tco_result;
              };
          };
          return go(1)(bottom2);
      };
  };
  var charToEnum = function (v) {
      if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
          return new Just(fromCharCode$1(v));
      };
      return Nothing.value;
  };
  var enumChar = {
      succ: /* #__PURE__ */ defaultSucc(charToEnum)(toCharCode),
      pred: /* #__PURE__ */ defaultPred(charToEnum)(toCharCode),
      Ord0: function () {
          return ordChar;
      }
  };
  var cardinality = function (dict) {
      return dict.cardinality;
  };
  var boundedEnumUnit = {
      cardinality: 1,
      toEnum: function (v) {
          if (v === 0) {
              return new Just(unit);
          };
          return Nothing.value;
      },
      fromEnum: /* #__PURE__ */ $$const(0),
      Bounded0: function () {
          return boundedUnit;
      },
      Enum1: function () {
          return enumUnit;
      }
  };
  var boundedEnumOrdering = {
      cardinality: 3,
      toEnum: function (v) {
          if (v === 0) {
              return new Just(LT.value);
          };
          if (v === 1) {
              return new Just(EQ.value);
          };
          if (v === 2) {
              return new Just(GT.value);
          };
          return Nothing.value;
      },
      fromEnum: function (v) {
          if (v instanceof LT) {
              return 0;
          };
          if (v instanceof EQ) {
              return 1;
          };
          if (v instanceof GT) {
              return 2;
          };
          throw new Error("Failed pattern match at Data.Enum (line 137, column 1 - line 145, column 18): " + [ v.constructor.name ]);
      },
      Bounded0: function () {
          return boundedOrdering;
      },
      Enum1: function () {
          return enumOrdering;
      }
  };
  var boundedEnumChar = /* #__PURE__ */ (function () {
      return {
          cardinality: toCharCode(top1) - toCharCode(bottom1) | 0,
          toEnum: charToEnum,
          fromEnum: toCharCode,
          Bounded0: function () {
              return boundedChar;
          },
          Enum1: function () {
              return enumChar;
          }
      };
  })();
  var boundedEnumBoolean = {
      cardinality: 2,
      toEnum: function (v) {
          if (v === 0) {
              return new Just(false);
          };
          if (v === 1) {
              return new Just(true);
          };
          return Nothing.value;
      },
      fromEnum: function (v) {
          if (!v) {
              return 0;
          };
          if (v) {
              return 1;
          };
          throw new Error("Failed pattern match at Data.Enum (line 118, column 1 - line 124, column 20): " + [ v.constructor.name ]);
      },
      Bounded0: function () {
          return boundedBoolean;
      },
      Enum1: function () {
          return enumBoolean;
      }
  };

  const fromNumberImpl = function (just) {
    return function (nothing) {
      return function (n) {
        /* jshint bitwise: false */
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };

  const toNumber = function (n) {
    return n;
  };

  const fromStringAsImpl = function (just) {
    return function (nothing) {
      return function (radix) {
        var digits;
        if (radix < 11) {
          digits = "[0-" + (radix - 1).toString() + "]";
        } else if (radix === 11) {
          digits = "[0-9a]";
        } else {
          digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
        }
        var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");

        return function (s) {
          /* jshint bitwise: false */
          if (pattern.test(s)) {
            var i = parseInt(s, radix);
            return (i | 0) === i ? just(i) : nothing;
          } else {
            return nothing;
          }
        };
      };
    };
  };

  const toStringAs = function (radix) {
    return function (i) {
      return i.toString(radix);
    };
  };


  const quot = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x / y | 0;
    };
  };

  const rem = function (x) {
    return function (y) {
      return x % y;
    };
  };

  const pow = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return Math.pow(x,y) | 0;
    };
  };

  // Generated by purs version 0.15.15
  var top = /* #__PURE__ */ top$2(boundedInt);
  var bottom = /* #__PURE__ */ bottom$2(boundedInt);
  var Radix = function (x) {
      return x;
  };
  var Even = /* #__PURE__ */ (function () {
      function Even() {

      };
      Even.value = new Even();
      return Even;
  })();
  var Odd = /* #__PURE__ */ (function () {
      function Odd() {

      };
      Odd.value = new Odd();
      return Odd;
  })();
  var showParity = {
      show: function (v) {
          if (v instanceof Even) {
              return "Even";
          };
          if (v instanceof Odd) {
              return "Odd";
          };
          throw new Error("Failed pattern match at Data.Int (line 117, column 1 - line 119, column 19): " + [ v.constructor.name ]);
      }
  };
  var radix = function (n) {
      if (n >= 2 && n <= 36) {
          return new Just(n);
      };
      if (otherwise) {
          return Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Int (line 198, column 1 - line 198, column 28): " + [ n.constructor.name ]);
  };
  var odd = function (x) {
      return (x & 1) !== 0;
  };
  var octal = 8;
  var hexadecimal = 16;
  var fromStringAs = /* #__PURE__ */ (function () {
      return fromStringAsImpl(Just.create)(Nothing.value);
  })();
  var fromString = /* #__PURE__ */ fromStringAs(10);
  var fromNumber = /* #__PURE__ */ (function () {
      return fromNumberImpl(Just.create)(Nothing.value);
  })();
  var unsafeClamp = function (x) {
      if (!isFiniteImpl(x)) {
          return 0;
      };
      if (x >= toNumber(top)) {
          return top;
      };
      if (x <= toNumber(bottom)) {
          return bottom;
      };
      if (otherwise) {
          return fromMaybe$1(0)(fromNumber(x));
      };
      throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [ x.constructor.name ]);
  };
  var round = function ($37) {
      return unsafeClamp(round$1($37));
  };
  var trunc = function ($38) {
      return unsafeClamp(trunc$1($38));
  };
  var floor = function ($39) {
      return unsafeClamp(floor$1($39));
  };
  var even = function (x) {
      return (x & 1) === 0;
  };
  var parity = function (n) {
      var $28 = even(n);
      if ($28) {
          return Even.value;
      };
      return Odd.value;
  };
  var eqParity = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Even && y instanceof Even) {
                  return true;
              };
              if (x instanceof Odd && y instanceof Odd) {
                  return true;
              };
              return false;
          };
      }
  };
  var eq1 = /* #__PURE__ */ eq$2(eqParity);
  var ordParity = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Even && y instanceof Even) {
                  return EQ.value;
              };
              if (x instanceof Even) {
                  return LT.value;
              };
              if (y instanceof Even) {
                  return GT.value;
              };
              if (x instanceof Odd && y instanceof Odd) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Data.Int (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqParity;
      }
  };
  var semiringParity = /* #__PURE__ */ (function () {
      return {
          zero: Even.value,
          add: function (x) {
              return function (y) {
                  var $33 = eq1(x)(y);
                  if ($33) {
                      return Even.value;
                  };
                  return Odd.value;
              };
          },
          one: Odd.value,
          mul: function (v) {
              return function (v1) {
                  if (v instanceof Odd && v1 instanceof Odd) {
                      return Odd.value;
                  };
                  return Even.value;
              };
          }
      };
  })();
  var ringParity = {
      sub: /* #__PURE__ */ add(semiringParity),
      Semiring0: function () {
          return semiringParity;
      }
  };
  var divisionRingParity = {
      recip: /* #__PURE__ */ identity$9(categoryFn),
      Ring0: function () {
          return ringParity;
      }
  };
  var decimal = 10;
  var commutativeRingParity = {
      Ring0: function () {
          return ringParity;
      }
  };
  var euclideanRingParity = {
      degree: function (v) {
          if (v instanceof Even) {
              return 0;
          };
          if (v instanceof Odd) {
              return 1;
          };
          throw new Error("Failed pattern match at Data.Int (line 137, column 1 - line 141, column 17): " + [ v.constructor.name ]);
      },
      div: function (x) {
          return function (v) {
              return x;
          };
      },
      mod: function (v) {
          return function (v1) {
              return Even.value;
          };
      },
      CommutativeRing0: function () {
          return commutativeRingParity;
      }
  };
  var ceil = function ($40) {
      return unsafeClamp(ceil$1($40));
  };
  var boundedParity = /* #__PURE__ */ (function () {
      return {
          bottom: Even.value,
          top: Odd.value,
          Ord0: function () {
              return ordParity;
          }
      };
  })();
  var binary = 2;
  var base36 = 36;

  const fromCharArray = function (a) {
    return a.join("");
  };

  const toCharArray = function (s) {
    return s.split("");
  };

  const singleton$1 = function (c) {
    return c;
  };

  const _charAt = function (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
        };
      };
    };
  };

  const _toChar = function (just) {
    return function (nothing) {
      return function (s) {
        return s.length === 1 ? just(s) : nothing;
      };
    };
  };

  const length$4 = function (s) {
    return s.length;
  };

  const countPrefix$1 = function (p) {
    return function (s) {
      var i = 0;
      while (i < s.length && p(s.charAt(i))) i++;
      return i;
    };
  };

  const _indexOf = function (just) {
    return function (nothing) {
      return function (x) {
        return function (s) {
          var i = s.indexOf(x);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };

  const _indexOfStartingAt = function (just) {
    return function (nothing) {
      return function (x) {
        return function (startAt) {
          return function (s) {
            if (startAt < 0 || startAt > s.length) return nothing;
            var i = s.indexOf(x, startAt);
            return i === -1 ? nothing : just(i);
          };
        };
      };
    };
  };

  const _lastIndexOf = function (just) {
    return function (nothing) {
      return function (x) {
        return function (s) {
          var i = s.lastIndexOf(x);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };

  const _lastIndexOfStartingAt = function (just) {
    return function (nothing) {
      return function (x) {
        return function (startAt) {
          return function (s) {
            var i = s.lastIndexOf(x, startAt);
            return i === -1 ? nothing : just(i);
          };
        };
      };
    };
  };

  const take$1 = function (n) {
    return function (s) {
      return s.substr(0, n);
    };
  };

  const drop$1 = function (n) {
    return function (s) {
      return s.substring(n);
    };
  };

  const slice = function (b) {
    return function (e) {
      return function (s) {
        return s.slice(b,e);
      };
    };
  };

  const splitAt$1 = function (i) {
    return function (s) {
      return { before: s.substring(0, i), after: s.substring(i) };
    };
  };

  const charAt$1 = function (i) {
    return function (s) {
      if (i >= 0 && i < s.length) return s.charAt(i);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  const char = function (s) {
    if (s.length === 1) return s.charAt(0);
    throw new Error("Data.String.Unsafe.char: Expected string of length 1.");
  };

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var uncons$1 = function (v) {
      if (v === "") {
          return Nothing.value;
      };
      return new Just({
          head: charAt$1(0)(v),
          tail: drop$1(1)(v)
      });
  };
  var toChar = /* #__PURE__ */ (function () {
      return _toChar(Just.create)(Nothing.value);
  })();
  var takeWhile$1 = function (p) {
      return function (s) {
          return take$1(countPrefix$1(p)(s))(s);
      };
  };
  var takeRight = function (i) {
      return function (s) {
          return drop$1(length$4(s) - i | 0)(s);
      };
  };
  var stripSuffix = function (v) {
      return function (str) {
          var v1 = splitAt$1(length$4(str) - length$4(v) | 0)(str);
          var $14 = v1.after === v;
          if ($14) {
              return new Just(v1.before);
          };
          return Nothing.value;
      };
  };
  var stripPrefix = function (v) {
      return function (str) {
          var v1 = splitAt$1(length$4(v))(str);
          var $20 = v1.before === v;
          if ($20) {
              return new Just(v1.after);
          };
          return Nothing.value;
      };
  };
  var lastIndexOf$prime$1 = /* #__PURE__ */ (function () {
      return _lastIndexOfStartingAt(Just.create)(Nothing.value);
  })();
  var lastIndexOf$1 = /* #__PURE__ */ (function () {
      return _lastIndexOf(Just.create)(Nothing.value);
  })();
  var indexOf$prime$1 = /* #__PURE__ */ (function () {
      return _indexOfStartingAt(Just.create)(Nothing.value);
  })();
  var indexOf$1 = /* #__PURE__ */ (function () {
      return _indexOf(Just.create)(Nothing.value);
  })();
  var dropWhile$1 = function (p) {
      return function (s) {
          return drop$1(countPrefix$1(p)(s))(s);
      };
  };
  var dropRight = function (i) {
      return function (s) {
          return take$1(length$4(s) - i | 0)(s);
      };
  };
  var contains = function (pat) {
      var $23 = indexOf$1(pat);
      return function ($24) {
          return isJust($23($24));
      };
  };
  var charAt = /* #__PURE__ */ (function () {
      return _charAt(Just.create)(Nothing.value);
  })();

  const _localeCompare = function (lt) {
    return function (eq) {
      return function (gt) {
        return function (s1) {
          return function (s2) {
            var result = s1.localeCompare(s2);
            return result < 0 ? lt : result > 0 ? gt : eq;
          };
        };
      };
    };
  };

  const replace$1 = function (s1) {
    return function (s2) {
      return function (s3) {
        return s3.replace(s1, s2);
      };
    };
  };

  const replaceAll = function (s1) {
    return function (s2) {
      return function (s3) {
        return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2); // eslint-disable-line no-useless-escape
      };
    };
  };

  const split = function (sep) {
    return function (s) {
      return s.split(sep);
    };
  };

  const toLower = function (s) {
    return s.toLowerCase();
  };

  const toUpper = function (s) {
    return s.toUpperCase();
  };

  const trim = function (s) {
    return s.trim();
  };

  const joinWith = function (s) {
    return function (xs) {
      return xs.join(s);
    };
  };

  // Generated by purs version 0.15.15
  var $$null = function (s) {
      return s === "";
  };
  var localeCompare = /* #__PURE__ */ (function () {
      return _localeCompare(LT.value)(EQ.value)(GT.value);
  })();

  // Generated by purs version 0.15.15
  var $runtime_lazy = function (name, moduleName, init) {
      var state = 0;
      var val;
      return function (lineNumber) {
          if (state === 2) return val;
          if (state === 1) throw new ReferenceError(name + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
          state = 1;
          val = init();
          state = 2;
          return val;
      };
  };
  var fromEnum = /* #__PURE__ */ fromEnum$1(boundedEnumChar);
  var map$e = /* #__PURE__ */ map$o(functorMaybe);
  var unfoldr = /* #__PURE__ */ unfoldr$1(unfoldableArray);
  var div = /* #__PURE__ */ div$2(euclideanRingInt);
  var mod = /* #__PURE__ */ mod$2(euclideanRingInt);
  var compare$2 = /* #__PURE__ */ compare$3(ordInt);
  var CodePoint = function (x) {
      return x;
  };
  var unsurrogate = function (lead) {
      return function (trail) {
          return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
      };
  };
  var showCodePoint = {
      show: function (v) {
          return "(CodePoint 0x" + (toUpper(toStringAs(hexadecimal)(v)) + ")");
      }
  };
  var isTrail = function (cu) {
      return 56320 <= cu && cu <= 57343;
  };
  var isLead = function (cu) {
      return 55296 <= cu && cu <= 56319;
  };
  var uncons = function (s) {
      var v = length$4(s);
      if (v === 0) {
          return Nothing.value;
      };
      if (v === 1) {
          return new Just({
              head: fromEnum(charAt$1(0)(s)),
              tail: ""
          });
      };
      var cu1 = fromEnum(charAt$1(1)(s));
      var cu0 = fromEnum(charAt$1(0)(s));
      var $43 = isLead(cu0) && isTrail(cu1);
      if ($43) {
          return new Just({
              head: unsurrogate(cu0)(cu1),
              tail: drop$1(2)(s)
          });
      };
      return new Just({
          head: cu0,
          tail: drop$1(1)(s)
      });
  };
  var unconsButWithTuple = function (s) {
      return map$e(function (v) {
          return new Tuple(v.head, v.tail);
      })(uncons(s));
  };
  var toCodePointArrayFallback = function (s) {
      return unfoldr(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function (s) {
      var cu0 = fromEnum(charAt$1(0)(s));
      var $47 = isLead(cu0) && length$4(s) > 1;
      if ($47) {
          var cu1 = fromEnum(charAt$1(1)(s));
          var $48 = isTrail(cu1);
          if ($48) {
              return unsurrogate(cu0)(cu1);
          };
          return cu0;
      };
      return cu0;
  };
  var unsafeCodePointAt0 = /* #__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* #__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var length$3 = function ($74) {
      return length$7(toCodePointArray($74));
  };
  var lastIndexOf = function (p) {
      return function (s) {
          return map$e(function (i) {
              return length$3(take$1(i)(s));
          })(lastIndexOf$1(p)(s));
      };
  };
  var indexOf = function (p) {
      return function (s) {
          return map$e(function (i) {
              return length$3(take$1(i)(s));
          })(indexOf$1(p)(s));
      };
  };
  var fromCharCode = /* #__PURE__ */ (function () {
      var $75 = toEnumWithDefaults(boundedEnumChar)(bottom$2(boundedChar))(top$2(boundedChar));
      return function ($76) {
          return singleton$1($75($76));
      };
  })();
  var singletonFallback = function (v) {
      if (v <= 65535) {
          return fromCharCode(v);
      };
      var lead = div(v - 65536 | 0)(1024) + 55296 | 0;
      var trail = mod(v - 65536 | 0)(1024) + 56320 | 0;
      return fromCharCode(lead) + fromCharCode(trail);
  };
  var fromCodePointArray = /* #__PURE__ */ _fromCodePointArray(singletonFallback);
  var singleton = /* #__PURE__ */ _singleton(singletonFallback);
  var takeFallback = function (v) {
      return function (v1) {
          if (v < 1) {
              return "";
          };
          var v2 = uncons(v1);
          if (v2 instanceof Just) {
              return singleton(v2.value0.head) + takeFallback(v - 1 | 0)(v2.value0.tail);
          };
          return v1;
      };
  };
  var take = /* #__PURE__ */ _take(takeFallback);
  var lastIndexOf$prime = function (p) {
      return function (i) {
          return function (s) {
              var i$prime = length$4(take(i)(s));
              return map$e(function (k) {
                  return length$3(take$1(k)(s));
              })(lastIndexOf$prime$1(p)(i$prime)(s));
          };
      };
  };
  var splitAt = function (i) {
      return function (s) {
          var before = take(i)(s);
          return {
              before: before,
              after: drop$1(length$4(before))(s)
          };
      };
  };
  var eqCodePoint = {
      eq: function (x) {
          return function (y) {
              return x === y;
          };
      }
  };
  var ordCodePoint = {
      compare: function (x) {
          return function (y) {
              return compare$2(x)(y);
          };
      },
      Eq0: function () {
          return eqCodePoint;
      }
  };
  var drop = function (n) {
      return function (s) {
          return drop$1(length$4(take(n)(s)))(s);
      };
  };
  var indexOf$prime = function (p) {
      return function (i) {
          return function (s) {
              var s$prime = drop(i)(s);
              return map$e(function (k) {
                  return i + length$3(take$1(k)(s$prime)) | 0;
              })(indexOf$1(p)(s$prime));
          };
      };
  };
  var countTail = function ($copy_p) {
      return function ($copy_s) {
          return function ($copy_accum) {
              var $tco_var_p = $copy_p;
              var $tco_var_s = $copy_s;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(p, s, accum) {
                  var v = uncons(s);
                  if (v instanceof Just) {
                      var $61 = p(v.value0.head);
                      if ($61) {
                          $tco_var_p = p;
                          $tco_var_s = v.value0.tail;
                          $copy_accum = accum + 1 | 0;
                          return;
                      };
                      $tco_done = true;
                      return accum;
                  };
                  $tco_done = true;
                  return accum;
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_p, $tco_var_s, $copy_accum);
              };
              return $tco_result;
          };
      };
  };
  var countFallback = function (p) {
      return function (s) {
          return countTail(p)(s)(0);
      };
  };
  var countPrefix = /* #__PURE__ */ _countPrefix(countFallback)(unsafeCodePointAt0);
  var dropWhile = function (p) {
      return function (s) {
          return drop(countPrefix(p)(s))(s);
      };
  };
  var takeWhile = function (p) {
      return function (s) {
          return take(countPrefix(p)(s))(s);
      };
  };
  var codePointFromChar = function ($77) {
      return CodePoint(fromEnum($77));
  };
  var codePointAtFallback = function ($copy_n) {
      return function ($copy_s) {
          var $tco_var_n = $copy_n;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(n, s) {
              var v = uncons(s);
              if (v instanceof Just) {
                  var $66 = n === 0;
                  if ($66) {
                      $tco_done = true;
                      return new Just(v.value0.head);
                  };
                  $tco_var_n = n - 1 | 0;
                  $copy_s = v.value0.tail;
                  return;
              };
              $tco_done = true;
              return Nothing.value;
          };
          while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_n, $copy_s);
          };
          return $tco_result;
      };
  };
  var codePointAt = function (v) {
      return function (v1) {
          if (v < 0) {
              return Nothing.value;
          };
          if (v === 0 && v1 === "") {
              return Nothing.value;
          };
          if (v === 0) {
              return new Just(unsafeCodePointAt0(v1));
          };
          return _codePointAt(codePointAtFallback)(Just.create)(Nothing.value)(unsafeCodePointAt0)(v)(v1);
      };
  };
  var boundedCodePoint = {
      bottom: 0,
      top: 1114111,
      Ord0: function () {
          return ordCodePoint;
      }
  };
  var boundedEnumCodePoint = /* #__PURE__ */ (function () {
      return {
          cardinality: 1114111 + 1 | 0,
          fromEnum: function (v) {
              return v;
          },
          toEnum: function (n) {
              if (n >= 0 && n <= 1114111) {
                  return new Just(n);
              };
              if (otherwise) {
                  return Nothing.value;
              };
              throw new Error("Failed pattern match at Data.String.CodePoints (line 63, column 1 - line 68, column 26): " + [ n.constructor.name ]);
          },
          Bounded0: function () {
              return boundedCodePoint;
          },
          Enum1: function () {
              return $lazy_enumCodePoint(0);
          }
      };
  })();
  var $lazy_enumCodePoint = /* #__PURE__ */ $runtime_lazy("enumCodePoint", "Data.String.CodePoints", function () {
      return {
          succ: defaultSucc(toEnum$2(boundedEnumCodePoint))(fromEnum$1(boundedEnumCodePoint)),
          pred: defaultPred(toEnum$2(boundedEnumCodePoint))(fromEnum$1(boundedEnumCodePoint)),
          Ord0: function () {
              return ordCodePoint;
          }
      };
  });
  var enumCodePoint = /* #__PURE__ */ $lazy_enumCodePoint(59);

  const log = function (s) {
    return function () {
      console.log(s);
    };
  };

  const warn = function (s) {
    return function () {
      console.warn(s);
    };
  };

  const error = function (s) {
    return function () {
      console.error(s);
    };
  };

  const info = function (s) {
    return function () {
      console.info(s);
    };
  };

  const debug = function (s) {
    return function () {
      console.debug(s);
    };
  };

  const time = function (s) {
    return function () {
      console.time(s);
    };
  };

  const timeLog = function (s) {
    return function () {
      console.timeLog(s);
    };
  };

  const timeEnd = function (s) {
    return function () {
      console.timeEnd(s);
    };
  };

  const clear = function () {
    console.clear();
  };

  const group = function (s) {
    return function () {
      console.group(s);
    };
  };

  const groupCollapsed = function (s) {
    return function () {
      console.groupCollapsed(s);
    };
  };

  const groupEnd = function () {
    console.groupEnd();
  };

  // Generated by purs version 0.15.15
  var warnShow = function (dictShow) {
      var show = show$4(dictShow);
      return function (a) {
          return warn(show(a));
      };
  };
  var logShow = function (dictShow) {
      var show = show$4(dictShow);
      return function (a) {
          return log(show(a));
      };
  };
  var infoShow = function (dictShow) {
      var show = show$4(dictShow);
      return function (a) {
          return info(show(a));
      };
  };
  var grouped = function (name) {
      return function (inner) {
          return function __do() {
              group(name)();
              var result = inner();
              groupEnd();
              return result;
          };
      };
  };
  var errorShow = function (dictShow) {
      var show = show$4(dictShow);
      return function (a) {
          return error(show(a));
      };
  };
  var debugShow = function (dictShow) {
      var show = show$4(dictShow);
      return function (a) {
          return debug(show(a));
      };
  };

  var getEffProp$1 = function (name) {
    return function (doc) {
      return function () {
        return doc[name];
      };
    };
  };

  const url = getEffProp$1("URL");
  const documentURI = getEffProp$1("documentURI");
  const origin$1 = getEffProp$1("origin");
  const compatMode = getEffProp$1("compatMode");
  const characterSet = getEffProp$1("characterSet");
  const contentType = getEffProp$1("contentType");
  function _doctype(doc) {
    return doc["doctype"];
  }
  const _documentElement$1 = getEffProp$1("documentElement");

  function getElementsByTagName$1(localName) {
    return function (doc) {
      return function () {
        return doc.getElementsByTagName(localName);
      };
    };
  }

  function _getElementsByTagNameNS$1(ns) {
    return function (localName) {
      return function (doc) {
        return function () {
          return doc.getElementsByTagNameNS(ns, localName);
        };
      };
    };
  }

  function getElementsByClassName$1(classNames) {
    return function (doc) {
      return function () {
        return doc.getElementsByClassName(classNames);
      };
    };
  }

  function createElement(localName) {
    return function (doc) {
      return function () {
        return doc.createElement(localName);
      };
    };
  }

  function _createElementNS(ns) {
    return function (qualifiedName) {
      return function (doc) {
        return function () {
          return doc.createElementNS(ns, qualifiedName);
        };
      };
    };
  }

  function createDocumentFragment(doc) {
    return function () {
      return doc.createDocumentFragment();
    };
  }

  function createTextNode(data) {
    return function (doc) {
      return function () {
        return doc.createTextNode(data);
      };
    };
  }

  function createComment(data) {
    return function (doc) {
      return function () {
        return doc.createComment(data);
      };
    };
  }

  function createProcessingInstruction(target) {
    return function (data) {
      return function (doc) {
        return function () {
          return doc.createProcessingInstruction(target, data);
        };
      };
    };
  }

  function importNode(node) {
    return function (deep) {
      return function (doc) {
        return function () {
          return doc.importNode(node, deep);
        };
      };
    };
  }

  function adoptNode(node) {
    return function (doc) {
      return function () {
        return doc.adoptNode(node);
      };
    };
  }

  function _unsafeReadProtoTagged(nothing, just, name, value) {
    if (typeof window !== "undefined") {
      var ty = window[name];
      if (ty != null && value instanceof ty) {
        return just(value);
      }
    }
    var obj = value;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name) {
        return just(value);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // Generated by purs version 0.15.15
  var unsafeReadProtoTagged = function (name) {
      return function (value) {
          return _unsafeReadProtoTagged(Nothing.value, Just.create, name, value);
      };
  };

  // Generated by purs version 0.15.15
  var toParentNode$10 = unsafeCoerce;
  var toNonElementParentNode$1 = unsafeCoerce;
  var toNode$11 = unsafeCoerce;
  var toEventTarget$11 = unsafeCoerce;
  var getElementsByTagNameNS$1 = function ($2) {
      return _getElementsByTagNameNS$1(toNullable($2));
  };
  var fromParentNode$10 = /* #__PURE__ */ unsafeReadProtoTagged("Document");
  var fromNonElementParentNode$1 = /* #__PURE__ */ unsafeReadProtoTagged("Document");
  var fromNode$10 = /* #__PURE__ */ unsafeReadProtoTagged("Document");
  var fromEventTarget$11 = /* #__PURE__ */ unsafeReadProtoTagged("Document");
  var documentElement$1 = /* #__PURE__ */ (function () {
      var $3 = map$o(functorEffect)(toMaybe);
      return function ($4) {
          return $3(_documentElement$1($4));
      };
  })();
  var doctype = function ($5) {
      return toMaybe(_doctype($5));
  };
  var createElementNS = function ($6) {
      return _createElementNS(toNullable($6));
  };

  var getProp = function (name) {
    return function (doctype) {
      return doctype[name];
    };
  };

  const _namespaceURI = getProp("namespaceURI");
  const _prefix = getProp("prefix");
  const localName = getProp("localName");
  const tagName = getProp("tagName");

  function id(node) {
    return function () {
      return node.id;
    };
  }

  function setId(id) {
    return function (node) {
      return function () {
        node.id = id;
      };
    };
  }

  function className(node) {
    return function () {
      return node.className;
    };
  }

  function classList(element) {
    return function () {
      return element.classList;
    };
  }

  function setClassName(className) {
    return function (node) {
      return function () {
        node.className = className;
      };
    };
  }

  function getElementsByTagName(localName) {
    return function (doc) {
      return function () {
        return doc.getElementsByTagName(localName);
      };
    };
  }

  function _getElementsByTagNameNS(ns) {
    return function (localName) {
      return function (doc) {
        return function () {
          return doc.getElementsByTagNameNS(ns, localName);
        };
      };
    };
  }

  function getElementsByClassName(classNames) {
    return function (doc) {
      return function () {
        return doc.getElementsByClassName(classNames);
      };
    };
  }

  function setAttribute(name) {
    return function (value) {
      return function (element) {
        return function () {
          element.setAttribute(name, value);
        };
      };
    };
  }

  function _getAttribute(name) {
    return function (element) {
      return function () {
        return element.getAttribute(name);
      };
    };
  }

  function hasAttribute(name) {
    return function (element) {
      return function () {
        return element.hasAttribute(name);
      };
    };
  }

  function removeAttribute(name) {
    return function (element) {
      return function () {
        element.removeAttribute(name);
      };
    };
  }

  function matches(selector) {
    return function(element) {
      return function () {
        return element.matches(selector);
      };
    };
  }

  function _closest(selector) {
    return function(element) {
      return function () {
        return element.closest(selector);
      };
    };
  }

  // - CSSOM ---------------------------------------------------------------------

  function scrollTop(node) {
    return function () {
      return node.scrollTop;
    };
  }

  function setScrollTop(scrollTop) {
    return function (node) {
      return function () {
        node.scrollTop = scrollTop;
      };
    };
  }

  function scrollLeft(node) {
    return function () {
      return node.scrollLeft;
    };
  }

  function setScrollLeft(scrollLeft) {
    return function (node) {
      return function () {
        node.scrollLeft = scrollLeft;
      };
    };
  }

  function scrollWidth(el) {
    return function () {
      return el.scrollWidth;
    };
  }

  function scrollHeight(el) {
    return function () {
      return el.scrollHeight;
    };
  }

  function clientTop(el) {
    return function () {
      return el.clientTop;
    };
  }

  function clientLeft(el) {
    return function () {
      return el.clientLeft;
    };
  }

  function clientWidth(el) {
    return function () {
      return el.clientWidth;
    };
  }

  function clientHeight(el) {
    return function () {
      return el.clientHeight;
    };
  }

  function getBoundingClientRect(el) {
    return function () {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    };
  }

  function _attachShadow(props) {
    return function (el) {
      return function() {
        return el.attachShadow(props);
      };
    };
  }

  // Generated by purs version 0.15.15

  var getEffProp = function (name) {
    return function (node) {
      return function () {
        return node[name];
      };
    };
  };

  const children = getEffProp("children");
  const _firstElementChild = getEffProp("firstElementChild");
  const _lastElementChild = getEffProp("lastElementChild");
  const childElementCount = getEffProp("childElementCount");

  function _querySelector(selector) {
    return function (node) {
      return function () {
        return node.querySelector(selector);
      };
    };
  }

  function querySelectorAll(selector) {
    return function (node) {
      return function () {
        return node.querySelectorAll(selector);
      };
    };
  }

  // Generated by purs version 0.15.15
  var map$d = /* #__PURE__ */ map$o(functorEffect);
  var QuerySelector = function (x) {
      return x;
  };
  var querySelector = function (qs) {
      var $2 = map$d(toMaybe);
      var $3 = _querySelector(qs);
      return function ($4) {
          return $2($3($4));
      };
  };
  var ordQuerySelector = ordString;
  var newtypeQuerySelector = {
      Coercible0: function () {
          return undefined;
      }
  };
  var lastElementChild = /* #__PURE__ */ (function () {
      var $5 = map$d(toMaybe);
      return function ($6) {
          return $5(_lastElementChild($6));
      };
  })();
  var firstElementChild = /* #__PURE__ */ (function () {
      var $7 = map$d(toMaybe);
      return function ($8) {
          return $7(_firstElementChild($8));
      };
  })();
  var eqQuerySelector = eqString;

  function _mode(el) {
    return el.mode;
  }

  function host$1(el) {
    return function() {
      return el.host;
    };
  }

  // Generated by purs version 0.15.15
  var Open = /* #__PURE__ */ (function () {
      function Open() {

      };
      Open.value = new Open();
      return Open;
  })();
  var Closed = /* #__PURE__ */ (function () {
      function Closed() {

      };
      Closed.value = new Closed();
      return Closed;
  })();
  var toNode$10 = unsafeCoerce;
  var showShadowRootMode = {
      show: function (v) {
          if (v instanceof Open) {
              return "open";
          };
          if (v instanceof Closed) {
              return "closed";
          };
          throw new Error("Failed pattern match at Web.DOM.ShadowRoot (line 22, column 1 - line 24, column 25): " + [ v.constructor.name ]);
      }
  };
  var mode = /* #__PURE__ */ (function () {
      var modeFromString = function (v) {
          if (v === "open") {
              return new Just(Open.value);
          };
          if (v === "closed") {
              return new Just(Closed.value);
          };
          return Nothing.value;
      };
      return function ($5) {
          return modeFromString(_mode($5));
      };
  })();

  // Generated by purs version 0.15.15
  var show$1 = /* #__PURE__ */ show$4(showShadowRootMode);
  var map$c = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$$ = unsafeCoerce;
  var toNonDocumentTypeChildNode$_ = unsafeCoerce;
  var toNode$$ = unsafeCoerce;
  var toEventTarget$10 = unsafeCoerce;
  var toChildNode$_ = unsafeCoerce;
  var prefix = function ($3) {
      return toMaybe(_prefix($3));
  };
  var namespaceURI = function ($4) {
      return toMaybe(_namespaceURI($4));
  };
  var initToProps = function (init) {
      return {
          mode: show$1(init.mode),
          delegatesFocus: init.delegatesFocus
      };
  };
  var getElementsByTagNameNS = function ($5) {
      return _getElementsByTagNameNS(toNullable($5));
  };
  var getAttribute = function (attr) {
      var $6 = map$c(toMaybe);
      var $7 = _getAttribute(attr);
      return function ($8) {
          return $6($7($8));
      };
  };
  var fromParentNode$$ = /* #__PURE__ */ unsafeReadProtoTagged("Element");
  var fromNonDocumentTypeChildNode$_ = /* #__PURE__ */ unsafeReadProtoTagged("Element");
  var fromNode$$ = /* #__PURE__ */ unsafeReadProtoTagged("Element");
  var fromEventTarget$10 = /* #__PURE__ */ unsafeReadProtoTagged("Element");
  var fromChildNode$_ = /* #__PURE__ */ unsafeReadProtoTagged("Element");
  var closest = function (qs) {
      var $9 = map$c(toMaybe);
      var $10 = _closest(qs);
      return function ($11) {
          return $9($10($11));
      };
  };
  var attachShadow = function ($12) {
      return _attachShadow(initToProps($12));
  };

  function length$2(list) {
    return function () {
      return list.length;
    };
  }

  function toArray(list) {
    return function () {
      return [].slice.call(list);
    };
  }

  function _item(index) {
    return function (list) {
      return function () {
        return list.item(index);
      };
    };
  }

  // Generated by purs version 0.15.15
  var map$b = /* #__PURE__ */ map$o(functorEffect);
  var item = function (i) {
      var $2 = map$b(toMaybe);
      var $3 = _item(i);
      return function ($4) {
          return $2($3($4));
      };
  };

  function _getElementById(id) {
    return function (node) {
      return function () {
        return node.getElementById(id);
      };
    };
  }

  // Generated by purs version 0.15.15
  var map$a = /* #__PURE__ */ map$o(functorEffect);
  var getElementById = function (eid) {
      var $2 = map$a(toMaybe);
      var $3 = _getElementById(eid);
      return function ($4) {
          return $2($3($4));
      };
  };

  function eventListener(fn) {
    return function () {
      return function (event) {
        return fn(event)();
      };
    };
  }

  function addEventListenerWithOptions(type) {
    return function (listener) {
      return function (options) {
        return function (target) {
          return function () {
            return target.addEventListener(type, listener, options);
          };
        };
      };
    };
  }

  function addEventListener(type) {
    return function (listener) {
      return function (useCapture) {
        return function (target) {
          return function () {
            return target.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  function removeEventListener(type) {
    return function (listener) {
      return function (useCapture) {
        return function (target) {
          return function () {
            return target.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  function dispatchEvent(event) {
    return function (target) {
      return function () {
        return target.dispatchEvent(event);
      };
    };
  }

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15

  const windowImpl = function () {
    return window;
  };

  // Generated by purs version 0.15.15
  var PropName = function (x) {
      return x;
  };
  var ClassName = function (x) {
      return x;
  };
  var AttrName = function (x) {
      return x;
  };
  var ordPropName = ordString;
  var ordClassName = ordString;
  var ordAttrName = ordString;
  var newtypePropName = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeClassName = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeAttrName = {
      Coercible0: function () {
          return undefined;
      }
  };
  var eqPropName = eqString;
  var eqClassName = eqString;
  var eqAttrName = eqString;

  function target$3(a) {
    return function () {
      return a.target;
    };
  }

  function setTarget$3(target) {
    return function (a) {
      return function () {
        a.target = target;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function download$1(a) {
    return function () {
      return a.download;
    };
  }

  function setDownload$1(download) {
    return function (a) {
      return function () {
        a.download = download;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rel$2(a) {
    return function () {
      return a.rel;
    };
  }

  function setRel$2(rel) {
    return function (a) {
      return function () {
        a.rel = rel;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rev$1(a) {
    return function () {
      return a.rev;
    };
  }

  function setRev$1(rev) {
    return function (a) {
      return function () {
        a.rev = rev;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function relList$2(a) {
    return function () {
      return a.relList;
    };
  }

  // ----------------------------------------------------------------------------

  function hreflang$2(a) {
    return function () {
      return a.hreflang;
    };
  }

  function setHreflang$2(hreflang) {
    return function (a) {
      return function () {
        a.hreflang = hreflang;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$f(a) {
    return function () {
      return a.type;
    };
  }

  function setType$b(type) {
    return function (a) {
      return function () {
        a.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function text$3(a) {
    return function () {
      return a.text;
    };
  }

  function setText$3(text) {
    return function (a) {
      return function () {
        a.text = text;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$_ = unsafeCoerce;
  var toNonDocumentTypeChildNode$Z = unsafeCoerce;
  var toNode$_ = unsafeCoerce;
  var toHTMLHyperlinkElementUtils = unsafeCoerce;
  var toHTMLElement$Y = unsafeCoerce;
  var toEventTarget$$ = unsafeCoerce;
  var toElement$Z = unsafeCoerce;
  var toChildNode$Z = unsafeCoerce;
  var fromParentNode$_ = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");
  var fromNonDocumentTypeChildNode$Z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");
  var fromNode$_ = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");
  var fromHTMLElement$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");
  var fromEventTarget$$ = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");
  var fromElement$Z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");
  var fromChildNode$Z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAnchorElement");

  function alt$2(area) {
    return function () {
      return area.alt;
    };
  }

  function setAlt$2(alt) {
    return function (area) {
      return function () {
        area.alt = alt;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function coords(area) {
    return function () {
      return area.coords;
    };
  }

  function setCoords(coords) {
    return function (area) {
      return function () {
        area.coords = coords;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function shape(area) {
    return function () {
      return area.shape;
    };
  }

  function setShape(shape) {
    return function (area) {
      return function () {
        area.shape = shape;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function target$2(area) {
    return function () {
      return area.target;
    };
  }

  function setTarget$2(target) {
    return function (area) {
      return function () {
        area.target = target;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function download(area) {
    return function () {
      return area.download;
    };
  }

  function setDownload(download) {
    return function (area) {
      return function () {
        area.download = download;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rel$1(area) {
    return function () {
      return area.rel;
    };
  }

  function setRel$1(rel) {
    return function (area) {
      return function () {
        area.rel = rel;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function relList$1(area) {
    return function () {
      return area.relList;
    };
  }

  // ----------------------------------------------------------------------------

  function hreflang$1(area) {
    return function () {
      return area.hreflang;
    };
  }

  function setHreflang$1(hreflang) {
    return function (area) {
      return function () {
        area.hreflang = hreflang;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$e(area) {
    return function () {
      return area.type;
    };
  }

  function setType$a(type) {
    return function (area) {
      return function () {
        area.type = type;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$Z = unsafeCoerce;
  var toNonDocumentTypeChildNode$Y = unsafeCoerce;
  var toNode$Z = unsafeCoerce;
  var toHTMLElement$X = unsafeCoerce;
  var toEventTarget$_ = unsafeCoerce;
  var toElement$Y = unsafeCoerce;
  var toChildNode$Y = unsafeCoerce;
  var fromParentNode$Z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");
  var fromNonDocumentTypeChildNode$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");
  var fromNode$Z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");
  var fromHTMLElement$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");
  var fromEventTarget$_ = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");
  var fromElement$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");
  var fromChildNode$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAreaElement");

  function create$1() {
    return new Audio();
  }

  function createWithURL(url) {
    return function () {
      return new Audio(url);
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$Y = unsafeCoerce;
  var toNonDocumentTypeChildNode$X = unsafeCoerce;
  var toNode$Y = unsafeCoerce;
  var toHTMLMediaElement$1 = unsafeCoerce;
  var toHTMLElement$W = unsafeCoerce;
  var toEventTarget$Z = unsafeCoerce;
  var toElement$X = unsafeCoerce;
  var toChildNode$X = unsafeCoerce;
  var fromParentNode$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromNonDocumentTypeChildNode$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromNode$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromHTMLMediaElement$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromHTMLElement$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromEventTarget$Z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromElement$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var fromChildNode$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLAudioElement");
  var create$prime$1 = createWithURL;

  // Generated by purs version 0.15.15
  var toParentNode$X = unsafeCoerce;
  var toNonDocumentTypeChildNode$W = unsafeCoerce;
  var toNode$X = unsafeCoerce;
  var toHTMLElement$V = unsafeCoerce;
  var toEventTarget$Y = unsafeCoerce;
  var toElement$W = unsafeCoerce;
  var toChildNode$W = unsafeCoerce;
  var fromParentNode$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");
  var fromNonDocumentTypeChildNode$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");
  var fromNode$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");
  var fromHTMLElement$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");
  var fromEventTarget$Y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");
  var fromElement$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");
  var fromChildNode$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBRElement");

  function href$2(base) {
    return function () {
      return base.href;
    };
  }

  function setHref$2(href) {
    return function (base) {
      return function () {
        base.href = href;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function target$1(base) {
    return function () {
      return base.target;
    };
  }

  function setTarget$1(target) {
    return function (base) {
      return function () {
        base.target = target;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$W = unsafeCoerce;
  var toNonDocumentTypeChildNode$V = unsafeCoerce;
  var toNode$W = unsafeCoerce;
  var toHTMLElement$U = unsafeCoerce;
  var toEventTarget$X = unsafeCoerce;
  var toElement$V = unsafeCoerce;
  var toChildNode$V = unsafeCoerce;
  var fromParentNode$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");
  var fromNonDocumentTypeChildNode$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");
  var fromNode$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");
  var fromHTMLElement$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");
  var fromEventTarget$X = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");
  var fromElement$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");
  var fromChildNode$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBaseElement");

  // Generated by purs version 0.15.15
  var toParentNode$V = unsafeCoerce;
  var toNonDocumentTypeChildNode$U = unsafeCoerce;
  var toNode$V = unsafeCoerce;
  var toHTMLElement$T = unsafeCoerce;
  var toEventTarget$W = unsafeCoerce;
  var toElement$U = unsafeCoerce;
  var toChildNode$U = unsafeCoerce;
  var fromParentNode$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");
  var fromNonDocumentTypeChildNode$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");
  var fromNode$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");
  var fromHTMLElement$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");
  var fromEventTarget$W = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");
  var fromElement$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");
  var fromChildNode$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLBodyElement");

  function autofocus$4(button) {
    return function () {
      return button.autofocus;
    };
  }

  function setAutofocus$4(autofocus) {
    return function (button) {
      return function () {
        button.autofocus = autofocus;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function disabled$8(button) {
    return function () {
      return button.disabled;
    };
  }

  function setDisabled$8(disabled) {
    return function (button) {
      return function () {
        button.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$a(button) {
    return function () {
      return button.form;
    };
  }

  // ----------------------------------------------------------------------------

  function formAction$1(button) {
    return function () {
      return button.formAction;
    };
  }

  function setFormAction$1(formAction) {
    return function (button) {
      return function () {
        button.formAction = formAction;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formEnctype$1(button) {
    return function () {
      return button.formEnctype;
    };
  }

  function setFormEnctype$1(formEnctype) {
    return function (button) {
      return function () {
        button.formEnctype = formEnctype;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formMethod$1(button) {
    return function () {
      return button.formMethod;
    };
  }

  function setFormMethod$1(formMethod) {
    return function (button) {
      return function () {
        button.formMethod = formMethod;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formNoValidate$1(button) {
    return function () {
      return button.formNoValidate;
    };
  }

  function setFormNoValidate$1(formNoValidate) {
    return function (button) {
      return function () {
        button.formNoValidate = formNoValidate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formTarget$1(button) {
    return function () {
      return button.formTarget;
    };
  }

  function setFormTarget$1(formTarget) {
    return function (button) {
      return function () {
        button.formTarget = formTarget;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function name$c(button) {
    return function () {
      return button.name;
    };
  }

  function setName$c(name) {
    return function (button) {
      return function () {
        button.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$d(button) {
    return function () {
      return button.type;
    };
  }

  function setType$9(type) {
    return function (button) {
      return function () {
        button.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value$a(button) {
    return function () {
      return button.value;
    };
  }

  function setValue$a(value) {
    return function (button) {
      return function () {
        button.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$7(button) {
    return function () {
      return button.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$7(button) {
    return function () {
      return button.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$7(button) {
    return function () {
      return button.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$8(button) {
    return function () {
      return button.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$8(button) {
    return function () {
      return button.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$7(value) {
    return function (button) {
      return function () {
        button.setCustomValidity(value);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels$7(button) {
    return function () {
      return button.labels;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$U = unsafeCoerce;
  var toNonDocumentTypeChildNode$T = unsafeCoerce;
  var toNode$U = unsafeCoerce;
  var toHTMLElement$S = unsafeCoerce;
  var toEventTarget$V = unsafeCoerce;
  var toElement$T = unsafeCoerce;
  var toChildNode$T = unsafeCoerce;
  var fromParentNode$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var fromNonDocumentTypeChildNode$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var fromNode$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var fromHTMLElement$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var fromEventTarget$V = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var fromElement$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var fromChildNode$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLButtonElement");
  var form$a = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$a($3));
      };
  })();

  function width$6(canvas) {
    return function () {
      return canvas.width;
    };
  }

  function setWidth$6(width) {
    return function (canvas) {
      return function () {
        canvas.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height$6(canvas) {
    return function () {
      return canvas.height;
    };
  }

  function setHeight$6(height) {
    return function (canvas) {
      return function () {
        canvas.height = height;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$T = unsafeCoerce;
  var toNonDocumentTypeChildNode$S = unsafeCoerce;
  var toNode$T = unsafeCoerce;
  var toHTMLElement$R = unsafeCoerce;
  var toEventTarget$U = unsafeCoerce;
  var toElement$S = unsafeCoerce;
  var toChildNode$S = unsafeCoerce;
  var fromParentNode$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");
  var fromNonDocumentTypeChildNode$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");
  var fromNode$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");
  var fromHTMLElement$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");
  var fromEventTarget$U = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");
  var fromElement$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");
  var fromChildNode$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");

  // Generated by purs version 0.15.15
  var toParentNode$S = unsafeCoerce;
  var toNonDocumentTypeChildNode$R = unsafeCoerce;
  var toNode$S = unsafeCoerce;
  var toHTMLElement$Q = unsafeCoerce;
  var toEventTarget$T = unsafeCoerce;
  var toElement$R = unsafeCoerce;
  var toChildNode$R = unsafeCoerce;
  var fromParentNode$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");
  var fromNonDocumentTypeChildNode$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");
  var fromNode$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");
  var fromHTMLElement$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");
  var fromEventTarget$T = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");
  var fromElement$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");
  var fromChildNode$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDListElement");

  function value$9(data) {
    return function () {
      return data.value;
    };
  }

  function setValue$9(value) {
    return function (data) {
      return function () {
        data.value = value;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$R = unsafeCoerce;
  var toNonDocumentTypeChildNode$Q = unsafeCoerce;
  var toNode$R = unsafeCoerce;
  var toHTMLElement$P = unsafeCoerce;
  var toEventTarget$S = unsafeCoerce;
  var toElement$Q = unsafeCoerce;
  var toChildNode$Q = unsafeCoerce;
  var fromParentNode$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");
  var fromNonDocumentTypeChildNode$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");
  var fromNode$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");
  var fromHTMLElement$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");
  var fromEventTarget$S = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");
  var fromElement$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");
  var fromChildNode$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataElement");

  function options(dle) {
    return function () {
      return dle.options;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$Q = unsafeCoerce;
  var toNonDocumentTypeChildNode$P = unsafeCoerce;
  var toNode$Q = unsafeCoerce;
  var toHTMLElement$O = unsafeCoerce;
  var toEventTarget$R = unsafeCoerce;
  var toElement$P = unsafeCoerce;
  var toChildNode$P = unsafeCoerce;
  var fromParentNode$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");
  var fromNonDocumentTypeChildNode$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");
  var fromNode$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");
  var fromHTMLElement$O = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");
  var fromEventTarget$R = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");
  var fromElement$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");
  var fromChildNode$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDataListElement");

  // Generated by purs version 0.15.15
  var toParentNode$P = unsafeCoerce;
  var toNonDocumentTypeChildNode$O = unsafeCoerce;
  var toNode$P = unsafeCoerce;
  var toHTMLElement$N = unsafeCoerce;
  var toEventTarget$Q = unsafeCoerce;
  var toElement$O = unsafeCoerce;
  var toChildNode$O = unsafeCoerce;
  var fromParentNode$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");
  var fromNonDocumentTypeChildNode$O = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");
  var fromNode$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");
  var fromHTMLElement$N = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");
  var fromEventTarget$Q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");
  var fromElement$O = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");
  var fromChildNode$O = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDivElement");

  function _documentElement(doc) {
    return doc.documentElement;
  }

  function _head(doc) {
    return doc.head;
  }

  function _body(doc) {
    return doc.body;
  }

  function _readyState$2(doc) {
    return doc.readyState;
  }

  function _visibilityState(doc) {
    return doc.readyState;
  }

  function _activeElement(doc) {
    return doc.activeElement;
  }

  function _currentScript(doc) {
    return doc.currentScript;
  }

  function _referrer(doc) {
    return doc.referrer;
  }

  function _title(doc) {
    return doc.title;
  }

  function _setTitle(title, doc) {
    doc.title = title;
  }

  // Generated by purs version 0.15.15
  var Loading$2 = /* #__PURE__ */ (function () {
      function Loading() {

      };
      Loading.value = new Loading();
      return Loading;
  })();
  var Interactive = /* #__PURE__ */ (function () {
      function Interactive() {

      };
      Interactive.value = new Interactive();
      return Interactive;
  })();
  var Complete = /* #__PURE__ */ (function () {
      function Complete() {

      };
      Complete.value = new Complete();
      return Complete;
  })();
  var showReadyState$2 = {
      show: function (v) {
          if (v instanceof Loading$2) {
              return "Loading";
          };
          if (v instanceof Interactive) {
              return "Interactive";
          };
          if (v instanceof Complete) {
              return "Complete";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLDocument.ReadyState (line 16, column 10 - line 19, column 27): " + [ v.constructor.name ]);
      }
  };
  var print$7 = function (v) {
      if (v instanceof Loading$2) {
          return "loading";
      };
      if (v instanceof Interactive) {
          return "interactive";
      };
      if (v instanceof Complete) {
          return "complete";
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLDocument.ReadyState (line 22, column 9 - line 25, column 25): " + [ v.constructor.name ]);
  };
  var parse$6 = function (v) {
      if (v === "loading") {
          return new Just(Loading$2.value);
      };
      if (v === "interactive") {
          return new Just(Interactive.value);
      };
      if (v === "complete") {
          return new Just(Complete.value);
      };
      return Nothing.value;
  };
  var eqReadyState$2 = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Loading$2 && y instanceof Loading$2) {
                  return true;
              };
              if (x instanceof Interactive && y instanceof Interactive) {
                  return true;
              };
              if (x instanceof Complete && y instanceof Complete) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordReadyState$2 = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Loading$2 && y instanceof Loading$2) {
                  return EQ.value;
              };
              if (x instanceof Loading$2) {
                  return LT.value;
              };
              if (y instanceof Loading$2) {
                  return GT.value;
              };
              if (x instanceof Interactive && y instanceof Interactive) {
                  return EQ.value;
              };
              if (x instanceof Interactive) {
                  return LT.value;
              };
              if (y instanceof Interactive) {
                  return GT.value;
              };
              if (x instanceof Complete && y instanceof Complete) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLDocument.ReadyState (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqReadyState$2;
      }
  };

  // Generated by purs version 0.15.15
  var Visible = /* #__PURE__ */ (function () {
      function Visible() {

      };
      Visible.value = new Visible();
      return Visible;
  })();
  var Hidden = /* #__PURE__ */ (function () {
      function Hidden() {

      };
      Hidden.value = new Hidden();
      return Hidden;
  })();
  var showVisibilityState = {
      show: function (v) {
          if (v instanceof Visible) {
              return "Visible";
          };
          if (v instanceof Hidden) {
              return "Hidden";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLDocument.VisibilityState (line 15, column 10 - line 17, column 23): " + [ v.constructor.name ]);
      }
  };
  var print$6 = function (v) {
      if (v instanceof Visible) {
          return "visible";
      };
      if (v instanceof Hidden) {
          return "hidden";
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLDocument.VisibilityState (line 20, column 9 - line 22, column 21): " + [ v.constructor.name ]);
  };
  var parse$5 = function (v) {
      if (v === "visible") {
          return new Just(Visible.value);
      };
      if (v === "hidden") {
          return new Just(Hidden.value);
      };
      return Nothing.value;
  };
  var eqVisibilityState = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Visible && y instanceof Visible) {
                  return true;
              };
              if (x instanceof Hidden && y instanceof Hidden) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordVisibilityState = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Visible && y instanceof Visible) {
                  return EQ.value;
              };
              if (x instanceof Visible) {
                  return LT.value;
              };
              if (y instanceof Visible) {
                  return GT.value;
              };
              if (x instanceof Hidden && y instanceof Hidden) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLDocument.VisibilityState (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqVisibilityState;
      }
  };

  // Generated by purs version 0.15.15
  var map$9 = /* #__PURE__ */ map$o(functorEffect);
  var visibilityState = function (doc) {
      return map$9((function () {
          var $2 = fromMaybe$1(Visible.value);
          return function ($3) {
              return $2(parse$5($3));
          };
      })())(function () {
          return _visibilityState(doc);
      });
  };
  var toParentNode$O = unsafeCoerce;
  var toNonElementParentNode = unsafeCoerce;
  var toNode$O = unsafeCoerce;
  var toEventTarget$P = unsafeCoerce;
  var toDocument = unsafeCoerce;
  var title$1 = function (doc) {
      return function () {
          return _title(doc);
      };
  };
  var setTitle$1 = function (newTitle) {
      return function (doc) {
          return function () {
              return _setTitle(newTitle, doc);
          };
      };
  };
  var referrer = function (doc) {
      return function () {
          return _referrer(doc);
      };
  };
  var readyState$2 = function (doc) {
      return map$9((function () {
          var $4 = fromMaybe$1(Loading$2.value);
          return function ($5) {
              return $4(parse$6($5));
          };
      })())(function () {
          return _readyState$2(doc);
      });
  };
  var head = function (doc) {
      return map$9(toMaybe)(function () {
          return _head(doc);
      });
  };
  var fromParentNode$O = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDocument");
  var fromNonElementParentNode = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDocument");
  var fromNode$O = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDocument");
  var fromEventTarget$P = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDocument");
  var fromDocument = /* #__PURE__ */ unsafeReadProtoTagged("HTMLDocument");
  var documentElement = function (doc) {
      return map$9(toMaybe)(function () {
          return _documentElement(doc);
      });
  };
  var currentScript = function (doc) {
      return map$9(toMaybe)(function () {
          return _currentScript(doc);
      });
  };
  var body = function (doc) {
      return map$9(toMaybe)(function () {
          return _body(doc);
      });
  };
  var activeElement = function (doc) {
      return map$9(toMaybe)(function () {
          return _activeElement(doc);
      });
  };

  function _read(nothing, just, value) {
    var tag = Object.prototype.toString.call(value);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value);
    } else {
      return nothing;
    }
  }

  // ----------------------------------------------------------------------------

  function title(elt) {
    return function () {
      return elt.title;
    };
  }

  function setTitle(title) {
    return function (elt) {
      return function () {
        elt.title = title;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function lang(elt) {
    return function () {
      return elt.lang;
    };
  }

  function setLang(lang) {
    return function (elt) {
      return function () {
        elt.lang = lang;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function dir(elt) {
    return function () {
      return elt.dir;
    };
  }

  function setDir(dir) {
    return function (elt) {
      return function () {
        elt.dir = dir;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function hidden(elt) {
    return function () {
      return elt.hidden;
    };
  }

  function setHidden(hidden) {
    return function (elt) {
      return function () {
        elt.hidden = hidden;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function tabIndex(elt) {
    return function () {
      return elt.tabIndex;
    };
  }

  function setTabIndex(tabIndex) {
    return function (elt) {
      return function () {
        elt.tabIndex = tabIndex;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function draggable(elt) {
    return function () {
      return elt.draggable;
    };
  }

  function setDraggable(draggable) {
    return function (elt) {
      return function () {
        elt.draggable = draggable;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function contentEditable(elt) {
    return function () {
      return elt.contentEditable;
    };
  }

  function setContentEditable(contentEditable) {
    return function (elt) {
      return function () {
        elt.contentEditable = contentEditable;
      };
    };
  }

  function isContentEditable(elt) {
    return function () {
      return elt.isContentEditable;
    };
  }

  // ----------------------------------------------------------------------------

  function spellcheck(elt) {
    return function () {
      return elt.spellcheck;
    };
  }

  function setSpellcheck(spellcheck) {
    return function (elt) {
      return function () {
        elt.spellcheck = spellcheck;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function click(elt) {
    return function () {
      return elt.click();
    };
  }

  function focus(elt) {
    return function () {
      return elt.focus();
    };
  }

  function blur(elt) {
    return function () {
      return elt.blur();
    };
  }

  // - CSSOM ---------------------------------------------------------------------

  function _offsetParent(el) {
    return function () {
      return el.offsetParent;
    };
  }

  function offsetTop(el) {
    return function () {
      return el.offsetTop;
    };
  }

  function offsetLeft(el) {
    return function () {
      return el.offsetLeft;
    };
  }

  function offsetWidth(el) {
    return function () {
      return el.offsetWidth;
    };
  }

  function offsetHeight(el) {
    return function () {
      return el.offsetHeight;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$N = unsafeCoerce;
  var toNonDocumentTypeChildNode$N = unsafeCoerce;
  var toNode$N = unsafeCoerce;
  var toEventTarget$O = unsafeCoerce;
  var toElement$N = unsafeCoerce;
  var toChildNode$N = unsafeCoerce;
  var offsetParent = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_offsetParent($3));
      };
  })();
  var fromParentNode$N = function (x) {
      return _read(Nothing.value, Just.create, x);
  };
  var fromNonDocumentTypeChildNode$N = function (x) {
      return _read(Nothing.value, Just.create, x);
  };
  var fromNode$N = function (x) {
      return _read(Nothing.value, Just.create, x);
  };
  var fromEventTarget$O = function (x) {
      return _read(Nothing.value, Just.create, x);
  };
  var fromElement$N = function (x) {
      return _read(Nothing.value, Just.create, x);
  };
  var fromChildNode$N = function (x) {
      return _read(Nothing.value, Just.create, x);
  };

  function src$7(embed) {
    return function () {
      return embed.src;
    };
  }

  function setSrc$7(src) {
    return function (embed) {
      return function () {
        embed.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$c(embed) {
    return function () {
      return embed.type;
    };
  }

  function setType$8(type) {
    return function (embed) {
      return function () {
        embed.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function width$5(embed) {
    return function () {
      return embed.width;
    };
  }

  function setWidth$5(width) {
    return function (embed) {
      return function () {
        embed.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height$5(embed) {
    return function () {
      return embed.height;
    };
  }

  function setHeight$5(height) {
    return function (embed) {
      return function () {
        embed.height = height;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$M = unsafeCoerce;
  var toNonDocumentTypeChildNode$M = unsafeCoerce;
  var toNode$M = unsafeCoerce;
  var toHTMLElement$M = unsafeCoerce;
  var toEventTarget$N = unsafeCoerce;
  var toElement$M = unsafeCoerce;
  var toChildNode$M = unsafeCoerce;
  var fromParentNode$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");
  var fromNonDocumentTypeChildNode$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");
  var fromNode$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");
  var fromHTMLElement$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");
  var fromEventTarget$N = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");
  var fromElement$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");
  var fromChildNode$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLEmbedElement");

  function disabled$7(fieldset) {
    return function () {
      return fieldset.disabled;
    };
  }

  function setDisabled$7(disabled) {
    return function (fieldset) {
      return function () {
        fieldset.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$9(fieldset) {
    return function () {
      return fieldset.form;
    };
  }

  // ----------------------------------------------------------------------------

  function name$b(fieldset) {
    return function () {
      return fieldset.name;
    };
  }

  function setName$b(name) {
    return function (fieldset) {
      return function () {
        fieldset.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$b(fieldset) {
    return function () {
      return fieldset.type;
    };
  }

  function setType$7(type) {
    return function (fieldset) {
      return function () {
        fieldset.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$6(fieldset) {
    return function () {
      return fieldset.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$6(fieldset) {
    return function () {
      return fieldset.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$6(fieldset) {
    return function () {
      return fieldset.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$7(fieldset) {
    return function () {
      return fieldset.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$7(fieldset) {
    return function () {
      return fieldset.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$6(value) {
    return function (fieldset) {
      return function () {
        fieldset.setCustomValidity(value);
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$L = unsafeCoerce;
  var toNonDocumentTypeChildNode$L = unsafeCoerce;
  var toNode$L = unsafeCoerce;
  var toHTMLElement$L = unsafeCoerce;
  var toEventTarget$M = unsafeCoerce;
  var toElement$L = unsafeCoerce;
  var toChildNode$L = unsafeCoerce;
  var fromParentNode$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var fromNonDocumentTypeChildNode$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var fromNode$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var fromHTMLElement$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var fromEventTarget$M = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var fromElement$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var fromChildNode$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFieldSetElement");
  var form$9 = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$9($3));
      };
  })();

  function acceptCharset(form) {
    return function () {
      return form.acceptCharset;
    };
  }

  function setAcceptCharset(acceptCharset) {
    return function (form) {
      return function () {
        form.acceptCharset = acceptCharset;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function action(form) {
    return function () {
      return form.action;
    };
  }

  function setAction(action) {
    return function (form) {
      return function () {
        form.action = action;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function autocomplete$2(form) {
    return function () {
      return form.autocomplete;
    };
  }

  function setAutocomplete$2(autocomplete) {
    return function (form) {
      return function () {
        form.autocomplete = autocomplete;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function enctype(form) {
    return function () {
      return form.enctype;
    };
  }

  function setEnctype(enctype) {
    return function (form) {
      return function () {
        form.enctype = enctype;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function encoding(form) {
    return function () {
      return form.encoding;
    };
  }

  function setEncoding(encoding) {
    return function (form) {
      return function () {
        form.encoding = encoding;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function method(form) {
    return function () {
      return form.method;
    };
  }

  function setMethod(method) {
    return function (form) {
      return function () {
        form.method = method;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function name$a(form) {
    return function () {
      return form.name;
    };
  }

  function setName$a(name) {
    return function (form) {
      return function () {
        form.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function noValidate(form) {
    return function () {
      return form.noValidate;
    };
  }

  function setNoValidate(noValidate) {
    return function (form) {
      return function () {
        form.noValidate = noValidate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function target(form) {
    return function () {
      return form.target;
    };
  }

  function setTarget(target) {
    return function (form) {
      return function () {
        form.target = target;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function length$1(form) {
    return function () {
      return form.length;
    };
  }

  // ----------------------------------------------------------------------------

  function submit(form) {
    return function () {
      form.submit();
    };
  }

  // ----------------------------------------------------------------------------

  function reset(form) {
    return function () {
      form.reset();
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$6(form) {
    return function () {
      return form.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$6(form) {
    return function () {
      return form.reportValidity();
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$K = unsafeCoerce;
  var toNonDocumentTypeChildNode$K = unsafeCoerce;
  var toNode$K = unsafeCoerce;
  var toHTMLElement$K = unsafeCoerce;
  var toEventTarget$L = unsafeCoerce;
  var toElement$K = unsafeCoerce;
  var toChildNode$K = unsafeCoerce;
  var fromParentNode$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");
  var fromNonDocumentTypeChildNode$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");
  var fromNode$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");
  var fromHTMLElement$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");
  var fromEventTarget$L = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");
  var fromElement$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");
  var fromChildNode$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLFormElement");

  // Generated by purs version 0.15.15
  var toParentNode$J = unsafeCoerce;
  var toNonDocumentTypeChildNode$J = unsafeCoerce;
  var toNode$J = unsafeCoerce;
  var toHTMLElement$J = unsafeCoerce;
  var toEventTarget$K = unsafeCoerce;
  var toElement$J = unsafeCoerce;
  var toChildNode$J = unsafeCoerce;
  var fromParentNode$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");
  var fromNonDocumentTypeChildNode$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");
  var fromNode$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");
  var fromHTMLElement$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");
  var fromEventTarget$K = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");
  var fromElement$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");
  var fromChildNode$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHRElement");

  // Generated by purs version 0.15.15
  var toParentNode$I = unsafeCoerce;
  var toNonDocumentTypeChildNode$I = unsafeCoerce;
  var toNode$I = unsafeCoerce;
  var toHTMLElement$I = unsafeCoerce;
  var toEventTarget$J = unsafeCoerce;
  var toElement$I = unsafeCoerce;
  var toChildNode$I = unsafeCoerce;
  var fromParentNode$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");
  var fromNonDocumentTypeChildNode$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");
  var fromNode$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");
  var fromHTMLElement$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");
  var fromEventTarget$J = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");
  var fromElement$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");
  var fromChildNode$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadElement");

  // Generated by purs version 0.15.15
  var toParentNode$H = unsafeCoerce;
  var toNonDocumentTypeChildNode$H = unsafeCoerce;
  var toNode$H = unsafeCoerce;
  var toHTMLElement$H = unsafeCoerce;
  var toEventTarget$I = unsafeCoerce;
  var toElement$H = unsafeCoerce;
  var toChildNode$H = unsafeCoerce;
  var fromParentNode$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");
  var fromNonDocumentTypeChildNode$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");
  var fromNode$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");
  var fromHTMLElement$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");
  var fromEventTarget$I = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");
  var fromElement$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");
  var fromChildNode$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLHeadingElement");

  function src$6(iframe) {
    return function () {
      return iframe.src;
    };
  }

  function setSrc$6(src) {
    return function (iframe) {
      return function () {
        iframe.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function srcdoc(iframe) {
    return function () {
      return iframe.srcdoc;
    };
  }

  function setSrcdoc(srcdoc) {
    return function (iframe) {
      return function () {
        iframe.srcdoc = srcdoc;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function name$9(iframe) {
    return function () {
      return iframe.name;
    };
  }

  function setName$9(name) {
    return function (iframe) {
      return function () {
        iframe.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function width$4(iframe) {
    return function () {
      return iframe.width;
    };
  }

  function setWidth$4(width) {
    return function (iframe) {
      return function () {
        iframe.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height$4(iframe) {
    return function () {
      return iframe.height;
    };
  }

  function setHeight$4(height) {
    return function (iframe) {
      return function () {
        iframe.height = height;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _contentDocument$1(iframe) {
    return function () {
      return iframe.contentDocument;
    };
  }

  function _contentWindow(iframe) {
    return function () {
      return iframe.contentWindow;
    };
  }

  // Generated by purs version 0.15.15
  var map$8 = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$G = unsafeCoerce;
  var toNonDocumentTypeChildNode$G = unsafeCoerce;
  var toNode$G = unsafeCoerce;
  var toHTMLElement$G = unsafeCoerce;
  var toEventTarget$H = unsafeCoerce;
  var toElement$G = unsafeCoerce;
  var toChildNode$G = unsafeCoerce;
  var fromParentNode$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var fromNonDocumentTypeChildNode$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var fromNode$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var fromHTMLElement$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var fromEventTarget$H = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var fromElement$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var fromChildNode$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLIFrameElement");
  var contentWindow = /* #__PURE__ */ (function () {
      var $2 = map$8(toMaybe);
      return function ($3) {
          return $2(_contentWindow($3));
      };
  })();
  var contentDocument$1 = /* #__PURE__ */ (function () {
      var $4 = map$8(toMaybe);
      return function ($5) {
          return $4(_contentDocument$1($5));
      };
  })();

  function create() {
    return new Image();
  }

  function createWithDimensions(width) {
    return function (height) {
      return function () {
        return new Image(width, height);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function alt$1(image) {
    return function () {
      return image.alt;
    };
  }

  function setAlt$1(alt) {
    return function (image) {
      return function () {
        image.alt = alt;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function src$5(image) {
    return function () {
      return image.src;
    };
  }

  function setSrc$5(src) {
    return function (image) {
      return function () {
        image.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function srcset(image) {
    return function () {
      return image.srcset;
    };
  }

  function setSrcset(srcset) {
    return function (image) {
      return function () {
        image.srcset = srcset;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function sizes(image) {
    return function () {
      return image.sizes;
    };
  }

  function setSizes(sizes) {
    return function (image) {
      return function () {
        image.sizes = sizes;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function currentSrc$1(image) {
    return function () {
      return image.currentSrc;
    };
  }

  // ----------------------------------------------------------------------------

  function _crossOrigin(image) {
    return image.crossOrigin;
  }

  function _setCrossOrigin(crossOrigin, image) {
    image.crossOrigin = crossOrigin;
  }

  // ----------------------------------------------------------------------------

  function useMap$1(image) {
    return function () {
      return image.useMap;
    };
  }

  function setUseMap$1(useMap) {
    return function (image) {
      return function () {
        image.useMap = useMap;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function isMap(image) {
    return function () {
      return image.isMap;
    };
  }

  function setIsMap(isMap) {
    return function (image) {
      return function () {
        image.isMap = isMap;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function width$3(image) {
    return function () {
      return image.width;
    };
  }

  function setWidth$3(width) {
    return function (image) {
      return function () {
        image.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height$3(image) {
    return function () {
      return image.height;
    };
  }

  function setHeight$3(height) {
    return function (image) {
      return function () {
        image.height = height;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function naturalWidth(image) {
    return function () {
      return image.naturalWidth;
    };
  }

  function naturalHeight(image) {
    return function () {
      return image.naturalHeight;
    };
  }

  // ----------------------------------------------------------------------------

  function referrerPolicy(image) {
    return function () {
      return image.referrerPolicy;
    };
  }

  function setReferrerPolicy(referrerPolicy) {
    return function (image) {
      return function () {
        image.referrerPolicy = referrerPolicy;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _decoding(image) {
    return image.decoding;
  }

  function _setDecoding(decoding, image) {
    image.decoding = decoding;
  }

  // ----------------------------------------------------------------------------

  function _loading(image) {
    return image.loading;
  }

  function _setLoading(loading, image) {
    image.loading = loading;
  }

  // ----------------------------------------------------------------------------

  function complete(image) {
    return function () {
      return image.complete;
    };
  }

  const mkEffectFn1 = function mkEffectFn1(fn) {
    return function(x) {
      return fn(x)();
    };
  };

  const mkEffectFn2 = function mkEffectFn2(fn) {
    return function(a, b) {
      return fn(a)(b)();
    };
  };

  const mkEffectFn3 = function mkEffectFn3(fn) {
    return function(a, b, c) {
      return fn(a)(b)(c)();
    };
  };

  const mkEffectFn4 = function mkEffectFn4(fn) {
    return function(a, b, c, d) {
      return fn(a)(b)(c)(d)();
    };
  };

  const mkEffectFn5 = function mkEffectFn5(fn) {
    return function(a, b, c, d, e) {
      return fn(a)(b)(c)(d)(e)();
    };
  };

  const mkEffectFn6 = function mkEffectFn6(fn) {
    return function(a, b, c, d, e, f) {
      return fn(a)(b)(c)(d)(e)(f)();
    };
  };

  const mkEffectFn7 = function mkEffectFn7(fn) {
    return function(a, b, c, d, e, f, g) {
      return fn(a)(b)(c)(d)(e)(f)(g)();
    };
  };

  const mkEffectFn8 = function mkEffectFn8(fn) {
    return function(a, b, c, d, e, f, g, h) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)();
    };
  };

  const mkEffectFn9 = function mkEffectFn9(fn) {
    return function(a, b, c, d, e, f, g, h, i) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)();
    };
  };

  const mkEffectFn10 = function mkEffectFn10(fn) {
    return function(a, b, c, d, e, f, g, h, i, j) {
      return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)();
    };
  };

  const runEffectFn1 = function runEffectFn1(fn) {
    return function(a) {
      return function() {
        return fn(a);
      };
    };
  };

  const runEffectFn2 = function runEffectFn2(fn) {
    return function(a) {
      return function(b) {
        return function() {
          return fn(a, b);
        };
      };
    };
  };

  const runEffectFn3 = function runEffectFn3(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function() {
            return fn(a, b, c);
          };
        };
      };
    };
  };

  const runEffectFn4 = function runEffectFn4(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function() {
              return fn(a, b, c, d);
            };
          };
        };
      };
    };
  };

  const runEffectFn5 = function runEffectFn5(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function() {
                return fn(a, b, c, d, e);
              };
            };
          };
        };
      };
    };
  };

  const runEffectFn6 = function runEffectFn6(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function() {
                  return fn(a, b, c, d, e, f);
                };
              };
            };
          };
        };
      };
    };
  };

  const runEffectFn7 = function runEffectFn7(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function() {
                    return fn(a, b, c, d, e, f, g);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  const runEffectFn8 = function runEffectFn8(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function(h) {
                    return function() {
                      return fn(a, b, c, d, e, f, g, h);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  const runEffectFn9 = function runEffectFn9(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function(h) {
                    return function(i) {
                      return function() {
                        return fn(a, b, c, d, e, f, g, h, i);
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  const runEffectFn10 = function runEffectFn10(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return function(e) {
              return function(f) {
                return function(g) {
                  return function(h) {
                    return function(i) {
                      return function(j) {
                        return function() {
                          return fn(a, b, c, d, e, f, g, h, i, j);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Generated by purs version 0.15.15
  var semigroupEffectFn9 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn9(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return function (e) {
                                      return function (f) {
                                          return function (g) {
                                              return function (h) {
                                                  return function (i) {
                                                      return append(runEffectFn9(f1)(a)(b)(c)(d)(e)(f)(g)(h)(i))(runEffectFn9(f2)(a)(b)(c)(d)(e)(f)(g)(h)(i));
                                                  };
                                              };
                                          };
                                      };
                                  };
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn8 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn8(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return function (e) {
                                      return function (f) {
                                          return function (g) {
                                              return function (h) {
                                                  return append(runEffectFn8(f1)(a)(b)(c)(d)(e)(f)(g)(h))(runEffectFn8(f2)(a)(b)(c)(d)(e)(f)(g)(h));
                                              };
                                          };
                                      };
                                  };
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn7 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn7(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return function (e) {
                                      return function (f) {
                                          return function (g) {
                                              return append(runEffectFn7(f1)(a)(b)(c)(d)(e)(f)(g))(runEffectFn7(f2)(a)(b)(c)(d)(e)(f)(g));
                                          };
                                      };
                                  };
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn6 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn6(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return function (e) {
                                      return function (f) {
                                          return append(runEffectFn6(f1)(a)(b)(c)(d)(e)(f))(runEffectFn6(f2)(a)(b)(c)(d)(e)(f));
                                      };
                                  };
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn5 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn5(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return function (e) {
                                      return append(runEffectFn5(f1)(a)(b)(c)(d)(e))(runEffectFn5(f2)(a)(b)(c)(d)(e));
                                  };
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn4 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn4(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return append(runEffectFn4(f1)(a)(b)(c)(d))(runEffectFn4(f2)(a)(b)(c)(d));
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn3 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn3(function (a) {
                      return function (b) {
                          return function (c) {
                              return append(runEffectFn3(f1)(a)(b)(c))(runEffectFn3(f2)(a)(b)(c));
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn2 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn2(function (a) {
                      return function (b) {
                          return append(runEffectFn2(f1)(a)(b))(runEffectFn2(f2)(a)(b));
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn10 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn10(function (a) {
                      return function (b) {
                          return function (c) {
                              return function (d) {
                                  return function (e) {
                                      return function (f) {
                                          return function (g) {
                                              return function (h) {
                                                  return function (i) {
                                                      return function (j) {
                                                          return append(runEffectFn10(f1)(a)(b)(c)(d)(e)(f)(g)(h)(i)(j))(runEffectFn10(f2)(a)(b)(c)(d)(e)(f)(g)(h)(i)(j));
                                                      };
                                                  };
                                              };
                                          };
                                      };
                                  };
                              };
                          };
                      };
                  });
              };
          }
      };
  };
  var semigroupEffectFn1 = function (dictSemigroup) {
      var append = append$1(semigroupEffect(dictSemigroup));
      return {
          append: function (f1) {
              return function (f2) {
                  return mkEffectFn1(function (a) {
                      return append(runEffectFn1(f1)(a))(runEffectFn1(f2)(a));
                  });
              };
          }
      };
  };
  var monoidEffectFn9 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn91 = semigroupEffectFn9(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn9(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return function (v4) {
                              return function (v5) {
                                  return function (v6) {
                                      return function (v7) {
                                          return function (v8) {
                                              return mempty$1;
                                          };
                                      };
                                  };
                              };
                          };
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn91;
          }
      };
  };
  var monoidEffectFn8 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn81 = semigroupEffectFn8(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn8(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return function (v4) {
                              return function (v5) {
                                  return function (v6) {
                                      return function (v7) {
                                          return mempty$1;
                                      };
                                  };
                              };
                          };
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn81;
          }
      };
  };
  var monoidEffectFn7 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn71 = semigroupEffectFn7(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn7(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return function (v4) {
                              return function (v5) {
                                  return function (v6) {
                                      return mempty$1;
                                  };
                              };
                          };
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn71;
          }
      };
  };
  var monoidEffectFn6 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn61 = semigroupEffectFn6(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn6(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return function (v4) {
                              return function (v5) {
                                  return mempty$1;
                              };
                          };
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn61;
          }
      };
  };
  var monoidEffectFn5 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn51 = semigroupEffectFn5(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn5(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return function (v4) {
                              return mempty$1;
                          };
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn51;
          }
      };
  };
  var monoidEffectFn4 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn41 = semigroupEffectFn4(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn4(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return mempty$1;
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn41;
          }
      };
  };
  var monoidEffectFn3 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn31 = semigroupEffectFn3(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn3(function (v) {
              return function (v1) {
                  return function (v2) {
                      return mempty$1;
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn31;
          }
      };
  };
  var monoidEffectFn2 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn21 = semigroupEffectFn2(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn2(function (v) {
              return function (v1) {
                  return mempty$1;
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn21;
          }
      };
  };
  var monoidEffectFn10 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn101 = semigroupEffectFn10(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn10(function (v) {
              return function (v1) {
                  return function (v2) {
                      return function (v3) {
                          return function (v4) {
                              return function (v5) {
                                  return function (v6) {
                                      return function (v7) {
                                          return function (v8) {
                                              return function (v9) {
                                                  return mempty$1;
                                              };
                                          };
                                      };
                                  };
                              };
                          };
                      };
                  };
              };
          }),
          Semigroup0: function () {
              return semigroupEffectFn101;
          }
      };
  };
  var monoidEffectFn1 = function (dictMonoid) {
      var mempty$1 = mempty(monoidEffect(dictMonoid));
      var semigroupEffectFn11 = semigroupEffectFn1(dictMonoid.Semigroup0());
      return {
          mempty: mkEffectFn1(function (v) {
              return mempty$1;
          }),
          Semigroup0: function () {
              return semigroupEffectFn11;
          }
      };
  };

  // Generated by purs version 0.15.15
  var Anonymous = /* #__PURE__ */ (function () {
      function Anonymous() {

      };
      Anonymous.value = new Anonymous();
      return Anonymous;
  })();
  var UseCredentials = /* #__PURE__ */ (function () {
      function UseCredentials() {

      };
      UseCredentials.value = new UseCredentials();
      return UseCredentials;
  })();
  var showDecodingHint$2 = {
      show: function (v) {
          if (v instanceof Anonymous) {
              return "Anonymous";
          };
          if (v instanceof UseCredentials) {
              return "UseCredentials";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.CORSMode (line 18, column 10 - line 20, column 39): " + [ v.constructor.name ]);
      }
  };
  var print$5 = function (v) {
      if (v instanceof Anonymous) {
          return "anonymous";
      };
      if (v instanceof UseCredentials) {
          return "use-credentials";
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.CORSMode (line 30, column 9 - line 32, column 38): " + [ v.constructor.name ]);
  };
  var parse$4 = function (v) {
      if (v === "") {
          return new Just(Anonymous.value);
      };
      if (v === "anonymous") {
          return new Just(Anonymous.value);
      };
      if (v === "use-credentials") {
          return new Just(UseCredentials.value);
      };
      return Nothing.value;
  };
  var eqCORSMode = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Anonymous && y instanceof Anonymous) {
                  return true;
              };
              if (x instanceof UseCredentials && y instanceof UseCredentials) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordCORSMode = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Anonymous && y instanceof Anonymous) {
                  return EQ.value;
              };
              if (x instanceof Anonymous) {
                  return LT.value;
              };
              if (y instanceof Anonymous) {
                  return GT.value;
              };
              if (x instanceof UseCredentials && y instanceof UseCredentials) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.CORSMode (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqCORSMode;
      }
  };

  // Generated by purs version 0.15.15
  var Sync = /* #__PURE__ */ (function () {
      function Sync() {

      };
      Sync.value = new Sync();
      return Sync;
  })();
  var Async = /* #__PURE__ */ (function () {
      function Async() {

      };
      Async.value = new Async();
      return Async;
  })();
  var Auto = /* #__PURE__ */ (function () {
      function Auto() {

      };
      Auto.value = new Auto();
      return Auto;
  })();
  var showDecodingHint$1 = {
      show: function (v) {
          if (v instanceof Sync) {
              return "Sync";
          };
          if (v instanceof Async) {
              return "Async";
          };
          if (v instanceof Auto) {
              return "Auto";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.DecodingHint (line 19, column 10 - line 22, column 19): " + [ v.constructor.name ]);
      }
  };
  var print$4 = function (v) {
      if (v instanceof Sync) {
          return "sync";
      };
      if (v instanceof Async) {
          return "async";
      };
      if (v instanceof Auto) {
          return "auto";
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.DecodingHint (line 33, column 9 - line 36, column 17): " + [ v.constructor.name ]);
  };
  var parse$3 = function (v) {
      if (v === "") {
          return new Just(Auto.value);
      };
      if (v === "sync") {
          return new Just(Sync.value);
      };
      if (v === "async") {
          return new Just(Async.value);
      };
      if (v === "auto") {
          return new Just(Auto.value);
      };
      return Nothing.value;
  };
  var eqDecodingHint$1 = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Sync && y instanceof Sync) {
                  return true;
              };
              if (x instanceof Async && y instanceof Async) {
                  return true;
              };
              if (x instanceof Auto && y instanceof Auto) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordDecodingHint$1 = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Sync && y instanceof Sync) {
                  return EQ.value;
              };
              if (x instanceof Sync) {
                  return LT.value;
              };
              if (y instanceof Sync) {
                  return GT.value;
              };
              if (x instanceof Async && y instanceof Async) {
                  return EQ.value;
              };
              if (x instanceof Async) {
                  return LT.value;
              };
              if (y instanceof Async) {
                  return GT.value;
              };
              if (x instanceof Auto && y instanceof Auto) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.DecodingHint (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqDecodingHint$1;
      }
  };

  // Generated by purs version 0.15.15
  var Eager = /* #__PURE__ */ (function () {
      function Eager() {

      };
      Eager.value = new Eager();
      return Eager;
  })();
  var Lazy = /* #__PURE__ */ (function () {
      function Lazy() {

      };
      Lazy.value = new Lazy();
      return Lazy;
  })();
  var showDecodingHint = {
      show: function (v) {
          if (v instanceof Eager) {
              return "Eager";
          };
          if (v instanceof Lazy) {
              return "Lazy";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.Laziness (line 18, column 10 - line 20, column 19): " + [ v.constructor.name ]);
      }
  };
  var print$3 = function (v) {
      if (v instanceof Eager) {
          return "eager";
      };
      if (v instanceof Lazy) {
          return "lazy";
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.Laziness (line 30, column 9 - line 32, column 17): " + [ v.constructor.name ]);
  };
  var parse$2 = function (v) {
      if (v === "") {
          return new Just(Eager.value);
      };
      if (v === "eager") {
          return new Just(Eager.value);
      };
      if (v === "lazy") {
          return new Just(Lazy.value);
      };
      return Nothing.value;
  };
  var eqDecodingHint = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Eager && y instanceof Eager) {
                  return true;
              };
              if (x instanceof Lazy && y instanceof Lazy) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordDecodingHint = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Eager && y instanceof Eager) {
                  return EQ.value;
              };
              if (x instanceof Eager) {
                  return LT.value;
              };
              if (y instanceof Eager) {
                  return GT.value;
              };
              if (x instanceof Lazy && y instanceof Lazy) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLImageElement.Laziness (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqDecodingHint;
      }
  };

  // Generated by purs version 0.15.15
  var map$7 = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$F = unsafeCoerce;
  var toNonDocumentTypeChildNode$F = unsafeCoerce;
  var toNode$F = unsafeCoerce;
  var toHTMLElement$F = unsafeCoerce;
  var toEventTarget$G = unsafeCoerce;
  var toElement$F = unsafeCoerce;
  var toChildNode$F = unsafeCoerce;
  var setLoading = function (laziness) {
      return runEffectFn2(_setLoading)(print$3(laziness));
  };
  var setDecoding = function (hint) {
      return runEffectFn2(_setDecoding)(print$4(hint));
  };
  var setCrossOrigin$3 = function (mode) {
      return runEffectFn2(_setCrossOrigin)(print$5(mode));
  };
  var loading = /* #__PURE__ */ (function () {
      var $3 = map$7((function () {
          var $6 = fromMaybe$1(Eager.value);
          return function ($7) {
              return $6(parse$2($7));
          };
      })());
      var $4 = runEffectFn1(_loading);
      return function ($5) {
          return $3($4($5));
      };
  })();
  var fromParentNode$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var fromNonDocumentTypeChildNode$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var fromNode$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var fromHTMLElement$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var fromEventTarget$G = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var fromElement$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var fromChildNode$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLImageElement");
  var decoding = /* #__PURE__ */ (function () {
      var $8 = map$7((function () {
          var $11 = fromMaybe$1(Auto.value);
          return function ($12) {
              return $11(parse$3($12));
          };
      })());
      var $9 = runEffectFn1(_decoding);
      return function ($10) {
          return $8($9($10));
      };
  })();
  var crossOrigin$3 = /* #__PURE__ */ (function () {
      var $13 = map$7(composeKleisliFlipped(bindMaybe)(parse$4)(toMaybe));
      var $14 = runEffectFn1(_crossOrigin);
      return function ($15) {
          return $13($14($15));
      };
  })();
  var create$prime = createWithDimensions;

  function accept(input) {
    return function () {
      return input.accept;
    };
  }

  function setAccept(accept) {
    return function (input) {
      return function () {
        input.accept = accept;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function alt(input) {
    return function () {
      return input.alt;
    };
  }

  function setAlt(alt) {
    return function (input) {
      return function () {
        input.alt = alt;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function autocomplete$1(input) {
    return function () {
      return input.autocomplete;
    };
  }

  function setAutocomplete$1(autocomplete) {
    return function (input) {
      return function () {
        input.autocomplete = autocomplete;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function autofocus$3(input) {
    return function () {
      return input.autofocus;
    };
  }

  function setAutofocus$3(autofocus) {
    return function (input) {
      return function () {
        input.autofocus = autofocus;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function defaultChecked(input) {
    return function () {
      return input.defaultChecked;
    };
  }

  function setDefaultChecked(defaultChecked) {
    return function (input) {
      return function () {
        input.defaultChecked = defaultChecked;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function checked(input) {
    return function () {
      return input.checked;
    };
  }

  function setChecked(checked) {
    return function (input) {
      return function () {
        input.checked = checked;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function dirName$1(input) {
    return function () {
      return input.dirName;
    };
  }

  function setDirName$1(dirName) {
    return function (input) {
      return function () {
        input.dirName = dirName;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function disabled$6(input) {
    return function () {
      return input.disabled;
    };
  }

  function setDisabled$6(disabled) {
    return function (input) {
      return function () {
        input.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$8(input) {
    return function () {
      return input.form;
    };
  }

  // ----------------------------------------------------------------------------

  function _files(input) {
    return function () {
      return input.files;
    };
  }

  // ----------------------------------------------------------------------------

  function formAction(input) {
    return function () {
      return input.formAction;
    };
  }

  function setFormAction(formAction) {
    return function (input) {
      return function () {
        input.formAction = formAction;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formEnctype(input) {
    return function () {
      return input.formEnctype;
    };
  }

  function setFormEnctype(formEnctype) {
    return function (input) {
      return function () {
        input.formEnctype = formEnctype;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formMethod(input) {
    return function () {
      return input.formMethod;
    };
  }

  function setFormMethod(formMethod) {
    return function (input) {
      return function () {
        input.formMethod = formMethod;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formNoValidate(input) {
    return function () {
      return input.formNoValidate;
    };
  }

  function setFormNoValidate(formNoValidate) {
    return function (input) {
      return function () {
        input.formNoValidate = formNoValidate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function formTarget(input) {
    return function () {
      return input.formTarget;
    };
  }

  function setFormTarget(formTarget) {
    return function (input) {
      return function () {
        input.formTarget = formTarget;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height$2(input) {
    return function () {
      return input.height;
    };
  }

  function setHeight$2(height) {
    return function (input) {
      return function () {
        input.height = height;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function indeterminate(input) {
    return function () {
      return input.indeterminate;
    };
  }

  function setIndeterminate(indeterminate) {
    return function (input) {
      return function () {
        input.indeterminate = indeterminate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _list(input) {
    return function () {
      return input.list;
    };
  }

  // ----------------------------------------------------------------------------

  function max$2(input) {
    return function () {
      return input.max;
    };
  }

  function setMax$2(max) {
    return function (input) {
      return function () {
        input.max = max;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function maxLength$1(input) {
    return function () {
      return input.maxLength;
    };
  }

  function setMaxLength$1(maxLength) {
    return function (input) {
      return function () {
        input.maxLength = maxLength;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function min$1(input) {
    return function () {
      return input.min;
    };
  }

  function setMin$1(min) {
    return function (input) {
      return function () {
        input.min = min;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function minLength$1(input) {
    return function () {
      return input.minLength;
    };
  }

  function setMinLength$1(minLength) {
    return function (input) {
      return function () {
        input.minLength = minLength;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function multiple$1(input) {
    return function () {
      return input.multiple;
    };
  }

  function setMultiple$1(multiple) {
    return function (input) {
      return function () {
        input.multiple = multiple;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function name$8(input) {
    return function () {
      return input.name;
    };
  }

  function setName$8(name) {
    return function (input) {
      return function () {
        input.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function pattern(input) {
    return function () {
      return input.pattern;
    };
  }

  function setPattern(pattern) {
    return function (input) {
      return function () {
        input.pattern = pattern;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function placeholder$1(input) {
    return function () {
      return input.placeholder;
    };
  }

  function setPlaceholder$1(placeholder) {
    return function (input) {
      return function () {
        input.placeholder = placeholder;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function readOnly$1(input) {
    return function () {
      return input.readOnly;
    };
  }

  function setReadOnly$1(readOnly) {
    return function (input) {
      return function () {
        input.readOnly = readOnly;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function required$2(input) {
    return function () {
      return input.required;
    };
  }

  function setRequired$2(required) {
    return function (input) {
      return function () {
        input.required = required;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function size$1(input) {
    return function () {
      return input.size;
    };
  }

  function setSize$1(size) {
    return function (input) {
      return function () {
        input.size = size;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function src$4(input) {
    return function () {
      return input.src;
    };
  }

  function setSrc$4(src) {
    return function (input) {
      return function () {
        input.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function step(input) {
    return function () {
      return input.step;
    };
  }

  function setStep(step) {
    return function (input) {
      return function () {
        input.step = step;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$a(input) {
    return function () {
      return input.type;
    };
  }

  function setType$6(type) {
    return function (input) {
      return function () {
        input.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function defaultValue$2(input) {
    return function () {
      return input.defaultValue;
    };
  }

  function setDefaultValue$2(defaultValue) {
    return function (input) {
      return function () {
        input.defaultValue = defaultValue;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value$8(input) {
    return function () {
      return input.value;
    };
  }

  function setValue$8(value) {
    return function (input) {
      return function () {
        input.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function valueAsDate(input) {
    return function () {
      return input.valueAsDate;
    };
  }

  function setValueAsDate(valueAsDate) {
    return function (input) {
      return function () {
        input.valueAsDate = valueAsDate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function valueAsNumber(input) {
    return function () {
      return input.valueAsNumber;
    };
  }

  function setValueAsNumber(valueAsNumber) {
    return function (input) {
      return function () {
        input.valueAsNumber = valueAsNumber;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function width$2(input) {
    return function () {
      return input.width;
    };
  }

  function setWidth$2(width) {
    return function (input) {
      return function () {
        input.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function stepUpBy(n) {
    return function (input) {
      return function () {
        input.stepUp(n);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function stepDownBy(n) {
    return function (input) {
      return function () {
        input.stepDown(n);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$5(input) {
    return function () {
      return input.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$5(input) {
    return function () {
      return input.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$5(input) {
    return function () {
      return input.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$5(input) {
    return function () {
      return input.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$5(input) {
    return function () {
      return input.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$5(value) {
    return function (input) {
      return function () {
        input.setCustomValidity(value);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels$6(input) {
    return function () {
      return input.labels;
    };
  }

  // ----------------------------------------------------------------------------

  function select$1(input) {
    return function () {
      input.select();
    };
  }

  // ----------------------------------------------------------------------------

  function selectionStart$1(input) {
    return function () {
      return input.selectionStart;
    };
  }

  function setSelectionStart$1(selectionStart) {
    return function (input) {
      return function () {
        input.selectionStart = selectionStart;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function selectionEnd$1(input) {
    return function () {
      return input.selectionEnd;
    };
  }

  function setSelectionEnd$1(selectionEnd) {
    return function (input) {
      return function () {
        input.selectionEnd = selectionEnd;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function selectionDirection$1(input) {
    return function () {
      return input.selectionDirection;
    };
  }

  function setSelectionDirection$1(selectionDirection) {
    return function (input) {
      return function () {
        input.selectionDirection = selectionDirection;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function setRangeText$1(replacement) {
    return function (input) {
      return function () {
        input.setRangeText(replacement);
      };
    };
  }

  function _setRangeText$1(replacement, start, end, selectionMode, textarea) {
    textarea.setRangeText(replacement, start, end, selectionMode);
  }

  // ----------------------------------------------------------------------------

  function setSelectionRange$1(start) {
    return function (end) {
      return function (direction) {
        return function (input) {
          return function () {
            input.setSelectionRange(start, end, direction, input);
          };
        };
      };
    };
  }

  // Generated by purs version 0.15.15
  var Preserve = /* #__PURE__ */ (function () {
      function Preserve() {

      };
      Preserve.value = new Preserve();
      return Preserve;
  })();
  var Select = /* #__PURE__ */ (function () {
      function Select() {

      };
      Select.value = new Select();
      return Select;
  })();
  var Start = /* #__PURE__ */ (function () {
      function Start() {

      };
      Start.value = new Start();
      return Start;
  })();
  var End = /* #__PURE__ */ (function () {
      function End() {

      };
      End.value = new End();
      return End;
  })();
  var showSelectionMode = {
      show: function (v) {
          if (v instanceof Preserve) {
              return "Preserve";
          };
          if (v instanceof Select) {
              return "Select";
          };
          if (v instanceof Start) {
              return "Start";
          };
          if (v instanceof End) {
              return "End";
          };
          throw new Error("Failed pattern match at Web.HTML.SelectionMode (line 17, column 10 - line 21, column 17): " + [ v.constructor.name ]);
      }
  };
  var print$2 = function (v) {
      if (v instanceof Preserve) {
          return "preserve";
      };
      if (v instanceof Select) {
          return "select";
      };
      if (v instanceof Start) {
          return "start";
      };
      if (v instanceof End) {
          return "end";
      };
      throw new Error("Failed pattern match at Web.HTML.SelectionMode (line 32, column 9 - line 36, column 15): " + [ v.constructor.name ]);
  };
  var parse$1 = function (v) {
      if (v === "preserve") {
          return new Just(Preserve.value);
      };
      if (v === "select") {
          return new Just(Select.value);
      };
      if (v === "start") {
          return new Just(Start.value);
      };
      if (v === "end") {
          return new Just(End.value);
      };
      return Nothing.value;
  };
  var eqSelectionMode = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Preserve && y instanceof Preserve) {
                  return true;
              };
              if (x instanceof Select && y instanceof Select) {
                  return true;
              };
              if (x instanceof Start && y instanceof Start) {
                  return true;
              };
              if (x instanceof End && y instanceof End) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordSelectionMode = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Preserve && y instanceof Preserve) {
                  return EQ.value;
              };
              if (x instanceof Preserve) {
                  return LT.value;
              };
              if (y instanceof Preserve) {
                  return GT.value;
              };
              if (x instanceof Select && y instanceof Select) {
                  return EQ.value;
              };
              if (x instanceof Select) {
                  return LT.value;
              };
              if (y instanceof Select) {
                  return GT.value;
              };
              if (x instanceof Start && y instanceof Start) {
                  return EQ.value;
              };
              if (x instanceof Start) {
                  return LT.value;
              };
              if (y instanceof Start) {
                  return GT.value;
              };
              if (x instanceof End && y instanceof End) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.SelectionMode (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqSelectionMode;
      }
  };

  // Generated by purs version 0.15.15
  var map$6 = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$E = unsafeCoerce;
  var toNonDocumentTypeChildNode$E = unsafeCoerce;
  var toNode$E = unsafeCoerce;
  var toHTMLElement$E = unsafeCoerce;
  var toEventTarget$F = unsafeCoerce;
  var toElement$E = unsafeCoerce;
  var toChildNode$E = unsafeCoerce;
  var stepUp$prime = stepUpBy;
  var stepUp = /* #__PURE__ */ stepUp$prime(1);
  var stepDown$prime = stepDownBy;
  var stepDown = /* #__PURE__ */ stepDown$prime(1);
  var setRangeText$prime$1 = function (rpl) {
      return function (s) {
          return function (e) {
              return function (mode) {
                  return function (area) {
                      return function () {
                          return _setRangeText$1(rpl, s, e, print$2(mode), area);
                      };
                  };
              };
          };
      };
  };
  var list = /* #__PURE__ */ (function () {
      var $2 = map$6(toMaybe);
      return function ($3) {
          return $2(_list($3));
      };
  })();
  var fromParentNode$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var fromNonDocumentTypeChildNode$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var fromNode$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var fromHTMLElement$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var fromEventTarget$F = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var fromElement$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var fromChildNode$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");
  var form$8 = /* #__PURE__ */ (function () {
      var $4 = map$6(toMaybe);
      return function ($5) {
          return $4(_form$8($5));
      };
  })();
  var files = /* #__PURE__ */ (function () {
      var $6 = map$6(toMaybe);
      return function ($7) {
          return $6(_files($7));
      };
  })();

  function autofocus$2(keygen) {
    return function () {
      return keygen.autofocus;
    };
  }

  function setAutofocus$2(autofocus) {
    return function (keygen) {
      return function () {
        keygen.autofocus = autofocus;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function challenge(keygen) {
    return function () {
      return keygen.challenge;
    };
  }

  function setChallenge(challenge) {
    return function (keygen) {
      return function () {
        keygen.challenge = challenge;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function disabled$5(keygen) {
    return function () {
      return keygen.disabled;
    };
  }

  function setDisabled$5(disabled) {
    return function (keygen) {
      return function () {
        keygen.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$7(keygen) {
    return function () {
      return keygen.form;
    };
  }

  // ----------------------------------------------------------------------------

  function keytype(keygen) {
    return function () {
      return keygen.keytype;
    };
  }

  function setKeytype(keytype) {
    return function (keygen) {
      return function () {
        keygen.keytype = keytype;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function name$7(keygen) {
    return function () {
      return keygen.name;
    };
  }

  function setName$7(name) {
    return function (keygen) {
      return function () {
        keygen.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$9(keygen) {
    return function () {
      return keygen.type;
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$4(keygen) {
    return function () {
      return keygen.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$4(keygen) {
    return function () {
      return keygen.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$4(keygen) {
    return function () {
      return keygen.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$4(keygen) {
    return function () {
      return keygen.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$4(keygen) {
    return function () {
      return keygen.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$4(value) {
    return function (keygen) {
      return function () {
        keygen.setCustomValidity(value);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels$5(keygen) {
    return function () {
      return keygen.labels;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$D = unsafeCoerce;
  var toNonDocumentTypeChildNode$D = unsafeCoerce;
  var toNode$D = unsafeCoerce;
  var toHTMLElement$D = unsafeCoerce;
  var toEventTarget$E = unsafeCoerce;
  var toElement$D = unsafeCoerce;
  var toChildNode$D = unsafeCoerce;
  var fromParentNode$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var fromNonDocumentTypeChildNode$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var fromNode$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var fromHTMLElement$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var fromEventTarget$E = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var fromElement$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var fromChildNode$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLKeygenElement");
  var form$7 = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$7($3));
      };
  })();

  function value$7(li) {
    return function () {
      return li.value;
    };
  }

  function setValue$7(value) {
    return function (li) {
      return function () {
        li.value = value;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$C = unsafeCoerce;
  var toNonDocumentTypeChildNode$C = unsafeCoerce;
  var toNode$C = unsafeCoerce;
  var toHTMLElement$C = unsafeCoerce;
  var toEventTarget$D = unsafeCoerce;
  var toElement$C = unsafeCoerce;
  var toChildNode$C = unsafeCoerce;
  var fromParentNode$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");
  var fromNonDocumentTypeChildNode$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");
  var fromNode$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");
  var fromHTMLElement$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");
  var fromEventTarget$D = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");
  var fromElement$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");
  var fromChildNode$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLIElement");

  function _form$6(label) {
    return function () {
      return label.form;
    };
  }

  // ----------------------------------------------------------------------------

  function htmlFor(label) {
    return function () {
      return label.htmlFor;
    };
  }

  function setHtmlFor(htmlFor) {
    return function (label) {
      return function () {
        label.htmlFor = htmlFor;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _control(label) {
    return function () {
      return label.control;
    };
  }

  // Generated by purs version 0.15.15
  var map$5 = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$B = unsafeCoerce;
  var toNonDocumentTypeChildNode$B = unsafeCoerce;
  var toNode$B = unsafeCoerce;
  var toHTMLElement$B = unsafeCoerce;
  var toEventTarget$C = unsafeCoerce;
  var toElement$B = unsafeCoerce;
  var toChildNode$B = unsafeCoerce;
  var fromParentNode$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var fromNonDocumentTypeChildNode$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var fromNode$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var fromHTMLElement$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var fromEventTarget$C = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var fromElement$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var fromChildNode$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLabelElement");
  var form$6 = /* #__PURE__ */ (function () {
      var $2 = map$5(toMaybe);
      return function ($3) {
          return $2(_form$6($3));
      };
  })();
  var control = /* #__PURE__ */ (function () {
      var $4 = map$5(toMaybe);
      return function ($5) {
          return $4(_control($5));
      };
  })();

  function _form$5(le) {
    return function () {
      return le.form;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$A = unsafeCoerce;
  var toNonDocumentTypeChildNode$A = unsafeCoerce;
  var toNode$A = unsafeCoerce;
  var toHTMLElement$A = unsafeCoerce;
  var toEventTarget$B = unsafeCoerce;
  var toElement$A = unsafeCoerce;
  var toChildNode$A = unsafeCoerce;
  var fromParentNode$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var fromNonDocumentTypeChildNode$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var fromNode$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var fromHTMLElement$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var fromEventTarget$B = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var fromElement$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var fromChildNode$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLegendElement");
  var form$5 = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$5($3));
      };
  })();

  function disabled$4(link) {
    return function () {
      return link.disabled;
    };
  }

  function setDisabled$4(disabled) {
    return function (link) {
      return function () {
        link.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function href$1(link) {
    return function () {
      return link.href;
    };
  }

  function setHref$1(href) {
    return function (link) {
      return function () {
        link.href = href;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function crossOrigin$2(link) {
    return function () {
      return link.crossOrigin;
    };
  }

  function setCrossOrigin$2(crossOrigin) {
    return function (link) {
      return function () {
        link.crossOrigin = crossOrigin;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rel(link) {
    return function () {
      return link.rel;
    };
  }

  function setRel(rel) {
    return function (link) {
      return function () {
        link.rel = rel;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rev(link) {
    return function () {
      return link.rev;
    };
  }

  function setRev(rev) {
    return function (link) {
      return function () {
        link.rev = rev;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function relList(link) {
    return function () {
      return link.relList;
    };
  }

  // ----------------------------------------------------------------------------

  function media$2(link) {
    return function () {
      return link.media;
    };
  }

  function setMedia$2(media) {
    return function (link) {
      return function () {
        link.media = media;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function hreflang(link) {
    return function () {
      return link.hreflang;
    };
  }

  function setHreflang(hreflang) {
    return function (link) {
      return function () {
        link.hreflang = hreflang;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$8(link) {
    return function () {
      return link.type;
    };
  }

  function setType$5(type) {
    return function (link) {
      return function () {
        link.type = type;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$z = unsafeCoerce;
  var toNonDocumentTypeChildNode$z = unsafeCoerce;
  var toNode$z = unsafeCoerce;
  var toHTMLElement$z = unsafeCoerce;
  var toEventTarget$A = unsafeCoerce;
  var toElement$z = unsafeCoerce;
  var toChildNode$z = unsafeCoerce;
  var fromParentNode$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");
  var fromNonDocumentTypeChildNode$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");
  var fromNode$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");
  var fromHTMLElement$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");
  var fromEventTarget$A = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");
  var fromElement$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");
  var fromChildNode$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLLinkElement");

  function name$6(map) {
    return function () {
      return map.name;
    };
  }

  function setName$6(name) {
    return function (map) {
      return function () {
        map.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function areas(map) {
    return function () {
      return map.areas;
    };
  }

  // ----------------------------------------------------------------------------

  function images(map) {
    return function () {
      return map.images;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$y = unsafeCoerce;
  var toNonDocumentTypeChildNode$y = unsafeCoerce;
  var toNode$y = unsafeCoerce;
  var toHTMLElement$y = unsafeCoerce;
  var toEventTarget$z = unsafeCoerce;
  var toElement$y = unsafeCoerce;
  var toChildNode$y = unsafeCoerce;
  var fromParentNode$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");
  var fromNonDocumentTypeChildNode$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");
  var fromNode$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");
  var fromHTMLElement$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");
  var fromEventTarget$z = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");
  var fromElement$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");
  var fromChildNode$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMapElement");

  function src$3(media) {
    return function () {
      return media.src;
    };
  }

  function setSrc$3(src) {
    return function (media) {
      return function () {
        media.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function currentSrc(media) {
    return function () {
      return media.currentSrc;
    };
  }

  // ----------------------------------------------------------------------------

  function crossOrigin$1(media) {
    return function () {
      return media.crossOrigin;
    };
  }

  function setCrossOrigin$1(crossOrigin) {
    return function (media) {
      return function () {
        media.crossOrigin = crossOrigin;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _networkState(media) {
    return media.networkState;
  }

  // ----------------------------------------------------------------------------

  function preload(media) {
    return function () {
      return media.preload;
    };
  }

  function setPreload(preload) {
    return function (media) {
      return function () {
        media.preload = preload;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function load(media) {
    return function () {
      return media.load();
    };
  }

  // ----------------------------------------------------------------------------

  function _canPlayType(type, media) {
    return media.canPlayType(type);
  }

  // ----------------------------------------------------------------------------

  function _readyState$1(media) {
    return media.readyState;
  }

  // ----------------------------------------------------------------------------

  function seeking(media) {
    return function () {
      return media.seeking;
    };
  }

  // ----------------------------------------------------------------------------

  function currentTime(media) {
    return function () {
      return media.currentTime;
    };
  }

  function setCurrentTime(currentTime) {
    return function (media) {
      return function () {
        media.currentTime = currentTime;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function duration(media) {
    return function () {
      return media.duration;
    };
  }

  // ----------------------------------------------------------------------------

  function getStartDate(media) {
    return function () {
      return media.getStartDate();
    };
  }

  // ----------------------------------------------------------------------------

  function paused(media) {
    return function () {
      return media.paused;
    };
  }

  // ----------------------------------------------------------------------------

  function defaultPlaybackRate(media) {
    return function () {
      return media.defaultPlaybackRate;
    };
  }

  function setDefaultPlaybackRate(defaultPlaybackRate) {
    return function (media) {
      return function () {
        media.defaultPlaybackRate = defaultPlaybackRate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function playbackRate(media) {
    return function () {
      return media.playbackRate;
    };
  }

  function setPlaybackRate(playbackRate) {
    return function (media) {
      return function () {
        media.playbackRate = playbackRate;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function ended(media) {
    return function () {
      return media.ended;
    };
  }

  // ----------------------------------------------------------------------------

  function autoplay(media) {
    return function () {
      return media.autoplay;
    };
  }

  function setAutoplay(autoplay) {
    return function (media) {
      return function () {
        media.autoplay = autoplay;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function loop(media) {
    return function () {
      return media.loop;
    };
  }

  function setLoop(loop) {
    return function (media) {
      return function () {
        media.loop = loop;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function play(media) {
    return function () {
      media.play();
    };
  }

  // ----------------------------------------------------------------------------

  function pause(media) {
    return function () {
      media.pause();
    };
  }

  // ----------------------------------------------------------------------------

  function mediaGroup(media) {
    return function () {
      return media.mediaGroup;
    };
  }

  function setMediaGroup(mediaGroup) {
    return function (media) {
      return function () {
        media.mediaGroup = mediaGroup;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function controls(media) {
    return function () {
      return media.controls;
    };
  }

  function setControls(controls) {
    return function (media) {
      return function () {
        media.controls = controls;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function volume(media) {
    return function () {
      return media.volume;
    };
  }

  function setVolume(volume) {
    return function (media) {
      return function () {
        media.volume = volume;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function muted(media) {
    return function () {
      return media.muted;
    };
  }

  function setMuted(muted) {
    return function (media) {
      return function () {
        media.muted = muted;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function defaultMuted(media) {
    return function () {
      return media.defaultMuted;
    };
  }

  function setDefaultMuted(defaultMuted) {
    return function (media) {
      return function () {
        media.defaultMuted = defaultMuted;
      };
    };
  }

  // Generated by purs version 0.15.15
  var Unspecified = /* #__PURE__ */ (function () {
      function Unspecified() {

      };
      Unspecified.value = new Unspecified();
      return Unspecified;
  })();
  var Maybe = /* #__PURE__ */ (function () {
      function Maybe() {

      };
      Maybe.value = new Maybe();
      return Maybe;
  })();
  var Probably = /* #__PURE__ */ (function () {
      function Probably() {

      };
      Probably.value = new Probably();
      return Probably;
  })();
  var showCanPlayType = {
      show: function (v) {
          if (v instanceof Unspecified) {
              return "Unspecified";
          };
          if (v instanceof Maybe) {
              return "Maybe";
          };
          if (v instanceof Probably) {
              return "Probably";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.CanPlayType (line 16, column 10 - line 19, column 27): " + [ v.constructor.name ]);
      }
  };
  var print$1 = function (v) {
      if (v instanceof Unspecified) {
          return "";
      };
      if (v instanceof Maybe) {
          return "maybe";
      };
      if (v instanceof Probably) {
          return "probably";
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.CanPlayType (line 29, column 9 - line 32, column 25): " + [ v.constructor.name ]);
  };
  var parse = function (v) {
      if (v === "") {
          return new Just(Unspecified.value);
      };
      if (v === "maybe") {
          return new Just(Maybe.value);
      };
      if (v === "probably") {
          return new Just(Probably.value);
      };
      return Nothing.value;
  };
  var eqCanPlayType = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Unspecified && y instanceof Unspecified) {
                  return true;
              };
              if (x instanceof Maybe && y instanceof Maybe) {
                  return true;
              };
              if (x instanceof Probably && y instanceof Probably) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordCanPlayType = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Unspecified && y instanceof Unspecified) {
                  return EQ.value;
              };
              if (x instanceof Unspecified) {
                  return LT.value;
              };
              if (y instanceof Unspecified) {
                  return GT.value;
              };
              if (x instanceof Maybe && y instanceof Maybe) {
                  return EQ.value;
              };
              if (x instanceof Maybe) {
                  return LT.value;
              };
              if (y instanceof Maybe) {
                  return GT.value;
              };
              if (x instanceof Probably && y instanceof Probably) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.CanPlayType (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqCanPlayType;
      }
  };

  // Generated by purs version 0.15.15
  var Empty = /* #__PURE__ */ (function () {
      function Empty() {

      };
      Empty.value = new Empty();
      return Empty;
  })();
  var Idle = /* #__PURE__ */ (function () {
      function Idle() {

      };
      Idle.value = new Idle();
      return Idle;
  })();
  var Loading$1 = /* #__PURE__ */ (function () {
      function Loading() {

      };
      Loading.value = new Loading();
      return Loading;
  })();
  var NoSource = /* #__PURE__ */ (function () {
      function NoSource() {

      };
      NoSource.value = new NoSource();
      return NoSource;
  })();
  var toEnumNetworkState = function (v) {
      if (v === 0) {
          return new Just(Empty.value);
      };
      if (v === 1) {
          return new Just(Idle.value);
      };
      if (v === 2) {
          return new Just(Loading$1.value);
      };
      if (v === 3) {
          return new Just(NoSource.value);
      };
      return Nothing.value;
  };
  var showNetworkState = {
      show: function (v) {
          if (v instanceof Empty) {
              return "Empty";
          };
          if (v instanceof Idle) {
              return "Idle";
          };
          if (v instanceof Loading$1) {
              return "Loading";
          };
          if (v instanceof NoSource) {
              return "NoSource";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.NetworkState (line 30, column 1 - line 34, column 29): " + [ v.constructor.name ]);
      }
  };
  var fromEnumNetworkState = function (v) {
      if (v instanceof Empty) {
          return 0;
      };
      if (v instanceof Idle) {
          return 1;
      };
      if (v instanceof Loading$1) {
          return 2;
      };
      if (v instanceof NoSource) {
          return 3;
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.NetworkState (line 47, column 3 - line 51, column 18): " + [ v.constructor.name ]);
  };
  var eqNetworkState = {
      eq: function (x) {
          return function (y) {
              if (x instanceof Empty && y instanceof Empty) {
                  return true;
              };
              if (x instanceof Idle && y instanceof Idle) {
                  return true;
              };
              if (x instanceof Loading$1 && y instanceof Loading$1) {
                  return true;
              };
              if (x instanceof NoSource && y instanceof NoSource) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordNetworkState = {
      compare: function (x) {
          return function (y) {
              if (x instanceof Empty && y instanceof Empty) {
                  return EQ.value;
              };
              if (x instanceof Empty) {
                  return LT.value;
              };
              if (y instanceof Empty) {
                  return GT.value;
              };
              if (x instanceof Idle && y instanceof Idle) {
                  return EQ.value;
              };
              if (x instanceof Idle) {
                  return LT.value;
              };
              if (y instanceof Idle) {
                  return GT.value;
              };
              if (x instanceof Loading$1 && y instanceof Loading$1) {
                  return EQ.value;
              };
              if (x instanceof Loading$1) {
                  return LT.value;
              };
              if (y instanceof Loading$1) {
                  return GT.value;
              };
              if (x instanceof NoSource && y instanceof NoSource) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.NetworkState (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqNetworkState;
      }
  };
  var enumNetworkState = {
      succ: /* #__PURE__ */ defaultSucc(toEnumNetworkState)(fromEnumNetworkState),
      pred: /* #__PURE__ */ defaultPred(toEnumNetworkState)(fromEnumNetworkState),
      Ord0: function () {
          return ordNetworkState;
      }
  };
  var boundedNetworkState = /* #__PURE__ */ (function () {
      return {
          bottom: Empty.value,
          top: NoSource.value,
          Ord0: function () {
              return ordNetworkState;
          }
      };
  })();
  var boundedEnumNetworkState = {
      cardinality: 4,
      toEnum: toEnumNetworkState,
      fromEnum: fromEnumNetworkState,
      Bounded0: function () {
          return boundedNetworkState;
      },
      Enum1: function () {
          return enumNetworkState;
      }
  };

  // Generated by purs version 0.15.15
  var HaveNothing = /* #__PURE__ */ (function () {
      function HaveNothing() {

      };
      HaveNothing.value = new HaveNothing();
      return HaveNothing;
  })();
  var HaveMetadata = /* #__PURE__ */ (function () {
      function HaveMetadata() {

      };
      HaveMetadata.value = new HaveMetadata();
      return HaveMetadata;
  })();
  var HaveCurrentData = /* #__PURE__ */ (function () {
      function HaveCurrentData() {

      };
      HaveCurrentData.value = new HaveCurrentData();
      return HaveCurrentData;
  })();
  var HaveFutureData = /* #__PURE__ */ (function () {
      function HaveFutureData() {

      };
      HaveFutureData.value = new HaveFutureData();
      return HaveFutureData;
  })();
  var HaveEnoughData = /* #__PURE__ */ (function () {
      function HaveEnoughData() {

      };
      HaveEnoughData.value = new HaveEnoughData();
      return HaveEnoughData;
  })();
  var toEnumReadyState$1 = function (v) {
      if (v === 0) {
          return new Just(HaveNothing.value);
      };
      if (v === 1) {
          return new Just(HaveMetadata.value);
      };
      if (v === 2) {
          return new Just(HaveCurrentData.value);
      };
      if (v === 3) {
          return new Just(HaveFutureData.value);
      };
      if (v === 4) {
          return new Just(HaveEnoughData.value);
      };
      return Nothing.value;
  };
  var showReadyState$1 = {
      show: function (v) {
          if (v instanceof HaveNothing) {
              return "HaveNothing";
          };
          if (v instanceof HaveMetadata) {
              return "HaveMetadata";
          };
          if (v instanceof HaveCurrentData) {
              return "HaveCurrentData";
          };
          if (v instanceof HaveFutureData) {
              return "HaveFutureData";
          };
          if (v instanceof HaveEnoughData) {
              return "HaveEnoughData";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.ReadyState (line 31, column 1 - line 36, column 41): " + [ v.constructor.name ]);
      }
  };
  var fromEnumReadyState$1 = function (v) {
      if (v instanceof HaveNothing) {
          return 0;
      };
      if (v instanceof HaveMetadata) {
          return 1;
      };
      if (v instanceof HaveCurrentData) {
          return 2;
      };
      if (v instanceof HaveFutureData) {
          return 3;
      };
      if (v instanceof HaveEnoughData) {
          return 4;
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.ReadyState (line 50, column 3 - line 55, column 24): " + [ v.constructor.name ]);
  };
  var eqReadyState$1 = {
      eq: function (x) {
          return function (y) {
              if (x instanceof HaveNothing && y instanceof HaveNothing) {
                  return true;
              };
              if (x instanceof HaveMetadata && y instanceof HaveMetadata) {
                  return true;
              };
              if (x instanceof HaveCurrentData && y instanceof HaveCurrentData) {
                  return true;
              };
              if (x instanceof HaveFutureData && y instanceof HaveFutureData) {
                  return true;
              };
              if (x instanceof HaveEnoughData && y instanceof HaveEnoughData) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordReadyState$1 = {
      compare: function (x) {
          return function (y) {
              if (x instanceof HaveNothing && y instanceof HaveNothing) {
                  return EQ.value;
              };
              if (x instanceof HaveNothing) {
                  return LT.value;
              };
              if (y instanceof HaveNothing) {
                  return GT.value;
              };
              if (x instanceof HaveMetadata && y instanceof HaveMetadata) {
                  return EQ.value;
              };
              if (x instanceof HaveMetadata) {
                  return LT.value;
              };
              if (y instanceof HaveMetadata) {
                  return GT.value;
              };
              if (x instanceof HaveCurrentData && y instanceof HaveCurrentData) {
                  return EQ.value;
              };
              if (x instanceof HaveCurrentData) {
                  return LT.value;
              };
              if (y instanceof HaveCurrentData) {
                  return GT.value;
              };
              if (x instanceof HaveFutureData && y instanceof HaveFutureData) {
                  return EQ.value;
              };
              if (x instanceof HaveFutureData) {
                  return LT.value;
              };
              if (y instanceof HaveFutureData) {
                  return GT.value;
              };
              if (x instanceof HaveEnoughData && y instanceof HaveEnoughData) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLMediaElement.ReadyState (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqReadyState$1;
      }
  };
  var enumReadyState$1 = {
      succ: /* #__PURE__ */ defaultSucc(toEnumReadyState$1)(fromEnumReadyState$1),
      pred: /* #__PURE__ */ defaultPred(toEnumReadyState$1)(fromEnumReadyState$1),
      Ord0: function () {
          return ordReadyState$1;
      }
  };
  var boundedReadyState$1 = /* #__PURE__ */ (function () {
      return {
          bottom: HaveNothing.value,
          top: HaveEnoughData.value,
          Ord0: function () {
              return ordReadyState$1;
          }
      };
  })();
  var boundedEnumReadyState$1 = {
      cardinality: 5,
      toEnum: toEnumReadyState$1,
      fromEnum: fromEnumReadyState$1,
      Bounded0: function () {
          return boundedReadyState$1;
      },
      Enum1: function () {
          return enumReadyState$1;
      }
  };

  // Generated by purs version 0.15.15
  var map$4 = /* #__PURE__ */ map$o(functorEffect);
  var toEnum$1 = /* #__PURE__ */ toEnum$2(boundedEnumReadyState$1);
  var toEnum1 = /* #__PURE__ */ toEnum$2(boundedEnumNetworkState);
  var toParentNode$x = unsafeCoerce;
  var toNonDocumentTypeChildNode$x = unsafeCoerce;
  var toNode$x = unsafeCoerce;
  var toHTMLElement$x = unsafeCoerce;
  var toEventTarget$y = unsafeCoerce;
  var toElement$x = unsafeCoerce;
  var toChildNode$x = unsafeCoerce;
  var readyState$1 = function (el) {
      return map$4((function () {
          var $4 = fromMaybe$1(HaveNothing.value);
          return function ($5) {
              return $4(toEnum$1($5));
          };
      })())(function () {
          return _readyState$1(el);
      });
  };
  var networkState = function (el) {
      return map$4((function () {
          var $6 = fromMaybe$1(Empty.value);
          return function ($7) {
              return $6(toEnum1($7));
          };
      })())(function () {
          return _networkState(el);
      });
  };
  var fromParentNode$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var fromNonDocumentTypeChildNode$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var fromNode$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var fromHTMLElement$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var fromEventTarget$y = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var fromElement$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var fromChildNode$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMediaElement");
  var canPlayType = function (ty) {
      return function (el) {
          return map$4((function () {
              var $8 = fromMaybe$1(Unspecified.value);
              return function ($9) {
                  return $8(parse($9));
              };
          })())(function () {
              return _canPlayType(ty, el);
          });
      };
  };

  function name$5(meta) {
    return function () {
      return meta.name;
    };
  }

  function setName$5(name) {
    return function (meta) {
      return function () {
        meta.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function httpEquiv(meta) {
    return function () {
      return meta.httpEquiv;
    };
  }

  function setHttpEquiv(httpEquiv) {
    return function (meta) {
      return function () {
        meta.httpEquiv = httpEquiv;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function content$1(meta) {
    return function () {
      return meta.content;
    };
  }

  function setContent(content) {
    return function (meta) {
      return function () {
        meta.content = content;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$w = unsafeCoerce;
  var toNonDocumentTypeChildNode$w = unsafeCoerce;
  var toNode$w = unsafeCoerce;
  var toHTMLElement$w = unsafeCoerce;
  var toEventTarget$x = unsafeCoerce;
  var toElement$w = unsafeCoerce;
  var toChildNode$w = unsafeCoerce;
  var fromParentNode$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");
  var fromNonDocumentTypeChildNode$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");
  var fromNode$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");
  var fromHTMLElement$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");
  var fromEventTarget$x = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");
  var fromElement$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");
  var fromChildNode$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMetaElement");

  function value$6(meter) {
    return function () {
      return meter.value;
    };
  }

  function setValue$6(value) {
    return function (meter) {
      return function () {
        meter.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function min(meter) {
    return function () {
      return meter.min;
    };
  }

  function setMin(min) {
    return function (meter) {
      return function () {
        meter.min = min;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function max$1(meter) {
    return function () {
      return meter.max;
    };
  }

  function setMax$1(max) {
    return function (meter) {
      return function () {
        meter.max = max;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function low(meter) {
    return function () {
      return meter.low;
    };
  }

  function setLow(low) {
    return function (meter) {
      return function () {
        meter.low = low;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function high(meter) {
    return function () {
      return meter.high;
    };
  }

  function setHigh(high) {
    return function (meter) {
      return function () {
        meter.high = high;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function optimum(meter) {
    return function () {
      return meter.optimum;
    };
  }

  function setOptimum(optimum) {
    return function (meter) {
      return function () {
        meter.optimum = optimum;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels$4(meter) {
    return function () {
      return meter.labels;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$v = unsafeCoerce;
  var toNonDocumentTypeChildNode$v = unsafeCoerce;
  var toNode$v = unsafeCoerce;
  var toHTMLElement$v = unsafeCoerce;
  var toEventTarget$w = unsafeCoerce;
  var toElement$v = unsafeCoerce;
  var toChildNode$v = unsafeCoerce;
  var fromParentNode$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");
  var fromNonDocumentTypeChildNode$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");
  var fromNode$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");
  var fromHTMLElement$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");
  var fromEventTarget$w = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");
  var fromElement$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");
  var fromChildNode$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLMeterElement");

  function cite$1(mod) {
    return function () {
      return mod.cite;
    };
  }

  function setCite$1(cite) {
    return function (mod) {
      return function () {
        mod.cite = cite;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function dateTime$1(mod) {
    return function () {
      return mod.dateTime;
    };
  }

  function setDateTime$1(dateTime) {
    return function (mod) {
      return function () {
        mod.dateTime = dateTime;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$u = unsafeCoerce;
  var toNonDocumentTypeChildNode$u = unsafeCoerce;
  var toNode$u = unsafeCoerce;
  var toHTMLElement$u = unsafeCoerce;
  var toEventTarget$v = unsafeCoerce;
  var toElement$u = unsafeCoerce;
  var toChildNode$u = unsafeCoerce;
  var fromParentNode$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");
  var fromNonDocumentTypeChildNode$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");
  var fromNode$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");
  var fromHTMLElement$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");
  var fromEventTarget$v = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");
  var fromElement$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");
  var fromChildNode$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLModElement");

  function reversed(ol) {
    return function () {
      return ol.reversed;
    };
  }

  function setReversed(reversed) {
    return function (ol) {
      return function () {
        ol.reversed = reversed;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function start(ol) {
    return function () {
      return ol.start;
    };
  }

  function setStart(start) {
    return function (ol) {
      return function () {
        ol.start = start;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$7(ol) {
    return function () {
      return ol.type;
    };
  }

  function setType$4(type) {
    return function (ol) {
      return function () {
        ol.type = type;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$t = unsafeCoerce;
  var toNonDocumentTypeChildNode$t = unsafeCoerce;
  var toNode$t = unsafeCoerce;
  var toHTMLElement$t = unsafeCoerce;
  var toEventTarget$u = unsafeCoerce;
  var toElement$t = unsafeCoerce;
  var toChildNode$t = unsafeCoerce;
  var fromParentNode$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");
  var fromNonDocumentTypeChildNode$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");
  var fromNode$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");
  var fromHTMLElement$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");
  var fromEventTarget$u = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");
  var fromElement$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");
  var fromChildNode$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOListElement");

  function data_(object) {
    return function () {
      return object.data;
    };
  }

  function setData(data) {
    return function (object) {
      return function () {
        object.data = data;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$6(object) {
    return function () {
      return object.type;
    };
  }

  function setType$3(type) {
    return function (object) {
      return function () {
        object.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function typeMustMatch(object) {
    return function () {
      return object.typeMustMatch;
    };
  }

  // ----------------------------------------------------------------------------

  function name$4(object) {
    return function () {
      return object.name;
    };
  }

  function setName$4(name) {
    return function (object) {
      return function () {
        object.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function useMap(object) {
    return function () {
      return object.useMap;
    };
  }

  function setUseMap(useMap) {
    return function (object) {
      return function () {
        object.useMap = useMap;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$4(object) {
    return function () {
      return object.form;
    };
  }

  // ----------------------------------------------------------------------------

  function width$1(object) {
    return function () {
      return object.width;
    };
  }

  function setWidth$1(width) {
    return function (object) {
      return function () {
        object.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height$1(object) {
    return function () {
      return object.height;
    };
  }

  function setHeight$1(height) {
    return function (object) {
      return function () {
        object.height = height;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _contentDocument(object) {
    return function () {
      return object.contentDocument;
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$3(object) {
    return function () {
      return object.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$3(object) {
    return function () {
      return object.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$3(object) {
    return function () {
      return object.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$3(object) {
    return function () {
      return object.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$3(object) {
    return function () {
      return object.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$3(value) {
    return function (object) {
      return function () {
        object.setCustomValidity(value);
      };
    };
  }

  // Generated by purs version 0.15.15
  var map$3 = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$s = unsafeCoerce;
  var toNonDocumentTypeChildNode$s = unsafeCoerce;
  var toNode$s = unsafeCoerce;
  var toHTMLElement$s = unsafeCoerce;
  var toEventTarget$t = unsafeCoerce;
  var toElement$s = unsafeCoerce;
  var toChildNode$s = unsafeCoerce;
  var fromParentNode$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var fromNonDocumentTypeChildNode$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var fromNode$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var fromHTMLElement$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var fromEventTarget$t = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var fromElement$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var fromChildNode$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLObjectElement");
  var form$4 = /* #__PURE__ */ (function () {
      var $2 = map$3(toMaybe);
      return function ($3) {
          return $2(_form$4($3));
      };
  })();
  var contentDocument = /* #__PURE__ */ (function () {
      var $4 = map$3(toMaybe);
      return function ($5) {
          return $4(_contentDocument($5));
      };
  })();

  function disabled$3(optgroup) {
    return function () {
      return optgroup.disabled;
    };
  }

  function setDisabled$3(disabled) {
    return function (optgroup) {
      return function () {
        optgroup.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function label$2(optgroup) {
    return function () {
      return optgroup.label;
    };
  }

  function setLabel$2(label) {
    return function (optgroup) {
      return function () {
        optgroup.label = label;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$r = unsafeCoerce;
  var toNonDocumentTypeChildNode$r = unsafeCoerce;
  var toNode$r = unsafeCoerce;
  var toHTMLElement$r = unsafeCoerce;
  var toEventTarget$s = unsafeCoerce;
  var toElement$r = unsafeCoerce;
  var toChildNode$r = unsafeCoerce;
  var fromParentNode$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");
  var fromNonDocumentTypeChildNode$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");
  var fromNode$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");
  var fromHTMLElement$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");
  var fromEventTarget$s = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");
  var fromElement$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");
  var fromChildNode$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptGroupElement");

  function disabled$2(option) {
    return function () {
      return option.disabled;
    };
  }

  function setDisabled$2(disabled) {
    return function (option) {
      return function () {
        option.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$3(option) {
    return function () {
      return option.form;
    };
  }

  // ----------------------------------------------------------------------------

  function label$1(option) {
    return function () {
      return option.label;
    };
  }

  function setLabel$1(label) {
    return function (option) {
      return function () {
        option.label = label;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function defaultSelected(option) {
    return function () {
      return option.defaultSelected;
    };
  }

  function setDefaultSelected(defaultSelected) {
    return function (option) {
      return function () {
        option.defaultSelected = defaultSelected;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function selected(option) {
    return function () {
      return option.selected;
    };
  }

  function setSelected(selected) {
    return function (option) {
      return function () {
        option.selected = selected;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value$5(option) {
    return function () {
      return option.value;
    };
  }

  function setValue$5(value) {
    return function (option) {
      return function () {
        option.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function text$2(option) {
    return function () {
      return option.text;
    };
  }

  function setText$2(text) {
    return function (option) {
      return function () {
        option.text = text;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function index(option) {
    return function () {
      return option.index;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$q = unsafeCoerce;
  var toNonDocumentTypeChildNode$q = unsafeCoerce;
  var toNode$q = unsafeCoerce;
  var toHTMLElement$q = unsafeCoerce;
  var toEventTarget$r = unsafeCoerce;
  var toElement$q = unsafeCoerce;
  var toChildNode$q = unsafeCoerce;
  var fromParentNode$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var fromNonDocumentTypeChildNode$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var fromNode$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var fromHTMLElement$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var fromEventTarget$r = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var fromElement$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var fromChildNode$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOptionElement");
  var form$3 = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$3($3));
      };
  })();

  function _form$2(output) {
    return function () {
      return output.form;
    };
  }

  // ----------------------------------------------------------------------------

  function name$3(output) {
    return function () {
      return output.name;
    };
  }

  function setName$3(name) {
    return function (output) {
      return function () {
        output.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$5(output) {
    return function () {
      return output.type;
    };
  }

  // ----------------------------------------------------------------------------

  function defaultValue$1(output) {
    return function () {
      return output.defaultValue;
    };
  }

  function setDefaultValue$1(defaultValue) {
    return function (output) {
      return function () {
        output.defaultValue = defaultValue;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value$4(output) {
    return function () {
      return output.value;
    };
  }

  function setValue$4(value) {
    return function (output) {
      return function () {
        output.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$2(output) {
    return function () {
      return output.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$2(output) {
    return function () {
      return output.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$2(output) {
    return function () {
      return output.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$2(output) {
    return function () {
      return output.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$2(output) {
    return function () {
      return output.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$2(value) {
    return function (output) {
      return function () {
        output.setCustomValidity(value);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels$3(output) {
    return function () {
      return output.labels;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$p = unsafeCoerce;
  var toNonDocumentTypeChildNode$p = unsafeCoerce;
  var toNode$p = unsafeCoerce;
  var toHTMLElement$p = unsafeCoerce;
  var toEventTarget$q = unsafeCoerce;
  var toElement$p = unsafeCoerce;
  var toChildNode$p = unsafeCoerce;
  var fromParentNode$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var fromNonDocumentTypeChildNode$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var fromNode$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var fromHTMLElement$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var fromEventTarget$q = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var fromElement$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var fromChildNode$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLOutputElement");
  var form$2 = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$2($3));
      };
  })();

  // Generated by purs version 0.15.15
  var toParentNode$o = unsafeCoerce;
  var toNonDocumentTypeChildNode$o = unsafeCoerce;
  var toNode$o = unsafeCoerce;
  var toHTMLElement$o = unsafeCoerce;
  var toEventTarget$p = unsafeCoerce;
  var toElement$o = unsafeCoerce;
  var toChildNode$o = unsafeCoerce;
  var fromParentNode$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");
  var fromNonDocumentTypeChildNode$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");
  var fromNode$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");
  var fromHTMLElement$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");
  var fromEventTarget$p = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");
  var fromElement$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");
  var fromChildNode$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParagraphElement");

  function name$2(param) {
    return function () {
      return param.name;
    };
  }

  function setName$2(name) {
    return function (param) {
      return function () {
        param.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value$3(param) {
    return function () {
      return param.value;
    };
  }

  function setValue$3(value) {
    return function (param) {
      return function () {
        param.value = value;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$n = unsafeCoerce;
  var toNonDocumentTypeChildNode$n = unsafeCoerce;
  var toNode$n = unsafeCoerce;
  var toHTMLElement$n = unsafeCoerce;
  var toEventTarget$o = unsafeCoerce;
  var toElement$n = unsafeCoerce;
  var toChildNode$n = unsafeCoerce;
  var fromParentNode$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");
  var fromNonDocumentTypeChildNode$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");
  var fromNode$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");
  var fromHTMLElement$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");
  var fromEventTarget$o = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");
  var fromElement$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");
  var fromChildNode$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLParamElement");

  // Generated by purs version 0.15.15
  var toParentNode$m = unsafeCoerce;
  var toNonDocumentTypeChildNode$m = unsafeCoerce;
  var toNode$m = unsafeCoerce;
  var toHTMLElement$m = unsafeCoerce;
  var toEventTarget$n = unsafeCoerce;
  var toElement$m = unsafeCoerce;
  var toChildNode$m = unsafeCoerce;
  var fromParentNode$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");
  var fromNonDocumentTypeChildNode$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");
  var fromNode$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");
  var fromHTMLElement$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");
  var fromEventTarget$n = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");
  var fromElement$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");
  var fromChildNode$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLPreElement");

  function value$2(progress) {
    return function () {
      return progress.value;
    };
  }

  function setValue$2(value) {
    return function (progress) {
      return function () {
        progress.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function max(progress) {
    return function () {
      return progress.max;
    };
  }

  function setMax(max) {
    return function (progress) {
      return function () {
        progress.max = max;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function position(progress) {
    return function () {
      return progress.position;
    };
  }

  // ----------------------------------------------------------------------------

  function labels$2(progress) {
    return function () {
      return progress.labels;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$l = unsafeCoerce;
  var toNonDocumentTypeChildNode$l = unsafeCoerce;
  var toNode$l = unsafeCoerce;
  var toHTMLElement$l = unsafeCoerce;
  var toEventTarget$m = unsafeCoerce;
  var toElement$l = unsafeCoerce;
  var toChildNode$l = unsafeCoerce;
  var fromParentNode$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");
  var fromNonDocumentTypeChildNode$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");
  var fromNode$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");
  var fromHTMLElement$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");
  var fromEventTarget$m = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");
  var fromElement$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");
  var fromChildNode$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLProgressElement");

  function cite(quote) {
    return function () {
      return quote.cite;
    };
  }

  function setCite(cite) {
    return function (quote) {
      return function () {
        quote.cite = cite;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$k = unsafeCoerce;
  var toNonDocumentTypeChildNode$k = unsafeCoerce;
  var toNode$k = unsafeCoerce;
  var toHTMLElement$k = unsafeCoerce;
  var toEventTarget$l = unsafeCoerce;
  var toElement$k = unsafeCoerce;
  var toChildNode$k = unsafeCoerce;
  var fromParentNode$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");
  var fromNonDocumentTypeChildNode$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");
  var fromNode$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");
  var fromHTMLElement$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");
  var fromEventTarget$l = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");
  var fromElement$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");
  var fromChildNode$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLQuoteElement");

  function src$2(script) {
    return function () {
      return script.src;
    };
  }

  function setSrc$2(src) {
    return function (script) {
      return function () {
        script.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$4(script) {
    return function () {
      return script.type;
    };
  }

  function setType$2(type) {
    return function (script) {
      return function () {
        script.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function charset(script) {
    return function () {
      return script.charset;
    };
  }

  function setCharset(charset) {
    return function (script) {
      return function () {
        script.charset = charset;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function async(script) {
    return function () {
      return script.async;
    };
  }

  function setAsync(async) {
    return function (script) {
      return function () {
        script.async = async;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function defer(script) {
    return function () {
      return script.defer;
    };
  }

  function setDefer(defer) {
    return function (script) {
      return function () {
        script.defer = defer;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function crossOrigin(script) {
    return function () {
      return script.crossOrigin;
    };
  }

  function setCrossOrigin(crossOrigin) {
    return function (script) {
      return function () {
        script.crossOrigin = crossOrigin;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function text$1(script) {
    return function () {
      return script.text;
    };
  }

  function setText$1(text) {
    return function (script) {
      return function () {
        script.text = text;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$j = unsafeCoerce;
  var toNonDocumentTypeChildNode$j = unsafeCoerce;
  var toNode$j = unsafeCoerce;
  var toHTMLElement$j = unsafeCoerce;
  var toEventTarget$k = unsafeCoerce;
  var toElement$j = unsafeCoerce;
  var toChildNode$j = unsafeCoerce;
  var fromParentNode$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");
  var fromNonDocumentTypeChildNode$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");
  var fromNode$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");
  var fromHTMLElement$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");
  var fromEventTarget$k = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");
  var fromElement$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");
  var fromChildNode$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLScriptElement");

  function autofocus$1(select) {
    return function () {
      return select.autofocus;
    };
  }

  function setAutofocus$1(autofocus) {
    return function (select) {
      return function () {
        select.autofocus = autofocus;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function disabled$1(select) {
    return function () {
      return select.disabled;
    };
  }

  function setDisabled$1(disabled) {
    return function (select) {
      return function () {
        select.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function multiple(select) {
    return function () {
      return select.multiple;
    };
  }

  function setMultiple(multiple) {
    return function (select) {
      return function () {
        select.multiple = multiple;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form$1(select) {
    return function () {
      return select.form;
    };
  }

  // ----------------------------------------------------------------------------

  function name$1(select) {
    return function () {
      return select.name;
    };
  }

  function setName$1(name) {
    return function (select) {
      return function () {
        select.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function required$1(select) {
    return function () {
      return select.required;
    };
  }

  function setRequired$1(required) {
    return function (select) {
      return function () {
        select.required = required;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function size(select) {
    return function () {
      return select.size;
    };
  }

  function setSize(size) {
    return function (select) {
      return function () {
        select.size = size;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$3(select) {
    return function () {
      return select.type;
    };
  }

  // ----------------------------------------------------------------------------

  function length(select) {
    return function () {
      return select.length;
    };
  }

  function setLength(length) {
    return function (select) {
      return function () {
        select.length = length;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function selectedOptions(select) {
    return function () {
      return select.selectedOptions;
    };
  }

  // ----------------------------------------------------------------------------

  function selectedIndex(select) {
    return function () {
      return select.selectedIndex;
    };
  }

  function setSelectedIndex(selectedIndex) {
    return function (select) {
      return function () {
        select.selectedIndex = selectedIndex;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value$1(select) {
    return function () {
      return select.value;
    };
  }

  function setValue$1(value) {
    return function (select) {
      return function () {
        select.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate$1(select) {
    return function () {
      return select.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity$1(select) {
    return function () {
      return select.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage$1(select) {
    return function () {
      return select.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity$1(select) {
    return function () {
      return select.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity$1(select) {
    return function () {
      return select.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity$1(value) {
    return function (select) {
      return function () {
        select.setCustomValidity(value);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels$1(select) {
    return function () {
      return select.labels;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$i = unsafeCoerce;
  var toNonDocumentTypeChildNode$i = unsafeCoerce;
  var toNode$i = unsafeCoerce;
  var toHTMLElement$i = unsafeCoerce;
  var toEventTarget$j = unsafeCoerce;
  var toElement$i = unsafeCoerce;
  var toChildNode$i = unsafeCoerce;
  var fromParentNode$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var fromNonDocumentTypeChildNode$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var fromNode$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var fromHTMLElement$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var fromEventTarget$j = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var fromElement$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var fromChildNode$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSelectElement");
  var form$1 = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form$1($3));
      };
  })();

  function src$1(source) {
    return function () {
      return source.src;
    };
  }

  function setSrc$1(src) {
    return function (source) {
      return function () {
        source.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$2(source) {
    return function () {
      return source.type;
    };
  }

  function setType$1(type) {
    return function (source) {
      return function () {
        source.type = type;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function media$1(source) {
    return function () {
      return source.media;
    };
  }

  function setMedia$1(media) {
    return function (source) {
      return function () {
        source.media = media;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$h = unsafeCoerce;
  var toNonDocumentTypeChildNode$h = unsafeCoerce;
  var toNode$h = unsafeCoerce;
  var toHTMLElement$h = unsafeCoerce;
  var toEventTarget$i = unsafeCoerce;
  var toElement$h = unsafeCoerce;
  var toChildNode$h = unsafeCoerce;
  var fromParentNode$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");
  var fromNonDocumentTypeChildNode$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");
  var fromNode$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");
  var fromHTMLElement$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");
  var fromEventTarget$i = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");
  var fromElement$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");
  var fromChildNode$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSourceElement");

  // Generated by purs version 0.15.15
  var toParentNode$g = unsafeCoerce;
  var toNonDocumentTypeChildNode$g = unsafeCoerce;
  var toNode$g = unsafeCoerce;
  var toHTMLElement$g = unsafeCoerce;
  var toEventTarget$h = unsafeCoerce;
  var toElement$g = unsafeCoerce;
  var toChildNode$g = unsafeCoerce;
  var fromParentNode$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");
  var fromNonDocumentTypeChildNode$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");
  var fromNode$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");
  var fromHTMLElement$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");
  var fromEventTarget$h = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");
  var fromElement$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");
  var fromChildNode$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLSpanElement");

  function media(style) {
    return function () {
      return style.media;
    };
  }

  function setMedia(media) {
    return function (style) {
      return function () {
        style.media = media;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_$1(style) {
    return function () {
      return style.type;
    };
  }

  function setType(type) {
    return function (style) {
      return function () {
        style.type = type;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$f = unsafeCoerce;
  var toNonDocumentTypeChildNode$f = unsafeCoerce;
  var toNode$f = unsafeCoerce;
  var toHTMLElement$f = unsafeCoerce;
  var toEventTarget$g = unsafeCoerce;
  var toElement$f = unsafeCoerce;
  var toChildNode$f = unsafeCoerce;
  var fromParentNode$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");
  var fromNonDocumentTypeChildNode$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");
  var fromNode$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");
  var fromHTMLElement$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");
  var fromEventTarget$g = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");
  var fromElement$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");
  var fromChildNode$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLStyleElement");

  // Generated by purs version 0.15.15
  var toParentNode$e = unsafeCoerce;
  var toNonDocumentTypeChildNode$e = unsafeCoerce;
  var toNode$e = unsafeCoerce;
  var toHTMLElement$e = unsafeCoerce;
  var toEventTarget$f = unsafeCoerce;
  var toElement$e = unsafeCoerce;
  var toChildNode$e = unsafeCoerce;
  var fromParentNode$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");
  var fromNonDocumentTypeChildNode$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");
  var fromNode$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");
  var fromHTMLElement$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");
  var fromEventTarget$f = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");
  var fromElement$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");
  var fromChildNode$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCaptionElement");

  function colSpan(cell) {
    return function () {
      return cell.colSpan;
    };
  }

  function setColSpan(colSpan) {
    return function (cell) {
      return function () {
        cell.colSpan = colSpan;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rowSpan(cell) {
    return function () {
      return cell.rowSpan;
    };
  }

  function setRowSpan(rowSpan) {
    return function (cell) {
      return function () {
        cell.rowSpan = rowSpan;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function cellIndex(cell) {
    return function () {
      return cell.cellIndex;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$d = unsafeCoerce;
  var toNonDocumentTypeChildNode$d = unsafeCoerce;
  var toNode$d = unsafeCoerce;
  var toHTMLElement$d = unsafeCoerce;
  var toEventTarget$e = unsafeCoerce;
  var toElement$d = unsafeCoerce;
  var toChildNode$d = unsafeCoerce;
  var fromParentNode$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");
  var fromNonDocumentTypeChildNode$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");
  var fromNode$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");
  var fromHTMLElement$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");
  var fromEventTarget$e = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");
  var fromElement$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");
  var fromChildNode$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableCellElement");

  function span(col) {
    return function () {
      return col.span;
    };
  }

  function setSpan(span) {
    return function (col) {
      return function () {
        col.span = span;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$c = unsafeCoerce;
  var toNonDocumentTypeChildNode$c = unsafeCoerce;
  var toNode$c = unsafeCoerce;
  var toHTMLElement$c = unsafeCoerce;
  var toEventTarget$d = unsafeCoerce;
  var toElement$c = unsafeCoerce;
  var toChildNode$c = unsafeCoerce;
  var fromParentNode$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");
  var fromNonDocumentTypeChildNode$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");
  var fromNode$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");
  var fromHTMLElement$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");
  var fromEventTarget$d = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");
  var fromElement$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");
  var fromChildNode$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableColElement");

  // Generated by purs version 0.15.15
  var toParentNode$b = unsafeCoerce;
  var toNonDocumentTypeChildNode$b = unsafeCoerce;
  var toNode$b = unsafeCoerce;
  var toHTMLTableCellElement$1 = unsafeCoerce;
  var toHTMLElement$b = unsafeCoerce;
  var toEventTarget$c = unsafeCoerce;
  var toElement$b = unsafeCoerce;
  var toChildNode$b = unsafeCoerce;
  var fromParentNode$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromNonDocumentTypeChildNode$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromNode$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromHTMLTableCellElement$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromHTMLElement$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromEventTarget$c = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromElement$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");
  var fromChildNode$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableDataCellElement");

  function _caption(table) {
    return function () {
      return table.caption;
    };
  }

  function _setCaption(caption) {
    return function (table) {
      return function () {
        table.caption = caption;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function createCaption(table) {
    return function () {
      return table.createCaption();
    };
  }

  // ----------------------------------------------------------------------------

  function deleteCaption(table) {
    return function () {
      table.deleteCaption();
    };
  }

  // ----------------------------------------------------------------------------

  function _tHead(table) {
    return function () {
      return table.tHead;
    };
  }

  function _setTHead(tHead) {
    return function (table) {
      return function () {
        table.tHead = tHead;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function createTHead(table) {
    return function () {
      return table.createTHead();
    };
  }

  // ----------------------------------------------------------------------------

  function deleteTHead(table) {
    return function () {
      table.deleteTHead();
    };
  }

  // ----------------------------------------------------------------------------

  function _tFoot(table) {
    return function () {
      return table.tFoot;
    };
  }

  function _setTFoot(tFoot) {
    return function (table) {
      return function () {
        table.tFoot = tFoot;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function createTFoot(table) {
    return function () {
      return table.createTFoot();
    };
  }

  // ----------------------------------------------------------------------------

  function deleteTFoot(table) {
    return function () {
      table.deleteTFoot();
    };
  }

  // ----------------------------------------------------------------------------

  function tBodies(table) {
    return function () {
      return table.tBodies;
    };
  }

  // ----------------------------------------------------------------------------

  function createTBody(table) {
    return function () {
      return table.createTBody();
    };
  }

  // ----------------------------------------------------------------------------

  function rows$2(table) {
    return function () {
      return table.rows;
    };
  }

  // ----------------------------------------------------------------------------

  function insertRowAt$1(index) {
    return function (table) {
      return function () {
        return table.insertRow(index);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function deleteRow$1(index) {
    return function (table) {
      return function () {
        table.deleteRow(index);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function border(table) {
    return function () {
      return table.border;
    };
  }

  function setBorder(border) {
    return function (table) {
      return function () {
        table.border = border;
      };
    };
  }

  // Generated by purs version 0.15.15
  var map$2 = /* #__PURE__ */ map$o(functorEffect);
  var toParentNode$a = unsafeCoerce;
  var toNonDocumentTypeChildNode$a = unsafeCoerce;
  var toNode$a = unsafeCoerce;
  var toHTMLElement$a = unsafeCoerce;
  var toEventTarget$b = unsafeCoerce;
  var toElement$a = unsafeCoerce;
  var toChildNode$a = unsafeCoerce;
  var tHead = /* #__PURE__ */ (function () {
      var $3 = map$2(toMaybe);
      return function ($4) {
          return $3(_tHead($4));
      };
  })();
  var tFoot = /* #__PURE__ */ (function () {
      var $5 = map$2(toMaybe);
      return function ($6) {
          return $5(_tFoot($6));
      };
  })();
  var setTHead = function ($7) {
      return _setTHead(toNullable($7));
  };
  var setTFoot = function ($8) {
      return _setTFoot(toNullable($8));
  };
  var setCaption = function ($9) {
      return _setCaption(toNullable($9));
  };
  var insertRow$prime$1 = insertRowAt$1;
  var insertRow$1 = /* #__PURE__ */ (function () {
      return insertRow$prime$1(-1 | 0);
  })();
  var fromParentNode$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var fromNonDocumentTypeChildNode$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var fromNode$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var fromHTMLElement$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var fromEventTarget$b = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var fromElement$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var fromChildNode$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableElement");
  var caption = /* #__PURE__ */ (function () {
      var $10 = map$2(toMaybe);
      return function ($11) {
          return $10(_caption($11));
      };
  })();

  function scope(cell) {
    return function () {
      return cell.scope;
    };
  }

  function setScope(scope) {
    return function (cell) {
      return function () {
        cell.scope = scope;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function abbr(cell) {
    return function () {
      return cell.abbr;
    };
  }

  function setAbbr(abbr) {
    return function (cell) {
      return function () {
        cell.abbr = abbr;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$9 = unsafeCoerce;
  var toNonDocumentTypeChildNode$9 = unsafeCoerce;
  var toNode$9 = unsafeCoerce;
  var toHTMLTableCellElement = unsafeCoerce;
  var toHTMLElement$9 = unsafeCoerce;
  var toEventTarget$a = unsafeCoerce;
  var toElement$9 = unsafeCoerce;
  var toChildNode$9 = unsafeCoerce;
  var fromParentNode$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromNonDocumentTypeChildNode$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromNode$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromHTMLTableCellElement = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromHTMLElement$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromEventTarget$a = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromElement$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");
  var fromChildNode$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableHeaderCellElement");

  function rowIndex(row) {
    return function () {
      return row.rowIndex;
    };
  }

  // ----------------------------------------------------------------------------

  function sectionRowIndex(row) {
    return function () {
      return row.sectionRowIndex;
    };
  }

  // ----------------------------------------------------------------------------

  function cells(row) {
    return function () {
      return row.cells;
    };
  }

  // ----------------------------------------------------------------------------

  function insertCellAt(index) {
    return function (row) {
      return function () {
        return row.insertCell(index);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function deleteCell(index) {
    return function (row) {
      return function () {
        row.deleteCell(index);
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$8 = unsafeCoerce;
  var toNonDocumentTypeChildNode$8 = unsafeCoerce;
  var toNode$8 = unsafeCoerce;
  var toHTMLElement$8 = unsafeCoerce;
  var toEventTarget$9 = unsafeCoerce;
  var toElement$8 = unsafeCoerce;
  var toChildNode$8 = unsafeCoerce;
  var insertCell$prime = insertCellAt;
  var insertCell = /* #__PURE__ */ (function () {
      return insertCell$prime(-1 | 0);
  })();
  var fromParentNode$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");
  var fromNonDocumentTypeChildNode$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");
  var fromNode$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");
  var fromHTMLElement$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");
  var fromEventTarget$9 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");
  var fromElement$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");
  var fromChildNode$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableRowElement");

  function rows$1(section) {
    return function () {
      return section.rows;
    };
  }

  // ----------------------------------------------------------------------------

  function insertRowAt(index) {
    return function (section) {
      return function () {
        return section.insertRow(index);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function deleteRow(index) {
    return function (section) {
      return function () {
        section.deleteRow(index);
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$7 = unsafeCoerce;
  var toNonDocumentTypeChildNode$7 = unsafeCoerce;
  var toNode$7 = unsafeCoerce;
  var toHTMLElement$7 = unsafeCoerce;
  var toEventTarget$8 = unsafeCoerce;
  var toElement$7 = unsafeCoerce;
  var toChildNode$7 = unsafeCoerce;
  var insertRow$prime = insertRowAt;
  var insertRow = /* #__PURE__ */ (function () {
      return insertRow$prime(-1 | 0);
  })();
  var fromParentNode$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");
  var fromNonDocumentTypeChildNode$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");
  var fromNode$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");
  var fromHTMLElement$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");
  var fromEventTarget$8 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");
  var fromElement$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");
  var fromChildNode$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTableSectionElement");

  function content(template) {
    return function () {
      return template.content;
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$6 = unsafeCoerce;
  var toNonDocumentTypeChildNode$6 = unsafeCoerce;
  var toNode$6 = unsafeCoerce;
  var toHTMLElement$6 = unsafeCoerce;
  var toEventTarget$7 = unsafeCoerce;
  var toElement$6 = unsafeCoerce;
  var toChildNode$6 = unsafeCoerce;
  var fromParentNode$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");
  var fromNonDocumentTypeChildNode$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");
  var fromNode$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");
  var fromHTMLElement$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");
  var fromEventTarget$7 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");
  var fromElement$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");
  var fromChildNode$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTemplateElement");

  function autocomplete(textarea) {
    return function () {
      return textarea.autocomplete;
    };
  }

  function setAutocomplete(autocomplete) {
    return function (textarea) {
      return function () {
        textarea.autocomplete = autocomplete;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function autofocus(textarea) {
    return function () {
      return textarea.autofocus;
    };
  }

  function setAutofocus(autofocus) {
    return function (textarea) {
      return function () {
        textarea.autofocus = autofocus;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function cols(textarea) {
    return function () {
      return textarea.cols;
    };
  }

  function setCols(cols) {
    return function (textarea) {
      return function () {
        textarea.cols = cols;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function dirName(textarea) {
    return function () {
      return textarea.dirName;
    };
  }

  function setDirName(dirName) {
    return function (textarea) {
      return function () {
        textarea.dirName = dirName;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function disabled(textarea) {
    return function () {
      return textarea.disabled;
    };
  }

  function setDisabled(disabled) {
    return function (textarea) {
      return function () {
        textarea.disabled = disabled;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _form(textarea) {
    return function () {
      return textarea.form;
    };
  }

  // ----------------------------------------------------------------------------

  function maxLength(textarea) {
    return function () {
      return textarea.maxLength;
    };
  }

  function setMaxLength(maxLength) {
    return function (textarea) {
      return function () {
        textarea.maxLength = maxLength;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function minLength(textarea) {
    return function () {
      return textarea.minLength;
    };
  }

  function setMinLength(minLength) {
    return function (textarea) {
      return function () {
        textarea.minLength = minLength;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function name(textarea) {
    return function () {
      return textarea.name;
    };
  }

  function setName(name) {
    return function (textarea) {
      return function () {
        textarea.name = name;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function placeholder(textarea) {
    return function () {
      return textarea.placeholder;
    };
  }

  function setPlaceholder(placeholder) {
    return function (textarea) {
      return function () {
        textarea.placeholder = placeholder;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function readOnly(textarea) {
    return function () {
      return textarea.readOnly;
    };
  }

  function setReadOnly(readOnly) {
    return function (textarea) {
      return function () {
        textarea.readOnly = readOnly;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function required(textarea) {
    return function () {
      return textarea.required;
    };
  }

  function setRequired(required) {
    return function (textarea) {
      return function () {
        textarea.required = required;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function rows(textarea) {
    return function () {
      return textarea.rows;
    };
  }

  function setRows(rows) {
    return function (textarea) {
      return function () {
        textarea.rows = rows;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function wrap(textarea) {
    return function () {
      return textarea.wrap;
    };
  }

  function setWrap(wrap) {
    return function (textarea) {
      return function () {
        textarea.wrap = wrap;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function type_(textarea) {
    return function () {
      return textarea.type;
    };
  }

  // ----------------------------------------------------------------------------

  function defaultValue(textarea) {
    return function () {
      return textarea.defaultValue;
    };
  }

  function setDefaultValue(defaultValue) {
    return function (textarea) {
      return function () {
        textarea.defaultValue = defaultValue;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function value(textarea) {
    return function () {
      return textarea.value;
    };
  }

  function setValue(value) {
    return function (textarea) {
      return function () {
        textarea.value = value;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function textLength(textarea) {
    return function () {
      return textarea.textLength;
    };
  }

  // ----------------------------------------------------------------------------

  function willValidate(textarea) {
    return function () {
      return textarea.willValidate;
    };
  }

  // ----------------------------------------------------------------------------

  function validity(textarea) {
    return function () {
      return textarea.validity;
    };
  }

  // ----------------------------------------------------------------------------

  function validationMessage(textarea) {
    return function () {
      return textarea.validationMessage;
    };
  }

  // ----------------------------------------------------------------------------

  function checkValidity(textarea) {
    return function () {
      return textarea.checkValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function reportValidity(textarea) {
    return function () {
      return textarea.reportValidity();
    };
  }

  // ----------------------------------------------------------------------------

  function setCustomValidity(value) {
    return function (textarea) {
      return function () {
        textarea.setCustomValidity(value);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function labels(textarea) {
    return function () {
      return textarea.labels;
    };
  }

  // ----------------------------------------------------------------------------

  function select(textarea) {
    return function () {
      textarea.select();
    };
  }

  // ----------------------------------------------------------------------------

  function selectionStart(textarea) {
    return function () {
      return textarea.selectionStart;
    };
  }

  function setSelectionStart(selectionStart) {
    return function (textarea) {
      return function () {
        textarea.selectionStart = selectionStart;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function selectionEnd(textarea) {
    return function () {
      return textarea.selectionEnd;
    };
  }

  function setSelectionEnd(selectionEnd) {
    return function (textarea) {
      return function () {
        textarea.selectionEnd = selectionEnd;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function selectionDirection(textarea) {
    return function () {
      return textarea.selectionDirection;
    };
  }

  function setSelectionDirection(selectionDirection) {
    return function (textarea) {
      return function () {
        textarea.selectionDirection = selectionDirection;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function setRangeText(replacement) {
    return function (textarea) {
      return function () {
        textarea.setRangeText(replacement);
      };
    };
  }

  function _setRangeText(replacement, start, end, selectionMode, textarea) {
    textarea.setRangeText(replacement, start, end, selectionMode);
  }

  // ----------------------------------------------------------------------------

  function setSelectionRange(start) {
    return function (end) {
      return function (direction) {
        return function (textarea) {
          return function () {
            textarea.setSelectionRange(start, end, direction);
          };
        };
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$5 = unsafeCoerce;
  var toNonDocumentTypeChildNode$5 = unsafeCoerce;
  var toNode$5 = unsafeCoerce;
  var toHTMLElement$5 = unsafeCoerce;
  var toEventTarget$6 = unsafeCoerce;
  var toElement$5 = unsafeCoerce;
  var toChildNode$5 = unsafeCoerce;
  var setRangeText$prime = function (rpl) {
      return function (s) {
          return function (e) {
              return function (mode) {
                  return function (area) {
                      return function () {
                          return _setRangeText(rpl, s, e, print$2(mode), area);
                      };
                  };
              };
          };
      };
  };
  var fromParentNode$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var fromNonDocumentTypeChildNode$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var fromNode$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var fromHTMLElement$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var fromEventTarget$6 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var fromElement$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var fromChildNode$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTextAreaElement");
  var form = /* #__PURE__ */ (function () {
      var $2 = map$o(functorEffect)(toMaybe);
      return function ($3) {
          return $2(_form($3));
      };
  })();

  function dateTime(time) {
    return function () {
      return time.dateTime;
    };
  }

  function setDateTime(dateTime) {
    return function (time) {
      return function () {
        time.dateTime = dateTime;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$4 = unsafeCoerce;
  var toNonDocumentTypeChildNode$4 = unsafeCoerce;
  var toNode$4 = unsafeCoerce;
  var toHTMLElement$4 = unsafeCoerce;
  var toEventTarget$5 = unsafeCoerce;
  var toElement$4 = unsafeCoerce;
  var toChildNode$4 = unsafeCoerce;
  var fromParentNode$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");
  var fromNonDocumentTypeChildNode$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");
  var fromNode$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");
  var fromHTMLElement$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");
  var fromEventTarget$5 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");
  var fromElement$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");
  var fromChildNode$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTimeElement");

  function text(title) {
    return function () {
      return title.text;
    };
  }

  function setText(text) {
    return function (title) {
      return function () {
        title.text = text;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode$3 = unsafeCoerce;
  var toNonDocumentTypeChildNode$3 = unsafeCoerce;
  var toNode$3 = unsafeCoerce;
  var toHTMLElement$3 = unsafeCoerce;
  var toEventTarget$4 = unsafeCoerce;
  var toElement$3 = unsafeCoerce;
  var toChildNode$3 = unsafeCoerce;
  var fromParentNode$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");
  var fromNonDocumentTypeChildNode$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");
  var fromNode$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");
  var fromHTMLElement$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");
  var fromEventTarget$4 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");
  var fromElement$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");
  var fromChildNode$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTitleElement");

  function kind(track) {
    return function () {
      return track.kind;
    };
  }

  function setKind(kind) {
    return function (track) {
      return function () {
        track.kind = kind;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function src(track) {
    return function () {
      return track.src;
    };
  }

  function setSrc(src) {
    return function (track) {
      return function () {
        track.src = src;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function srclang(track) {
    return function () {
      return track.srclang;
    };
  }

  function setSrclang(srclang) {
    return function (track) {
      return function () {
        track.srclang = srclang;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function label(track) {
    return function () {
      return track.label;
    };
  }

  function setLabel(label) {
    return function (track) {
      return function () {
        track.label = label;
      };
    };
  }

  // ----------------------------------------------------------------------------

  const defaultImpl = function (track) {
    return function () {
      return track["default"];
    };
  };

  function setDefault(def) {
    return function (track) {
      return function () {
        track["default"] = def;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function _readyState(track) {
    return track.readyState;
  }

  // Generated by purs version 0.15.15
  var None = /* #__PURE__ */ (function () {
      function None() {

      };
      None.value = new None();
      return None;
  })();
  var Loading = /* #__PURE__ */ (function () {
      function Loading() {

      };
      Loading.value = new Loading();
      return Loading;
  })();
  var Loaded = /* #__PURE__ */ (function () {
      function Loaded() {

      };
      Loaded.value = new Loaded();
      return Loaded;
  })();
  var $$Error = /* #__PURE__ */ (function () {
      function $$Error() {

      };
      $$Error.value = new $$Error();
      return $$Error;
  })();
  var toEnumReadyState = function (v) {
      if (v === 0) {
          return new Just(None.value);
      };
      if (v === 1) {
          return new Just(Loading.value);
      };
      if (v === 2) {
          return new Just(Loaded.value);
      };
      if (v === 3) {
          return new Just($$Error.value);
      };
      return Nothing.value;
  };
  var showReadyState = {
      show: function (v) {
          if (v instanceof None) {
              return "None";
          };
          if (v instanceof Loading) {
              return "Loading";
          };
          if (v instanceof Loaded) {
              return "Loaded";
          };
          if (v instanceof $$Error) {
              return "Error";
          };
          throw new Error("Failed pattern match at Web.HTML.HTMLTrackElement.ReadyState (line 30, column 1 - line 34, column 23): " + [ v.constructor.name ]);
      }
  };
  var fromEnumReadyState = function (v) {
      if (v instanceof None) {
          return 0;
      };
      if (v instanceof Loading) {
          return 1;
      };
      if (v instanceof Loaded) {
          return 2;
      };
      if (v instanceof $$Error) {
          return 3;
      };
      throw new Error("Failed pattern match at Web.HTML.HTMLTrackElement.ReadyState (line 47, column 3 - line 51, column 15): " + [ v.constructor.name ]);
  };
  var eqReadyState = {
      eq: function (x) {
          return function (y) {
              if (x instanceof None && y instanceof None) {
                  return true;
              };
              if (x instanceof Loading && y instanceof Loading) {
                  return true;
              };
              if (x instanceof Loaded && y instanceof Loaded) {
                  return true;
              };
              if (x instanceof $$Error && y instanceof $$Error) {
                  return true;
              };
              return false;
          };
      }
  };
  var ordReadyState = {
      compare: function (x) {
          return function (y) {
              if (x instanceof None && y instanceof None) {
                  return EQ.value;
              };
              if (x instanceof None) {
                  return LT.value;
              };
              if (y instanceof None) {
                  return GT.value;
              };
              if (x instanceof Loading && y instanceof Loading) {
                  return EQ.value;
              };
              if (x instanceof Loading) {
                  return LT.value;
              };
              if (y instanceof Loading) {
                  return GT.value;
              };
              if (x instanceof Loaded && y instanceof Loaded) {
                  return EQ.value;
              };
              if (x instanceof Loaded) {
                  return LT.value;
              };
              if (y instanceof Loaded) {
                  return GT.value;
              };
              if (x instanceof $$Error && y instanceof $$Error) {
                  return EQ.value;
              };
              throw new Error("Failed pattern match at Web.HTML.HTMLTrackElement.ReadyState (line 0, column 0 - line 0, column 0): " + [ x.constructor.name, y.constructor.name ]);
          };
      },
      Eq0: function () {
          return eqReadyState;
      }
  };
  var enumReadyState = {
      succ: /* #__PURE__ */ defaultSucc(toEnumReadyState)(fromEnumReadyState),
      pred: /* #__PURE__ */ defaultPred(toEnumReadyState)(fromEnumReadyState),
      Ord0: function () {
          return ordReadyState;
      }
  };
  var boundedReadyState = /* #__PURE__ */ (function () {
      return {
          bottom: None.value,
          top: $$Error.value,
          Ord0: function () {
              return ordReadyState;
          }
      };
  })();
  var boundedEnumReadyState = {
      cardinality: 4,
      toEnum: toEnumReadyState,
      fromEnum: fromEnumReadyState,
      Bounded0: function () {
          return boundedReadyState;
      },
      Enum1: function () {
          return enumReadyState;
      }
  };

  // Generated by purs version 0.15.15
  var map$1 = /* #__PURE__ */ map$o(functorEffect);
  var toEnum = /* #__PURE__ */ toEnum$2(boundedEnumReadyState);
  var toParentNode$2 = unsafeCoerce;
  var toNonDocumentTypeChildNode$2 = unsafeCoerce;
  var toNode$2 = unsafeCoerce;
  var toHTMLElement$2 = unsafeCoerce;
  var toEventTarget$3 = unsafeCoerce;
  var toElement$2 = unsafeCoerce;
  var toChildNode$2 = unsafeCoerce;
  var readyState = function (el) {
      return map$1((function () {
          var $3 = fromMaybe$1(None.value);
          return function ($4) {
              return $3(toEnum($4));
          };
      })())(function () {
          return _readyState(el);
      });
  };
  var fromParentNode$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");
  var fromNonDocumentTypeChildNode$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");
  var fromNode$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");
  var fromHTMLElement$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");
  var fromEventTarget$3 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");
  var fromElement$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");
  var fromChildNode$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLTrackElement");

  // Generated by purs version 0.15.15
  var toParentNode$1 = unsafeCoerce;
  var toNonDocumentTypeChildNode$1 = unsafeCoerce;
  var toNode$1 = unsafeCoerce;
  var toHTMLElement$1 = unsafeCoerce;
  var toEventTarget$2 = unsafeCoerce;
  var toElement$1 = unsafeCoerce;
  var toChildNode$1 = unsafeCoerce;
  var fromParentNode$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");
  var fromNonDocumentTypeChildNode$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");
  var fromNode$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");
  var fromHTMLElement$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");
  var fromEventTarget$2 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");
  var fromElement$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");
  var fromChildNode$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLUListElement");

  // ----------------------------------------------------------------------------

  function width(video) {
    return function () {
      return video.width;
    };
  }

  function setWidth(width) {
    return function (video) {
      return function () {
        video.width = width;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function height(video) {
    return function () {
      return video.height;
    };
  }

  function setHeight(height) {
    return function (video) {
      return function () {
        video.height = height;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function videoWidth(video) {
    return function () {
      return video.videoWidth;
    };
  }

  // ----------------------------------------------------------------------------

  function videoHeight(video) {
    return function () {
      return video.videoHeight;
    };
  }

  // ----------------------------------------------------------------------------

  function poster(video) {
    return function () {
      return video.poster;
    };
  }

  function setPoster(poster) {
    return function (video) {
      return function () {
        video.poster = poster;
      };
    };
  }

  // Generated by purs version 0.15.15
  var toParentNode = unsafeCoerce;
  var toNonDocumentTypeChildNode = unsafeCoerce;
  var toNode = unsafeCoerce;
  var toHTMLMediaElement = unsafeCoerce;
  var toHTMLElement = unsafeCoerce;
  var toEventTarget$1 = unsafeCoerce;
  var toElement = unsafeCoerce;
  var toChildNode = unsafeCoerce;
  var fromParentNode = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromNonDocumentTypeChildNode = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromNode = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromHTMLMediaElement = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromHTMLElement = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromEventTarget$1 = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromElement = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");
  var fromChildNode = /* #__PURE__ */ unsafeReadProtoTagged("HTMLVideoElement");

  function back(history) {
    return function() {
      return history.back();
    };
  }

  function forward(history) {
    return function() {
      return history.forward();
    };
  }

  function go(delta) {
    return function(history) {
      return function() {
        return history.go(delta);
      };
    };
  }

  function pushState(a) {
    return function(docTitle) {
      return function(url) {
        return function(history) {
          return function() {
            return history.pushState(a, docTitle, url);
          };
        };
      };
    };
  }

  function replaceState(a) {
    return function(docTitle) {
      return function(url) {
        return function(history) {
          return function() {
            return history.replaceState(a, docTitle, url);
          };
        };
      };
    };
  }

  function state(history) {
    return function() {
      return history.state;
    };
  }

  // Generated by purs version 0.15.15
  var compare$1 = /* #__PURE__ */ compare$3(ordString);
  var compare1 = /* #__PURE__ */ compare$3(ordInt);
  var URL = function (x) {
      return x;
  };
  var DocumentTitle = function (x) {
      return x;
  };
  var Delta = function (x) {
      return x;
  };
  var newtypeURL = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeDocumentTitle = {
      Coercible0: function () {
          return undefined;
      }
  };
  var newtypeDelta = {
      Coercible0: function () {
          return undefined;
      }
  };
  var eqURL = {
      eq: function (x) {
          return function (y) {
              return x === y;
          };
      }
  };
  var ordURL = {
      compare: function (x) {
          return function (y) {
              return compare$1(x)(y);
          };
      },
      Eq0: function () {
          return eqURL;
      }
  };
  var eqDocumentTitle = {
      eq: function (x) {
          return function (y) {
              return x === y;
          };
      }
  };
  var ordDocumentTitle = {
      compare: function (x) {
          return function (y) {
              return compare$1(x)(y);
          };
      },
      Eq0: function () {
          return eqDocumentTitle;
      }
  };
  var eqDelta = {
      eq: function (x) {
          return function (y) {
              return x === y;
          };
      }
  };
  var ordDelta = {
      compare: function (x) {
          return function (y) {
              return compare1(x)(y);
          };
      },
      Eq0: function () {
          return eqDelta;
      }
  };

  function hash(location) {
    return function () {
      return location.hash;
    };
  }

  function setHash(hash) {
    return function (location) {
      return function () {
        location.hash = hash;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function host(location) {
    return function () {
      return location.host;
    };
  }

  function setHost(host) {
    return function (location) {
      return function () {
        location.host = host;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function hostname(location) {
    return function () {
      return location.hostname;
    };
  }

  function setHostname(hostname) {
    return function (location) {
      return function () {
        location.hostname = hostname;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function href(location) {
    return function () {
      return location.href;
    };
  }

  function setHref(href) {
    return function (location) {
      return function () {
        location.href = href;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function origin(location) {
    return function () {
      return location.origin;
    };
  }

  function setOrigin(origin) {
    return function (location) {
      return function () {
        location.origin = origin;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function pathname(location) {
    return function () {
      return location.pathname;
    };
  }

  function setPathname(pathname) {
    return function (location) {
      return function () {
        location.pathname = pathname;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function port(location) {
    return function () {
      return location.port;
    };
  }

  function setPort(port) {
    return function (location) {
      return function () {
        location.port = port;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function protocol(location) {
    return function () {
      return location.protocol;
    };
  }

  function setProtocol(protocol) {
    return function (location) {
      return function () {
        location.protocol = protocol;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function search(location) {
    return function () {
      return location.search;
    };
  }

  function setSearch(search) {
    return function (location) {
      return function () {
        location.search = search;
      };
    };
  }

  // ----------------------------------------------------------------------------

  function assign(url) {
    return function (location) {
      return function () {
        location.assign(url);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function replace(url) {
    return function (location) {
      return function () {
        location.replace(url);
      };
    };
  }

  // ----------------------------------------------------------------------------

  function reload(location) {
    return function () {
      location.reload();
    };
  }

  // Generated by purs version 0.15.15

  function language(navigator) {
    return function () {
      return navigator.language;
    };
  }

  function languages(navigator) {
    return function () {
      return navigator.languages;
    };
  }

  function onLine(navigator) {
    return function () {
      return navigator.onLine;
    };
  }

  function platform(navigator) {
    return function () {
      return navigator.platform;
    };
  }

  function userAgent(navigator) {
    return function () {
      return navigator.userAgent;
    };
  }

  // Generated by purs version 0.15.15

  function document$1(window) {
    return function () {
      return window.document;
    };
  }

  function navigator(window) {
    return function () {
      return window.navigator;
    };
  }

  function location(window) {
    return function () {
      return window.location;
    };
  }

  function history(window) {
    return function() {
      return window.history;
    };
  }

  function innerWidth(window) {
    return function () {
      return window.innerWidth;
    };
  }

  function innerHeight(window) {
    return function () {
      return window.innerHeight;
    };
  }

  function alert(str) {
    return function (window) {
      return function () {
        window.alert(str);
      };
    };
  }

  function confirm(str) {
    return function (window) {
      return function () {
        return window.confirm(str);
      };
    };
  }

  function moveBy(xDelta) {
    return function (yDelta) {
      return function (window) {
        return function () {
          window.moveBy(xDelta, yDelta);
        };
      };
    };
  }

  function moveTo(width) {
    return function (height) {
      return function (window) {
        return function () {
          window.moveTo(width, height);
        };
      };
    };
  }

  function _open(url) {
    return function (name) {
      return function (features) {
        return function (window) {
          return function () {
            return window.open(url, name, features);
          };
        };
      };
    };
  }

  function close(window) {
    return function () {
      return window.close();
    };
  }

  function outerHeight(window) {
    return function () {
      return window.outerHeight;
    };
  }

  function outerWidth(window) {
    return function () {
      return window.outerWidth;
    };
  }

  function print(window) {
    return function () {
      window.print();
    };
  }

  function _prompt(str) {
    return function (defaultText) {
      return function (window) {
        return function () {
          return window.prompt(str, defaultText);
        };
      };
    };
  }

  function resizeBy(xDelta) {
    return function (yDelta) {
      return function (window) {
        return function () {
          window.resizeBy(xDelta, yDelta);
        };
      };
    };
  }

  function resizeTo(width) {
    return function (height) {
      return function (window) {
        return function () {
          window.resizeTo(width, height);
        };
      };
    };
  }

  function screenX(window) {
    return function () {
      return window.screenX;
    };
  }

  function screenY(window) {
    return function () {
      return window.screenY;
    };
  }

  function scroll(xCoord) {
    return function (yCoord) {
      return function (window) {
        return function () {
          window.scroll(xCoord, yCoord);
        };
      };
    };
  }

  function scrollBy(xCoord) {
    return function (yCoord) {
      return function (window) {
        return function () {
          window.scrollBy(xCoord, yCoord);
        };
      };
    };
  }

  function scrollX(window) {
    return function () {
      return window.scrollX;
    };
  }

  function scrollY(window) {
    return function () {
      return window.scrollY;
    };
  }

  function localStorage$1(window) {
    return function () {
      return window.localStorage;
    };
  }

  function sessionStorage(window) {
    return function () {
      return window.sessionStorage;
    };
  }

  function requestAnimationFrame(fn) {
    return function(window) {
      return function() {
        return window.requestAnimationFrame(fn);
      };
    };
  }

  function cancelAnimationFrame(id) {
    return function(window) {
      return function() {
        return window.cancelAnimationFrame(id);
      };
    };
  }

  function requestIdleCallback(opts) {
    return function(fn) {
      return function(window) {
        return function() {
          return window.requestIdleCallback(fn, opts);
        };
      };
    };
  }

  function cancelIdleCallback(id) {
    return function(window) {
      return function() {
        return window.cancelIdleCallback(id);
      };
    };
  }

  function parent(window) {
    return function() {
      return window.parent;
    };
  }

  function _opener(window) {
    return function() {
      return window.opener;
    };
  }

  // Generated by purs version 0.15.15
  var map = /* #__PURE__ */ map$o(functorEffect);
  var compare = /* #__PURE__ */ compare$3(ordInt);
  var RequestIdleCallbackId = function (x) {
      return x;
  };
  var RequestAnimationFrameId = function (x) {
      return x;
  };
  var toEventTarget = unsafeCoerce;
  var promptDefault = function (msg) {
      return function (defaultText) {
          return function (window) {
              return map(toMaybe)(_prompt(msg)(defaultText)(window));
          };
      };
  };
  var prompt = function (msg) {
      return function (window) {
          return map(toMaybe)(_prompt(msg)("")(window));
      };
  };
  var opener = function (window) {
      return map(toMaybe)(_opener(window));
  };
  var open = function (url$prime) {
      return function (name) {
          return function (features) {
              return function (window) {
                  return map(toMaybe)(_open(url$prime)(name)(features)(window));
              };
          };
      };
  };
  var fromEventTarget = /* #__PURE__ */ unsafeReadProtoTagged("Window");
  var eqRequestIdleCallbackId = {
      eq: function (x) {
          return function (y) {
              return x === y;
          };
      }
  };
  var ordRequestIdleCallbackId = {
      compare: function (x) {
          return function (y) {
              return compare(x)(y);
          };
      },
      Eq0: function () {
          return eqRequestIdleCallbackId;
      }
  };
  var eqRequestAnimationFrameId = {
      eq: function (x) {
          return function (y) {
              return x === y;
          };
      }
  };
  var ordRequestAnimationFrameId = {
      compare: function (x) {
          return function (y) {
              return compare(x)(y);
          };
      },
      Eq0: function () {
          return eqRequestAnimationFrameId;
      }
  };

  // Generated by purs version 0.15.15

  // Generated by purs version 0.15.15
  var discard = /* #__PURE__ */ discard$2(discardUnit);
  var discard1 = /* #__PURE__ */ discard(bindEither);
  var pure = /* #__PURE__ */ pure$2(applicativeEither);
  var bind = /* #__PURE__ */ bind$4(bindEither);
  var eq = /* #__PURE__ */ eq$2(/* #__PURE__ */ eqArray(eqNumber));
  var pure1 = /* #__PURE__ */ pure$2(applicativeEffect);
  var show = /* #__PURE__ */ show$4(showInt);
  var traverse_ = /* #__PURE__ */ traverse_$2(applicativeEffect)(foldableArray);
  var bind2 = /* #__PURE__ */ bind$4(bindMaybe);
  var show1 = /* #__PURE__ */ show$4(showNumber);
  var $$void = /* #__PURE__ */ $$void$5(functorEffect);
  var bindFlipped = /* #__PURE__ */ bindFlipped$3(bindEffect);
  var nub = /* #__PURE__ */ nub$1(ordNumber);
  var append1 = /* #__PURE__ */ append$1(semigroupArray);
  var showRecord = /* #__PURE__ */ showRecord$1()();
  var showRecordFieldsCons = /* #__PURE__ */ showRecordFieldsCons$1({
      reflectSymbol: function () {
          return "r";
      }
  });
  var showRecordFieldsCons1 = /* #__PURE__ */ showRecordFieldsCons$1({
      reflectSymbol: function () {
          return "x";
      }
  });
  var showRecordFieldsConsNil = /* #__PURE__ */ showRecordFieldsConsNil$1({
      reflectSymbol: function () {
          return "y";
      }
  });
  var showArray = /* #__PURE__ */ showArray$1(showNumber);
  var show2 = /* #__PURE__ */ show$4(/* #__PURE__ */ showRecord(/* #__PURE__ */ showRecordFieldsCons(/* #__PURE__ */ showRecordFieldsCons1(/* #__PURE__ */ showRecordFieldsConsNil(/* #__PURE__ */ showMaybe(showNumber)))(showNumber))(showArray)));
  var show3 = /* #__PURE__ */ show$4(/* #__PURE__ */ showRecord(/* #__PURE__ */ showRecordFieldsCons(/* #__PURE__ */ showRecordFieldsCons1(/* #__PURE__ */ showRecordFieldsConsNil(showNumber))(showNumber))(showArray)));
  var for_ = /* #__PURE__ */ for_$1(applicativeEffect)(foldableArray);
  var validateState = function (state) {
      return discard1((function () {
          var $65 = state.x < -5.0 || state.x > 3.0;
          if ($65) {
              return new Left("X \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0432 \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d\u0435 \u043e\u0442 -5 \u0434\u043e 3");
          };
          return pure(unit);
      })())(function () {
          return bind((function () {
              if (state.y instanceof Just) {
                  return new Right(state.y.value0);
              };
              if (state.y instanceof Nothing) {
                  return new Left("\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 Y");
              };
              throw new Error("Failed pattern match at Main (line 206, column 8 - line 208, column 42): " + [ state.y.constructor.name ]);
          })())(function (y) {
              return discard1((function () {
                  var $68 = eq(state.r)([  ]);
                  if ($68) {
                      return new Left("\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0445\u043e\u0442\u044f \u0431\u044b \u043e\u0434\u043d\u043e \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 R");
                  };
                  return pure(unit);
              })())(function () {
                  return new Right({
                      x: state.x,
                      y: y,
                      r: state.r
                  });
              });
          });
      });
  };
  var textContent = function (node) {
      return function __do() {
          var content = _textContent(node)();
          return fromMaybe$1("")(content);
      };
  };
  var saveResult = function (result) {
      return function __do() {
          var current = getItem("results")();
          var currentArray = (function () {
              var v = toMaybe(current);
              if (v instanceof Nothing) {
                  return [  ];
              };
              if (v instanceof Just) {
                  return fromMaybe$1([  ])(parseResults(v.value0));
              };
              throw new Error("Failed pattern match at Main (line 147, column 22 - line 149, column 54): " + [ v.constructor.name ]);
          })();
          var newArray = cons(result)(currentArray);
          setItem("results")(stringify(newArray))();
          return log("\ud83d\udcbe \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d \u0432 localStorage")();
      };
  };
  var safeRestoreHistory = function (json) {
      return function __do() {
          var count = safeParseAndDisplay(json)();
          var $71 = count > 0;
          if ($71) {
              return log("\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043e " + (show(count) + " \u0437\u0430\u043f\u0438\u0441\u0435\u0439"))();
          };
          return log("\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e")();
      };
  };
  var restoreHistory = function __do() {
      log("PureScript: \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u043c \u0438\u0441\u0442\u043e\u0440\u0438\u044e...")();
      var resultsJson = getItem("results")();
      var v = toMaybe(resultsJson);
      if (v instanceof Nothing) {
          return log("\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430")();
      };
      if (v instanceof Just) {
          log("\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u044b \u0434\u0430\u043d\u043d\u044b\u0435 \u0438\u0437 localStorage, \u0434\u043b\u0438\u043d\u0430: " + (show(length$3(v.value0)) + " chars"))();
          return safeRestoreHistory(v.value0)();
      };
      throw new Error("Failed pattern match at Main (line 158, column 3 - line 162, column 30): " + [ v.constructor.name ]);
  };
  var parseNumber = function (str) {
      return fromString$1(str);
  };
  var initYButtons = function (appStateRef) {
      return function (doc) {
          return function __do() {
              var nodeList = querySelectorAll(".y-btn")(toParentNode$10(doc))();
              var nodes = toArray(nodeList)();
              var buttons = mapMaybe(fromNode$$)(nodes);
              log("\u041d\u0430\u0439\u0434\u0435\u043d\u043e \u043a\u043d\u043e\u043f\u043e\u043a Y: " + show(length$7(buttons)))();
              return traverse_(function (btnElement) {
                  return function __do() {
                      var listener = eventListener(function (v) {
                          return function __do() {
                              var allButtons = querySelectorAll(".y-btn")(toParentNode$10(doc))();
                              var allButtonsNodes = toArray(allButtons)();
                              var allButtonsElements = mapMaybe(fromNode$$)(allButtonsNodes);
                              traverse_(function (b) {
                                  return function __do() {
                                      setAttribute("style")("")(b)();
                                      return setAttribute("active")("false")(b)();
                                  };
                              })(allButtonsElements)();
                              setAttribute("style")("background-color: #3498db; color: white;")(btnElement)();
                              setAttribute("active")("true")(btnElement)();
                              var maybeVal = getAttribute("data-value")(btnElement)();
                              var v1 = bind2(maybeVal)(parseNumber);
                              if (v1 instanceof Nothing) {
                                  var btnText = textContent(toNode$$(btnElement))();
                                  var v2 = parseNumber(btnText);
                                  if (v2 instanceof Nothing) {
                                      return log("\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0440\u0430\u0441\u043f\u043e\u0437\u043d\u0430\u0442\u044c \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 Y: " + btnText)();
                                  };
                                  if (v2 instanceof Just) {
                                      modify_(function (v3) {
                                          return {
                                              r: v3.r,
                                              x: v3.x,
                                              y: new Just(v2.value0)
                                          };
                                      })(appStateRef)();
                                      return log("Selected Y = " + show1(v2.value0))();
                                  };
                                  throw new Error("Failed pattern match at Main (line 106, column 11 - line 110, column 49): " + [ v2.constructor.name ]);
                              };
                              if (v1 instanceof Just) {
                                  modify_(function (v2) {
                                      return {
                                          r: v2.r,
                                          x: v2.x,
                                          y: new Just(v1.value0)
                                      };
                                  })(appStateRef)();
                                  return log("Selected Y = " + show1(v1.value0))();
                              };
                              throw new Error("Failed pattern match at Main (line 103, column 7 - line 113, column 45): " + [ v1.constructor.name ]);
                          };
                      })();
                      return $$void(addEventListener("click")(listener)(false)(toEventTarget$10(btnElement)))();
                  };
              })(buttons)();
          };
      };
  };
  var initXInput = function (appStateRef) {
      return function __do() {
          var htmlDoc = bindFlipped(document$1)(windowImpl)();
          var maybeElement = getElementById("x")(toNonElementParentNode(htmlDoc))();
          if (maybeElement instanceof Nothing) {
              return log("x input not found")();
          };
          if (maybeElement instanceof Just) {
              var maybeHtmlInput = fromElement$E(maybeElement.value0);
              if (maybeHtmlInput instanceof Nothing) {
                  return log("x is not input")();
              };
              if (maybeHtmlInput instanceof Just) {
                  var listener = eventListener(function (v) {
                      return function __do() {
                          var val = value$8(maybeHtmlInput.value0)();
                          var parsed = fromMaybe$1(0.0)(parseNumber(val));
                          return modify_(function (v1) {
                              return {
                                  r: v1.r,
                                  y: v1.y,
                                  x: parsed
                              };
                          })(appStateRef)();
                      };
                  })();
                  return $$void(addEventListener("input")(listener)(false)(toEventTarget$10(maybeElement.value0)))();
              };
              throw new Error("Failed pattern match at Main (line 73, column 7 - line 80, column 93): " + [ maybeHtmlInput.constructor.name ]);
          };
          throw new Error("Failed pattern match at Main (line 69, column 3 - line 80, column 93): " + [ maybeElement.constructor.name ]);
      };
  };
  var initRCheckboxes = function (appStateRef) {
      return function (doc) {
          return function __do() {
              var nodeList = querySelectorAll("input[name=\"r\"]")(toParentNode$10(doc))();
              var nodes = toArray(nodeList)();
              var checkboxes = mapMaybe(fromNode$$)(nodes);
              log("\u041d\u0430\u0439\u0434\u0435\u043d\u043e \u0447\u0435\u043a\u0431\u043e\u043a\u0441\u043e\u0432 R: " + show(length$7(checkboxes)))();
              return traverse_(function (cbElement) {
                  var maybeHtmlInput = fromElement$E(cbElement);
                  if (maybeHtmlInput instanceof Nothing) {
                      return pure1(unit);
                  };
                  if (maybeHtmlInput instanceof Just) {
                      return function __do() {
                          var listener = eventListener(function (v) {
                              return function __do() {
                                  var isChecked = checked(maybeHtmlInput.value0)();
                                  var maybeVal = getAttribute("value")(cbElement)();
                                  var v1 = bind2(maybeVal)(parseNumber);
                                  if (v1 instanceof Nothing) {
                                      return unit;
                                  };
                                  if (v1 instanceof Just) {
                                      return modify_(function (st) {
                                          var newR = (function () {
                                              if (isChecked) {
                                                  return nub(append1(st.r)([ v1.value0 ]));
                                              };
                                              return filter(function (v2) {
                                                  return v2 !== v1.value0;
                                              })(st.r);
                                          })();
                                          return {
                                              x: st.x,
                                              y: st.y,
                                              r: newR
                                          };
                                      })(appStateRef)();
                                  };
                                  throw new Error("Failed pattern match at Main (line 132, column 11 - line 140, column 28): " + [ v1.constructor.name ]);
                              };
                          })();
                          return $$void(addEventListener("change")(listener)(false)(toEventTarget$10(cbElement)))();
                      };
                  };
                  throw new Error("Failed pattern match at Main (line 126, column 5 - line 141, column 94): " + [ maybeHtmlInput.constructor.name ]);
              })(checkboxes)();
          };
      };
  };
  var initFormSubmit = function (appStateRef) {
      return function __do() {
          var htmlDoc = bindFlipped(document$1)(windowImpl)();
          var maybeForm = getElementById("point-form")(toNonElementParentNode(htmlDoc))();
          if (maybeForm instanceof Nothing) {
              return log("Form not found")();
          };
          if (maybeForm instanceof Just) {
              var listener = eventListener(function (e) {
                  return function __do() {
                      preventDefault(e)();
                      var state = read$1(appStateRef)();
                      log("\u0421\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u043f\u0435\u0440\u0435\u0434 \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u0435\u0439: " + show2(state))();
                      var v = validateState(state);
                      if (v instanceof Left) {
                          log("\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u0438: " + v.value0)();
                          return alert$1(v.value0)();
                      };
                      if (v instanceof Right) {
                          log("\u0412\u0430\u043b\u0438\u0434\u043d\u043e\u0435 \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435: " + show3(v.value0))();
                          return for_(v.value0.r)(function (rVal) {
                              return function __do() {
                                  processRequestJS(v.value0.x)(v.value0.y)(rVal)();
                                  return log("\u0412\u044b\u0437\u0432\u0430\u043d processRequestJS \u0441 R=" + show1(rVal))();
                              };
                          })();
                      };
                      throw new Error("Failed pattern match at Main (line 185, column 9 - line 194, column 64): " + [ v.constructor.name ]);
                  };
              })();
              return $$void(addEventListener("submit")(listener)(false)(toEventTarget$10(maybeForm.value0)))();
          };
          throw new Error("Failed pattern match at Main (line 177, column 3 - line 195, column 87): " + [ maybeForm.constructor.name ]);
      };
  };
  var main = function __do() {
      var htmlDoc = bindFlipped(document$1)(windowImpl)();
      var doc = toDocument(htmlDoc);
      var appStateRef = $$new({
          x: 0.0,
          y: Nothing.value,
          r: [  ]
      })();
      restoreHistory();
      initXInput(appStateRef)();
      initYButtons(appStateRef)(doc)();
      initRCheckboxes(appStateRef)(doc)();
      initFormSubmit(appStateRef)();
      return log("\u0418\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f PureScript \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430.")();
  };

  var Main = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _textContent: _textContent,
    alert: alert$1,
    clearStorage: clearStorage,
    displayResultInTable: displayResultInTable,
    getItem: getItem,
    initFormSubmit: initFormSubmit,
    initRCheckboxes: initRCheckboxes,
    initXInput: initXInput,
    initYButtons: initYButtons,
    main: main,
    parseNumber: parseNumber,
    parseResults: parseResults,
    preventDefault: preventDefault,
    processRequestJS: processRequestJS,
    processRequestWithResult: processRequestWithResult,
    restoreHistory: restoreHistory,
    safeParseAndDisplay: safeParseAndDisplay,
    safeRestoreHistory: safeRestoreHistory,
    saveResult: saveResult,
    setItem: setItem,
    stringify: stringify,
    textContent: textContent,
    validateState: validateState
  });

  window.addEventListener('DOMContentLoaded', function () {
    console.log('Инициализация PureScript...');
    if (Main && typeof main === 'function') {
      main();
    } else {
      console.error('Main.main not found!');
    }
  });
  window.Main = Main;

})();
//# sourceMappingURL=app.js.map
