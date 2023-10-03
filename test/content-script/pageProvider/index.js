"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/fast-safe-stringify/index.js
  var require_fast_safe_stringify = __commonJS({
    "node_modules/fast-safe-stringify/index.js"(exports, module) {
      module.exports = stringify;
      stringify.default = stringify;
      stringify.stable = deterministicStringify;
      stringify.stableStringify = deterministicStringify;
      var LIMIT_REPLACE_NODE = "[...]";
      var CIRCULAR_REPLACE_NODE = "[Circular]";
      var arr = [];
      var replacerStack = [];
      function defaultOptions() {
        return {
          depthLimit: Number.MAX_SAFE_INTEGER,
          edgesLimit: Number.MAX_SAFE_INTEGER
        };
      }
      function stringify(obj, replacer, spacer, options) {
        if (typeof options === "undefined") {
          options = defaultOptions();
        }
        decirc(obj, "", 0, [], void 0, 0, options);
        var res;
        try {
          if (replacerStack.length === 0) {
            res = JSON.stringify(obj, replacer, spacer);
          } else {
            res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
          }
        } catch (_) {
          return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
        } finally {
          while (arr.length !== 0) {
            var part = arr.pop();
            if (part.length === 4) {
              Object.defineProperty(part[0], part[1], part[3]);
            } else {
              part[0][part[1]] = part[2];
            }
          }
        }
        return res;
      }
      function setReplace(replace, val, k, parent) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
        if (propertyDescriptor.get !== void 0) {
          if (propertyDescriptor.configurable) {
            Object.defineProperty(parent, k, { value: replace });
            arr.push([parent, k, val, propertyDescriptor]);
          } else {
            replacerStack.push([val, k, replace]);
          }
        } else {
          parent[k] = replace;
          arr.push([parent, k, val]);
        }
      }
      function decirc(val, k, edgeIndex, stack, parent, depth, options) {
        depth += 1;
        var i;
        if (typeof val === "object" && val !== null) {
          for (i = 0; i < stack.length; i++) {
            if (stack[i] === val) {
              setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
              return;
            }
          }
          if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
            setReplace(LIMIT_REPLACE_NODE, val, k, parent);
            return;
          }
          if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
            setReplace(LIMIT_REPLACE_NODE, val, k, parent);
            return;
          }
          stack.push(val);
          if (Array.isArray(val)) {
            for (i = 0; i < val.length; i++) {
              decirc(val[i], i, i, stack, val, depth, options);
            }
          } else {
            var keys = Object.keys(val);
            for (i = 0; i < keys.length; i++) {
              var key = keys[i];
              decirc(val[key], key, i, stack, val, depth, options);
            }
          }
          stack.pop();
        }
      }
      function compareFunction(a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      }
      function deterministicStringify(obj, replacer, spacer, options) {
        if (typeof options === "undefined") {
          options = defaultOptions();
        }
        var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
        var res;
        try {
          if (replacerStack.length === 0) {
            res = JSON.stringify(tmp, replacer, spacer);
          } else {
            res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
          }
        } catch (_) {
          return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
        } finally {
          while (arr.length !== 0) {
            var part = arr.pop();
            if (part.length === 4) {
              Object.defineProperty(part[0], part[1], part[3]);
            } else {
              part[0][part[1]] = part[2];
            }
          }
        }
        return res;
      }
      function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
        depth += 1;
        var i;
        if (typeof val === "object" && val !== null) {
          for (i = 0; i < stack.length; i++) {
            if (stack[i] === val) {
              setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
              return;
            }
          }
          try {
            if (typeof val.toJSON === "function") {
              return;
            }
          } catch (_) {
            return;
          }
          if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
            setReplace(LIMIT_REPLACE_NODE, val, k, parent);
            return;
          }
          if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
            setReplace(LIMIT_REPLACE_NODE, val, k, parent);
            return;
          }
          stack.push(val);
          if (Array.isArray(val)) {
            for (i = 0; i < val.length; i++) {
              deterministicDecirc(val[i], i, i, stack, val, depth, options);
            }
          } else {
            var tmp = {};
            var keys = Object.keys(val).sort(compareFunction);
            for (i = 0; i < keys.length; i++) {
              var key = keys[i];
              deterministicDecirc(val[key], key, i, stack, val, depth, options);
              tmp[key] = val[key];
            }
            if (typeof parent !== "undefined") {
              arr.push([parent, k, val]);
              parent[k] = tmp;
            } else {
              return tmp;
            }
          }
          stack.pop();
        }
      }
      function replaceGetterValues(replacer) {
        replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
          return v;
        };
        return function(key, val) {
          if (replacerStack.length > 0) {
            for (var i = 0; i < replacerStack.length; i++) {
              var part = replacerStack[i];
              if (part[1] === key && part[0] === val) {
                val = part[2];
                replacerStack.splice(i, 1);
                break;
              }
            }
          }
          return replacer.call(this, key, val);
        };
      }
    }
  });

  // node_modules/eth-rpc-errors/dist/classes.js
  var require_classes = __commonJS({
    "node_modules/eth-rpc-errors/dist/classes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.EthereumProviderError = exports.EthereumRpcError = void 0;
      var fast_safe_stringify_1 = require_fast_safe_stringify();
      var EthereumRpcError = class extends Error {
        constructor(code, message, data) {
          if (!Number.isInteger(code)) {
            throw new Error('"code" must be an integer.');
          }
          if (!message || typeof message !== "string") {
            throw new Error('"message" must be a nonempty string.');
          }
          super(message);
          this.code = code;
          if (data !== void 0) {
            this.data = data;
          }
        }
        /**
         * Returns a plain object with all public class properties.
         */
        serialize() {
          const serialized = {
            code: this.code,
            message: this.message
          };
          if (this.data !== void 0) {
            serialized.data = this.data;
          }
          if (this.stack) {
            serialized.stack = this.stack;
          }
          return serialized;
        }
        /**
         * Return a string representation of the serialized error, omitting
         * any circular references.
         */
        toString() {
          return fast_safe_stringify_1.default(this.serialize(), stringifyReplacer, 2);
        }
      };
      exports.EthereumRpcError = EthereumRpcError;
      var EthereumProviderError = class extends EthereumRpcError {
        /**
         * Create an Ethereum Provider JSON-RPC error.
         * `code` must be an integer in the 1000 <= 4999 range.
         */
        constructor(code, message, data) {
          if (!isValidEthProviderCode(code)) {
            throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
          }
          super(code, message, data);
        }
      };
      exports.EthereumProviderError = EthereumProviderError;
      function isValidEthProviderCode(code) {
        return Number.isInteger(code) && code >= 1e3 && code <= 4999;
      }
      function stringifyReplacer(_, value) {
        if (value === "[Circular]") {
          return void 0;
        }
        return value;
      }
    }
  });

  // node_modules/eth-rpc-errors/dist/error-constants.js
  var require_error_constants = __commonJS({
    "node_modules/eth-rpc-errors/dist/error-constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.errorValues = exports.errorCodes = void 0;
      exports.errorCodes = {
        rpc: {
          invalidInput: -32e3,
          resourceNotFound: -32001,
          resourceUnavailable: -32002,
          transactionRejected: -32003,
          methodNotSupported: -32004,
          limitExceeded: -32005,
          parse: -32700,
          invalidRequest: -32600,
          methodNotFound: -32601,
          invalidParams: -32602,
          internal: -32603
        },
        provider: {
          userRejectedRequest: 4001,
          unauthorized: 4100,
          unsupportedMethod: 4200,
          disconnected: 4900,
          chainDisconnected: 4901
        }
      };
      exports.errorValues = {
        "-32700": {
          standard: "JSON RPC 2.0",
          message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
        },
        "-32600": {
          standard: "JSON RPC 2.0",
          message: "The JSON sent is not a valid Request object."
        },
        "-32601": {
          standard: "JSON RPC 2.0",
          message: "The method does not exist / is not available."
        },
        "-32602": {
          standard: "JSON RPC 2.0",
          message: "Invalid method parameter(s)."
        },
        "-32603": {
          standard: "JSON RPC 2.0",
          message: "Internal JSON-RPC error."
        },
        "-32000": {
          standard: "EIP-1474",
          message: "Invalid input."
        },
        "-32001": {
          standard: "EIP-1474",
          message: "Resource not found."
        },
        "-32002": {
          standard: "EIP-1474",
          message: "Resource unavailable."
        },
        "-32003": {
          standard: "EIP-1474",
          message: "Transaction rejected."
        },
        "-32004": {
          standard: "EIP-1474",
          message: "Method not supported."
        },
        "-32005": {
          standard: "EIP-1474",
          message: "Request limit exceeded."
        },
        "4001": {
          standard: "EIP-1193",
          message: "User rejected the request."
        },
        "4100": {
          standard: "EIP-1193",
          message: "The requested account and/or method has not been authorized by the user."
        },
        "4200": {
          standard: "EIP-1193",
          message: "The requested method is not supported by this Ethereum provider."
        },
        "4900": {
          standard: "EIP-1193",
          message: "The provider is disconnected from all chains."
        },
        "4901": {
          standard: "EIP-1193",
          message: "The provider is disconnected from the specified chain."
        }
      };
    }
  });

  // node_modules/eth-rpc-errors/dist/utils.js
  var require_utils = __commonJS({
    "node_modules/eth-rpc-errors/dist/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.serializeError = exports.isValidCode = exports.getMessageFromCode = exports.JSON_RPC_SERVER_ERROR_MESSAGE = void 0;
      var error_constants_1 = require_error_constants();
      var classes_1 = require_classes();
      var FALLBACK_ERROR_CODE = error_constants_1.errorCodes.rpc.internal;
      var FALLBACK_MESSAGE = "Unspecified error message. This is a bug, please report it.";
      var FALLBACK_ERROR = {
        code: FALLBACK_ERROR_CODE,
        message: getMessageFromCode(FALLBACK_ERROR_CODE)
      };
      exports.JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
      function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
        if (Number.isInteger(code)) {
          const codeString = code.toString();
          if (hasKey(error_constants_1.errorValues, codeString)) {
            return error_constants_1.errorValues[codeString].message;
          }
          if (isJsonRpcServerError(code)) {
            return exports.JSON_RPC_SERVER_ERROR_MESSAGE;
          }
        }
        return fallbackMessage;
      }
      exports.getMessageFromCode = getMessageFromCode;
      function isValidCode(code) {
        if (!Number.isInteger(code)) {
          return false;
        }
        const codeString = code.toString();
        if (error_constants_1.errorValues[codeString]) {
          return true;
        }
        if (isJsonRpcServerError(code)) {
          return true;
        }
        return false;
      }
      exports.isValidCode = isValidCode;
      function serializeError2(error, { fallbackError = FALLBACK_ERROR, shouldIncludeStack = false } = {}) {
        var _a, _b;
        if (!fallbackError || !Number.isInteger(fallbackError.code) || typeof fallbackError.message !== "string") {
          throw new Error("Must provide fallback error with integer number code and string message.");
        }
        if (error instanceof classes_1.EthereumRpcError) {
          return error.serialize();
        }
        const serialized = {};
        if (error && typeof error === "object" && !Array.isArray(error) && hasKey(error, "code") && isValidCode(error.code)) {
          const _error = error;
          serialized.code = _error.code;
          if (_error.message && typeof _error.message === "string") {
            serialized.message = _error.message;
            if (hasKey(_error, "data")) {
              serialized.data = _error.data;
            }
          } else {
            serialized.message = getMessageFromCode(serialized.code);
            serialized.data = { originalError: assignOriginalError(error) };
          }
        } else {
          serialized.code = fallbackError.code;
          const message = (_a = error) === null || _a === void 0 ? void 0 : _a.message;
          serialized.message = message && typeof message === "string" ? message : fallbackError.message;
          serialized.data = { originalError: assignOriginalError(error) };
        }
        const stack = (_b = error) === null || _b === void 0 ? void 0 : _b.stack;
        if (shouldIncludeStack && error && stack && typeof stack === "string") {
          serialized.stack = stack;
        }
        return serialized;
      }
      exports.serializeError = serializeError2;
      function isJsonRpcServerError(code) {
        return code >= -32099 && code <= -32e3;
      }
      function assignOriginalError(error) {
        if (error && typeof error === "object" && !Array.isArray(error)) {
          return Object.assign({}, error);
        }
        return error;
      }
      function hasKey(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }
    }
  });

  // node_modules/eth-rpc-errors/dist/errors.js
  var require_errors = __commonJS({
    "node_modules/eth-rpc-errors/dist/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ethErrors = void 0;
      var classes_1 = require_classes();
      var utils_1 = require_utils();
      var error_constants_1 = require_error_constants();
      exports.ethErrors = {
        rpc: {
          /**
           * Get a JSON RPC 2.0 Parse (-32700) error.
           */
          parse: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.parse, arg),
          /**
           * Get a JSON RPC 2.0 Invalid Request (-32600) error.
           */
          invalidRequest: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidRequest, arg),
          /**
           * Get a JSON RPC 2.0 Invalid Params (-32602) error.
           */
          invalidParams: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidParams, arg),
          /**
           * Get a JSON RPC 2.0 Method Not Found (-32601) error.
           */
          methodNotFound: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotFound, arg),
          /**
           * Get a JSON RPC 2.0 Internal (-32603) error.
           */
          internal: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.internal, arg),
          /**
           * Get a JSON RPC 2.0 Server error.
           * Permits integer error codes in the [ -32099 <= -32005 ] range.
           * Codes -32000 through -32004 are reserved by EIP-1474.
           */
          server: (opts) => {
            if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
              throw new Error("Ethereum RPC Server errors must provide single object argument.");
            }
            const { code } = opts;
            if (!Number.isInteger(code) || code > -32005 || code < -32099) {
              throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
            }
            return getEthJsonRpcError(code, opts);
          },
          /**
           * Get an Ethereum JSON RPC Invalid Input (-32000) error.
           */
          invalidInput: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidInput, arg),
          /**
           * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
           */
          resourceNotFound: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceNotFound, arg),
          /**
           * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
           */
          resourceUnavailable: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceUnavailable, arg),
          /**
           * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
           */
          transactionRejected: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.transactionRejected, arg),
          /**
           * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
           */
          methodNotSupported: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotSupported, arg),
          /**
           * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
           */
          limitExceeded: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.limitExceeded, arg)
        },
        provider: {
          /**
           * Get an Ethereum Provider User Rejected Request (4001) error.
           */
          userRejectedRequest: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.userRejectedRequest, arg);
          },
          /**
           * Get an Ethereum Provider Unauthorized (4100) error.
           */
          unauthorized: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.unauthorized, arg);
          },
          /**
           * Get an Ethereum Provider Unsupported Method (4200) error.
           */
          unsupportedMethod: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.unsupportedMethod, arg);
          },
          /**
           * Get an Ethereum Provider Not Connected (4900) error.
           */
          disconnected: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.disconnected, arg);
          },
          /**
           * Get an Ethereum Provider Chain Not Connected (4901) error.
           */
          chainDisconnected: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.chainDisconnected, arg);
          },
          /**
           * Get a custom Ethereum Provider error.
           */
          custom: (opts) => {
            if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
              throw new Error("Ethereum Provider custom errors must provide single object argument.");
            }
            const { code, message, data } = opts;
            if (!message || typeof message !== "string") {
              throw new Error('"message" must be a nonempty string');
            }
            return new classes_1.EthereumProviderError(code, message, data);
          }
        }
      };
      function getEthJsonRpcError(code, arg) {
        const [message, data] = parseOpts(arg);
        return new classes_1.EthereumRpcError(code, message || utils_1.getMessageFromCode(code), data);
      }
      function getEthProviderError(code, arg) {
        const [message, data] = parseOpts(arg);
        return new classes_1.EthereumProviderError(code, message || utils_1.getMessageFromCode(code), data);
      }
      function parseOpts(arg) {
        if (arg) {
          if (typeof arg === "string") {
            return [arg];
          } else if (typeof arg === "object" && !Array.isArray(arg)) {
            const { message, data } = arg;
            if (message && typeof message !== "string") {
              throw new Error("Must specify string message.");
            }
            return [message || void 0, data];
          }
        }
        return [];
      }
    }
  });

  // node_modules/eth-rpc-errors/dist/index.js
  var require_dist = __commonJS({
    "node_modules/eth-rpc-errors/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getMessageFromCode = exports.serializeError = exports.EthereumProviderError = exports.EthereumRpcError = exports.ethErrors = exports.errorCodes = void 0;
      var classes_1 = require_classes();
      Object.defineProperty(exports, "EthereumRpcError", { enumerable: true, get: function() {
        return classes_1.EthereumRpcError;
      } });
      Object.defineProperty(exports, "EthereumProviderError", { enumerable: true, get: function() {
        return classes_1.EthereumProviderError;
      } });
      var utils_1 = require_utils();
      Object.defineProperty(exports, "serializeError", { enumerable: true, get: function() {
        return utils_1.serializeError;
      } });
      Object.defineProperty(exports, "getMessageFromCode", { enumerable: true, get: function() {
        return utils_1.getMessageFromCode;
      } });
      var errors_1 = require_errors();
      Object.defineProperty(exports, "ethErrors", { enumerable: true, get: function() {
        return errors_1.ethErrors;
      } });
      var error_constants_1 = require_error_constants();
      Object.defineProperty(exports, "errorCodes", { enumerable: true, get: function() {
        return error_constants_1.errorCodes;
      } });
    }
  });

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter3() {
        EventEmitter3.init.call(this);
      }
      module.exports = EventEmitter3;
      module.exports.once = once;
      EventEmitter3.EventEmitter = EventEmitter3;
      EventEmitter3.prototype._events = void 0;
      EventEmitter3.prototype._eventsCount = 0;
      EventEmitter3.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter3, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter3.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter3.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter3.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter3.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter3.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter3.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter3.prototype.on = EventEmitter3.prototype.addListener;
      EventEmitter3.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter3.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter3.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter3.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter3.prototype.off = EventEmitter3.prototype.removeListener;
      EventEmitter3.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter3.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter3.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter3.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter3.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter3.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // src/content-script/pageProvider/index.ts
  var import_eth_rpc_errors3 = __toESM(require_dist());
  var import_events2 = __toESM(require_events());

  // src/shared/utils/message/index.ts
  var import_eth_rpc_errors = __toESM(require_dist());
  var import_events = __toESM(require_events());
  var Message = class extends import_events.default {
    // avaiable id list
    // max concurrent request limit
    _requestIdPool = [...Array(500).keys()];
    _EVENT_PRE = "EXTENSION_WALLET_";
    listenCallback;
    _waitingMap = /* @__PURE__ */ new Map();
    request(data) {
      if (!this._requestIdPool.length) {
        throw import_eth_rpc_errors.ethErrors.rpc.limitExceeded();
      }
      const ident = this._requestIdPool.shift();
      return new Promise((resolve, reject) => {
        this._waitingMap.set(ident, {
          data,
          resolve,
          reject
        });
        this.send("request", { ident, data });
      });
    }
    onResponse = async ({ ident, res, err } = {}) => {
      if (!this._waitingMap.has(ident)) {
        return;
      }
      const { resolve, reject } = this._waitingMap.get(ident);
      this._requestIdPool.push(ident);
      this._waitingMap.delete(ident);
      err ? reject(err) : resolve(res);
    };
    onRequest = async ({ ident, data }) => {
      if (this.listenCallback) {
        let res, err;
        try {
          res = await this.listenCallback(data);
        } catch (e) {
          err = {
            message: e.message,
            stack: e.stack
          };
          e.code && (err.code = e.code);
          e.data && (err.data = e.data);
        }
        this.send("response", { ident, res, err });
      }
    };
    _dispose = () => {
      for (const request of this._waitingMap.values()) {
        request.reject(import_eth_rpc_errors.ethErrors.provider.userRejectedRequest());
      }
      this._waitingMap.clear();
    };
  };
  var message_default = Message;

  // src/shared/utils/message/broadcastChannelMessage.ts
  var BroadcastChannelMessage = class extends message_default {
    _channel;
    constructor(name) {
      super();
      if (!name) {
        throw new Error("the broadcastChannel name is missing");
      }
      this._channel = new BroadcastChannel(name);
    }
    connect = () => {
      this._channel.onmessage = ({ data: { type, data } }) => {
        if (type === "message") {
          this.emit("message", data);
        } else if (type === "response") {
          this.onResponse(data);
        }
      };
      return this;
    };
    listen = (listenCallback) => {
      this.listenCallback = listenCallback;
      this._channel.onmessage = ({ data: { type, data } }) => {
        if (type === "request") {
          this.onRequest(data);
        }
      };
      return this;
    };
    send = (type, data) => {
      this._channel.postMessage({
        type,
        data
      });
    };
    dispose = () => {
      this._dispose();
      this._channel.close();
    };
  };

  // src/content-script/pageProvider/pushEventHandlers.ts
  var import_eth_rpc_errors2 = __toESM(require_dist());
  var PushEventHandlers = class {
    provider;
    constructor(provider2) {
      this.provider = provider2;
    }
    _emit(event, data) {
      if (this.provider._initialized) {
        this.provider.emit(event, data);
      }
    }
    connect = (data) => {
      if (!this.provider._isConnected) {
        this.provider._isConnected = true;
        this.provider._state.isConnected = true;
        this._emit("connect", data);
      }
    };
    unlock = () => {
      this.provider._isUnlocked = true;
      this.provider._state.isUnlocked = true;
    };
    lock = () => {
      this.provider._isUnlocked = false;
    };
    disconnect = () => {
      this.provider._isConnected = false;
      this.provider._state.isConnected = false;
      this.provider._state.accounts = null;
      this.provider._selectedAddress = null;
      const disconnectError = import_eth_rpc_errors2.ethErrors.provider.disconnected();
      this._emit("accountsChanged", []);
      this._emit("disconnect", disconnectError);
      this._emit("close", disconnectError);
    };
    accountsChanged = (accounts) => {
      if (accounts?.[0] === this.provider._selectedAddress) {
        return;
      }
      this.provider._selectedAddress = accounts?.[0];
      this.provider._state.accounts = accounts;
      this._emit("accountsChanged", accounts);
    };
    networkChanged = ({ network }) => {
      this.connect({});
      if (network !== this.provider._network) {
        this.provider._network = network;
        this._emit("networkChanged", network);
      }
    };
  };
  var pushEventHandlers_default = PushEventHandlers;

  // src/content-script/pageProvider/readyPromise.ts
  var ReadyPromise = class {
    _allCheck = [];
    _tasks = [];
    constructor(count) {
      this._allCheck = [...Array(count)];
    }
    check = (index) => {
      this._allCheck[index - 1] = true;
      this._proceed();
    };
    uncheck = (index) => {
      this._allCheck[index - 1] = false;
    };
    _proceed = () => {
      if (this._allCheck.some((_) => !_)) {
        return;
      }
      while (this._tasks.length) {
        const { resolve, fn } = this._tasks.shift();
        resolve(fn());
      }
    };
    call = (fn) => {
      return new Promise((resolve) => {
        this._tasks.push({
          fn,
          resolve
        });
        this._proceed();
      });
    };
  };
  var readyPromise_default = ReadyPromise;

  // src/content-script/pageProvider/utils.ts
  var tryCount = 0;
  var checkLoaded = (callback) => {
    tryCount++;
    if (tryCount > 600) {
      return;
    }
    if (document.readyState === "complete") {
      callback();
      return true;
    } else {
      setTimeout(() => {
        checkLoaded(callback);
      }, 100);
    }
  };
  var domReadyCall = (callback) => {
    checkLoaded(callback);
  };
  var $ = document.querySelector.bind(document);

  // src/content-script/pageProvider/index.ts
  var log = (event, ...args) => {
    if (true) {
      console.log(
        `%c [unisat] (${(/* @__PURE__ */ new Date()).toTimeString().slice(0, 8)}) ${event}`,
        "font-weight: 600; background-color: #7d6ef9; color: white;",
        ...args
      );
    }
  };
  var script = document.currentScript;
  var channelName = script?.getAttribute("channel") || "UNISAT";
  var UnisatProvider = class extends import_events2.EventEmitter {
    _selectedAddress = null;
    _network = null;
    _isConnected = false;
    _initialized = false;
    _isUnlocked = false;
    _state = {
      accounts: null,
      isConnected: false,
      isUnlocked: false,
      initialized: false,
      isPermanentlyDisconnected: false
    };
    _pushEventHandlers;
    _requestPromise = new readyPromise_default(0);
    _bcm = new BroadcastChannelMessage(channelName);
    constructor({ maxListeners = 100 } = {}) {
      super();
      this.setMaxListeners(maxListeners);
      this.initialize();
      this._pushEventHandlers = new pushEventHandlers_default(this);
    }
    initialize = async () => {
      document.addEventListener("visibilitychange", this._requestPromiseCheckVisibility);
      this._bcm.connect().on("message", this._handleBackgroundMessage);
      domReadyCall(() => {
        const origin = window.top?.location.origin;
        const icon = $('head > link[rel~="icon"]')?.href || $('head > meta[itemprop="image"]')?.content;
        const name = document.title || $('head > meta[name="title"]')?.content || origin;
        this._bcm.request({
          method: "tabCheckin",
          params: { icon, name, origin }
        });
      });
      try {
        const { network, accounts, isUnlocked } = await this._request({
          method: "getProviderState"
        });
        if (isUnlocked) {
          this._isUnlocked = true;
          this._state.isUnlocked = true;
        }
        this.emit("connect", {});
        this._pushEventHandlers.networkChanged({
          network
        });
        this._pushEventHandlers.accountsChanged(accounts);
      } catch {
      } finally {
        this._initialized = true;
        this._state.initialized = true;
        this.emit("_initialized");
      }
      this.keepAlive();
    };
    /**
     * Sending a message to the extension to receive will keep the service worker alive.
     */
    keepAlive = () => {
      this._request({
        method: "keepAlive",
        params: {}
      }).then(() => {
        setTimeout(() => {
          this.keepAlive();
        }, 1e3);
      });
    };
    _requestPromiseCheckVisibility = () => {
      if (document.visibilityState === "visible") {
        this._requestPromise.check(1);
      } else {
        this._requestPromise.uncheck(1);
      }
    };
    _handleBackgroundMessage = ({ event, data }) => {
      log("[push event]", event, data);
      if (this._pushEventHandlers[event]) {
        return this._pushEventHandlers[event](data);
      }
      this.emit(event, data);
    };
    // TODO: support multi request!
    // request = async (data) => {
    //   return this._request(data);
    // };
    _request = async (data) => {
      if (!data) {
        throw import_eth_rpc_errors3.ethErrors.rpc.invalidRequest();
      }
      this._requestPromiseCheckVisibility();
      return this._requestPromise.call(() => {
        log("[request]", JSON.stringify(data, null, 2));
        return this._bcm.request(data).then((res) => {
          log("[request: success]", data.method, res);
          return res;
        }).catch((err) => {
          log("[request: error]", data.method, (0, import_eth_rpc_errors3.serializeError)(err));
          throw (0, import_eth_rpc_errors3.serializeError)(err);
        });
      });
    };
    // public methods
    requestAccounts = async () => {
      return this._request({
        method: "requestAccounts"
      });
    };
    getNetwork = async () => {
      return this._request({
        method: "getNetwork"
      });
    };
    switchNetwork = async (network) => {
      return this._request({
        method: "switchNetwork",
        params: {
          network
        }
      });
    };
    getAccounts = async () => {
      return this._request({
        method: "getAccounts"
      });
    };
    getPublicKey = async () => {
      return this._request({
        method: "getPublicKey"
      });
    };
    getBalance = async () => {
      return this._request({
        method: "getBalance"
      });
    };
    getInscriptions = async (cursor = 0, size = 20) => {
      return this._request({
        method: "getInscriptions",
        params: {
          cursor,
          size
        }
      });
    };
    signMessage = async (text, type) => {
      return this._request({
        method: "signMessage",
        params: {
          text,
          type
        }
      });
    };
    sendBitcoin = async (toAddress, satoshis, options) => {
      return this._request({
        method: "sendBitcoin",
        params: {
          toAddress,
          satoshis,
          feeRate: options?.feeRate,
          type: 1 /* SEND_BITCOIN */
        }
      });
    };
    sendInscription = async (toAddress, inscriptionId, options) => {
      return this._request({
        method: "sendInscription",
        params: {
          toAddress,
          inscriptionId,
          feeRate: options?.feeRate,
          type: 2 /* SEND_INSCRIPTION */
        }
      });
    };
    // signTx = async (rawtx: string) => {
    //   return this._request({
    //     method: 'signTx',
    //     params: {
    //       rawtx
    //     }
    //   });
    // };
    /**
     * push transaction
     */
    pushTx = async (rawtx) => {
      return this._request({
        method: "pushTx",
        params: {
          rawtx
        }
      });
    };
    signPsbt = async (psbtHex, options) => {
      return this._request({
        method: "signPsbt",
        params: {
          psbtHex,
          type: 0 /* SIGN_TX */,
          options
        }
      });
    };
    signPsbts = async (psbtHexs, options) => {
      return this._request({
        method: "multiSignPsbt",
        params: {
          psbtHexs,
          options
        }
      });
    };
    pushPsbt = async (psbtHex) => {
      return this._request({
        method: "pushPsbt",
        params: {
          psbtHex
        }
      });
    };
    inscribeTransfer = async (ticker, amount) => {
      return this._request({
        method: "inscribeTransfer",
        params: {
          ticker,
          amount
        }
      });
    };
  };
  var provider = new UnisatProvider();
  if (!window.unisat) {
    window.unisat = new Proxy(provider, {
      deleteProperty: () => true
    });
  }
  Object.defineProperty(window, "unisat", {
    value: new Proxy(provider, {
      deleteProperty: () => true
    }),
    writable: false
  });
  window.dispatchEvent(new Event("unisat#initialized"));
})();
