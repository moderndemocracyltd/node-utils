'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AWS = _interopDefault(require('aws-sdk'));

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

const configure = configurator => {
    return function decorator(target, key, descriptor) {
        const originalDescriptorValue = descriptor.value;
        descriptor.value = asyncToGenerator(function* () {
            const configurationOptions = yield configurator.configure();
            const newArgs = Array.from(arguments);
            newArgs.push(configurationOptions);
            return originalDescriptorValue.apply(this, newArgs);
        });

        return descriptor;
    };
};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var resolvers = {
  simple: function (args) {
    if (!args.length) return '\u0001';

    return args.join('\u0002');
  },

  json: function (args) {
    if (!args.length) return '\u0001';

    var res = [];

    for (var i = args.length - 1; i >= 0; i--) {
      res.push(JSON.stringify(args[i]));
    }

    return res.join('\u0002');
  }
};


function createFlexResolver(params) {
  params.forEach(function (p) {
    if (typeof p === 'string' && !resolvers.hasOwnProperty(p)) {
      throw new Error('promise-memoize: unknown value "' + p + '" in resolve option');
    }
  });

  return function (args) {
    var max = Math.min(params.length, args.length);

    if (!max) return '\u0001';

    var res = [];

    for (var i = 0; i < max; i++) {
      if (typeof params[i] === 'string') {
        res.push(resolvers[params[i]]([ args[i] ]));
      } else {
        res.push(params[i](args[i]));
      }
    }

    return res.join('\u0002');
  };
}


var resolver = function createResolver(how) {
  if (typeof how === 'undefined') return resolvers.simple;

  if (typeof how === 'string' && resolvers.hasOwnProperty(how)) return resolvers[how];

  if (Array.isArray(how)) return createFlexResolver(how);

  if (Object.prototype.toString.call(how) === '[object Function]') return how;

  throw new Error('promise-memoize: invalid resolve option');
};

////////////////////////////////////////////////////////////////////////////////
// Helpers

function _toTrue()  { return true; }
function _toFalse() { return false; }

function pSuccess(promise) { return promise.then(_toTrue, _toFalse); }

function _pass(data) { return data; }
function _throw(err) { throw err; }

function ensurePromise(thenable) {
  return thenable.then(_pass, _throw);
}

////////////////////////////////////////////////////////////////////////////////

function createCacheObj(result, args) {
  return {
    result:         result,
    args:           args,
    expire_id:      0,
    prefetch_id:    0,
    need_prefetch:  false
  };
}


function destroyCacheObj(cache, key) {
  if (!cache[key]) return; // Safeguard

  clearTimeout(cache[key].expire_id);
  clearTimeout(cache[key].prefetch_id);

  delete cache[key];
}


function askPrefetch(cache, key) {
  if (!cache[key]) return; // Safeguard

  cache[key].need_prefetch = true;
}


function _track_proceed(args) {
  // args = [ pSuccess(cache[key].result), cache, key, config ]
  var success = args[0],
      cache   = args[1],
      key     = args[2],
      config  = args[3];

  if (!cache[key]) return; // Safeguard, if .clear() happens while fetch

  if (success) {

    if (!config.maxAge) return;

    // Such call will not work in IE9 without polyfill.
    // https://developer.mozilla.org/docs/Web/API/WindowTimers/setTimeout
    cache[key].expire_id   = setTimeout(destroyCacheObj, config.maxAge, cache, key);
    cache[key].prefetch_id = setTimeout(askPrefetch, config.maxAge * 0.7, cache, key);

    /* istanbul ignore else */
    if (cache[key].expire_id.unref) cache[key].expire_id.unref();

    /* istanbul ignore else */
    if (cache[key].prefetch_id.unref) cache[key].prefetch_id.unref();

    return;
  }

  // on fail

  if (!config.maxErrorAge) {
    destroyCacheObj(cache, key);
    return;
  }

  // Don't try to prefetch on error, for simplicity
  cache[key].expire_id = setTimeout(destroyCacheObj, config.maxErrorAge, cache, key);

  /* istanbul ignore else */
  if (cache[key].expire_id.unref) cache[key].expire_id.unref();

}


// Wait for data & start timers, depending on result & options
function trackCacheObj(cache, key, config) {
  var P = cache[key].result.constructor;

  P.all([
    pSuccess(cache[key].result),
    cache,
    key,
    config
  ])
    .then(_track_proceed);
}


function _prefetch_proceed(args) {
  // args = [ pSuccess(cache[key].result), cache, key, config, [ result ] ]
  var success = args[0],
      cache   = args[1],
      key     = args[2],
      config  = args[3],
      result  = args[4][0];

  if (!cache[key]) return; // Safeguard, if .clear() happens while fetch

  if (!success) return;

  cache[key].result = result;
  clearTimeout(cache[key].expire_id);

  /*eslint-disable no-use-before-define*/
  trackCacheObj(cache, key, config);
}


function doPrefetch(cache, key, config) {
  var result = ensurePromise(config.fn.apply(null, cache[key].args)),
      P      = result.constructor;

  cache[key].need_prefetch = false;

  // On success - substitute data & restart tracker.
  // On fail - do nothing, data will be killed by expiration timer.
  P.all([
    pSuccess(result),
    cache,
    key,
    config,
    [ result ] // protect from resolve
  ])
    .then(_prefetch_proceed);
}


var memoize = function promiseMemoize(fn, options) {
  var cache       = {},
      _options    = options || {},
      resolve     = resolver(_options.resolve),
      config      = {
        fn:          fn,
        maxAge:      _options.maxAge || 0,
        maxErrorAge: _options.maxErrorAge || 0
      };

  function memoizedFn() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) args[i] = arguments[i];

    var key = resolve(args);

    if (cache[key]) {
      if (cache[key].need_prefetch) doPrefetch(cache, key, config);

    } else {
      cache[key] = createCacheObj(
        ensurePromise(config.fn.apply(null, args)),
        config.maxAge || config.maxErrorAge ? args : null // Store args only if needed
      );
      trackCacheObj(cache, key, config);
    }

    return cache[key].result;
  }

  memoizedFn.clear = function () {
    var keys = Object.keys(cache);

    keys.forEach(function (key) { destroyCacheObj(cache, key); });

    return keys.length; // Number of cleared keys, useful for tests
  };

  return memoizedFn;
};

var promiseMemoize = memoize;

function wrapWithCache(memoFn, { cacheMaxAge = ms('1m') } = opts) {
    const func = memoFn;
    return promiseMemoize(func, { maxAge: cacheMaxAge, resolve: params => params[0].path });
}

function flattenConfiguration(parameters) {
    let flatObject = {};

    if (parameters && parameters.Parameters) {

        parameters.Parameters.forEach(element => {
            const lastPathSeperator = element.Name.lastIndexOf('/');
            const elementName = element.Name.substring(lastPathSeperator + 1);
            flatObject[elementName] = element.Value;
        });
    }

    return flatObject;
}

class SsmConfigProvider {

    constructor({ cache = false } = opts) {

        if (cache) {
            this.getValues = wrapWithCache(this.getValues.bind(this), opts);
        } else {
            this.getValues = this.getValues.bind(this);
        }
    }

    getValues({ path, maxItems = 10, recursive = true, configValidator = function (params) {
            return true;
        }, valueFactoryMethod, flattener = flattenConfiguration }) {
        return asyncToGenerator(function* () {

            if (!path || path === '') {
                throw new Error("Invalid Configuration - Missing Path parameter value");
            }

            const requestParameters = {
                Path: path,
                MaxResults: maxItems,
                Recursive: recursive,
                WithDecryption: decrypt
            };

            const ssmClient = new AWS.SSM({ apiVersion: '2014-11-06' });
            let parameters = yield ssmClient.getParametersByPath(requestParameters).promise();

            parameters = parameterExtractor(parameters);

            if (!(yield validator(parameters))) {

                if (!valueFactoryMethod) {
                    throw new Error(`Configuration parameters at path ${path} failed validation.`);
                }

                parameters = yield valueFactoryMethod(path);
            }

            return parameters;
        })();
    }

}

exports.configure = configure;
exports.SsmConfigProvider = SsmConfigProvider;
