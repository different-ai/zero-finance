module.exports = {

"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getAccountTokenSnapshots.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GetAccountTokenSnapshotsDocument": (()=>GetAccountTokenSnapshotsDocument)
});
const GetAccountTokenSnapshotsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "getAccountTokenSnapshots"
            },
            "variableDefinitions": [
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "AccountTokenSnapshot_filter"
                            }
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
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "AccountTokenSnapshot_orderBy"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "OrderDirection"
                            }
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                }
            ],
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "alias": {
                            "kind": "Name",
                            "value": "result"
                        },
                        "name": {
                            "kind": "Name",
                            "value": "accountTokenSnapshots"
                        },
                        "arguments": [
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
                                    "value": "orderBy"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "orderBy"
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
                                        "value": "updatedAtTimestamp"
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
                                        "value": "totalApprovedSubscriptions"
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
                                        "value": "totalNetFlowRate"
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
                                        "value": "totalOutflowRate"
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
                                                    "value": "createdAtTimestamp"
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
                                                    "value": "isListed"
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
            }
        }
    ]
}; //# sourceMappingURL=getAccountTokenSnapshots.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getAllEvents.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GetAllEventsDocument": (()=>GetAllEventsDocument)
});
const GetAllEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "getAllEvents"
            },
            "variableDefinitions": [
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Event_filter"
                            }
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
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Event_orderBy"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "OrderDirection"
                            }
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
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
                            "value": "events"
                        },
                        "arguments": [
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
                            }
                        ],
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "FlowUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "type"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "sender"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "receiver"
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
                                                    "value": "flowOperator"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "deposit"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "FlowOperatorUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "sender"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "permissions"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "flowRateAllowance"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "IndexCreatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "IndexDistributionClaimedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "amount"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "IndexUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
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
                                                    "value": "totalUnitsApproved"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "oldIndexValue"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "newIndexValue"
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
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "IndexSubscribedEvent"
                                        }
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
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "IndexUnitsUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
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
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "oldUnits"
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
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "IndexUnsubscribedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SubscriptionApprovedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscription"
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
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SubscriptionDistributionClaimedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscription"
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
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                    "value": "amount"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SubscriptionRevokedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscription"
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
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
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
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SubscriptionUnitsUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
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
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "subscription"
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
                                                    "value": "subscriber"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "publisher"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "oldUnits"
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
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "TransferEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "value"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "to"
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
                                                    "value": "from"
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
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "TokenUpgradedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "amount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
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
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "TokenDowngradedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
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
                                                    "value": "amount"
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
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "transactionHash"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "AgreementClassRegisteredEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "code"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "agreementType"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "AgreementClassUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "code"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "agreementType"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "AppRegisteredEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
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
                                                    "value": "app"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "transactionHash"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "GovernanceReplacedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "oldGovernance"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "newGovernance"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "JailEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "reason"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "app"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SuperTokenFactoryUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "newFactory"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SuperTokenLogicUpdatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "code"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "RoleAdminChangedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "role"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "previousAdminRole"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "newAdminRole"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "RoleGrantedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "sender"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "role"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "account"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "RoleRevokedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "sender"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "role"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "account"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SetEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "hashedName"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "target"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "resolverEntry"
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
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "CFAv1LiquidationPeriodChangedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "superToken"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "host"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "governanceAddress"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "liquidationPeriod"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "isKeySet"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "ConfigChangedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "value"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "superToken"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "key"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "isKeySet"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "host"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "governanceAddress"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "RewardAddressChangedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "superToken"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "rewardAddress"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "isKeySet"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "host"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "governanceAddress"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "PPPConfigurationChangedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "host"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "governanceAddress"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "superToken"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "isKeySet"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "liquidationPeriod"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "patricianPeriod"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "TrustedForwarderChangedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "isKeySet"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "host"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "governanceAddress"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "forwarder"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "enabled"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "superToken"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "AgreementLiquidatedByEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "rewardAmount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "penaltyAccount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "liquidatorAccount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "bondAccount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "bailoutAmount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "agreementId"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "agreementClass"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "AgreementLiquidatedV2Event"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "liquidatorAccount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "agreementClass"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "agreementId"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "targetAccount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "rewardAmountReceiver"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "rewardAmount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "targetAccountBalanceDelta"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "version"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "liquidationType"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "rewardAccount"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "BurnedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "operatorData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "operator"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "from"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "data"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "amount"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "MintedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "operatorData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "operator"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "data"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "amount"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "to"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SentEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "to"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "operatorData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "operator"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "data"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "amount"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "CustomSuperTokenCreatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SuperTokenCreatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "kind": "InlineFragment",
                                    "typeCondition": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "SuperTokenLogicCreatedEvent"
                                        }
                                    },
                                    "selectionSet": {
                                        "kind": "SelectionSet",
                                        "selections": [
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "tokenLogic"
                                                }
                                            },
                                            {
                                                "kind": "InlineFragment",
                                                "typeCondition": {
                                                    "kind": "NamedType",
                                                    "name": {
                                                        "kind": "Name",
                                                        "value": "Event"
                                                    }
                                                },
                                                "selectionSet": {
                                                    "kind": "SelectionSet",
                                                    "selections": [
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "__typename"
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
                                                                "value": "gasPrice"
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
                                                                "value": "timestamp"
                                                            }
                                                        },
                                                        {
                                                            "kind": "Field",
                                                            "name": {
                                                                "kind": "Name",
                                                                "value": "logIndex"
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
            }
        }
    ]
}; //# sourceMappingURL=getAllEvents.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getIndexSubscriptions.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GetIndexSubscriptionsDocument": (()=>GetIndexSubscriptionsDocument)
});
const GetIndexSubscriptionsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "getIndexSubscriptions"
            },
            "variableDefinitions": [
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "IndexSubscription_filter"
                            }
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
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "IndexSubscription_orderBy"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "OrderDirection"
                            }
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                }
            ],
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "alias": {
                            "kind": "Name",
                            "value": "result"
                        },
                        "name": {
                            "kind": "Name",
                            "value": "indexSubscriptions"
                        },
                        "arguments": [
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
                                        "value": "createdAtTimestamp"
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
                                        "value": "updatedAtTimestamp"
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
                                        "value": "approved"
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
                                        "value": "totalAmountReceivedUntilUpdatedAt"
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
                                                                "value": "createdAtTimestamp"
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
                                                                "value": "isListed"
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
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=getIndexSubscriptions.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getIndexes.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GetIndexesDocument": (()=>GetIndexesDocument)
});
const GetIndexesDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "getIndexes"
            },
            "variableDefinitions": [
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Index_filter"
                            }
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
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Index_orderBy"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "OrderDirection"
                            }
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                }
            ],
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "alias": {
                            "kind": "Name",
                            "value": "result"
                        },
                        "name": {
                            "kind": "Name",
                            "value": "indexes"
                        },
                        "arguments": [
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
                                        "value": "createdAtTimestamp"
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
                                        "value": "updatedAtTimestamp"
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
                                        "value": "totalSubscriptionsWithUnits"
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
                                        "value": "totalUnitsApproved"
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
                                        "value": "totalAmountDistributedUntilUpdatedAt"
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
                                                    "value": "createdAtTimestamp"
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
                                                    "value": "isListed"
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
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=getIndexes.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getStreams.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GetStreamsDocument": (()=>GetStreamsDocument)
});
const GetStreamsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "getStreams"
            },
            "variableDefinitions": [
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Stream_filter"
                            }
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
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Stream_orderBy"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "OrderDirection"
                            }
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                }
            ],
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "alias": {
                            "kind": "Name",
                            "value": "result"
                        },
                        "name": {
                            "kind": "Name",
                            "value": "streams"
                        },
                        "arguments": [
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
                                        "value": "createdAtTimestamp"
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
                                        "value": "updatedAtTimestamp"
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
                                        "value": "currentFlowRate"
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
                                                    "value": "createdAtTimestamp"
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
                                                    "value": "isListed"
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
                                        "value": "flowUpdatedEvents"
                                    },
                                    "arguments": [
                                        {
                                            "kind": "Argument",
                                            "name": {
                                                "kind": "Name",
                                                "value": "orderBy"
                                            },
                                            "value": {
                                                "kind": "EnumValue",
                                                "value": "timestamp"
                                            }
                                        },
                                        {
                                            "kind": "Argument",
                                            "name": {
                                                "kind": "Name",
                                                "value": "orderDirection"
                                            },
                                            "value": {
                                                "kind": "EnumValue",
                                                "value": "asc"
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
                                                    "value": "blockNumber"
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
                                                    "value": "transactionHash"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "token"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "sender"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "receiver"
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
                                                    "value": "totalSenderFlowRate"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "totalReceiverFlowRate"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "userData"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "oldFlowRate"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "type"
                                                }
                                            },
                                            {
                                                "kind": "Field",
                                                "name": {
                                                    "kind": "Name",
                                                    "value": "totalAmountStreamedUntilTimestamp"
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
}; //# sourceMappingURL=getStreams.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getTokens.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "GetTokensDocument": (()=>GetTokensDocument)
});
const GetTokensDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "getTokens"
            },
            "variableDefinitions": [
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Token_filter"
                            }
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
                            "value": "skip"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                            "value": "first"
                        }
                    },
                    "type": {
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Int"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "Token_orderBy"
                            }
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
                        "kind": "NonNullType",
                        "type": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "OrderDirection"
                            }
                        }
                    },
                    "defaultValue": {
                        "kind": "EnumValue",
                        "value": "asc"
                    }
                }
            ],
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "alias": {
                            "kind": "Name",
                            "value": "result"
                        },
                        "name": {
                            "kind": "Name",
                            "value": "tokens"
                        },
                        "arguments": [
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
                                        "value": "createdAtTimestamp"
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
                                        "value": "isListed"
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
}; //# sourceMappingURL=getTokens.generated.js.map
}}),

};

//# sourceMappingURL=e10cc_%40superfluid-finance_sdk-core_dist_module_subgraph_queries_2116f4._.js.map