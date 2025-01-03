(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/83af6_graphql_type_a0853d._.js", {

"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/assertName.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "assertEnumValueName": (()=>assertEnumValueName),
    "assertName": (()=>assertName)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$characterClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/characterClasses.mjs [app-client] (ecmascript)");
;
;
;
function assertName(name) {
    name != null || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Must provide name.');
    typeof name === 'string' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Expected name to be a string.');
    if (name.length === 0) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Expected name to be a non-empty string.');
    }
    for(let i = 1; i < name.length; ++i){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$characterClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNameContinue"])(name.charCodeAt(i))) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Names must only contain [_a-zA-Z0-9] but "${name}" does not.`);
        }
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$characterClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNameStart"])(name.charCodeAt(0))) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Names must start with [_a-zA-Z] but "${name}" does not.`);
    }
    return name;
}
function assertEnumValueName(name) {
    if (name === 'true' || name === 'false' || name === 'null') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Enum values cannot be named: ${name}`);
    }
    return assertName(name);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GraphQLEnumType": (()=>GraphQLEnumType),
    "GraphQLInputObjectType": (()=>GraphQLInputObjectType),
    "GraphQLInterfaceType": (()=>GraphQLInterfaceType),
    "GraphQLList": (()=>GraphQLList),
    "GraphQLNonNull": (()=>GraphQLNonNull),
    "GraphQLObjectType": (()=>GraphQLObjectType),
    "GraphQLScalarType": (()=>GraphQLScalarType),
    "GraphQLUnionType": (()=>GraphQLUnionType),
    "argsToArgsConfig": (()=>argsToArgsConfig),
    "assertAbstractType": (()=>assertAbstractType),
    "assertCompositeType": (()=>assertCompositeType),
    "assertEnumType": (()=>assertEnumType),
    "assertInputObjectType": (()=>assertInputObjectType),
    "assertInputType": (()=>assertInputType),
    "assertInterfaceType": (()=>assertInterfaceType),
    "assertLeafType": (()=>assertLeafType),
    "assertListType": (()=>assertListType),
    "assertNamedType": (()=>assertNamedType),
    "assertNonNullType": (()=>assertNonNullType),
    "assertNullableType": (()=>assertNullableType),
    "assertObjectType": (()=>assertObjectType),
    "assertOutputType": (()=>assertOutputType),
    "assertScalarType": (()=>assertScalarType),
    "assertType": (()=>assertType),
    "assertUnionType": (()=>assertUnionType),
    "assertWrappingType": (()=>assertWrappingType),
    "defineArguments": (()=>defineArguments),
    "getNamedType": (()=>getNamedType),
    "getNullableType": (()=>getNullableType),
    "isAbstractType": (()=>isAbstractType),
    "isCompositeType": (()=>isCompositeType),
    "isEnumType": (()=>isEnumType),
    "isInputObjectType": (()=>isInputObjectType),
    "isInputType": (()=>isInputType),
    "isInterfaceType": (()=>isInterfaceType),
    "isLeafType": (()=>isLeafType),
    "isListType": (()=>isListType),
    "isNamedType": (()=>isNamedType),
    "isNonNullType": (()=>isNonNullType),
    "isNullableType": (()=>isNullableType),
    "isObjectType": (()=>isObjectType),
    "isOutputType": (()=>isOutputType),
    "isRequiredArgument": (()=>isRequiredArgument),
    "isRequiredInputField": (()=>isRequiredInputField),
    "isScalarType": (()=>isScalarType),
    "isType": (()=>isType),
    "isUnionType": (()=>isUnionType),
    "isWrappingType": (()=>isWrappingType),
    "resolveObjMapThunk": (()=>resolveObjMapThunk),
    "resolveReadonlyArrayThunk": (()=>resolveReadonlyArrayThunk)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/instanceOf.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$identityFunc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/identityFunc.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/assertName.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromASTUntyped$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/valueFromASTUntyped.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/toObjMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/mapValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyValMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-client] (ecmascript)");
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
function isType(type) {
    return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type) || isListType(type) || isNonNullType(type);
}
function assertType(type) {
    if (!isType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL type.`);
    }
    return type;
}
function isScalarType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLScalarType);
}
function assertScalarType(type) {
    if (!isScalarType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Scalar type.`);
    }
    return type;
}
function isObjectType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLObjectType);
}
function assertObjectType(type) {
    if (!isObjectType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Object type.`);
    }
    return type;
}
function isInterfaceType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLInterfaceType);
}
function assertInterfaceType(type) {
    if (!isInterfaceType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Interface type.`);
    }
    return type;
}
function isUnionType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLUnionType);
}
function assertUnionType(type) {
    if (!isUnionType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Union type.`);
    }
    return type;
}
function isEnumType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLEnumType);
}
function assertEnumType(type) {
    if (!isEnumType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Enum type.`);
    }
    return type;
}
function isInputObjectType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLInputObjectType);
}
function assertInputObjectType(type) {
    if (!isInputObjectType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Input Object type.`);
    }
    return type;
}
function isListType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLList);
}
function assertListType(type) {
    if (!isListType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL List type.`);
    }
    return type;
}
function isNonNullType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(type, GraphQLNonNull);
}
function assertNonNullType(type) {
    if (!isNonNullType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL Non-Null type.`);
    }
    return type;
}
function isInputType(type) {
    return isScalarType(type) || isEnumType(type) || isInputObjectType(type) || isWrappingType(type) && isInputType(type.ofType);
}
function assertInputType(type) {
    if (!isInputType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL input type.`);
    }
    return type;
}
function isOutputType(type) {
    return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isWrappingType(type) && isOutputType(type.ofType);
}
function assertOutputType(type) {
    if (!isOutputType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL output type.`);
    }
    return type;
}
function isLeafType(type) {
    return isScalarType(type) || isEnumType(type);
}
function assertLeafType(type) {
    if (!isLeafType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL leaf type.`);
    }
    return type;
}
function isCompositeType(type) {
    return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}
function assertCompositeType(type) {
    if (!isCompositeType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL composite type.`);
    }
    return type;
}
function isAbstractType(type) {
    return isInterfaceType(type) || isUnionType(type);
}
function assertAbstractType(type) {
    if (!isAbstractType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL abstract type.`);
    }
    return type;
}
class GraphQLList {
    constructor(ofType){
        isType(ofType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(ofType)} to be a GraphQL type.`);
        this.ofType = ofType;
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLList';
    }
    toString() {
        return '[' + String(this.ofType) + ']';
    }
    toJSON() {
        return this.toString();
    }
}
class GraphQLNonNull {
    constructor(ofType){
        isNullableType(ofType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(ofType)} to be a GraphQL nullable type.`);
        this.ofType = ofType;
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLNonNull';
    }
    toString() {
        return String(this.ofType) + '!';
    }
    toJSON() {
        return this.toString();
    }
}
function isWrappingType(type) {
    return isListType(type) || isNonNullType(type);
}
function assertWrappingType(type) {
    if (!isWrappingType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL wrapping type.`);
    }
    return type;
}
function isNullableType(type) {
    return isType(type) && !isNonNullType(type);
}
function assertNullableType(type) {
    if (!isNullableType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL nullable type.`);
    }
    return type;
}
function getNullableType(type) {
    if (type) {
        return isNonNullType(type) ? type.ofType : type;
    }
}
function isNamedType(type) {
    return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type);
}
function assertNamedType(type) {
    if (!isNamedType(type)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} to be a GraphQL named type.`);
    }
    return type;
}
function getNamedType(type) {
    if (type) {
        let unwrappedType = type;
        while(isWrappingType(unwrappedType)){
            unwrappedType = unwrappedType.ofType;
        }
        return unwrappedType;
    }
}
function resolveReadonlyArrayThunk(thunk) {
    return typeof thunk === 'function' ? thunk() : thunk;
}
function resolveObjMapThunk(thunk) {
    return typeof thunk === 'function' ? thunk() : thunk;
}
class GraphQLScalarType {
    constructor(config){
        var _config$parseValue, _config$serialize, _config$parseLiteral, _config$extensionASTN;
        const parseValue = (_config$parseValue = config.parseValue) !== null && _config$parseValue !== void 0 ? _config$parseValue : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$identityFunc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityFunc"];
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.specifiedByURL = config.specifiedByURL;
        this.serialize = (_config$serialize = config.serialize) !== null && _config$serialize !== void 0 ? _config$serialize : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$identityFunc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityFunc"];
        this.parseValue = parseValue;
        this.parseLiteral = (_config$parseLiteral = config.parseLiteral) !== null && _config$parseLiteral !== void 0 ? _config$parseLiteral : (node, variables)=>parseValue((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$valueFromASTUntyped$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["valueFromASTUntyped"])(node, variables));
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
        config.specifiedByURL == null || typeof config.specifiedByURL === 'string' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${this.name} must provide "specifiedByURL" as a string, ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(config.specifiedByURL)}.`);
        config.serialize == null || typeof config.serialize === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`);
        if (config.parseLiteral) {
            typeof config.parseValue === 'function' && typeof config.parseLiteral === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${this.name} must provide both "parseValue" and "parseLiteral" functions.`);
        }
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLScalarType';
    }
    toConfig() {
        return {
            name: this.name,
            description: this.description,
            specifiedByURL: this.specifiedByURL,
            serialize: this.serialize,
            parseValue: this.parseValue,
            parseLiteral: this.parseLiteral,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes
        };
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.toString();
    }
}
class GraphQLObjectType {
    constructor(config){
        var _config$extensionASTN2;
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.isTypeOf = config.isTypeOf;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN2 = config.extensionASTNodes) !== null && _config$extensionASTN2 !== void 0 ? _config$extensionASTN2 : [];
        this._fields = ()=>defineFieldMap(config);
        this._interfaces = ()=>defineInterfaces(config);
        config.isTypeOf == null || typeof config.isTypeOf === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${this.name} must provide "isTypeOf" as a function, ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(config.isTypeOf)}.`);
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLObjectType';
    }
    getFields() {
        if (typeof this._fields === 'function') {
            this._fields = this._fields();
        }
        return this._fields;
    }
    getInterfaces() {
        if (typeof this._interfaces === 'function') {
            this._interfaces = this._interfaces();
        }
        return this._interfaces;
    }
    toConfig() {
        return {
            name: this.name,
            description: this.description,
            interfaces: this.getInterfaces(),
            fields: fieldsToFieldsConfig(this.getFields()),
            isTypeOf: this.isTypeOf,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes
        };
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.toString();
    }
}
function defineInterfaces(config) {
    var _config$interfaces;
    const interfaces = resolveReadonlyArrayThunk((_config$interfaces = config.interfaces) !== null && _config$interfaces !== void 0 ? _config$interfaces : []);
    Array.isArray(interfaces) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name} interfaces must be an Array or a function which returns an Array.`);
    return interfaces;
}
function defineFieldMap(config) {
    const fieldMap = resolveObjMapThunk(config.fields);
    isPlainObj(fieldMap) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name} fields must be an object with field names as keys or a function which returns such an object.`);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(fieldMap, (fieldConfig, fieldName)=>{
        var _fieldConfig$args;
        isPlainObj(fieldConfig) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name}.${fieldName} field config must be an object.`);
        fieldConfig.resolve == null || typeof fieldConfig.resolve === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name}.${fieldName} field resolver must be a function if ` + `provided, but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(fieldConfig.resolve)}.`);
        const argsConfig = (_fieldConfig$args = fieldConfig.args) !== null && _fieldConfig$args !== void 0 ? _fieldConfig$args : {};
        isPlainObj(argsConfig) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name}.${fieldName} args must be an object with argument names as keys.`);
        return {
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(fieldName),
            description: fieldConfig.description,
            type: fieldConfig.type,
            args: defineArguments(argsConfig),
            resolve: fieldConfig.resolve,
            subscribe: fieldConfig.subscribe,
            deprecationReason: fieldConfig.deprecationReason,
            extensions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(fieldConfig.extensions),
            astNode: fieldConfig.astNode
        };
    });
}
function defineArguments(config) {
    return Object.entries(config).map(([argName, argConfig])=>({
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(argName),
            description: argConfig.description,
            type: argConfig.type,
            defaultValue: argConfig.defaultValue,
            deprecationReason: argConfig.deprecationReason,
            extensions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(argConfig.extensions),
            astNode: argConfig.astNode
        }));
}
function isPlainObj(obj) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(obj) && !Array.isArray(obj);
}
function fieldsToFieldsConfig(fields) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(fields, (field)=>({
            description: field.description,
            type: field.type,
            args: argsToArgsConfig(field.args),
            resolve: field.resolve,
            subscribe: field.subscribe,
            deprecationReason: field.deprecationReason,
            extensions: field.extensions,
            astNode: field.astNode
        }));
}
function argsToArgsConfig(args) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(args, (arg)=>arg.name, (arg)=>({
            description: arg.description,
            type: arg.type,
            defaultValue: arg.defaultValue,
            deprecationReason: arg.deprecationReason,
            extensions: arg.extensions,
            astNode: arg.astNode
        }));
}
function isRequiredArgument(arg) {
    return isNonNullType(arg.type) && arg.defaultValue === undefined;
}
class GraphQLInterfaceType {
    constructor(config){
        var _config$extensionASTN3;
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.resolveType = config.resolveType;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN3 = config.extensionASTNodes) !== null && _config$extensionASTN3 !== void 0 ? _config$extensionASTN3 : [];
        this._fields = defineFieldMap.bind(undefined, config);
        this._interfaces = defineInterfaces.bind(undefined, config);
        config.resolveType == null || typeof config.resolveType === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${this.name} must provide "resolveType" as a function, ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(config.resolveType)}.`);
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLInterfaceType';
    }
    getFields() {
        if (typeof this._fields === 'function') {
            this._fields = this._fields();
        }
        return this._fields;
    }
    getInterfaces() {
        if (typeof this._interfaces === 'function') {
            this._interfaces = this._interfaces();
        }
        return this._interfaces;
    }
    toConfig() {
        return {
            name: this.name,
            description: this.description,
            interfaces: this.getInterfaces(),
            fields: fieldsToFieldsConfig(this.getFields()),
            resolveType: this.resolveType,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes
        };
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.toString();
    }
}
class GraphQLUnionType {
    constructor(config){
        var _config$extensionASTN4;
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.resolveType = config.resolveType;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN4 = config.extensionASTNodes) !== null && _config$extensionASTN4 !== void 0 ? _config$extensionASTN4 : [];
        this._types = defineTypes.bind(undefined, config);
        config.resolveType == null || typeof config.resolveType === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${this.name} must provide "resolveType" as a function, ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(config.resolveType)}.`);
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLUnionType';
    }
    getTypes() {
        if (typeof this._types === 'function') {
            this._types = this._types();
        }
        return this._types;
    }
    toConfig() {
        return {
            name: this.name,
            description: this.description,
            types: this.getTypes(),
            resolveType: this.resolveType,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes
        };
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.toString();
    }
}
function defineTypes(config) {
    const types = resolveReadonlyArrayThunk(config.types);
    Array.isArray(types) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `Must provide Array of types or a function which returns such an array for Union ${config.name}.`);
    return types;
}
class GraphQLEnumType {
    /* <T> */ constructor(config){
        var _config$extensionASTN5;
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN5 = config.extensionASTNodes) !== null && _config$extensionASTN5 !== void 0 ? _config$extensionASTN5 : [];
        this._values = defineEnumValues(this.name, config.values);
        this._valueLookup = new Map(this._values.map((enumValue)=>[
                enumValue.value,
                enumValue
            ]));
        this._nameLookup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyMap"])(this._values, (value)=>value.name);
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLEnumType';
    }
    getValues() {
        return this._values;
    }
    getValue(name) {
        return this._nameLookup[name];
    }
    serialize(outputValue) {
        const enumValue = this._valueLookup.get(outputValue);
        if (enumValue === undefined) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Enum "${this.name}" cannot represent value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(outputValue)}`);
        }
        return enumValue.name;
    }
    parseValue(inputValue) /* T */ {
        if (typeof inputValue !== 'string') {
            const valueStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputValue);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Enum "${this.name}" cannot represent non-string value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr));
        }
        const enumValue = this.getValue(inputValue);
        if (enumValue == null) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Value "${inputValue}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, inputValue));
        }
        return enumValue.value;
    }
    parseLiteral(valueNode, _variables) /* T */ {
        // Note: variables will be resolved to a value before calling this function.
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].ENUM) {
            const valueStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr), {
                nodes: valueNode
            });
        }
        const enumValue = this.getValue(valueNode.value);
        if (enumValue == null) {
            const valueStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Value "${valueStr}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, valueStr), {
                nodes: valueNode
            });
        }
        return enumValue.value;
    }
    toConfig() {
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyValMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keyValMap"])(this.getValues(), (value)=>value.name, (value)=>({
                description: value.description,
                value: value.value,
                deprecationReason: value.deprecationReason,
                extensions: value.extensions,
                astNode: value.astNode
            }));
        return {
            name: this.name,
            description: this.description,
            values,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes
        };
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.toString();
    }
}
function didYouMeanEnumValue(enumType, unknownValueStr) {
    const allNames = enumType.getValues().map((value)=>value.name);
    const suggestedValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["suggestionList"])(unknownValueStr, allNames);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["didYouMean"])('the enum value', suggestedValues);
}
function defineEnumValues(typeName, valueMap) {
    isPlainObj(valueMap) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${typeName} values must be an object with value names as keys.`);
    return Object.entries(valueMap).map(([valueName, valueConfig])=>{
        isPlainObj(valueConfig) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${typeName}.${valueName} must refer to an object with a "value" key ` + `representing an internal value but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(valueConfig)}.`);
        return {
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertEnumValueName"])(valueName),
            description: valueConfig.description,
            value: valueConfig.value !== undefined ? valueConfig.value : valueName,
            deprecationReason: valueConfig.deprecationReason,
            extensions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(valueConfig.extensions),
            astNode: valueConfig.astNode
        };
    });
}
class GraphQLInputObjectType {
    constructor(config){
        var _config$extensionASTN6;
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN6 = config.extensionASTNodes) !== null && _config$extensionASTN6 !== void 0 ? _config$extensionASTN6 : [];
        this._fields = defineInputFieldMap.bind(undefined, config);
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLInputObjectType';
    }
    getFields() {
        if (typeof this._fields === 'function') {
            this._fields = this._fields();
        }
        return this._fields;
    }
    toConfig() {
        const fields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(this.getFields(), (field)=>({
                description: field.description,
                type: field.type,
                defaultValue: field.defaultValue,
                deprecationReason: field.deprecationReason,
                extensions: field.extensions,
                astNode: field.astNode
            }));
        return {
            name: this.name,
            description: this.description,
            fields,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes
        };
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.toString();
    }
}
function defineInputFieldMap(config) {
    const fieldMap = resolveObjMapThunk(config.fields);
    isPlainObj(fieldMap) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name} fields must be an object with field names as keys or a function which returns such an object.`);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$mapValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapValue"])(fieldMap, (fieldConfig, fieldName)=>{
        !('resolve' in fieldConfig) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `${config.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`);
        return {
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(fieldName),
            description: fieldConfig.description,
            type: fieldConfig.type,
            defaultValue: fieldConfig.defaultValue,
            deprecationReason: fieldConfig.deprecationReason,
            extensions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(fieldConfig.extensions),
            astNode: fieldConfig.astNode
        };
    });
}
function isRequiredInputField(field) {
    return isNonNullType(field.type) && field.defaultValue === undefined;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GRAPHQL_MAX_INT": (()=>GRAPHQL_MAX_INT),
    "GRAPHQL_MIN_INT": (()=>GRAPHQL_MIN_INT),
    "GraphQLBoolean": (()=>GraphQLBoolean),
    "GraphQLFloat": (()=>GraphQLFloat),
    "GraphQLID": (()=>GraphQLID),
    "GraphQLInt": (()=>GraphQLInt),
    "GraphQLString": (()=>GraphQLString),
    "isSpecifiedScalarType": (()=>isSpecifiedScalarType),
    "specifiedScalarTypes": (()=>specifiedScalarTypes)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
const GRAPHQL_MAX_INT = 2147483647;
const GRAPHQL_MIN_INT = -2147483648;
const GraphQLInt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
    name: 'Int',
    description: 'The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.',
    serialize (outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === 'boolean') {
            return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === 'string' && coercedValue !== '') {
            num = Number(coercedValue);
        }
        if (typeof num !== 'number' || !Number.isInteger(num)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Int cannot represent non-integer value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(coercedValue)}`);
        }
        if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('Int cannot represent non 32-bit signed integer value: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(coercedValue));
        }
        return num;
    },
    parseValue (inputValue) {
        if (typeof inputValue !== 'number' || !Number.isInteger(inputValue)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Int cannot represent non-integer value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputValue)}`);
        }
        if (inputValue > GRAPHQL_MAX_INT || inputValue < GRAPHQL_MIN_INT) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Int cannot represent non 32-bit signed integer value: ${inputValue}`);
        }
        return inputValue;
    },
    parseLiteral (valueNode) {
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Int cannot represent non-integer value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode)}`, {
                nodes: valueNode
            });
        }
        const num = parseInt(valueNode.value, 10);
        if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Int cannot represent non 32-bit signed integer value: ${valueNode.value}`, {
                nodes: valueNode
            });
        }
        return num;
    }
});
const GraphQLFloat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
    name: 'Float',
    description: 'The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',
    serialize (outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === 'boolean') {
            return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === 'string' && coercedValue !== '') {
            num = Number(coercedValue);
        }
        if (typeof num !== 'number' || !Number.isFinite(num)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Float cannot represent non numeric value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(coercedValue)}`);
        }
        return num;
    },
    parseValue (inputValue) {
        if (typeof inputValue !== 'number' || !Number.isFinite(inputValue)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Float cannot represent non numeric value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputValue)}`);
        }
        return inputValue;
    },
    parseLiteral (valueNode) {
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].FLOAT && valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Float cannot represent non numeric value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode)}`, valueNode);
        }
        return parseFloat(valueNode.value);
    }
});
const GraphQLString = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
    name: 'String',
    description: 'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.',
    serialize (outputValue) {
        const coercedValue = serializeObject(outputValue); // Serialize string, boolean and number values to a string, but do not
        // attempt to coerce object, function, symbol, or other types as strings.
        if (typeof coercedValue === 'string') {
            return coercedValue;
        }
        if (typeof coercedValue === 'boolean') {
            return coercedValue ? 'true' : 'false';
        }
        if (typeof coercedValue === 'number' && Number.isFinite(coercedValue)) {
            return coercedValue.toString();
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`String cannot represent value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(outputValue)}`);
    },
    parseValue (inputValue) {
        if (typeof inputValue !== 'string') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`String cannot represent a non string value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputValue)}`);
        }
        return inputValue;
    },
    parseLiteral (valueNode) {
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`String cannot represent a non string value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode)}`, {
                nodes: valueNode
            });
        }
        return valueNode.value;
    }
});
const GraphQLBoolean = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
    name: 'Boolean',
    description: 'The `Boolean` scalar type represents `true` or `false`.',
    serialize (outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === 'boolean') {
            return coercedValue;
        }
        if (Number.isFinite(coercedValue)) {
            return coercedValue !== 0;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Boolean cannot represent a non boolean value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(coercedValue)}`);
    },
    parseValue (inputValue) {
        if (typeof inputValue !== 'boolean') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Boolean cannot represent a non boolean value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputValue)}`);
        }
        return inputValue;
    },
    parseLiteral (valueNode) {
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].BOOLEAN) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`Boolean cannot represent a non boolean value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode)}`, {
                nodes: valueNode
            });
        }
        return valueNode.value;
    }
});
const GraphQLID = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLScalarType"]({
    name: 'ID',
    description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
    serialize (outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === 'string') {
            return coercedValue;
        }
        if (Number.isInteger(coercedValue)) {
            return String(coercedValue);
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`ID cannot represent value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(outputValue)}`);
    },
    parseValue (inputValue) {
        if (typeof inputValue === 'string') {
            return inputValue;
        }
        if (typeof inputValue === 'number' && Number.isInteger(inputValue)) {
            return inputValue.toString();
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](`ID cannot represent value: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(inputValue)}`);
    },
    parseLiteral (valueNode) {
        if (valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].STRING && valueNode.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kind"].INT) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"]('ID cannot represent a non-string and non-integer value: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueNode), {
                nodes: valueNode
            });
        }
        return valueNode.value;
    }
});
const specifiedScalarTypes = Object.freeze([
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLID
]);
function isSpecifiedScalarType(type) {
    return specifiedScalarTypes.some(({ name })=>type.name === name);
} // Support serializing objects with custom valueOf() or toJSON() functions -
// a common way to represent a complex value which can be represented as
// a string (ex: MongoDB id objects).
function serializeObject(outputValue) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(outputValue)) {
        if (typeof outputValue.valueOf === 'function') {
            const valueOfResult = outputValue.valueOf();
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(valueOfResult)) {
                return valueOfResult;
            }
        }
        if (typeof outputValue.toJSON === 'function') {
            return outputValue.toJSON();
        }
    }
    return outputValue;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DEFAULT_DEPRECATION_REASON": (()=>DEFAULT_DEPRECATION_REASON),
    "GraphQLDeprecatedDirective": (()=>GraphQLDeprecatedDirective),
    "GraphQLDirective": (()=>GraphQLDirective),
    "GraphQLIncludeDirective": (()=>GraphQLIncludeDirective),
    "GraphQLSkipDirective": (()=>GraphQLSkipDirective),
    "GraphQLSpecifiedByDirective": (()=>GraphQLSpecifiedByDirective),
    "assertDirective": (()=>assertDirective),
    "isDirective": (()=>isDirective),
    "isSpecifiedDirective": (()=>isSpecifiedDirective),
    "specifiedDirectives": (()=>specifiedDirectives)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/instanceOf.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/assertName.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/toObjMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/directiveLocation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
function isDirective(directive) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(directive, GraphQLDirective);
}
function assertDirective(directive) {
    if (!isDirective(directive)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(directive)} to be a GraphQL directive.`);
    }
    return directive;
}
class GraphQLDirective {
    constructor(config){
        var _config$isRepeatable, _config$args;
        this.name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$assertName$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertName"])(config.name);
        this.description = config.description;
        this.locations = config.locations;
        this.isRepeatable = (_config$isRepeatable = config.isRepeatable) !== null && _config$isRepeatable !== void 0 ? _config$isRepeatable : false;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        Array.isArray(config.locations) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `@${config.name} locations must be an Array.`);
        const args = (_config$args = config.args) !== null && _config$args !== void 0 ? _config$args : {};
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(args) && !Array.isArray(args) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `@${config.name} args must be an object with argument names as keys.`);
        this.args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineArguments"])(args);
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLDirective';
    }
    toConfig() {
        return {
            name: this.name,
            description: this.description,
            locations: this.locations,
            args: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["argsToArgsConfig"])(this.args),
            isRepeatable: this.isRepeatable,
            extensions: this.extensions,
            astNode: this.astNode
        };
    }
    toString() {
        return '@' + this.name;
    }
    toJSON() {
        return this.toString();
    }
}
const GraphQLIncludeDirective = new GraphQLDirective({
    name: 'include',
    description: 'Directs the executor to include this field or fragment only when the `if` argument is true.',
    locations: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FRAGMENT_SPREAD,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INLINE_FRAGMENT
    ],
    args: {
        if: {
            type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
            description: 'Included when true.'
        }
    }
});
const GraphQLSkipDirective = new GraphQLDirective({
    name: 'skip',
    description: 'Directs the executor to skip this field or fragment when the `if` argument is true.',
    locations: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FRAGMENT_SPREAD,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INLINE_FRAGMENT
    ],
    args: {
        if: {
            type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
            description: 'Skipped when true.'
        }
    }
});
const DEFAULT_DEPRECATION_REASON = 'No longer supported';
const GraphQLDeprecatedDirective = new GraphQLDirective({
    name: 'deprecated',
    description: 'Marks an element of a GraphQL schema as no longer supported.',
    locations: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD_DEFINITION,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].ARGUMENT_DEFINITION,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INPUT_FIELD_DEFINITION,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].ENUM_VALUE
    ],
    args: {
        reason: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
            description: 'Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).',
            defaultValue: DEFAULT_DEPRECATION_REASON
        }
    }
});
const GraphQLSpecifiedByDirective = new GraphQLDirective({
    name: 'specifiedBy',
    description: 'Exposes a URL that specifies the behavior of this scalar.',
    locations: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].SCALAR
    ],
    args: {
        url: {
            type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
            description: 'The URL that specifies the behavior of this scalar.'
        }
    }
});
const specifiedDirectives = Object.freeze([
    GraphQLIncludeDirective,
    GraphQLSkipDirective,
    GraphQLDeprecatedDirective,
    GraphQLSpecifiedByDirective
]);
function isSpecifiedDirective(directive) {
    return specifiedDirectives.some(({ name })=>name === directive.name);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SchemaMetaFieldDef": (()=>SchemaMetaFieldDef),
    "TypeKind": (()=>TypeKind),
    "TypeMetaFieldDef": (()=>TypeMetaFieldDef),
    "TypeNameMetaFieldDef": (()=>TypeNameMetaFieldDef),
    "__Directive": (()=>__Directive),
    "__DirectiveLocation": (()=>__DirectiveLocation),
    "__EnumValue": (()=>__EnumValue),
    "__Field": (()=>__Field),
    "__InputValue": (()=>__InputValue),
    "__Schema": (()=>__Schema),
    "__Type": (()=>__Type),
    "__TypeKind": (()=>__TypeKind),
    "introspectionTypes": (()=>introspectionTypes),
    "isIntrospectionType": (()=>isIntrospectionType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/directiveLocation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/astFromValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
const __Schema = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
    name: '__Schema',
    description: 'A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.',
    fields: ()=>({
            description: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (schema)=>schema.description
            },
            types: {
                description: 'A list of all types supported by this server.',
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Type))),
                resolve (schema) {
                    return Object.values(schema.getTypeMap());
                }
            },
            queryType: {
                description: 'The type that query operations will be rooted at.',
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Type),
                resolve: (schema)=>schema.getQueryType()
            },
            mutationType: {
                description: 'If this server supports mutation, the type that mutation operations will be rooted at.',
                type: __Type,
                resolve: (schema)=>schema.getMutationType()
            },
            subscriptionType: {
                description: 'If this server support subscription, the type that subscription operations will be rooted at.',
                type: __Type,
                resolve: (schema)=>schema.getSubscriptionType()
            },
            directives: {
                description: 'A list of all directives supported by this server.',
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Directive))),
                resolve: (schema)=>schema.getDirectives()
            }
        })
});
const __Directive = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
    name: '__Directive',
    description: "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
    fields: ()=>({
            name: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
                resolve: (directive)=>directive.name
            },
            description: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (directive)=>directive.description
            },
            isRepeatable: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
                resolve: (directive)=>directive.isRepeatable
            },
            locations: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__DirectiveLocation))),
                resolve: (directive)=>directive.locations
            },
            args: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__InputValue))),
                args: {
                    includeDeprecated: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"],
                        defaultValue: false
                    }
                },
                resolve (field, { includeDeprecated }) {
                    return includeDeprecated ? field.args : field.args.filter((arg)=>arg.deprecationReason == null);
                }
            }
        })
});
const __DirectiveLocation = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]({
    name: '__DirectiveLocation',
    description: 'A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.',
    values: {
        QUERY: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].QUERY,
            description: 'Location adjacent to a query operation.'
        },
        MUTATION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].MUTATION,
            description: 'Location adjacent to a mutation operation.'
        },
        SUBSCRIPTION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].SUBSCRIPTION,
            description: 'Location adjacent to a subscription operation.'
        },
        FIELD: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD,
            description: 'Location adjacent to a field.'
        },
        FRAGMENT_DEFINITION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FRAGMENT_DEFINITION,
            description: 'Location adjacent to a fragment definition.'
        },
        FRAGMENT_SPREAD: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FRAGMENT_SPREAD,
            description: 'Location adjacent to a fragment spread.'
        },
        INLINE_FRAGMENT: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INLINE_FRAGMENT,
            description: 'Location adjacent to an inline fragment.'
        },
        VARIABLE_DEFINITION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].VARIABLE_DEFINITION,
            description: 'Location adjacent to a variable definition.'
        },
        SCHEMA: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].SCHEMA,
            description: 'Location adjacent to a schema definition.'
        },
        SCALAR: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].SCALAR,
            description: 'Location adjacent to a scalar definition.'
        },
        OBJECT: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].OBJECT,
            description: 'Location adjacent to an object type definition.'
        },
        FIELD_DEFINITION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD_DEFINITION,
            description: 'Location adjacent to a field definition.'
        },
        ARGUMENT_DEFINITION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].ARGUMENT_DEFINITION,
            description: 'Location adjacent to an argument definition.'
        },
        INTERFACE: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INTERFACE,
            description: 'Location adjacent to an interface definition.'
        },
        UNION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].UNION,
            description: 'Location adjacent to a union definition.'
        },
        ENUM: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].ENUM,
            description: 'Location adjacent to an enum definition.'
        },
        ENUM_VALUE: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].ENUM_VALUE,
            description: 'Location adjacent to an enum value definition.'
        },
        INPUT_OBJECT: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INPUT_OBJECT,
            description: 'Location adjacent to an input object type definition.'
        },
        INPUT_FIELD_DEFINITION: {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectiveLocation"].INPUT_FIELD_DEFINITION,
            description: 'Location adjacent to an input object field definition.'
        }
    }
});
const __Type = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
    name: '__Type',
    description: 'The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.',
    fields: ()=>({
            kind: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TypeKind),
                resolve (type) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScalarType"])(type)) {
                        return TypeKind.SCALAR;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
                        return TypeKind.OBJECT;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
                        return TypeKind.INTERFACE;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
                        return TypeKind.UNION;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
                        return TypeKind.ENUM;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
                        return TypeKind.INPUT_OBJECT;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isListType"])(type)) {
                        return TypeKind.LIST;
                    }
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
                        return TypeKind.NON_NULL;
                    }
                    /* c8 ignore next 3 */ // Not reachable, all possible types have been considered)
                    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(false, `Unexpected type: "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)}".`);
                }
            },
            name: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (type)=>'name' in type ? type.name : undefined
            },
            description: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (type)=>/* c8 ignore next */ 'description' in type ? type.description : undefined
            },
            specifiedByURL: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (obj)=>'specifiedByURL' in obj ? obj.specifiedByURL : undefined
            },
            fields: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Field)),
                args: {
                    includeDeprecated: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"],
                        defaultValue: false
                    }
                },
                resolve (type, { includeDeprecated }) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
                        const fields = Object.values(type.getFields());
                        return includeDeprecated ? fields : fields.filter((field)=>field.deprecationReason == null);
                    }
                }
            },
            interfaces: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Type)),
                resolve (type) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
                        return type.getInterfaces();
                    }
                }
            },
            possibleTypes: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Type)),
                resolve (type, _args, _context, { schema }) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAbstractType"])(type)) {
                        return schema.getPossibleTypes(type);
                    }
                }
            },
            enumValues: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__EnumValue)),
                args: {
                    includeDeprecated: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"],
                        defaultValue: false
                    }
                },
                resolve (type, { includeDeprecated }) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
                        const values = type.getValues();
                        return includeDeprecated ? values : values.filter((field)=>field.deprecationReason == null);
                    }
                }
            },
            inputFields: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__InputValue)),
                args: {
                    includeDeprecated: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"],
                        defaultValue: false
                    }
                },
                resolve (type, { includeDeprecated }) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
                        const values = Object.values(type.getFields());
                        return includeDeprecated ? values : values.filter((field)=>field.deprecationReason == null);
                    }
                }
            },
            ofType: {
                type: __Type,
                resolve: (type)=>'ofType' in type ? type.ofType : undefined
            }
        })
});
const __Field = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
    name: '__Field',
    description: 'Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.',
    fields: ()=>({
            name: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
                resolve: (field)=>field.name
            },
            description: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (field)=>field.description
            },
            args: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLList"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__InputValue))),
                args: {
                    includeDeprecated: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"],
                        defaultValue: false
                    }
                },
                resolve (field, { includeDeprecated }) {
                    return includeDeprecated ? field.args : field.args.filter((arg)=>arg.deprecationReason == null);
                }
            },
            type: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Type),
                resolve: (field)=>field.type
            },
            isDeprecated: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
                resolve: (field)=>field.deprecationReason != null
            },
            deprecationReason: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (field)=>field.deprecationReason
            }
        })
});
const __InputValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
    name: '__InputValue',
    description: 'Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.',
    fields: ()=>({
            name: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
                resolve: (inputValue)=>inputValue.name
            },
            description: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (inputValue)=>inputValue.description
            },
            type: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Type),
                resolve: (inputValue)=>inputValue.type
            },
            defaultValue: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                description: 'A GraphQL-formatted string representing the default value for this input value.',
                resolve (inputValue) {
                    const { type, defaultValue } = inputValue;
                    const valueAST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$astFromValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["astFromValue"])(defaultValue, type);
                    return valueAST ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["print"])(valueAST) : null;
                }
            },
            isDeprecated: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
                resolve: (field)=>field.deprecationReason != null
            },
            deprecationReason: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (obj)=>obj.deprecationReason
            }
        })
});
const __EnumValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLObjectType"]({
    name: '__EnumValue',
    description: 'One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.',
    fields: ()=>({
            name: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
                resolve: (enumValue)=>enumValue.name
            },
            description: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (enumValue)=>enumValue.description
            },
            isDeprecated: {
                type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLBoolean"]),
                resolve: (enumValue)=>enumValue.deprecationReason != null
            },
            deprecationReason: {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"],
                resolve: (enumValue)=>enumValue.deprecationReason
            }
        })
});
var TypeKind;
(function(TypeKind) {
    TypeKind['SCALAR'] = 'SCALAR';
    TypeKind['OBJECT'] = 'OBJECT';
    TypeKind['INTERFACE'] = 'INTERFACE';
    TypeKind['UNION'] = 'UNION';
    TypeKind['ENUM'] = 'ENUM';
    TypeKind['INPUT_OBJECT'] = 'INPUT_OBJECT';
    TypeKind['LIST'] = 'LIST';
    TypeKind['NON_NULL'] = 'NON_NULL';
})(TypeKind || (TypeKind = {}));
;
const __TypeKind = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLEnumType"]({
    name: '__TypeKind',
    description: 'An enum describing what kind of type a given `__Type` is.',
    values: {
        SCALAR: {
            value: TypeKind.SCALAR,
            description: 'Indicates this type is a scalar.'
        },
        OBJECT: {
            value: TypeKind.OBJECT,
            description: 'Indicates this type is an object. `fields` and `interfaces` are valid fields.'
        },
        INTERFACE: {
            value: TypeKind.INTERFACE,
            description: 'Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.'
        },
        UNION: {
            value: TypeKind.UNION,
            description: 'Indicates this type is a union. `possibleTypes` is a valid field.'
        },
        ENUM: {
            value: TypeKind.ENUM,
            description: 'Indicates this type is an enum. `enumValues` is a valid field.'
        },
        INPUT_OBJECT: {
            value: TypeKind.INPUT_OBJECT,
            description: 'Indicates this type is an input object. `inputFields` is a valid field.'
        },
        LIST: {
            value: TypeKind.LIST,
            description: 'Indicates this type is a list. `ofType` is a valid field.'
        },
        NON_NULL: {
            value: TypeKind.NON_NULL,
            description: 'Indicates this type is a non-null. `ofType` is a valid field.'
        }
    }
});
const SchemaMetaFieldDef = {
    name: '__schema',
    type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__Schema),
    description: 'Access the current type schema of this server.',
    args: [],
    resolve: (_source, _args, _context, { schema })=>schema,
    deprecationReason: undefined,
    extensions: Object.create(null),
    astNode: undefined
};
const TypeMetaFieldDef = {
    name: '__type',
    type: __Type,
    description: 'Request the type information of a single type.',
    args: [
        {
            name: 'name',
            description: undefined,
            type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
            defaultValue: undefined,
            deprecationReason: undefined,
            extensions: Object.create(null),
            astNode: undefined
        }
    ],
    resolve: (_source, { name }, _context, { schema })=>schema.getType(name),
    deprecationReason: undefined,
    extensions: Object.create(null),
    astNode: undefined
};
const TypeNameMetaFieldDef = {
    name: '__typename',
    type: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLNonNull"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLString"]),
    description: 'The name of the current Object type at runtime.',
    args: [],
    resolve: (_source, _args, _context, { parentType })=>parentType.name,
    deprecationReason: undefined,
    extensions: Object.create(null),
    astNode: undefined
};
const introspectionTypes = Object.freeze([
    __Schema,
    __Directive,
    __DirectiveLocation,
    __Type,
    __Field,
    __InputValue,
    __EnumValue,
    __TypeKind
]);
function isIntrospectionType(type) {
    return introspectionTypes.some(({ name })=>type.name === name);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GraphQLSchema": (()=>GraphQLSchema),
    "assertSchema": (()=>assertSchema),
    "isSchema": (()=>isSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/instanceOf.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/toObjMap.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
function isSchema(schema) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$instanceOf$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instanceOf"])(schema, GraphQLSchema);
}
function assertSchema(schema) {
    if (!isSchema(schema)) {
        throw new Error(`Expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(schema)} to be a GraphQL schema.`);
    }
    return schema;
}
class GraphQLSchema {
    // Used as a cache for validateSchema().
    constructor(config){
        var _config$extensionASTN, _config$directives;
        // If this schema was built from a source known to be valid, then it may be
        // marked with assumeValid to avoid an additional type system validation.
        this.__validationErrors = config.assumeValid === true ? [] : undefined; // Check for common mistakes during construction to produce early errors.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(config) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Must provide configuration object.');
        !config.types || Array.isArray(config.types) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, `"types" must be Array if provided but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(config.types)}.`);
        !config.directives || Array.isArray(config.directives) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, '"directives" must be Array if provided but got: ' + `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(config.directives)}.`);
        this.description = config.description;
        this.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$toObjMap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toObjMap"])(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
        this._queryType = config.query;
        this._mutationType = config.mutation;
        this._subscriptionType = config.subscription; // Provide specified directives (e.g. @include and @skip) by default.
        this._directives = (_config$directives = config.directives) !== null && _config$directives !== void 0 ? _config$directives : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["specifiedDirectives"]; // To preserve order of user-provided types, we add first to add them to
        // the set of "collected" types, so `collectReferencedTypes` ignore them.
        const allReferencedTypes = new Set(config.types);
        if (config.types != null) {
            for (const type of config.types){
                // When we ready to process this type, we remove it from "collected" types
                // and then add it together with all dependent types in the correct position.
                allReferencedTypes.delete(type);
                collectReferencedTypes(type, allReferencedTypes);
            }
        }
        if (this._queryType != null) {
            collectReferencedTypes(this._queryType, allReferencedTypes);
        }
        if (this._mutationType != null) {
            collectReferencedTypes(this._mutationType, allReferencedTypes);
        }
        if (this._subscriptionType != null) {
            collectReferencedTypes(this._subscriptionType, allReferencedTypes);
        }
        for (const directive of this._directives){
            // Directives are not validated until validateSchema() is called.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDirective"])(directive)) {
                for (const arg of directive.args){
                    collectReferencedTypes(arg.type, allReferencedTypes);
                }
            }
        }
        collectReferencedTypes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__Schema"], allReferencedTypes); // Storing the resulting map for reference by the schema.
        this._typeMap = Object.create(null);
        this._subTypeMap = Object.create(null); // Keep track of all implementations by interface name.
        this._implementationsMap = Object.create(null);
        for (const namedType of allReferencedTypes){
            if (namedType == null) {
                continue;
            }
            const typeName = namedType.name;
            typeName || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devAssert"])(false, 'One of the provided types for building the Schema is missing a name.');
            if (this._typeMap[typeName] !== undefined) {
                throw new Error(`Schema must contain uniquely named types but contains multiple types named "${typeName}".`);
            }
            this._typeMap[typeName] = namedType;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(namedType)) {
                // Store implementations by interface.
                for (const iface of namedType.getInterfaces()){
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(iface)) {
                        let implementations = this._implementationsMap[iface.name];
                        if (implementations === undefined) {
                            implementations = this._implementationsMap[iface.name] = {
                                objects: [],
                                interfaces: []
                            };
                        }
                        implementations.interfaces.push(namedType);
                    }
                }
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(namedType)) {
                // Store implementations by objects.
                for (const iface of namedType.getInterfaces()){
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(iface)) {
                        let implementations = this._implementationsMap[iface.name];
                        if (implementations === undefined) {
                            implementations = this._implementationsMap[iface.name] = {
                                objects: [],
                                interfaces: []
                            };
                        }
                        implementations.objects.push(namedType);
                    }
                }
            }
        }
    }
    get [Symbol.toStringTag]() {
        return 'GraphQLSchema';
    }
    getQueryType() {
        return this._queryType;
    }
    getMutationType() {
        return this._mutationType;
    }
    getSubscriptionType() {
        return this._subscriptionType;
    }
    getRootType(operation) {
        switch(operation){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].QUERY:
                return this.getQueryType();
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].MUTATION:
                return this.getMutationType();
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].SUBSCRIPTION:
                return this.getSubscriptionType();
        }
    }
    getTypeMap() {
        return this._typeMap;
    }
    getType(name) {
        return this.getTypeMap()[name];
    }
    getPossibleTypes(abstractType) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(abstractType) ? abstractType.getTypes() : this.getImplementations(abstractType).objects;
    }
    getImplementations(interfaceType) {
        const implementations = this._implementationsMap[interfaceType.name];
        return implementations !== null && implementations !== void 0 ? implementations : {
            objects: [],
            interfaces: []
        };
    }
    isSubType(abstractType, maybeSubType) {
        let map = this._subTypeMap[abstractType.name];
        if (map === undefined) {
            map = Object.create(null);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(abstractType)) {
                for (const type of abstractType.getTypes()){
                    map[type.name] = true;
                }
            } else {
                const implementations = this.getImplementations(abstractType);
                for (const type of implementations.objects){
                    map[type.name] = true;
                }
                for (const type of implementations.interfaces){
                    map[type.name] = true;
                }
            }
            this._subTypeMap[abstractType.name] = map;
        }
        return map[maybeSubType.name] !== undefined;
    }
    getDirectives() {
        return this._directives;
    }
    getDirective(name) {
        return this.getDirectives().find((directive)=>directive.name === name);
    }
    toConfig() {
        return {
            description: this.description,
            query: this.getQueryType(),
            mutation: this.getMutationType(),
            subscription: this.getSubscriptionType(),
            types: Object.values(this.getTypeMap()),
            directives: this.getDirectives(),
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
            assumeValid: this.__validationErrors !== undefined
        };
    }
}
function collectReferencedTypes(type, typeSet) {
    const namedType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNamedType"])(type);
    if (!typeSet.has(namedType)) {
        typeSet.add(namedType);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(namedType)) {
            for (const memberType of namedType.getTypes()){
                collectReferencedTypes(memberType, typeSet);
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(namedType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(namedType)) {
            for (const interfaceType of namedType.getInterfaces()){
                collectReferencedTypes(interfaceType, typeSet);
            }
            for (const field of Object.values(namedType.getFields())){
                collectReferencedTypes(field.type, typeSet);
                for (const arg of field.args){
                    collectReferencedTypes(arg.type, typeSet);
                }
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(namedType)) {
            for (const field of Object.values(namedType.getFields())){
                collectReferencedTypes(field.type, typeSet);
            }
        }
    }
    return typeSet;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/validate.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "assertValidSchema": (()=>assertValidSchema),
    "validateSchema": (()=>validateSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeComparators.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
function validateSchema(schema) {
    // First check to ensure the provided value is in fact a GraphQLSchema.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertSchema"])(schema); // If this Schema has already been validated, return the previous results.
    if (schema.__validationErrors) {
        return schema.__validationErrors;
    } // Validate the schema, producing a list of errors.
    const context = new SchemaValidationContext(schema);
    validateRootTypes(context);
    validateDirectives(context);
    validateTypes(context); // Persist the results of validation before returning to ensure validation
    // does not run multiple times for this schema.
    const errors = context.getErrors();
    schema.__validationErrors = errors;
    return errors;
}
function assertValidSchema(schema) {
    const errors = validateSchema(schema);
    if (errors.length !== 0) {
        throw new Error(errors.map((error)=>error.message).join('\n\n'));
    }
}
class SchemaValidationContext {
    constructor(schema){
        this._errors = [];
        this.schema = schema;
    }
    reportError(message, nodes) {
        const _nodes = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;
        this._errors.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"](message, {
            nodes: _nodes
        }));
    }
    getErrors() {
        return this._errors;
    }
}
function validateRootTypes(context) {
    const schema = context.schema;
    const queryType = schema.getQueryType();
    if (!queryType) {
        context.reportError('Query root type must be provided.', schema.astNode);
    } else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(queryType)) {
        var _getOperationTypeNode;
        context.reportError(`Query root type must be Object type, it cannot be ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(queryType)}.`, (_getOperationTypeNode = getOperationTypeNode(schema, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].QUERY)) !== null && _getOperationTypeNode !== void 0 ? _getOperationTypeNode : queryType.astNode);
    }
    const mutationType = schema.getMutationType();
    if (mutationType && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(mutationType)) {
        var _getOperationTypeNode2;
        context.reportError('Mutation root type must be Object type if provided, it cannot be ' + `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(mutationType)}.`, (_getOperationTypeNode2 = getOperationTypeNode(schema, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].MUTATION)) !== null && _getOperationTypeNode2 !== void 0 ? _getOperationTypeNode2 : mutationType.astNode);
    }
    const subscriptionType = schema.getSubscriptionType();
    if (subscriptionType && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(subscriptionType)) {
        var _getOperationTypeNode3;
        context.reportError('Subscription root type must be Object type if provided, it cannot be ' + `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(subscriptionType)}.`, (_getOperationTypeNode3 = getOperationTypeNode(schema, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationTypeNode"].SUBSCRIPTION)) !== null && _getOperationTypeNode3 !== void 0 ? _getOperationTypeNode3 : subscriptionType.astNode);
    }
}
function getOperationTypeNode(schema, operation) {
    var _flatMap$find;
    return (_flatMap$find = [
        schema.astNode,
        ...schema.extensionASTNodes
    ].flatMap(// FIXME: https://github.com/graphql/graphql-js/issues/2203
    (schemaNode)=>{
        var _schemaNode$operation;
        return /* c8 ignore next */ (_schemaNode$operation = schemaNode === null || schemaNode === void 0 ? void 0 : schemaNode.operationTypes) !== null && _schemaNode$operation !== void 0 ? _schemaNode$operation : [];
    }).find((operationNode)=>operationNode.operation === operation)) === null || _flatMap$find === void 0 ? void 0 : _flatMap$find.type;
}
function validateDirectives(context) {
    for (const directive of context.schema.getDirectives()){
        // Ensure all directives are in fact GraphQL directives.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDirective"])(directive)) {
            context.reportError(`Expected directive but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(directive)}.`, directive === null || directive === void 0 ? void 0 : directive.astNode);
            continue;
        } // Ensure they are named correctly.
        validateName(context, directive); // TODO: Ensure proper locations.
        // Ensure the arguments are valid.
        for (const arg of directive.args){
            // Ensure they are named correctly.
            validateName(context, arg); // Ensure the type is an input type.
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(arg.type)) {
                context.reportError(`The type of @${directive.name}(${arg.name}:) must be Input Type ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(arg.type)}.`, arg.astNode);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredArgument"])(arg) && arg.deprecationReason != null) {
                var _arg$astNode;
                context.reportError(`Required argument @${directive.name}(${arg.name}:) cannot be deprecated.`, [
                    getDeprecatedDirectiveNode(arg.astNode),
                    (_arg$astNode = arg.astNode) === null || _arg$astNode === void 0 ? void 0 : _arg$astNode.type
                ]);
            }
        }
    }
}
function validateName(context, node) {
    // Ensure names are valid, however introspection types opt out.
    if (node.name.startsWith('__')) {
        context.reportError(`Name "${node.name}" must not begin with "__", which is reserved by GraphQL introspection.`, node.astNode);
    }
}
function validateTypes(context) {
    const validateInputObjectCircularRefs = createInputObjectCircularRefsValidator(context);
    const typeMap = context.schema.getTypeMap();
    for (const type of Object.values(typeMap)){
        // Ensure all provided types are in fact GraphQL type.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNamedType"])(type)) {
            context.reportError(`Expected GraphQL named type but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)}.`, type.astNode);
            continue;
        } // Ensure it is named correctly (excluding introspection types).
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIntrospectionType"])(type)) {
            validateName(context, type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
            // Ensure fields are valid
            validateFields(context, type); // Ensure objects implement the interfaces they claim to.
            validateInterfaces(context, type);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
            // Ensure fields are valid.
            validateFields(context, type); // Ensure interfaces implement the interfaces they claim to.
            validateInterfaces(context, type);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
            // Ensure Unions include valid member types.
            validateUnionMembers(context, type);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
            // Ensure Enums have valid values.
            validateEnumValues(context, type);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
            // Ensure Input Object fields are valid.
            validateInputFields(context, type); // Ensure Input Objects do not contain non-nullable circular references
            validateInputObjectCircularRefs(type);
        }
    }
}
function validateFields(context, type) {
    const fields = Object.values(type.getFields()); // Objects and Interfaces both must define one or more fields.
    if (fields.length === 0) {
        context.reportError(`Type ${type.name} must define one or more fields.`, [
            type.astNode,
            ...type.extensionASTNodes
        ]);
    }
    for (const field of fields){
        // Ensure they are named correctly.
        validateName(context, field); // Ensure the type is an output type
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputType"])(field.type)) {
            var _field$astNode;
            context.reportError(`The type of ${type.name}.${field.name} must be Output Type ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(field.type)}.`, (_field$astNode = field.astNode) === null || _field$astNode === void 0 ? void 0 : _field$astNode.type);
        } // Ensure the arguments are valid
        for (const arg of field.args){
            const argName = arg.name; // Ensure they are named correctly.
            validateName(context, arg); // Ensure the type is an input type
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(arg.type)) {
                var _arg$astNode2;
                context.reportError(`The type of ${type.name}.${field.name}(${argName}:) must be Input ` + `Type but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(arg.type)}.`, (_arg$astNode2 = arg.astNode) === null || _arg$astNode2 === void 0 ? void 0 : _arg$astNode2.type);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredArgument"])(arg) && arg.deprecationReason != null) {
                var _arg$astNode3;
                context.reportError(`Required argument ${type.name}.${field.name}(${argName}:) cannot be deprecated.`, [
                    getDeprecatedDirectiveNode(arg.astNode),
                    (_arg$astNode3 = arg.astNode) === null || _arg$astNode3 === void 0 ? void 0 : _arg$astNode3.type
                ]);
            }
        }
    }
}
function validateInterfaces(context, type) {
    const ifaceTypeNames = Object.create(null);
    for (const iface of type.getInterfaces()){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInterfaceType"])(iface)) {
            context.reportError(`Type ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(type)} must only implement Interface types, ` + `it cannot implement ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(iface)}.`, getAllImplementsInterfaceNodes(type, iface));
            continue;
        }
        if (type === iface) {
            context.reportError(`Type ${type.name} cannot implement itself because it would create a circular reference.`, getAllImplementsInterfaceNodes(type, iface));
            continue;
        }
        if (ifaceTypeNames[iface.name]) {
            context.reportError(`Type ${type.name} can only implement ${iface.name} once.`, getAllImplementsInterfaceNodes(type, iface));
            continue;
        }
        ifaceTypeNames[iface.name] = true;
        validateTypeImplementsAncestors(context, type, iface);
        validateTypeImplementsInterface(context, type, iface);
    }
}
function validateTypeImplementsInterface(context, type, iface) {
    const typeFieldMap = type.getFields(); // Assert each interface field is implemented.
    for (const ifaceField of Object.values(iface.getFields())){
        const fieldName = ifaceField.name;
        const typeField = typeFieldMap[fieldName]; // Assert interface field exists on type.
        if (!typeField) {
            context.reportError(`Interface field ${iface.name}.${fieldName} expected but ${type.name} does not provide it.`, [
                ifaceField.astNode,
                type.astNode,
                ...type.extensionASTNodes
            ]);
            continue;
        } // Assert interface field type is satisfied by type field type, by being
        // a valid subtype. (covariant)
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypeSubTypeOf"])(context.schema, typeField.type, ifaceField.type)) {
            var _ifaceField$astNode, _typeField$astNode;
            context.reportError(`Interface field ${iface.name}.${fieldName} expects type ` + `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(ifaceField.type)} but ${type.name}.${fieldName} ` + `is type ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(typeField.type)}.`, [
                (_ifaceField$astNode = ifaceField.astNode) === null || _ifaceField$astNode === void 0 ? void 0 : _ifaceField$astNode.type,
                (_typeField$astNode = typeField.astNode) === null || _typeField$astNode === void 0 ? void 0 : _typeField$astNode.type
            ]);
        } // Assert each interface field arg is implemented.
        for (const ifaceArg of ifaceField.args){
            const argName = ifaceArg.name;
            const typeArg = typeField.args.find((arg)=>arg.name === argName); // Assert interface field arg exists on object field.
            if (!typeArg) {
                context.reportError(`Interface field argument ${iface.name}.${fieldName}(${argName}:) expected but ${type.name}.${fieldName} does not provide it.`, [
                    ifaceArg.astNode,
                    typeField.astNode
                ]);
                continue;
            } // Assert interface field arg type matches object field arg type.
            // (invariant)
            // TODO: change to contravariant?
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEqualType"])(ifaceArg.type, typeArg.type)) {
                var _ifaceArg$astNode, _typeArg$astNode;
                context.reportError(`Interface field argument ${iface.name}.${fieldName}(${argName}:) ` + `expects type ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(ifaceArg.type)} but ` + `${type.name}.${fieldName}(${argName}:) is type ` + `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(typeArg.type)}.`, [
                    (_ifaceArg$astNode = ifaceArg.astNode) === null || _ifaceArg$astNode === void 0 ? void 0 : _ifaceArg$astNode.type,
                    (_typeArg$astNode = typeArg.astNode) === null || _typeArg$astNode === void 0 ? void 0 : _typeArg$astNode.type
                ]);
            } // TODO: validate default values?
        } // Assert additional arguments must not be required.
        for (const typeArg of typeField.args){
            const argName = typeArg.name;
            const ifaceArg = ifaceField.args.find((arg)=>arg.name === argName);
            if (!ifaceArg && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredArgument"])(typeArg)) {
                context.reportError(`Object field ${type.name}.${fieldName} includes required argument ${argName} that is missing from the Interface field ${iface.name}.${fieldName}.`, [
                    typeArg.astNode,
                    ifaceField.astNode
                ]);
            }
        }
    }
}
function validateTypeImplementsAncestors(context, type, iface) {
    const ifaceInterfaces = type.getInterfaces();
    for (const transitive of iface.getInterfaces()){
        if (!ifaceInterfaces.includes(transitive)) {
            context.reportError(transitive === type ? `Type ${type.name} cannot implement ${iface.name} because it would create a circular reference.` : `Type ${type.name} must implement ${transitive.name} because it is implemented by ${iface.name}.`, [
                ...getAllImplementsInterfaceNodes(iface, transitive),
                ...getAllImplementsInterfaceNodes(type, iface)
            ]);
        }
    }
}
function validateUnionMembers(context, union) {
    const memberTypes = union.getTypes();
    if (memberTypes.length === 0) {
        context.reportError(`Union type ${union.name} must define one or more member types.`, [
            union.astNode,
            ...union.extensionASTNodes
        ]);
    }
    const includedTypeNames = Object.create(null);
    for (const memberType of memberTypes){
        if (includedTypeNames[memberType.name]) {
            context.reportError(`Union type ${union.name} can only include type ${memberType.name} once.`, getUnionMemberTypeNodes(union, memberType.name));
            continue;
        }
        includedTypeNames[memberType.name] = true;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectType"])(memberType)) {
            context.reportError(`Union type ${union.name} can only include Object types, ` + `it cannot include ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(memberType)}.`, getUnionMemberTypeNodes(union, String(memberType)));
        }
    }
}
function validateEnumValues(context, enumType) {
    const enumValues = enumType.getValues();
    if (enumValues.length === 0) {
        context.reportError(`Enum type ${enumType.name} must define one or more values.`, [
            enumType.astNode,
            ...enumType.extensionASTNodes
        ]);
    }
    for (const enumValue of enumValues){
        // Ensure valid name.
        validateName(context, enumValue);
    }
}
function validateInputFields(context, inputObj) {
    const fields = Object.values(inputObj.getFields());
    if (fields.length === 0) {
        context.reportError(`Input Object type ${inputObj.name} must define one or more fields.`, [
            inputObj.astNode,
            ...inputObj.extensionASTNodes
        ]);
    } // Ensure the arguments are valid
    for (const field of fields){
        // Ensure they are named correctly.
        validateName(context, field); // Ensure the type is an input type
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputType"])(field.type)) {
            var _field$astNode2;
            context.reportError(`The type of ${inputObj.name}.${field.name} must be Input Type ` + `but got: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspect"])(field.type)}.`, (_field$astNode2 = field.astNode) === null || _field$astNode2 === void 0 ? void 0 : _field$astNode2.type);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRequiredInputField"])(field) && field.deprecationReason != null) {
            var _field$astNode3;
            context.reportError(`Required input field ${inputObj.name}.${field.name} cannot be deprecated.`, [
                getDeprecatedDirectiveNode(field.astNode),
                (_field$astNode3 = field.astNode) === null || _field$astNode3 === void 0 ? void 0 : _field$astNode3.type
            ]);
        }
    }
}
function createInputObjectCircularRefsValidator(context) {
    // Modified copy of algorithm from 'src/validation/rules/NoFragmentCycles.js'.
    // Tracks already visited types to maintain O(N) and to ensure that cycles
    // are not redundantly reported.
    const visitedTypes = Object.create(null); // Array of types nodes used to produce meaningful errors
    const fieldPath = []; // Position in the type path
    const fieldPathIndexByTypeName = Object.create(null);
    return detectCycleRecursive; // This does a straight-forward DFS to find cycles.
    "TURBOPACK unreachable";
    // It does not terminate when a cycle was found but continues to explore
    // the graph to find all possible cycles.
    function detectCycleRecursive(inputObj) {
        if (visitedTypes[inputObj.name]) {
            return;
        }
        visitedTypes[inputObj.name] = true;
        fieldPathIndexByTypeName[inputObj.name] = fieldPath.length;
        const fields = Object.values(inputObj.getFields());
        for (const field of fields){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNonNullType"])(field.type) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInputObjectType"])(field.type.ofType)) {
                const fieldType = field.type.ofType;
                const cycleIndex = fieldPathIndexByTypeName[fieldType.name];
                fieldPath.push(field);
                if (cycleIndex === undefined) {
                    detectCycleRecursive(fieldType);
                } else {
                    const cyclePath = fieldPath.slice(cycleIndex);
                    const pathStr = cyclePath.map((fieldObj)=>fieldObj.name).join('.');
                    context.reportError(`Cannot reference Input Object "${fieldType.name}" within itself through a series of non-null fields: "${pathStr}".`, cyclePath.map((fieldObj)=>fieldObj.astNode));
                }
                fieldPath.pop();
            }
        }
        fieldPathIndexByTypeName[inputObj.name] = undefined;
    }
}
function getAllImplementsInterfaceNodes(type, iface) {
    const { astNode, extensionASTNodes } = type;
    const nodes = astNode != null ? [
        astNode,
        ...extensionASTNodes
    ] : extensionASTNodes; // FIXME: https://github.com/graphql/graphql-js/issues/2203
    return nodes.flatMap((typeNode)=>{
        var _typeNode$interfaces;
        return /* c8 ignore next */ (_typeNode$interfaces = typeNode.interfaces) !== null && _typeNode$interfaces !== void 0 ? _typeNode$interfaces : [];
    }).filter((ifaceNode)=>ifaceNode.name.value === iface.name);
}
function getUnionMemberTypeNodes(union, typeName) {
    const { astNode, extensionASTNodes } = union;
    const nodes = astNode != null ? [
        astNode,
        ...extensionASTNodes
    ] : extensionASTNodes; // FIXME: https://github.com/graphql/graphql-js/issues/2203
    return nodes.flatMap((unionNode)=>{
        var _unionNode$types;
        return /* c8 ignore next */ (_unionNode$types = unionNode.types) !== null && _unionNode$types !== void 0 ? _unionNode$types : [];
    }).filter((typeNode)=>typeNode.name.value === typeName);
}
function getDeprecatedDirectiveNode(definitionNode) {
    var _definitionNode$direc;
    return definitionNode === null || definitionNode === void 0 ? void 0 : (_definitionNode$direc = definitionNode.directives) === null || _definitionNode$direc === void 0 ? void 0 : _definitionNode$direc.find((node)=>node.name.value === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLDeprecatedDirective"].name);
}
}}),
}]);

//# sourceMappingURL=83af6_graphql_type_a0853d._.js.map