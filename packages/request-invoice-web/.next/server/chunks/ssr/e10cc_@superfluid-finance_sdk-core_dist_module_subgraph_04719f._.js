module.exports = {

"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/schema.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
;
 //# sourceMappingURL=schema.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/SubgraphClient.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SubgraphClient": (()=>SubgraphClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$2d$request$40$4$2e$3$2e$0_graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2d$request$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql-request@4.3.0_graphql@16.8.1/node_modules/graphql-request/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isString.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printer.mjs [app-ssr] (ecmascript)");
;
;
;
;
class SubgraphClient {
    constructor(subgraphUrl){
        this.subgraphUrl = subgraphUrl;
    }
    async request(document, variables) {
        try {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$2d$request$40$4$2e$3$2e$0_graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2d$request$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["request"])(this.subgraphUrl, document, cleanVariables(variables));
        } catch (err) {
            const queryString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(document) ? document : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$8$2e$1$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["print"])(document);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SFError"]({
                type: "SUBGRAPH_ERROR",
                message: `Failed call to subgraph with: 
${queryString}`,
                cause: err
            });
        }
    }
}
// Inspired by: https://stackoverflow.com/a/38340730
// Remove properties with null, undefined, empty string values.
function cleanVariables(variables) {
    return Object.fromEntries(Object.entries(variables).filter(([, value])=>value !== "" && value !== null && value !== undefined).map(([key, value])=>[
            key,
            value === Object(value) && !Array.isArray(value) ? cleanVariables(value) : value
        ]));
} //# sourceMappingURL=SubgraphClient.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/normalizeSubgraphFilter.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "normalizeSubgraphFilter": (()=>normalizeSubgraphFilter),
    "normalizeSubgraphFilterValue": (()=>normalizeSubgraphFilterValue)
});
const normalizeSubgraphFilter = (value)=>{
    return Object.keys(value).sort().reduce((acc, key)=>{
        acc[key] = normalizeSubgraphFilterValue(value[key]);
        return acc;
    }, {});
};
/**
 * NOTE: Regex taken from Ethers.
 */ const isAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
const normalizeSubgraphFilterValue = (value)=>lowerCaseIfAddress(undefinedIfEmpty(value));
const undefinedIfEmpty = (value)=>{
    if (value === "") {
        return undefined;
    }
    return value;
};
const lowerCaseIfAddress = (value)=>{
    if (typeof value === "string") {
        if (value.match(isAddressRegex)) {
            return value.toLowerCase();
        }
    }
    if (Array.isArray(value)) {
        return value.map((x)=>lowerCaseIfAddress(x));
    }
    return value;
}; //# sourceMappingURL=normalizeSubgraphFilter.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SubgraphQueryHandler": (()=>SubgraphQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Query.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/pagination.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$normalizeSubgraphFilter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/normalizeSubgraphFilter.js [app-ssr] (ecmascript)");
;
;
;
;
;
class SubgraphQueryHandler {
    constructor(){
        /**
         * For every primary address field key there are more fields generated which it should look for addresses.
         * NOTE: The implementation is a bit "magical" but it rids of a bunch of boilerplate and creates a single point for editing.
         */ this.getRelevantAddressesFromFilterByAddressFieldKeys = (filter, addressFieldKeys)=>addressFieldKeys.map((key)=>[
                    filter[key],
                    filter[`${String(key)}_in`],
                    filter[`${String(key)}_not`],
                    filter[`${String(key)}_not_in`]
                ].filter((x)=>typeof x !== "undefined").flat().filter((x)=>!!x)).flat();
    }
    getRelevantAddressesFromFilter(filter) {
        if (!filter) {
            return {
                tokens: [],
                accounts: []
            };
        }
        const addressFieldKeys = this.getAddressFieldKeysFromFilter();
        const tokenAddresses = this.getRelevantAddressesFromFilterByAddressFieldKeys(filter, addressFieldKeys.tokenKeys);
        const accountAddresses = this.getRelevantAddressesFromFilterByAddressFieldKeys(filter, addressFieldKeys.accountKeys);
        return {
            tokens: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].uniq(tokenAddresses),
            accounts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].uniq(accountAddresses)
        };
    }
    getRelevantAddressesFromResult(result) {
        if (!result) {
            return {
                tokens: [],
                accounts: []
            };
        }
        const intermediate = this.getRelevantAddressesFromResultCore(result);
        return {
            tokens: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].uniq(intermediate.tokens.flat().filter((x)=>!!x)),
            accounts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].uniq(intermediate.accounts.flat().filter((x)=>!!x))
        };
    }
    async get(subgraphClient, query) {
        var _a;
        if (!query.id) {
            return null;
        }
        const response = await this.querySubgraph(subgraphClient, {
            where: {
                id: query.id.toLowerCase()
            },
            skip: 0,
            take: 1,
            block: query.block
        });
        return (_a = this.mapFromSubgraphResponse(response)[0]) !== null && _a !== void 0 ? _a : null;
    }
    async list(subgraphClient, query) {
        var _a;
        // Note: Could possibly optimize here to not create a new internal function every time.
        const queryFunction = async (paging)=>{
            var _a, _b, _c;
            const subgraphFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeGuard"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$normalizeSubgraphFilter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeSubgraphFilter"])({
                ...(_a = query.filter) !== null && _a !== void 0 ? _a : {},
                id_gt: paging.lastId
            }));
            const subgraphQueryVariables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typeGuard"])({
                where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$normalizeSubgraphFilter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeSubgraphFilter"])(subgraphFilter),
                orderBy: (_b = query.order) === null || _b === void 0 ? void 0 : _b.orderBy,
                orderDirection: (_c = query.order) === null || _c === void 0 ? void 0 : _c.orderDirection,
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPageNumberPaging"])(paging) ? (paging.pageNumber - 1) * paging.take : paging.skip,
                block: query.block
            });
            const subgraphResponse = await this.querySubgraph(subgraphClient, subgraphQueryVariables);
            const mappedResult = this.mapFromSubgraphResponse(subgraphResponse);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPagedResult"])(mappedResult, paging);
        };
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAllPaging"])(query.pagination)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPagedResult"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listAllResults"])(queryFunction), query.pagination);
        } else {
            return queryFunction((_a = query.pagination) !== null && _a !== void 0 ? _a : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSkipPaging"])());
        }
    }
    async querySubgraph(subgraphClient, variables) {
        return await subgraphClient.request(this.requestDocument, variables);
    }
} //# sourceMappingURL=subgraphQueryHandler.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/meta/meta.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "MetaDocument": (()=>MetaDocument)
});
const MetaDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "meta"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "block"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Block_height"
                        }
                    }
                }
            ],
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "name": {
                            "kind": "Name",
                            "value": "_meta"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "block"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "block"
                                    }
                                }
                            }
                        ],
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "block"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "number"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "hash"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "deployment"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "hasIndexingErrors"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=meta.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/meta/meta.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "MetaQueryHandler": (()=>MetaQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$meta$2f$meta$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/meta/meta.generated.js [app-ssr] (ecmascript)");
;
class MetaQueryHandler {
    async get(subgraphClient, query) {
        const response = await subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$meta$2f$meta$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetaDocument"], query);
        if (!response._meta) {
            return null;
        }
        return {
            blockNumber: response._meta.block.number,
            blockHash: response._meta.block.hash,
            deployment: response._meta.deployment,
            hasIndexingErrors: response._meta.hasIndexingErrors
        };
    }
} //# sourceMappingURL=meta.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/mappedSubgraphTypes.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// TODO(KK): Add comments
__turbopack_esm__({});
;
 //# sourceMappingURL=mappedSubgraphTypes.js.map
}}),

};

//# sourceMappingURL=e10cc_%40superfluid-finance_sdk-core_dist_module_subgraph_04719f._.js.map