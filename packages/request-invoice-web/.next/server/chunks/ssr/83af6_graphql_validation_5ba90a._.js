module.exports = {

"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ExecutableDefinitionsRule": (()=>ExecutableDefinitionsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/predicates.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
function ExecutableDefinitionsRule(context) {
    return {
        Document (node) {
            for (const definition of node.definitions){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isExecutableDefinitionNode"])(definition)) {
                    const defName = definition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION || definition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_EXTENSION ? 'schema' : '"' + definition.name.value + '"';
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`The ${defName} definition is not executable.`, {
                        nodes: definition
                    }));
                }
            }
            return false;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "FieldsOnCorrectTypeRule": (()=>FieldsOnCorrectTypeRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/naturalCompare.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
function FieldsOnCorrectTypeRule(context) {
    return {
        Field (node) {
            const type = context.getParentType();
            if (type) {
                const fieldDef = context.getFieldDef();
                if (!fieldDef) {
                    // This field doesn't exist, lets look for suggestions.
                    const schema = context.getSchema();
                    const fieldName = node.name.value; // First determine if there are any suggested types to condition on.
                    let suggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])('to use an inline fragment on', getSuggestedTypeNames(schema, type, fieldName)); // If there are no suggested types, then perhaps this was a typo?
                    if (suggestion === '') {
                        suggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])(getSuggestedFieldNames(type, fieldName));
                    } // Report an error, including helpful suggestions.
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Cannot query field "${fieldName}" on type "${type.name}".` + suggestion, {
                        nodes: node
                    }));
                }
            }
        }
    };
}
/**
 * Go through all of the implementations of type, as well as the interfaces that
 * they implement. If any of those types include the provided field, suggest them,
 * sorted by how often the type is referenced.
 */ function getSuggestedTypeNames(schema, type, fieldName) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAbstractType"])(type)) {
        // Must be an Object type, which does not have possible fields.
        return [];
    }
    const suggestedTypes = new Set();
    const usageCount = Object.create(null);
    for (const possibleType of schema.getPossibleTypes(type)){
        if (!possibleType.getFields()[fieldName]) {
            continue;
        } // This object type defines this field.
        suggestedTypes.add(possibleType);
        usageCount[possibleType.name] = 1;
        for (const possibleInterface of possibleType.getInterfaces()){
            var _usageCount$possibleI;
            if (!possibleInterface.getFields()[fieldName]) {
                continue;
            } // This interface type defines this field.
            suggestedTypes.add(possibleInterface);
            usageCount[possibleInterface.name] = ((_usageCount$possibleI = usageCount[possibleInterface.name]) !== null && _usageCount$possibleI !== void 0 ? _usageCount$possibleI : 0) + 1;
        }
    }
    return [
        ...suggestedTypes
    ].sort((typeA, typeB)=>{
        // Suggest both interface and object types based on how common they are.
        const usageCountDiff = usageCount[typeB.name] - usageCount[typeA.name];
        if (usageCountDiff !== 0) {
            return usageCountDiff;
        } // Suggest super types first followed by subtypes
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterfaceType"])(typeA) && schema.isSubType(typeA, typeB)) {
            return -1;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterfaceType"])(typeB) && schema.isSubType(typeB, typeA)) {
            return 1;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$naturalCompare$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["naturalCompare"])(typeA.name, typeB.name);
    }).map((x)=>x.name);
}
/**
 * For the field name provided, determine if there are any similar field names
 * that may be the result of a typo.
 */ function getSuggestedFieldNames(type, fieldName) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObjectType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
        const possibleFieldNames = Object.keys(type.getFields());
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestionList"])(fieldName, possibleFieldNames);
    } // Otherwise, must be a Union type, which does not define fields.
    return [];
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "FragmentsOnCompositeTypesRule": (()=>FragmentsOnCompositeTypesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
;
function FragmentsOnCompositeTypesRule(context) {
    return {
        InlineFragment (node) {
            const typeCondition = node.typeCondition;
            if (typeCondition) {
                const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(context.getSchema(), typeCondition);
                if (type && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeType"])(type)) {
                    const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(typeCondition);
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Fragment cannot condition on non composite type "${typeStr}".`, {
                        nodes: typeCondition
                    }));
                }
            }
        },
        FragmentDefinition (node) {
            const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(context.getSchema(), node.typeCondition);
            if (type && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeType"])(type)) {
                const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(node.typeCondition);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Fragment "${node.name.value}" cannot condition on non composite type "${typeStr}".`, {
                    nodes: node.typeCondition
                }));
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownArgumentNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "KnownArgumentNamesOnDirectivesRule": (()=>KnownArgumentNamesOnDirectivesRule),
    "KnownArgumentNamesRule": (()=>KnownArgumentNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
function KnownArgumentNamesRule(context) {
    return {
        // eslint-disable-next-line new-cap
        ...KnownArgumentNamesOnDirectivesRule(context),
        Argument (argNode) {
            const argDef = context.getArgument();
            const fieldDef = context.getFieldDef();
            const parentType = context.getParentType();
            if (!argDef && fieldDef && parentType) {
                const argName = argNode.name.value;
                const knownArgsNames = fieldDef.args.map((arg)=>arg.name);
                const suggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestionList"])(argName, knownArgsNames);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Unknown argument "${argName}" on field "${parentType.name}.${fieldDef.name}".` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])(suggestions), {
                    nodes: argNode
                }));
            }
        }
    };
}
function KnownArgumentNamesOnDirectivesRule(context) {
    const directiveArgs = Object.create(null);
    const schema = context.getSchema();
    const definedDirectives = schema ? schema.getDirectives() : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedDirectives"];
    for (const directive of definedDirectives){
        directiveArgs[directive.name] = directive.args.map((arg)=>arg.name);
    }
    const astDefinitions = context.getDocument().definitions;
    for (const def of astDefinitions){
        if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION) {
            var _def$arguments;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */ const argsNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
            directiveArgs[def.name.value] = argsNodes.map((arg)=>arg.name.value);
        }
    }
    return {
        Directive (directiveNode) {
            const directiveName = directiveNode.name.value;
            const knownArgs = directiveArgs[directiveName];
            if (directiveNode.arguments && knownArgs) {
                for (const argNode of directiveNode.arguments){
                    const argName = argNode.name.value;
                    if (!knownArgs.includes(argName)) {
                        const suggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestionList"])(argName, knownArgs);
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Unknown argument "${argName}" on directive "@${directiveName}".` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])(suggestions), {
                            nodes: argNode
                        }));
                    }
                }
            }
            return false;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownDirectivesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "KnownDirectivesRule": (()=>KnownDirectivesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/directiveLocation.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function KnownDirectivesRule(context) {
    const locationsMap = Object.create(null);
    const schema = context.getSchema();
    const definedDirectives = schema ? schema.getDirectives() : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedDirectives"];
    for (const directive of definedDirectives){
        locationsMap[directive.name] = directive.locations;
    }
    const astDefinitions = context.getDocument().definitions;
    for (const def of astDefinitions){
        if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION) {
            locationsMap[def.name.value] = def.locations.map((name)=>name.value);
        }
    }
    return {
        Directive (node, _key, _parent, _path, ancestors) {
            const name = node.name.value;
            const locations = locationsMap[name];
            if (!locations) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Unknown directive "@${name}".`, {
                    nodes: node
                }));
                return;
            }
            const candidateLocation = getDirectiveLocationForASTPath(ancestors);
            if (candidateLocation && !locations.includes(candidateLocation)) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Directive "@${name}" may not be used on ${candidateLocation}.`, {
                    nodes: node
                }));
            }
        }
    };
}
function getDirectiveLocationForASTPath(ancestors) {
    const appliedTo = ancestors[ancestors.length - 1];
    'kind' in appliedTo || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false);
    switch(appliedTo.kind){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION:
            return getDirectiveLocationForOperation(appliedTo.operation);
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FIELD:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_SPREAD:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].FRAGMENT_SPREAD;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INLINE_FRAGMENT:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].INLINE_FRAGMENT;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].FRAGMENT_DEFINITION;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].VARIABLE_DEFINITION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].VARIABLE_DEFINITION;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].SCHEMA;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].SCALAR;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].OBJECT;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FIELD_DEFINITION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].FIELD_DEFINITION;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].INTERFACE;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].UNION;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].ENUM;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_VALUE_DEFINITION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].ENUM_VALUE;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_DEFINITION:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_EXTENSION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].INPUT_OBJECT;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_VALUE_DEFINITION:
            {
                const parentNode = ancestors[ancestors.length - 3];
                'kind' in parentNode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false);
                return parentNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_DEFINITION ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].INPUT_FIELD_DEFINITION : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].ARGUMENT_DEFINITION;
            }
        // Not reachable, all possible types have been considered.
        /* c8 ignore next */ default:
            false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected kind: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(appliedTo.kind));
    }
}
function getDirectiveLocationForOperation(operation) {
    switch(operation){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationTypeNode"].QUERY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].QUERY;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationTypeNode"].MUTATION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].MUTATION;
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$ast$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationTypeNode"].SUBSCRIPTION:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$directiveLocation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectiveLocation"].SUBSCRIPTION;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownFragmentNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "KnownFragmentNamesRule": (()=>KnownFragmentNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function KnownFragmentNamesRule(context) {
    return {
        FragmentSpread (node) {
            const fragmentName = node.name.value;
            const fragment = context.getFragment(fragmentName);
            if (!fragment) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Unknown fragment "${fragmentName}".`, {
                    nodes: node.name
                }));
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownTypeNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "KnownTypeNamesRule": (()=>KnownTypeNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/predicates.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/scalars.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
function KnownTypeNamesRule(context) {
    const schema = context.getSchema();
    const existingTypesMap = schema ? schema.getTypeMap() : Object.create(null);
    const definedTypes = Object.create(null);
    for (const def of context.getDocument().definitions){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeDefinitionNode"])(def)) {
            definedTypes[def.name.value] = true;
        }
    }
    const typeNames = [
        ...Object.keys(existingTypesMap),
        ...Object.keys(definedTypes)
    ];
    return {
        NamedType (node, _1, parent, _2, ancestors) {
            const typeName = node.name.value;
            if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
                var _ancestors$;
                const definitionNode = (_ancestors$ = ancestors[2]) !== null && _ancestors$ !== void 0 ? _ancestors$ : parent;
                const isSDL = definitionNode != null && isSDLNode(definitionNode);
                if (isSDL && standardTypeNames.includes(typeName)) {
                    return;
                }
                const suggestedTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestionList"])(typeName, isSDL ? standardTypeNames.concat(typeNames) : typeNames);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Unknown type "${typeName}".` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])(suggestedTypes), {
                    nodes: node
                }));
            }
        }
    };
}
const standardTypeNames = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$scalars$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedScalarTypes"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["introspectionTypes"]
].map((type)=>type.name);
function isSDLNode(value) {
    return 'kind' in value && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeSystemDefinitionNode"])(value) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeSystemExtensionNode"])(value));
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/LoneAnonymousOperationRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "LoneAnonymousOperationRule": (()=>LoneAnonymousOperationRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
function LoneAnonymousOperationRule(context) {
    let operationCount = 0;
    return {
        Document (node) {
            operationCount = node.definitions.filter((definition)=>definition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OPERATION_DEFINITION).length;
        },
        OperationDefinition (node) {
            if (!node.name && operationCount > 1) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"]('This anonymous operation must be the only defined operation.', {
                    nodes: node
                }));
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "LoneSchemaDefinitionRule": (()=>LoneSchemaDefinitionRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function LoneSchemaDefinitionRule(context) {
    var _ref, _ref2, _oldSchema$astNode;
    const oldSchema = context.getSchema();
    const alreadyDefined = (_ref = (_ref2 = (_oldSchema$astNode = oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.astNode) !== null && _oldSchema$astNode !== void 0 ? _oldSchema$astNode : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getQueryType()) !== null && _ref2 !== void 0 ? _ref2 : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getMutationType()) !== null && _ref !== void 0 ? _ref : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getSubscriptionType();
    let schemaDefinitionsCount = 0;
    return {
        SchemaDefinition (node) {
            if (alreadyDefined) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"]('Cannot define a new schema within a schema extension.', {
                    nodes: node
                }));
                return;
            }
            if (schemaDefinitionsCount > 0) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"]('Must provide only one schema definition.', {
                    nodes: node
                }));
            }
            ++schemaDefinitionsCount;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/custom/NoDeprecatedCustomRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NoDeprecatedCustomRule": (()=>NoDeprecatedCustomRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
;
;
;
function NoDeprecatedCustomRule(context) {
    return {
        Field (node) {
            const fieldDef = context.getFieldDef();
            const deprecationReason = fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.deprecationReason;
            if (fieldDef && deprecationReason != null) {
                const parentType = context.getParentType();
                parentType != null || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`The field ${parentType.name}.${fieldDef.name} is deprecated. ${deprecationReason}`, {
                    nodes: node
                }));
            }
        },
        Argument (node) {
            const argDef = context.getArgument();
            const deprecationReason = argDef === null || argDef === void 0 ? void 0 : argDef.deprecationReason;
            if (argDef && deprecationReason != null) {
                const directiveDef = context.getDirective();
                if (directiveDef != null) {
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Directive "@${directiveDef.name}" argument "${argDef.name}" is deprecated. ${deprecationReason}`, {
                        nodes: node
                    }));
                } else {
                    const parentType = context.getParentType();
                    const fieldDef = context.getFieldDef();
                    parentType != null && fieldDef != null || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false);
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${parentType.name}.${fieldDef.name}" argument "${argDef.name}" is deprecated. ${deprecationReason}`, {
                        nodes: node
                    }));
                }
            }
        },
        ObjectField (node) {
            const inputObjectDef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(context.getParentInputType());
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputObjectType"])(inputObjectDef)) {
                const inputFieldDef = inputObjectDef.getFields()[node.name.value];
                const deprecationReason = inputFieldDef === null || inputFieldDef === void 0 ? void 0 : inputFieldDef.deprecationReason;
                if (deprecationReason != null) {
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`The input field ${inputObjectDef.name}.${inputFieldDef.name} is deprecated. ${deprecationReason}`, {
                        nodes: node
                    }));
                }
            }
        },
        EnumValue (node) {
            const enumValueDef = context.getEnumValue();
            const deprecationReason = enumValueDef === null || enumValueDef === void 0 ? void 0 : enumValueDef.deprecationReason;
            if (enumValueDef && deprecationReason != null) {
                const enumTypeDef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(context.getInputType());
                enumTypeDef != null || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`The enum value "${enumTypeDef.name}.${enumValueDef.name}" is deprecated. ${deprecationReason}`, {
                    nodes: node
                }));
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoFragmentCyclesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NoFragmentCyclesRule": (()=>NoFragmentCyclesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function NoFragmentCyclesRule(context) {
    // Tracks already visited fragments to maintain O(N) and to ensure that cycles
    // are not redundantly reported.
    const visitedFrags = Object.create(null); // Array of AST nodes used to produce meaningful errors
    const spreadPath = []; // Position in the spread path
    const spreadPathIndexByName = Object.create(null);
    return {
        OperationDefinition: ()=>false,
        FragmentDefinition (node) {
            detectCycleRecursive(node);
            return false;
        }
    }; // This does a straight-forward DFS to find cycles.
    "TURBOPACK unreachable";
    // It does not terminate when a cycle was found but continues to explore
    // the graph to find all possible cycles.
    function detectCycleRecursive(fragment) {
        if (visitedFrags[fragment.name.value]) {
            return;
        }
        const fragmentName = fragment.name.value;
        visitedFrags[fragmentName] = true;
        const spreadNodes = context.getFragmentSpreads(fragment.selectionSet);
        if (spreadNodes.length === 0) {
            return;
        }
        spreadPathIndexByName[fragmentName] = spreadPath.length;
        for (const spreadNode of spreadNodes){
            const spreadName = spreadNode.name.value;
            const cycleIndex = spreadPathIndexByName[spreadName];
            spreadPath.push(spreadNode);
            if (cycleIndex === undefined) {
                const spreadFragment = context.getFragment(spreadName);
                if (spreadFragment) {
                    detectCycleRecursive(spreadFragment);
                }
            } else {
                const cyclePath = spreadPath.slice(cycleIndex);
                const viaPath = cyclePath.slice(0, -1).map((s)=>'"' + s.name.value + '"').join(', ');
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Cannot spread fragment "${spreadName}" within itself` + (viaPath !== '' ? ` via ${viaPath}.` : '.'), {
                    nodes: cyclePath
                }));
            }
            spreadPath.pop();
        }
        spreadPathIndexByName[fragmentName] = undefined;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/custom/NoSchemaIntrospectionCustomRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NoSchemaIntrospectionCustomRule": (()=>NoSchemaIntrospectionCustomRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/introspection.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
function NoSchemaIntrospectionCustomRule(context) {
    return {
        Field (node) {
            const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(context.getType());
            if (type && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$introspection$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIntrospectionType"])(type)) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`GraphQL introspection has been disabled, but the requested query contained the field "${node.name.value}".`, {
                    nodes: node
                }));
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUndefinedVariablesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NoUndefinedVariablesRule": (()=>NoUndefinedVariablesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function NoUndefinedVariablesRule(context) {
    let variableNameDefined = Object.create(null);
    return {
        OperationDefinition: {
            enter () {
                variableNameDefined = Object.create(null);
            },
            leave (operation) {
                const usages = context.getRecursiveVariableUsages(operation);
                for (const { node } of usages){
                    const varName = node.name.value;
                    if (variableNameDefined[varName] !== true) {
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](operation.name ? `Variable "$${varName}" is not defined by operation "${operation.name.value}".` : `Variable "$${varName}" is not defined.`, {
                            nodes: [
                                node,
                                operation
                            ]
                        }));
                    }
                }
            }
        },
        VariableDefinition (node) {
            variableNameDefined[node.variable.name.value] = true;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUnusedFragmentsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NoUnusedFragmentsRule": (()=>NoUnusedFragmentsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function NoUnusedFragmentsRule(context) {
    const operationDefs = [];
    const fragmentDefs = [];
    return {
        OperationDefinition (node) {
            operationDefs.push(node);
            return false;
        },
        FragmentDefinition (node) {
            fragmentDefs.push(node);
            return false;
        },
        Document: {
            leave () {
                const fragmentNameUsed = Object.create(null);
                for (const operation of operationDefs){
                    for (const fragment of context.getRecursivelyReferencedFragments(operation)){
                        fragmentNameUsed[fragment.name.value] = true;
                    }
                }
                for (const fragmentDef of fragmentDefs){
                    const fragName = fragmentDef.name.value;
                    if (fragmentNameUsed[fragName] !== true) {
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Fragment "${fragName}" is never used.`, {
                            nodes: fragmentDef
                        }));
                    }
                }
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUnusedVariablesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NoUnusedVariablesRule": (()=>NoUnusedVariablesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function NoUnusedVariablesRule(context) {
    let variableDefs = [];
    return {
        OperationDefinition: {
            enter () {
                variableDefs = [];
            },
            leave (operation) {
                const variableNameUsed = Object.create(null);
                const usages = context.getRecursiveVariableUsages(operation);
                for (const { node } of usages){
                    variableNameUsed[node.name.value] = true;
                }
                for (const variableDef of variableDefs){
                    const variableName = variableDef.variable.name.value;
                    if (variableNameUsed[variableName] !== true) {
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](operation.name ? `Variable "$${variableName}" is never used in operation "${operation.name.value}".` : `Variable "$${variableName}" is never used.`, {
                            nodes: variableDef
                        }));
                    }
                }
            }
        },
        VariableDefinition (def) {
            variableDefs.push(def);
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "OverlappingFieldsCanBeMergedRule": (()=>OverlappingFieldsCanBeMergedRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$sortValueNode$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/sortValueNode.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function reasonMessage(reason) {
    if (Array.isArray(reason)) {
        return reason.map(([responseName, subReason])=>`subfields "${responseName}" conflict because ` + reasonMessage(subReason)).join(' and ');
    }
    return reason;
}
function OverlappingFieldsCanBeMergedRule(context) {
    // A memoization for when two fragments are compared "between" each other for
    // conflicts. Two fragments may be compared many times, so memoizing this can
    // dramatically improve the performance of this validator.
    const comparedFragmentPairs = new PairSet(); // A cache for the "field map" and list of fragment names found in any given
    // selection set. Selection sets may be asked for this information multiple
    // times, so this improves the performance of this validator.
    const cachedFieldsAndFragmentNames = new Map();
    return {
        SelectionSet (selectionSet) {
            const conflicts = findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, context.getParentType(), selectionSet);
            for (const [[responseName, reason], fields1, fields2] of conflicts){
                const reasonMsg = reasonMessage(reason);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Fields "${responseName}" conflict because ${reasonMsg}. Use different aliases on the fields to fetch both if this was intentional.`, {
                    nodes: fields1.concat(fields2)
                }));
            }
        }
    };
}
/**
 * Algorithm:
 *
 * Conflicts occur when two fields exist in a query which will produce the same
 * response name, but represent differing values, thus creating a conflict.
 * The algorithm below finds all conflicts via making a series of comparisons
 * between fields. In order to compare as few fields as possible, this makes
 * a series of comparisons "within" sets of fields and "between" sets of fields.
 *
 * Given any selection set, a collection produces both a set of fields by
 * also including all inline fragments, as well as a list of fragments
 * referenced by fragment spreads.
 *
 * A) Each selection set represented in the document first compares "within" its
 * collected set of fields, finding any conflicts between every pair of
 * overlapping fields.
 * Note: This is the *only time* that a the fields "within" a set are compared
 * to each other. After this only fields "between" sets are compared.
 *
 * B) Also, if any fragment is referenced in a selection set, then a
 * comparison is made "between" the original set of fields and the
 * referenced fragment.
 *
 * C) Also, if multiple fragments are referenced, then comparisons
 * are made "between" each referenced fragment.
 *
 * D) When comparing "between" a set of fields and a referenced fragment, first
 * a comparison is made between each field in the original set of fields and
 * each field in the the referenced set of fields.
 *
 * E) Also, if any fragment is referenced in the referenced selection set,
 * then a comparison is made "between" the original set of fields and the
 * referenced fragment (recursively referring to step D).
 *
 * F) When comparing "between" two fragments, first a comparison is made between
 * each field in the first referenced set of fields and each field in the the
 * second referenced set of fields.
 *
 * G) Also, any fragments referenced by the first must be compared to the
 * second, and any fragments referenced by the second must be compared to the
 * first (recursively referring to step F).
 *
 * H) When comparing two fields, if both have selection sets, then a comparison
 * is made "between" both selection sets, first comparing the set of fields in
 * the first selection set with the set of fields in the second.
 *
 * I) Also, if any fragment is referenced in either selection set, then a
 * comparison is made "between" the other set of fields and the
 * referenced fragment.
 *
 * J) Also, if two fragments are referenced in both selection sets, then a
 * comparison is made "between" the two fragments.
 *
 */ // Find all conflicts found "within" a selection set, including those found
// via spreading in fragments. Called when visiting each SelectionSet in the
// GraphQL Document.
function findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentType, selectionSet) {
    const conflicts = [];
    const [fieldMap, fragmentNames] = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet); // (A) Find find all conflicts "within" the fields of this selection set.
    // Note: this is the *only place* `collectConflictsWithin` is called.
    collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, fieldMap);
    if (fragmentNames.length !== 0) {
        // (B) Then collect conflicts between these fields and those represented by
        // each spread fragment name found.
        for(let i = 0; i < fragmentNames.length; i++){
            collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, false, fieldMap, fragmentNames[i]); // (C) Then compare this fragment with all other fragments found in this
            // selection set to collect conflicts between fragments spread together.
            // This compares each item in the list of fragment names to every other
            // item in that same list (except for itself).
            for(let j = i + 1; j < fragmentNames.length; j++){
                collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, false, fragmentNames[i], fragmentNames[j]);
            }
        }
    }
    return conflicts;
} // Collect all conflicts found between a set of fields and a fragment reference
// including via spreading in any nested fragments.
function collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fragmentName) {
    const fragment = context.getFragment(fragmentName);
    if (!fragment) {
        return;
    }
    const [fieldMap2, referencedFragmentNames] = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment); // Do not compare a fragment's fieldMap to itself.
    if (fieldMap === fieldMap2) {
        return;
    } // (D) First collect any conflicts between the provided collection of fields
    // and the collection of fields represented by the given fragment.
    collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fieldMap2); // (E) Then collect any conflicts between the provided collection of fields
    // and any fragment names found in the given fragment.
    for (const referencedFragmentName of referencedFragmentNames){
        // Memoize so two fragments are not compared for conflicts more than once.
        if (comparedFragmentPairs.has(referencedFragmentName, fragmentName, areMutuallyExclusive)) {
            continue;
        }
        comparedFragmentPairs.add(referencedFragmentName, fragmentName, areMutuallyExclusive);
        collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap, referencedFragmentName);
    }
} // Collect all conflicts found between two fragments, including via spreading in
// any nested fragments.
function collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentName2) {
    // No need to compare a fragment to itself.
    if (fragmentName1 === fragmentName2) {
        return;
    } // Memoize so two fragments are not compared for conflicts more than once.
    if (comparedFragmentPairs.has(fragmentName1, fragmentName2, areMutuallyExclusive)) {
        return;
    }
    comparedFragmentPairs.add(fragmentName1, fragmentName2, areMutuallyExclusive);
    const fragment1 = context.getFragment(fragmentName1);
    const fragment2 = context.getFragment(fragmentName2);
    if (!fragment1 || !fragment2) {
        return;
    }
    const [fieldMap1, referencedFragmentNames1] = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment1);
    const [fieldMap2, referencedFragmentNames2] = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment2); // (F) First, collect all conflicts between these two collections of fields
    // (not including any nested fragments).
    collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap1, fieldMap2); // (G) Then collect conflicts between the first fragment and any nested
    // fragments spread in the second fragment.
    for (const referencedFragmentName2 of referencedFragmentNames2){
        collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, referencedFragmentName2);
    } // (G) Then collect conflicts between the second fragment and any nested
    // fragments spread in the first fragment.
    for (const referencedFragmentName1 of referencedFragmentNames1){
        collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, referencedFragmentName1, fragmentName2);
    }
} // Find all conflicts found between two selection sets, including those found
// via spreading in fragments. Called when determining if conflicts exist
// between the sub-fields of two overlapping fields.
function findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, parentType1, selectionSet1, parentType2, selectionSet2) {
    const conflicts = [];
    const [fieldMap1, fragmentNames1] = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType1, selectionSet1);
    const [fieldMap2, fragmentNames2] = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType2, selectionSet2); // (H) First, collect all conflicts between these two collections of field.
    collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap1, fieldMap2); // (I) Then collect conflicts between the first collection of fields and
    // those referenced by each fragment name associated with the second.
    for (const fragmentName2 of fragmentNames2){
        collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap1, fragmentName2);
    } // (I) Then collect conflicts between the second collection of fields and
    // those referenced by each fragment name associated with the first.
    for (const fragmentName1 of fragmentNames1){
        collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap2, fragmentName1);
    } // (J) Also collect conflicts between any fragment names by the first and
    // fragment names by the second. This compares each item in the first set of
    // names to each item in the second set of names.
    for (const fragmentName1 of fragmentNames1){
        for (const fragmentName2 of fragmentNames2){
            collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentName2);
        }
    }
    return conflicts;
} // Collect all Conflicts "within" one collection of fields.
function collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, fieldMap) {
    // A field map is a keyed collection, where each key represents a response
    // name and the value at that key is a list of all fields which provide that
    // response name. For every response name, if there are multiple fields, they
    // must be compared to find a potential conflict.
    for (const [responseName, fields] of Object.entries(fieldMap)){
        // This compares every field in the list to every other field in this list
        // (except to itself). If the list only has one item, nothing needs to
        // be compared.
        if (fields.length > 1) {
            for(let i = 0; i < fields.length; i++){
                for(let j = i + 1; j < fields.length; j++){
                    const conflict = findConflict(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, false, responseName, fields[i], fields[j]);
                    if (conflict) {
                        conflicts.push(conflict);
                    }
                }
            }
        }
    }
} // Collect all Conflicts between two collections of fields. This is similar to,
// but different from the `collectConflictsWithin` function above. This check
// assumes that `collectConflictsWithin` has already been called on each
// provided collection of fields. This is true because this validator traverses
// each individual selection set.
function collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, fieldMap1, fieldMap2) {
    // A field map is a keyed collection, where each key represents a response
    // name and the value at that key is a list of all fields which provide that
    // response name. For any response name which appears in both provided field
    // maps, each field from the first field map must be compared to every field
    // in the second field map to find potential conflicts.
    for (const [responseName, fields1] of Object.entries(fieldMap1)){
        const fields2 = fieldMap2[responseName];
        if (fields2) {
            for (const field1 of fields1){
                for (const field2 of fields2){
                    const conflict = findConflict(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, field1, field2);
                    if (conflict) {
                        conflicts.push(conflict);
                    }
                }
            }
        }
    }
} // Determines if there is a conflict between two particular fields, including
// comparing their sub-fields.
function findConflict(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, field1, field2) {
    const [parentType1, node1, def1] = field1;
    const [parentType2, node2, def2] = field2; // If it is known that two fields could not possibly apply at the same
    // time, due to the parent types, then it is safe to permit them to diverge
    // in aliased field or arguments used as they will not present any ambiguity
    // by differing.
    // It is known that two parent types could never overlap if they are
    // different Object types. Interface or Union types might overlap - if not
    // in the current state of the schema, then perhaps in some future version,
    // thus may not safely diverge.
    const areMutuallyExclusive = parentFieldsAreMutuallyExclusive || parentType1 !== parentType2 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObjectType"])(parentType1) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObjectType"])(parentType2);
    if (!areMutuallyExclusive) {
        // Two aliases must refer to the same field.
        const name1 = node1.name.value;
        const name2 = node2.name.value;
        if (name1 !== name2) {
            return [
                [
                    responseName,
                    `"${name1}" and "${name2}" are different fields`
                ],
                [
                    node1
                ],
                [
                    node2
                ]
            ];
        } // Two field calls must have the same arguments.
        if (!sameArguments(node1, node2)) {
            return [
                [
                    responseName,
                    'they have differing arguments'
                ],
                [
                    node1
                ],
                [
                    node2
                ]
            ];
        }
    } // The return type for each field.
    const type1 = def1 === null || def1 === void 0 ? void 0 : def1.type;
    const type2 = def2 === null || def2 === void 0 ? void 0 : def2.type;
    if (type1 && type2 && doTypesConflict(type1, type2)) {
        return [
            [
                responseName,
                `they return conflicting types "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type1)}" and "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type2)}"`
            ],
            [
                node1
            ],
            [
                node2
            ]
        ];
    } // Collect and compare sub-fields. Use the same "visited fragment names" list
    // for both collections so fields in a fragment reference are never
    // compared to themselves.
    const selectionSet1 = node1.selectionSet;
    const selectionSet2 = node2.selectionSet;
    if (selectionSet1 && selectionSet2) {
        const conflicts = findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(type1), selectionSet1, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(type2), selectionSet2);
        return subfieldConflicts(conflicts, responseName, node1, node2);
    }
}
function sameArguments(node1, node2) {
    const args1 = node1.arguments;
    const args2 = node2.arguments;
    if (args1 === undefined || args1.length === 0) {
        return args2 === undefined || args2.length === 0;
    }
    if (args2 === undefined || args2.length === 0) {
        return false;
    }
    /* c8 ignore next */ if (args1.length !== args2.length) {
        /* c8 ignore next */ return false;
    /* c8 ignore next */ }
    const values2 = new Map(args2.map(({ name, value })=>[
            name.value,
            value
        ]));
    return args1.every((arg1)=>{
        const value1 = arg1.value;
        const value2 = values2.get(arg1.name.value);
        if (value2 === undefined) {
            return false;
        }
        return stringifyValue(value1) === stringifyValue(value2);
    });
}
function stringifyValue(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$sortValueNode$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sortValueNode"])(value));
} // Two types conflict if both types could not apply to a value simultaneously.
// Composite types are ignored as their individual field types will be compared
// later recursively. However List and Non-Null types must match.
function doTypesConflict(type1, type2) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isListType"])(type1)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isListType"])(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isListType"])(type2)) {
        return true;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNonNullType"])(type1)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNonNullType"])(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNonNullType"])(type2)) {
        return true;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLeafType"])(type1) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLeafType"])(type2)) {
        return type1 !== type2;
    }
    return false;
} // Given a selection set, return the collection of fields (a mapping of response
// name to field nodes and definitions) as well as a list of fragment names
// referenced via fragment spreads.
function getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet) {
    const cached = cachedFieldsAndFragmentNames.get(selectionSet);
    if (cached) {
        return cached;
    }
    const nodeAndDefs = Object.create(null);
    const fragmentNames = Object.create(null);
    _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames);
    const result = [
        nodeAndDefs,
        Object.keys(fragmentNames)
    ];
    cachedFieldsAndFragmentNames.set(selectionSet, result);
    return result;
} // Given a reference to a fragment, return the represented collection of fields
// as well as a list of nested fragment names referenced via fragment spreads.
function getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment) {
    // Short-circuit building a type from the node if possible.
    const cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);
    if (cached) {
        return cached;
    }
    const fragmentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(context.getSchema(), fragment.typeCondition);
    return getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragmentType, fragment.selectionSet);
}
function _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames) {
    for (const selection of selectionSet.selections){
        switch(selection.kind){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FIELD:
                {
                    const fieldName = selection.name.value;
                    let fieldDef;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObjectType"])(parentType) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterfaceType"])(parentType)) {
                        fieldDef = parentType.getFields()[fieldName];
                    }
                    const responseName = selection.alias ? selection.alias.value : fieldName;
                    if (!nodeAndDefs[responseName]) {
                        nodeAndDefs[responseName] = [];
                    }
                    nodeAndDefs[responseName].push([
                        parentType,
                        selection,
                        fieldDef
                    ]);
                    break;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_SPREAD:
                fragmentNames[selection.name.value] = true;
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INLINE_FRAGMENT:
                {
                    const typeCondition = selection.typeCondition;
                    const inlineFragmentType = typeCondition ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(context.getSchema(), typeCondition) : parentType;
                    _collectFieldsAndFragmentNames(context, inlineFragmentType, selection.selectionSet, nodeAndDefs, fragmentNames);
                    break;
                }
        }
    }
} // Given a series of Conflicts which occurred between two sub-fields, generate
// a single Conflict.
function subfieldConflicts(conflicts, responseName, node1, node2) {
    if (conflicts.length > 0) {
        return [
            [
                responseName,
                conflicts.map(([reason])=>reason)
            ],
            [
                node1,
                ...conflicts.map(([, fields1])=>fields1).flat()
            ],
            [
                node2,
                ...conflicts.map(([, , fields2])=>fields2).flat()
            ]
        ];
    }
}
/**
 * A way to keep track of pairs of things when the ordering of the pair does not matter.
 */ class PairSet {
    constructor(){
        this._data = new Map();
    }
    has(a, b, areMutuallyExclusive) {
        var _this$_data$get;
        const [key1, key2] = a < b ? [
            a,
            b
        ] : [
            b,
            a
        ];
        const result = (_this$_data$get = this._data.get(key1)) === null || _this$_data$get === void 0 ? void 0 : _this$_data$get.get(key2);
        if (result === undefined) {
            return false;
        } // areMutuallyExclusive being false is a superset of being true, hence if
        // we want to know if this PairSet "has" these two with no exclusivity,
        // we have to ensure it was added as such.
        return areMutuallyExclusive ? true : areMutuallyExclusive === result;
    }
    add(a, b, areMutuallyExclusive) {
        const [key1, key2] = a < b ? [
            a,
            b
        ] : [
            b,
            a
        ];
        const map = this._data.get(key1);
        if (map === undefined) {
            this._data.set(key1, new Map([
                [
                    key2,
                    areMutuallyExclusive
                ]
            ]));
        } else {
            map.set(key2, areMutuallyExclusive);
        }
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "PossibleFragmentSpreadsRule": (()=>PossibleFragmentSpreadsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeComparators.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
function PossibleFragmentSpreadsRule(context) {
    return {
        InlineFragment (node) {
            const fragType = context.getType();
            const parentType = context.getParentType();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeType"])(fragType) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeType"])(parentType) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doTypesOverlap"])(context.getSchema(), fragType, parentType)) {
                const parentTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(parentType);
                const fragTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(fragType);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Fragment cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`, {
                    nodes: node
                }));
            }
        },
        FragmentSpread (node) {
            const fragName = node.name.value;
            const fragType = getFragmentType(context, fragName);
            const parentType = context.getParentType();
            if (fragType && parentType && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doTypesOverlap"])(context.getSchema(), fragType, parentType)) {
                const parentTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(parentType);
                const fragTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(fragType);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Fragment "${fragName}" cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`, {
                    nodes: node
                }));
            }
        }
    };
}
function getFragmentType(context, name) {
    const frag = context.getFragment(name);
    if (frag) {
        const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(context.getSchema(), frag.typeCondition);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeType"])(type)) {
            return type;
        }
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "PossibleTypeExtensionsRule": (()=>PossibleTypeExtensionsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/predicates.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
function PossibleTypeExtensionsRule(context) {
    const schema = context.getSchema();
    const definedTypes = Object.create(null);
    for (const def of context.getDocument().definitions){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeDefinitionNode"])(def)) {
            definedTypes[def.name.value] = def;
        }
    }
    return {
        ScalarTypeExtension: checkExtension,
        ObjectTypeExtension: checkExtension,
        InterfaceTypeExtension: checkExtension,
        UnionTypeExtension: checkExtension,
        EnumTypeExtension: checkExtension,
        InputObjectTypeExtension: checkExtension
    };
    "TURBOPACK unreachable";
    function checkExtension(node) {
        const typeName = node.name.value;
        const defNode = definedTypes[typeName];
        const existingType = schema === null || schema === void 0 ? void 0 : schema.getType(typeName);
        let expectedKind;
        if (defNode) {
            expectedKind = defKindToExtKind[defNode.kind];
        } else if (existingType) {
            expectedKind = typeToExtKind(existingType);
        }
        if (expectedKind) {
            if (expectedKind !== node.kind) {
                const kindStr = extensionKindToTypeName(node.kind);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Cannot extend non-${kindStr} type "${typeName}".`, {
                    nodes: defNode ? [
                        defNode,
                        node
                    ] : node
                }));
            }
        } else {
            const allTypeNames = Object.keys({
                ...definedTypes,
                ...schema === null || schema === void 0 ? void 0 : schema.getTypeMap()
            });
            const suggestedTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestionList"])(typeName, allTypeNames);
            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Cannot extend type "${typeName}" because it is not defined.` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])(suggestedTypes), {
                nodes: node.name
            }));
        }
    }
}
const defKindToExtKind = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_DEFINITION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_EXTENSION,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_DEFINITION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_EXTENSION,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_DEFINITION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_EXTENSION,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_DEFINITION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_EXTENSION,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_DEFINITION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_EXTENSION,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_DEFINITION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_EXTENSION
};
function typeToExtKind(type) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isScalarType"])(type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_EXTENSION;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObjectType"])(type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_EXTENSION;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterfaceType"])(type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_EXTENSION;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isUnionType"])(type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_EXTENSION;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isEnumType"])(type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_EXTENSION;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_EXTENSION;
    }
    /* c8 ignore next 3 */ // Not reachable. All possible types have been considered
    false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected type: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type));
}
function extensionKindToTypeName(kind) {
    switch(kind){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_EXTENSION:
            return 'scalar';
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_EXTENSION:
            return 'object';
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_EXTENSION:
            return 'interface';
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_EXTENSION:
            return 'union';
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_EXTENSION:
            return 'enum';
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_EXTENSION:
            return 'input object';
        // Not reachable. All possible types have been considered
        /* c8 ignore next */ default:
            false || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false, 'Unexpected kind: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(kind));
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ProvidedRequiredArgumentsOnDirectivesRule": (()=>ProvidedRequiredArgumentsOnDirectivesRule),
    "ProvidedRequiredArgumentsRule": (()=>ProvidedRequiredArgumentsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function ProvidedRequiredArgumentsRule(context) {
    return {
        // eslint-disable-next-line new-cap
        ...ProvidedRequiredArgumentsOnDirectivesRule(context),
        Field: {
            // Validate on leave to allow for deeper errors to appear first.
            leave (fieldNode) {
                var _fieldNode$arguments;
                const fieldDef = context.getFieldDef();
                if (!fieldDef) {
                    return false;
                }
                const providedArgs = new Set(/* c8 ignore next */ (_fieldNode$arguments = fieldNode.arguments) === null || _fieldNode$arguments === void 0 ? void 0 : _fieldNode$arguments.map((arg)=>arg.name.value));
                for (const argDef of fieldDef.args){
                    if (!providedArgs.has(argDef.name) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRequiredArgument"])(argDef)) {
                        const argTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(argDef.type);
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${fieldDef.name}" argument "${argDef.name}" of type "${argTypeStr}" is required, but it was not provided.`, {
                            nodes: fieldNode
                        }));
                    }
                }
            }
        }
    };
}
function ProvidedRequiredArgumentsOnDirectivesRule(context) {
    var _schema$getDirectives;
    const requiredArgsMap = Object.create(null);
    const schema = context.getSchema();
    const definedDirectives = (_schema$getDirectives = schema === null || schema === void 0 ? void 0 : schema.getDirectives()) !== null && _schema$getDirectives !== void 0 ? _schema$getDirectives : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedDirectives"];
    for (const directive of definedDirectives){
        requiredArgsMap[directive.name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyMap"])(directive.args.filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRequiredArgument"]), (arg)=>arg.name);
    }
    const astDefinitions = context.getDocument().definitions;
    for (const def of astDefinitions){
        if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION) {
            var _def$arguments;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */ const argNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
            requiredArgsMap[def.name.value] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyMap"])(argNodes.filter(isRequiredArgumentNode), (arg)=>arg.name.value);
        }
    }
    return {
        Directive: {
            // Validate on leave to allow for deeper errors to appear first.
            leave (directiveNode) {
                const directiveName = directiveNode.name.value;
                const requiredArgs = requiredArgsMap[directiveName];
                if (requiredArgs) {
                    var _directiveNode$argume;
                    // FIXME: https://github.com/graphql/graphql-js/issues/2203
                    /* c8 ignore next */ const argNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
                    const argNodeMap = new Set(argNodes.map((arg)=>arg.name.value));
                    for (const [argName, argDef] of Object.entries(requiredArgs)){
                        if (!argNodeMap.has(argName)) {
                            const argType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isType"])(argDef.type) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(argDef.type) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(argDef.type);
                            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Directive "@${directiveName}" argument "${argName}" of type "${argType}" is required, but it was not provided.`, {
                                nodes: directiveNode
                            }));
                        }
                    }
                }
            }
        }
    };
}
function isRequiredArgumentNode(arg) {
    return arg.type.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].NON_NULL_TYPE && arg.defaultValue == null;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ScalarLeafsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ScalarLeafsRule": (()=>ScalarLeafsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
function ScalarLeafsRule(context) {
    return {
        Field (node) {
            const type = context.getType();
            const selectionSet = node.selectionSet;
            if (type) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLeafType"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(type))) {
                    if (selectionSet) {
                        const fieldName = node.name.value;
                        const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type);
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${fieldName}" must not have a selection since type "${typeStr}" has no subfields.`, {
                            nodes: selectionSet
                        }));
                    }
                } else if (!selectionSet) {
                    const fieldName = node.name.value;
                    const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type);
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${fieldName}" of type "${typeStr}" must have a selection of subfields. Did you mean "${fieldName} { ... }"?`, {
                        nodes: node
                    }));
                }
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SingleFieldSubscriptionsRule": (()=>SingleFieldSubscriptionsRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/execution/collectFields.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
function SingleFieldSubscriptionsRule(context) {
    return {
        OperationDefinition (node) {
            if (node.operation === 'subscription') {
                const schema = context.getSchema();
                const subscriptionType = schema.getSubscriptionType();
                if (subscriptionType) {
                    const operationName = node.name ? node.name.value : null;
                    const variableValues = Object.create(null);
                    const document = context.getDocument();
                    const fragments = Object.create(null);
                    for (const definition of document.definitions){
                        if (definition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION) {
                            fragments[definition.name.value] = definition;
                        }
                    }
                    const fields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$execution$2f$collectFields$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collectFields"])(schema, fragments, variableValues, subscriptionType, node.selectionSet);
                    if (fields.size > 1) {
                        const fieldSelectionLists = [
                            ...fields.values()
                        ];
                        const extraFieldSelectionLists = fieldSelectionLists.slice(1);
                        const extraFieldSelections = extraFieldSelectionLists.flat();
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](operationName != null ? `Subscription "${operationName}" must select only one top level field.` : 'Anonymous Subscription must select only one top level field.', {
                            nodes: extraFieldSelections
                        }));
                    }
                    for (const fieldNodes of fields.values()){
                        const field = fieldNodes[0];
                        const fieldName = field.name.value;
                        if (fieldName.startsWith('__')) {
                            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](operationName != null ? `Subscription "${operationName}" must not select an introspection top level field.` : 'Anonymous Subscription must not select an introspection top level field.', {
                                nodes: fieldNodes
                            }));
                        }
                    }
                }
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueArgumentDefinitionNamesRule": (()=>UniqueArgumentDefinitionNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$groupBy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/groupBy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
function UniqueArgumentDefinitionNamesRule(context) {
    return {
        DirectiveDefinition (directiveNode) {
            var _directiveNode$argume;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */ const argumentNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
            return checkArgUniqueness(`@${directiveNode.name.value}`, argumentNodes);
        },
        InterfaceTypeDefinition: checkArgUniquenessPerField,
        InterfaceTypeExtension: checkArgUniquenessPerField,
        ObjectTypeDefinition: checkArgUniquenessPerField,
        ObjectTypeExtension: checkArgUniquenessPerField
    };
    "TURBOPACK unreachable";
    function checkArgUniquenessPerField(typeNode) {
        var _typeNode$fields;
        const typeName = typeNode.name.value; // FIXME: https://github.com/graphql/graphql-js/issues/2203
        /* c8 ignore next */ const fieldNodes = (_typeNode$fields = typeNode.fields) !== null && _typeNode$fields !== void 0 ? _typeNode$fields : [];
        for (const fieldDef of fieldNodes){
            var _fieldDef$arguments;
            const fieldName = fieldDef.name.value; // FIXME: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */ const argumentNodes = (_fieldDef$arguments = fieldDef.arguments) !== null && _fieldDef$arguments !== void 0 ? _fieldDef$arguments : [];
            checkArgUniqueness(`${typeName}.${fieldName}`, argumentNodes);
        }
        return false;
    }
    function checkArgUniqueness(parentName, argumentNodes) {
        const seenArgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$groupBy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["groupBy"])(argumentNodes, (arg)=>arg.name.value);
        for (const [argName, argNodes] of seenArgs){
            if (argNodes.length > 1) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Argument "${parentName}(${argName}:)" can only be defined once.`, {
                    nodes: argNodes.map((node)=>node.name)
                }));
            }
        }
        return false;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueArgumentNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueArgumentNamesRule": (()=>UniqueArgumentNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$groupBy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/groupBy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
function UniqueArgumentNamesRule(context) {
    return {
        Field: checkArgUniqueness,
        Directive: checkArgUniqueness
    };
    "TURBOPACK unreachable";
    function checkArgUniqueness(parentNode) {
        var _parentNode$arguments;
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        /* c8 ignore next */ const argumentNodes = (_parentNode$arguments = parentNode.arguments) !== null && _parentNode$arguments !== void 0 ? _parentNode$arguments : [];
        const seenArgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$groupBy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["groupBy"])(argumentNodes, (arg)=>arg.name.value);
        for (const [argName, argNodes] of seenArgs){
            if (argNodes.length > 1) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one argument named "${argName}".`, {
                    nodes: argNodes.map((node)=>node.name)
                }));
            }
        }
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueDirectiveNamesRule": (()=>UniqueDirectiveNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function UniqueDirectiveNamesRule(context) {
    const knownDirectiveNames = Object.create(null);
    const schema = context.getSchema();
    return {
        DirectiveDefinition (node) {
            const directiveName = node.name.value;
            if (schema !== null && schema !== void 0 && schema.getDirective(directiveName)) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Directive "@${directiveName}" already exists in the schema. It cannot be redefined.`, {
                    nodes: node.name
                }));
                return;
            }
            if (knownDirectiveNames[directiveName]) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one directive named "@${directiveName}".`, {
                    nodes: [
                        knownDirectiveNames[directiveName],
                        node.name
                    ]
                }));
            } else {
                knownDirectiveNames[directiveName] = node.name;
            }
            return false;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueDirectivesPerLocationRule": (()=>UniqueDirectivesPerLocationRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/directives.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/predicates.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
;
function UniqueDirectivesPerLocationRule(context) {
    const uniqueDirectiveMap = Object.create(null);
    const schema = context.getSchema();
    const definedDirectives = schema ? schema.getDirectives() : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$directives$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedDirectives"];
    for (const directive of definedDirectives){
        uniqueDirectiveMap[directive.name] = !directive.isRepeatable;
    }
    const astDefinitions = context.getDocument().definitions;
    for (const def of astDefinitions){
        if (def.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION) {
            uniqueDirectiveMap[def.name.value] = !def.repeatable;
        }
    }
    const schemaDirectives = Object.create(null);
    const typeDirectivesMap = Object.create(null);
    return {
        // Many different AST nodes may contain directives. Rather than listing
        // them all, just listen for entering any node, and check to see if it
        // defines any directives.
        enter (node) {
            if (!('directives' in node) || !node.directives) {
                return;
            }
            let seenDirectives;
            if (node.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION || node.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_EXTENSION) {
                seenDirectives = schemaDirectives;
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeDefinitionNode"])(node) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeExtensionNode"])(node)) {
                const typeName = node.name.value;
                seenDirectives = typeDirectivesMap[typeName];
                if (seenDirectives === undefined) {
                    typeDirectivesMap[typeName] = seenDirectives = Object.create(null);
                }
            } else {
                seenDirectives = Object.create(null);
            }
            for (const directive of node.directives){
                const directiveName = directive.name.value;
                if (uniqueDirectiveMap[directiveName]) {
                    if (seenDirectives[directiveName]) {
                        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`The directive "@${directiveName}" can only be used once at this location.`, {
                            nodes: [
                                seenDirectives[directiveName],
                                directive
                            ]
                        }));
                    } else {
                        seenDirectives[directiveName] = directive;
                    }
                }
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueEnumValueNamesRule": (()=>UniqueEnumValueNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
function UniqueEnumValueNamesRule(context) {
    const schema = context.getSchema();
    const existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
    const knownValueNames = Object.create(null);
    return {
        EnumTypeDefinition: checkValueUniqueness,
        EnumTypeExtension: checkValueUniqueness
    };
    "TURBOPACK unreachable";
    function checkValueUniqueness(node) {
        var _node$values;
        const typeName = node.name.value;
        if (!knownValueNames[typeName]) {
            knownValueNames[typeName] = Object.create(null);
        } // FIXME: https://github.com/graphql/graphql-js/issues/2203
        /* c8 ignore next */ const valueNodes = (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
        const valueNames = knownValueNames[typeName];
        for (const valueDef of valueNodes){
            const valueName = valueDef.name.value;
            const existingType = existingTypeMap[typeName];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isEnumType"])(existingType) && existingType.getValue(valueName)) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Enum value "${typeName}.${valueName}" already exists in the schema. It cannot also be defined in this type extension.`, {
                    nodes: valueDef.name
                }));
            } else if (valueNames[valueName]) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Enum value "${typeName}.${valueName}" can only be defined once.`, {
                    nodes: [
                        valueNames[valueName],
                        valueDef.name
                    ]
                }));
            } else {
                valueNames[valueName] = valueDef.name;
            }
        }
        return false;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueFieldDefinitionNamesRule": (()=>UniqueFieldDefinitionNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
;
;
function UniqueFieldDefinitionNamesRule(context) {
    const schema = context.getSchema();
    const existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
    const knownFieldNames = Object.create(null);
    return {
        InputObjectTypeDefinition: checkFieldUniqueness,
        InputObjectTypeExtension: checkFieldUniqueness,
        InterfaceTypeDefinition: checkFieldUniqueness,
        InterfaceTypeExtension: checkFieldUniqueness,
        ObjectTypeDefinition: checkFieldUniqueness,
        ObjectTypeExtension: checkFieldUniqueness
    };
    "TURBOPACK unreachable";
    function checkFieldUniqueness(node) {
        var _node$fields;
        const typeName = node.name.value;
        if (!knownFieldNames[typeName]) {
            knownFieldNames[typeName] = Object.create(null);
        } // FIXME: https://github.com/graphql/graphql-js/issues/2203
        /* c8 ignore next */ const fieldNodes = (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
        const fieldNames = knownFieldNames[typeName];
        for (const fieldDef of fieldNodes){
            const fieldName = fieldDef.name.value;
            if (hasField(existingTypeMap[typeName], fieldName)) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${typeName}.${fieldName}" already exists in the schema. It cannot also be defined in this type extension.`, {
                    nodes: fieldDef.name
                }));
            } else if (fieldNames[fieldName]) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${typeName}.${fieldName}" can only be defined once.`, {
                    nodes: [
                        fieldNames[fieldName],
                        fieldDef.name
                    ]
                }));
            } else {
                fieldNames[fieldName] = fieldDef.name;
            }
        }
        return false;
    }
}
function hasField(type, fieldName) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObjectType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInterfaceType"])(type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
        return type.getFields()[fieldName] != null;
    }
    return false;
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueFragmentNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueFragmentNamesRule": (()=>UniqueFragmentNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function UniqueFragmentNamesRule(context) {
    const knownFragmentNames = Object.create(null);
    return {
        OperationDefinition: ()=>false,
        FragmentDefinition (node) {
            const fragmentName = node.name.value;
            if (knownFragmentNames[fragmentName]) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one fragment named "${fragmentName}".`, {
                    nodes: [
                        knownFragmentNames[fragmentName],
                        node.name
                    ]
                }));
            } else {
                knownFragmentNames[fragmentName] = node.name;
            }
            return false;
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueInputFieldNamesRule": (()=>UniqueInputFieldNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
function UniqueInputFieldNamesRule(context) {
    const knownNameStack = [];
    let knownNames = Object.create(null);
    return {
        ObjectValue: {
            enter () {
                knownNameStack.push(knownNames);
                knownNames = Object.create(null);
            },
            leave () {
                const prevKnownNames = knownNameStack.pop();
                prevKnownNames || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$invariant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(false);
                knownNames = prevKnownNames;
            }
        },
        ObjectField (node) {
            const fieldName = node.name.value;
            if (knownNames[fieldName]) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one input field named "${fieldName}".`, {
                    nodes: [
                        knownNames[fieldName],
                        node.name
                    ]
                }));
            } else {
                knownNames[fieldName] = node.name;
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueOperationNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueOperationNamesRule": (()=>UniqueOperationNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function UniqueOperationNamesRule(context) {
    const knownOperationNames = Object.create(null);
    return {
        OperationDefinition (node) {
            const operationName = node.name;
            if (operationName) {
                if (knownOperationNames[operationName.value]) {
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one operation named "${operationName.value}".`, {
                        nodes: [
                            knownOperationNames[operationName.value],
                            operationName
                        ]
                    }));
                } else {
                    knownOperationNames[operationName.value] = operationName;
                }
            }
            return false;
        },
        FragmentDefinition: ()=>false
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueOperationTypesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueOperationTypesRule": (()=>UniqueOperationTypesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function UniqueOperationTypesRule(context) {
    const schema = context.getSchema();
    const definedOperationTypes = Object.create(null);
    const existingOperationTypes = schema ? {
        query: schema.getQueryType(),
        mutation: schema.getMutationType(),
        subscription: schema.getSubscriptionType()
    } : {};
    return {
        SchemaDefinition: checkOperationTypes,
        SchemaExtension: checkOperationTypes
    };
    "TURBOPACK unreachable";
    function checkOperationTypes(node) {
        var _node$operationTypes;
        // See: https://github.com/graphql/graphql-js/issues/2203
        /* c8 ignore next */ const operationTypesNodes = (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
        for (const operationType of operationTypesNodes){
            const operation = operationType.operation;
            const alreadyDefinedOperationType = definedOperationTypes[operation];
            if (existingOperationTypes[operation]) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Type for ${operation} already defined in the schema. It cannot be redefined.`, {
                    nodes: operationType
                }));
            } else if (alreadyDefinedOperationType) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one ${operation} type in schema.`, {
                    nodes: [
                        alreadyDefinedOperationType,
                        operationType
                    ]
                }));
            } else {
                definedOperationTypes[operation] = operationType;
            }
        }
        return false;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueTypeNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueTypeNamesRule": (()=>UniqueTypeNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
function UniqueTypeNamesRule(context) {
    const knownTypeNames = Object.create(null);
    const schema = context.getSchema();
    return {
        ScalarTypeDefinition: checkTypeName,
        ObjectTypeDefinition: checkTypeName,
        InterfaceTypeDefinition: checkTypeName,
        UnionTypeDefinition: checkTypeName,
        EnumTypeDefinition: checkTypeName,
        InputObjectTypeDefinition: checkTypeName
    };
    "TURBOPACK unreachable";
    function checkTypeName(node) {
        const typeName = node.name.value;
        if (schema !== null && schema !== void 0 && schema.getType(typeName)) {
            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Type "${typeName}" already exists in the schema. It cannot also be defined in this type definition.`, {
                nodes: node.name
            }));
            return;
        }
        if (knownTypeNames[typeName]) {
            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one type named "${typeName}".`, {
                nodes: [
                    knownTypeNames[typeName],
                    node.name
                ]
            }));
        } else {
            knownTypeNames[typeName] = node.name;
        }
        return false;
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueVariableNamesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "UniqueVariableNamesRule": (()=>UniqueVariableNamesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$groupBy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/groupBy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
function UniqueVariableNamesRule(context) {
    return {
        OperationDefinition (operationNode) {
            var _operationNode$variab;
            // See: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */ const variableDefinitions = (_operationNode$variab = operationNode.variableDefinitions) !== null && _operationNode$variab !== void 0 ? _operationNode$variab : [];
            const seenVariableDefinitions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$groupBy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["groupBy"])(variableDefinitions, (node)=>node.variable.name.value);
            for (const [variableName, variableNodes] of seenVariableDefinitions){
                if (variableNodes.length > 1) {
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`There can be only one variable named "$${variableName}".`, {
                        nodes: variableNodes.map((node)=>node.variable.name)
                    }));
                }
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/ValidationContext.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ASTValidationContext": (()=>ASTValidationContext),
    "SDLValidationContext": (()=>SDLValidationContext),
    "ValidationContext": (()=>ValidationContext)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/TypeInfo.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/visitor.mjs [app-ssr] (ecmascript)");
;
;
;
class ASTValidationContext {
    constructor(ast, onError){
        this._ast = ast;
        this._fragments = undefined;
        this._fragmentSpreads = new Map();
        this._recursivelyReferencedFragments = new Map();
        this._onError = onError;
    }
    get [Symbol.toStringTag]() {
        return 'ASTValidationContext';
    }
    reportError(error) {
        this._onError(error);
    }
    getDocument() {
        return this._ast;
    }
    getFragment(name) {
        let fragments;
        if (this._fragments) {
            fragments = this._fragments;
        } else {
            fragments = Object.create(null);
            for (const defNode of this.getDocument().definitions){
                if (defNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_DEFINITION) {
                    fragments[defNode.name.value] = defNode;
                }
            }
            this._fragments = fragments;
        }
        return fragments[name];
    }
    getFragmentSpreads(node) {
        let spreads = this._fragmentSpreads.get(node);
        if (!spreads) {
            spreads = [];
            const setsToVisit = [
                node
            ];
            let set;
            while(set = setsToVisit.pop()){
                for (const selection of set.selections){
                    if (selection.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].FRAGMENT_SPREAD) {
                        spreads.push(selection);
                    } else if (selection.selectionSet) {
                        setsToVisit.push(selection.selectionSet);
                    }
                }
            }
            this._fragmentSpreads.set(node, spreads);
        }
        return spreads;
    }
    getRecursivelyReferencedFragments(operation) {
        let fragments = this._recursivelyReferencedFragments.get(operation);
        if (!fragments) {
            fragments = [];
            const collectedNames = Object.create(null);
            const nodesToVisit = [
                operation.selectionSet
            ];
            let node;
            while(node = nodesToVisit.pop()){
                for (const spread of this.getFragmentSpreads(node)){
                    const fragName = spread.name.value;
                    if (collectedNames[fragName] !== true) {
                        collectedNames[fragName] = true;
                        const fragment = this.getFragment(fragName);
                        if (fragment) {
                            fragments.push(fragment);
                            nodesToVisit.push(fragment.selectionSet);
                        }
                    }
                }
            }
            this._recursivelyReferencedFragments.set(operation, fragments);
        }
        return fragments;
    }
}
class SDLValidationContext extends ASTValidationContext {
    constructor(ast, schema, onError){
        super(ast, onError);
        this._schema = schema;
    }
    get [Symbol.toStringTag]() {
        return 'SDLValidationContext';
    }
    getSchema() {
        return this._schema;
    }
}
class ValidationContext extends ASTValidationContext {
    constructor(schema, ast, typeInfo, onError){
        super(ast, onError);
        this._schema = schema;
        this._typeInfo = typeInfo;
        this._variableUsages = new Map();
        this._recursiveVariableUsages = new Map();
    }
    get [Symbol.toStringTag]() {
        return 'ValidationContext';
    }
    getSchema() {
        return this._schema;
    }
    getVariableUsages(node) {
        let usages = this._variableUsages.get(node);
        if (!usages) {
            const newUsages = [];
            const typeInfo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TypeInfo"](this._schema);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visit"])(node, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitWithTypeInfo"])(typeInfo, {
                VariableDefinition: ()=>false,
                Variable (variable) {
                    newUsages.push({
                        node: variable,
                        type: typeInfo.getInputType(),
                        defaultValue: typeInfo.getDefaultValue()
                    });
                }
            }));
            usages = newUsages;
            this._variableUsages.set(node, usages);
        }
        return usages;
    }
    getRecursiveVariableUsages(operation) {
        let usages = this._recursiveVariableUsages.get(operation);
        if (!usages) {
            usages = this.getVariableUsages(operation);
            for (const frag of this.getRecursivelyReferencedFragments(operation)){
                usages = usages.concat(this.getVariableUsages(frag));
            }
            this._recursiveVariableUsages.set(operation, usages);
        }
        return usages;
    }
    getType() {
        return this._typeInfo.getType();
    }
    getParentType() {
        return this._typeInfo.getParentType();
    }
    getInputType() {
        return this._typeInfo.getInputType();
    }
    getParentInputType() {
        return this._typeInfo.getParentInputType();
    }
    getFieldDef() {
        return this._typeInfo.getFieldDef();
    }
    getDirective() {
        return this._typeInfo.getDirective();
    }
    getArgument() {
        return this._typeInfo.getArgument();
    }
    getEnumValue() {
        return this._typeInfo.getEnumValue();
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ValuesOfCorrectTypeRule": (()=>ValuesOfCorrectTypeRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/keyMap.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/suggestionList.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/didYouMean.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function ValuesOfCorrectTypeRule(context) {
    return {
        ListValue (node) {
            // Note: TypeInfo will traverse into a list's item type, so look to the
            // parent input type to check if it is a list.
            const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNullableType"])(context.getParentInputType());
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isListType"])(type)) {
                isValidValueNode(context, node);
                return false; // Don't traverse further.
            }
        },
        ObjectValue (node) {
            const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(context.getInputType());
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputObjectType"])(type)) {
                isValidValueNode(context, node);
                return false; // Don't traverse further.
            } // Ensure every required field exists.
            const fieldNodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$keyMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyMap"])(node.fields, (field)=>field.name.value);
            for (const fieldDef of Object.values(type.getFields())){
                const fieldNode = fieldNodeMap[fieldDef.name];
                if (!fieldNode && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRequiredInputField"])(fieldDef)) {
                    const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(fieldDef.type);
                    context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${type.name}.${fieldDef.name}" of required type "${typeStr}" was not provided.`, {
                        nodes: node
                    }));
                }
            }
        },
        ObjectField (node) {
            const parentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(context.getParentInputType());
            const fieldType = context.getInputType();
            if (!fieldType && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputObjectType"])(parentType)) {
                const suggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$suggestionList$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestionList"])(node.name.value, Object.keys(parentType.getFields()));
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Field "${node.name.value}" is not defined by type "${parentType.name}".` + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$didYouMean$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["didYouMean"])(suggestions), {
                    nodes: node
                }));
            }
        },
        NullValue (node) {
            const type = context.getInputType();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNonNullType"])(type)) {
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected value of type "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type)}", found ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(node)}.`, {
                    nodes: node
                }));
            }
        },
        EnumValue: (node)=>isValidValueNode(context, node),
        IntValue: (node)=>isValidValueNode(context, node),
        FloatValue: (node)=>isValidValueNode(context, node),
        StringValue: (node)=>isValidValueNode(context, node),
        BooleanValue: (node)=>isValidValueNode(context, node)
    };
}
/**
 * Any value literal may be a valid representation of a Scalar, depending on
 * that scalar type.
 */ function isValidValueNode(context, node) {
    // Report any error at the full type expected by the location.
    const locationType = context.getInputType();
    if (!locationType) {
        return;
    }
    const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNamedType"])(locationType);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLeafType"])(type)) {
        const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(locationType);
        context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected value of type "${typeStr}", found ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(node)}.`, {
            nodes: node
        }));
        return;
    } // Scalars and Enums determine if a literal value is valid via parseLiteral(),
    // which may throw or return an invalid value to indicate failure.
    try {
        const parseResult = type.parseLiteral(node, undefined);
        if (parseResult === undefined) {
            const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(locationType);
            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected value of type "${typeStr}", found ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(node)}.`, {
                nodes: node
            }));
        }
    } catch (error) {
        const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(locationType);
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"]) {
            context.reportError(error);
        } else {
            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Expected value of type "${typeStr}", found ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(node)}; ` + error.message, {
                nodes: node,
                originalError: error
            }));
        }
    }
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/VariablesAreInputTypesRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "VariablesAreInputTypesRule": (()=>VariablesAreInputTypesRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
;
;
;
;
function VariablesAreInputTypesRule(context) {
    return {
        VariableDefinition (node) {
            const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(context.getSchema(), node.type);
            if (type !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputType"])(type)) {
                const variableName = node.variable.name.value;
                const typeName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(node.type);
                context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Variable "$${variableName}" cannot be non-input type "${typeName}".`, {
                    nodes: node.type
                }));
            }
        }
    };
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "VariablesInAllowedPositionRule": (()=>VariablesInAllowedPositionRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeFromAST.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/definition.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/typeComparators.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
function VariablesInAllowedPositionRule(context) {
    let varDefMap = Object.create(null);
    return {
        OperationDefinition: {
            enter () {
                varDefMap = Object.create(null);
            },
            leave (operation) {
                const usages = context.getRecursiveVariableUsages(operation);
                for (const { node, type, defaultValue } of usages){
                    const varName = node.name.value;
                    const varDef = varDefMap[varName];
                    if (varDef && type) {
                        // A var type is allowed if it is the same or more strict (e.g. is
                        // a subtype of) than the expected type. It can be more strict if
                        // the variable type is non-null when the expected type is nullable.
                        // If both are list types, the variable item type can be more strict
                        // than the expected item type (contravariant).
                        const schema = context.getSchema();
                        const varType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeFromAST$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeFromAST"])(schema, varDef.type);
                        if (varType && !allowedVariableUsage(schema, varType, varDef.defaultValue, type, defaultValue)) {
                            const varTypeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(varType);
                            const typeStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$inspect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inspect"])(type);
                            context.reportError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"](`Variable "$${varName}" of type "${varTypeStr}" used in position expecting type "${typeStr}".`, {
                                nodes: [
                                    varDef,
                                    node
                                ]
                            }));
                        }
                    }
                }
            }
        },
        VariableDefinition (node) {
            varDefMap[node.variable.name.value] = node;
        }
    };
}
/**
 * Returns true if the variable is allowed in the location it was found,
 * which includes considering if default values exist for either the variable
 * or the location at which it is located.
 */ function allowedVariableUsage(schema, varType, varDefaultValue, locationType, locationDefaultValue) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNonNullType"])(locationType) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNonNullType"])(varType)) {
        const hasNonNullVariableDefaultValue = varDefaultValue != null && varDefaultValue.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Kind"].NULL;
        const hasLocationDefaultValue = locationDefaultValue !== undefined;
        if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
            return false;
        }
        const nullableLocationType = locationType.ofType;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeSubTypeOf"])(schema, varType, nullableLocationType);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$typeComparators$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypeSubTypeOf"])(schema, varType, locationType);
}
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/specifiedRules.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// Spec Section: "Executable Definitions"
__turbopack_esm__({
    "specifiedRules": (()=>specifiedRules),
    "specifiedSDLRules": (()=>specifiedSDLRules)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ExecutableDefinitionsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Field Selections on Objects, Interfaces, and Unions Types"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueOperationNamesRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneAnonymousOperationRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/LoneAnonymousOperationRule.mjs [app-ssr] (ecmascript)"); // SDL-specific validation rules
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$SingleFieldSubscriptionsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownTypeNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownTypeNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Lone Anonymous Operation"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FragmentsOnCompositeTypesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Argument Names"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesAreInputTypesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/VariablesAreInputTypesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "All Variable Usages Are Allowed"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ScalarLeafsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ScalarLeafsRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Subscriptions with Single Root Field"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FieldsOnCorrectTypeRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragments on Composite Types"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFragmentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueFragmentNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Input Object Field Uniqueness"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownFragmentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownFragmentNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragment Spread Type Existence"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedFragmentsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUnusedFragmentsRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "All Variables Used"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleFragmentSpreadsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoFragmentCyclesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoFragmentCyclesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "All Variable Used Defined"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueVariableNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueVariableNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Value Type Correctness"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUndefinedVariablesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUndefinedVariablesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragments must be used"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedVariablesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/NoUnusedVariablesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Field Selection Merging"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownDirectivesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownDirectivesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragment spread target defined"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectivesPerLocationRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownArgumentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/KnownArgumentNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Directives Are Defined"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueArgumentNamesRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ValuesOfCorrectTypeRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Variables are Input Types"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ProvidedRequiredArgumentsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Leaf Field Selections"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesInAllowedPositionRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$OverlappingFieldsCanBeMergedRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragment spread is possible"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueInputFieldNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Operation Name Uniqueness"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneSchemaDefinitionRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragments must not form cycles"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationTypesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueOperationTypesRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueTypeNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueTypeNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Variable Uniqueness"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueEnumValueNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFieldDefinitionNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Fragment Name Uniqueness"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentDefinitionNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Argument Uniqueness"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectiveNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Directives Are Unique Per Location"
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleTypeExtensionsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.mjs [app-ssr] (ecmascript)"); // Spec Section: "Argument Optionality"
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
const specifiedRules = Object.freeze([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ExecutableDefinitionsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExecutableDefinitionsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueOperationNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneAnonymousOperationRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoneAnonymousOperationRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$SingleFieldSubscriptionsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SingleFieldSubscriptionsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownTypeNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownTypeNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FragmentsOnCompositeTypesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FragmentsOnCompositeTypesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesAreInputTypesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VariablesAreInputTypesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ScalarLeafsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScalarLeafsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$FieldsOnCorrectTypeRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldsOnCorrectTypeRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFragmentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueFragmentNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownFragmentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownFragmentNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedFragmentsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoUnusedFragmentsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleFragmentSpreadsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PossibleFragmentSpreadsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoFragmentCyclesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoFragmentCyclesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueVariableNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueVariableNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUndefinedVariablesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoUndefinedVariablesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$NoUnusedVariablesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoUnusedVariablesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownDirectivesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownDirectivesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectivesPerLocationRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueDirectivesPerLocationRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownArgumentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownArgumentNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueArgumentNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ValuesOfCorrectTypeRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ValuesOfCorrectTypeRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ProvidedRequiredArgumentsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProvidedRequiredArgumentsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$VariablesInAllowedPositionRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VariablesInAllowedPositionRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$OverlappingFieldsCanBeMergedRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OverlappingFieldsCanBeMergedRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueInputFieldNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueInputFieldNamesRule"]
]);
const specifiedSDLRules = Object.freeze([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$LoneSchemaDefinitionRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoneSchemaDefinitionRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueOperationTypesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueOperationTypesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueTypeNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueTypeNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueEnumValueNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueEnumValueNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueFieldDefinitionNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueFieldDefinitionNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentDefinitionNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueArgumentDefinitionNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectiveNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueDirectiveNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownTypeNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownTypeNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownDirectivesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownDirectivesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueDirectivesPerLocationRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueDirectivesPerLocationRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$PossibleTypeExtensionsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PossibleTypeExtensionsRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$KnownArgumentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownArgumentNamesOnDirectivesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueArgumentNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueArgumentNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$UniqueInputFieldNamesRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UniqueInputFieldNamesRule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$rules$2f$ProvidedRequiredArgumentsRule$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProvidedRequiredArgumentsOnDirectivesRule"]
]);
}}),
"[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/validate.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "assertValidSDL": (()=>assertValidSDL),
    "assertValidSDLExtension": (()=>assertValidSDLExtension),
    "validate": (()=>validate),
    "validateSDL": (()=>validateSDL)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$specifiedRules$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/specifiedRules.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/utilities/TypeInfo.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/type/validate.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$ValidationContext$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/validation/ValidationContext.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/visitor.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function validate(schema, documentAST, rules = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$specifiedRules$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedRules"], options, /** @deprecated will be removed in 17.0.0 */ typeInfo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TypeInfo"](schema)) {
    var _options$maxErrors;
    const maxErrors = (_options$maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors) !== null && _options$maxErrors !== void 0 ? _options$maxErrors : 100;
    documentAST || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$jsutils$2f$devAssert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devAssert"])(false, 'Must provide document.'); // If the schema used for validation is invalid, throw an error.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$type$2f$validate$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assertValidSchema"])(schema);
    const abortObj = Object.freeze({});
    const errors = [];
    const context = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$ValidationContext$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ValidationContext"](schema, documentAST, typeInfo, (error)=>{
        if (errors.length >= maxErrors) {
            errors.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphQLError"]('Too many validation errors, error limit reached. Validation aborted.')); // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw abortObj;
        }
        errors.push(error);
    }); // This uses a specialized visitor which runs multiple visitors in parallel,
    // while maintaining the visitor skip and break API.
    const visitor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitInParallel"])(rules.map((rule)=>rule(context))); // Visit the whole document with each instance of all provided rules.
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visit"])(documentAST, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$utilities$2f$TypeInfo$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitWithTypeInfo"])(typeInfo, visitor));
    } catch (e) {
        if (e !== abortObj) {
            throw e;
        }
    }
    return errors;
}
function validateSDL(documentAST, schemaToExtend, rules = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$specifiedRules$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["specifiedSDLRules"]) {
    const errors = [];
    const context = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$validation$2f$ValidationContext$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SDLValidationContext"](documentAST, schemaToExtend, (error)=>{
        errors.push(error);
    });
    const visitors = rules.map((rule)=>rule(context));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visit"])(documentAST, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$visitor$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitInParallel"])(visitors));
    return errors;
}
function assertValidSDL(documentAST) {
    const errors = validateSDL(documentAST);
    if (errors.length !== 0) {
        throw new Error(errors.map((error)=>error.message).join('\n\n'));
    }
}
function assertValidSDLExtension(documentAST, schema) {
    const errors = validateSDL(documentAST, schema);
    if (errors.length !== 0) {
        throw new Error(errors.map((error)=>error.message).join('\n\n'));
    }
}
}}),

};

//# sourceMappingURL=83af6_graphql_validation_5ba90a._.js.map