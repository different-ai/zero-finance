(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/83af6_graphql_633cd1._.js", {

"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * GraphQL.js provides a reference implementation for the GraphQL specification
 * but is also a useful utility for operating on GraphQL files and building
 * sophisticated tools.
 *
 * This primary module exports a general purpose function for fulfilling all
 * steps of the GraphQL specification in a single operation, but also includes
 * utilities for every part of the GraphQL specification:
 *
 *   - Parsing the GraphQL language.
 *   - Building a GraphQL type schema.
 *   - Validating a GraphQL request against a type schema.
 *   - Executing a GraphQL request against a type schema.
 *
 * This also includes utility functions for operating on GraphQL types and
 * GraphQL documents to facilitate building tools.
 *
 * You may also import from each sub-directory directly. For example, the
 * following two import statements are equivalent:
 *
 * ```ts
 * import { parse } from 'graphql';
 * import { parse } from 'graphql/language';
 * ```
 *
 * @packageDocumentation
 */ // The GraphQL.js version info.
__turbopack_esm__({});
;
;
;
;
;
;
;
;
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "devAssert": (()=>devAssert)
});
function devAssert(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
        throw new Error(message);
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "inspect": (()=>inspect)
});
const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
    return formatValue(value, []);
}
function formatValue(value, seenValues) {
    switch(typeof value){
        case 'string':
            return JSON.stringify(value);
        case 'function':
            return value.name ? `[function ${value.name}]` : '[function]';
        case 'object':
            return formatObjectValue(value, seenValues);
        default:
            return String(value);
    }
}
function formatObjectValue(value, previouslySeenValues) {
    if (value === null) {
        return 'null';
    }
    if (previouslySeenValues.includes(value)) {
        return '[Circular]';
    }
    const seenValues = [
        ...previouslySeenValues,
        value
    ];
    if (isJSONable(value)) {
        const jsonValue = value.toJSON(); // check for infinite recursion
        if (jsonValue !== value) {
            return typeof jsonValue === 'string' ? jsonValue : formatValue(jsonValue, seenValues);
        }
    } else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
    }
    return formatObject(value, seenValues);
}
function isJSONable(value) {
    return typeof value.toJSON === 'function';
}
function formatObject(object, seenValues) {
    const entries = Object.entries(object);
    if (entries.length === 0) {
        return '{}';
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[' + getObjectTag(object) + ']';
    }
    const properties = entries.map(([key, value])=>key + ': ' + formatValue(value, seenValues));
    return '{ ' + properties.join(', ') + ' }';
}
function formatArray(array, seenValues) {
    if (array.length === 0) {
        return '[]';
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[Array]';
    }
    const len = Math.min(MAX_ARRAY_LENGTH, array.length);
    const remaining = array.length - len;
    const items = [];
    for(let i = 0; i < len; ++i){
        items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
        items.push('... 1 more item');
    } else if (remaining > 1) {
        items.push(`... ${remaining} more items`);
    }
    return '[' + items.join(', ') + ']';
}
function getObjectTag(object) {
    const tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');
    if (tag === 'Object' && typeof object.constructor === 'function') {
        const name = object.constructor.name;
        if (typeof name === 'string' && name !== '') {
            return name;
        }
    }
    return tag;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/instanceOf.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "instanceOf": (()=>instanceOf)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
;
const instanceOf = /* c8 ignore next 6 */ // FIXME: https://github.com/graphql/graphql-js/issues/2317
globalThis.process && globalThis.process.env.NODE_ENV === 'production' ? function instanceOf(value, constructor) {
    return value instanceof constructor;
} : function instanceOf(value, constructor) {
    if (value instanceof constructor) {
        return true;
    }
    if (typeof value === 'object' && value !== null) {
        var _value$constructor;
        // Prefer Symbol.toStringTag since it is immune to minification.
        const className = constructor.prototype[Symbol.toStringTag];
        const valueClassName = Symbol.toStringTag in value // @ts-expect-error TS bug see, https://github.com/microsoft/TypeScript/issues/38009
         ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name;
        if (className === valueClassName) {
            const stringifiedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(value);
            throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
        }
    }
    return false;
};
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/identityFunc.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Returns the first argument it receives.
 */ __turbopack_esm__({
    "identityFunc": (()=>identityFunc)
});
function identityFunc(x) {
    return x;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "invariant": (()=>invariant)
});
function invariant(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
        throw new Error(message != null ? message : 'Unexpected invariant triggered.');
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */ __turbopack_esm__({
    "isObjectLike": (()=>isObjectLike)
});
function isObjectLike(value) {
    return typeof value == 'object' && value !== null;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyValMap.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * and a function to produce the values from each item in the array.
 * ```ts
 * const phoneBook = [
 *   { name: 'Jon', num: '555-1234' },
 *   { name: 'Jenny', num: '867-5309' }
 * ]
 *
 * // { Jon: '555-1234', Jenny: '867-5309' }
 * const phonesByName = keyValMap(
 *   phoneBook,
 *   entry => entry.name,
 *   entry => entry.num
 * )
 * ```
 */ __turbopack_esm__({
    "keyValMap": (()=>keyValMap)
});
function keyValMap(list, keyFn, valFn) {
    const result = Object.create(null);
    for (const item of list){
        result[keyFn(item)] = valFn(item);
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/toObjMap.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "toObjMap": (()=>toObjMap)
});
function toObjMap(obj) {
    if (obj == null) {
        return Object.create(null);
    }
    if (Object.getPrototypeOf(obj) === null) {
        return obj;
    }
    const map = Object.create(null);
    for (const [key, value] of Object.entries(obj)){
        map[key] = value;
    }
    return map;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/mapValue.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Creates an object map with the same keys as `map` and values generated by
 * running each value of `map` thru `fn`.
 */ __turbopack_esm__({
    "mapValue": (()=>mapValue)
});
function mapValue(map, fn) {
    const result = Object.create(null);
    for (const key of Object.keys(map)){
        result[key] = fn(map[key], key);
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * for each value in the array.
 *
 * This provides a convenient lookup for the array items if the key function
 * produces unique results.
 * ```ts
 * const phoneBook = [
 *   { name: 'Jon', num: '555-1234' },
 *   { name: 'Jenny', num: '867-5309' }
 * ]
 *
 * const entriesByName = keyMap(
 *   phoneBook,
 *   entry => entry.name
 * )
 *
 * // {
 * //   Jon: { name: 'Jon', num: '555-1234' },
 * //   Jenny: { name: 'Jenny', num: '867-5309' }
 * // }
 *
 * const jennyEntry = entriesByName['Jenny']
 *
 * // { name: 'Jenny', num: '857-6309' }
 * ```
 */ __turbopack_esm__({
    "keyMap": (()=>keyMap)
});
function keyMap(list, keyFn) {
    const result = Object.create(null);
    for (const item of list){
        result[keyFn(item)] = item;
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/naturalCompare.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Returns a number indicating whether a reference string comes before, or after,
 * or is the same as the given string in natural sort order.
 *
 * See: https://en.wikipedia.org/wiki/Natural_sort_order
 *
 */ __turbopack_esm__({
    "naturalCompare": (()=>naturalCompare)
});
function naturalCompare(aStr, bStr) {
    let aIndex = 0;
    let bIndex = 0;
    while(aIndex < aStr.length && bIndex < bStr.length){
        let aChar = aStr.charCodeAt(aIndex);
        let bChar = bStr.charCodeAt(bIndex);
        if (isDigit(aChar) && isDigit(bChar)) {
            let aNum = 0;
            do {
                ++aIndex;
                aNum = aNum * 10 + aChar - DIGIT_0;
                aChar = aStr.charCodeAt(aIndex);
            }while (isDigit(aChar) && aNum > 0)
            let bNum = 0;
            do {
                ++bIndex;
                bNum = bNum * 10 + bChar - DIGIT_0;
                bChar = bStr.charCodeAt(bIndex);
            }while (isDigit(bChar) && bNum > 0)
            if (aNum < bNum) {
                return -1;
            }
            if (aNum > bNum) {
                return 1;
            }
        } else {
            if (aChar < bChar) {
                return -1;
            }
            if (aChar > bChar) {
                return 1;
            }
            ++aIndex;
            ++bIndex;
        }
    }
    return aStr.length - bStr.length;
}
const DIGIT_0 = 48;
const DIGIT_9 = 57;
function isDigit(code) {
    return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "suggestionList": (()=>suggestionList)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/naturalCompare.mjs [app-client] (ecmascript)");
;
function suggestionList(input, options) {
    const optionsByDistance = Object.create(null);
    const lexicalDistance = new LexicalDistance(input);
    const threshold = Math.floor(input.length * 0.4) + 1;
    for (const option of options){
        const distance = lexicalDistance.measure(option, threshold);
        if (distance !== undefined) {
            optionsByDistance[option] = distance;
        }
    }
    return Object.keys(optionsByDistance).sort((a, b)=>{
        const distanceDiff = optionsByDistance[a] - optionsByDistance[b];
        return distanceDiff !== 0 ? distanceDiff : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["naturalCompare"])(a, b);
    });
}
/**
 * Computes the lexical distance between strings A and B.
 *
 * The "distance" between two strings is given by counting the minimum number
 * of edits needed to transform string A into string B. An edit can be an
 * insertion, deletion, or substitution of a single character, or a swap of two
 * adjacent characters.
 *
 * Includes a custom alteration from Damerau-Levenshtein to treat case changes
 * as a single edit which helps identify mis-cased values with an edit distance
 * of 1.
 *
 * This distance can be useful for detecting typos in input or sorting
 */ class LexicalDistance {
    constructor(input){
        this._input = input;
        this._inputLowerCase = input.toLowerCase();
        this._inputArray = stringToArray(this._inputLowerCase);
        this._rows = [
            new Array(input.length + 1).fill(0),
            new Array(input.length + 1).fill(0),
            new Array(input.length + 1).fill(0)
        ];
    }
    measure(option, threshold) {
        if (this._input === option) {
            return 0;
        }
        const optionLowerCase = option.toLowerCase(); // Any case change counts as a single edit
        if (this._inputLowerCase === optionLowerCase) {
            return 1;
        }
        let a = stringToArray(optionLowerCase);
        let b = this._inputArray;
        if (a.length < b.length) {
            const tmp = a;
            a = b;
            b = tmp;
        }
        const aLength = a.length;
        const bLength = b.length;
        if (aLength - bLength > threshold) {
            return undefined;
        }
        const rows = this._rows;
        for(let j = 0; j <= bLength; j++){
            rows[0][j] = j;
        }
        for(let i = 1; i <= aLength; i++){
            const upRow = rows[(i - 1) % 3];
            const currentRow = rows[i % 3];
            let smallestCell = currentRow[0] = i;
            for(let j = 1; j <= bLength; j++){
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                let currentCell = Math.min(upRow[j] + 1, currentRow[j - 1] + 1, upRow[j - 1] + cost);
                if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                    // transposition
                    const doubleDiagonalCell = rows[(i - 2) % 3][j - 2];
                    currentCell = Math.min(currentCell, doubleDiagonalCell + 1);
                }
                if (currentCell < smallestCell) {
                    smallestCell = currentCell;
                }
                currentRow[j] = currentCell;
            } // Early exit, since distance can't go smaller than smallest element of the previous row.
            if (smallestCell > threshold) {
                return undefined;
            }
        }
        const distance = rows[aLength % 3][bLength];
        return distance <= threshold ? distance : undefined;
    }
}
function stringToArray(str) {
    const strLength = str.length;
    const array = new Array(strLength);
    for(let i = 0; i < strLength; ++i){
        array[i] = str.charCodeAt(i);
    }
    return array;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "didYouMean": (()=>didYouMean)
});
const MAX_SUGGESTIONS = 5;
function didYouMean(firstArg, secondArg) {
    const [subMessage, suggestionsArg] = secondArg ? [
        firstArg,
        secondArg
    ] : [
        undefined,
        firstArg
    ];
    let message = ' Did you mean ';
    if (subMessage) {
        message += subMessage + ' ';
    }
    const suggestions = suggestionsArg.map((x)=>`"${x}"`);
    switch(suggestions.length){
        case 0:
            return '';
        case 1:
            return message + suggestions[0] + '?';
        case 2:
            return message + suggestions[0] + ' or ' + suggestions[1] + '?';
    }
    const selected = suggestions.slice(0, MAX_SUGGESTIONS);
    const lastItem = selected.pop();
    return message + selected.join(', ') + ', or ' + lastItem + '?';
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isIterableObject.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Returns true if the provided object is an Object (i.e. not a string literal)
 * and implements the Iterator protocol.
 *
 * This may be used in place of [Array.isArray()][isArray] to determine if
 * an object should be iterated-over e.g. Array, Map, Set, Int8Array,
 * TypedArray, etc. but excludes string literals.
 *
 * @example
 * ```ts
 * isIterableObject([ 1, 2, 3 ]) // true
 * isIterableObject(new Map()) // true
 * isIterableObject('ABC') // false
 * isIterableObject({ key: 'value' }) // false
 * isIterableObject({ length: 1, 0: 'Alpha' }) // false
 * ```
 */ __turbopack_esm__({
    "isIterableObject": (()=>isIterableObject)
});
function isIterableObject(maybeIterable) {
    return typeof maybeIterable === 'object' && typeof (maybeIterable === null || maybeIterable === void 0 ? void 0 : maybeIterable[Symbol.iterator]) === 'function';
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/printPathArray.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Build a string describing the path.
 */ __turbopack_esm__({
    "printPathArray": (()=>printPathArray)
});
function printPathArray(path) {
    return path.map((key)=>typeof key === 'number' ? '[' + key.toString() + ']' : '.' + key).join('');
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Given a Path and a key, return a new Path containing the new key.
 */ __turbopack_esm__({
    "addPath": (()=>addPath),
    "pathToArray": (()=>pathToArray)
});
function addPath(prev, key, typename) {
    return {
        prev,
        key,
        typename
    };
}
function pathToArray(path) {
    const flattened = [];
    let curr = path;
    while(curr){
        flattened.push(curr.key);
        curr = curr.prev;
    }
    return flattened.reverse();
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/groupBy.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Groups array items into a Map, given a function to produce grouping key.
 */ __turbopack_esm__({
    "groupBy": (()=>groupBy)
});
function groupBy(list, keyFn) {
    const result = new Map();
    for (const item of list){
        const key = keyFn(item);
        const group = result.get(key);
        if (group === undefined) {
            result.set(key, [
                item
            ]);
        } else {
            group.push(item);
        }
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isAsyncIterable.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Returns true if the provided object implements the AsyncIterator protocol via
 * implementing a `Symbol.asyncIterator` method.
 */ __turbopack_esm__({
    "isAsyncIterable": (()=>isAsyncIterable)
});
function isAsyncIterable(maybeAsyncIterable) {
    return typeof (maybeAsyncIterable === null || maybeAsyncIterable === void 0 ? void 0 : maybeAsyncIterable[Symbol.asyncIterator]) === 'function';
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/memoize3.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Memoizes the provided three-argument function.
 */ __turbopack_esm__({
    "memoize3": (()=>memoize3)
});
function memoize3(fn) {
    let cache0;
    return function memoized(a1, a2, a3) {
        if (cache0 === undefined) {
            cache0 = new WeakMap();
        }
        let cache1 = cache0.get(a1);
        if (cache1 === undefined) {
            cache1 = new WeakMap();
            cache0.set(a1, cache1);
        }
        let cache2 = cache1.get(a2);
        if (cache2 === undefined) {
            cache2 = new WeakMap();
            cache1.set(a2, cache2);
        }
        let fnResult = cache2.get(a3);
        if (fnResult === undefined) {
            fnResult = fn(a1, a2, a3);
            cache2.set(a3, fnResult);
        }
        return fnResult;
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isPromise.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Returns true if the value acts like a Promise, i.e. has a "then" function,
 * otherwise returns false.
 */ __turbopack_esm__({
    "isPromise": (()=>isPromise)
});
function isPromise(value) {
    return typeof (value === null || value === void 0 ? void 0 : value.then) === 'function';
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/promiseReduce.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "promiseReduce": (()=>promiseReduce)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isPromise.mjs [app-client] (ecmascript)");
;
function promiseReduce(values, callbackFn, initialValue) {
    let accumulator = initialValue;
    for (const value of values){
        accumulator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(accumulator) ? accumulator.then((resolved)=>callbackFn(resolved, value)) : callbackFn(accumulator, value);
    }
    return accumulator;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/promiseForObject.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * This function transforms a JS object `ObjMap<Promise<T>>` into
 * a `Promise<ObjMap<T>>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */ __turbopack_esm__({
    "promiseForObject": (()=>promiseForObject)
});
function promiseForObject(object) {
    return Promise.all(Object.values(object)).then((resolvedValues)=>{
        const resolvedObject = Object.create(null);
        for (const [i, key] of Object.keys(object).entries()){
            resolvedObject[key] = resolvedValues[i];
        }
        return resolvedObject;
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/toError.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "toError": (()=>toError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
;
function toError(thrownValue) {
    return thrownValue instanceof Error ? thrownValue : new NonErrorThrown(thrownValue);
}
class NonErrorThrown extends Error {
    constructor(thrownValue){
        super('Unexpected error value: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(thrownValue));
        this.name = 'NonErrorThrown';
        this.thrownValue = thrownValue;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript) <export pathToArray as responsePathAsArray>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "responsePathAsArray": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript)");
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.isObjectLike = isObjectLike;
/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */ function isObjectLike(value) {
    return typeof value == 'object' && value !== null;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.invariant = invariant;
function invariant(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
        throw new Error(message != null ? message : 'Unexpected invariant triggered.');
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.devAssert = devAssert;
function devAssert(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
        throw new Error(message);
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.inspect = inspect;
const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
/**
 * Used to print values in error messages.
 */ function inspect(value) {
    return formatValue(value, []);
}
function formatValue(value, seenValues) {
    switch(typeof value){
        case 'string':
            return JSON.stringify(value);
        case 'function':
            return value.name ? `[function ${value.name}]` : '[function]';
        case 'object':
            return formatObjectValue(value, seenValues);
        default:
            return String(value);
    }
}
function formatObjectValue(value, previouslySeenValues) {
    if (value === null) {
        return 'null';
    }
    if (previouslySeenValues.includes(value)) {
        return '[Circular]';
    }
    const seenValues = [
        ...previouslySeenValues,
        value
    ];
    if (isJSONable(value)) {
        const jsonValue = value.toJSON(); // check for infinite recursion
        if (jsonValue !== value) {
            return typeof jsonValue === 'string' ? jsonValue : formatValue(jsonValue, seenValues);
        }
    } else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
    }
    return formatObject(value, seenValues);
}
function isJSONable(value) {
    return typeof value.toJSON === 'function';
}
function formatObject(object, seenValues) {
    const entries = Object.entries(object);
    if (entries.length === 0) {
        return '{}';
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[' + getObjectTag(object) + ']';
    }
    const properties = entries.map(([key, value])=>key + ': ' + formatValue(value, seenValues));
    return '{ ' + properties.join(', ') + ' }';
}
function formatArray(array, seenValues) {
    if (array.length === 0) {
        return '[]';
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[Array]';
    }
    const len = Math.min(MAX_ARRAY_LENGTH, array.length);
    const remaining = array.length - len;
    const items = [];
    for(let i = 0; i < len; ++i){
        items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
        items.push('... 1 more item');
    } else if (remaining > 1) {
        items.push(`... ${remaining} more items`);
    }
    return '[' + items.join(', ') + ']';
}
function getObjectTag(object) {
    const tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');
    if (tag === 'Object' && typeof object.constructor === 'function') {
        const name = object.constructor.name;
        if (typeof name === 'string' && name !== '') {
            return name;
        }
    }
    return tag;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/instanceOf.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.instanceOf = void 0;
var _inspect = __turbopack_require__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.js [app-client] (ecmascript)");
/**
 * A replacement for instanceof which includes an error warning when multi-realm
 * constructors are detected.
 * See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
 * See: https://webpack.js.org/guides/production/
 */ const instanceOf = /* c8 ignore next 6 */ // FIXME: https://github.com/graphql/graphql-js/issues/2317
globalThis.process && globalThis.process.env.NODE_ENV === 'production' ? function instanceOf(value, constructor) {
    return value instanceof constructor;
} : function instanceOf(value, constructor) {
    if (value instanceof constructor) {
        return true;
    }
    if (typeof value === 'object' && value !== null) {
        var _value$constructor;
        // Prefer Symbol.toStringTag since it is immune to minification.
        const className = constructor.prototype[Symbol.toStringTag];
        const valueClassName = Symbol.toStringTag in value // @ts-expect-error TS bug see, https://github.com/microsoft/TypeScript/issues/38009
         ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name;
        if (className === valueClassName) {
            const stringifiedValue = (0, _inspect.inspect)(value);
            throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
        }
    }
    return false;
};
exports.instanceOf = instanceOf;
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GraphQLError": (()=>GraphQLError),
    "formatError": (()=>formatError),
    "printError": (()=>printError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$location$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/location.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printLocation.mjs [app-client] (ecmascript)");
;
;
;
function toNormalizedOptions(args) {
    const firstArg = args[0];
    if (firstArg == null || 'kind' in firstArg || 'length' in firstArg) {
        return {
            nodes: firstArg,
            source: args[1],
            positions: args[2],
            path: args[3],
            originalError: args[4],
            extensions: args[5]
        };
    }
    return firstArg;
}
class GraphQLError extends Error {
    /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */ /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */ /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */ /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */ /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */ /**
   * The original error thrown from a field resolver during execution.
   */ /**
   * Extension fields to add to the formatted error.
   */ /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */ constructor(message, ...rawArgs){
        var _this$nodes, _nodeLocations$, _ref;
        const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
        super(message);
        this.name = 'GraphQLError';
        this.path = path !== null && path !== void 0 ? path : undefined;
        this.originalError = originalError !== null && originalError !== void 0 ? originalError : undefined; // Compute list of blame nodes.
        this.nodes = undefinedIfEmpty(Array.isArray(nodes) ? nodes : nodes ? [
            nodes
        ] : undefined);
        const nodeLocations = undefinedIfEmpty((_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node)=>node.loc).filter((loc)=>loc != null)); // Compute locations in the source for the given nodes/positions.
        this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
        this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc)=>loc.start);
        this.locations = positions && source ? positions.map((pos)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$location$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocation"])(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$location$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocation"])(loc.source, loc.start));
        const originalExtensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(originalError === null || originalError === void 0 ? void 0 : originalError.extensions) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : undefined;
        this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : Object.create(null); // Only properties prescribed by the spec should be enumerable.
        // Keep the rest as non-enumerable.
        Object.defineProperties(this, {
            message: {
                writable: true,
                enumerable: true
            },
            name: {
                enumerable: false
            },
            nodes: {
                enumerable: false
            },
            source: {
                enumerable: false
            },
            positions: {
                enumerable: false
            },
            originalError: {
                enumerable: false
            }
        }); // Include (non-enumerable) stack trace.
        /* c8 ignore start */ // FIXME: https://github.com/graphql/graphql-js/issues/2317
        if (originalError !== null && originalError !== void 0 && originalError.stack) {
            Object.defineProperty(this, 'stack', {
                value: originalError.stack,
                writable: true,
                configurable: true
            });
        } else if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GraphQLError);
        } else {
            Object.defineProperty(this, 'stack', {
                value: Error().stack,
                writable: true,
                configurable: true
            });
        }
    /* c8 ignore stop */ }
    get [Symbol.toStringTag]() {
        return 'GraphQLError';
    }
    toString() {
        let output = this.message;
        if (this.nodes) {
            for (const node of this.nodes){
                if (node.loc) {
                    output += '\n\n' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printLocation"])(node.loc);
                }
            }
        } else if (this.source && this.locations) {
            for (const location of this.locations){
                output += '\n\n' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printSourceLocation"])(this.source, location);
            }
        }
        return output;
    }
    toJSON() {
        const formattedError = {
            message: this.message
        };
        if (this.locations != null) {
            formattedError.locations = this.locations;
        }
        if (this.path != null) {
            formattedError.path = this.path;
        }
        if (this.extensions != null && Object.keys(this.extensions).length > 0) {
            formattedError.extensions = this.extensions;
        }
        return formattedError;
    }
}
function undefinedIfEmpty(array) {
    return array === undefined || array.length === 0 ? undefined : array;
}
function printError(error) {
    return error.toString();
}
function formatError(error) {
    return error.toJSON();
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/syntaxError.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "syntaxError": (()=>syntaxError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
;
function syntaxError(source, position, description) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Syntax Error: ${description}`, {
        source,
        positions: [
            position
        ]
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/locatedError.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "locatedError": (()=>locatedError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/toError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
;
;
function locatedError(rawOriginalError, nodes, path) {
    var _nodes;
    const originalError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toError"])(rawOriginalError); // Note: this uses a brand-check to support GraphQL errors originating from other contexts.
    if (isLocatedGraphQLError(originalError)) {
        return originalError;
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](originalError.message, {
        nodes: (_nodes = originalError.nodes) !== null && _nodes !== void 0 ? _nodes : nodes,
        source: originalError.source,
        positions: originalError.positions,
        path,
        originalError
    });
}
function isLocatedGraphQLError(error) {
    return Array.isArray(error.path);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.GraphQLError = void 0;
exports.formatError = formatError;
exports.printError = printError;
var _isObjectLike = __turbopack_require__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.js [app-client] (ecmascript)");
var _location = __turbopack_require__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/location.js [app-client] (ecmascript)");
var _printLocation = __turbopack_require__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printLocation.js [app-client] (ecmascript)");
function toNormalizedOptions(args) {
    const firstArg = args[0];
    if (firstArg == null || 'kind' in firstArg || 'length' in firstArg) {
        return {
            nodes: firstArg,
            source: args[1],
            positions: args[2],
            path: args[3],
            originalError: args[4],
            extensions: args[5]
        };
    }
    return firstArg;
}
/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */ class GraphQLError extends Error {
    /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */ /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */ /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */ /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */ /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */ /**
   * The original error thrown from a field resolver during execution.
   */ /**
   * Extension fields to add to the formatted error.
   */ /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */ constructor(message, ...rawArgs){
        var _this$nodes, _nodeLocations$, _ref;
        const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
        super(message);
        this.name = 'GraphQLError';
        this.path = path !== null && path !== void 0 ? path : undefined;
        this.originalError = originalError !== null && originalError !== void 0 ? originalError : undefined; // Compute list of blame nodes.
        this.nodes = undefinedIfEmpty(Array.isArray(nodes) ? nodes : nodes ? [
            nodes
        ] : undefined);
        const nodeLocations = undefinedIfEmpty((_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node)=>node.loc).filter((loc)=>loc != null)); // Compute locations in the source for the given nodes/positions.
        this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
        this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc)=>loc.start);
        this.locations = positions && source ? positions.map((pos)=>(0, _location.getLocation)(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc)=>(0, _location.getLocation)(loc.source, loc.start));
        const originalExtensions = (0, _isObjectLike.isObjectLike)(originalError === null || originalError === void 0 ? void 0 : originalError.extensions) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : undefined;
        this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : Object.create(null); // Only properties prescribed by the spec should be enumerable.
        // Keep the rest as non-enumerable.
        Object.defineProperties(this, {
            message: {
                writable: true,
                enumerable: true
            },
            name: {
                enumerable: false
            },
            nodes: {
                enumerable: false
            },
            source: {
                enumerable: false
            },
            positions: {
                enumerable: false
            },
            originalError: {
                enumerable: false
            }
        }); // Include (non-enumerable) stack trace.
        /* c8 ignore start */ // FIXME: https://github.com/graphql/graphql-js/issues/2317
        if (originalError !== null && originalError !== void 0 && originalError.stack) {
            Object.defineProperty(this, 'stack', {
                value: originalError.stack,
                writable: true,
                configurable: true
            });
        } else if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GraphQLError);
        } else {
            Object.defineProperty(this, 'stack', {
                value: Error().stack,
                writable: true,
                configurable: true
            });
        }
    /* c8 ignore stop */ }
    get [Symbol.toStringTag]() {
        return 'GraphQLError';
    }
    toString() {
        let output = this.message;
        if (this.nodes) {
            for (const node of this.nodes){
                if (node.loc) {
                    output += '\n\n' + (0, _printLocation.printLocation)(node.loc);
                }
            }
        } else if (this.source && this.locations) {
            for (const location of this.locations){
                output += '\n\n' + (0, _printLocation.printSourceLocation)(this.source, location);
            }
        }
        return output;
    }
    toJSON() {
        const formattedError = {
            message: this.message
        };
        if (this.locations != null) {
            formattedError.locations = this.locations;
        }
        if (this.path != null) {
            formattedError.path = this.path;
        }
        if (this.extensions != null && Object.keys(this.extensions).length > 0) {
            formattedError.extensions = this.extensions;
        }
        return formattedError;
    }
}
exports.GraphQLError = GraphQLError;
function undefinedIfEmpty(array) {
    return array === undefined || array.length === 0 ? undefined : array;
}
/**
 * See: https://spec.graphql.org/draft/#sec-Errors
 */ /**
 * Prints a GraphQLError to a string, representing useful location information
 * about the error's position in the source.
 *
 * @deprecated Please use `error.toString` instead. Will be removed in v17
 */ function printError(error) {
    return error.toString();
}
/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification.
 *
 * @deprecated Please use `error.toJSON` instead. Will be removed in v17
 */ function formatError(error) {
    return error.toJSON();
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/syntaxError.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.syntaxError = syntaxError;
var _GraphQLError = __turbopack_require__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.js [app-client] (ecmascript)");
/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */ function syntaxError(source, position, description) {
    return new _GraphQLError.GraphQLError(`Syntax Error: ${description}`, {
        source,
        positions: [
            position
        ]
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/values.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getArgumentValues": (()=>getArgumentValues),
    "getDirectiveValues": (()=>getDirectiveValues),
    "getVariableValues": (()=>getVariableValues)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$coerceInputValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/coerceInputValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$printPathArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/printPathArray.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
function getVariableValues(schema, varDefNodes, inputs, options) {
    const errors = [];
    const maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors;
    try {
        const coerced = coerceVariableValues(schema, varDefNodes, inputs, (error)=>{
            if (maxErrors != null && errors.length >= maxErrors) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Too many errors processing variables, error limit reached. Execution aborted.');
            }
            errors.push(error);
        });
        if (errors.length === 0) {
            return {
                coerced
            };
        }
    } catch (error) {
        errors.push(error);
    }
    return {
        errors
    };
}
function coerceVariableValues(schema, varDefNodes, inputs, onError) {
    const coercedValues = {};
    for (const varDefNode of varDefNodes){
        const varName = varDefNode.variable.name.value;
        const varType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeFromAST"])(schema, varDefNode.type);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(varType)) {
            // Must use input types for variables. This should be caught during
            // validation, however is checked again here for safety.
            const varTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(varDefNode.type);
            onError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`, {
                nodes: varDefNode.type
            }));
            continue;
        }
        if (!hasOwnProperty(inputs, varName)) {
            if (varDefNode.defaultValue) {
                coercedValues[varName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromAST"])(varDefNode.defaultValue, varType);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(varType)) {
                const varTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(varType);
                onError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Variable "$${varName}" of required type "${varTypeStr}" was not provided.`, {
                    nodes: varDefNode
                }));
            }
            continue;
        }
        const value = inputs[varName];
        if (value === null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(varType)) {
            const varTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(varType);
            onError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`, {
                nodes: varDefNode
            }));
            continue;
        }
        coercedValues[varName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$coerceInputValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["coerceInputValue"])(value, varType, (path, invalidValue, error)=>{
            let prefix = `Variable "$${varName}" got invalid value ` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(invalidValue);
            if (path.length > 0) {
                prefix += ` at "${varName}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$printPathArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printPathArray"])(path)}"`;
            }
            onError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](prefix + '; ' + error.message, {
                nodes: varDefNode,
                originalError: error
            }));
        });
    }
    return coercedValues;
}
function getArgumentValues(def, node, variableValues) {
    var _node$arguments;
    const coercedValues = {}; // FIXME: https://github.com/graphql/graphql-js/issues/2203
    /* c8 ignore next */ const argumentNodes = (_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : [];
    const argNodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyMap"])(argumentNodes, (arg)=>arg.name.value);
    for (const argDef of def.args){
        const name = argDef.name;
        const argType = argDef.type;
        const argumentNode = argNodeMap[name];
        if (!argumentNode) {
            if (argDef.defaultValue !== undefined) {
                coercedValues[name] = argDef.defaultValue;
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(argType)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Argument "${name}" of required type "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(argType)}" ` + 'was not provided.', {
                    nodes: node
                });
            }
            continue;
        }
        const valueNode = argumentNode.value;
        let isNull = valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL;
        if (valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE) {
            const variableName = valueNode.name.value;
            if (variableValues == null || !hasOwnProperty(variableValues, variableName)) {
                if (argDef.defaultValue !== undefined) {
                    coercedValues[name] = argDef.defaultValue;
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(argType)) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Argument "${name}" of required type "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(argType)}" ` + `was provided the variable "$${variableName}" which was not provided a runtime value.`, {
                        nodes: valueNode
                    });
                }
                continue;
            }
            isNull = variableValues[variableName] == null;
        }
        if (isNull && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(argType)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Argument "${name}" of non-null type "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(argType)}" ` + 'must not be null.', {
                nodes: valueNode
            });
        }
        const coercedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromAST"])(valueNode, argType, variableValues);
        if (coercedValue === undefined) {
            // Note: ValuesOfCorrectTypeRule validation should catch this before
            // execution. This is a runtime check to ensure execution does not
            // continue with an invalid argument value.
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Argument "${name}" has invalid value ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode)}.`, {
                nodes: valueNode
            });
        }
        coercedValues[name] = coercedValue;
    }
    return coercedValues;
}
function getDirectiveValues(directiveDef, node, variableValues) {
    var _node$directives;
    const directiveNode = (_node$directives = node.directives) === null || _node$directives === void 0 ? void 0 : _node$directives.find((directive)=>directive.name.value === directiveDef.name);
    if (directiveNode) {
        return getArgumentValues(directiveDef, directiveNode, variableValues);
    }
}
function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/collectFields.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "collectFields": (()=>collectFields),
    "collectSubfields": (()=>collectSubfields)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/values.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
;
;
;
;
;
function collectFields(schema, fragments, variableValues, runtimeType, selectionSet) {
    const fields = new Map();
    collectFieldsImpl(schema, fragments, variableValues, runtimeType, selectionSet, fields, new Set());
    return fields;
}
function collectSubfields(schema, fragments, variableValues, returnType, fieldNodes) {
    const subFieldNodes = new Map();
    const visitedFragmentNames = new Set();
    for (const node of fieldNodes){
        if (node.selectionSet) {
            collectFieldsImpl(schema, fragments, variableValues, returnType, node.selectionSet, subFieldNodes, visitedFragmentNames);
        }
    }
    return subFieldNodes;
}
function collectFieldsImpl(schema, fragments, variableValues, runtimeType, selectionSet, fields, visitedFragmentNames) {
    for (const selection of selectionSet.selections){
        switch(selection.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FIELD:
                {
                    if (!shouldIncludeNode(variableValues, selection)) {
                        continue;
                    }
                    const name = getFieldEntryKey(selection);
                    const fieldList = fields.get(name);
                    if (fieldList !== undefined) {
                        fieldList.push(selection);
                    } else {
                        fields.set(name, [
                            selection
                        ]);
                    }
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INLINE_FRAGMENT:
                {
                    if (!shouldIncludeNode(variableValues, selection) || !doesFragmentConditionMatch(schema, selection, runtimeType)) {
                        continue;
                    }
                    collectFieldsImpl(schema, fragments, variableValues, runtimeType, selection.selectionSet, fields, visitedFragmentNames);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_SPREAD:
                {
                    const fragName = selection.name.value;
                    if (visitedFragmentNames.has(fragName) || !shouldIncludeNode(variableValues, selection)) {
                        continue;
                    }
                    visitedFragmentNames.add(fragName);
                    const fragment = fragments[fragName];
                    if (!fragment || !doesFragmentConditionMatch(schema, fragment, runtimeType)) {
                        continue;
                    }
                    collectFieldsImpl(schema, fragments, variableValues, runtimeType, fragment.selectionSet, fields, visitedFragmentNames);
                    break;
                }
        }
    }
}
/**
 * Determines if a field should be included based on the `@include` and `@skip`
 * directives, where `@skip` has higher precedence than `@include`.
 */ function shouldIncludeNode(variableValues, node) {
    const skip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectiveValues"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSkipDirective"], node, variableValues);
    if ((skip === null || skip === void 0 ? void 0 : skip.if) === true) {
        return false;
    }
    const include = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectiveValues"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLIncludeDirective"], node, variableValues);
    if ((include === null || include === void 0 ? void 0 : include.if) === false) {
        return false;
    }
    return true;
}
/**
 * Determines if a fragment is applicable to the given type.
 */ function doesFragmentConditionMatch(schema, fragment, type) {
    const typeConditionNode = fragment.typeCondition;
    if (!typeConditionNode) {
        return true;
    }
    const conditionalType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeFromAST"])(schema, typeConditionNode);
    if (conditionalType === type) {
        return true;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(conditionalType)) {
        return schema.isSubType(conditionalType, type);
    }
    return false;
}
/**
 * Implements the logic to compute the key of a given field's entry
 */ function getFieldEntryKey(node) {
    return node.alias ? node.alias.value : node.name.value;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/execute.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "assertValidExecutionArguments": (()=>assertValidExecutionArguments),
    "buildExecutionContext": (()=>buildExecutionContext),
    "buildResolveInfo": (()=>buildResolveInfo),
    "defaultFieldResolver": (()=>defaultFieldResolver),
    "defaultTypeResolver": (()=>defaultTypeResolver),
    "execute": (()=>execute),
    "executeSync": (()=>executeSync),
    "getFieldDef": (()=>getFieldDef)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$memoize3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/memoize3.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/collectFields.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isPromise.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/values.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$promiseReduce$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/promiseReduce.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$promiseForObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/promiseForObject.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/locatedError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isIterableObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isIterableObject.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/**
 * A memoized collection of relevant subfields with regard to the return
 * type. Memoizing ensures the subfields are not repeatedly calculated, which
 * saves overhead when resolving lists of values.
 */ const collectSubfields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$memoize3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize3"])((exeContext, returnType, fieldNodes)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectSubfields"])(exeContext.schema, exeContext.fragments, exeContext.variableValues, returnType, fieldNodes));
function execute(args) {
    // Temporary for v15 to v16 migration. Remove in v17
    arguments.length < 2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.');
    const { schema, document, variableValues, rootValue } = args; // If arguments are missing or incorrect, throw an error.
    assertValidExecutionArguments(schema, document, variableValues); // If a valid execution context cannot be created due to incorrect arguments,
    // a "Response" with only errors is returned.
    const exeContext = buildExecutionContext(args); // Return early errors if execution context failed.
    if (!('schema' in exeContext)) {
        return {
            errors: exeContext
        };
    } // Return a Promise that will eventually resolve to the data described by
    // The "Response" section of the GraphQL specification.
    //
    // If errors are encountered while executing a GraphQL field, only that
    // field and its descendants will be omitted, and sibling fields will still
    // be executed. An execution which encounters errors will still result in a
    // resolved Promise.
    //
    // Errors from sub-fields of a NonNull type may propagate to the top level,
    // at which point we still log the error and null the parent field, which
    // in this case is the entire response.
    try {
        const { operation } = exeContext;
        const result = executeOperation(exeContext, operation, rootValue);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(result)) {
            return result.then((data)=>buildResponse(data, exeContext.errors), (error)=>{
                exeContext.errors.push(error);
                return buildResponse(null, exeContext.errors);
            });
        }
        return buildResponse(result, exeContext.errors);
    } catch (error) {
        exeContext.errors.push(error);
        return buildResponse(null, exeContext.errors);
    }
}
function executeSync(args) {
    const result = execute(args); // Assert that the execution was synchronous.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(result)) {
        throw new Error('GraphQL execution failed to complete synchronously.');
    }
    return result;
}
/**
 * Given a completed execution context and data, build the `{ errors, data }`
 * response defined by the "Response" section of the GraphQL specification.
 */ function buildResponse(data, errors) {
    return errors.length === 0 ? {
        data
    } : {
        errors,
        data
    };
}
function assertValidExecutionArguments(schema, document, rawVariableValues) {
    document || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Must provide document.'); // If the schema used for execution is invalid, throw an error.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidSchema"])(schema); // Variables, if provided, must be an object.
    rawVariableValues == null || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(rawVariableValues) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided.');
}
function buildExecutionContext(args) {
    var _definition$name, _operation$variableDe;
    const { schema, document, rootValue, contextValue, variableValues: rawVariableValues, operationName, fieldResolver, typeResolver, subscribeFieldResolver } = args;
    let operation;
    const fragments = Object.create(null);
    for (const definition of document.definitions){
        switch(definition.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION:
                if (operationName == null) {
                    if (operation !== undefined) {
                        return [
                            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Must provide operation name if query contains multiple operations.')
                        ];
                    }
                    operation = definition;
                } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
                    operation = definition;
                }
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION:
                fragments[definition.name.value] = definition;
                break;
            default:
        }
    }
    if (!operation) {
        if (operationName != null) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Unknown operation named "${operationName}".`)
            ];
        }
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Must provide an operation.')
        ];
    } // FIXME: https://github.com/graphql/graphql-js/issues/2203
    /* c8 ignore next */ const variableDefinitions = (_operation$variableDe = operation.variableDefinitions) !== null && _operation$variableDe !== void 0 ? _operation$variableDe : [];
    const coercedVariableValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVariableValues"])(schema, variableDefinitions, rawVariableValues !== null && rawVariableValues !== void 0 ? rawVariableValues : {}, {
        maxErrors: 50
    });
    if (coercedVariableValues.errors) {
        return coercedVariableValues.errors;
    }
    return {
        schema,
        fragments,
        rootValue,
        contextValue,
        operation,
        variableValues: coercedVariableValues.coerced,
        fieldResolver: fieldResolver !== null && fieldResolver !== void 0 ? fieldResolver : defaultFieldResolver,
        typeResolver: typeResolver !== null && typeResolver !== void 0 ? typeResolver : defaultTypeResolver,
        subscribeFieldResolver: subscribeFieldResolver !== null && subscribeFieldResolver !== void 0 ? subscribeFieldResolver : defaultFieldResolver,
        errors: []
    };
}
/**
 * Implements the "Executing operations" section of the spec.
 */ function executeOperation(exeContext, operation, rootValue) {
    const rootType = exeContext.schema.getRootType(operation.operation);
    if (rootType == null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Schema is not configured to execute ${operation.operation} operation.`, {
            nodes: operation
        });
    }
    const rootFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectFields"])(exeContext.schema, exeContext.fragments, exeContext.variableValues, rootType, operation.selectionSet);
    const path = undefined;
    switch(operation.operation){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].QUERY:
            return executeFields(exeContext, rootType, rootValue, path, rootFields);
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].MUTATION:
            return executeFieldsSerially(exeContext, rootType, rootValue, path, rootFields);
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].SUBSCRIPTION:
            // TODO: deprecate `subscribe` and move all logic here
            // Temporary solution until we finish merging execute and subscribe together
            return executeFields(exeContext, rootType, rootValue, path, rootFields);
    }
}
/**
 * Implements the "Executing selection sets" section of the spec
 * for fields that must be executed serially.
 */ function executeFieldsSerially(exeContext, parentType, sourceValue, path, fields) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$promiseReduce$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["promiseReduce"])(fields.entries(), (results, [responseName, fieldNodes])=>{
        const fieldPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPath"])(path, responseName, parentType.name);
        const result = executeField(exeContext, parentType, sourceValue, fieldNodes, fieldPath);
        if (result === undefined) {
            return results;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(result)) {
            return result.then((resolvedResult)=>{
                results[responseName] = resolvedResult;
                return results;
            });
        }
        results[responseName] = result;
        return results;
    }, Object.create(null));
}
/**
 * Implements the "Executing selection sets" section of the spec
 * for fields that may be executed in parallel.
 */ function executeFields(exeContext, parentType, sourceValue, path, fields) {
    const results = Object.create(null);
    let containsPromise = false;
    try {
        for (const [responseName, fieldNodes] of fields.entries()){
            const fieldPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPath"])(path, responseName, parentType.name);
            const result = executeField(exeContext, parentType, sourceValue, fieldNodes, fieldPath);
            if (result !== undefined) {
                results[responseName] = result;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(result)) {
                    containsPromise = true;
                }
            }
        }
    } catch (error) {
        if (containsPromise) {
            // Ensure that any promises returned by other fields are handled, as they may also reject.
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$promiseForObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["promiseForObject"])(results).finally(()=>{
                throw error;
            });
        }
        throw error;
    } // If there are no promises, we can just return the object
    if (!containsPromise) {
        return results;
    } // Otherwise, results is a map from field name to the result of resolving that
    // field, which is possibly a promise. Return a promise that will return this
    // same map, but with any promises replaced with the values they resolved to.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$promiseForObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["promiseForObject"])(results);
}
/**
 * Implements the "Executing fields" section of the spec
 * In particular, this function figures out the value that the field returns by
 * calling its resolve function, then calls completeValue to complete promises,
 * serialize scalars, or execute the sub-selection-set for objects.
 */ function executeField(exeContext, parentType, source, fieldNodes, path) {
    var _fieldDef$resolve;
    const fieldDef = getFieldDef(exeContext.schema, parentType, fieldNodes[0]);
    if (!fieldDef) {
        return;
    }
    const returnType = fieldDef.type;
    const resolveFn = (_fieldDef$resolve = fieldDef.resolve) !== null && _fieldDef$resolve !== void 0 ? _fieldDef$resolve : exeContext.fieldResolver;
    const info = buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path); // Get the resolve function, regardless of if its result is normal or abrupt (error).
    try {
        // Build a JS object of arguments from the field.arguments AST, using the
        // variables scope to fulfill any variable references.
        // TODO: find a way to memoize, in case this field is within a List type.
        const args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getArgumentValues"])(fieldDef, fieldNodes[0], exeContext.variableValues); // The resolve function's optional third argument is a context value that
        // is provided to every resolve function within an execution. It is commonly
        // used to represent an authenticated user, or request-specific caches.
        const contextValue = exeContext.contextValue;
        const result = resolveFn(source, args, contextValue, info);
        let completed;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(result)) {
            completed = result.then((resolved)=>completeValue(exeContext, returnType, fieldNodes, info, path, resolved));
        } else {
            completed = completeValue(exeContext, returnType, fieldNodes, info, path, result);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(completed)) {
            // Note: we don't rely on a `catch` method, but we do expect "thenable"
            // to take a second callback for the error case.
            return completed.then(undefined, (rawError)=>{
                const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locatedError"])(rawError, fieldNodes, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path));
                return handleFieldError(error, returnType, exeContext);
            });
        }
        return completed;
    } catch (rawError) {
        const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locatedError"])(rawError, fieldNodes, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path));
        return handleFieldError(error, returnType, exeContext);
    }
}
function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path) {
    // The resolve function's optional fourth argument is a collection of
    // information about the current execution state.
    return {
        fieldName: fieldDef.name,
        fieldNodes,
        returnType: fieldDef.type,
        parentType,
        path,
        schema: exeContext.schema,
        fragments: exeContext.fragments,
        rootValue: exeContext.rootValue,
        operation: exeContext.operation,
        variableValues: exeContext.variableValues
    };
}
function handleFieldError(error, returnType, exeContext) {
    // If the field type is non-nullable, then it is resolved without any
    // protection from errors, however it still properly locates the error.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(returnType)) {
        throw error;
    } // Otherwise, error protection is applied, logging the error and resolving
    // a null value for this field if one is encountered.
    exeContext.errors.push(error);
    return null;
}
/**
 * Implements the instructions for completeValue as defined in the
 * "Value Completion" section of the spec.
 *
 * If the field type is Non-Null, then this recursively completes the value
 * for the inner type. It throws a field error if that completion returns null,
 * as per the "Nullability" section of the spec.
 *
 * If the field type is a List, then this recursively completes the value
 * for the inner type on each item in the list.
 *
 * If the field type is a Scalar or Enum, ensures the completed value is a legal
 * value of the type by calling the `serialize` method of GraphQL type
 * definition.
 *
 * If the field is an abstract type, determine the runtime type of the value
 * and then complete based on that type
 *
 * Otherwise, the field type expects a sub-selection set, and will complete the
 * value by executing all sub-selections.
 */ function completeValue(exeContext, returnType, fieldNodes, info, path, result) {
    // If result is an Error, throw a located error.
    if (result instanceof Error) {
        throw result;
    } // If field type is NonNull, complete for inner type, and throw field error
    // if result is null.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(returnType)) {
        const completed = completeValue(exeContext, returnType.ofType, fieldNodes, info, path, result);
        if (completed === null) {
            throw new Error(`Cannot return null for non-nullable field ${info.parentType.name}.${info.fieldName}.`);
        }
        return completed;
    } // If result value is null or undefined then return null.
    if (result == null) {
        return null;
    } // If field type is List, complete each item in the list with the inner type
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(returnType)) {
        return completeListValue(exeContext, returnType, fieldNodes, info, path, result);
    } // If field type is a leaf type, Scalar or Enum, serialize to a valid value,
    // returning null if serialization is not possible.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLeafType"])(returnType)) {
        return completeLeafValue(returnType, result);
    } // If field type is an abstract type, Interface or Union, determine the
    // runtime Object type and complete for that type.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(returnType)) {
        return completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result);
    } // If field type is Object, execute and complete all sub-selections.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(returnType)) {
        return completeObjectValue(exeContext, returnType, fieldNodes, info, path, result);
    }
    /* c8 ignore next 6 */ // Not reachable, all possible output types have been considered.
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Cannot complete value of unexpected output type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(returnType));
}
/**
 * Complete a list value by completing each item in the list with the
 * inner type
 */ function completeListValue(exeContext, returnType, fieldNodes, info, path, result) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isIterableObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIterableObject"])(result)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected Iterable, but did not find one for field "${info.parentType.name}.${info.fieldName}".`);
    } // This is specified as a simple map, however we're optimizing the path
    // where the list contains no Promises by avoiding creating another Promise.
    const itemType = returnType.ofType;
    let containsPromise = false;
    const completedResults = Array.from(result, (item, index)=>{
        // No need to modify the info object containing the path,
        // since from here on it is not ever accessed by resolver functions.
        const itemPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPath"])(path, index, undefined);
        try {
            let completedItem;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(item)) {
                completedItem = item.then((resolved)=>completeValue(exeContext, itemType, fieldNodes, info, itemPath, resolved));
            } else {
                completedItem = completeValue(exeContext, itemType, fieldNodes, info, itemPath, item);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(completedItem)) {
                containsPromise = true; // Note: we don't rely on a `catch` method, but we do expect "thenable"
                // to take a second callback for the error case.
                return completedItem.then(undefined, (rawError)=>{
                    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locatedError"])(rawError, fieldNodes, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(itemPath));
                    return handleFieldError(error, itemType, exeContext);
                });
            }
            return completedItem;
        } catch (rawError) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locatedError"])(rawError, fieldNodes, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(itemPath));
            return handleFieldError(error, itemType, exeContext);
        }
    });
    return containsPromise ? Promise.all(completedResults) : completedResults;
}
/**
 * Complete a Scalar or Enum by serializing to a valid value, returning
 * null if serialization is not possible.
 */ function completeLeafValue(returnType, result) {
    const serializedResult = returnType.serialize(result);
    if (serializedResult == null) {
        throw new Error(`Expected \`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(returnType)}.serialize(${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(result)})\` to ` + `return non-nullable value, returned: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(serializedResult)}`);
    }
    return serializedResult;
}
/**
 * Complete a value of an abstract type by determining the runtime object type
 * of that value, then complete the value for that type.
 */ function completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result) {
    var _returnType$resolveTy;
    const resolveTypeFn = (_returnType$resolveTy = returnType.resolveType) !== null && _returnType$resolveTy !== void 0 ? _returnType$resolveTy : exeContext.typeResolver;
    const contextValue = exeContext.contextValue;
    const runtimeType = resolveTypeFn(result, contextValue, info, returnType);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(runtimeType)) {
        return runtimeType.then((resolvedRuntimeType)=>completeObjectValue(exeContext, ensureValidRuntimeType(resolvedRuntimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result));
    }
    return completeObjectValue(exeContext, ensureValidRuntimeType(runtimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result);
}
function ensureValidRuntimeType(runtimeTypeName, exeContext, returnType, fieldNodes, info, result) {
    if (runtimeTypeName == null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}". Either the "${returnType.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`, fieldNodes);
    } // releases before 16.0.0 supported returning `GraphQLObjectType` from `resolveType`
    // TODO: remove in 17.0.0 release
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(runtimeTypeName)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead.');
    }
    if (typeof runtimeTypeName !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}" with ` + `value ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(result)}, received "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(runtimeTypeName)}".`);
    }
    const runtimeType = exeContext.schema.getType(runtimeTypeName);
    if (runtimeType == null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Abstract type "${returnType.name}" was resolved to a type "${runtimeTypeName}" that does not exist inside the schema.`, {
            nodes: fieldNodes
        });
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(runtimeType)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Abstract type "${returnType.name}" was resolved to a non-object type "${runtimeTypeName}".`, {
            nodes: fieldNodes
        });
    }
    if (!exeContext.schema.isSubType(returnType, runtimeType)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Runtime Object type "${runtimeType.name}" is not a possible type for "${returnType.name}".`, {
            nodes: fieldNodes
        });
    }
    return runtimeType;
}
/**
 * Complete an Object value by executing all sub-selections.
 */ function completeObjectValue(exeContext, returnType, fieldNodes, info, path, result) {
    // Collect sub-fields to execute to complete this value.
    const subFieldNodes = collectSubfields(exeContext, returnType, fieldNodes); // If there is an isTypeOf predicate function, call it with the
    // current result. If isTypeOf returns false, then raise an error rather
    // than continuing execution.
    if (returnType.isTypeOf) {
        const isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(isTypeOf)) {
            return isTypeOf.then((resolvedIsTypeOf)=>{
                if (!resolvedIsTypeOf) {
                    throw invalidReturnTypeError(returnType, result, fieldNodes);
                }
                return executeFields(exeContext, returnType, result, path, subFieldNodes);
            });
        }
        if (!isTypeOf) {
            throw invalidReturnTypeError(returnType, result, fieldNodes);
        }
    }
    return executeFields(exeContext, returnType, result, path, subFieldNodes);
}
function invalidReturnTypeError(returnType, result, fieldNodes) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected value of type "${returnType.name}" but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(result)}.`, {
        nodes: fieldNodes
    });
}
const defaultTypeResolver = function(value, contextValue, info, abstractType) {
    // First, look for `__typename`.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(value) && typeof value.__typename === 'string') {
        return value.__typename;
    } // Otherwise, test each possible type.
    const possibleTypes = info.schema.getPossibleTypes(abstractType);
    const promisedIsTypeOfResults = [];
    for(let i = 0; i < possibleTypes.length; i++){
        const type = possibleTypes[i];
        if (type.isTypeOf) {
            const isTypeOfResult = type.isTypeOf(value, contextValue, info);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(isTypeOfResult)) {
                promisedIsTypeOfResults[i] = isTypeOfResult;
            } else if (isTypeOfResult) {
                return type.name;
            }
        }
    }
    if (promisedIsTypeOfResults.length) {
        return Promise.all(promisedIsTypeOfResults).then((isTypeOfResults)=>{
            for(let i = 0; i < isTypeOfResults.length; i++){
                if (isTypeOfResults[i]) {
                    return possibleTypes[i].name;
                }
            }
        });
    }
};
const defaultFieldResolver = function(source, args, contextValue, info) {
    // ensure source is a value for which property access is acceptable.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(source) || typeof source === 'function') {
        const property = source[info.fieldName];
        if (typeof property === 'function') {
            return source[info.fieldName](args, contextValue, info);
        }
        return property;
    }
};
function getFieldDef(schema, parentType, fieldNode) {
    const fieldName = fieldNode.name.value;
    if (fieldName === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SchemaMetaFieldDef"].name && schema.getQueryType() === parentType) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SchemaMetaFieldDef"];
    } else if (fieldName === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeMetaFieldDef"].name && schema.getQueryType() === parentType) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeMetaFieldDef"];
    } else if (fieldName === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeNameMetaFieldDef"].name) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeNameMetaFieldDef"];
    }
    return parentType.getFields()[fieldName];
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/mapAsyncIterator.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */ __turbopack_esm__({
    "mapAsyncIterator": (()=>mapAsyncIterator)
});
function mapAsyncIterator(iterable, callback) {
    const iterator = iterable[Symbol.asyncIterator]();
    async function mapResult(result) {
        if (result.done) {
            return result;
        }
        try {
            return {
                value: await callback(result.value),
                done: false
            };
        } catch (error) {
            /* c8 ignore start */ // FIXME: add test case
            if (typeof iterator.return === 'function') {
                try {
                    await iterator.return();
                } catch (_e) {
                /* ignore error */ }
            }
            throw error;
        /* c8 ignore stop */ }
    }
    return {
        async next () {
            return mapResult(await iterator.next());
        },
        async return () {
            // If iterator.return() does not exist, then type R must be undefined.
            return typeof iterator.return === 'function' ? mapResult(await iterator.return()) : {
                value: undefined,
                done: true
            };
        },
        async throw (error) {
            if (typeof iterator.throw === 'function') {
                return mapResult(await iterator.throw(error));
            }
            throw error;
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/subscribe.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "createSourceEventStream": (()=>createSourceEventStream),
    "subscribe": (()=>subscribe)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isAsyncIterable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isAsyncIterable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/execute.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$mapAsyncIterator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/mapAsyncIterator.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/collectFields.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/values.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/locatedError.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
async function subscribe(args) {
    // Temporary for v15 to v16 migration. Remove in v17
    arguments.length < 2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.');
    const resultOrStream = await createSourceEventStream(args);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isAsyncIterable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAsyncIterable"])(resultOrStream)) {
        return resultOrStream;
    } // For each payload yielded from a subscription, map it over the normal
    // GraphQL `execute` function, with `payload` as the rootValue.
    // This implements the "MapSourceToResponseEvent" algorithm described in
    // the GraphQL specification. The `execute` function provides the
    // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
    // "ExecuteQuery" algorithm, for which `execute` is also used.
    const mapSourceToResponse = (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["execute"])({
            ...args,
            rootValue: payload
        }); // Map every source value to a ExecutionResult value as described above.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$mapAsyncIterator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAsyncIterator"])(resultOrStream, mapSourceToResponse);
}
function toNormalizedArgs(args) {
    const firstArg = args[0];
    if (firstArg && 'document' in firstArg) {
        return firstArg;
    }
    return {
        schema: firstArg,
        // FIXME: when underlying TS bug fixed, see https://github.com/microsoft/TypeScript/issues/31613
        document: args[1],
        rootValue: args[2],
        contextValue: args[3],
        variableValues: args[4],
        operationName: args[5],
        subscribeFieldResolver: args[6]
    };
}
async function createSourceEventStream(...rawArgs) {
    const args = toNormalizedArgs(rawArgs);
    const { schema, document, variableValues } = args; // If arguments are missing or incorrectly typed, this is an internal
    // developer mistake which should throw an early error.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidExecutionArguments"])(schema, document, variableValues); // If a valid execution context cannot be created due to incorrect arguments,
    // a "Response" with only errors is returned.
    const exeContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildExecutionContext"])(args); // Return early errors if execution context failed.
    if (!('schema' in exeContext)) {
        return {
            errors: exeContext
        };
    }
    try {
        const eventStream = await executeSubscription(exeContext); // Assert field returned an event stream, otherwise yield an error.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isAsyncIterable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAsyncIterable"])(eventStream)) {
            throw new Error('Subscription field must return Async Iterable. ' + `Received: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(eventStream)}.`);
        }
        return eventStream;
    } catch (error) {
        // If it GraphQLError, report it as an ExecutionResult, containing only errors and no data.
        // Otherwise treat the error as a system-class error and re-throw it.
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]) {
            return {
                errors: [
                    error
                ]
            };
        }
        throw error;
    }
}
async function executeSubscription(exeContext) {
    const { schema, fragments, operation, variableValues, rootValue } = exeContext;
    const rootType = schema.getSubscriptionType();
    if (rootType == null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Schema is not configured to execute subscription operation.', {
            nodes: operation
        });
    }
    const rootFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectFields"])(schema, fragments, variableValues, rootType, operation.selectionSet);
    const [responseName, fieldNodes] = [
        ...rootFields.entries()
    ][0];
    const fieldDef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFieldDef"])(schema, rootType, fieldNodes[0]);
    if (!fieldDef) {
        const fieldName = fieldNodes[0].name.value;
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`The subscription field "${fieldName}" is not defined.`, {
            nodes: fieldNodes
        });
    }
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPath"])(undefined, responseName, rootType.name);
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildResolveInfo"])(exeContext, fieldDef, fieldNodes, rootType, path);
    try {
        var _fieldDef$subscribe;
        // Implements the "ResolveFieldEventStream" algorithm from GraphQL specification.
        // It differs from "ResolveFieldValue" due to providing a different `resolveFn`.
        // Build a JS object of arguments from the field.arguments AST, using the
        // variables scope to fulfill any variable references.
        const args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getArgumentValues"])(fieldDef, fieldNodes[0], variableValues); // The resolve function's optional third argument is a context value that
        // is provided to every resolve function within an execution. It is commonly
        // used to represent an authenticated user, or request-specific caches.
        const contextValue = exeContext.contextValue; // Call the `subscribe()` resolver or the default resolver to produce an
        // AsyncIterable yielding raw payloads.
        const resolveFn = (_fieldDef$subscribe = fieldDef.subscribe) !== null && _fieldDef$subscribe !== void 0 ? _fieldDef$subscribe : exeContext.subscribeFieldResolver;
        const eventStream = await resolveFn(rootValue, args, contextValue, info);
        if (eventStream instanceof Error) {
            throw eventStream;
        }
        return eventStream;
    } catch (error) {
        throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locatedError"])(error, fieldNodes, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path));
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/graphql.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "graphql": (()=>graphql),
    "graphqlSync": (()=>graphqlSync)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isPromise.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/parser.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/execute.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
function graphql(args) {
    // Always return a Promise for a consistent API.
    return new Promise((resolve)=>resolve(graphqlImpl(args)));
}
function graphqlSync(args) {
    const result = graphqlImpl(args); // Assert that the execution was synchronous.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isPromise$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPromise"])(result)) {
        throw new Error('GraphQL execution failed to complete synchronously.');
    }
    return result;
}
function graphqlImpl(args) {
    // Temporary for v15 to v16 migration. Remove in v17
    arguments.length < 2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.');
    const { schema, source, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver } = args; // Validate Schema
    const schemaValidationErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateSchema"])(schema);
    if (schemaValidationErrors.length > 0) {
        return {
            errors: schemaValidationErrors
        };
    } // Parse
    let document;
    try {
        document = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"])(source);
    } catch (syntaxError) {
        return {
            errors: [
                syntaxError
            ]
        };
    } // Validate
    const validationErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validate"])(schema, document);
    if (validationErrors.length > 0) {
        return {
            errors: validationErrors
        };
    } // Execute
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["execute"])({
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        typeResolver
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/version.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// Note: This file is autogenerated using "resources/gen-version.js" script and
// automatically updated by "npm version" command.
/**
 * A string containing the version of the GraphQL.js library
 */ __turbopack_esm__({
    "version": (()=>version),
    "versionInfo": (()=>versionInfo)
});
const version = '16.8.1';
const versionInfo = Object.freeze({
    major: 16,
    minor: 8,
    patch: 1,
    preReleaseTag: null
});
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "BREAK": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BREAK"]),
    "BreakingChangeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$findBreakingChanges$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BreakingChangeType"]),
    "DEFAULT_DEPRECATION_REASON": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DEPRECATION_REASON"]),
    "DangerousChangeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$findBreakingChanges$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DangerousChangeType"]),
    "DirectiveLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"]),
    "ExecutableDefinitionsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ExecutableDefinitionsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExecutableDefinitionsRule"]),
    "FieldsOnCorrectTypeRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FieldsOnCorrectTypeRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldsOnCorrectTypeRule"]),
    "FragmentsOnCompositeTypesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FragmentsOnCompositeTypesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FragmentsOnCompositeTypesRule"]),
    "GRAPHQL_MAX_INT": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRAPHQL_MAX_INT"]),
    "GRAPHQL_MIN_INT": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRAPHQL_MIN_INT"]),
    "GraphQLBoolean": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
    "GraphQLDeprecatedDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDeprecatedDirective"]),
    "GraphQLDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDirective"]),
    "GraphQLEnumType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]),
    "GraphQLError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]),
    "GraphQLFloat": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLFloat"]),
    "GraphQLID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLID"]),
    "GraphQLIncludeDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLIncludeDirective"]),
    "GraphQLInputObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInputObjectType"]),
    "GraphQLInt": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInt"]),
    "GraphQLInterfaceType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInterfaceType"]),
    "GraphQLList": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"]),
    "GraphQLNonNull": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"]),
    "GraphQLObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]),
    "GraphQLScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]),
    "GraphQLSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSchema"]),
    "GraphQLSkipDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSkipDirective"]),
    "GraphQLSpecifiedByDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSpecifiedByDirective"]),
    "GraphQLString": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
    "GraphQLUnionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLUnionType"]),
    "Kind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"]),
    "KnownArgumentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownArgumentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KnownArgumentNamesRule"]),
    "KnownDirectivesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownDirectivesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KnownDirectivesRule"]),
    "KnownFragmentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownFragmentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KnownFragmentNamesRule"]),
    "KnownTypeNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownTypeNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KnownTypeNamesRule"]),
    "Lexer": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$lexer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Lexer"]),
    "Location": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Location"]),
    "LoneAnonymousOperationRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneAnonymousOperationRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoneAnonymousOperationRule"]),
    "LoneSchemaDefinitionRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneSchemaDefinitionRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoneSchemaDefinitionRule"]),
    "NoDeprecatedCustomRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$custom$2f$NoDeprecatedCustomRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoDeprecatedCustomRule"]),
    "NoFragmentCyclesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoFragmentCyclesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoFragmentCyclesRule"]),
    "NoSchemaIntrospectionCustomRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$custom$2f$NoSchemaIntrospectionCustomRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoSchemaIntrospectionCustomRule"]),
    "NoUndefinedVariablesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUndefinedVariablesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoUndefinedVariablesRule"]),
    "NoUnusedFragmentsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedFragmentsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoUnusedFragmentsRule"]),
    "NoUnusedVariablesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedVariablesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoUnusedVariablesRule"]),
    "OperationTypeNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"]),
    "OverlappingFieldsCanBeMergedRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$OverlappingFieldsCanBeMergedRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OverlappingFieldsCanBeMergedRule"]),
    "PossibleFragmentSpreadsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleFragmentSpreadsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PossibleFragmentSpreadsRule"]),
    "PossibleTypeExtensionsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleTypeExtensionsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PossibleTypeExtensionsRule"]),
    "ProvidedRequiredArgumentsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ProvidedRequiredArgumentsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProvidedRequiredArgumentsRule"]),
    "ScalarLeafsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ScalarLeafsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScalarLeafsRule"]),
    "SchemaMetaFieldDef": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SchemaMetaFieldDef"]),
    "SingleFieldSubscriptionsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$SingleFieldSubscriptionsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SingleFieldSubscriptionsRule"]),
    "Source": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Source"]),
    "Token": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Token"]),
    "TokenKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$tokenKind$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenKind"]),
    "TypeInfo": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeInfo"]),
    "TypeKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"]),
    "TypeMetaFieldDef": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeMetaFieldDef"]),
    "TypeNameMetaFieldDef": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeNameMetaFieldDef"]),
    "UniqueArgumentDefinitionNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentDefinitionNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueArgumentDefinitionNamesRule"]),
    "UniqueArgumentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueArgumentNamesRule"]),
    "UniqueDirectiveNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectiveNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueDirectiveNamesRule"]),
    "UniqueDirectivesPerLocationRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectivesPerLocationRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueDirectivesPerLocationRule"]),
    "UniqueEnumValueNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueEnumValueNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueEnumValueNamesRule"]),
    "UniqueFieldDefinitionNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFieldDefinitionNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueFieldDefinitionNamesRule"]),
    "UniqueFragmentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFragmentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueFragmentNamesRule"]),
    "UniqueInputFieldNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueInputFieldNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueInputFieldNamesRule"]),
    "UniqueOperationNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueOperationNamesRule"]),
    "UniqueOperationTypesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationTypesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueOperationTypesRule"]),
    "UniqueTypeNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueTypeNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueTypeNamesRule"]),
    "UniqueVariableNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueVariableNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UniqueVariableNamesRule"]),
    "ValidationContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$ValidationContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationContext"]),
    "ValuesOfCorrectTypeRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ValuesOfCorrectTypeRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValuesOfCorrectTypeRule"]),
    "VariablesAreInputTypesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesAreInputTypesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VariablesAreInputTypesRule"]),
    "VariablesInAllowedPositionRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesInAllowedPositionRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VariablesInAllowedPositionRule"]),
    "__Directive": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__Directive"]),
    "__DirectiveLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__DirectiveLocation"]),
    "__EnumValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__EnumValue"]),
    "__Field": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__Field"]),
    "__InputValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__InputValue"]),
    "__Schema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__Schema"]),
    "__Type": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__Type"]),
    "__TypeKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__TypeKind"]),
    "assertAbstractType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertAbstractType"]),
    "assertCompositeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertCompositeType"]),
    "assertDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertDirective"]),
    "assertEnumType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertEnumType"]),
    "assertEnumValueName": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertEnumValueName"]),
    "assertInputObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertInputObjectType"]),
    "assertInputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertInputType"]),
    "assertInterfaceType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertInterfaceType"]),
    "assertLeafType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertLeafType"]),
    "assertListType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertListType"]),
    "assertName": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"]),
    "assertNamedType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertNamedType"]),
    "assertNonNullType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertNonNullType"]),
    "assertNullableType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertNullableType"]),
    "assertObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertObjectType"]),
    "assertOutputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertOutputType"]),
    "assertScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertScalarType"]),
    "assertSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertSchema"]),
    "assertType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertType"]),
    "assertUnionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertUnionType"]),
    "assertValidName": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$assertValidName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidName"]),
    "assertValidSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidSchema"]),
    "assertWrappingType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertWrappingType"]),
    "astFromValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["astFromValue"]),
    "buildASTSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$buildASTSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildASTSchema"]),
    "buildClientSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$buildClientSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildClientSchema"]),
    "buildSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$buildASTSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSchema"]),
    "coerceInputValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$coerceInputValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["coerceInputValue"]),
    "concatAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$concatAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatAST"]),
    "createSourceEventStream": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$subscribe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceEventStream"]),
    "defaultFieldResolver": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultFieldResolver"]),
    "defaultTypeResolver": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultTypeResolver"]),
    "doTypesOverlap": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doTypesOverlap"]),
    "execute": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["execute"]),
    "executeSync": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeSync"]),
    "extendSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$extendSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendSchema"]),
    "findBreakingChanges": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$findBreakingChanges$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findBreakingChanges"]),
    "findDangerousChanges": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$findBreakingChanges$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findDangerousChanges"]),
    "formatError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatError"]),
    "getArgumentValues": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getArgumentValues"]),
    "getDirectiveValues": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectiveValues"]),
    "getEnterLeaveForKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnterLeaveForKind"]),
    "getIntrospectionQuery": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getIntrospectionQuery$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntrospectionQuery"]),
    "getLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$location$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocation"]),
    "getNamedType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNamedType"]),
    "getNullableType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNullableType"]),
    "getOperationAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getOperationAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOperationAST"]),
    "getOperationRootType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getOperationRootType$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOperationRootType"]),
    "getVariableValues": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVariableValues"]),
    "getVisitFn": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVisitFn"]),
    "graphql": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["graphql"]),
    "graphqlSync": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["graphqlSync"]),
    "introspectionFromSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$introspectionFromSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["introspectionFromSchema"]),
    "introspectionTypes": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["introspectionTypes"]),
    "isAbstractType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"]),
    "isCompositeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCompositeType"]),
    "isConstValueNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isConstValueNode"]),
    "isDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDefinitionNode"]),
    "isDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDirective"]),
    "isEnumType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"]),
    "isEqualType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEqualType"]),
    "isExecutableDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isExecutableDefinitionNode"]),
    "isInputObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"]),
    "isInputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"]),
    "isInterfaceType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"]),
    "isIntrospectionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIntrospectionType"]),
    "isLeafType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLeafType"]),
    "isListType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"]),
    "isNamedType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNamedType"]),
    "isNonNullType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"]),
    "isNullableType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullableType"]),
    "isObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"]),
    "isOutputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputType"]),
    "isRequiredArgument": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredArgument"]),
    "isRequiredInputField": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredInputField"]),
    "isScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScalarType"]),
    "isSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSchema"]),
    "isSelectionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSelectionNode"]),
    "isSpecifiedDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedDirective"]),
    "isSpecifiedScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedScalarType"]),
    "isType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isType"]),
    "isTypeDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeDefinitionNode"]),
    "isTypeExtensionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeExtensionNode"]),
    "isTypeNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeNode"]),
    "isTypeSubTypeOf": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeSubTypeOf"]),
    "isTypeSystemDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeSystemDefinitionNode"]),
    "isTypeSystemExtensionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeSystemExtensionNode"]),
    "isUnionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"]),
    "isValidNameError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$assertValidName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidNameError"]),
    "isValueNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValueNode"]),
    "isWrappingType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWrappingType"]),
    "lexicographicSortSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$lexicographicSortSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lexicographicSortSchema"]),
    "locatedError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locatedError"]),
    "parse": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"]),
    "parseConstValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseConstValue"]),
    "parseType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseType"]),
    "parseValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseValue"]),
    "print": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"]),
    "printError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printError"]),
    "printIntrospectionSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$printSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printIntrospectionSchema"]),
    "printLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printLocation"]),
    "printSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$printSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printSchema"]),
    "printSourceLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printSourceLocation"]),
    "printType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$printSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printType"]),
    "resolveObjMapThunk": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveObjMapThunk"]),
    "resolveReadonlyArrayThunk": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveReadonlyArrayThunk"]),
    "responsePathAsArray": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__pathToArray__as__responsePathAsArray$3e$__["responsePathAsArray"]),
    "separateOperations": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$separateOperations$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["separateOperations"]),
    "specifiedDirectives": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedDirectives"]),
    "specifiedRules": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$specifiedRules$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedRules"]),
    "specifiedScalarTypes": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedScalarTypes"]),
    "stripIgnoredCharacters": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$stripIgnoredCharacters$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripIgnoredCharacters"]),
    "subscribe": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$subscribe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribe"]),
    "syntaxError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$syntaxError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syntaxError"]),
    "typeFromAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeFromAST"]),
    "validate": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validate"]),
    "validateSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateSchema"]),
    "valueFromAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromAST"]),
    "valueFromASTUntyped": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromASTUntyped$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromASTUntyped"]),
    "version": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$version$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]),
    "versionInfo": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$version$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["versionInfo"]),
    "visit": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visit"]),
    "visitInParallel": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visitInParallel"]),
    "visitWithTypeInfo": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visitWithTypeInfo"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/visitor.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$findBreakingChanges$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/findBreakingChanges.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/directiveLocation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ExecutableDefinitionsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FieldsOnCorrectTypeRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FragmentsOnCompositeTypesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownArgumentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownArgumentNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownDirectivesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownDirectivesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownFragmentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownFragmentNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownTypeNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownTypeNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$lexer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/lexer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneAnonymousOperationRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/LoneAnonymousOperationRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneSchemaDefinitionRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$custom$2f$NoDeprecatedCustomRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/custom/NoDeprecatedCustomRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoFragmentCyclesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoFragmentCyclesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$custom$2f$NoSchemaIntrospectionCustomRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/custom/NoSchemaIntrospectionCustomRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUndefinedVariablesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUndefinedVariablesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedFragmentsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUnusedFragmentsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedVariablesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUnusedVariablesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$OverlappingFieldsCanBeMergedRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleFragmentSpreadsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleTypeExtensionsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ProvidedRequiredArgumentsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ScalarLeafsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ScalarLeafsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$SingleFieldSubscriptionsRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/source.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$tokenKind$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/tokenKind.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/TypeInfo.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentDefinitionNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueArgumentNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectiveNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectivesPerLocationRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueEnumValueNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFieldDefinitionNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFragmentNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueFragmentNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueInputFieldNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueOperationNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationTypesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueOperationTypesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueTypeNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueTypeNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueVariableNamesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueVariableNamesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$ValidationContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/ValidationContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ValuesOfCorrectTypeRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesAreInputTypesRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/VariablesAreInputTypesRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesInAllowedPositionRule$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/assertName.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$assertValidName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/assertValidName.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/astFromValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$buildASTSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/buildASTSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$buildClientSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/buildClientSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$coerceInputValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/coerceInputValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$concatAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/concatAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$subscribe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/subscribe.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/execute.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeComparators.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$extendSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/extendSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/values.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getIntrospectionQuery$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getIntrospectionQuery.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$location$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/location.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getOperationAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getOperationAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getOperationRootType$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getOperationRootType.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/graphql.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$introspectionFromSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/introspectionFromSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/predicates.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$lexicographicSortSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/lexicographicSortSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$locatedError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/locatedError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/parser.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$printSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/printSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printLocation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__pathToArray__as__responsePathAsArray$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript) <export pathToArray as responsePathAsArray>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$separateOperations$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/separateOperations.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$specifiedRules$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/specifiedRules.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$stripIgnoredCharacters$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/stripIgnoredCharacters.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$syntaxError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/syntaxError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromASTUntyped$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromASTUntyped.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$version$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/version.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "BREAK": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BREAK"]),
    "BreakingChangeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BreakingChangeType"]),
    "DEFAULT_DEPRECATION_REASON": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DEFAULT_DEPRECATION_REASON"]),
    "DangerousChangeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DangerousChangeType"]),
    "DirectiveLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DirectiveLocation"]),
    "ExecutableDefinitionsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ExecutableDefinitionsRule"]),
    "FieldsOnCorrectTypeRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FieldsOnCorrectTypeRule"]),
    "FragmentsOnCompositeTypesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FragmentsOnCompositeTypesRule"]),
    "GRAPHQL_MAX_INT": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GRAPHQL_MAX_INT"]),
    "GRAPHQL_MIN_INT": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GRAPHQL_MIN_INT"]),
    "GraphQLBoolean": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLBoolean"]),
    "GraphQLDeprecatedDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLDeprecatedDirective"]),
    "GraphQLDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLDirective"]),
    "GraphQLEnumType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLEnumType"]),
    "GraphQLError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLError"]),
    "GraphQLFloat": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLFloat"]),
    "GraphQLID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLID"]),
    "GraphQLIncludeDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLIncludeDirective"]),
    "GraphQLInputObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLInputObjectType"]),
    "GraphQLInt": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLInt"]),
    "GraphQLInterfaceType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLInterfaceType"]),
    "GraphQLList": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLList"]),
    "GraphQLNonNull": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLNonNull"]),
    "GraphQLObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLObjectType"]),
    "GraphQLScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLScalarType"]),
    "GraphQLSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLSchema"]),
    "GraphQLSkipDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLSkipDirective"]),
    "GraphQLSpecifiedByDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLSpecifiedByDirective"]),
    "GraphQLString": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLString"]),
    "GraphQLUnionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GraphQLUnionType"]),
    "Kind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Kind"]),
    "KnownArgumentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["KnownArgumentNamesRule"]),
    "KnownDirectivesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["KnownDirectivesRule"]),
    "KnownFragmentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["KnownFragmentNamesRule"]),
    "KnownTypeNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["KnownTypeNamesRule"]),
    "Lexer": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Lexer"]),
    "Location": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Location"]),
    "LoneAnonymousOperationRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["LoneAnonymousOperationRule"]),
    "LoneSchemaDefinitionRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["LoneSchemaDefinitionRule"]),
    "NoDeprecatedCustomRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NoDeprecatedCustomRule"]),
    "NoFragmentCyclesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NoFragmentCyclesRule"]),
    "NoSchemaIntrospectionCustomRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NoSchemaIntrospectionCustomRule"]),
    "NoUndefinedVariablesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NoUndefinedVariablesRule"]),
    "NoUnusedFragmentsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NoUnusedFragmentsRule"]),
    "NoUnusedVariablesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NoUnusedVariablesRule"]),
    "OperationTypeNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["OperationTypeNode"]),
    "OverlappingFieldsCanBeMergedRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["OverlappingFieldsCanBeMergedRule"]),
    "PossibleFragmentSpreadsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["PossibleFragmentSpreadsRule"]),
    "PossibleTypeExtensionsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["PossibleTypeExtensionsRule"]),
    "ProvidedRequiredArgumentsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ProvidedRequiredArgumentsRule"]),
    "ScalarLeafsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ScalarLeafsRule"]),
    "SchemaMetaFieldDef": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["SchemaMetaFieldDef"]),
    "SingleFieldSubscriptionsRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["SingleFieldSubscriptionsRule"]),
    "Source": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Source"]),
    "Token": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Token"]),
    "TokenKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TokenKind"]),
    "TypeInfo": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TypeInfo"]),
    "TypeKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TypeKind"]),
    "TypeMetaFieldDef": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TypeMetaFieldDef"]),
    "TypeNameMetaFieldDef": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TypeNameMetaFieldDef"]),
    "UniqueArgumentDefinitionNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueArgumentDefinitionNamesRule"]),
    "UniqueArgumentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueArgumentNamesRule"]),
    "UniqueDirectiveNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueDirectiveNamesRule"]),
    "UniqueDirectivesPerLocationRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueDirectivesPerLocationRule"]),
    "UniqueEnumValueNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueEnumValueNamesRule"]),
    "UniqueFieldDefinitionNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueFieldDefinitionNamesRule"]),
    "UniqueFragmentNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueFragmentNamesRule"]),
    "UniqueInputFieldNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueInputFieldNamesRule"]),
    "UniqueOperationNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueOperationNamesRule"]),
    "UniqueOperationTypesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueOperationTypesRule"]),
    "UniqueTypeNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueTypeNamesRule"]),
    "UniqueVariableNamesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UniqueVariableNamesRule"]),
    "ValidationContext": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ValidationContext"]),
    "ValuesOfCorrectTypeRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ValuesOfCorrectTypeRule"]),
    "VariablesAreInputTypesRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["VariablesAreInputTypesRule"]),
    "VariablesInAllowedPositionRule": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["VariablesInAllowedPositionRule"]),
    "__Directive": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__Directive"]),
    "__DirectiveLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__DirectiveLocation"]),
    "__EnumValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__EnumValue"]),
    "__Field": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__Field"]),
    "__InputValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__InputValue"]),
    "__Schema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__Schema"]),
    "__Type": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__Type"]),
    "__TypeKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["__TypeKind"]),
    "assertAbstractType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertAbstractType"]),
    "assertCompositeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertCompositeType"]),
    "assertDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertDirective"]),
    "assertEnumType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertEnumType"]),
    "assertEnumValueName": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertEnumValueName"]),
    "assertInputObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertInputObjectType"]),
    "assertInputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertInputType"]),
    "assertInterfaceType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertInterfaceType"]),
    "assertLeafType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertLeafType"]),
    "assertListType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertListType"]),
    "assertName": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertName"]),
    "assertNamedType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertNamedType"]),
    "assertNonNullType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertNonNullType"]),
    "assertNullableType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertNullableType"]),
    "assertObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertObjectType"]),
    "assertOutputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertOutputType"]),
    "assertScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertScalarType"]),
    "assertSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertSchema"]),
    "assertType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertType"]),
    "assertUnionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertUnionType"]),
    "assertValidName": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertValidName"]),
    "assertValidSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertValidSchema"]),
    "assertWrappingType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["assertWrappingType"]),
    "astFromValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["astFromValue"]),
    "buildASTSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["buildASTSchema"]),
    "buildClientSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["buildClientSchema"]),
    "buildSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["buildSchema"]),
    "coerceInputValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["coerceInputValue"]),
    "concatAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["concatAST"]),
    "createSourceEventStream": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["createSourceEventStream"]),
    "defaultFieldResolver": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["defaultFieldResolver"]),
    "defaultTypeResolver": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["defaultTypeResolver"]),
    "doTypesOverlap": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["doTypesOverlap"]),
    "execute": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["execute"]),
    "executeSync": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["executeSync"]),
    "extendSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["extendSchema"]),
    "findBreakingChanges": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["findBreakingChanges"]),
    "findDangerousChanges": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["findDangerousChanges"]),
    "formatError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["formatError"]),
    "getArgumentValues": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getArgumentValues"]),
    "getDirectiveValues": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getDirectiveValues"]),
    "getEnterLeaveForKind": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getEnterLeaveForKind"]),
    "getIntrospectionQuery": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getIntrospectionQuery"]),
    "getLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getLocation"]),
    "getNamedType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getNamedType"]),
    "getNullableType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getNullableType"]),
    "getOperationAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getOperationAST"]),
    "getOperationRootType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getOperationRootType"]),
    "getVariableValues": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getVariableValues"]),
    "getVisitFn": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getVisitFn"]),
    "graphql": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["graphql"]),
    "graphqlSync": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["graphqlSync"]),
    "introspectionFromSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["introspectionFromSchema"]),
    "introspectionTypes": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["introspectionTypes"]),
    "isAbstractType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isAbstractType"]),
    "isCompositeType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isCompositeType"]),
    "isConstValueNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isConstValueNode"]),
    "isDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isDefinitionNode"]),
    "isDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isDirective"]),
    "isEnumType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isEnumType"]),
    "isEqualType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isEqualType"]),
    "isExecutableDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isExecutableDefinitionNode"]),
    "isInputObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isInputObjectType"]),
    "isInputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isInputType"]),
    "isInterfaceType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isInterfaceType"]),
    "isIntrospectionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isIntrospectionType"]),
    "isLeafType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isLeafType"]),
    "isListType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isListType"]),
    "isNamedType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isNamedType"]),
    "isNonNullType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isNonNullType"]),
    "isNullableType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isNullableType"]),
    "isObjectType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isObjectType"]),
    "isOutputType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isOutputType"]),
    "isRequiredArgument": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isRequiredArgument"]),
    "isRequiredInputField": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isRequiredInputField"]),
    "isScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isScalarType"]),
    "isSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isSchema"]),
    "isSelectionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isSelectionNode"]),
    "isSpecifiedDirective": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isSpecifiedDirective"]),
    "isSpecifiedScalarType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isSpecifiedScalarType"]),
    "isType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isType"]),
    "isTypeDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isTypeDefinitionNode"]),
    "isTypeExtensionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isTypeExtensionNode"]),
    "isTypeNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isTypeNode"]),
    "isTypeSubTypeOf": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isTypeSubTypeOf"]),
    "isTypeSystemDefinitionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isTypeSystemDefinitionNode"]),
    "isTypeSystemExtensionNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isTypeSystemExtensionNode"]),
    "isUnionType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isUnionType"]),
    "isValidNameError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isValidNameError"]),
    "isValueNode": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isValueNode"]),
    "isWrappingType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isWrappingType"]),
    "lexicographicSortSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["lexicographicSortSchema"]),
    "locatedError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["locatedError"]),
    "parse": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["parse"]),
    "parseConstValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["parseConstValue"]),
    "parseType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["parseType"]),
    "parseValue": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["parseValue"]),
    "print": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["print"]),
    "printError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["printError"]),
    "printIntrospectionSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["printIntrospectionSchema"]),
    "printLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["printLocation"]),
    "printSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["printSchema"]),
    "printSourceLocation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["printSourceLocation"]),
    "printType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["printType"]),
    "resolveObjMapThunk": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["resolveObjMapThunk"]),
    "resolveReadonlyArrayThunk": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["resolveReadonlyArrayThunk"]),
    "responsePathAsArray": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["responsePathAsArray"]),
    "separateOperations": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["separateOperations"]),
    "specifiedDirectives": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["specifiedDirectives"]),
    "specifiedRules": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["specifiedRules"]),
    "specifiedScalarTypes": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["specifiedScalarTypes"]),
    "stripIgnoredCharacters": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["stripIgnoredCharacters"]),
    "subscribe": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["subscribe"]),
    "syntaxError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["syntaxError"]),
    "typeFromAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["typeFromAST"]),
    "validate": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["validate"]),
    "validateSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["validateSchema"]),
    "valueFromAST": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["valueFromAST"]),
    "valueFromASTUntyped": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["valueFromASTUntyped"]),
    "version": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["version"]),
    "versionInfo": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["versionInfo"]),
    "visit": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["visit"]),
    "visitInParallel": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["visitInParallel"]),
    "visitWithTypeInfo": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["visitWithTypeInfo"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/index.mjs [app-client] (ecmascript) <exports>");
}}),
}]);

//# sourceMappingURL=83af6_graphql_633cd1._.js.map