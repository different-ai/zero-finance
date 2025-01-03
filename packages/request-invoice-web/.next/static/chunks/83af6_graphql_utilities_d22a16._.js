(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/83af6_graphql_utilities_d22a16._.js", {

"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromASTUntyped.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "valueFromASTUntyped": (()=>valueFromASTUntyped)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyValMap.mjs [app-client] (ecmascript)");
;
;
function valueFromASTUntyped(valueNode, variables) {
    switch(valueNode.kind){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL:
            return null;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT:
            return parseInt(valueNode.value, 10);
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FLOAT:
            return parseFloat(valueNode.value);
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].BOOLEAN:
            return valueNode.value;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST:
            return valueNode.values.map((node)=>valueFromASTUntyped(node, variables));
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(valueNode.fields, (field)=>field.name.value, (field)=>valueFromASTUntyped(field.value, variables));
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE:
            return variables === null || variables === void 0 ? void 0 : variables[valueNode.name.value];
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/astFromValue.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "astFromValue": (()=>astFromValue)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isIterableObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isIterableObject.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
function astFromValue(value, type) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
        const astValue = astFromValue(value, type.ofType);
        if ((astValue === null || astValue === void 0 ? void 0 : astValue.kind) === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL) {
            return null;
        }
        return astValue;
    } // only explicit null, not undefined, NaN
    if (value === null) {
        return {
            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL
        };
    } // undefined
    if (value === undefined) {
        return null;
    } // Convert JavaScript array to GraphQL list. If the GraphQLType is a list, but
    // the value is not an array, convert the value using the list's item type.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(type)) {
        const itemType = type.ofType;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isIterableObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIterableObject"])(value)) {
            const valuesNodes = [];
            for (const item of value){
                const itemNode = astFromValue(item, itemType);
                if (itemNode != null) {
                    valuesNodes.push(itemNode);
                }
            }
            return {
                kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST,
                values: valuesNodes
            };
        }
        return astFromValue(value, itemType);
    } // Populate the fields of the input object by creating ASTs from each value
    // in the JavaScript object according to the fields in the input type.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(value)) {
            return null;
        }
        const fieldNodes = [];
        for (const field of Object.values(type.getFields())){
            const fieldValue = astFromValue(value[field.name], field.type);
            if (fieldValue) {
                fieldNodes.push({
                    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT_FIELD,
                    name: {
                        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NAME,
                        value: field.name
                    },
                    value: fieldValue
                });
            }
        }
        return {
            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT,
            fields: fieldNodes
        };
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLeafType"])(type)) {
        // Since value is an internally represented value, it must be serialized
        // to an externally represented value before converting into an AST.
        const serialized = type.serialize(value);
        if (serialized == null) {
            return null;
        } // Others serialize based on their corresponding JavaScript scalar types.
        if (typeof serialized === 'boolean') {
            return {
                kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].BOOLEAN,
                value: serialized
            };
        } // JavaScript numbers can be Int or Float values.
        if (typeof serialized === 'number' && Number.isFinite(serialized)) {
            const stringNum = String(serialized);
            return integerStringRegExp.test(stringNum) ? {
                kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT,
                value: stringNum
            } : {
                kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FLOAT,
                value: stringNum
            };
        }
        if (typeof serialized === 'string') {
            // Enum types use Enum literals.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
                return {
                    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM,
                    value: serialized
                };
            } // ID types can use Int literals.
            if (type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLID"] && integerStringRegExp.test(serialized)) {
                return {
                    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT,
                    value: serialized
                };
            }
            return {
                kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING,
                value: serialized
            };
        }
        throw new TypeError(`Cannot convert value to AST: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(serialized)}.`);
    }
    /* c8 ignore next 3 */ // Not reachable, all possible types have been considered.
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected input type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
}
/**
 * IntValue:
 *   - NegativeSign? 0
 *   - NegativeSign? NonZeroDigit ( Digit+ )?
 */ const integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/sortValueNode.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "sortValueNode": (()=>sortValueNode)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/naturalCompare.mjs [app-client] (ecmascript)");
;
;
function sortValueNode(valueNode) {
    switch(valueNode.kind){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT:
            return {
                ...valueNode,
                fields: sortFields(valueNode.fields)
            };
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST:
            return {
                ...valueNode,
                values: valueNode.values.map(sortValueNode)
            };
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FLOAT:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].BOOLEAN:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE:
            return valueNode;
    }
}
function sortFields(fields) {
    return fields.map((fieldNode)=>({
            ...fieldNode,
            value: sortValueNode(fieldNode.value)
        })).sort((fieldA, fieldB)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["naturalCompare"])(fieldA.name.value, fieldB.name.value));
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/findBreakingChanges.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "BreakingChangeType": (()=>BreakingChangeType),
    "DangerousChangeType": (()=>DangerousChangeType),
    "findBreakingChanges": (()=>findBreakingChanges),
    "findDangerousChanges": (()=>findDangerousChanges)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/astFromValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$sortValueNode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/sortValueNode.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
var BreakingChangeType;
(function(BreakingChangeType) {
    BreakingChangeType['TYPE_REMOVED'] = 'TYPE_REMOVED';
    BreakingChangeType['TYPE_CHANGED_KIND'] = 'TYPE_CHANGED_KIND';
    BreakingChangeType['TYPE_REMOVED_FROM_UNION'] = 'TYPE_REMOVED_FROM_UNION';
    BreakingChangeType['VALUE_REMOVED_FROM_ENUM'] = 'VALUE_REMOVED_FROM_ENUM';
    BreakingChangeType['REQUIRED_INPUT_FIELD_ADDED'] = 'REQUIRED_INPUT_FIELD_ADDED';
    BreakingChangeType['IMPLEMENTED_INTERFACE_REMOVED'] = 'IMPLEMENTED_INTERFACE_REMOVED';
    BreakingChangeType['FIELD_REMOVED'] = 'FIELD_REMOVED';
    BreakingChangeType['FIELD_CHANGED_KIND'] = 'FIELD_CHANGED_KIND';
    BreakingChangeType['REQUIRED_ARG_ADDED'] = 'REQUIRED_ARG_ADDED';
    BreakingChangeType['ARG_REMOVED'] = 'ARG_REMOVED';
    BreakingChangeType['ARG_CHANGED_KIND'] = 'ARG_CHANGED_KIND';
    BreakingChangeType['DIRECTIVE_REMOVED'] = 'DIRECTIVE_REMOVED';
    BreakingChangeType['DIRECTIVE_ARG_REMOVED'] = 'DIRECTIVE_ARG_REMOVED';
    BreakingChangeType['REQUIRED_DIRECTIVE_ARG_ADDED'] = 'REQUIRED_DIRECTIVE_ARG_ADDED';
    BreakingChangeType['DIRECTIVE_REPEATABLE_REMOVED'] = 'DIRECTIVE_REPEATABLE_REMOVED';
    BreakingChangeType['DIRECTIVE_LOCATION_REMOVED'] = 'DIRECTIVE_LOCATION_REMOVED';
})(BreakingChangeType || (BreakingChangeType = {}));
;
var DangerousChangeType;
(function(DangerousChangeType) {
    DangerousChangeType['VALUE_ADDED_TO_ENUM'] = 'VALUE_ADDED_TO_ENUM';
    DangerousChangeType['TYPE_ADDED_TO_UNION'] = 'TYPE_ADDED_TO_UNION';
    DangerousChangeType['OPTIONAL_INPUT_FIELD_ADDED'] = 'OPTIONAL_INPUT_FIELD_ADDED';
    DangerousChangeType['OPTIONAL_ARG_ADDED'] = 'OPTIONAL_ARG_ADDED';
    DangerousChangeType['IMPLEMENTED_INTERFACE_ADDED'] = 'IMPLEMENTED_INTERFACE_ADDED';
    DangerousChangeType['ARG_DEFAULT_VALUE_CHANGE'] = 'ARG_DEFAULT_VALUE_CHANGE';
})(DangerousChangeType || (DangerousChangeType = {}));
;
function findBreakingChanges(oldSchema, newSchema) {
    // @ts-expect-error
    return findSchemaChanges(oldSchema, newSchema).filter((change)=>change.type in BreakingChangeType);
}
function findDangerousChanges(oldSchema, newSchema) {
    // @ts-expect-error
    return findSchemaChanges(oldSchema, newSchema).filter((change)=>change.type in DangerousChangeType);
}
function findSchemaChanges(oldSchema, newSchema) {
    return [
        ...findTypeChanges(oldSchema, newSchema),
        ...findDirectiveChanges(oldSchema, newSchema)
    ];
}
function findDirectiveChanges(oldSchema, newSchema) {
    const schemaChanges = [];
    const directivesDiff = diff(oldSchema.getDirectives(), newSchema.getDirectives());
    for (const oldDirective of directivesDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.DIRECTIVE_REMOVED,
            description: `${oldDirective.name} was removed.`
        });
    }
    for (const [oldDirective, newDirective] of directivesDiff.persisted){
        const argsDiff = diff(oldDirective.args, newDirective.args);
        for (const newArg of argsDiff.added){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredArgument"])(newArg)) {
                schemaChanges.push({
                    type: BreakingChangeType.REQUIRED_DIRECTIVE_ARG_ADDED,
                    description: `A required arg ${newArg.name} on directive ${oldDirective.name} was added.`
                });
            }
        }
        for (const oldArg of argsDiff.removed){
            schemaChanges.push({
                type: BreakingChangeType.DIRECTIVE_ARG_REMOVED,
                description: `${oldArg.name} was removed from ${oldDirective.name}.`
            });
        }
        if (oldDirective.isRepeatable && !newDirective.isRepeatable) {
            schemaChanges.push({
                type: BreakingChangeType.DIRECTIVE_REPEATABLE_REMOVED,
                description: `Repeatable flag was removed from ${oldDirective.name}.`
            });
        }
        for (const location of oldDirective.locations){
            if (!newDirective.locations.includes(location)) {
                schemaChanges.push({
                    type: BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
                    description: `${location} was removed from ${oldDirective.name}.`
                });
            }
        }
    }
    return schemaChanges;
}
function findTypeChanges(oldSchema, newSchema) {
    const schemaChanges = [];
    const typesDiff = diff(Object.values(oldSchema.getTypeMap()), Object.values(newSchema.getTypeMap()));
    for (const oldType of typesDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.TYPE_REMOVED,
            description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedScalarType"])(oldType) ? `Standard scalar ${oldType.name} was removed because it is not referenced anymore.` : `${oldType.name} was removed.`
        });
    }
    for (const [oldType, newType] of typesDiff.persisted){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(oldType) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(newType)) {
            schemaChanges.push(...findEnumTypeChanges(oldType, newType));
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(oldType) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(newType)) {
            schemaChanges.push(...findUnionTypeChanges(oldType, newType));
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(oldType) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(newType)) {
            schemaChanges.push(...findInputObjectTypeChanges(oldType, newType));
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(oldType) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(newType)) {
            schemaChanges.push(...findFieldChanges(oldType, newType), ...findImplementedInterfacesChanges(oldType, newType));
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(oldType) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(newType)) {
            schemaChanges.push(...findFieldChanges(oldType, newType), ...findImplementedInterfacesChanges(oldType, newType));
        } else if (oldType.constructor !== newType.constructor) {
            schemaChanges.push({
                type: BreakingChangeType.TYPE_CHANGED_KIND,
                description: `${oldType.name} changed from ` + `${typeKindName(oldType)} to ${typeKindName(newType)}.`
            });
        }
    }
    return schemaChanges;
}
function findInputObjectTypeChanges(oldType, newType) {
    const schemaChanges = [];
    const fieldsDiff = diff(Object.values(oldType.getFields()), Object.values(newType.getFields()));
    for (const newField of fieldsDiff.added){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredInputField"])(newField)) {
            schemaChanges.push({
                type: BreakingChangeType.REQUIRED_INPUT_FIELD_ADDED,
                description: `A required field ${newField.name} on input type ${oldType.name} was added.`
            });
        } else {
            schemaChanges.push({
                type: DangerousChangeType.OPTIONAL_INPUT_FIELD_ADDED,
                description: `An optional field ${newField.name} on input type ${oldType.name} was added.`
            });
        }
    }
    for (const oldField of fieldsDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.FIELD_REMOVED,
            description: `${oldType.name}.${oldField.name} was removed.`
        });
    }
    for (const [oldField, newField] of fieldsDiff.persisted){
        const isSafe = isChangeSafeForInputObjectFieldOrFieldArg(oldField.type, newField.type);
        if (!isSafe) {
            schemaChanges.push({
                type: BreakingChangeType.FIELD_CHANGED_KIND,
                description: `${oldType.name}.${oldField.name} changed type from ` + `${String(oldField.type)} to ${String(newField.type)}.`
            });
        }
    }
    return schemaChanges;
}
function findUnionTypeChanges(oldType, newType) {
    const schemaChanges = [];
    const possibleTypesDiff = diff(oldType.getTypes(), newType.getTypes());
    for (const newPossibleType of possibleTypesDiff.added){
        schemaChanges.push({
            type: DangerousChangeType.TYPE_ADDED_TO_UNION,
            description: `${newPossibleType.name} was added to union type ${oldType.name}.`
        });
    }
    for (const oldPossibleType of possibleTypesDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
            description: `${oldPossibleType.name} was removed from union type ${oldType.name}.`
        });
    }
    return schemaChanges;
}
function findEnumTypeChanges(oldType, newType) {
    const schemaChanges = [];
    const valuesDiff = diff(oldType.getValues(), newType.getValues());
    for (const newValue of valuesDiff.added){
        schemaChanges.push({
            type: DangerousChangeType.VALUE_ADDED_TO_ENUM,
            description: `${newValue.name} was added to enum type ${oldType.name}.`
        });
    }
    for (const oldValue of valuesDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
            description: `${oldValue.name} was removed from enum type ${oldType.name}.`
        });
    }
    return schemaChanges;
}
function findImplementedInterfacesChanges(oldType, newType) {
    const schemaChanges = [];
    const interfacesDiff = diff(oldType.getInterfaces(), newType.getInterfaces());
    for (const newInterface of interfacesDiff.added){
        schemaChanges.push({
            type: DangerousChangeType.IMPLEMENTED_INTERFACE_ADDED,
            description: `${newInterface.name} added to interfaces implemented by ${oldType.name}.`
        });
    }
    for (const oldInterface of interfacesDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.IMPLEMENTED_INTERFACE_REMOVED,
            description: `${oldType.name} no longer implements interface ${oldInterface.name}.`
        });
    }
    return schemaChanges;
}
function findFieldChanges(oldType, newType) {
    const schemaChanges = [];
    const fieldsDiff = diff(Object.values(oldType.getFields()), Object.values(newType.getFields()));
    for (const oldField of fieldsDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.FIELD_REMOVED,
            description: `${oldType.name}.${oldField.name} was removed.`
        });
    }
    for (const [oldField, newField] of fieldsDiff.persisted){
        schemaChanges.push(...findArgChanges(oldType, oldField, newField));
        const isSafe = isChangeSafeForObjectOrInterfaceField(oldField.type, newField.type);
        if (!isSafe) {
            schemaChanges.push({
                type: BreakingChangeType.FIELD_CHANGED_KIND,
                description: `${oldType.name}.${oldField.name} changed type from ` + `${String(oldField.type)} to ${String(newField.type)}.`
            });
        }
    }
    return schemaChanges;
}
function findArgChanges(oldType, oldField, newField) {
    const schemaChanges = [];
    const argsDiff = diff(oldField.args, newField.args);
    for (const oldArg of argsDiff.removed){
        schemaChanges.push({
            type: BreakingChangeType.ARG_REMOVED,
            description: `${oldType.name}.${oldField.name} arg ${oldArg.name} was removed.`
        });
    }
    for (const [oldArg, newArg] of argsDiff.persisted){
        const isSafe = isChangeSafeForInputObjectFieldOrFieldArg(oldArg.type, newArg.type);
        if (!isSafe) {
            schemaChanges.push({
                type: BreakingChangeType.ARG_CHANGED_KIND,
                description: `${oldType.name}.${oldField.name} arg ${oldArg.name} has changed type from ` + `${String(oldArg.type)} to ${String(newArg.type)}.`
            });
        } else if (oldArg.defaultValue !== undefined) {
            if (newArg.defaultValue === undefined) {
                schemaChanges.push({
                    type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
                    description: `${oldType.name}.${oldField.name} arg ${oldArg.name} defaultValue was removed.`
                });
            } else {
                // Since we looking only for client's observable changes we should
                // compare default values in the same representation as they are
                // represented inside introspection.
                const oldValueStr = stringifyValue(oldArg.defaultValue, oldArg.type);
                const newValueStr = stringifyValue(newArg.defaultValue, newArg.type);
                if (oldValueStr !== newValueStr) {
                    schemaChanges.push({
                        type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
                        description: `${oldType.name}.${oldField.name} arg ${oldArg.name} has changed defaultValue from ${oldValueStr} to ${newValueStr}.`
                    });
                }
            }
        }
    }
    for (const newArg of argsDiff.added){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredArgument"])(newArg)) {
            schemaChanges.push({
                type: BreakingChangeType.REQUIRED_ARG_ADDED,
                description: `A required arg ${newArg.name} on ${oldType.name}.${oldField.name} was added.`
            });
        } else {
            schemaChanges.push({
                type: DangerousChangeType.OPTIONAL_ARG_ADDED,
                description: `An optional arg ${newArg.name} on ${oldType.name}.${oldField.name} was added.`
            });
        }
    }
    return schemaChanges;
}
function isChangeSafeForObjectOrInterfaceField(oldType, newType) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(oldType)) {
        return(// if they're both lists, make sure the underlying types are compatible
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(newType) && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(newType) && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType));
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(oldType)) {
        // if they're both non-null, make sure the underlying types are compatible
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(newType) && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType);
    }
    return(// if they're both named types, see if their names are equivalent
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNamedType"])(newType) && oldType.name === newType.name || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(newType) && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType));
}
function isChangeSafeForInputObjectFieldOrFieldArg(oldType, newType) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(oldType)) {
        // if they're both lists, make sure the underlying types are compatible
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(oldType)) {
        return(// if they're both non-null, make sure the underlying types are
        // compatible
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType));
    } // if they're both named types, see if their names are equivalent
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNamedType"])(newType) && oldType.name === newType.name;
}
function typeKindName(type) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScalarType"])(type)) {
        return 'a Scalar type';
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
        return 'an Object type';
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
        return 'an Interface type';
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
        return 'a Union type';
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
        return 'an Enum type';
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        return 'an Input type';
    }
    /* c8 ignore next 3 */ // Not reachable, all possible types have been considered.
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
}
function stringifyValue(value, type) {
    const ast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["astFromValue"])(value, type);
    ast != null || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$sortValueNode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortValueNode"])(ast));
}
function diff(oldArray, newArray) {
    const added = [];
    const removed = [];
    const persisted = [];
    const oldMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyMap"])(oldArray, ({ name })=>name);
    const newMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyMap"])(newArray, ({ name })=>name);
    for (const oldItem of oldArray){
        const newItem = newMap[oldItem.name];
        if (newItem === undefined) {
            removed.push(oldItem);
        } else {
            persisted.push([
                oldItem,
                newItem
            ]);
        }
    }
    for (const newItem of newArray){
        if (oldMap[newItem.name] === undefined) {
            added.push(newItem);
        }
    }
    return {
        added,
        persisted,
        removed
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "typeFromAST": (()=>typeFromAST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
;
;
function typeFromAST(schema, typeNode) {
    switch(typeNode.kind){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST_TYPE:
            {
                const innerType = typeFromAST(schema, typeNode.type);
                return innerType && new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](innerType);
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NON_NULL_TYPE:
            {
                const innerType = typeFromAST(schema, typeNode.type);
                return innerType && new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](innerType);
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NAMED_TYPE:
            return schema.getType(typeNode.name.value);
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeComparators.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "doTypesOverlap": (()=>doTypesOverlap),
    "isEqualType": (()=>isEqualType),
    "isTypeSubTypeOf": (()=>isTypeSubTypeOf)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
;
function isEqualType(typeA, typeB) {
    // Equivalent types are equal.
    if (typeA === typeB) {
        return true;
    } // If either type is non-null, the other must also be non-null.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(typeA) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(typeB)) {
        return isEqualType(typeA.ofType, typeB.ofType);
    } // If either type is a list, the other must also be a list.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(typeA) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(typeB)) {
        return isEqualType(typeA.ofType, typeB.ofType);
    } // Otherwise the types are not equal.
    return false;
}
function isTypeSubTypeOf(schema, maybeSubType, superType) {
    // Equivalent type is a valid subtype
    if (maybeSubType === superType) {
        return true;
    } // If superType is non-null, maybeSubType must also be non-null.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(superType)) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(maybeSubType)) {
            return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
        }
        return false;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(maybeSubType)) {
        // If superType is nullable, maybeSubType may be non-null or nullable.
        return isTypeSubTypeOf(schema, maybeSubType.ofType, superType);
    } // If superType type is a list, maybeSubType type must also be a list.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(superType)) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(maybeSubType)) {
            return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
        }
        return false;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(maybeSubType)) {
        // If superType is not a list, maybeSubType must also be not a list.
        return false;
    } // If superType type is an abstract type, check if it is super type of maybeSubType.
    // Otherwise, the child type is not a valid subtype of the parent type.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(superType) && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(maybeSubType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(maybeSubType)) && schema.isSubType(superType, maybeSubType);
}
function doTypesOverlap(schema, typeA, typeB) {
    // Equivalent types overlap
    if (typeA === typeB) {
        return true;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(typeA)) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(typeB)) {
            // If both types are abstract, then determine if there is any intersection
            // between possible concrete types of each.
            return schema.getPossibleTypes(typeA).some((type)=>schema.isSubType(typeB, type));
        } // Determine if the latter type is a possible concrete type of the former.
        return schema.isSubType(typeA, typeB);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(typeB)) {
        // Determine if the former type is a possible concrete type of the latter.
        return schema.isSubType(typeB, typeA);
    } // Otherwise the types do not overlap.
    return false;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromAST.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "valueFromAST": (()=>valueFromAST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-client] (ecmascript)");
;
;
;
;
;
function valueFromAST(valueNode, type, variables) {
    if (!valueNode) {
        // When there is no node, then there is also no value.
        // Importantly, this is different from returning the value null.
        return;
    }
    if (valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE) {
        const variableName = valueNode.name.value;
        if (variables == null || variables[variableName] === undefined) {
            // No valid return value.
            return;
        }
        const variableValue = variables[variableName];
        if (variableValue === null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
            return; // Invalid: intentionally return no value.
        } // Note: This does no further checking that this variable is correct.
        // This assumes that this query has been validated and the variable
        // usage here is of the correct type.
        return variableValue;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
        if (valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL) {
            return; // Invalid: intentionally return no value.
        }
        return valueFromAST(valueNode, type.ofType, variables);
    }
    if (valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NULL) {
        // This is explicitly returning the value null.
        return null;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(type)) {
        const itemType = type.ofType;
        if (valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST) {
            const coercedValues = [];
            for (const itemNode of valueNode.values){
                if (isMissingVariable(itemNode, variables)) {
                    // If an array contains a missing variable, it is either coerced to
                    // null or if the item type is non-null, it considered invalid.
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(itemType)) {
                        return; // Invalid: intentionally return no value.
                    }
                    coercedValues.push(null);
                } else {
                    const itemValue = valueFromAST(itemNode, itemType, variables);
                    if (itemValue === undefined) {
                        return; // Invalid: intentionally return no value.
                    }
                    coercedValues.push(itemValue);
                }
            }
            return coercedValues;
        }
        const coercedValue = valueFromAST(valueNode, itemType, variables);
        if (coercedValue === undefined) {
            return; // Invalid: intentionally return no value.
        }
        return [
            coercedValue
        ];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT) {
            return; // Invalid: intentionally return no value.
        }
        const coercedObj = Object.create(null);
        const fieldNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyMap"])(valueNode.fields, (field)=>field.name.value);
        for (const field of Object.values(type.getFields())){
            const fieldNode = fieldNodes[field.name];
            if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
                if (field.defaultValue !== undefined) {
                    coercedObj[field.name] = field.defaultValue;
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(field.type)) {
                    return; // Invalid: intentionally return no value.
                }
                continue;
            }
            const fieldValue = valueFromAST(fieldNode.value, field.type, variables);
            if (fieldValue === undefined) {
                return; // Invalid: intentionally return no value.
            }
            coercedObj[field.name] = fieldValue;
        }
        return coercedObj;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLeafType"])(type)) {
        // Scalars and Enums fulfill parsing a literal value via parseLiteral().
        // Invalid values represent a failure to parse correctly, in which case
        // no value is returned.
        let result;
        try {
            result = type.parseLiteral(valueNode, variables);
        } catch (_error) {
            return; // Invalid: intentionally return no value.
        }
        if (result === undefined) {
            return; // Invalid: intentionally return no value.
        }
        return result;
    }
    /* c8 ignore next 3 */ // Not reachable, all possible input types have been considered.
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected input type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
} // Returns true if the provided valueNode is a variable which is not defined
// in the set of variables.
function isMissingVariable(valueNode, variables) {
    return valueNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE && (variables == null || variables[valueNode.name.value] === undefined);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/coerceInputValue.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "coerceInputValue": (()=>coerceInputValue)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$printPathArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/printPathArray.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/Path.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isIterableObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isIterableObject.mjs [app-client] (ecmascript)");
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
function coerceInputValue(inputValue, type, onError = defaultOnError) {
    return coerceInputValueImpl(inputValue, type, onError, undefined);
}
function defaultOnError(path, invalidValue, error) {
    let errorPrefix = 'Invalid value ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(invalidValue);
    if (path.length > 0) {
        errorPrefix += ` at "value${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$printPathArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printPathArray"])(path)}"`;
    }
    error.message = errorPrefix + ': ' + error.message;
    throw error;
}
function coerceInputValueImpl(inputValue, type, onError, path) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
        if (inputValue != null) {
            return coerceInputValueImpl(inputValue, type.ofType, onError, path);
        }
        onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected non-nullable type "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)}" not to be null.`));
        return;
    }
    if (inputValue == null) {
        // Explicitly return the value null.
        return null;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(type)) {
        const itemType = type.ofType;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isIterableObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIterableObject"])(inputValue)) {
            return Array.from(inputValue, (itemValue, index)=>{
                const itemPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPath"])(path, index, undefined);
                return coerceInputValueImpl(itemValue, itemType, onError, itemPath);
            });
        } // Lists accept a non-list value as a list of one.
        return [
            coerceInputValueImpl(inputValue, itemType, onError, path)
        ];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(inputValue)) {
            onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected type "${type.name}" to be an object.`));
            return;
        }
        const coercedValue = {};
        const fieldDefs = type.getFields();
        for (const field of Object.values(fieldDefs)){
            const fieldValue = inputValue[field.name];
            if (fieldValue === undefined) {
                if (field.defaultValue !== undefined) {
                    coercedValue[field.name] = field.defaultValue;
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(field.type)) {
                    const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(field.type);
                    onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${field.name}" of required type "${typeStr}" was not provided.`));
                }
                continue;
            }
            coercedValue[field.name] = coerceInputValueImpl(fieldValue, field.type, onError, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPath"])(path, field.name, type.name));
        } // Ensure every provided field is defined.
        for (const fieldName of Object.keys(inputValue)){
            if (!fieldDefs[fieldName]) {
                const suggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["suggestionList"])(fieldName, Object.keys(type.getFields()));
                onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${fieldName}" is not defined by type "${type.name}".` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["didYouMean"])(suggestions)));
            }
        }
        return coercedValue;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLeafType"])(type)) {
        let parseResult; // Scalars and Enums determine if a input value is valid via parseValue(),
        // which can throw to indicate failure. If it throws, maintain a reference
        // to the original error.
        try {
            parseResult = type.parseValue(inputValue);
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]) {
                onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, error);
            } else {
                onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected type "${type.name}". ` + error.message, {
                    originalError: error
                }));
            }
            return;
        }
        if (parseResult === undefined) {
            onError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$Path$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathToArray"])(path), inputValue, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected type "${type.name}".`));
        }
        return parseResult;
    }
    /* c8 ignore next 3 */ // Not reachable, all possible types have been considered.
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected input type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/TypeInfo.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TypeInfo": (()=>TypeInfo),
    "visitWithTypeInfo": (()=>visitWithTypeInfo)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/visitor.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
class TypeInfo {
    constructor(schema, /**
     * Initial type may be provided in rare cases to facilitate traversals
     *  beginning somewhere other than documents.
     */ initialType, /** @deprecated will be removed in 17.0.0 */ getFieldDefFn){
        this._schema = schema;
        this._typeStack = [];
        this._parentTypeStack = [];
        this._inputTypeStack = [];
        this._fieldDefStack = [];
        this._defaultValueStack = [];
        this._directive = null;
        this._argument = null;
        this._enumValue = null;
        this._getFieldDef = getFieldDefFn !== null && getFieldDefFn !== void 0 ? getFieldDefFn : getFieldDef;
        if (initialType) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(initialType)) {
                this._inputTypeStack.push(initialType);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCompositeType"])(initialType)) {
                this._parentTypeStack.push(initialType);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputType"])(initialType)) {
                this._typeStack.push(initialType);
            }
        }
    }
    get [Symbol.toStringTag]() {
        return 'TypeInfo';
    }
    getType() {
        if (this._typeStack.length > 0) {
            return this._typeStack[this._typeStack.length - 1];
        }
    }
    getParentType() {
        if (this._parentTypeStack.length > 0) {
            return this._parentTypeStack[this._parentTypeStack.length - 1];
        }
    }
    getInputType() {
        if (this._inputTypeStack.length > 0) {
            return this._inputTypeStack[this._inputTypeStack.length - 1];
        }
    }
    getParentInputType() {
        if (this._inputTypeStack.length > 1) {
            return this._inputTypeStack[this._inputTypeStack.length - 2];
        }
    }
    getFieldDef() {
        if (this._fieldDefStack.length > 0) {
            return this._fieldDefStack[this._fieldDefStack.length - 1];
        }
    }
    getDefaultValue() {
        if (this._defaultValueStack.length > 0) {
            return this._defaultValueStack[this._defaultValueStack.length - 1];
        }
    }
    getDirective() {
        return this._directive;
    }
    getArgument() {
        return this._argument;
    }
    getEnumValue() {
        return this._enumValue;
    }
    enter(node) {
        const schema = this._schema; // Note: many of the types below are explicitly typed as "unknown" to drop
        // any assumptions of a valid schema to ensure runtime types are properly
        // checked before continuing since TypeInfo is used as part of validation
        // which occurs before guarantees of schema and document validity.
        switch(node.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].SELECTION_SET:
                {
                    const namedType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNamedType"])(this.getType());
                    this._parentTypeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCompositeType"])(namedType) ? namedType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FIELD:
                {
                    const parentType = this.getParentType();
                    let fieldDef;
                    let fieldType;
                    if (parentType) {
                        fieldDef = this._getFieldDef(schema, parentType, node);
                        if (fieldDef) {
                            fieldType = fieldDef.type;
                        }
                    }
                    this._fieldDefStack.push(fieldDef);
                    this._typeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputType"])(fieldType) ? fieldType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE:
                this._directive = schema.getDirective(node.name.value);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION:
                {
                    const rootType = schema.getRootType(node.operation);
                    this._typeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(rootType) ? rootType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INLINE_FRAGMENT:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION:
                {
                    const typeConditionAST = node.typeCondition;
                    const outputType = typeConditionAST ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeFromAST"])(schema, typeConditionAST) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNamedType"])(this.getType());
                    this._typeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputType"])(outputType) ? outputType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE_DEFINITION:
                {
                    const inputType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeFromAST"])(schema, node.type);
                    this._inputTypeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(inputType) ? inputType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ARGUMENT:
                {
                    var _this$getDirective;
                    let argDef;
                    let argType;
                    const fieldOrDirective = (_this$getDirective = this.getDirective()) !== null && _this$getDirective !== void 0 ? _this$getDirective : this.getFieldDef();
                    if (fieldOrDirective) {
                        argDef = fieldOrDirective.args.find((arg)=>arg.name === node.name.value);
                        if (argDef) {
                            argType = argDef.type;
                        }
                    }
                    this._argument = argDef;
                    this._defaultValueStack.push(argDef ? argDef.defaultValue : undefined);
                    this._inputTypeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(argType) ? argType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST:
                {
                    const listType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNullableType"])(this.getInputType());
                    const itemType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(listType) ? listType.ofType : listType; // List positions never have a default value.
                    this._defaultValueStack.push(undefined);
                    this._inputTypeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(itemType) ? itemType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT_FIELD:
                {
                    const objectType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNamedType"])(this.getInputType());
                    let inputFieldType;
                    let inputField;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(objectType)) {
                        inputField = objectType.getFields()[node.name.value];
                        if (inputField) {
                            inputFieldType = inputField.type;
                        }
                    }
                    this._defaultValueStack.push(inputField ? inputField.defaultValue : undefined);
                    this._inputTypeStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(inputFieldType) ? inputFieldType : undefined);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM:
                {
                    const enumType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNamedType"])(this.getInputType());
                    let enumValue;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(enumType)) {
                        enumValue = enumType.getValue(node.value);
                    }
                    this._enumValue = enumValue;
                    break;
                }
            default:
        }
    }
    leave(node) {
        switch(node.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].SELECTION_SET:
                this._parentTypeStack.pop();
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FIELD:
                this._fieldDefStack.pop();
                this._typeStack.pop();
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE:
                this._directive = null;
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INLINE_FRAGMENT:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION:
                this._typeStack.pop();
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].VARIABLE_DEFINITION:
                this._inputTypeStack.pop();
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ARGUMENT:
                this._argument = null;
                this._defaultValueStack.pop();
                this._inputTypeStack.pop();
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT_FIELD:
                this._defaultValueStack.pop();
                this._inputTypeStack.pop();
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM:
                this._enumValue = null;
                break;
            default:
        }
    }
}
/**
 * Not exactly the same as the executor's definition of getFieldDef, in this
 * statically evaluated environment we do not always have an Object type,
 * and need to handle Interface and Union types.
 */ function getFieldDef(schema, parentType, fieldNode) {
    const name = fieldNode.name.value;
    if (name === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SchemaMetaFieldDef"].name && schema.getQueryType() === parentType) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SchemaMetaFieldDef"];
    }
    if (name === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeMetaFieldDef"].name && schema.getQueryType() === parentType) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeMetaFieldDef"];
    }
    if (name === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeNameMetaFieldDef"].name && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCompositeType"])(parentType)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeNameMetaFieldDef"];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(parentType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(parentType)) {
        return parentType.getFields()[name];
    }
}
function visitWithTypeInfo(typeInfo, visitor) {
    return {
        enter (...args) {
            const node = args[0];
            typeInfo.enter(node);
            const fn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnterLeaveForKind"])(visitor, node.kind).enter;
            if (fn) {
                const result = fn.apply(visitor, args);
                if (result !== undefined) {
                    typeInfo.leave(node);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNode"])(result)) {
                        typeInfo.enter(result);
                    }
                }
                return result;
            }
        },
        leave (...args) {
            const node = args[0];
            const fn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnterLeaveForKind"])(visitor, node.kind).leave;
            let result;
            if (fn) {
                result = fn.apply(visitor, args);
            }
            typeInfo.leave(node);
            return result;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/assertValidName.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "assertValidName": (()=>assertValidName),
    "isValidNameError": (()=>isValidNameError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/assertName.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
;
;
;
function assertValidName(name) {
    const error = isValidNameError(name);
    if (error) {
        throw error;
    }
    return name;
}
function isValidNameError(name) {
    typeof name === 'string' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Expected name to be a string.');
    if (name.startsWith('__')) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Name "${name}" must not begin with "__", which is reserved by GraphQL introspection.`);
    }
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(name);
    } catch (error) {
        return error;
    }
} /* c8 ignore stop */ 
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/extendSchema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "extendSchema": (()=>extendSchema),
    "extendSchemaImpl": (()=>extendSchemaImpl)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/predicates.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/mapValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/values.mjs [app-client] (ecmascript)");
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
function extendSchema(schema, documentAST, options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertSchema"])(schema);
    documentAST != null && documentAST.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DOCUMENT || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Must provide valid Document AST.');
    if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidSDLExtension"])(documentAST, schema);
    }
    const schemaConfig = schema.toConfig();
    const extendedConfig = extendSchemaImpl(schemaConfig, documentAST, options);
    return schemaConfig === extendedConfig ? schema : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSchema"](extendedConfig);
}
function extendSchemaImpl(schemaConfig, documentAST, options) {
    var _schemaDef, _schemaDef$descriptio, _schemaDef2, _options$assumeValid;
    // Collect the type definitions and extensions found in the document.
    const typeDefs = [];
    const typeExtensionsMap = Object.create(null); // New directives and types are separate because a directives and types can
    // have the same name. For example, a type named "skip".
    const directiveDefs = [];
    let schemaDef; // Schema extensions are collected which may add additional operation types.
    const schemaExtensions = [];
    for (const def of documentAST.definitions){
        if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION) {
            schemaDef = def;
        } else if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_EXTENSION) {
            schemaExtensions.push(def);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeDefinitionNode"])(def)) {
            typeDefs.push(def);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeExtensionNode"])(def)) {
            const extendedTypeName = def.name.value;
            const existingTypeExtensions = typeExtensionsMap[extendedTypeName];
            typeExtensionsMap[extendedTypeName] = existingTypeExtensions ? existingTypeExtensions.concat([
                def
            ]) : [
                def
            ];
        } else if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION) {
            directiveDefs.push(def);
        }
    } // If this document contains no new types, extensions, or directives then
    // return the same unmodified GraphQLSchema instance.
    if (Object.keys(typeExtensionsMap).length === 0 && typeDefs.length === 0 && directiveDefs.length === 0 && schemaExtensions.length === 0 && schemaDef == null) {
        return schemaConfig;
    }
    const typeMap = Object.create(null);
    for (const existingType of schemaConfig.types){
        typeMap[existingType.name] = extendNamedType(existingType);
    }
    for (const typeNode of typeDefs){
        var _stdTypeMap$name;
        const name = typeNode.name.value;
        typeMap[name] = (_stdTypeMap$name = stdTypeMap[name]) !== null && _stdTypeMap$name !== void 0 ? _stdTypeMap$name : buildType(typeNode);
    }
    const operationTypes = {
        // Get the extended root operation types.
        query: schemaConfig.query && replaceNamedType(schemaConfig.query),
        mutation: schemaConfig.mutation && replaceNamedType(schemaConfig.mutation),
        subscription: schemaConfig.subscription && replaceNamedType(schemaConfig.subscription),
        // Then, incorporate schema definition and all schema extensions.
        ...schemaDef && getOperationTypes([
            schemaDef
        ]),
        ...getOperationTypes(schemaExtensions)
    }; // Then produce and return a Schema config with these types.
    return {
        description: (_schemaDef = schemaDef) === null || _schemaDef === void 0 ? void 0 : (_schemaDef$descriptio = _schemaDef.description) === null || _schemaDef$descriptio === void 0 ? void 0 : _schemaDef$descriptio.value,
        ...operationTypes,
        types: Object.values(typeMap),
        directives: [
            ...schemaConfig.directives.map(replaceDirective),
            ...directiveDefs.map(buildDirective)
        ],
        extensions: Object.create(null),
        astNode: (_schemaDef2 = schemaDef) !== null && _schemaDef2 !== void 0 ? _schemaDef2 : schemaConfig.astNode,
        extensionASTNodes: schemaConfig.extensionASTNodes.concat(schemaExtensions),
        assumeValid: (_options$assumeValid = options === null || options === void 0 ? void 0 : options.assumeValid) !== null && _options$assumeValid !== void 0 ? _options$assumeValid : false
    }; // Below are functions used for producing this schema that have closed over
    "TURBOPACK unreachable";
    // this scope and have access to the schema, cache, and newly defined types.
    function replaceType(type) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(type)) {
            // @ts-expect-error
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](replaceType(type.ofType));
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
            // @ts-expect-error
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](replaceType(type.ofType));
        } // @ts-expect-error FIXME
        return replaceNamedType(type);
    }
    function replaceNamedType(type) {
        // Note: While this could make early assertions to get the correctly
        // typed values, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        return typeMap[type.name];
    }
    function replaceDirective(directive) {
        const config = directive.toConfig();
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDirective"]({
            ...config,
            args: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(config.args, extendArg)
        });
    }
    function extendNamedType(type) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIntrospectionType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedScalarType"])(type)) {
            // Builtin types are not extended.
            return type;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScalarType"])(type)) {
            return extendScalarType(type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
            return extendObjectType(type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
            return extendInterfaceType(type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
            return extendUnionType(type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
            return extendEnumType(type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
            return extendInputObjectType(type);
        }
        /* c8 ignore next 3 */ // Not reachable, all possible type definition nodes have been considered.
        false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
    }
    function extendInputObjectType(type) {
        var _typeExtensionsMap$co;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co !== void 0 ? _typeExtensionsMap$co : [];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInputObjectType"]({
            ...config,
            fields: ()=>({
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(config.fields, (field)=>({
                            ...field,
                            type: replaceType(field.type)
                        })),
                    ...buildInputFieldMap(extensions)
                }),
            extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
    }
    function extendEnumType(type) {
        var _typeExtensionsMap$ty;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$ty = typeExtensionsMap[type.name]) !== null && _typeExtensionsMap$ty !== void 0 ? _typeExtensionsMap$ty : [];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]({
            ...config,
            values: {
                ...config.values,
                ...buildEnumValueMap(extensions)
            },
            extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
    }
    function extendScalarType(type) {
        var _typeExtensionsMap$co2;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co2 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co2 !== void 0 ? _typeExtensionsMap$co2 : [];
        let specifiedByURL = config.specifiedByURL;
        for (const extensionNode of extensions){
            var _getSpecifiedByURL;
            specifiedByURL = (_getSpecifiedByURL = getSpecifiedByURL(extensionNode)) !== null && _getSpecifiedByURL !== void 0 ? _getSpecifiedByURL : specifiedByURL;
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
            ...config,
            specifiedByURL,
            extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
    }
    function extendObjectType(type) {
        var _typeExtensionsMap$co3;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co3 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co3 !== void 0 ? _typeExtensionsMap$co3 : [];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
            ...config,
            interfaces: ()=>[
                    ...type.getInterfaces().map(replaceNamedType),
                    ...buildInterfaces(extensions)
                ],
            fields: ()=>({
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(config.fields, extendField),
                    ...buildFieldMap(extensions)
                }),
            extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
    }
    function extendInterfaceType(type) {
        var _typeExtensionsMap$co4;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co4 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co4 !== void 0 ? _typeExtensionsMap$co4 : [];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInterfaceType"]({
            ...config,
            interfaces: ()=>[
                    ...type.getInterfaces().map(replaceNamedType),
                    ...buildInterfaces(extensions)
                ],
            fields: ()=>({
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(config.fields, extendField),
                    ...buildFieldMap(extensions)
                }),
            extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
    }
    function extendUnionType(type) {
        var _typeExtensionsMap$co5;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co5 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co5 !== void 0 ? _typeExtensionsMap$co5 : [];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLUnionType"]({
            ...config,
            types: ()=>[
                    ...type.getTypes().map(replaceNamedType),
                    ...buildUnionTypes(extensions)
                ],
            extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
    }
    function extendField(field) {
        return {
            ...field,
            type: replaceType(field.type),
            args: field.args && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(field.args, extendArg)
        };
    }
    function extendArg(arg) {
        return {
            ...arg,
            type: replaceType(arg.type)
        };
    }
    function getOperationTypes(nodes) {
        const opTypes = {};
        for (const node of nodes){
            var _node$operationTypes;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const operationTypesNodes = /* c8 ignore next */ (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
            for (const operationType of operationTypesNodes){
                // Note: While this could make early assertions to get the correctly
                // typed values below, that would throw immediately while type system
                // validation with validateSchema() will produce more actionable results.
                // @ts-expect-error
                opTypes[operationType.operation] = getNamedType(operationType.type);
            }
        }
        return opTypes;
    }
    function getNamedType(node) {
        var _stdTypeMap$name2;
        const name = node.name.value;
        const type = (_stdTypeMap$name2 = stdTypeMap[name]) !== null && _stdTypeMap$name2 !== void 0 ? _stdTypeMap$name2 : typeMap[name];
        if (type === undefined) {
            throw new Error(`Unknown type: "${name}".`);
        }
        return type;
    }
    function getWrappedType(node) {
        if (node.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].LIST_TYPE) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](getWrappedType(node.type));
        }
        if (node.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].NON_NULL_TYPE) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](getWrappedType(node.type));
        }
        return getNamedType(node);
    }
    function buildDirective(node) {
        var _node$description;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDirective"]({
            name: node.name.value,
            description: (_node$description = node.description) === null || _node$description === void 0 ? void 0 : _node$description.value,
            // @ts-expect-error
            locations: node.locations.map(({ value })=>value),
            isRepeatable: node.repeatable,
            args: buildArgumentMap(node.arguments),
            astNode: node
        });
    }
    function buildFieldMap(nodes) {
        const fieldConfigMap = Object.create(null);
        for (const node of nodes){
            var _node$fields;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const nodeFields = /* c8 ignore next */ (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
            for (const field of nodeFields){
                var _field$description;
                fieldConfigMap[field.name.value] = {
                    // Note: While this could make assertions to get the correctly typed
                    // value, that would throw immediately while type system validation
                    // with validateSchema() will produce more actionable results.
                    type: getWrappedType(field.type),
                    description: (_field$description = field.description) === null || _field$description === void 0 ? void 0 : _field$description.value,
                    args: buildArgumentMap(field.arguments),
                    deprecationReason: getDeprecationReason(field),
                    astNode: field
                };
            }
        }
        return fieldConfigMap;
    }
    function buildArgumentMap(args) {
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        const argsNodes = /* c8 ignore next */ args !== null && args !== void 0 ? args : [];
        const argConfigMap = Object.create(null);
        for (const arg of argsNodes){
            var _arg$description;
            // Note: While this could make assertions to get the correctly typed
            // value, that would throw immediately while type system validation
            // with validateSchema() will produce more actionable results.
            const type = getWrappedType(arg.type);
            argConfigMap[arg.name.value] = {
                type,
                description: (_arg$description = arg.description) === null || _arg$description === void 0 ? void 0 : _arg$description.value,
                defaultValue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromAST"])(arg.defaultValue, type),
                deprecationReason: getDeprecationReason(arg),
                astNode: arg
            };
        }
        return argConfigMap;
    }
    function buildInputFieldMap(nodes) {
        const inputFieldMap = Object.create(null);
        for (const node of nodes){
            var _node$fields2;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const fieldsNodes = /* c8 ignore next */ (_node$fields2 = node.fields) !== null && _node$fields2 !== void 0 ? _node$fields2 : [];
            for (const field of fieldsNodes){
                var _field$description2;
                // Note: While this could make assertions to get the correctly typed
                // value, that would throw immediately while type system validation
                // with validateSchema() will produce more actionable results.
                const type = getWrappedType(field.type);
                inputFieldMap[field.name.value] = {
                    type,
                    description: (_field$description2 = field.description) === null || _field$description2 === void 0 ? void 0 : _field$description2.value,
                    defaultValue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromAST"])(field.defaultValue, type),
                    deprecationReason: getDeprecationReason(field),
                    astNode: field
                };
            }
        }
        return inputFieldMap;
    }
    function buildEnumValueMap(nodes) {
        const enumValueMap = Object.create(null);
        for (const node of nodes){
            var _node$values;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const valuesNodes = /* c8 ignore next */ (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
            for (const value of valuesNodes){
                var _value$description;
                enumValueMap[value.name.value] = {
                    description: (_value$description = value.description) === null || _value$description === void 0 ? void 0 : _value$description.value,
                    deprecationReason: getDeprecationReason(value),
                    astNode: value
                };
            }
        }
        return enumValueMap;
    }
    function buildInterfaces(nodes) {
        // Note: While this could make assertions to get the correctly typed
        // values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        // @ts-expect-error
        return nodes.flatMap(// FIXME: https://github.com/graphql/graphql-js/issues/2203
        (node)=>{
            var _node$interfaces$map, _node$interfaces;
            return /* c8 ignore next */ (_node$interfaces$map = (_node$interfaces = node.interfaces) === null || _node$interfaces === void 0 ? void 0 : _node$interfaces.map(getNamedType)) !== null && _node$interfaces$map !== void 0 ? _node$interfaces$map : [];
        });
    }
    function buildUnionTypes(nodes) {
        // Note: While this could make assertions to get the correctly typed
        // values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        // @ts-expect-error
        return nodes.flatMap(// FIXME: https://github.com/graphql/graphql-js/issues/2203
        (node)=>{
            var _node$types$map, _node$types;
            return /* c8 ignore next */ (_node$types$map = (_node$types = node.types) === null || _node$types === void 0 ? void 0 : _node$types.map(getNamedType)) !== null && _node$types$map !== void 0 ? _node$types$map : [];
        });
    }
    function buildType(astNode) {
        var _typeExtensionsMap$na;
        const name = astNode.name.value;
        const extensionASTNodes = (_typeExtensionsMap$na = typeExtensionsMap[name]) !== null && _typeExtensionsMap$na !== void 0 ? _typeExtensionsMap$na : [];
        switch(astNode.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_DEFINITION:
                {
                    var _astNode$description;
                    const allNodes = [
                        astNode,
                        ...extensionASTNodes
                    ];
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
                        name,
                        description: (_astNode$description = astNode.description) === null || _astNode$description === void 0 ? void 0 : _astNode$description.value,
                        interfaces: ()=>buildInterfaces(allNodes),
                        fields: ()=>buildFieldMap(allNodes),
                        astNode,
                        extensionASTNodes
                    });
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_DEFINITION:
                {
                    var _astNode$description2;
                    const allNodes = [
                        astNode,
                        ...extensionASTNodes
                    ];
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInterfaceType"]({
                        name,
                        description: (_astNode$description2 = astNode.description) === null || _astNode$description2 === void 0 ? void 0 : _astNode$description2.value,
                        interfaces: ()=>buildInterfaces(allNodes),
                        fields: ()=>buildFieldMap(allNodes),
                        astNode,
                        extensionASTNodes
                    });
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_DEFINITION:
                {
                    var _astNode$description3;
                    const allNodes = [
                        astNode,
                        ...extensionASTNodes
                    ];
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]({
                        name,
                        description: (_astNode$description3 = astNode.description) === null || _astNode$description3 === void 0 ? void 0 : _astNode$description3.value,
                        values: buildEnumValueMap(allNodes),
                        astNode,
                        extensionASTNodes
                    });
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_DEFINITION:
                {
                    var _astNode$description4;
                    const allNodes = [
                        astNode,
                        ...extensionASTNodes
                    ];
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLUnionType"]({
                        name,
                        description: (_astNode$description4 = astNode.description) === null || _astNode$description4 === void 0 ? void 0 : _astNode$description4.value,
                        types: ()=>buildUnionTypes(allNodes),
                        astNode,
                        extensionASTNodes
                    });
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_DEFINITION:
                {
                    var _astNode$description5;
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
                        name,
                        description: (_astNode$description5 = astNode.description) === null || _astNode$description5 === void 0 ? void 0 : _astNode$description5.value,
                        specifiedByURL: getSpecifiedByURL(astNode),
                        astNode,
                        extensionASTNodes
                    });
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_DEFINITION:
                {
                    var _astNode$description6;
                    const allNodes = [
                        astNode,
                        ...extensionASTNodes
                    ];
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInputObjectType"]({
                        name,
                        description: (_astNode$description6 = astNode.description) === null || _astNode$description6 === void 0 ? void 0 : _astNode$description6.value,
                        fields: ()=>buildInputFieldMap(allNodes),
                        astNode,
                        extensionASTNodes
                    });
                }
        }
    }
}
const stdTypeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyMap"])([
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedScalarTypes"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["introspectionTypes"]
], (type)=>type.name);
/**
 * Given a field or enum value node, returns the string value for the
 * deprecation reason.
 */ function getDeprecationReason(node) {
    const deprecated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectiveValues"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDeprecatedDirective"], node); // @ts-expect-error validated by `getDirectiveValues`
    return deprecated === null || deprecated === void 0 ? void 0 : deprecated.reason;
}
/**
 * Given a scalar node, returns the string value for the specifiedByURL.
 */ function getSpecifiedByURL(node) {
    const specifiedBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$values$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectiveValues"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSpecifiedByDirective"], node); // @ts-expect-error validated by `getDirectiveValues`
    return specifiedBy === null || specifiedBy === void 0 ? void 0 : specifiedBy.url;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/buildASTSchema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "buildASTSchema": (()=>buildASTSchema),
    "buildSchema": (()=>buildSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/validate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$extendSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/extendSchema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/parser.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
function buildASTSchema(documentAST, options) {
    documentAST != null && documentAST.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DOCUMENT || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Must provide valid Document AST.');
    if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$validate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidSDL"])(documentAST);
    }
    const emptySchemaConfig = {
        description: undefined,
        types: [],
        directives: [],
        extensions: Object.create(null),
        extensionASTNodes: [],
        assumeValid: false
    };
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$extendSchema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendSchemaImpl"])(emptySchemaConfig, documentAST, options);
    if (config.astNode == null) {
        for (const type of config.types){
            switch(type.name){
                // Note: While this could make early assertions to get the correctly
                // typed values below, that would throw immediately while type system
                // validation with validateSchema() will produce more actionable results.
                case 'Query':
                    // @ts-expect-error validated in `validateSchema`
                    config.query = type;
                    break;
                case 'Mutation':
                    // @ts-expect-error validated in `validateSchema`
                    config.mutation = type;
                    break;
                case 'Subscription':
                    // @ts-expect-error validated in `validateSchema`
                    config.subscription = type;
                    break;
            }
        }
    }
    const directives = [
        ...config.directives,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedDirectives"].filter((stdDirective)=>config.directives.every((directive)=>directive.name !== stdDirective.name))
    ];
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSchema"]({
        ...config,
        directives
    });
}
function buildSchema(source, options) {
    const document = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"])(source, {
        noLocation: options === null || options === void 0 ? void 0 : options.noLocation,
        allowLegacyFragmentVariables: options === null || options === void 0 ? void 0 : options.allowLegacyFragmentVariables
    });
    return buildASTSchema(document, {
        assumeValidSDL: options === null || options === void 0 ? void 0 : options.assumeValidSDL,
        assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/buildClientSchema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "buildClientSchema": (()=>buildClientSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyValMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromAST.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/parser.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
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
function buildClientSchema(introspection, options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(introspection) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(introspection.__schema) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(introspection)}.`); // Get the schema from the introspection result.
    const schemaIntrospection = introspection.__schema; // Iterate through all types, getting the type definition for each.
    const typeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(schemaIntrospection.types, (typeIntrospection)=>typeIntrospection.name, (typeIntrospection)=>buildType(typeIntrospection)); // Include standard types only if they are used.
    for (const stdType of [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedScalarTypes"],
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["introspectionTypes"]
    ]){
        if (typeMap[stdType.name]) {
            typeMap[stdType.name] = stdType;
        }
    } // Get the root Query, Mutation, and Subscription types.
    const queryType = schemaIntrospection.queryType ? getObjectType(schemaIntrospection.queryType) : null;
    const mutationType = schemaIntrospection.mutationType ? getObjectType(schemaIntrospection.mutationType) : null;
    const subscriptionType = schemaIntrospection.subscriptionType ? getObjectType(schemaIntrospection.subscriptionType) : null; // Get the directives supported by Introspection, assuming empty-set if
    // directives were not queried for.
    const directives = schemaIntrospection.directives ? schemaIntrospection.directives.map(buildDirective) : []; // Then produce and return a Schema with these types.
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSchema"]({
        description: schemaIntrospection.description,
        query: queryType,
        mutation: mutationType,
        subscription: subscriptionType,
        types: Object.values(typeMap),
        directives,
        assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
    }); // Given a type reference in introspection, return the GraphQLType instance.
    "TURBOPACK unreachable";
    // preferring cached instances before building new instances.
    function getType(typeRef) {
        if (typeRef.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].LIST) {
            const itemRef = typeRef.ofType;
            if (!itemRef) {
                throw new Error('Decorated type deeper than introspection query.');
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](getType(itemRef));
        }
        if (typeRef.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].NON_NULL) {
            const nullableRef = typeRef.ofType;
            if (!nullableRef) {
                throw new Error('Decorated type deeper than introspection query.');
            }
            const nullableType = getType(nullableRef);
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertNullableType"])(nullableType));
        }
        return getNamedType(typeRef);
    }
    function getNamedType(typeRef) {
        const typeName = typeRef.name;
        if (!typeName) {
            throw new Error(`Unknown type reference: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(typeRef)}.`);
        }
        const type = typeMap[typeName];
        if (!type) {
            throw new Error(`Invalid or incomplete schema, unknown type: ${typeName}. Ensure that a full introspection query is used in order to build a client schema.`);
        }
        return type;
    }
    function getObjectType(typeRef) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertObjectType"])(getNamedType(typeRef));
    }
    function getInterfaceType(typeRef) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertInterfaceType"])(getNamedType(typeRef));
    } // Given a type's introspection result, construct the correct
    // GraphQLType instance.
    function buildType(type) {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (type != null && type.name != null && type.kind != null) {
            // FIXME: Properly type IntrospectionType, it's a breaking change so fix in v17
            // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
            switch(type.kind){
                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].SCALAR:
                    return buildScalarDef(type);
                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].OBJECT:
                    return buildObjectDef(type);
                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].INTERFACE:
                    return buildInterfaceDef(type);
                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].UNION:
                    return buildUnionDef(type);
                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].ENUM:
                    return buildEnumDef(type);
                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].INPUT_OBJECT:
                    return buildInputObjectDef(type);
            }
        }
        const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type);
        throw new Error(`Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ${typeStr}.`);
    }
    function buildScalarDef(scalarIntrospection) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
            name: scalarIntrospection.name,
            description: scalarIntrospection.description,
            specifiedByURL: scalarIntrospection.specifiedByURL
        });
    }
    function buildImplementationsList(implementingIntrospection) {
        // TODO: Temporary workaround until GraphQL ecosystem will fully support
        // 'interfaces' on interface types.
        if (implementingIntrospection.interfaces === null && implementingIntrospection.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypeKind"].INTERFACE) {
            return [];
        }
        if (!implementingIntrospection.interfaces) {
            const implementingIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(implementingIntrospection);
            throw new Error(`Introspection result missing interfaces: ${implementingIntrospectionStr}.`);
        }
        return implementingIntrospection.interfaces.map(getInterfaceType);
    }
    function buildObjectDef(objectIntrospection) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
            name: objectIntrospection.name,
            description: objectIntrospection.description,
            interfaces: ()=>buildImplementationsList(objectIntrospection),
            fields: ()=>buildFieldDefMap(objectIntrospection)
        });
    }
    function buildInterfaceDef(interfaceIntrospection) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInterfaceType"]({
            name: interfaceIntrospection.name,
            description: interfaceIntrospection.description,
            interfaces: ()=>buildImplementationsList(interfaceIntrospection),
            fields: ()=>buildFieldDefMap(interfaceIntrospection)
        });
    }
    function buildUnionDef(unionIntrospection) {
        if (!unionIntrospection.possibleTypes) {
            const unionIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(unionIntrospection);
            throw new Error(`Introspection result missing possibleTypes: ${unionIntrospectionStr}.`);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLUnionType"]({
            name: unionIntrospection.name,
            description: unionIntrospection.description,
            types: ()=>unionIntrospection.possibleTypes.map(getObjectType)
        });
    }
    function buildEnumDef(enumIntrospection) {
        if (!enumIntrospection.enumValues) {
            const enumIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(enumIntrospection);
            throw new Error(`Introspection result missing enumValues: ${enumIntrospectionStr}.`);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]({
            name: enumIntrospection.name,
            description: enumIntrospection.description,
            values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(enumIntrospection.enumValues, (valueIntrospection)=>valueIntrospection.name, (valueIntrospection)=>({
                    description: valueIntrospection.description,
                    deprecationReason: valueIntrospection.deprecationReason
                }))
        });
    }
    function buildInputObjectDef(inputObjectIntrospection) {
        if (!inputObjectIntrospection.inputFields) {
            const inputObjectIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputObjectIntrospection);
            throw new Error(`Introspection result missing inputFields: ${inputObjectIntrospectionStr}.`);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInputObjectType"]({
            name: inputObjectIntrospection.name,
            description: inputObjectIntrospection.description,
            fields: ()=>buildInputValueDefMap(inputObjectIntrospection.inputFields)
        });
    }
    function buildFieldDefMap(typeIntrospection) {
        if (!typeIntrospection.fields) {
            throw new Error(`Introspection result missing fields: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(typeIntrospection)}.`);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(typeIntrospection.fields, (fieldIntrospection)=>fieldIntrospection.name, buildField);
    }
    function buildField(fieldIntrospection) {
        const type = getType(fieldIntrospection.type);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputType"])(type)) {
            const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type);
            throw new Error(`Introspection must provide output type for fields, but received: ${typeStr}.`);
        }
        if (!fieldIntrospection.args) {
            const fieldIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(fieldIntrospection);
            throw new Error(`Introspection result missing field args: ${fieldIntrospectionStr}.`);
        }
        return {
            description: fieldIntrospection.description,
            deprecationReason: fieldIntrospection.deprecationReason,
            type,
            args: buildInputValueDefMap(fieldIntrospection.args)
        };
    }
    function buildInputValueDefMap(inputValueIntrospections) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(inputValueIntrospections, (inputValue)=>inputValue.name, buildInputValue);
    }
    function buildInputValue(inputValueIntrospection) {
        const type = getType(inputValueIntrospection.type);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(type)) {
            const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type);
            throw new Error(`Introspection must provide input type for arguments, but received: ${typeStr}.`);
        }
        const defaultValue = inputValueIntrospection.defaultValue != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromAST$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromAST"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseValue"])(inputValueIntrospection.defaultValue), type) : undefined;
        return {
            description: inputValueIntrospection.description,
            type,
            defaultValue,
            deprecationReason: inputValueIntrospection.deprecationReason
        };
    }
    function buildDirective(directiveIntrospection) {
        if (!directiveIntrospection.args) {
            const directiveIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(directiveIntrospection);
            throw new Error(`Introspection result missing directive args: ${directiveIntrospectionStr}.`);
        }
        if (!directiveIntrospection.locations) {
            const directiveIntrospectionStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(directiveIntrospection);
            throw new Error(`Introspection result missing directive locations: ${directiveIntrospectionStr}.`);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDirective"]({
            name: directiveIntrospection.name,
            description: directiveIntrospection.description,
            isRepeatable: directiveIntrospection.isRepeatable,
            locations: directiveIntrospection.locations.slice(),
            args: buildInputValueDefMap(directiveIntrospection.args)
        });
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/concatAST.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "concatAST": (()=>concatAST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
;
function concatAST(documents) {
    const definitions = [];
    for (const doc of documents){
        definitions.push(...doc.definitions);
    }
    return {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DOCUMENT,
        definitions
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getIntrospectionQuery.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Produce the GraphQL query recommended for a full schema introspection.
 * Accepts optional IntrospectionOptions.
 */ __turbopack_esm__({
    "getIntrospectionQuery": (()=>getIntrospectionQuery)
});
function getIntrospectionQuery(options) {
    const optionsWithDefault = {
        descriptions: true,
        specifiedByUrl: false,
        directiveIsRepeatable: false,
        schemaDescription: false,
        inputValueDeprecation: false,
        ...options
    };
    const descriptions = optionsWithDefault.descriptions ? 'description' : '';
    const specifiedByUrl = optionsWithDefault.specifiedByUrl ? 'specifiedByURL' : '';
    const directiveIsRepeatable = optionsWithDefault.directiveIsRepeatable ? 'isRepeatable' : '';
    const schemaDescription = optionsWithDefault.schemaDescription ? descriptions : '';
    function inputDeprecation(str) {
        return optionsWithDefault.inputValueDeprecation ? str : '';
    }
    return `
    query IntrospectionQuery {
      __schema {
        ${schemaDescription}
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          ${descriptions}
          ${directiveIsRepeatable}
          locations
          args${inputDeprecation('(includeDeprecated: true)')} {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      ${descriptions}
      ${specifiedByUrl}
      fields(includeDeprecated: true) {
        name
        ${descriptions}
        args${inputDeprecation('(includeDeprecated: true)')} {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields${inputDeprecation('(includeDeprecated: true)')} {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${descriptions}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      ${descriptions}
      type { ...TypeRef }
      defaultValue
      ${inputDeprecation('isDeprecated')}
      ${inputDeprecation('deprecationReason')}
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getOperationAST.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getOperationAST": (()=>getOperationAST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
;
function getOperationAST(documentAST, operationName) {
    let operation = null;
    for (const definition of documentAST.definitions){
        if (definition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION) {
            var _definition$name;
            if (operationName == null) {
                // If no operation name was provided, only return an Operation if there
                // is one defined in the document. Upon encountering the second, return
                // null.
                if (operation) {
                    return null;
                }
                operation = definition;
            } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
                return definition;
            }
        }
    }
    return operation;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getOperationRootType.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getOperationRootType": (()=>getOperationRootType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
;
function getOperationRootType(schema, operation) {
    if (operation.operation === 'query') {
        const queryType = schema.getQueryType();
        if (!queryType) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Schema does not define the required query root type.', {
                nodes: operation
            });
        }
        return queryType;
    }
    if (operation.operation === 'mutation') {
        const mutationType = schema.getMutationType();
        if (!mutationType) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Schema is not configured for mutations.', {
                nodes: operation
            });
        }
        return mutationType;
    }
    if (operation.operation === 'subscription') {
        const subscriptionType = schema.getSubscriptionType();
        if (!subscriptionType) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Schema is not configured for subscriptions.', {
                nodes: operation
            });
        }
        return subscriptionType;
    }
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Can only have query, mutation and subscription operations.', {
        nodes: operation
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/introspectionFromSchema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "introspectionFromSchema": (()=>introspectionFromSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/parser.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getIntrospectionQuery$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/getIntrospectionQuery.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/execute.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
;
;
;
;
function introspectionFromSchema(schema, options) {
    const optionsWithDefaults = {
        specifiedByUrl: true,
        directiveIsRepeatable: true,
        schemaDescription: true,
        inputValueDeprecation: true,
        ...options
    };
    const document = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$getIntrospectionQuery$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntrospectionQuery"])(optionsWithDefaults));
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$execute$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeSync"])({
        schema,
        document
    });
    !result.errors && result.data || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false);
    return result.data;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/lexicographicSortSchema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "lexicographicSortSchema": (()=>lexicographicSortSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyValMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/naturalCompare.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
function lexicographicSortSchema(schema) {
    const schemaConfig = schema.toConfig();
    const typeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(sortByName(schemaConfig.types), (type)=>type.name, sortNamedType);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLSchema"]({
        ...schemaConfig,
        types: Object.values(typeMap),
        directives: sortByName(schemaConfig.directives).map(sortDirective),
        query: replaceMaybeType(schemaConfig.query),
        mutation: replaceMaybeType(schemaConfig.mutation),
        subscription: replaceMaybeType(schemaConfig.subscription)
    });
    "TURBOPACK unreachable";
    function replaceType(type) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(type)) {
            // @ts-expect-error
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](replaceType(type.ofType));
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
            // @ts-expect-error
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](replaceType(type.ofType));
        } // @ts-expect-error FIXME: TS Conversion
        return replaceNamedType(type);
    }
    function replaceNamedType(type) {
        return typeMap[type.name];
    }
    function replaceMaybeType(maybeType) {
        return maybeType && replaceNamedType(maybeType);
    }
    function sortDirective(directive) {
        const config = directive.toConfig();
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDirective"]({
            ...config,
            locations: sortBy(config.locations, (x)=>x),
            args: sortArgs(config.args)
        });
    }
    function sortArgs(args) {
        return sortObjMap(args, (arg)=>({
                ...arg,
                type: replaceType(arg.type)
            }));
    }
    function sortFields(fieldsMap) {
        return sortObjMap(fieldsMap, (field)=>({
                ...field,
                type: replaceType(field.type),
                args: field.args && sortArgs(field.args)
            }));
    }
    function sortInputFields(fieldsMap) {
        return sortObjMap(fieldsMap, (field)=>({
                ...field,
                type: replaceType(field.type)
            }));
    }
    function sortTypes(array) {
        return sortByName(array).map(replaceNamedType);
    }
    function sortNamedType(type) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScalarType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIntrospectionType"])(type)) {
            return type;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
            const config = type.toConfig();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
                ...config,
                interfaces: ()=>sortTypes(config.interfaces),
                fields: ()=>sortFields(config.fields)
            });
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
            const config = type.toConfig();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInterfaceType"]({
                ...config,
                interfaces: ()=>sortTypes(config.interfaces),
                fields: ()=>sortFields(config.fields)
            });
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
            const config = type.toConfig();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLUnionType"]({
                ...config,
                types: ()=>sortTypes(config.types)
            });
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
            const config = type.toConfig();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]({
                ...config,
                values: sortObjMap(config.values, (value)=>value)
            });
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
            const config = type.toConfig();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLInputObjectType"]({
                ...config,
                fields: ()=>sortInputFields(config.fields)
            });
        }
        /* c8 ignore next 3 */ // Not reachable, all possible types have been considered.
        false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
    }
}
function sortObjMap(map, sortValueFn) {
    const sortedMap = Object.create(null);
    for (const key of Object.keys(map).sort(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["naturalCompare"])){
        sortedMap[key] = sortValueFn(map[key]);
    }
    return sortedMap;
}
function sortByName(array) {
    return sortBy(array, (obj)=>obj.name);
}
function sortBy(array, mapToKey) {
    return array.slice().sort((obj1, obj2)=>{
        const key1 = mapToKey(obj1);
        const key2 = mapToKey(obj2);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["naturalCompare"])(key1, key2);
    });
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/printSchema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "printIntrospectionSchema": (()=>printIntrospectionSchema),
    "printSchema": (()=>printSchema),
    "printType": (()=>printType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/astFromValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$blockString$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/blockString.mjs [app-client] (ecmascript)");
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
function printSchema(schema) {
    return printFilteredSchema(schema, (n)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedDirective"])(n), isDefinedType);
}
function printIntrospectionSchema(schema) {
    return printFilteredSchema(schema, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedDirective"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIntrospectionType"]);
}
function isDefinedType(type) {
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpecifiedScalarType"])(type) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIntrospectionType"])(type);
}
function printFilteredSchema(schema, directiveFilter, typeFilter) {
    const directives = schema.getDirectives().filter(directiveFilter);
    const types = Object.values(schema.getTypeMap()).filter(typeFilter);
    return [
        printSchemaDefinition(schema),
        ...directives.map((directive)=>printDirective(directive)),
        ...types.map((type)=>printType(type))
    ].filter(Boolean).join('\n\n');
}
function printSchemaDefinition(schema) {
    if (schema.description == null && isSchemaOfCommonNames(schema)) {
        return;
    }
    const operationTypes = [];
    const queryType = schema.getQueryType();
    if (queryType) {
        operationTypes.push(`  query: ${queryType.name}`);
    }
    const mutationType = schema.getMutationType();
    if (mutationType) {
        operationTypes.push(`  mutation: ${mutationType.name}`);
    }
    const subscriptionType = schema.getSubscriptionType();
    if (subscriptionType) {
        operationTypes.push(`  subscription: ${subscriptionType.name}`);
    }
    return printDescription(schema) + `schema {\n${operationTypes.join('\n')}\n}`;
}
/**
 * GraphQL schema define root types for each type of operation. These types are
 * the same as any other type and can be named in any manner, however there is
 * a common naming convention:
 *
 * ```graphql
 *   schema {
 *     query: Query
 *     mutation: Mutation
 *     subscription: Subscription
 *   }
 * ```
 *
 * When using this naming convention, the schema description can be omitted.
 */ function isSchemaOfCommonNames(schema) {
    const queryType = schema.getQueryType();
    if (queryType && queryType.name !== 'Query') {
        return false;
    }
    const mutationType = schema.getMutationType();
    if (mutationType && mutationType.name !== 'Mutation') {
        return false;
    }
    const subscriptionType = schema.getSubscriptionType();
    if (subscriptionType && subscriptionType.name !== 'Subscription') {
        return false;
    }
    return true;
}
function printType(type) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScalarType"])(type)) {
        return printScalar(type);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
        return printObject(type);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
        return printInterface(type);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
        return printUnion(type);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
        return printEnum(type);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        return printInputObject(type);
    }
    /* c8 ignore next 3 */ // Not reachable, all possible types have been considered.
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type));
}
function printScalar(type) {
    return printDescription(type) + `scalar ${type.name}` + printSpecifiedByURL(type);
}
function printImplementedInterfaces(type) {
    const interfaces = type.getInterfaces();
    return interfaces.length ? ' implements ' + interfaces.map((i)=>i.name).join(' & ') : '';
}
function printObject(type) {
    return printDescription(type) + `type ${type.name}` + printImplementedInterfaces(type) + printFields(type);
}
function printInterface(type) {
    return printDescription(type) + `interface ${type.name}` + printImplementedInterfaces(type) + printFields(type);
}
function printUnion(type) {
    const types = type.getTypes();
    const possibleTypes = types.length ? ' = ' + types.join(' | ') : '';
    return printDescription(type) + 'union ' + type.name + possibleTypes;
}
function printEnum(type) {
    const values = type.getValues().map((value, i)=>printDescription(value, '  ', !i) + '  ' + value.name + printDeprecated(value.deprecationReason));
    return printDescription(type) + `enum ${type.name}` + printBlock(values);
}
function printInputObject(type) {
    const fields = Object.values(type.getFields()).map((f, i)=>printDescription(f, '  ', !i) + '  ' + printInputValue(f));
    return printDescription(type) + `input ${type.name}` + printBlock(fields);
}
function printFields(type) {
    const fields = Object.values(type.getFields()).map((f, i)=>printDescription(f, '  ', !i) + '  ' + f.name + printArgs(f.args, '  ') + ': ' + String(f.type) + printDeprecated(f.deprecationReason));
    return printBlock(fields);
}
function printBlock(items) {
    return items.length !== 0 ? ' {\n' + items.join('\n') + '\n}' : '';
}
function printArgs(args, indentation = '') {
    if (args.length === 0) {
        return '';
    } // If every arg does not have a description, print them on one line.
    if (args.every((arg)=>!arg.description)) {
        return '(' + args.map(printInputValue).join(', ') + ')';
    }
    return '(\n' + args.map((arg, i)=>printDescription(arg, '  ' + indentation, !i) + '  ' + indentation + printInputValue(arg)).join('\n') + '\n' + indentation + ')';
}
function printInputValue(arg) {
    const defaultAST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["astFromValue"])(arg.defaultValue, arg.type);
    let argDecl = arg.name + ': ' + String(arg.type);
    if (defaultAST) {
        argDecl += ` = ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(defaultAST)}`;
    }
    return argDecl + printDeprecated(arg.deprecationReason);
}
function printDirective(directive) {
    return printDescription(directive) + 'directive @' + directive.name + printArgs(directive.args) + (directive.isRepeatable ? ' repeatable' : '') + ' on ' + directive.locations.join(' | ');
}
function printDeprecated(reason) {
    if (reason == null) {
        return '';
    }
    if (reason !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DEPRECATION_REASON"]) {
        const astValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])({
            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING,
            value: reason
        });
        return ` @deprecated(reason: ${astValue})`;
    }
    return ' @deprecated';
}
function printSpecifiedByURL(scalar) {
    if (scalar.specifiedByURL == null) {
        return '';
    }
    const astValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])({
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING,
        value: scalar.specifiedByURL
    });
    return ` @specifiedBy(url: ${astValue})`;
}
function printDescription(def, indentation = '', firstInBlock = true) {
    const { description } = def;
    if (description == null) {
        return '';
    }
    const blockString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])({
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING,
        value: description,
        block: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$blockString$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrintableAsBlockString"])(description)
    });
    const prefix = indentation && !firstInBlock ? '\n' + indentation : indentation;
    return prefix + blockString.replace(/\n/g, '\n' + indentation) + '\n';
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/separateOperations.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "separateOperations": (()=>separateOperations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/visitor.mjs [app-client] (ecmascript)");
;
;
function separateOperations(documentAST) {
    const operations = [];
    const depGraph = Object.create(null); // Populate metadata and build a dependency graph.
    for (const definitionNode of documentAST.definitions){
        switch(definitionNode.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION:
                operations.push(definitionNode);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION:
                depGraph[definitionNode.name.value] = collectDependencies(definitionNode.selectionSet);
                break;
            default:
        }
    } // For each operation, produce a new synthesized AST which includes only what
    // is necessary for completing that operation.
    const separatedDocumentASTs = Object.create(null);
    for (const operation of operations){
        const dependencies = new Set();
        for (const fragmentName of collectDependencies(operation.selectionSet)){
            collectTransitiveDependencies(dependencies, depGraph, fragmentName);
        } // Provides the empty string for anonymous operations.
        const operationName = operation.name ? operation.name.value : ''; // The list of definition nodes to be included for this operation, sorted
        // to retain the same order as the original document.
        separatedDocumentASTs[operationName] = {
            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].DOCUMENT,
            definitions: documentAST.definitions.filter((node)=>node === operation || node.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION && dependencies.has(node.name.value))
        };
    }
    return separatedDocumentASTs;
}
// From a dependency graph, collects a list of transitive dependencies by
// recursing through a dependency graph.
function collectTransitiveDependencies(collected, depGraph, fromName) {
    if (!collected.has(fromName)) {
        collected.add(fromName);
        const immediateDeps = depGraph[fromName];
        if (immediateDeps !== undefined) {
            for (const toName of immediateDeps){
                collectTransitiveDependencies(collected, depGraph, toName);
            }
        }
    }
}
function collectDependencies(selectionSet) {
    const dependencies = [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visit"])(selectionSet, {
        FragmentSpread (node) {
            dependencies.push(node.name.value);
        }
    });
    return dependencies;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/stripIgnoredCharacters.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "stripIgnoredCharacters": (()=>stripIgnoredCharacters)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/source.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$lexer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/lexer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$tokenKind$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/tokenKind.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$blockString$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/blockString.mjs [app-client] (ecmascript)");
;
;
;
;
function stripIgnoredCharacters(source) {
    const sourceObj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSource"])(source) ? source : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Source"](source);
    const body = sourceObj.body;
    const lexer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$lexer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Lexer"](sourceObj);
    let strippedBody = '';
    let wasLastAddedTokenNonPunctuator = false;
    while(lexer.advance().kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$tokenKind$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenKind"].EOF){
        const currentToken = lexer.token;
        const tokenKind = currentToken.kind;
        /**
     * Every two non-punctuator tokens should have space between them.
     * Also prevent case of non-punctuator token following by spread resulting
     * in invalid token (e.g. `1...` is invalid Float token).
     */ const isNonPunctuator = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$lexer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPunctuatorTokenKind"])(currentToken.kind);
        if (wasLastAddedTokenNonPunctuator) {
            if (isNonPunctuator || currentToken.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$tokenKind$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenKind"].SPREAD) {
                strippedBody += ' ';
            }
        }
        const tokenBody = body.slice(currentToken.start, currentToken.end);
        if (tokenKind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$tokenKind$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenKind"].BLOCK_STRING) {
            strippedBody += (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$blockString$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printBlockString"])(currentToken.value, {
                minimize: true
            });
        } else {
            strippedBody += tokenBody;
        }
        wasLastAddedTokenNonPunctuator = isNonPunctuator;
    }
    return strippedBody;
}
}}),
}]);

//# sourceMappingURL=83af6_graphql_utilities_d22a16._.js.map