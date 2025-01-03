module.exports = {

"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/account/accounts.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AccountsDocument": (()=>AccountsDocument)
});
const AccountsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "accounts"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Account_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Account_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "accounts"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "createdAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "isSuperApp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtTimestamp"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=accounts.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/account/account.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AccountQueryHandler": (()=>AccountQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$account$2f$accounts$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/account/accounts.generated.js [app-ssr] (ecmascript)");
;
;
class AccountQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "id"
                ],
                tokenKeys: []
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                accounts: [
                    result.id
                ],
                tokens: []
            });
        this.mapFromSubgraphResponse = (response)=>response.accounts.map((x)=>({
                    ...x,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber)
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$account$2f$accounts$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountsDocument"];
    }
} //# sourceMappingURL=account.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshot/accountTokenSnapshots.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AccountTokenSnapshotsDocument": (()=>AccountTokenSnapshotsDocument)
});
const AccountTokenSnapshotsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "accountTokenSnapshots"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "AccountTokenSnapshot_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "AccountTokenSnapshot_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "accountTokenSnapshots"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "account"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "balanceUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "token"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "symbol"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamedUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamedInUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamedOutUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountTransferredUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalInflowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalApprovedSubscriptions"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNetFlowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfActiveStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalOutflowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfClosedStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSubscriptionsWithUnits"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "maybeCriticalAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "isLiquidationEstimateOptimistic"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=accountTokenSnapshots.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshot/accountTokenSnapshot.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AccountTokenSnapshotQueryHandler": (()=>AccountTokenSnapshotQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshot$2f$accountTokenSnapshots$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshot/accountTokenSnapshots.generated.js [app-ssr] (ecmascript)");
;
;
class AccountTokenSnapshotQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "account"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: [
                    result.account
                ]
            });
        this.mapFromSubgraphResponse = (response)=>response.accountTokenSnapshots.map((x)=>({
                    ...x,
                    account: x.account.id,
                    token: x.token.id,
                    tokenSymbol: x.token.symbol,
                    maybeCriticalAtTimestamp: x.maybeCriticalAtTimestamp != null ? Number(x.maybeCriticalAtTimestamp) : null,
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp)
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshot$2f$accountTokenSnapshots$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountTokenSnapshotsDocument"];
    }
} //# sourceMappingURL=accountTokenSnapshot.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshotLog/accountTokenSnapshotLogs.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AccountTokenSnapshotLogsDocument": (()=>AccountTokenSnapshotLogsDocument)
});
const AccountTokenSnapshotLogsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "accountTokenSnapshotLogs"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "AccountTokenSnapshotLog_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "AccountTokenSnapshotLog_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "accountTokenSnapshotLogs"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "order"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "logIndex"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "timestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "blockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "balance"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "maybeCriticalAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamed"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamedIn"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamedOut"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountTransferred"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalApprovedSubscriptions"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalDeposit"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalInflowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNetFlowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfActiveStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfClosedStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSubscriptionsWithUnits"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalOutflowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "transactionHash"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "triggeredByEventName"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "account"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "token"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "symbol"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=accountTokenSnapshotLogs.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshotLog/accountTokenSnapshotLog.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AccountTokenSnapshotLogQueryHandler": (()=>AccountTokenSnapshotLogQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshotLog$2f$accountTokenSnapshotLogs$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshotLog/accountTokenSnapshotLogs.generated.js [app-ssr] (ecmascript)");
;
;
class AccountTokenSnapshotLogQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "account"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: [
                    result.account
                ]
            });
        this.mapFromSubgraphResponse = (response)=>response.accountTokenSnapshotLogs.map((x)=>({
                    ...x,
                    account: x.account.id,
                    token: x.token.id,
                    tokenSymbol: x.token.symbol,
                    maybeCriticalAtTimestamp: x.maybeCriticalAtTimestamp != null ? Number(x.maybeCriticalAtTimestamp) : null,
                    blockNumber: Number(x.blockNumber),
                    timestamp: Number(x.timestamp),
                    order: Number(x.order),
                    logIndex: Number(x.logIndex)
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshotLog$2f$accountTokenSnapshotLogs$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountTokenSnapshotLogsDocument"];
    }
} //# sourceMappingURL=accountTokenSnapshotLog.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/index/indexes.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IndexesDocument": (()=>IndexesDocument)
});
const IndexesDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexes"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Index_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Index_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "indexes"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "createdAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "indexCreatedEvent"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "indexId"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "indexValue"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "publisher"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "token"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "symbol"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountDistributedUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSubscriptionsWithUnits"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalUnits"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalUnitsApproved"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalUnitsPending"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtTimestamp"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=indexes.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/index/index.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IndexQueryHandler": (()=>IndexQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$index$2f$indexes$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/index/indexes.generated.js [app-ssr] (ecmascript)");
;
;
class IndexQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "publisher"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: [
                    result.publisher
                ]
            });
        this.mapFromSubgraphResponse = (response)=>response.indexes.map((x)=>({
                    ...x,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    indexCreatedEvent: x.indexCreatedEvent.id,
                    publisher: x.publisher.id,
                    token: x.token.id,
                    tokenSymbol: x.token.symbol
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$index$2f$indexes$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexesDocument"];
    }
} //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/indexSubscription/indexSubscriptions.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IndexSubscriptionsDocument": (()=>IndexSubscriptionsDocument)
});
const IndexSubscriptionsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexSubscriptions"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "IndexSubscription_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "IndexSubscription_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "indexSubscriptions"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "approved"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "index"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "indexValue"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "totalUnits"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "id"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "symbol"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "id"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "indexValueUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "subscriber"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountReceivedUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "units"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtTimestamp"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=indexSubscriptions.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/indexSubscription/indexSubscription.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IndexSubscriptionQueryHandler": (()=>IndexSubscriptionQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$indexSubscription$2f$indexSubscriptions$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/indexSubscription/indexSubscriptions.generated.js [app-ssr] (ecmascript)");
;
;
class IndexSubscriptionQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "subscriber"
                ],
                tokenKeys: []
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: [
                    result.subscriber,
                    result.publisher
                ]
            });
        this.mapFromSubgraphResponse = (response)=>response.indexSubscriptions.map((x)=>({
                    ...x,
                    subscriber: x.subscriber.id,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    index: x.index.id,
                    indexValueCurrent: x.index.indexValue,
                    indexTotalUnits: x.index.totalUnits,
                    token: x.index.token.id,
                    tokenSymbol: x.index.token.symbol,
                    publisher: x.index.publisher.id
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$indexSubscription$2f$indexSubscriptions$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexSubscriptionsDocument"];
    }
} //# sourceMappingURL=indexSubscription.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/stream/streams.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "StreamsDocument": (()=>StreamsDocument)
});
const StreamsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "streams"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Stream_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Stream_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "streams"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "createdAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "currentFlowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "receiver"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "sender"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "streamedUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "token"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "symbol"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtTimestamp"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=streams.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/stream/stream.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "StreamQueryHandler": (()=>StreamQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$stream$2f$streams$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/stream/streams.generated.js [app-ssr] (ecmascript)");
;
;
class StreamQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "sender",
                    "receiver"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: [
                    result.sender,
                    result.receiver
                ]
            });
        this.mapFromSubgraphResponse = (response)=>response.streams.map((x)=>({
                    ...x,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    receiver: x.receiver.id,
                    token: x.token.id,
                    tokenSymbol: x.token.symbol,
                    sender: x.sender.id
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$stream$2f$streams$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StreamsDocument"];
    }
} //# sourceMappingURL=stream.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/streamPeriod/streamPeriods.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "StreamPeriodsDocument": (()=>StreamPeriodsDocument)
});
const StreamPeriodsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "streamPeriods"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "StreamPeriod_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "StreamPeriod_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
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
                            "value": "streamPeriods"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "flowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "startedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "startedAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "stoppedAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "stoppedAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamed"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "token"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "symbol"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "stream"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "sender"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "receiver"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "stoppedAtEvent"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "startedAtEvent"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=streamPeriods.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/streamPeriod/streamPeriod.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "StreamPeriodQueryHandler": (()=>StreamPeriodQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$streamPeriod$2f$streamPeriods$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/streamPeriod/streamPeriods.generated.js [app-ssr] (ecmascript)");
;
;
class StreamPeriodQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "sender",
                    "receiver"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: [
                    result.sender,
                    result.receiver
                ]
            });
        this.mapFromSubgraphResponse = (response)=>response.streamPeriods.map((x)=>{
                var _a;
                return {
                    ...x,
                    stream: x.stream.id,
                    token: x.token.id,
                    tokenSymbol: x.token.symbol,
                    sender: x.sender.id,
                    receiver: x.receiver.id,
                    startedAtEvent: x.startedAtEvent.id,
                    stoppedAtEvent: (_a = x.stoppedAtEvent) === null || _a === void 0 ? void 0 : _a.id,
                    startedAtBlockNumber: Number(x.startedAtBlockNumber),
                    stoppedAtBlockNumber: Number(x.stoppedAtBlockNumber),
                    startedAtTimestamp: Number(x.startedAtTimestamp),
                    stoppedAtTimestamp: Number(x.stoppedAtTimestamp)
                };
            });
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$streamPeriod$2f$streamPeriods$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StreamPeriodsDocument"];
    }
} //# sourceMappingURL=streamPeriod.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/token/tokens.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TokensDocument": (()=>TokensDocument)
});
const TokensDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "tokens"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Token_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Token_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "tokens"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "createdAtBlockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "decimals"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "isListed"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "isSuperToken"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "name"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "symbol"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "underlyingAddress"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=tokens.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/token/token.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TokenQueryHandler": (()=>TokenQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$token$2f$tokens$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/token/tokens.generated.js [app-ssr] (ecmascript)");
;
;
class TokenQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [],
                tokenKeys: [
                    "id",
                    "underlyingToken",
                    "underlyingAddress"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.underlyingAddress,
                    result.id
                ],
                accounts: []
            });
        this.mapFromSubgraphResponse = (response)=>response.tokens.map((x)=>({
                    ...x,
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    createdAtTimestamp: Number(x.createdAtTimestamp)
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$token$2f$tokens$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokensDocument"];
    }
} //# sourceMappingURL=token.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatistic/tokenStatistics.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TokenStatisticsDocument": (()=>TokenStatisticsDocument)
});
const TokenStatisticsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "tokenStatistics"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "TokenStatistic_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "TokenStatistic_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "tokenStatistics"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountDistributedUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamedUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountTransferredUntilUpdatedAt"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalApprovedSubscriptions"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfActiveIndexes"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfActiveStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfIndexes"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfClosedStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalOutflowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSubscriptionsWithUnits"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSupply"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtTimestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "updatedAtBlockNumber"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=tokenStatistics.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatistic/tokenStatistic.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TokenStatisticQueryHandler": (()=>TokenStatisticQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatistic$2f$tokenStatistics$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatistic/tokenStatistics.generated.js [app-ssr] (ecmascript)");
;
;
class TokenStatisticQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [],
                tokenKeys: [
                    "id",
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.id
                ],
                accounts: []
            });
        this.mapFromSubgraphResponse = (response)=>response.tokenStatistics.map((x)=>({
                    ...x,
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp)
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatistic$2f$tokenStatistics$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStatisticsDocument"];
    }
} //# sourceMappingURL=tokenStatistic.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatisticLog/tokenStatisticLogs.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TokenStatisticLogsDocument": (()=>TokenStatisticLogsDocument)
});
const TokenStatisticLogsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "tokenStatisticLogs"
            },
            "variableDefinitions": [
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "10"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "Int"
                        }
                    },
                    "defaultValue": {
                        "kind": "IntValue",
                        "value": "0"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderBy"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "TokenStatisticLog_orderBy"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "id"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "orderDirection"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "OrderDirection"
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                },
                {
                    "kind": "VariableDefinition",
                    "variable": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "where"
                        }
                    },
                    "type": {
                        "kind": "NamedType",
                        "name": {
                            "kind": "Name",
                            "value": "TokenStatisticLog_filter"
                        }
                    },
                    "defaultValue": {
                        "kind": "ObjectValue",
                        "fields": []
                    }
                },
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
                            "value": "tokenStatisticLogs"
                        },
                        "arguments": [
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "first"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "first"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "skip"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "skip"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "orderDirection"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderDirection"
                                    }
                                }
                            },
                            {
                                "kind": "Argument",
                                "name": {
                                    "kind": "Name",
                                    "value": "where"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "where"
                                    }
                                }
                            },
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
                                        "value": "id"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "timestamp"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "blockNumber"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "transactionHash"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "logIndex"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "order"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "triggeredByEventName"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfActiveStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfClosedStreams"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfIndexes"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalNumberOfActiveIndexes"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSubscriptionsWithUnits"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalApprovedSubscriptions"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalDeposit"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalOutflowRate"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountStreamed"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountTransferred"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalAmountDistributed"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "totalSupply"
                                    }
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "token"
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "id"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "symbol"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=tokenStatisticLogs.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatisticLog/tokenStatisticLog.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TokenStatisticLogQueryHandler": (()=>TokenStatisticLogQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatisticLog$2f$tokenStatisticLogs$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatisticLog/tokenStatisticLogs.generated.js [app-ssr] (ecmascript)");
;
;
class TokenStatisticLogQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [],
                tokenKeys: [
                    "token"
                ]
            });
        this.getRelevantAddressesFromResultCore = (result)=>({
                tokens: [
                    result.token
                ],
                accounts: []
            });
        this.mapFromSubgraphResponse = (response)=>response.tokenStatisticLogs.map((x)=>({
                    ...x,
                    blockNumber: Number(x.blockNumber),
                    timestamp: Number(x.timestamp),
                    token: x.token.id
                }));
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatisticLog$2f$tokenStatisticLogs$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStatisticLogsDocument"];
    }
} //# sourceMappingURL=tokenStatisticLog.js.map
}}),

};

//# sourceMappingURL=e10cc_%40superfluid-finance_sdk-core_dist_module_subgraph_entities_e13fdc._.js.map