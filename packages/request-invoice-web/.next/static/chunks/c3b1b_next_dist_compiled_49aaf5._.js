(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/c3b1b_next_dist_compiled_49aaf5._.js", {

"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE$2 ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function disabledLog() {}
    function disableLogs() {
        if (0 === disabledDepth) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
                configurable: !0,
                enumerable: !0,
                value: disabledLog,
                writable: !0
            };
            Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
            });
        }
        disabledDepth++;
    }
    function reenableLogs() {
        disabledDepth--;
        if (0 === disabledDepth) {
            var props = {
                configurable: !0,
                enumerable: !0,
                writable: !0
            };
            Object.defineProperties(console, {
                log: assign({}, props, {
                    value: prevLog
                }),
                info: assign({}, props, {
                    value: prevInfo
                }),
                warn: assign({}, props, {
                    value: prevWarn
                }),
                error: assign({}, props, {
                    value: prevError
                }),
                group: assign({}, props, {
                    value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                    value: prevGroupEnd
                })
            });
        }
        0 > disabledDepth && console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
    }
    function describeBuiltInComponentFrame(name) {
        if (void 0 === prefix) try {
            throw Error();
        } catch (x) {
            var match = x.stack.trim().match(/\n( *(at )?)/);
            prefix = match && match[1] || "";
            suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
        return "\n" + prefix + name + suffix;
    }
    function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) return "";
        var frame = componentFrameCache.get(fn);
        if (void 0 !== frame) return frame;
        reentry = !0;
        frame = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher = null;
        previousDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = null;
        disableLogs();
        try {
            var RunInRootFrame = {
                DetermineComponentFrameRoot: function() {
                    try {
                        if (construct) {
                            var Fake = function() {
                                throw Error();
                            };
                            Object.defineProperty(Fake.prototype, "props", {
                                set: function() {
                                    throw Error();
                                }
                            });
                            if ("object" === typeof Reflect && Reflect.construct) {
                                try {
                                    Reflect.construct(Fake, []);
                                } catch (x) {
                                    var control = x;
                                }
                                Reflect.construct(fn, [], Fake);
                            } else {
                                try {
                                    Fake.call();
                                } catch (x$0) {
                                    control = x$0;
                                }
                                fn.call(Fake.prototype);
                            }
                        } else {
                            try {
                                throw Error();
                            } catch (x$1) {
                                control = x$1;
                            }
                            (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
                        }
                    } catch (sample) {
                        if (sample && control && "string" === typeof sample.stack) return [
                            sample.stack,
                            control.stack
                        ];
                    }
                    return [
                        null,
                        null
                    ];
                }
            };
            RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
            namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", {
                value: "DetermineComponentFrameRoot"
            });
            var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
            if (sampleStack && controlStack) {
                var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
                for(_RunInRootFrame$Deter = namePropDescriptor = 0; namePropDescriptor < sampleLines.length && !sampleLines[namePropDescriptor].includes("DetermineComponentFrameRoot");)namePropDescriptor++;
                for(; _RunInRootFrame$Deter < controlLines.length && !controlLines[_RunInRootFrame$Deter].includes("DetermineComponentFrameRoot");)_RunInRootFrame$Deter++;
                if (namePropDescriptor === sampleLines.length || _RunInRootFrame$Deter === controlLines.length) for(namePropDescriptor = sampleLines.length - 1, _RunInRootFrame$Deter = controlLines.length - 1; 1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter && sampleLines[namePropDescriptor] !== controlLines[_RunInRootFrame$Deter];)_RunInRootFrame$Deter--;
                for(; 1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter; namePropDescriptor--, _RunInRootFrame$Deter--)if (sampleLines[namePropDescriptor] !== controlLines[_RunInRootFrame$Deter]) {
                    if (1 !== namePropDescriptor || 1 !== _RunInRootFrame$Deter) {
                        do if (namePropDescriptor--, _RunInRootFrame$Deter--, 0 > _RunInRootFrame$Deter || sampleLines[namePropDescriptor] !== controlLines[_RunInRootFrame$Deter]) {
                            var _frame = "\n" + sampleLines[namePropDescriptor].replace(" at new ", " at ");
                            fn.displayName && _frame.includes("<anonymous>") && (_frame = _frame.replace("<anonymous>", fn.displayName));
                            "function" === typeof fn && componentFrameCache.set(fn, _frame);
                            return _frame;
                        }
                        while (1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter)
                    }
                    break;
                }
            }
        } finally{
            reentry = !1, ReactSharedInternals.H = previousDispatcher, reenableLogs(), Error.prepareStackTrace = frame;
        }
        sampleLines = (sampleLines = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(sampleLines) : "";
        "function" === typeof fn && componentFrameCache.set(fn, sampleLines);
        return sampleLines;
    }
    function describeUnknownElementTypeFrameInDEV(type) {
        if (null == type) return "";
        if ("function" === typeof type) {
            var prototype = type.prototype;
            return describeNativeComponentFrame(type, !(!prototype || !prototype.isReactComponent));
        }
        if ("string" === typeof type) return describeBuiltInComponentFrame(type);
        switch(type){
            case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
        }
        if ("object" === typeof type) switch(type.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return type = describeNativeComponentFrame(type.render, !1), type;
            case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type);
            case REACT_LAZY_TYPE:
                prototype = type._payload;
                type = type._init;
                try {
                    return describeUnknownElementTypeFrameInDEV(type(prototype));
                } catch (x) {}
        }
        return "";
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self) {
        if ("string" === typeof type || "function" === typeof type || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_OFFSCREEN_TYPE || "object" === typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE$1 || void 0 !== type.getModuleId)) {
            var children = config.children;
            if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
                for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren], type);
                Object.freeze && Object.freeze(children);
            } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else validateChildKeys(children, type);
        } else {
            children = "";
            if (void 0 === type || "object" === typeof type && null !== type && 0 === Object.keys(type).length) children += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            null === type ? isStaticChildren = "null" : isArrayImpl(type) ? isStaticChildren = "array" : void 0 !== type && type.$$typeof === REACT_ELEMENT_TYPE ? (isStaticChildren = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />", children = " Did you accidentally export a JSX literal instead of a component?") : isStaticChildren = typeof type;
            console.error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", isStaticChildren, children);
        }
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey);
    }
    function validateChildKeys(node, parentType) {
        if ("object" === typeof node && node && node.$$typeof !== REACT_CLIENT_REFERENCE) {
            if (isArrayImpl(node)) for(var i = 0; i < node.length; i++){
                var child = node[i];
                isValidElement(child) && validateExplicitKey(child, parentType);
            }
            else if (isValidElement(node)) node._store && (node._store.validated = 1);
            else if (null === node || "object" !== typeof node ? i = null : (i = MAYBE_ITERATOR_SYMBOL && node[MAYBE_ITERATOR_SYMBOL] || node["@@iterator"], i = "function" === typeof i ? i : null), "function" === typeof i && i !== node.entries && (i = i.call(node), i !== node)) for(; !(node = i.next()).done;)isValidElement(node.value) && validateExplicitKey(node.value, parentType);
        }
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function validateExplicitKey(element, parentType) {
        if (element._store && !element._store.validated && null == element.key && (element._store.validated = 1, parentType = getCurrentComponentErrorInfo(parentType), !ownerHasKeyUseWarning[parentType])) {
            ownerHasKeyUseWarning[parentType] = !0;
            var childOwner = "";
            element && null != element._owner && element._owner !== getOwner() && (childOwner = null, "number" === typeof element._owner.tag ? childOwner = getComponentNameFromType(element._owner.type) : "string" === typeof element._owner.name && (childOwner = element._owner.name), childOwner = " It was passed a child from " + childOwner + ".");
            var prevGetCurrentStack = ReactSharedInternals.getCurrentStack;
            ReactSharedInternals.getCurrentStack = function() {
                var stack = describeUnknownElementTypeFrameInDEV(element.type);
                prevGetCurrentStack && (stack += prevGetCurrentStack() || "");
                return stack;
            };
            console.error('Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.', parentType, childOwner);
            ReactSharedInternals.getCurrentStack = prevGetCurrentStack;
        }
    }
    function getCurrentComponentErrorInfo(parentType) {
        var info = "", owner = getOwner();
        owner && (owner = getComponentNameFromType(owner.type)) && (info = "\n\nCheck the render method of `" + owner + "`.");
        info || (parentType = getComponentNameFromType(parentType)) && (info = "\n\nCheck the top-level render call using <" + parentType + ">.");
        return info;
    }
    var React = __turbopack_require__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    Symbol.for("react.provider");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, REACT_CLIENT_REFERENCE$2 = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, assign = Object.assign, REACT_CLIENT_REFERENCE$1 = Symbol.for("react.client.reference"), isArrayImpl = Array.isArray, disabledDepth = 0, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd;
    disabledLog.__reactDisabledLog = !0;
    var prefix, suffix, reentry = !1;
    var componentFrameCache = new ("function" === typeof WeakMap ? WeakMap : Map)();
    var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var didWarnAboutKeySpread = {}, ownerHasKeyUseWarning = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self);
    };
}();
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_require__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
(function() {
    var e = {
        675: function(e, r) {
            "use strict";
            r.byteLength = byteLength;
            r.toByteArray = toByteArray;
            r.fromByteArray = fromByteArray;
            var t = [];
            var f = [];
            var n = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var o = 0, u = i.length; o < u; ++o){
                t[o] = i[o];
                f[i.charCodeAt(o)] = o;
            }
            f["-".charCodeAt(0)] = 62;
            f["_".charCodeAt(0)] = 63;
            function getLens(e) {
                var r = e.length;
                if (r % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var t = e.indexOf("=");
                if (t === -1) t = r;
                var f = t === r ? 0 : 4 - t % 4;
                return [
                    t,
                    f
                ];
            }
            function byteLength(e) {
                var r = getLens(e);
                var t = r[0];
                var f = r[1];
                return (t + f) * 3 / 4 - f;
            }
            function _byteLength(e, r, t) {
                return (r + t) * 3 / 4 - t;
            }
            function toByteArray(e) {
                var r;
                var t = getLens(e);
                var i = t[0];
                var o = t[1];
                var u = new n(_byteLength(e, i, o));
                var a = 0;
                var s = o > 0 ? i - 4 : i;
                var h;
                for(h = 0; h < s; h += 4){
                    r = f[e.charCodeAt(h)] << 18 | f[e.charCodeAt(h + 1)] << 12 | f[e.charCodeAt(h + 2)] << 6 | f[e.charCodeAt(h + 3)];
                    u[a++] = r >> 16 & 255;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                if (o === 2) {
                    r = f[e.charCodeAt(h)] << 2 | f[e.charCodeAt(h + 1)] >> 4;
                    u[a++] = r & 255;
                }
                if (o === 1) {
                    r = f[e.charCodeAt(h)] << 10 | f[e.charCodeAt(h + 1)] << 4 | f[e.charCodeAt(h + 2)] >> 2;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                return u;
            }
            function tripletToBase64(e) {
                return t[e >> 18 & 63] + t[e >> 12 & 63] + t[e >> 6 & 63] + t[e & 63];
            }
            function encodeChunk(e, r, t) {
                var f;
                var n = [];
                for(var i = r; i < t; i += 3){
                    f = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255);
                    n.push(tripletToBase64(f));
                }
                return n.join("");
            }
            function fromByteArray(e) {
                var r;
                var f = e.length;
                var n = f % 3;
                var i = [];
                var o = 16383;
                for(var u = 0, a = f - n; u < a; u += o){
                    i.push(encodeChunk(e, u, u + o > a ? a : u + o));
                }
                if (n === 1) {
                    r = e[f - 1];
                    i.push(t[r >> 2] + t[r << 4 & 63] + "==");
                } else if (n === 2) {
                    r = (e[f - 2] << 8) + e[f - 1];
                    i.push(t[r >> 10] + t[r >> 4 & 63] + t[r << 2 & 63] + "=");
                }
                return i.join("");
            }
        },
        72: function(e, r, t) {
            "use strict";
            /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ var f = t(675);
            var n = t(783);
            var i = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            r.Buffer = Buffer;
            r.SlowBuffer = SlowBuffer;
            r.INSPECT_MAX_BYTES = 50;
            var o = 2147483647;
            r.kMaxLength = o;
            Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
            if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function typedArraySupport() {
                try {
                    var e = new Uint8Array(1);
                    var r = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(r, Uint8Array.prototype);
                    Object.setPrototypeOf(e, r);
                    return e.foo() === 42;
                } catch (e) {
                    return false;
                }
            }
            Object.defineProperty(Buffer.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(Buffer.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function createBuffer(e) {
                if (e > o) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
                var r = new Uint8Array(e);
                Object.setPrototypeOf(r, Buffer.prototype);
                return r;
            }
            function Buffer(e, r, t) {
                if (typeof e === "number") {
                    if (typeof r === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return allocUnsafe(e);
                }
                return from(e, r, t);
            }
            Buffer.poolSize = 8192;
            function from(e, r, t) {
                if (typeof e === "string") {
                    return fromString(e, r);
                }
                if (ArrayBuffer.isView(e)) {
                    return fromArrayLike(e);
                }
                if (e == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
                }
                if (isInstance(e, ArrayBuffer) || e && isInstance(e.buffer, ArrayBuffer)) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (isInstance(e, SharedArrayBuffer) || e && isInstance(e.buffer, SharedArrayBuffer))) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof e === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var f = e.valueOf && e.valueOf();
                if (f != null && f !== e) {
                    return Buffer.from(f, r, t);
                }
                var n = fromObject(e);
                if (n) return n;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === "function") {
                    return Buffer.from(e[Symbol.toPrimitive]("string"), r, t);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
            }
            Buffer.from = function(e, r, t) {
                return from(e, r, t);
            };
            Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(Buffer, Uint8Array);
            function assertSize(e) {
                if (typeof e !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (e < 0) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
            }
            function alloc(e, r, t) {
                assertSize(e);
                if (e <= 0) {
                    return createBuffer(e);
                }
                if (r !== undefined) {
                    return typeof t === "string" ? createBuffer(e).fill(r, t) : createBuffer(e).fill(r);
                }
                return createBuffer(e);
            }
            Buffer.alloc = function(e, r, t) {
                return alloc(e, r, t);
            };
            function allocUnsafe(e) {
                assertSize(e);
                return createBuffer(e < 0 ? 0 : checked(e) | 0);
            }
            Buffer.allocUnsafe = function(e) {
                return allocUnsafe(e);
            };
            Buffer.allocUnsafeSlow = function(e) {
                return allocUnsafe(e);
            };
            function fromString(e, r) {
                if (typeof r !== "string" || r === "") {
                    r = "utf8";
                }
                if (!Buffer.isEncoding(r)) {
                    throw new TypeError("Unknown encoding: " + r);
                }
                var t = byteLength(e, r) | 0;
                var f = createBuffer(t);
                var n = f.write(e, r);
                if (n !== t) {
                    f = f.slice(0, n);
                }
                return f;
            }
            function fromArrayLike(e) {
                var r = e.length < 0 ? 0 : checked(e.length) | 0;
                var t = createBuffer(r);
                for(var f = 0; f < r; f += 1){
                    t[f] = e[f] & 255;
                }
                return t;
            }
            function fromArrayBuffer(e, r, t) {
                if (r < 0 || e.byteLength < r) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (e.byteLength < r + (t || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var f;
                if (r === undefined && t === undefined) {
                    f = new Uint8Array(e);
                } else if (t === undefined) {
                    f = new Uint8Array(e, r);
                } else {
                    f = new Uint8Array(e, r, t);
                }
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            }
            function fromObject(e) {
                if (Buffer.isBuffer(e)) {
                    var r = checked(e.length) | 0;
                    var t = createBuffer(r);
                    if (t.length === 0) {
                        return t;
                    }
                    e.copy(t, 0, 0, r);
                    return t;
                }
                if (e.length !== undefined) {
                    if (typeof e.length !== "number" || numberIsNaN(e.length)) {
                        return createBuffer(0);
                    }
                    return fromArrayLike(e);
                }
                if (e.type === "Buffer" && Array.isArray(e.data)) {
                    return fromArrayLike(e.data);
                }
            }
            function checked(e) {
                if (e >= o) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + o.toString(16) + " bytes");
                }
                return e | 0;
            }
            function SlowBuffer(e) {
                if (+e != e) {
                    e = 0;
                }
                return Buffer.alloc(+e);
            }
            Buffer.isBuffer = function isBuffer(e) {
                return e != null && e._isBuffer === true && e !== Buffer.prototype;
            };
            Buffer.compare = function compare(e, r) {
                if (isInstance(e, Uint8Array)) e = Buffer.from(e, e.offset, e.byteLength);
                if (isInstance(r, Uint8Array)) r = Buffer.from(r, r.offset, r.byteLength);
                if (!Buffer.isBuffer(e) || !Buffer.isBuffer(r)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (e === r) return 0;
                var t = e.length;
                var f = r.length;
                for(var n = 0, i = Math.min(t, f); n < i; ++n){
                    if (e[n] !== r[n]) {
                        t = e[n];
                        f = r[n];
                        break;
                    }
                }
                if (t < f) return -1;
                if (f < t) return 1;
                return 0;
            };
            Buffer.isEncoding = function isEncoding(e) {
                switch(String(e).toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false;
                }
            };
            Buffer.concat = function concat(e, r) {
                if (!Array.isArray(e)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (e.length === 0) {
                    return Buffer.alloc(0);
                }
                var t;
                if (r === undefined) {
                    r = 0;
                    for(t = 0; t < e.length; ++t){
                        r += e[t].length;
                    }
                }
                var f = Buffer.allocUnsafe(r);
                var n = 0;
                for(t = 0; t < e.length; ++t){
                    var i = e[t];
                    if (isInstance(i, Uint8Array)) {
                        i = Buffer.from(i);
                    }
                    if (!Buffer.isBuffer(i)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    i.copy(f, n);
                    n += i.length;
                }
                return f;
            };
            function byteLength(e, r) {
                if (Buffer.isBuffer(e)) {
                    return e.length;
                }
                if (ArrayBuffer.isView(e) || isInstance(e, ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof e);
                }
                var t = e.length;
                var f = arguments.length > 2 && arguments[2] === true;
                if (!f && t === 0) return 0;
                var n = false;
                for(;;){
                    switch(r){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return t;
                        case "utf8":
                        case "utf-8":
                            return utf8ToBytes(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return t * 2;
                        case "hex":
                            return t >>> 1;
                        case "base64":
                            return base64ToBytes(e).length;
                        default:
                            if (n) {
                                return f ? -1 : utf8ToBytes(e).length;
                            }
                            r = ("" + r).toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer.byteLength = byteLength;
            function slowToString(e, r, t) {
                var f = false;
                if (r === undefined || r < 0) {
                    r = 0;
                }
                if (r > this.length) {
                    return "";
                }
                if (t === undefined || t > this.length) {
                    t = this.length;
                }
                if (t <= 0) {
                    return "";
                }
                t >>>= 0;
                r >>>= 0;
                if (t <= r) {
                    return "";
                }
                if (!e) e = "utf8";
                while(true){
                    switch(e){
                        case "hex":
                            return hexSlice(this, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Slice(this, r, t);
                        case "ascii":
                            return asciiSlice(this, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Slice(this, r, t);
                        case "base64":
                            return base64Slice(this, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return utf16leSlice(this, r, t);
                        default:
                            if (f) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            f = true;
                    }
                }
            }
            Buffer.prototype._isBuffer = true;
            function swap(e, r, t) {
                var f = e[r];
                e[r] = e[t];
                e[t] = f;
            }
            Buffer.prototype.swap16 = function swap16() {
                var e = this.length;
                if (e % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var r = 0; r < e; r += 2){
                    swap(this, r, r + 1);
                }
                return this;
            };
            Buffer.prototype.swap32 = function swap32() {
                var e = this.length;
                if (e % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var r = 0; r < e; r += 4){
                    swap(this, r, r + 3);
                    swap(this, r + 1, r + 2);
                }
                return this;
            };
            Buffer.prototype.swap64 = function swap64() {
                var e = this.length;
                if (e % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var r = 0; r < e; r += 8){
                    swap(this, r, r + 7);
                    swap(this, r + 1, r + 6);
                    swap(this, r + 2, r + 5);
                    swap(this, r + 3, r + 4);
                }
                return this;
            };
            Buffer.prototype.toString = function toString() {
                var e = this.length;
                if (e === 0) return "";
                if (arguments.length === 0) return utf8Slice(this, 0, e);
                return slowToString.apply(this, arguments);
            };
            Buffer.prototype.toLocaleString = Buffer.prototype.toString;
            Buffer.prototype.equals = function equals(e) {
                if (!Buffer.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return true;
                return Buffer.compare(this, e) === 0;
            };
            Buffer.prototype.inspect = function inspect() {
                var e = "";
                var t = r.INSPECT_MAX_BYTES;
                e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > t) e += " ... ";
                return "<Buffer " + e + ">";
            };
            if (i) {
                Buffer.prototype[i] = Buffer.prototype.inspect;
            }
            Buffer.prototype.compare = function compare(e, r, t, f, n) {
                if (isInstance(e, Uint8Array)) {
                    e = Buffer.from(e, e.offset, e.byteLength);
                }
                if (!Buffer.isBuffer(e)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof e);
                }
                if (r === undefined) {
                    r = 0;
                }
                if (t === undefined) {
                    t = e ? e.length : 0;
                }
                if (f === undefined) {
                    f = 0;
                }
                if (n === undefined) {
                    n = this.length;
                }
                if (r < 0 || t > e.length || f < 0 || n > this.length) {
                    throw new RangeError("out of range index");
                }
                if (f >= n && r >= t) {
                    return 0;
                }
                if (f >= n) {
                    return -1;
                }
                if (r >= t) {
                    return 1;
                }
                r >>>= 0;
                t >>>= 0;
                f >>>= 0;
                n >>>= 0;
                if (this === e) return 0;
                var i = n - f;
                var o = t - r;
                var u = Math.min(i, o);
                var a = this.slice(f, n);
                var s = e.slice(r, t);
                for(var h = 0; h < u; ++h){
                    if (a[h] !== s[h]) {
                        i = a[h];
                        o = s[h];
                        break;
                    }
                }
                if (i < o) return -1;
                if (o < i) return 1;
                return 0;
            };
            function bidirectionalIndexOf(e, r, t, f, n) {
                if (e.length === 0) return -1;
                if (typeof t === "string") {
                    f = t;
                    t = 0;
                } else if (t > 2147483647) {
                    t = 2147483647;
                } else if (t < -2147483648) {
                    t = -2147483648;
                }
                t = +t;
                if (numberIsNaN(t)) {
                    t = n ? 0 : e.length - 1;
                }
                if (t < 0) t = e.length + t;
                if (t >= e.length) {
                    if (n) return -1;
                    else t = e.length - 1;
                } else if (t < 0) {
                    if (n) t = 0;
                    else return -1;
                }
                if (typeof r === "string") {
                    r = Buffer.from(r, f);
                }
                if (Buffer.isBuffer(r)) {
                    if (r.length === 0) {
                        return -1;
                    }
                    return arrayIndexOf(e, r, t, f, n);
                } else if (typeof r === "number") {
                    r = r & 255;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (n) {
                            return Uint8Array.prototype.indexOf.call(e, r, t);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, r, t);
                        }
                    }
                    return arrayIndexOf(e, [
                        r
                    ], t, f, n);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function arrayIndexOf(e, r, t, f, n) {
                var i = 1;
                var o = e.length;
                var u = r.length;
                if (f !== undefined) {
                    f = String(f).toLowerCase();
                    if (f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le") {
                        if (e.length < 2 || r.length < 2) {
                            return -1;
                        }
                        i = 2;
                        o /= 2;
                        u /= 2;
                        t /= 2;
                    }
                }
                function read(e, r) {
                    if (i === 1) {
                        return e[r];
                    } else {
                        return e.readUInt16BE(r * i);
                    }
                }
                var a;
                if (n) {
                    var s = -1;
                    for(a = t; a < o; a++){
                        if (read(e, a) === read(r, s === -1 ? 0 : a - s)) {
                            if (s === -1) s = a;
                            if (a - s + 1 === u) return s * i;
                        } else {
                            if (s !== -1) a -= a - s;
                            s = -1;
                        }
                    }
                } else {
                    if (t + u > o) t = o - u;
                    for(a = t; a >= 0; a--){
                        var h = true;
                        for(var c = 0; c < u; c++){
                            if (read(e, a + c) !== read(r, c)) {
                                h = false;
                                break;
                            }
                        }
                        if (h) return a;
                    }
                }
                return -1;
            }
            Buffer.prototype.includes = function includes(e, r, t) {
                return this.indexOf(e, r, t) !== -1;
            };
            Buffer.prototype.indexOf = function indexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, true);
            };
            Buffer.prototype.lastIndexOf = function lastIndexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, false);
            };
            function hexWrite(e, r, t, f) {
                t = Number(t) || 0;
                var n = e.length - t;
                if (!f) {
                    f = n;
                } else {
                    f = Number(f);
                    if (f > n) {
                        f = n;
                    }
                }
                var i = r.length;
                if (f > i / 2) {
                    f = i / 2;
                }
                for(var o = 0; o < f; ++o){
                    var u = parseInt(r.substr(o * 2, 2), 16);
                    if (numberIsNaN(u)) return o;
                    e[t + o] = u;
                }
                return o;
            }
            function utf8Write(e, r, t, f) {
                return blitBuffer(utf8ToBytes(r, e.length - t), e, t, f);
            }
            function asciiWrite(e, r, t, f) {
                return blitBuffer(asciiToBytes(r), e, t, f);
            }
            function latin1Write(e, r, t, f) {
                return asciiWrite(e, r, t, f);
            }
            function base64Write(e, r, t, f) {
                return blitBuffer(base64ToBytes(r), e, t, f);
            }
            function ucs2Write(e, r, t, f) {
                return blitBuffer(utf16leToBytes(r, e.length - t), e, t, f);
            }
            Buffer.prototype.write = function write(e, r, t, f) {
                if (r === undefined) {
                    f = "utf8";
                    t = this.length;
                    r = 0;
                } else if (t === undefined && typeof r === "string") {
                    f = r;
                    t = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r >>> 0;
                    if (isFinite(t)) {
                        t = t >>> 0;
                        if (f === undefined) f = "utf8";
                    } else {
                        f = t;
                        t = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var n = this.length - r;
                if (t === undefined || t > n) t = n;
                if (e.length > 0 && (t < 0 || r < 0) || r > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!f) f = "utf8";
                var i = false;
                for(;;){
                    switch(f){
                        case "hex":
                            return hexWrite(this, e, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Write(this, e, r, t);
                        case "ascii":
                            return asciiWrite(this, e, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Write(this, e, r, t);
                        case "base64":
                            return base64Write(this, e, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return ucs2Write(this, e, r, t);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + f);
                            f = ("" + f).toLowerCase();
                            i = true;
                    }
                }
            };
            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(e, r, t) {
                if (r === 0 && t === e.length) {
                    return f.fromByteArray(e);
                } else {
                    return f.fromByteArray(e.slice(r, t));
                }
            }
            function utf8Slice(e, r, t) {
                t = Math.min(e.length, t);
                var f = [];
                var n = r;
                while(n < t){
                    var i = e[n];
                    var o = null;
                    var u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                    if (n + u <= t) {
                        var a, s, h, c;
                        switch(u){
                            case 1:
                                if (i < 128) {
                                    o = i;
                                }
                                break;
                            case 2:
                                a = e[n + 1];
                                if ((a & 192) === 128) {
                                    c = (i & 31) << 6 | a & 63;
                                    if (c > 127) {
                                        o = c;
                                    }
                                }
                                break;
                            case 3:
                                a = e[n + 1];
                                s = e[n + 2];
                                if ((a & 192) === 128 && (s & 192) === 128) {
                                    c = (i & 15) << 12 | (a & 63) << 6 | s & 63;
                                    if (c > 2047 && (c < 55296 || c > 57343)) {
                                        o = c;
                                    }
                                }
                                break;
                            case 4:
                                a = e[n + 1];
                                s = e[n + 2];
                                h = e[n + 3];
                                if ((a & 192) === 128 && (s & 192) === 128 && (h & 192) === 128) {
                                    c = (i & 15) << 18 | (a & 63) << 12 | (s & 63) << 6 | h & 63;
                                    if (c > 65535 && c < 1114112) {
                                        o = c;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 65533;
                        u = 1;
                    } else if (o > 65535) {
                        o -= 65536;
                        f.push(o >>> 10 & 1023 | 55296);
                        o = 56320 | o & 1023;
                    }
                    f.push(o);
                    n += u;
                }
                return decodeCodePointsArray(f);
            }
            var u = 4096;
            function decodeCodePointsArray(e) {
                var r = e.length;
                if (r <= u) {
                    return String.fromCharCode.apply(String, e);
                }
                var t = "";
                var f = 0;
                while(f < r){
                    t += String.fromCharCode.apply(String, e.slice(f, f += u));
                }
                return t;
            }
            function asciiSlice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n] & 127);
                }
                return f;
            }
            function latin1Slice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n]);
                }
                return f;
            }
            function hexSlice(e, r, t) {
                var f = e.length;
                if (!r || r < 0) r = 0;
                if (!t || t < 0 || t > f) t = f;
                var n = "";
                for(var i = r; i < t; ++i){
                    n += s[e[i]];
                }
                return n;
            }
            function utf16leSlice(e, r, t) {
                var f = e.slice(r, t);
                var n = "";
                for(var i = 0; i < f.length; i += 2){
                    n += String.fromCharCode(f[i] + f[i + 1] * 256);
                }
                return n;
            }
            Buffer.prototype.slice = function slice(e, r) {
                var t = this.length;
                e = ~~e;
                r = r === undefined ? t : ~~r;
                if (e < 0) {
                    e += t;
                    if (e < 0) e = 0;
                } else if (e > t) {
                    e = t;
                }
                if (r < 0) {
                    r += t;
                    if (r < 0) r = 0;
                } else if (r > t) {
                    r = t;
                }
                if (r < e) r = e;
                var f = this.subarray(e, r);
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            };
            function checkOffset(e, r, t) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + r > t) throw new RangeError("Trying to access beyond buffer length");
            }
            Buffer.prototype.readUIntLE = function readUIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                return f;
            };
            Buffer.prototype.readUIntBE = function readUIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) {
                    checkOffset(e, r, this.length);
                }
                var f = this[e + --r];
                var n = 1;
                while(r > 0 && (n *= 256)){
                    f += this[e + --r] * n;
                }
                return f;
            };
            Buffer.prototype.readUInt8 = function readUInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                return this[e];
            };
            Buffer.prototype.readUInt16LE = function readUInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] | this[e + 1] << 8;
            };
            Buffer.prototype.readUInt16BE = function readUInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] << 8 | this[e + 1];
            };
            Buffer.prototype.readUInt32LE = function readUInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
            };
            Buffer.prototype.readUInt32BE = function readUInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
            };
            Buffer.prototype.readIntLE = function readIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                n *= 128;
                if (f >= n) f -= Math.pow(2, 8 * r);
                return f;
            };
            Buffer.prototype.readIntBE = function readIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = r;
                var n = 1;
                var i = this[e + --f];
                while(f > 0 && (n *= 256)){
                    i += this[e + --f] * n;
                }
                n *= 128;
                if (i >= n) i -= Math.pow(2, 8 * r);
                return i;
            };
            Buffer.prototype.readInt8 = function readInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                if (!(this[e] & 128)) return this[e];
                return (255 - this[e] + 1) * -1;
            };
            Buffer.prototype.readInt16LE = function readInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e] | this[e + 1] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt16BE = function readInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e + 1] | this[e] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt32LE = function readInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
            };
            Buffer.prototype.readInt32BE = function readInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
            };
            Buffer.prototype.readFloatLE = function readFloatLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, true, 23, 4);
            };
            Buffer.prototype.readFloatBE = function readFloatBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, false, 23, 4);
            };
            Buffer.prototype.readDoubleLE = function readDoubleLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, true, 52, 8);
            };
            Buffer.prototype.readDoubleBE = function readDoubleBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, false, 52, 8);
            };
            function checkInt(e, r, t, f, n, i) {
                if (!Buffer.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (r > n || r < i) throw new RangeError('"value" argument is out of bounds');
                if (t + f > e.length) throw new RangeError("Index out of range");
            }
            Buffer.prototype.writeUIntLE = function writeUIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = 1;
                var o = 0;
                this[r] = e & 255;
                while(++o < t && (i *= 256)){
                    this[r + o] = e / i & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUIntBE = function writeUIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = t - 1;
                var o = 1;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    this[r + i] = e / o & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUInt8 = function writeUInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 255, 0);
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r + 3] = e >>> 24;
                this[r + 2] = e >>> 16;
                this[r + 1] = e >>> 8;
                this[r] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeIntLE = function writeIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = 0;
                var o = 1;
                var u = 0;
                this[r] = e & 255;
                while(++i < t && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i - 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeIntBE = function writeIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = t - 1;
                var o = 1;
                var u = 0;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i + 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeInt8 = function writeInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 127, -128);
                if (e < 0) e = 255 + e + 1;
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeInt16LE = function writeInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeInt16BE = function writeInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeInt32LE = function writeInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                this[r + 2] = e >>> 16;
                this[r + 3] = e >>> 24;
                return r + 4;
            };
            Buffer.prototype.writeInt32BE = function writeInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                if (e < 0) e = 4294967295 + e + 1;
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            function checkIEEE754(e, r, t, f, n, i) {
                if (t + f > e.length) throw new RangeError("Index out of range");
                if (t < 0) throw new RangeError("Index out of range");
            }
            function writeFloat(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 4, 34028234663852886e22, -34028234663852886e22);
                }
                n.write(e, r, t, f, 23, 4);
                return t + 4;
            }
            Buffer.prototype.writeFloatLE = function writeFloatLE(e, r, t) {
                return writeFloat(this, e, r, true, t);
            };
            Buffer.prototype.writeFloatBE = function writeFloatBE(e, r, t) {
                return writeFloat(this, e, r, false, t);
            };
            function writeDouble(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 8, 17976931348623157e292, -17976931348623157e292);
                }
                n.write(e, r, t, f, 52, 8);
                return t + 8;
            }
            Buffer.prototype.writeDoubleLE = function writeDoubleLE(e, r, t) {
                return writeDouble(this, e, r, true, t);
            };
            Buffer.prototype.writeDoubleBE = function writeDoubleBE(e, r, t) {
                return writeDouble(this, e, r, false, t);
            };
            Buffer.prototype.copy = function copy(e, r, t, f) {
                if (!Buffer.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (!t) t = 0;
                if (!f && f !== 0) f = this.length;
                if (r >= e.length) r = e.length;
                if (!r) r = 0;
                if (f > 0 && f < t) f = t;
                if (f === t) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (t < 0 || t >= this.length) throw new RangeError("Index out of range");
                if (f < 0) throw new RangeError("sourceEnd out of bounds");
                if (f > this.length) f = this.length;
                if (e.length - r < f - t) {
                    f = e.length - r + t;
                }
                var n = f - t;
                if (this === e && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(r, t, f);
                } else if (this === e && t < r && r < f) {
                    for(var i = n - 1; i >= 0; --i){
                        e[i + r] = this[i + t];
                    }
                } else {
                    Uint8Array.prototype.set.call(e, this.subarray(t, f), r);
                }
                return n;
            };
            Buffer.prototype.fill = function fill(e, r, t, f) {
                if (typeof e === "string") {
                    if (typeof r === "string") {
                        f = r;
                        r = 0;
                        t = this.length;
                    } else if (typeof t === "string") {
                        f = t;
                        t = this.length;
                    }
                    if (f !== undefined && typeof f !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof f === "string" && !Buffer.isEncoding(f)) {
                        throw new TypeError("Unknown encoding: " + f);
                    }
                    if (e.length === 1) {
                        var n = e.charCodeAt(0);
                        if (f === "utf8" && n < 128 || f === "latin1") {
                            e = n;
                        }
                    }
                } else if (typeof e === "number") {
                    e = e & 255;
                } else if (typeof e === "boolean") {
                    e = Number(e);
                }
                if (r < 0 || this.length < r || this.length < t) {
                    throw new RangeError("Out of range index");
                }
                if (t <= r) {
                    return this;
                }
                r = r >>> 0;
                t = t === undefined ? this.length : t >>> 0;
                if (!e) e = 0;
                var i;
                if (typeof e === "number") {
                    for(i = r; i < t; ++i){
                        this[i] = e;
                    }
                } else {
                    var o = Buffer.isBuffer(e) ? e : Buffer.from(e, f);
                    var u = o.length;
                    if (u === 0) {
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    }
                    for(i = 0; i < t - r; ++i){
                        this[i + r] = o[i % u];
                    }
                }
                return this;
            };
            var a = /[^+/0-9A-Za-z-_]/g;
            function base64clean(e) {
                e = e.split("=")[0];
                e = e.trim().replace(a, "");
                if (e.length < 2) return "";
                while(e.length % 4 !== 0){
                    e = e + "=";
                }
                return e;
            }
            function utf8ToBytes(e, r) {
                r = r || Infinity;
                var t;
                var f = e.length;
                var n = null;
                var i = [];
                for(var o = 0; o < f; ++o){
                    t = e.charCodeAt(o);
                    if (t > 55295 && t < 57344) {
                        if (!n) {
                            if (t > 56319) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            } else if (o + 1 === f) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            }
                            n = t;
                            continue;
                        }
                        if (t < 56320) {
                            if ((r -= 3) > -1) i.push(239, 191, 189);
                            n = t;
                            continue;
                        }
                        t = (n - 55296 << 10 | t - 56320) + 65536;
                    } else if (n) {
                        if ((r -= 3) > -1) i.push(239, 191, 189);
                    }
                    n = null;
                    if (t < 128) {
                        if ((r -= 1) < 0) break;
                        i.push(t);
                    } else if (t < 2048) {
                        if ((r -= 2) < 0) break;
                        i.push(t >> 6 | 192, t & 63 | 128);
                    } else if (t < 65536) {
                        if ((r -= 3) < 0) break;
                        i.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
                    } else if (t < 1114112) {
                        if ((r -= 4) < 0) break;
                        i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return i;
            }
            function asciiToBytes(e) {
                var r = [];
                for(var t = 0; t < e.length; ++t){
                    r.push(e.charCodeAt(t) & 255);
                }
                return r;
            }
            function utf16leToBytes(e, r) {
                var t, f, n;
                var i = [];
                for(var o = 0; o < e.length; ++o){
                    if ((r -= 2) < 0) break;
                    t = e.charCodeAt(o);
                    f = t >> 8;
                    n = t % 256;
                    i.push(n);
                    i.push(f);
                }
                return i;
            }
            function base64ToBytes(e) {
                return f.toByteArray(base64clean(e));
            }
            function blitBuffer(e, r, t, f) {
                for(var n = 0; n < f; ++n){
                    if (n + t >= r.length || n >= e.length) break;
                    r[n + t] = e[n];
                }
                return n;
            }
            function isInstance(e, r) {
                return e instanceof r || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === r.name;
            }
            function numberIsNaN(e) {
                return e !== e;
            }
            var s = function() {
                var e = "0123456789abcdef";
                var r = new Array(256);
                for(var t = 0; t < 16; ++t){
                    var f = t * 16;
                    for(var n = 0; n < 16; ++n){
                        r[f + n] = e[t] + e[n];
                    }
                }
                return r;
            }();
        },
        783: function(e, r) {
            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ r.read = function(e, r, t, f, n) {
                var i, o;
                var u = n * 8 - f - 1;
                var a = (1 << u) - 1;
                var s = a >> 1;
                var h = -7;
                var c = t ? n - 1 : 0;
                var l = t ? -1 : 1;
                var p = e[r + c];
                c += l;
                i = p & (1 << -h) - 1;
                p >>= -h;
                h += u;
                for(; h > 0; i = i * 256 + e[r + c], c += l, h -= 8){}
                o = i & (1 << -h) - 1;
                i >>= -h;
                h += f;
                for(; h > 0; o = o * 256 + e[r + c], c += l, h -= 8){}
                if (i === 0) {
                    i = 1 - s;
                } else if (i === a) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, f);
                    i = i - s;
                }
                return (p ? -1 : 1) * o * Math.pow(2, i - f);
            };
            r.write = function(e, r, t, f, n, i) {
                var o, u, a;
                var s = i * 8 - n - 1;
                var h = (1 << s) - 1;
                var c = h >> 1;
                var l = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = f ? 0 : i - 1;
                var y = f ? 1 : -1;
                var g = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
                r = Math.abs(r);
                if (isNaN(r) || r === Infinity) {
                    u = isNaN(r) ? 1 : 0;
                    o = h;
                } else {
                    o = Math.floor(Math.log(r) / Math.LN2);
                    if (r * (a = Math.pow(2, -o)) < 1) {
                        o--;
                        a *= 2;
                    }
                    if (o + c >= 1) {
                        r += l / a;
                    } else {
                        r += l * Math.pow(2, 1 - c);
                    }
                    if (r * a >= 2) {
                        o++;
                        a /= 2;
                    }
                    if (o + c >= h) {
                        u = 0;
                        o = h;
                    } else if (o + c >= 1) {
                        u = (r * a - 1) * Math.pow(2, n);
                        o = o + c;
                    } else {
                        u = r * Math.pow(2, c - 1) * Math.pow(2, n);
                        o = 0;
                    }
                }
                for(; n >= 8; e[t + p] = u & 255, p += y, u /= 256, n -= 8){}
                o = o << n | u;
                s += n;
                for(; s > 0; e[t + p] = o & 255, p += y, o /= 256, s -= 8){}
                e[t + p - y] |= g * 128;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var f = r[t];
        if (f !== undefined) {
            return f.exports;
        }
        var n = r[t] = {
            exports: {}
        };
        var i = true;
        try {
            e[t](n, n.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete r[t];
        }
        return n.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var t = __nccwpck_require__(72);
    module.exports = t;
})();
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/stream-browserify/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
(function() {
    var e = {
        782: function(e) {
            if (typeof Object.create === "function") {
                e.exports = function inherits(e, t) {
                    if (t) {
                        e.super_ = t;
                        e.prototype = Object.create(t.prototype, {
                            constructor: {
                                value: e,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    }
                };
            } else {
                e.exports = function inherits(e, t) {
                    if (t) {
                        e.super_ = t;
                        var TempCtor = function() {};
                        TempCtor.prototype = t.prototype;
                        e.prototype = new TempCtor;
                        e.prototype.constructor = e;
                    }
                };
            }
        },
        646: function(e) {
            "use strict";
            const t = {};
            function createErrorType(e, r, n) {
                if (!n) {
                    n = Error;
                }
                function getMessage(e, t, n) {
                    if (typeof r === "string") {
                        return r;
                    } else {
                        return r(e, t, n);
                    }
                }
                class NodeError extends n {
                    constructor(e, t, r){
                        super(getMessage(e, t, r));
                    }
                }
                NodeError.prototype.name = n.name;
                NodeError.prototype.code = e;
                t[e] = NodeError;
            }
            function oneOf(e, t) {
                if (Array.isArray(e)) {
                    const r = e.length;
                    e = e.map((e)=>String(e));
                    if (r > 2) {
                        return `one of ${t} ${e.slice(0, r - 1).join(", ")}, or ` + e[r - 1];
                    } else if (r === 2) {
                        return `one of ${t} ${e[0]} or ${e[1]}`;
                    } else {
                        return `of ${t} ${e[0]}`;
                    }
                } else {
                    return `of ${t} ${String(e)}`;
                }
            }
            function startsWith(e, t, r) {
                return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
            }
            function endsWith(e, t, r) {
                if (r === undefined || r > e.length) {
                    r = e.length;
                }
                return e.substring(r - t.length, r) === t;
            }
            function includes(e, t, r) {
                if (typeof r !== "number") {
                    r = 0;
                }
                if (r + t.length > e.length) {
                    return false;
                } else {
                    return e.indexOf(t, r) !== -1;
                }
            }
            createErrorType("ERR_INVALID_OPT_VALUE", function(e, t) {
                return 'The value "' + t + '" is invalid for option "' + e + '"';
            }, TypeError);
            createErrorType("ERR_INVALID_ARG_TYPE", function(e, t, r) {
                let n;
                if (typeof t === "string" && startsWith(t, "not ")) {
                    n = "must not be";
                    t = t.replace(/^not /, "");
                } else {
                    n = "must be";
                }
                let i;
                if (endsWith(e, " argument")) {
                    i = `The ${e} ${n} ${oneOf(t, "type")}`;
                } else {
                    const r = includes(e, ".") ? "property" : "argument";
                    i = `The "${e}" ${r} ${n} ${oneOf(t, "type")}`;
                }
                i += `. Received type ${typeof r}`;
                return i;
            }, TypeError);
            createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
            createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(e) {
                return "The " + e + " method is not implemented";
            });
            createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
            createErrorType("ERR_STREAM_DESTROYED", function(e) {
                return "Cannot call " + e + " after a stream was destroyed";
            });
            createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
            createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
            createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
            createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
            createErrorType("ERR_UNKNOWN_ENCODING", function(e) {
                return "Unknown encoding: " + e;
            }, TypeError);
            createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
            e.exports.q = t;
        },
        403: function(e, t, r) {
            "use strict";
            var n = Object.keys || function(e) {
                var t = [];
                for(var r in e){
                    t.push(r);
                }
                return t;
            };
            e.exports = Duplex;
            var i = r(709);
            var a = r(337);
            r(782)(Duplex, i);
            {
                var o = n(a.prototype);
                for(var s = 0; s < o.length; s++){
                    var f = o[s];
                    if (!Duplex.prototype[f]) Duplex.prototype[f] = a.prototype[f];
                }
            }
            function Duplex(e) {
                if (!(this instanceof Duplex)) return new Duplex(e);
                i.call(this, e);
                a.call(this, e);
                this.allowHalfOpen = true;
                if (e) {
                    if (e.readable === false) this.readable = false;
                    if (e.writable === false) this.writable = false;
                    if (e.allowHalfOpen === false) {
                        this.allowHalfOpen = false;
                        this.once("end", onend);
                    }
                }
            }
            Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
                enumerable: false,
                get: function get() {
                    return this._writableState.highWaterMark;
                }
            });
            Object.defineProperty(Duplex.prototype, "writableBuffer", {
                enumerable: false,
                get: function get() {
                    return this._writableState && this._writableState.getBuffer();
                }
            });
            Object.defineProperty(Duplex.prototype, "writableLength", {
                enumerable: false,
                get: function get() {
                    return this._writableState.length;
                }
            });
            function onend() {
                if (this._writableState.ended) return;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(onEndNT, this);
            }
            function onEndNT(e) {
                e.end();
            }
            Object.defineProperty(Duplex.prototype, "destroyed", {
                enumerable: false,
                get: function get() {
                    if (this._readableState === undefined || this._writableState === undefined) {
                        return false;
                    }
                    return this._readableState.destroyed && this._writableState.destroyed;
                },
                set: function set(e) {
                    if (this._readableState === undefined || this._writableState === undefined) {
                        return;
                    }
                    this._readableState.destroyed = e;
                    this._writableState.destroyed = e;
                }
            });
        },
        889: function(e, t, r) {
            "use strict";
            e.exports = PassThrough;
            var n = r(170);
            r(782)(PassThrough, n);
            function PassThrough(e) {
                if (!(this instanceof PassThrough)) return new PassThrough(e);
                n.call(this, e);
            }
            PassThrough.prototype._transform = function(e, t, r) {
                r(null, e);
            };
        },
        709: function(e, t, r) {
            "use strict";
            e.exports = Readable;
            var n;
            Readable.ReadableState = ReadableState;
            var i = r(361).EventEmitter;
            var a = function EElistenerCount(e, t) {
                return e.listeners(t).length;
            };
            var o = r(678);
            var s = r(300).Buffer;
            var f = global.Uint8Array || function() {};
            function _uint8ArrayToBuffer(e) {
                return s.from(e);
            }
            function _isUint8Array(e) {
                return s.isBuffer(e) || e instanceof f;
            }
            var l = r(837);
            var u;
            if (l && l.debuglog) {
                u = l.debuglog("stream");
            } else {
                u = function debug() {};
            }
            var d = r(379);
            var c = r(25);
            var h = r(776), p = h.getHighWaterMark;
            var b = r(646).q, g = b.ERR_INVALID_ARG_TYPE, y = b.ERR_STREAM_PUSH_AFTER_EOF, _ = b.ERR_METHOD_NOT_IMPLEMENTED, v = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
            var w;
            var m;
            var S;
            r(782)(Readable, o);
            var R = c.errorOrDestroy;
            var E = [
                "error",
                "close",
                "destroy",
                "pause",
                "resume"
            ];
            function prependListener(e, t, r) {
                if (typeof e.prependListener === "function") return e.prependListener(t, r);
                if (!e._events || !e._events[t]) e.on(t, r);
                else if (Array.isArray(e._events[t])) e._events[t].unshift(r);
                else e._events[t] = [
                    r,
                    e._events[t]
                ];
            }
            function ReadableState(e, t, i) {
                n = n || r(403);
                e = e || {};
                if (typeof i !== "boolean") i = t instanceof n;
                this.objectMode = !!e.objectMode;
                if (i) this.objectMode = this.objectMode || !!e.readableObjectMode;
                this.highWaterMark = p(this, e, "readableHighWaterMark", i);
                this.buffer = new d;
                this.length = 0;
                this.pipes = null;
                this.pipesCount = 0;
                this.flowing = null;
                this.ended = false;
                this.endEmitted = false;
                this.reading = false;
                this.sync = true;
                this.needReadable = false;
                this.emittedReadable = false;
                this.readableListening = false;
                this.resumeScheduled = false;
                this.paused = true;
                this.emitClose = e.emitClose !== false;
                this.autoDestroy = !!e.autoDestroy;
                this.destroyed = false;
                this.defaultEncoding = e.defaultEncoding || "utf8";
                this.awaitDrain = 0;
                this.readingMore = false;
                this.decoder = null;
                this.encoding = null;
                if (e.encoding) {
                    if (!w) w = r(704).s;
                    this.decoder = new w(e.encoding);
                    this.encoding = e.encoding;
                }
            }
            function Readable(e) {
                n = n || r(403);
                if (!(this instanceof Readable)) return new Readable(e);
                var t = this instanceof n;
                this._readableState = new ReadableState(e, this, t);
                this.readable = true;
                if (e) {
                    if (typeof e.read === "function") this._read = e.read;
                    if (typeof e.destroy === "function") this._destroy = e.destroy;
                }
                o.call(this);
            }
            Object.defineProperty(Readable.prototype, "destroyed", {
                enumerable: false,
                get: function get() {
                    if (this._readableState === undefined) {
                        return false;
                    }
                    return this._readableState.destroyed;
                },
                set: function set(e) {
                    if (!this._readableState) {
                        return;
                    }
                    this._readableState.destroyed = e;
                }
            });
            Readable.prototype.destroy = c.destroy;
            Readable.prototype._undestroy = c.undestroy;
            Readable.prototype._destroy = function(e, t) {
                t(e);
            };
            Readable.prototype.push = function(e, t) {
                var r = this._readableState;
                var n;
                if (!r.objectMode) {
                    if (typeof e === "string") {
                        t = t || r.defaultEncoding;
                        if (t !== r.encoding) {
                            e = s.from(e, t);
                            t = "";
                        }
                        n = true;
                    }
                } else {
                    n = true;
                }
                return readableAddChunk(this, e, t, false, n);
            };
            Readable.prototype.unshift = function(e) {
                return readableAddChunk(this, e, null, true, false);
            };
            function readableAddChunk(e, t, r, n, i) {
                u("readableAddChunk", t);
                var a = e._readableState;
                if (t === null) {
                    a.reading = false;
                    onEofChunk(e, a);
                } else {
                    var o;
                    if (!i) o = chunkInvalid(a, t);
                    if (o) {
                        R(e, o);
                    } else if (a.objectMode || t && t.length > 0) {
                        if (typeof t !== "string" && !a.objectMode && Object.getPrototypeOf(t) !== s.prototype) {
                            t = _uint8ArrayToBuffer(t);
                        }
                        if (n) {
                            if (a.endEmitted) R(e, new v);
                            else addChunk(e, a, t, true);
                        } else if (a.ended) {
                            R(e, new y);
                        } else if (a.destroyed) {
                            return false;
                        } else {
                            a.reading = false;
                            if (a.decoder && !r) {
                                t = a.decoder.write(t);
                                if (a.objectMode || t.length !== 0) addChunk(e, a, t, false);
                                else maybeReadMore(e, a);
                            } else {
                                addChunk(e, a, t, false);
                            }
                        }
                    } else if (!n) {
                        a.reading = false;
                        maybeReadMore(e, a);
                    }
                }
                return !a.ended && (a.length < a.highWaterMark || a.length === 0);
            }
            function addChunk(e, t, r, n) {
                if (t.flowing && t.length === 0 && !t.sync) {
                    t.awaitDrain = 0;
                    e.emit("data", r);
                } else {
                    t.length += t.objectMode ? 1 : r.length;
                    if (n) t.buffer.unshift(r);
                    else t.buffer.push(r);
                    if (t.needReadable) emitReadable(e);
                }
                maybeReadMore(e, t);
            }
            function chunkInvalid(e, t) {
                var r;
                if (!_isUint8Array(t) && typeof t !== "string" && t !== undefined && !e.objectMode) {
                    r = new g("chunk", [
                        "string",
                        "Buffer",
                        "Uint8Array"
                    ], t);
                }
                return r;
            }
            Readable.prototype.isPaused = function() {
                return this._readableState.flowing === false;
            };
            Readable.prototype.setEncoding = function(e) {
                if (!w) w = r(704).s;
                var t = new w(e);
                this._readableState.decoder = t;
                this._readableState.encoding = this._readableState.decoder.encoding;
                var n = this._readableState.buffer.head;
                var i = "";
                while(n !== null){
                    i += t.write(n.data);
                    n = n.next;
                }
                this._readableState.buffer.clear();
                if (i !== "") this._readableState.buffer.push(i);
                this._readableState.length = i.length;
                return this;
            };
            var T = 1073741824;
            function computeNewHighWaterMark(e) {
                if (e >= T) {
                    e = T;
                } else {
                    e--;
                    e |= e >>> 1;
                    e |= e >>> 2;
                    e |= e >>> 4;
                    e |= e >>> 8;
                    e |= e >>> 16;
                    e++;
                }
                return e;
            }
            function howMuchToRead(e, t) {
                if (e <= 0 || t.length === 0 && t.ended) return 0;
                if (t.objectMode) return 1;
                if (e !== e) {
                    if (t.flowing && t.length) return t.buffer.head.data.length;
                    else return t.length;
                }
                if (e > t.highWaterMark) t.highWaterMark = computeNewHighWaterMark(e);
                if (e <= t.length) return e;
                if (!t.ended) {
                    t.needReadable = true;
                    return 0;
                }
                return t.length;
            }
            Readable.prototype.read = function(e) {
                u("read", e);
                e = parseInt(e, 10);
                var t = this._readableState;
                var r = e;
                if (e !== 0) t.emittedReadable = false;
                if (e === 0 && t.needReadable && ((t.highWaterMark !== 0 ? t.length >= t.highWaterMark : t.length > 0) || t.ended)) {
                    u("read: emitReadable", t.length, t.ended);
                    if (t.length === 0 && t.ended) endReadable(this);
                    else emitReadable(this);
                    return null;
                }
                e = howMuchToRead(e, t);
                if (e === 0 && t.ended) {
                    if (t.length === 0) endReadable(this);
                    return null;
                }
                var n = t.needReadable;
                u("need readable", n);
                if (t.length === 0 || t.length - e < t.highWaterMark) {
                    n = true;
                    u("length less than watermark", n);
                }
                if (t.ended || t.reading) {
                    n = false;
                    u("reading or ended", n);
                } else if (n) {
                    u("do read");
                    t.reading = true;
                    t.sync = true;
                    if (t.length === 0) t.needReadable = true;
                    this._read(t.highWaterMark);
                    t.sync = false;
                    if (!t.reading) e = howMuchToRead(r, t);
                }
                var i;
                if (e > 0) i = fromList(e, t);
                else i = null;
                if (i === null) {
                    t.needReadable = t.length <= t.highWaterMark;
                    e = 0;
                } else {
                    t.length -= e;
                    t.awaitDrain = 0;
                }
                if (t.length === 0) {
                    if (!t.ended) t.needReadable = true;
                    if (r !== e && t.ended) endReadable(this);
                }
                if (i !== null) this.emit("data", i);
                return i;
            };
            function onEofChunk(e, t) {
                u("onEofChunk");
                if (t.ended) return;
                if (t.decoder) {
                    var r = t.decoder.end();
                    if (r && r.length) {
                        t.buffer.push(r);
                        t.length += t.objectMode ? 1 : r.length;
                    }
                }
                t.ended = true;
                if (t.sync) {
                    emitReadable(e);
                } else {
                    t.needReadable = false;
                    if (!t.emittedReadable) {
                        t.emittedReadable = true;
                        emitReadable_(e);
                    }
                }
            }
            function emitReadable(e) {
                var t = e._readableState;
                u("emitReadable", t.needReadable, t.emittedReadable);
                t.needReadable = false;
                if (!t.emittedReadable) {
                    u("emitReadable", t.flowing);
                    t.emittedReadable = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitReadable_, e);
                }
            }
            function emitReadable_(e) {
                var t = e._readableState;
                u("emitReadable_", t.destroyed, t.length, t.ended);
                if (!t.destroyed && (t.length || t.ended)) {
                    e.emit("readable");
                    t.emittedReadable = false;
                }
                t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark;
                flow(e);
            }
            function maybeReadMore(e, t) {
                if (!t.readingMore) {
                    t.readingMore = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(maybeReadMore_, e, t);
                }
            }
            function maybeReadMore_(e, t) {
                while(!t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && t.length === 0)){
                    var r = t.length;
                    u("maybeReadMore read 0");
                    e.read(0);
                    if (r === t.length) break;
                }
                t.readingMore = false;
            }
            Readable.prototype._read = function(e) {
                R(this, new _("_read()"));
            };
            Readable.prototype.pipe = function(e, t) {
                var r = this;
                var n = this._readableState;
                switch(n.pipesCount){
                    case 0:
                        n.pipes = e;
                        break;
                    case 1:
                        n.pipes = [
                            n.pipes,
                            e
                        ];
                        break;
                    default:
                        n.pipes.push(e);
                        break;
                }
                n.pipesCount += 1;
                u("pipe count=%d opts=%j", n.pipesCount, t);
                var i = (!t || t.end !== false) && e !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stdout && e !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stderr;
                var o = i ? onend : unpipe;
                if (n.endEmitted) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(o);
                else r.once("end", o);
                e.on("unpipe", onunpipe);
                function onunpipe(e, t) {
                    u("onunpipe");
                    if (e === r) {
                        if (t && t.hasUnpiped === false) {
                            t.hasUnpiped = true;
                            cleanup();
                        }
                    }
                }
                function onend() {
                    u("onend");
                    e.end();
                }
                var s = pipeOnDrain(r);
                e.on("drain", s);
                var f = false;
                function cleanup() {
                    u("cleanup");
                    e.removeListener("close", onclose);
                    e.removeListener("finish", onfinish);
                    e.removeListener("drain", s);
                    e.removeListener("error", onerror);
                    e.removeListener("unpipe", onunpipe);
                    r.removeListener("end", onend);
                    r.removeListener("end", unpipe);
                    r.removeListener("data", ondata);
                    f = true;
                    if (n.awaitDrain && (!e._writableState || e._writableState.needDrain)) s();
                }
                r.on("data", ondata);
                function ondata(t) {
                    u("ondata");
                    var i = e.write(t);
                    u("dest.write", i);
                    if (i === false) {
                        if ((n.pipesCount === 1 && n.pipes === e || n.pipesCount > 1 && indexOf(n.pipes, e) !== -1) && !f) {
                            u("false write response, pause", n.awaitDrain);
                            n.awaitDrain++;
                        }
                        r.pause();
                    }
                }
                function onerror(t) {
                    u("onerror", t);
                    unpipe();
                    e.removeListener("error", onerror);
                    if (a(e, "error") === 0) R(e, t);
                }
                prependListener(e, "error", onerror);
                function onclose() {
                    e.removeListener("finish", onfinish);
                    unpipe();
                }
                e.once("close", onclose);
                function onfinish() {
                    u("onfinish");
                    e.removeListener("close", onclose);
                    unpipe();
                }
                e.once("finish", onfinish);
                function unpipe() {
                    u("unpipe");
                    r.unpipe(e);
                }
                e.emit("pipe", r);
                if (!n.flowing) {
                    u("pipe resume");
                    r.resume();
                }
                return e;
            };
            function pipeOnDrain(e) {
                return function pipeOnDrainFunctionResult() {
                    var t = e._readableState;
                    u("pipeOnDrain", t.awaitDrain);
                    if (t.awaitDrain) t.awaitDrain--;
                    if (t.awaitDrain === 0 && a(e, "data")) {
                        t.flowing = true;
                        flow(e);
                    }
                };
            }
            Readable.prototype.unpipe = function(e) {
                var t = this._readableState;
                var r = {
                    hasUnpiped: false
                };
                if (t.pipesCount === 0) return this;
                if (t.pipesCount === 1) {
                    if (e && e !== t.pipes) return this;
                    if (!e) e = t.pipes;
                    t.pipes = null;
                    t.pipesCount = 0;
                    t.flowing = false;
                    if (e) e.emit("unpipe", this, r);
                    return this;
                }
                if (!e) {
                    var n = t.pipes;
                    var i = t.pipesCount;
                    t.pipes = null;
                    t.pipesCount = 0;
                    t.flowing = false;
                    for(var a = 0; a < i; a++){
                        n[a].emit("unpipe", this, {
                            hasUnpiped: false
                        });
                    }
                    return this;
                }
                var o = indexOf(t.pipes, e);
                if (o === -1) return this;
                t.pipes.splice(o, 1);
                t.pipesCount -= 1;
                if (t.pipesCount === 1) t.pipes = t.pipes[0];
                e.emit("unpipe", this, r);
                return this;
            };
            Readable.prototype.on = function(e, t) {
                var r = o.prototype.on.call(this, e, t);
                var n = this._readableState;
                if (e === "data") {
                    n.readableListening = this.listenerCount("readable") > 0;
                    if (n.flowing !== false) this.resume();
                } else if (e === "readable") {
                    if (!n.endEmitted && !n.readableListening) {
                        n.readableListening = n.needReadable = true;
                        n.flowing = false;
                        n.emittedReadable = false;
                        u("on readable", n.length, n.reading);
                        if (n.length) {
                            emitReadable(this);
                        } else if (!n.reading) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(nReadingNextTick, this);
                        }
                    }
                }
                return r;
            };
            Readable.prototype.addListener = Readable.prototype.on;
            Readable.prototype.removeListener = function(e, t) {
                var r = o.prototype.removeListener.call(this, e, t);
                if (e === "readable") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(updateReadableListening, this);
                }
                return r;
            };
            Readable.prototype.removeAllListeners = function(e) {
                var t = o.prototype.removeAllListeners.apply(this, arguments);
                if (e === "readable" || e === undefined) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(updateReadableListening, this);
                }
                return t;
            };
            function updateReadableListening(e) {
                var t = e._readableState;
                t.readableListening = e.listenerCount("readable") > 0;
                if (t.resumeScheduled && !t.paused) {
                    t.flowing = true;
                } else if (e.listenerCount("data") > 0) {
                    e.resume();
                }
            }
            function nReadingNextTick(e) {
                u("readable nexttick read 0");
                e.read(0);
            }
            Readable.prototype.resume = function() {
                var e = this._readableState;
                if (!e.flowing) {
                    u("resume");
                    e.flowing = !e.readableListening;
                    resume(this, e);
                }
                e.paused = false;
                return this;
            };
            function resume(e, t) {
                if (!t.resumeScheduled) {
                    t.resumeScheduled = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(resume_, e, t);
                }
            }
            function resume_(e, t) {
                u("resume", t.reading);
                if (!t.reading) {
                    e.read(0);
                }
                t.resumeScheduled = false;
                e.emit("resume");
                flow(e);
                if (t.flowing && !t.reading) e.read(0);
            }
            Readable.prototype.pause = function() {
                u("call pause flowing=%j", this._readableState.flowing);
                if (this._readableState.flowing !== false) {
                    u("pause");
                    this._readableState.flowing = false;
                    this.emit("pause");
                }
                this._readableState.paused = true;
                return this;
            };
            function flow(e) {
                var t = e._readableState;
                u("flow", t.flowing);
                while(t.flowing && e.read() !== null){}
            }
            Readable.prototype.wrap = function(e) {
                var t = this;
                var r = this._readableState;
                var n = false;
                e.on("end", function() {
                    u("wrapped end");
                    if (r.decoder && !r.ended) {
                        var e = r.decoder.end();
                        if (e && e.length) t.push(e);
                    }
                    t.push(null);
                });
                e.on("data", function(i) {
                    u("wrapped data");
                    if (r.decoder) i = r.decoder.write(i);
                    if (r.objectMode && (i === null || i === undefined)) return;
                    else if (!r.objectMode && (!i || !i.length)) return;
                    var a = t.push(i);
                    if (!a) {
                        n = true;
                        e.pause();
                    }
                });
                for(var i in e){
                    if (this[i] === undefined && typeof e[i] === "function") {
                        this[i] = function methodWrap(t) {
                            return function methodWrapReturnFunction() {
                                return e[t].apply(e, arguments);
                            };
                        }(i);
                    }
                }
                for(var a = 0; a < E.length; a++){
                    e.on(E[a], this.emit.bind(this, E[a]));
                }
                this._read = function(t) {
                    u("wrapped _read", t);
                    if (n) {
                        n = false;
                        e.resume();
                    }
                };
                return this;
            };
            if (typeof Symbol === "function") {
                Readable.prototype[Symbol.asyncIterator] = function() {
                    if (m === undefined) {
                        m = r(871);
                    }
                    return m(this);
                };
            }
            Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
                enumerable: false,
                get: function get() {
                    return this._readableState.highWaterMark;
                }
            });
            Object.defineProperty(Readable.prototype, "readableBuffer", {
                enumerable: false,
                get: function get() {
                    return this._readableState && this._readableState.buffer;
                }
            });
            Object.defineProperty(Readable.prototype, "readableFlowing", {
                enumerable: false,
                get: function get() {
                    return this._readableState.flowing;
                },
                set: function set(e) {
                    if (this._readableState) {
                        this._readableState.flowing = e;
                    }
                }
            });
            Readable._fromList = fromList;
            Object.defineProperty(Readable.prototype, "readableLength", {
                enumerable: false,
                get: function get() {
                    return this._readableState.length;
                }
            });
            function fromList(e, t) {
                if (t.length === 0) return null;
                var r;
                if (t.objectMode) r = t.buffer.shift();
                else if (!e || e >= t.length) {
                    if (t.decoder) r = t.buffer.join("");
                    else if (t.buffer.length === 1) r = t.buffer.first();
                    else r = t.buffer.concat(t.length);
                    t.buffer.clear();
                } else {
                    r = t.buffer.consume(e, t.decoder);
                }
                return r;
            }
            function endReadable(e) {
                var t = e._readableState;
                u("endReadable", t.endEmitted);
                if (!t.endEmitted) {
                    t.ended = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(endReadableNT, t, e);
                }
            }
            function endReadableNT(e, t) {
                u("endReadableNT", e.endEmitted, e.length);
                if (!e.endEmitted && e.length === 0) {
                    e.endEmitted = true;
                    t.readable = false;
                    t.emit("end");
                    if (e.autoDestroy) {
                        var r = t._writableState;
                        if (!r || r.autoDestroy && r.finished) {
                            t.destroy();
                        }
                    }
                }
            }
            if (typeof Symbol === "function") {
                Readable.from = function(e, t) {
                    if (S === undefined) {
                        S = r(727);
                    }
                    return S(Readable, e, t);
                };
            }
            function indexOf(e, t) {
                for(var r = 0, n = e.length; r < n; r++){
                    if (e[r] === t) return r;
                }
                return -1;
            }
        },
        170: function(e, t, r) {
            "use strict";
            e.exports = Transform;
            var n = r(646).q, i = n.ERR_METHOD_NOT_IMPLEMENTED, a = n.ERR_MULTIPLE_CALLBACK, o = n.ERR_TRANSFORM_ALREADY_TRANSFORMING, s = n.ERR_TRANSFORM_WITH_LENGTH_0;
            var f = r(403);
            r(782)(Transform, f);
            function afterTransform(e, t) {
                var r = this._transformState;
                r.transforming = false;
                var n = r.writecb;
                if (n === null) {
                    return this.emit("error", new a);
                }
                r.writechunk = null;
                r.writecb = null;
                if (t != null) this.push(t);
                n(e);
                var i = this._readableState;
                i.reading = false;
                if (i.needReadable || i.length < i.highWaterMark) {
                    this._read(i.highWaterMark);
                }
            }
            function Transform(e) {
                if (!(this instanceof Transform)) return new Transform(e);
                f.call(this, e);
                this._transformState = {
                    afterTransform: afterTransform.bind(this),
                    needTransform: false,
                    transforming: false,
                    writecb: null,
                    writechunk: null,
                    writeencoding: null
                };
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                if (e) {
                    if (typeof e.transform === "function") this._transform = e.transform;
                    if (typeof e.flush === "function") this._flush = e.flush;
                }
                this.on("prefinish", prefinish);
            }
            function prefinish() {
                var e = this;
                if (typeof this._flush === "function" && !this._readableState.destroyed) {
                    this._flush(function(t, r) {
                        done(e, t, r);
                    });
                } else {
                    done(this, null, null);
                }
            }
            Transform.prototype.push = function(e, t) {
                this._transformState.needTransform = false;
                return f.prototype.push.call(this, e, t);
            };
            Transform.prototype._transform = function(e, t, r) {
                r(new i("_transform()"));
            };
            Transform.prototype._write = function(e, t, r) {
                var n = this._transformState;
                n.writecb = r;
                n.writechunk = e;
                n.writeencoding = t;
                if (!n.transforming) {
                    var i = this._readableState;
                    if (n.needTransform || i.needReadable || i.length < i.highWaterMark) this._read(i.highWaterMark);
                }
            };
            Transform.prototype._read = function(e) {
                var t = this._transformState;
                if (t.writechunk !== null && !t.transforming) {
                    t.transforming = true;
                    this._transform(t.writechunk, t.writeencoding, t.afterTransform);
                } else {
                    t.needTransform = true;
                }
            };
            Transform.prototype._destroy = function(e, t) {
                f.prototype._destroy.call(this, e, function(e) {
                    t(e);
                });
            };
            function done(e, t, r) {
                if (t) return e.emit("error", t);
                if (r != null) e.push(r);
                if (e._writableState.length) throw new s;
                if (e._transformState.transforming) throw new o;
                return e.push(null);
            }
        },
        337: function(e, t, r) {
            "use strict";
            e.exports = Writable;
            function WriteReq(e, t, r) {
                this.chunk = e;
                this.encoding = t;
                this.callback = r;
                this.next = null;
            }
            function CorkedRequest(e) {
                var t = this;
                this.next = null;
                this.entry = null;
                this.finish = function() {
                    onCorkedFinish(t, e);
                };
            }
            var n;
            Writable.WritableState = WritableState;
            var i = {
                deprecate: r(769)
            };
            var a = r(678);
            var o = r(300).Buffer;
            var s = global.Uint8Array || function() {};
            function _uint8ArrayToBuffer(e) {
                return o.from(e);
            }
            function _isUint8Array(e) {
                return o.isBuffer(e) || e instanceof s;
            }
            var f = r(25);
            var l = r(776), u = l.getHighWaterMark;
            var d = r(646).q, c = d.ERR_INVALID_ARG_TYPE, h = d.ERR_METHOD_NOT_IMPLEMENTED, p = d.ERR_MULTIPLE_CALLBACK, b = d.ERR_STREAM_CANNOT_PIPE, g = d.ERR_STREAM_DESTROYED, y = d.ERR_STREAM_NULL_VALUES, _ = d.ERR_STREAM_WRITE_AFTER_END, v = d.ERR_UNKNOWN_ENCODING;
            var w = f.errorOrDestroy;
            r(782)(Writable, a);
            function nop() {}
            function WritableState(e, t, i) {
                n = n || r(403);
                e = e || {};
                if (typeof i !== "boolean") i = t instanceof n;
                this.objectMode = !!e.objectMode;
                if (i) this.objectMode = this.objectMode || !!e.writableObjectMode;
                this.highWaterMark = u(this, e, "writableHighWaterMark", i);
                this.finalCalled = false;
                this.needDrain = false;
                this.ending = false;
                this.ended = false;
                this.finished = false;
                this.destroyed = false;
                var a = e.decodeStrings === false;
                this.decodeStrings = !a;
                this.defaultEncoding = e.defaultEncoding || "utf8";
                this.length = 0;
                this.writing = false;
                this.corked = 0;
                this.sync = true;
                this.bufferProcessing = false;
                this.onwrite = function(e) {
                    onwrite(t, e);
                };
                this.writecb = null;
                this.writelen = 0;
                this.bufferedRequest = null;
                this.lastBufferedRequest = null;
                this.pendingcb = 0;
                this.prefinished = false;
                this.errorEmitted = false;
                this.emitClose = e.emitClose !== false;
                this.autoDestroy = !!e.autoDestroy;
                this.bufferedRequestCount = 0;
                this.corkedRequestsFree = new CorkedRequest(this);
            }
            WritableState.prototype.getBuffer = function getBuffer() {
                var e = this.bufferedRequest;
                var t = [];
                while(e){
                    t.push(e);
                    e = e.next;
                }
                return t;
            };
            (function() {
                try {
                    Object.defineProperty(WritableState.prototype, "buffer", {
                        get: i.deprecate(function writableStateBufferGetter() {
                            return this.getBuffer();
                        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
                    });
                } catch (e) {}
            })();
            var m;
            if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
                m = Function.prototype[Symbol.hasInstance];
                Object.defineProperty(Writable, Symbol.hasInstance, {
                    value: function value(e) {
                        if (m.call(this, e)) return true;
                        if (this !== Writable) return false;
                        return e && e._writableState instanceof WritableState;
                    }
                });
            } else {
                m = function realHasInstance(e) {
                    return e instanceof this;
                };
            }
            function Writable(e) {
                n = n || r(403);
                var t = this instanceof n;
                if (!t && !m.call(Writable, this)) return new Writable(e);
                this._writableState = new WritableState(e, this, t);
                this.writable = true;
                if (e) {
                    if (typeof e.write === "function") this._write = e.write;
                    if (typeof e.writev === "function") this._writev = e.writev;
                    if (typeof e.destroy === "function") this._destroy = e.destroy;
                    if (typeof e.final === "function") this._final = e.final;
                }
                a.call(this);
            }
            Writable.prototype.pipe = function() {
                w(this, new b);
            };
            function writeAfterEnd(e, t) {
                var r = new _;
                w(e, r);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(t, r);
            }
            function validChunk(e, t, r, n) {
                var i;
                if (r === null) {
                    i = new y;
                } else if (typeof r !== "string" && !t.objectMode) {
                    i = new c("chunk", [
                        "string",
                        "Buffer"
                    ], r);
                }
                if (i) {
                    w(e, i);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(n, i);
                    return false;
                }
                return true;
            }
            Writable.prototype.write = function(e, t, r) {
                var n = this._writableState;
                var i = false;
                var a = !n.objectMode && _isUint8Array(e);
                if (a && !o.isBuffer(e)) {
                    e = _uint8ArrayToBuffer(e);
                }
                if (typeof t === "function") {
                    r = t;
                    t = null;
                }
                if (a) t = "buffer";
                else if (!t) t = n.defaultEncoding;
                if (typeof r !== "function") r = nop;
                if (n.ending) writeAfterEnd(this, r);
                else if (a || validChunk(this, n, e, r)) {
                    n.pendingcb++;
                    i = writeOrBuffer(this, n, a, e, t, r);
                }
                return i;
            };
            Writable.prototype.cork = function() {
                this._writableState.corked++;
            };
            Writable.prototype.uncork = function() {
                var e = this._writableState;
                if (e.corked) {
                    e.corked--;
                    if (!e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest) clearBuffer(this, e);
                }
            };
            Writable.prototype.setDefaultEncoding = function setDefaultEncoding(e) {
                if (typeof e === "string") e = e.toLowerCase();
                if (!([
                    "hex",
                    "utf8",
                    "utf-8",
                    "ascii",
                    "binary",
                    "base64",
                    "ucs2",
                    "ucs-2",
                    "utf16le",
                    "utf-16le",
                    "raw"
                ].indexOf((e + "").toLowerCase()) > -1)) throw new v(e);
                this._writableState.defaultEncoding = e;
                return this;
            };
            Object.defineProperty(Writable.prototype, "writableBuffer", {
                enumerable: false,
                get: function get() {
                    return this._writableState && this._writableState.getBuffer();
                }
            });
            function decodeChunk(e, t, r) {
                if (!e.objectMode && e.decodeStrings !== false && typeof t === "string") {
                    t = o.from(t, r);
                }
                return t;
            }
            Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
                enumerable: false,
                get: function get() {
                    return this._writableState.highWaterMark;
                }
            });
            function writeOrBuffer(e, t, r, n, i, a) {
                if (!r) {
                    var o = decodeChunk(t, n, i);
                    if (n !== o) {
                        r = true;
                        i = "buffer";
                        n = o;
                    }
                }
                var s = t.objectMode ? 1 : n.length;
                t.length += s;
                var f = t.length < t.highWaterMark;
                if (!f) t.needDrain = true;
                if (t.writing || t.corked) {
                    var l = t.lastBufferedRequest;
                    t.lastBufferedRequest = {
                        chunk: n,
                        encoding: i,
                        isBuf: r,
                        callback: a,
                        next: null
                    };
                    if (l) {
                        l.next = t.lastBufferedRequest;
                    } else {
                        t.bufferedRequest = t.lastBufferedRequest;
                    }
                    t.bufferedRequestCount += 1;
                } else {
                    doWrite(e, t, false, s, n, i, a);
                }
                return f;
            }
            function doWrite(e, t, r, n, i, a, o) {
                t.writelen = n;
                t.writecb = o;
                t.writing = true;
                t.sync = true;
                if (t.destroyed) t.onwrite(new g("write"));
                else if (r) e._writev(i, t.onwrite);
                else e._write(i, a, t.onwrite);
                t.sync = false;
            }
            function onwriteError(e, t, r, n, i) {
                --t.pendingcb;
                if (r) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(i, n);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(finishMaybe, e, t);
                    e._writableState.errorEmitted = true;
                    w(e, n);
                } else {
                    i(n);
                    e._writableState.errorEmitted = true;
                    w(e, n);
                    finishMaybe(e, t);
                }
            }
            function onwriteStateUpdate(e) {
                e.writing = false;
                e.writecb = null;
                e.length -= e.writelen;
                e.writelen = 0;
            }
            function onwrite(e, t) {
                var r = e._writableState;
                var n = r.sync;
                var i = r.writecb;
                if (typeof i !== "function") throw new p;
                onwriteStateUpdate(r);
                if (t) onwriteError(e, r, n, t, i);
                else {
                    var a = needFinish(r) || e.destroyed;
                    if (!a && !r.corked && !r.bufferProcessing && r.bufferedRequest) {
                        clearBuffer(e, r);
                    }
                    if (n) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(afterWrite, e, r, a, i);
                    } else {
                        afterWrite(e, r, a, i);
                    }
                }
            }
            function afterWrite(e, t, r, n) {
                if (!r) onwriteDrain(e, t);
                t.pendingcb--;
                n();
                finishMaybe(e, t);
            }
            function onwriteDrain(e, t) {
                if (t.length === 0 && t.needDrain) {
                    t.needDrain = false;
                    e.emit("drain");
                }
            }
            function clearBuffer(e, t) {
                t.bufferProcessing = true;
                var r = t.bufferedRequest;
                if (e._writev && r && r.next) {
                    var n = t.bufferedRequestCount;
                    var i = new Array(n);
                    var a = t.corkedRequestsFree;
                    a.entry = r;
                    var o = 0;
                    var s = true;
                    while(r){
                        i[o] = r;
                        if (!r.isBuf) s = false;
                        r = r.next;
                        o += 1;
                    }
                    i.allBuffers = s;
                    doWrite(e, t, true, t.length, i, "", a.finish);
                    t.pendingcb++;
                    t.lastBufferedRequest = null;
                    if (a.next) {
                        t.corkedRequestsFree = a.next;
                        a.next = null;
                    } else {
                        t.corkedRequestsFree = new CorkedRequest(t);
                    }
                    t.bufferedRequestCount = 0;
                } else {
                    while(r){
                        var f = r.chunk;
                        var l = r.encoding;
                        var u = r.callback;
                        var d = t.objectMode ? 1 : f.length;
                        doWrite(e, t, false, d, f, l, u);
                        r = r.next;
                        t.bufferedRequestCount--;
                        if (t.writing) {
                            break;
                        }
                    }
                    if (r === null) t.lastBufferedRequest = null;
                }
                t.bufferedRequest = r;
                t.bufferProcessing = false;
            }
            Writable.prototype._write = function(e, t, r) {
                r(new h("_write()"));
            };
            Writable.prototype._writev = null;
            Writable.prototype.end = function(e, t, r) {
                var n = this._writableState;
                if (typeof e === "function") {
                    r = e;
                    e = null;
                    t = null;
                } else if (typeof t === "function") {
                    r = t;
                    t = null;
                }
                if (e !== null && e !== undefined) this.write(e, t);
                if (n.corked) {
                    n.corked = 1;
                    this.uncork();
                }
                if (!n.ending) endWritable(this, n, r);
                return this;
            };
            Object.defineProperty(Writable.prototype, "writableLength", {
                enumerable: false,
                get: function get() {
                    return this._writableState.length;
                }
            });
            function needFinish(e) {
                return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
            }
            function callFinal(e, t) {
                e._final(function(r) {
                    t.pendingcb--;
                    if (r) {
                        w(e, r);
                    }
                    t.prefinished = true;
                    e.emit("prefinish");
                    finishMaybe(e, t);
                });
            }
            function prefinish(e, t) {
                if (!t.prefinished && !t.finalCalled) {
                    if (typeof e._final === "function" && !t.destroyed) {
                        t.pendingcb++;
                        t.finalCalled = true;
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(callFinal, e, t);
                    } else {
                        t.prefinished = true;
                        e.emit("prefinish");
                    }
                }
            }
            function finishMaybe(e, t) {
                var r = needFinish(t);
                if (r) {
                    prefinish(e, t);
                    if (t.pendingcb === 0) {
                        t.finished = true;
                        e.emit("finish");
                        if (t.autoDestroy) {
                            var n = e._readableState;
                            if (!n || n.autoDestroy && n.endEmitted) {
                                e.destroy();
                            }
                        }
                    }
                }
                return r;
            }
            function endWritable(e, t, r) {
                t.ending = true;
                finishMaybe(e, t);
                if (r) {
                    if (t.finished) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(r);
                    else e.once("finish", r);
                }
                t.ended = true;
                e.writable = false;
            }
            function onCorkedFinish(e, t, r) {
                var n = e.entry;
                e.entry = null;
                while(n){
                    var i = n.callback;
                    t.pendingcb--;
                    i(r);
                    n = n.next;
                }
                t.corkedRequestsFree.next = e;
            }
            Object.defineProperty(Writable.prototype, "destroyed", {
                enumerable: false,
                get: function get() {
                    if (this._writableState === undefined) {
                        return false;
                    }
                    return this._writableState.destroyed;
                },
                set: function set(e) {
                    if (!this._writableState) {
                        return;
                    }
                    this._writableState.destroyed = e;
                }
            });
            Writable.prototype.destroy = f.destroy;
            Writable.prototype._undestroy = f.undestroy;
            Writable.prototype._destroy = function(e, t) {
                t(e);
            };
        },
        871: function(e, t, r) {
            "use strict";
            var n;
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            var i = r(698);
            var a = Symbol("lastResolve");
            var o = Symbol("lastReject");
            var s = Symbol("error");
            var f = Symbol("ended");
            var l = Symbol("lastPromise");
            var u = Symbol("handlePromise");
            var d = Symbol("stream");
            function createIterResult(e, t) {
                return {
                    value: e,
                    done: t
                };
            }
            function readAndResolve(e) {
                var t = e[a];
                if (t !== null) {
                    var r = e[d].read();
                    if (r !== null) {
                        e[l] = null;
                        e[a] = null;
                        e[o] = null;
                        t(createIterResult(r, false));
                    }
                }
            }
            function onReadable(e) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(readAndResolve, e);
            }
            function wrapForNext(e, t) {
                return function(r, n) {
                    e.then(function() {
                        if (t[f]) {
                            r(createIterResult(undefined, true));
                            return;
                        }
                        t[u](r, n);
                    }, n);
                };
            }
            var c = Object.getPrototypeOf(function() {});
            var h = Object.setPrototypeOf((n = {
                get stream () {
                    return this[d];
                },
                next: function next() {
                    var e = this;
                    var t = this[s];
                    if (t !== null) {
                        return Promise.reject(t);
                    }
                    if (this[f]) {
                        return Promise.resolve(createIterResult(undefined, true));
                    }
                    if (this[d].destroyed) {
                        return new Promise(function(t, r) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(function() {
                                if (e[s]) {
                                    r(e[s]);
                                } else {
                                    t(createIterResult(undefined, true));
                                }
                            });
                        });
                    }
                    var r = this[l];
                    var n;
                    if (r) {
                        n = new Promise(wrapForNext(r, this));
                    } else {
                        var i = this[d].read();
                        if (i !== null) {
                            return Promise.resolve(createIterResult(i, false));
                        }
                        n = new Promise(this[u]);
                    }
                    this[l] = n;
                    return n;
                }
            }, _defineProperty(n, Symbol.asyncIterator, function() {
                return this;
            }), _defineProperty(n, "return", function _return() {
                var e = this;
                return new Promise(function(t, r) {
                    e[d].destroy(null, function(e) {
                        if (e) {
                            r(e);
                            return;
                        }
                        t(createIterResult(undefined, true));
                    });
                });
            }), n), c);
            var p = function createReadableStreamAsyncIterator(e) {
                var t;
                var r = Object.create(h, (t = {}, _defineProperty(t, d, {
                    value: e,
                    writable: true
                }), _defineProperty(t, a, {
                    value: null,
                    writable: true
                }), _defineProperty(t, o, {
                    value: null,
                    writable: true
                }), _defineProperty(t, s, {
                    value: null,
                    writable: true
                }), _defineProperty(t, f, {
                    value: e._readableState.endEmitted,
                    writable: true
                }), _defineProperty(t, u, {
                    value: function value(e, t) {
                        var n = r[d].read();
                        if (n) {
                            r[l] = null;
                            r[a] = null;
                            r[o] = null;
                            e(createIterResult(n, false));
                        } else {
                            r[a] = e;
                            r[o] = t;
                        }
                    },
                    writable: true
                }), t));
                r[l] = null;
                i(e, function(e) {
                    if (e && e.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                        var t = r[o];
                        if (t !== null) {
                            r[l] = null;
                            r[a] = null;
                            r[o] = null;
                            t(e);
                        }
                        r[s] = e;
                        return;
                    }
                    var n = r[a];
                    if (n !== null) {
                        r[l] = null;
                        r[a] = null;
                        r[o] = null;
                        n(createIterResult(undefined, true));
                    }
                    r[f] = true;
                });
                e.on("readable", onReadable.bind(null, r));
                return r;
            };
            e.exports = p;
        },
        379: function(e, t, r) {
            "use strict";
            function ownKeys(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    if (t) n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    });
                    r.push.apply(r, n);
                }
                return r;
            }
            function _objectSpread(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        ownKeys(Object(r), true).forEach(function(t) {
                            _defineProperty(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        ownKeys(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                        });
                    }
                }
                return e;
            }
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            function _classCallCheck(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _defineProperties(e, t) {
                for(var r = 0; r < t.length; r++){
                    var n = t[r];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(e, n.key, n);
                }
            }
            function _createClass(e, t, r) {
                if (t) _defineProperties(e.prototype, t);
                if (r) _defineProperties(e, r);
                return e;
            }
            var n = r(300), i = n.Buffer;
            var a = r(837), o = a.inspect;
            var s = o && o.custom || "inspect";
            function copyBuffer(e, t, r) {
                i.prototype.copy.call(e, t, r);
            }
            e.exports = function() {
                function BufferList() {
                    _classCallCheck(this, BufferList);
                    this.head = null;
                    this.tail = null;
                    this.length = 0;
                }
                _createClass(BufferList, [
                    {
                        key: "push",
                        value: function push(e) {
                            var t = {
                                data: e,
                                next: null
                            };
                            if (this.length > 0) this.tail.next = t;
                            else this.head = t;
                            this.tail = t;
                            ++this.length;
                        }
                    },
                    {
                        key: "unshift",
                        value: function unshift(e) {
                            var t = {
                                data: e,
                                next: this.head
                            };
                            if (this.length === 0) this.tail = t;
                            this.head = t;
                            ++this.length;
                        }
                    },
                    {
                        key: "shift",
                        value: function shift() {
                            if (this.length === 0) return;
                            var e = this.head.data;
                            if (this.length === 1) this.head = this.tail = null;
                            else this.head = this.head.next;
                            --this.length;
                            return e;
                        }
                    },
                    {
                        key: "clear",
                        value: function clear() {
                            this.head = this.tail = null;
                            this.length = 0;
                        }
                    },
                    {
                        key: "join",
                        value: function join(e) {
                            if (this.length === 0) return "";
                            var t = this.head;
                            var r = "" + t.data;
                            while(t = t.next){
                                r += e + t.data;
                            }
                            return r;
                        }
                    },
                    {
                        key: "concat",
                        value: function concat(e) {
                            if (this.length === 0) return i.alloc(0);
                            var t = i.allocUnsafe(e >>> 0);
                            var r = this.head;
                            var n = 0;
                            while(r){
                                copyBuffer(r.data, t, n);
                                n += r.data.length;
                                r = r.next;
                            }
                            return t;
                        }
                    },
                    {
                        key: "consume",
                        value: function consume(e, t) {
                            var r;
                            if (e < this.head.data.length) {
                                r = this.head.data.slice(0, e);
                                this.head.data = this.head.data.slice(e);
                            } else if (e === this.head.data.length) {
                                r = this.shift();
                            } else {
                                r = t ? this._getString(e) : this._getBuffer(e);
                            }
                            return r;
                        }
                    },
                    {
                        key: "first",
                        value: function first() {
                            return this.head.data;
                        }
                    },
                    {
                        key: "_getString",
                        value: function _getString(e) {
                            var t = this.head;
                            var r = 1;
                            var n = t.data;
                            e -= n.length;
                            while(t = t.next){
                                var i = t.data;
                                var a = e > i.length ? i.length : e;
                                if (a === i.length) n += i;
                                else n += i.slice(0, e);
                                e -= a;
                                if (e === 0) {
                                    if (a === i.length) {
                                        ++r;
                                        if (t.next) this.head = t.next;
                                        else this.head = this.tail = null;
                                    } else {
                                        this.head = t;
                                        t.data = i.slice(a);
                                    }
                                    break;
                                }
                                ++r;
                            }
                            this.length -= r;
                            return n;
                        }
                    },
                    {
                        key: "_getBuffer",
                        value: function _getBuffer(e) {
                            var t = i.allocUnsafe(e);
                            var r = this.head;
                            var n = 1;
                            r.data.copy(t);
                            e -= r.data.length;
                            while(r = r.next){
                                var a = r.data;
                                var o = e > a.length ? a.length : e;
                                a.copy(t, t.length - e, 0, o);
                                e -= o;
                                if (e === 0) {
                                    if (o === a.length) {
                                        ++n;
                                        if (r.next) this.head = r.next;
                                        else this.head = this.tail = null;
                                    } else {
                                        this.head = r;
                                        r.data = a.slice(o);
                                    }
                                    break;
                                }
                                ++n;
                            }
                            this.length -= n;
                            return t;
                        }
                    },
                    {
                        key: s,
                        value: function value(e, t) {
                            return o(this, _objectSpread({}, t, {
                                depth: 0,
                                customInspect: false
                            }));
                        }
                    }
                ]);
                return BufferList;
            }();
        },
        25: function(e) {
            "use strict";
            function destroy(e, t) {
                var r = this;
                var n = this._readableState && this._readableState.destroyed;
                var i = this._writableState && this._writableState.destroyed;
                if (n || i) {
                    if (t) {
                        t(e);
                    } else if (e) {
                        if (!this._writableState) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorNT, this, e);
                        } else if (!this._writableState.errorEmitted) {
                            this._writableState.errorEmitted = true;
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorNT, this, e);
                        }
                    }
                    return this;
                }
                if (this._readableState) {
                    this._readableState.destroyed = true;
                }
                if (this._writableState) {
                    this._writableState.destroyed = true;
                }
                this._destroy(e || null, function(e) {
                    if (!t && e) {
                        if (!r._writableState) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorAndCloseNT, r, e);
                        } else if (!r._writableState.errorEmitted) {
                            r._writableState.errorEmitted = true;
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorAndCloseNT, r, e);
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitCloseNT, r);
                        }
                    } else if (t) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitCloseNT, r);
                        t(e);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitCloseNT, r);
                    }
                });
                return this;
            }
            function emitErrorAndCloseNT(e, t) {
                emitErrorNT(e, t);
                emitCloseNT(e);
            }
            function emitCloseNT(e) {
                if (e._writableState && !e._writableState.emitClose) return;
                if (e._readableState && !e._readableState.emitClose) return;
                e.emit("close");
            }
            function undestroy() {
                if (this._readableState) {
                    this._readableState.destroyed = false;
                    this._readableState.reading = false;
                    this._readableState.ended = false;
                    this._readableState.endEmitted = false;
                }
                if (this._writableState) {
                    this._writableState.destroyed = false;
                    this._writableState.ended = false;
                    this._writableState.ending = false;
                    this._writableState.finalCalled = false;
                    this._writableState.prefinished = false;
                    this._writableState.finished = false;
                    this._writableState.errorEmitted = false;
                }
            }
            function emitErrorNT(e, t) {
                e.emit("error", t);
            }
            function errorOrDestroy(e, t) {
                var r = e._readableState;
                var n = e._writableState;
                if (r && r.autoDestroy || n && n.autoDestroy) e.destroy(t);
                else e.emit("error", t);
            }
            e.exports = {
                destroy: destroy,
                undestroy: undestroy,
                errorOrDestroy: errorOrDestroy
            };
        },
        698: function(e, t, r) {
            "use strict";
            var n = r(646).q.ERR_STREAM_PREMATURE_CLOSE;
            function once(e) {
                var t = false;
                return function() {
                    if (t) return;
                    t = true;
                    for(var r = arguments.length, n = new Array(r), i = 0; i < r; i++){
                        n[i] = arguments[i];
                    }
                    e.apply(this, n);
                };
            }
            function noop() {}
            function isRequest(e) {
                return e.setHeader && typeof e.abort === "function";
            }
            function eos(e, t, r) {
                if (typeof t === "function") return eos(e, null, t);
                if (!t) t = {};
                r = once(r || noop);
                var i = t.readable || t.readable !== false && e.readable;
                var a = t.writable || t.writable !== false && e.writable;
                var o = function onlegacyfinish() {
                    if (!e.writable) f();
                };
                var s = e._writableState && e._writableState.finished;
                var f = function onfinish() {
                    a = false;
                    s = true;
                    if (!i) r.call(e);
                };
                var l = e._readableState && e._readableState.endEmitted;
                var u = function onend() {
                    i = false;
                    l = true;
                    if (!a) r.call(e);
                };
                var d = function onerror(t) {
                    r.call(e, t);
                };
                var c = function onclose() {
                    var t;
                    if (i && !l) {
                        if (!e._readableState || !e._readableState.ended) t = new n;
                        return r.call(e, t);
                    }
                    if (a && !s) {
                        if (!e._writableState || !e._writableState.ended) t = new n;
                        return r.call(e, t);
                    }
                };
                var h = function onrequest() {
                    e.req.on("finish", f);
                };
                if (isRequest(e)) {
                    e.on("complete", f);
                    e.on("abort", c);
                    if (e.req) h();
                    else e.on("request", h);
                } else if (a && !e._writableState) {
                    e.on("end", o);
                    e.on("close", o);
                }
                e.on("end", u);
                e.on("finish", f);
                if (t.error !== false) e.on("error", d);
                e.on("close", c);
                return function() {
                    e.removeListener("complete", f);
                    e.removeListener("abort", c);
                    e.removeListener("request", h);
                    if (e.req) e.req.removeListener("finish", f);
                    e.removeListener("end", o);
                    e.removeListener("close", o);
                    e.removeListener("finish", f);
                    e.removeListener("end", u);
                    e.removeListener("error", d);
                    e.removeListener("close", c);
                };
            }
            e.exports = eos;
        },
        727: function(e, t, r) {
            "use strict";
            function asyncGeneratorStep(e, t, r, n, i, a, o) {
                try {
                    var s = e[a](o);
                    var f = s.value;
                } catch (e) {
                    r(e);
                    return;
                }
                if (s.done) {
                    t(f);
                } else {
                    Promise.resolve(f).then(n, i);
                }
            }
            function _asyncToGenerator(e) {
                return function() {
                    var t = this, r = arguments;
                    return new Promise(function(n, i) {
                        var a = e.apply(t, r);
                        function _next(e) {
                            asyncGeneratorStep(a, n, i, _next, _throw, "next", e);
                        }
                        function _throw(e) {
                            asyncGeneratorStep(a, n, i, _next, _throw, "throw", e);
                        }
                        _next(undefined);
                    });
                };
            }
            function ownKeys(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    if (t) n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    });
                    r.push.apply(r, n);
                }
                return r;
            }
            function _objectSpread(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        ownKeys(Object(r), true).forEach(function(t) {
                            _defineProperty(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        ownKeys(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                        });
                    }
                }
                return e;
            }
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            var n = r(646).q.ERR_INVALID_ARG_TYPE;
            function from(e, t, r) {
                var i;
                if (t && typeof t.next === "function") {
                    i = t;
                } else if (t && t[Symbol.asyncIterator]) i = t[Symbol.asyncIterator]();
                else if (t && t[Symbol.iterator]) i = t[Symbol.iterator]();
                else throw new n("iterable", [
                    "Iterable"
                ], t);
                var a = new e(_objectSpread({
                    objectMode: true
                }, r));
                var o = false;
                a._read = function() {
                    if (!o) {
                        o = true;
                        next();
                    }
                };
                function next() {
                    return _next2.apply(this, arguments);
                }
                function _next2() {
                    _next2 = _asyncToGenerator(function*() {
                        try {
                            var e = yield i.next(), t = e.value, r = e.done;
                            if (r) {
                                a.push(null);
                            } else if (a.push((yield t))) {
                                next();
                            } else {
                                o = false;
                            }
                        } catch (e) {
                            a.destroy(e);
                        }
                    });
                    return _next2.apply(this, arguments);
                }
                return a;
            }
            e.exports = from;
        },
        442: function(e, t, r) {
            "use strict";
            var n;
            function once(e) {
                var t = false;
                return function() {
                    if (t) return;
                    t = true;
                    e.apply(void 0, arguments);
                };
            }
            var i = r(646).q, a = i.ERR_MISSING_ARGS, o = i.ERR_STREAM_DESTROYED;
            function noop(e) {
                if (e) throw e;
            }
            function isRequest(e) {
                return e.setHeader && typeof e.abort === "function";
            }
            function destroyer(e, t, i, a) {
                a = once(a);
                var s = false;
                e.on("close", function() {
                    s = true;
                });
                if (n === undefined) n = r(698);
                n(e, {
                    readable: t,
                    writable: i
                }, function(e) {
                    if (e) return a(e);
                    s = true;
                    a();
                });
                var f = false;
                return function(t) {
                    if (s) return;
                    if (f) return;
                    f = true;
                    if (isRequest(e)) return e.abort();
                    if (typeof e.destroy === "function") return e.destroy();
                    a(t || new o("pipe"));
                };
            }
            function call(e) {
                e();
            }
            function pipe(e, t) {
                return e.pipe(t);
            }
            function popCallback(e) {
                if (!e.length) return noop;
                if (typeof e[e.length - 1] !== "function") return noop;
                return e.pop();
            }
            function pipeline() {
                for(var e = arguments.length, t = new Array(e), r = 0; r < e; r++){
                    t[r] = arguments[r];
                }
                var n = popCallback(t);
                if (Array.isArray(t[0])) t = t[0];
                if (t.length < 2) {
                    throw new a("streams");
                }
                var i;
                var o = t.map(function(e, r) {
                    var a = r < t.length - 1;
                    var s = r > 0;
                    return destroyer(e, a, s, function(e) {
                        if (!i) i = e;
                        if (e) o.forEach(call);
                        if (a) return;
                        o.forEach(call);
                        n(i);
                    });
                });
                return t.reduce(pipe);
            }
            e.exports = pipeline;
        },
        776: function(e, t, r) {
            "use strict";
            var n = r(646).q.ERR_INVALID_OPT_VALUE;
            function highWaterMarkFrom(e, t, r) {
                return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
            }
            function getHighWaterMark(e, t, r, i) {
                var a = highWaterMarkFrom(t, i, r);
                if (a != null) {
                    if (!(isFinite(a) && Math.floor(a) === a) || a < 0) {
                        var o = i ? r : "highWaterMark";
                        throw new n(o, a);
                    }
                    return Math.floor(a);
                }
                return e.objectMode ? 16 : 16 * 1024;
            }
            e.exports = {
                getHighWaterMark: getHighWaterMark
            };
        },
        678: function(e, t, r) {
            e.exports = r(781);
        },
        55: function(e, t, r) {
            var n = r(300);
            var i = n.Buffer;
            function copyProps(e, t) {
                for(var r in e){
                    t[r] = e[r];
                }
            }
            if (i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow) {
                e.exports = n;
            } else {
                copyProps(n, t);
                t.Buffer = SafeBuffer;
            }
            function SafeBuffer(e, t, r) {
                return i(e, t, r);
            }
            SafeBuffer.prototype = Object.create(i.prototype);
            copyProps(i, SafeBuffer);
            SafeBuffer.from = function(e, t, r) {
                if (typeof e === "number") {
                    throw new TypeError("Argument must not be a number");
                }
                return i(e, t, r);
            };
            SafeBuffer.alloc = function(e, t, r) {
                if (typeof e !== "number") {
                    throw new TypeError("Argument must be a number");
                }
                var n = i(e);
                if (t !== undefined) {
                    if (typeof r === "string") {
                        n.fill(t, r);
                    } else {
                        n.fill(t);
                    }
                } else {
                    n.fill(0);
                }
                return n;
            };
            SafeBuffer.allocUnsafe = function(e) {
                if (typeof e !== "number") {
                    throw new TypeError("Argument must be a number");
                }
                return i(e);
            };
            SafeBuffer.allocUnsafeSlow = function(e) {
                if (typeof e !== "number") {
                    throw new TypeError("Argument must be a number");
                }
                return n.SlowBuffer(e);
            };
        },
        173: function(e, t, r) {
            e.exports = Stream;
            var n = r(361).EventEmitter;
            var i = r(782);
            i(Stream, n);
            Stream.Readable = r(709);
            Stream.Writable = r(337);
            Stream.Duplex = r(403);
            Stream.Transform = r(170);
            Stream.PassThrough = r(889);
            Stream.finished = r(698);
            Stream.pipeline = r(442);
            Stream.Stream = Stream;
            function Stream() {
                n.call(this);
            }
            Stream.prototype.pipe = function(e, t) {
                var r = this;
                function ondata(t) {
                    if (e.writable) {
                        if (false === e.write(t) && r.pause) {
                            r.pause();
                        }
                    }
                }
                r.on("data", ondata);
                function ondrain() {
                    if (r.readable && r.resume) {
                        r.resume();
                    }
                }
                e.on("drain", ondrain);
                if (!e._isStdio && (!t || t.end !== false)) {
                    r.on("end", onend);
                    r.on("close", onclose);
                }
                var i = false;
                function onend() {
                    if (i) return;
                    i = true;
                    e.end();
                }
                function onclose() {
                    if (i) return;
                    i = true;
                    if (typeof e.destroy === "function") e.destroy();
                }
                function onerror(e) {
                    cleanup();
                    if (n.listenerCount(this, "error") === 0) {
                        throw e;
                    }
                }
                r.on("error", onerror);
                e.on("error", onerror);
                function cleanup() {
                    r.removeListener("data", ondata);
                    e.removeListener("drain", ondrain);
                    r.removeListener("end", onend);
                    r.removeListener("close", onclose);
                    r.removeListener("error", onerror);
                    e.removeListener("error", onerror);
                    r.removeListener("end", cleanup);
                    r.removeListener("close", cleanup);
                    e.removeListener("close", cleanup);
                }
                r.on("end", cleanup);
                r.on("close", cleanup);
                e.on("close", cleanup);
                e.emit("pipe", r);
                return e;
            };
        },
        704: function(e, t, r) {
            "use strict";
            var n = r(55).Buffer;
            var i = n.isEncoding || function(e) {
                e = "" + e;
                switch(e && e.toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return true;
                    default:
                        return false;
                }
            };
            function _normalizeEncoding(e) {
                if (!e) return "utf8";
                var t;
                while(true){
                    switch(e){
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return e;
                        default:
                            if (t) return;
                            e = ("" + e).toLowerCase();
                            t = true;
                    }
                }
            }
            function normalizeEncoding(e) {
                var t = _normalizeEncoding(e);
                if (typeof t !== "string" && (n.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e);
                return t || e;
            }
            t.s = StringDecoder;
            function StringDecoder(e) {
                this.encoding = normalizeEncoding(e);
                var t;
                switch(this.encoding){
                    case "utf16le":
                        this.text = utf16Text;
                        this.end = utf16End;
                        t = 4;
                        break;
                    case "utf8":
                        this.fillLast = utf8FillLast;
                        t = 4;
                        break;
                    case "base64":
                        this.text = base64Text;
                        this.end = base64End;
                        t = 3;
                        break;
                    default:
                        this.write = simpleWrite;
                        this.end = simpleEnd;
                        return;
                }
                this.lastNeed = 0;
                this.lastTotal = 0;
                this.lastChar = n.allocUnsafe(t);
            }
            StringDecoder.prototype.write = function(e) {
                if (e.length === 0) return "";
                var t;
                var r;
                if (this.lastNeed) {
                    t = this.fillLast(e);
                    if (t === undefined) return "";
                    r = this.lastNeed;
                    this.lastNeed = 0;
                } else {
                    r = 0;
                }
                if (r < e.length) return t ? t + this.text(e, r) : this.text(e, r);
                return t || "";
            };
            StringDecoder.prototype.end = utf8End;
            StringDecoder.prototype.text = utf8Text;
            StringDecoder.prototype.fillLast = function(e) {
                if (this.lastNeed <= e.length) {
                    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length);
                this.lastNeed -= e.length;
            };
            function utf8CheckByte(e) {
                if (e <= 127) return 0;
                else if (e >> 5 === 6) return 2;
                else if (e >> 4 === 14) return 3;
                else if (e >> 3 === 30) return 4;
                return e >> 6 === 2 ? -1 : -2;
            }
            function utf8CheckIncomplete(e, t, r) {
                var n = t.length - 1;
                if (n < r) return 0;
                var i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) e.lastNeed = i - 1;
                    return i;
                }
                if (--n < r || i === -2) return 0;
                i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) e.lastNeed = i - 2;
                    return i;
                }
                if (--n < r || i === -2) return 0;
                i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) {
                        if (i === 2) i = 0;
                        else e.lastNeed = i - 3;
                    }
                    return i;
                }
                return 0;
            }
            function utf8CheckExtraBytes(e, t, r) {
                if ((t[0] & 192) !== 128) {
                    e.lastNeed = 0;
                    return "�";
                }
                if (e.lastNeed > 1 && t.length > 1) {
                    if ((t[1] & 192) !== 128) {
                        e.lastNeed = 1;
                        return "�";
                    }
                    if (e.lastNeed > 2 && t.length > 2) {
                        if ((t[2] & 192) !== 128) {
                            e.lastNeed = 2;
                            return "�";
                        }
                    }
                }
            }
            function utf8FillLast(e) {
                var t = this.lastTotal - this.lastNeed;
                var r = utf8CheckExtraBytes(this, e, t);
                if (r !== undefined) return r;
                if (this.lastNeed <= e.length) {
                    e.copy(this.lastChar, t, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                e.copy(this.lastChar, t, 0, e.length);
                this.lastNeed -= e.length;
            }
            function utf8Text(e, t) {
                var r = utf8CheckIncomplete(this, e, t);
                if (!this.lastNeed) return e.toString("utf8", t);
                this.lastTotal = r;
                var n = e.length - (r - this.lastNeed);
                e.copy(this.lastChar, 0, n);
                return e.toString("utf8", t, n);
            }
            function utf8End(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) return t + "�";
                return t;
            }
            function utf16Text(e, t) {
                if ((e.length - t) % 2 === 0) {
                    var r = e.toString("utf16le", t);
                    if (r) {
                        var n = r.charCodeAt(r.length - 1);
                        if (n >= 55296 && n <= 56319) {
                            this.lastNeed = 2;
                            this.lastTotal = 4;
                            this.lastChar[0] = e[e.length - 2];
                            this.lastChar[1] = e[e.length - 1];
                            return r.slice(0, -1);
                        }
                    }
                    return r;
                }
                this.lastNeed = 1;
                this.lastTotal = 2;
                this.lastChar[0] = e[e.length - 1];
                return e.toString("utf16le", t, e.length - 1);
            }
            function utf16End(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) {
                    var r = this.lastTotal - this.lastNeed;
                    return t + this.lastChar.toString("utf16le", 0, r);
                }
                return t;
            }
            function base64Text(e, t) {
                var r = (e.length - t) % 3;
                if (r === 0) return e.toString("base64", t);
                this.lastNeed = 3 - r;
                this.lastTotal = 3;
                if (r === 1) {
                    this.lastChar[0] = e[e.length - 1];
                } else {
                    this.lastChar[0] = e[e.length - 2];
                    this.lastChar[1] = e[e.length - 1];
                }
                return e.toString("base64", t, e.length - r);
            }
            function base64End(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) return t + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
                return t;
            }
            function simpleWrite(e) {
                return e.toString(this.encoding);
            }
            function simpleEnd(e) {
                return e && e.length ? this.write(e) : "";
            }
        },
        769: function(e) {
            e.exports = deprecate;
            function deprecate(e, t) {
                if (config("noDeprecation")) {
                    return e;
                }
                var r = false;
                function deprecated() {
                    if (!r) {
                        if (config("throwDeprecation")) {
                            throw new Error(t);
                        } else if (config("traceDeprecation")) {
                            console.trace(t);
                        } else {
                            console.warn(t);
                        }
                        r = true;
                    }
                    return e.apply(this, arguments);
                }
                return deprecated;
            }
            function config(e) {
                try {
                    if (!global.localStorage) return false;
                } catch (e) {
                    return false;
                }
                var t = global.localStorage[e];
                if (null == t) return false;
                return String(t).toLowerCase() === "true";
            }
        },
        300: function(e) {
            "use strict";
            e.exports = __turbopack_require__("[project]/node_modules/.pnpm/buffer@6.0.3/node_modules/buffer/index.js [app-client] (ecmascript)");
        },
        361: function(e) {
            "use strict";
            e.exports = __turbopack_require__("[project]/node_modules/.pnpm/events@3.3.0/node_modules/events/events.js [app-client] (ecmascript)");
        },
        781: function(e) {
            "use strict";
            e.exports = __turbopack_require__("[project]/node_modules/.pnpm/events@3.3.0/node_modules/events/events.js [app-client] (ecmascript)").EventEmitter;
        },
        837: function(e) {
            "use strict";
            e.exports = __turbopack_require__("[project]/node_modules/.pnpm/util@0.12.5/node_modules/util/util.js [app-client] (ecmascript)");
        }
    };
    var t = {};
    function __nccwpck_require__(r) {
        var n = t[r];
        if (n !== undefined) {
            return n.exports;
        }
        var i = t[r] = {
            exports: {}
        };
        var a = true;
        try {
            e[r](i, i.exports, __nccwpck_require__);
            a = false;
        } finally{
            if (a) delete t[r];
        }
        return i.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var r = __nccwpck_require__(173);
    module.exports = r;
})();
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/vm-browserify/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
(function() {
    var __webpack_modules__ = {
        950: function(__unused_webpack_module, exports) {
            var indexOf = function(e, t) {
                if (e.indexOf) return e.indexOf(t);
                else for(var r = 0; r < e.length; r++){
                    if (e[r] === t) return r;
                }
                return -1;
            };
            var Object_keys = function(e) {
                if (Object.keys) return Object.keys(e);
                else {
                    var t = [];
                    for(var r in e)t.push(r);
                    return t;
                }
            };
            var forEach = function(e, t) {
                if (e.forEach) return e.forEach(t);
                else for(var r = 0; r < e.length; r++){
                    t(e[r], r, e);
                }
            };
            var defineProp = function() {
                try {
                    Object.defineProperty({}, "_", {});
                    return function(e, t, r) {
                        Object.defineProperty(e, t, {
                            writable: true,
                            enumerable: false,
                            configurable: true,
                            value: r
                        });
                    };
                } catch (e) {
                    return function(e, t, r) {
                        e[t] = r;
                    };
                }
            }();
            var globals = [
                "Array",
                "Boolean",
                "Date",
                "Error",
                "EvalError",
                "Function",
                "Infinity",
                "JSON",
                "Math",
                "NaN",
                "Number",
                "Object",
                "RangeError",
                "ReferenceError",
                "RegExp",
                "String",
                "SyntaxError",
                "TypeError",
                "URIError",
                "decodeURI",
                "decodeURIComponent",
                "encodeURI",
                "encodeURIComponent",
                "escape",
                "eval",
                "isFinite",
                "isNaN",
                "parseFloat",
                "parseInt",
                "undefined",
                "unescape"
            ];
            function Context() {}
            Context.prototype = {};
            var Script = exports.Script = function NodeScript(e) {
                if (!(this instanceof Script)) return new Script(e);
                this.code = e;
            };
            Script.prototype.runInContext = function(e) {
                if (!(e instanceof Context)) {
                    throw new TypeError("needs a 'context' argument.");
                }
                var t = document.createElement("iframe");
                if (!t.style) t.style = {};
                t.style.display = "none";
                document.body.appendChild(t);
                var r = t.contentWindow;
                var n = r.eval, o = r.execScript;
                if (!n && o) {
                    o.call(r, "null");
                    n = r.eval;
                }
                forEach(Object_keys(e), function(t) {
                    r[t] = e[t];
                });
                forEach(globals, function(t) {
                    if (e[t]) {
                        r[t] = e[t];
                    }
                });
                var c = Object_keys(r);
                var i = n.call(r, this.code);
                forEach(Object_keys(r), function(t) {
                    if (t in e || indexOf(c, t) === -1) {
                        e[t] = r[t];
                    }
                });
                forEach(globals, function(t) {
                    if (!(t in e)) {
                        defineProp(e, t, r[t]);
                    }
                });
                document.body.removeChild(t);
                return i;
            };
            Script.prototype.runInThisContext = function() {
                return eval(this.code);
            };
            Script.prototype.runInNewContext = function(e) {
                var t = Script.createContext(e);
                var r = this.runInContext(t);
                if (e) {
                    forEach(Object_keys(t), function(r) {
                        e[r] = t[r];
                    });
                }
                return r;
            };
            forEach(Object_keys(Script.prototype), function(e) {
                exports[e] = Script[e] = function(t) {
                    var r = Script(t);
                    return r[e].apply(r, [].slice.call(arguments, 1));
                };
            });
            exports.isContext = function(e) {
                return e instanceof Context;
            };
            exports.createScript = function(e) {
                return exports.Script(e);
            };
            exports.createContext = Script.createContext = function(e) {
                var t = new Context;
                if (typeof e === "object") {
                    forEach(Object_keys(e), function(r) {
                        t[r] = e[r];
                    });
                }
                return t;
            };
        }
    };
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var __webpack_exports__ = {};
    __webpack_modules__[950](0, __webpack_exports__);
    module.exports = __webpack_exports__;
})();
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
(function() {
    "use strict";
    var e = {
        815: function(e) {
            function hasOwnProperty(e, r) {
                return Object.prototype.hasOwnProperty.call(e, r);
            }
            e.exports = function(e, n, t, o) {
                n = n || "&";
                t = t || "=";
                var a = {};
                if (typeof e !== "string" || e.length === 0) {
                    return a;
                }
                var i = /\+/g;
                e = e.split(n);
                var u = 1e3;
                if (o && typeof o.maxKeys === "number") {
                    u = o.maxKeys;
                }
                var c = e.length;
                if (u > 0 && c > u) {
                    c = u;
                }
                for(var p = 0; p < c; ++p){
                    var f = e[p].replace(i, "%20"), s = f.indexOf(t), _, l, y, d;
                    if (s >= 0) {
                        _ = f.substr(0, s);
                        l = f.substr(s + 1);
                    } else {
                        _ = f;
                        l = "";
                    }
                    y = decodeURIComponent(_);
                    d = decodeURIComponent(l);
                    if (!hasOwnProperty(a, y)) {
                        a[y] = d;
                    } else if (r(a[y])) {
                        a[y].push(d);
                    } else {
                        a[y] = [
                            a[y],
                            d
                        ];
                    }
                }
                return a;
            };
            var r = Array.isArray || function(e) {
                return Object.prototype.toString.call(e) === "[object Array]";
            };
        },
        577: function(e) {
            var stringifyPrimitive = function(e) {
                switch(typeof e){
                    case "string":
                        return e;
                    case "boolean":
                        return e ? "true" : "false";
                    case "number":
                        return isFinite(e) ? e : "";
                    default:
                        return "";
                }
            };
            e.exports = function(e, t, o, a) {
                t = t || "&";
                o = o || "=";
                if (e === null) {
                    e = undefined;
                }
                if (typeof e === "object") {
                    return map(n(e), function(n) {
                        var a = encodeURIComponent(stringifyPrimitive(n)) + o;
                        if (r(e[n])) {
                            return map(e[n], function(e) {
                                return a + encodeURIComponent(stringifyPrimitive(e));
                            }).join(t);
                        } else {
                            return a + encodeURIComponent(stringifyPrimitive(e[n]));
                        }
                    }).join(t);
                }
                if (!a) return "";
                return encodeURIComponent(stringifyPrimitive(a)) + o + encodeURIComponent(stringifyPrimitive(e));
            };
            var r = Array.isArray || function(e) {
                return Object.prototype.toString.call(e) === "[object Array]";
            };
            function map(e, r) {
                if (e.map) return e.map(r);
                var n = [];
                for(var t = 0; t < e.length; t++){
                    n.push(r(e[t], t));
                }
                return n;
            }
            var n = Object.keys || function(e) {
                var r = [];
                for(var n in e){
                    if (Object.prototype.hasOwnProperty.call(e, n)) r.push(n);
                }
                return r;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(n) {
        var t = r[n];
        if (t !== undefined) {
            return t.exports;
        }
        var o = r[n] = {
            exports: {}
        };
        var a = true;
        try {
            e[n](o, o.exports, __nccwpck_require__);
            a = false;
        } finally{
            if (a) delete r[n];
        }
        return o.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var n = {};
    !function() {
        var e = n;
        e.decode = e.parse = __nccwpck_require__(815);
        e.encode = e.stringify = __nccwpck_require__(577);
    }();
    module.exports = n;
})();
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/native-url/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
(function() {
    var e = {
        452: function(e) {
            "use strict";
            e.exports = __turbopack_require__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)");
        }
    };
    var t = {};
    function __nccwpck_require__(o) {
        var a = t[o];
        if (a !== undefined) {
            return a.exports;
        }
        var s = t[o] = {
            exports: {}
        };
        var n = true;
        try {
            e[o](s, s.exports, __nccwpck_require__);
            n = false;
        } finally{
            if (n) delete t[o];
        }
        return s.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var o = {};
    !function() {
        var e = o;
        var t, a = (t = __nccwpck_require__(452)) && "object" == typeof t && "default" in t ? t.default : t, s = /https?|ftp|gopher|file/;
        function r(e) {
            "string" == typeof e && (e = d(e));
            var t = function(e, t, o) {
                var a = e.auth, s = e.hostname, n = e.protocol || "", p = e.pathname || "", c = e.hash || "", i = e.query || "", u = !1;
                a = a ? encodeURIComponent(a).replace(/%3A/i, ":") + "@" : "", e.host ? u = a + e.host : s && (u = a + (~s.indexOf(":") ? "[" + s + "]" : s), e.port && (u += ":" + e.port)), i && "object" == typeof i && (i = t.encode(i));
                var f = e.search || i && "?" + i || "";
                return n && ":" !== n.substr(-1) && (n += ":"), e.slashes || (!n || o.test(n)) && !1 !== u ? (u = "//" + (u || ""), p && "/" !== p[0] && (p = "/" + p)) : u || (u = ""), c && "#" !== c[0] && (c = "#" + c), f && "?" !== f[0] && (f = "?" + f), {
                    protocol: n,
                    host: u,
                    pathname: p = p.replace(/[?#]/g, encodeURIComponent),
                    search: f = f.replace("#", "%23"),
                    hash: c
                };
            }(e, a, s);
            return "" + t.protocol + t.host + t.pathname + t.search + t.hash;
        }
        var n = "http://", p = "w.w", c = n + p, i = /^([a-z0-9.+-]*:\/\/\/)([a-z0-9.+-]:\/*)?/i, u = /https?|ftp|gopher|file/;
        function h(e, t) {
            var o = "string" == typeof e ? d(e) : e;
            e = "object" == typeof e ? r(e) : e;
            var a = d(t), s = "";
            o.protocol && !o.slashes && (s = o.protocol, e = e.replace(o.protocol, ""), s += "/" === t[0] || "/" === e[0] ? "/" : ""), s && a.protocol && (s = "", a.slashes || (s = a.protocol, t = t.replace(a.protocol, "")));
            var p = e.match(i);
            p && !a.protocol && (e = e.substr((s = p[1] + (p[2] || "")).length), /^\/\/[^/]/.test(t) && (s = s.slice(0, -1)));
            var f = new URL(e, c + "/"), m = new URL(t, f).toString().replace(c, ""), v = a.protocol || o.protocol;
            return v += o.slashes || a.slashes ? "//" : "", !s && v ? m = m.replace(n, v) : s && (m = m.replace(n, "")), u.test(m) || ~t.indexOf(".") || "/" === e.slice(-1) || "/" === t.slice(-1) || "/" !== m.slice(-1) || (m = m.slice(0, -1)), s && (m = s + ("/" === m[0] ? m.substr(1) : m)), m;
        }
        function l() {}
        l.prototype.parse = d, l.prototype.format = r, l.prototype.resolve = h, l.prototype.resolveObject = h;
        var f = /^https?|ftp|gopher|file/, m = /^(.*?)([#?].*)/, v = /^([a-z0-9.+-]*:)(\/{0,3})(.*)/i, _ = /^([a-z0-9.+-]*:)?\/\/\/*/i, b = /^([a-z0-9.+-]*:)(\/{0,2})\[(.*)\]$/i;
        function d(e, t, o) {
            if (void 0 === t && (t = !1), void 0 === o && (o = !1), e && "object" == typeof e && e instanceof l) return e;
            var s = (e = e.trim()).match(m);
            e = s ? s[1].replace(/\\/g, "/") + s[2] : e.replace(/\\/g, "/"), b.test(e) && "/" !== e.slice(-1) && (e += "/");
            var n = !/(^javascript)/.test(e) && e.match(v), i = _.test(e), u = "";
            n && (f.test(n[1]) || (u = n[1].toLowerCase(), e = "" + n[2] + n[3]), n[2] || (i = !1, f.test(n[1]) ? (u = n[1], e = "" + n[3]) : e = "//" + n[3]), 3 !== n[2].length && 1 !== n[2].length || (u = n[1], e = "/" + n[3]));
            var g, y = (s ? s[1] : e).match(/^https?:\/\/[^/]+(:[0-9]+)(?=\/|$)/), w = y && y[1], x = new l, C = "", U = "";
            try {
                g = new URL(e);
            } catch (t) {
                C = t, u || o || !/^\/\//.test(e) || /^\/\/.+[@.]/.test(e) || (U = "/", e = e.substr(1));
                try {
                    g = new URL(e, c);
                } catch (e) {
                    return x.protocol = u, x.href = u, x;
                }
            }
            x.slashes = i && !U, x.host = g.host === p ? "" : g.host, x.hostname = g.hostname === p ? "" : g.hostname.replace(/(\[|\])/g, ""), x.protocol = C ? u || null : g.protocol, x.search = g.search.replace(/\\/g, "%5C"), x.hash = g.hash.replace(/\\/g, "%5C");
            var j = e.split("#");
            !x.search && ~j[0].indexOf("?") && (x.search = "?"), x.hash || "" !== j[1] || (x.hash = "#"), x.query = t ? a.decode(g.search.substr(1)) : x.search.substr(1), x.pathname = U + (n ? function(e) {
                return e.replace(/['^|`]/g, function(e) {
                    return "%" + e.charCodeAt().toString(16).toUpperCase();
                }).replace(/((?:%[0-9A-F]{2})+)/g, function(e, t) {
                    try {
                        return decodeURIComponent(t).split("").map(function(e) {
                            var t = e.charCodeAt();
                            return t > 256 || /^[a-z0-9]$/i.test(e) ? e : "%" + t.toString(16).toUpperCase();
                        }).join("");
                    } catch (e) {
                        return t;
                    }
                });
            }(g.pathname) : g.pathname), "about:" === x.protocol && "blank" === x.pathname && (x.protocol = "", x.pathname = ""), C && "/" !== e[0] && (x.pathname = x.pathname.substr(1)), u && !f.test(u) && "/" !== e.slice(-1) && "/" === x.pathname && (x.pathname = ""), x.path = x.pathname + x.search, x.auth = [
                g.username,
                g.password
            ].map(decodeURIComponent).filter(Boolean).join(":"), x.port = g.port, w && !x.host.endsWith(w) && (x.host += w, x.port = w.slice(1)), x.href = U ? "" + x.pathname + x.search + x.hash : r(x);
            var q = /^(file)/.test(x.href) ? [
                "host",
                "hostname"
            ] : [];
            return Object.keys(x).forEach(function(e) {
                ~q.indexOf(e) || (x[e] = x[e] || null);
            }), x;
        }
        e.parse = d, e.format = r, e.resolve = h, e.resolveObject = function(e, t) {
            return d(h(e, t));
        }, e.Url = l;
    }();
    module.exports = o;
})();
}}),
"[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/https-browserify/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
(function() {
    var r = {
        528: function(r, e, t) {
            var o = t(685);
            var a = t(310);
            var i = r.exports;
            for(var n in o){
                if (o.hasOwnProperty(n)) i[n] = o[n];
            }
            i.request = function(r, e) {
                r = validateParams(r);
                return o.request.call(this, r, e);
            };
            i.get = function(r, e) {
                r = validateParams(r);
                return o.get.call(this, r, e);
            };
            function validateParams(r) {
                if (typeof r === "string") {
                    r = a.parse(r);
                }
                if (!r.protocol) {
                    r.protocol = "https:";
                }
                if (r.protocol !== "https:") {
                    throw new Error('Protocol "' + r.protocol + '" not supported. Expected "https:"');
                }
                return r;
            }
        },
        685: function(r) {
            "use strict";
            r.exports = __turbopack_require__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/stream-http/index.js [app-client] (ecmascript)");
        },
        310: function(r) {
            "use strict";
            r.exports = __turbopack_require__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/native-url/index.js [app-client] (ecmascript)");
        }
    };
    var e = {};
    function __nccwpck_require__(t) {
        var o = e[t];
        if (o !== undefined) {
            return o.exports;
        }
        var a = e[t] = {
            exports: {}
        };
        var i = true;
        try {
            r[t](a, a.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete e[t];
        }
        return a.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var t = __nccwpck_require__(528);
    module.exports = t;
})();
}}),
}]);

//# sourceMappingURL=c3b1b_next_dist_compiled_49aaf5._.js.map