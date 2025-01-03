module.exports = {

"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AgreementClassRegisteredEventsDocument": (()=>AgreementClassRegisteredEventsDocument),
    "AgreementClassUpdatedEventsDocument": (()=>AgreementClassUpdatedEventsDocument),
    "AgreementLiquidatedByEventsDocument": (()=>AgreementLiquidatedByEventsDocument),
    "AppRegisteredEventsDocument": (()=>AppRegisteredEventsDocument),
    "BurnedEventsDocument": (()=>BurnedEventsDocument),
    "CfaV1LiquidationPeriodChangedEventsDocument": (()=>CfaV1LiquidationPeriodChangedEventsDocument),
    "ConfigChangedEventsDocument": (()=>ConfigChangedEventsDocument),
    "CustomSuperTokenCreatedEventsDocument": (()=>CustomSuperTokenCreatedEventsDocument),
    "EventsDocument": (()=>EventsDocument),
    "FlowOperatorUpdatedEventsDocument": (()=>FlowOperatorUpdatedEventsDocument),
    "FlowUpdatedEventsDocument": (()=>FlowUpdatedEventsDocument),
    "GovernanceReplacedEventsDocument": (()=>GovernanceReplacedEventsDocument),
    "IndexCreatedEventsDocument": (()=>IndexCreatedEventsDocument),
    "IndexDistributionClaimedEventsDocument": (()=>IndexDistributionClaimedEventsDocument),
    "IndexSubscribedEventsDocument": (()=>IndexSubscribedEventsDocument),
    "IndexUnitsUpdatedEventsDocument": (()=>IndexUnitsUpdatedEventsDocument),
    "IndexUnsubscribedEventsDocument": (()=>IndexUnsubscribedEventsDocument),
    "IndexUpdatedEventsDocument": (()=>IndexUpdatedEventsDocument),
    "JailEventsDocument": (()=>JailEventsDocument),
    "MintedEventsDocument": (()=>MintedEventsDocument),
    "RewardAddressChangedEventsDocument": (()=>RewardAddressChangedEventsDocument),
    "RoleAdminChangedEventsDocument": (()=>RoleAdminChangedEventsDocument),
    "RoleGrantedEventsDocument": (()=>RoleGrantedEventsDocument),
    "RoleRevokedEventsDocument": (()=>RoleRevokedEventsDocument),
    "SentEventsDocument": (()=>SentEventsDocument),
    "SetEventsDocument": (()=>SetEventsDocument),
    "SubscriptionApprovedEventsDocument": (()=>SubscriptionApprovedEventsDocument),
    "SubscriptionDistributionClaimedEventsDocument": (()=>SubscriptionDistributionClaimedEventsDocument),
    "SubscriptionRevokedEventsDocument": (()=>SubscriptionRevokedEventsDocument),
    "SubscriptionUnitsUpdatedEventsDocument": (()=>SubscriptionUnitsUpdatedEventsDocument),
    "SuperTokenCreatedEventsDocument": (()=>SuperTokenCreatedEventsDocument),
    "SuperTokenFactoryUpdatedEventsDocument": (()=>SuperTokenFactoryUpdatedEventsDocument),
    "SuperTokenLogicCreatedEventsDocument": (()=>SuperTokenLogicCreatedEventsDocument),
    "SuperTokenLogicUpdatedEventsDocument": (()=>SuperTokenLogicUpdatedEventsDocument),
    "TokenDowngradedEventsDocument": (()=>TokenDowngradedEventsDocument),
    "TokenUpgradedEventsDocument": (()=>TokenUpgradedEventsDocument),
    "TransferEventsDocument": (()=>TransferEventsDocument),
    "TrustedForwarderChangedEventsDocument": (()=>TrustedForwarderChangedEventsDocument)
});
const FlowUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "flowUpdatedEvents"
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
                            "value": "FlowUpdatedEvent_filter"
                        }
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
                            "value": "FlowUpdatedEvent_orderBy"
                        }
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
                            "value": "flowUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const FlowOperatorUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "flowOperatorUpdatedEvents"
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
                            "value": "FlowOperatorUpdatedEvent_filter"
                        }
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
                            "value": "FlowOperatorUpdatedEvent_orderBy"
                        }
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
                            "value": "flowOperatorUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const IndexCreatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexCreatedEvents"
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
                            "value": "IndexCreatedEvent_filter"
                        }
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
                            "value": "IndexCreatedEvent_orderBy"
                        }
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
                            "value": "indexCreatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const IndexDistributionClaimedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexDistributionClaimedEvents"
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
                            "value": "IndexDistributionClaimedEvent_filter"
                        }
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
                            "value": "IndexDistributionClaimedEvent_orderBy"
                        }
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
                            "value": "indexDistributionClaimedEvents"
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
                    }
                ]
            }
        }
    ]
};
const IndexUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexUpdatedEvents"
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
                            "value": "IndexUpdatedEvent_filter"
                        }
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
                            "value": "IndexUpdatedEvent_orderBy"
                        }
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
                            "value": "indexUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const IndexSubscribedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexSubscribedEvents"
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
                            "value": "IndexSubscribedEvent_filter"
                        }
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
                            "value": "IndexSubscribedEvent_orderBy"
                        }
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
                            "value": "indexSubscribedEvents"
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
                    }
                ]
            }
        }
    ]
};
const IndexUnitsUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexUnitsUpdatedEvents"
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
                            "value": "IndexUnitsUpdatedEvent_filter"
                        }
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
                            "value": "IndexUnitsUpdatedEvent_orderBy"
                        }
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
                            "value": "indexUnitsUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const IndexUnsubscribedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "indexUnsubscribedEvents"
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
                            "value": "IndexUnsubscribedEvent_filter"
                        }
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
                            "value": "IndexUnsubscribedEvent_orderBy"
                        }
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
                            "value": "indexUnsubscribedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SubscriptionApprovedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "subscriptionApprovedEvents"
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
                            "value": "SubscriptionApprovedEvent_filter"
                        }
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
                            "value": "SubscriptionApprovedEvent_orderBy"
                        }
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
                            "value": "subscriptionApprovedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SubscriptionDistributionClaimedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "subscriptionDistributionClaimedEvents"
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
                            "value": "SubscriptionDistributionClaimedEvent_filter"
                        }
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
                            "value": "SubscriptionDistributionClaimedEvent_orderBy"
                        }
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
                            "value": "subscriptionDistributionClaimedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SubscriptionRevokedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "subscriptionRevokedEvents"
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
                            "value": "SubscriptionRevokedEvent_filter"
                        }
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
                            "value": "SubscriptionRevokedEvent_orderBy"
                        }
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
                            "value": "subscriptionRevokedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SubscriptionUnitsUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "subscriptionUnitsUpdatedEvents"
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
                            "value": "SubscriptionUnitsUpdatedEvent_filter"
                        }
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
                            "value": "SubscriptionUnitsUpdatedEvent_orderBy"
                        }
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
                            "value": "subscriptionUnitsUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const TransferEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "transferEvents"
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
                            "value": "TransferEvent_filter"
                        }
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
                            "value": "TransferEvent_orderBy"
                        }
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
                            "value": "transferEvents"
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
                    }
                ]
            }
        }
    ]
};
const TokenUpgradedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "tokenUpgradedEvents"
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
                            "value": "TokenUpgradedEvent_filter"
                        }
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
                            "value": "TokenUpgradedEvent_orderBy"
                        }
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
                            "value": "tokenUpgradedEvents"
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
                    }
                ]
            }
        }
    ]
};
const TokenDowngradedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "tokenDowngradedEvents"
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
                            "value": "TokenDowngradedEvent_filter"
                        }
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
                            "value": "TokenDowngradedEvent_orderBy"
                        }
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
                            "value": "tokenDowngradedEvents"
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
                    }
                ]
            }
        }
    ]
};
const AgreementClassRegisteredEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "agreementClassRegisteredEvents"
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
                            "value": "AgreementClassRegisteredEvent_filter"
                        }
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
                            "value": "AgreementClassRegisteredEvent_orderBy"
                        }
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
                            "value": "agreementClassRegisteredEvents"
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
                    }
                ]
            }
        }
    ]
};
const AgreementClassUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "agreementClassUpdatedEvents"
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
                            "value": "AgreementClassUpdatedEvent_filter"
                        }
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
                            "value": "AgreementClassUpdatedEvent_orderBy"
                        }
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
                            "value": "agreementClassUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const AppRegisteredEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "appRegisteredEvents"
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
                            "value": "AppRegisteredEvent_filter"
                        }
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
                            "value": "AppRegisteredEvent_orderBy"
                        }
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
                            "value": "appRegisteredEvents"
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
                    }
                ]
            }
        }
    ]
};
const GovernanceReplacedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "governanceReplacedEvents"
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
                            "value": "GovernanceReplacedEvent_filter"
                        }
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
                            "value": "GovernanceReplacedEvent_orderBy"
                        }
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
                            "value": "governanceReplacedEvents"
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
                    }
                ]
            }
        }
    ]
};
const JailEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "jailEvents"
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
                            "value": "JailEvent_filter"
                        }
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
                            "value": "JailEvent_orderBy"
                        }
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
                            "value": "jailEvents"
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
                    }
                ]
            }
        }
    ]
};
const SuperTokenFactoryUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "superTokenFactoryUpdatedEvents"
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
                            "value": "SuperTokenFactoryUpdatedEvent_filter"
                        }
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
                            "value": "SuperTokenFactoryUpdatedEvent_orderBy"
                        }
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
                            "value": "superTokenFactoryUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SuperTokenLogicUpdatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "superTokenLogicUpdatedEvents"
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
                            "value": "SuperTokenLogicUpdatedEvent_filter"
                        }
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
                            "value": "SuperTokenLogicUpdatedEvent_orderBy"
                        }
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
                            "value": "superTokenLogicUpdatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const RoleAdminChangedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "roleAdminChangedEvents"
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
                            "value": "RoleAdminChangedEvent_filter"
                        }
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
                            "value": "RoleAdminChangedEvent_orderBy"
                        }
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
                            "value": "roleAdminChangedEvents"
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
                    }
                ]
            }
        }
    ]
};
const RoleGrantedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "roleGrantedEvents"
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
                            "value": "RoleGrantedEvent_filter"
                        }
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
                            "value": "RoleGrantedEvent_orderBy"
                        }
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
                            "value": "roleGrantedEvents"
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
                    }
                ]
            }
        }
    ]
};
const RoleRevokedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "roleRevokedEvents"
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
                            "value": "RoleRevokedEvent_filter"
                        }
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
                            "value": "RoleRevokedEvent_orderBy"
                        }
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
                            "value": "roleRevokedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SetEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "setEvents"
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
                            "value": "SetEvent_filter"
                        }
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
                            "value": "SetEvent_orderBy"
                        }
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
                            "value": "setEvents"
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
                    }
                ]
            }
        }
    ]
};
const CfaV1LiquidationPeriodChangedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "cfaV1LiquidationPeriodChangedEvents"
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
                            "value": "CFAv1LiquidationPeriodChangedEvent_filter"
                        }
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
                            "value": "CFAv1LiquidationPeriodChangedEvent_orderBy"
                        }
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
                            "value": "cfav1LiquidationPeriodChangedEvents"
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
                    }
                ]
            }
        }
    ]
};
const ConfigChangedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "configChangedEvents"
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
                            "value": "ConfigChangedEvent_filter"
                        }
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
                            "value": "ConfigChangedEvent_orderBy"
                        }
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
                            "value": "configChangedEvents"
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
                    }
                ]
            }
        }
    ]
};
const RewardAddressChangedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "rewardAddressChangedEvents"
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
                            "value": "RewardAddressChangedEvent_filter"
                        }
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
                            "value": "RewardAddressChangedEvent_orderBy"
                        }
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
                            "value": "rewardAddressChangedEvents"
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
                    }
                ]
            }
        }
    ]
};
const TrustedForwarderChangedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "trustedForwarderChangedEvents"
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
                            "value": "TrustedForwarderChangedEvent_filter"
                        }
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
                            "value": "TrustedForwarderChangedEvent_orderBy"
                        }
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
                            "value": "trustedForwarderChangedEvents"
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
                    }
                ]
            }
        }
    ]
};
const AgreementLiquidatedByEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "agreementLiquidatedByEvents"
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
                            "value": "AgreementLiquidatedByEvent_filter"
                        }
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
                            "value": "AgreementLiquidatedByEvent_orderBy"
                        }
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
                            "value": "agreementLiquidatedByEvents"
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
                    }
                ]
            }
        }
    ]
};
const BurnedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "burnedEvents"
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
                            "value": "BurnedEvent_filter"
                        }
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
                            "value": "BurnedEvent_orderBy"
                        }
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
                            "value": "burnedEvents"
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
                    }
                ]
            }
        }
    ]
};
const MintedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "mintedEvents"
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
                            "value": "MintedEvent_filter"
                        }
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
                            "value": "MintedEvent_orderBy"
                        }
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
                            "value": "mintedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SentEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "sentEvents"
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
                            "value": "SentEvent_filter"
                        }
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
                            "value": "SentEvent_orderBy"
                        }
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
                            "value": "sentEvents"
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
                    }
                ]
            }
        }
    ]
};
const CustomSuperTokenCreatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "customSuperTokenCreatedEvents"
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
                            "value": "CustomSuperTokenCreatedEvent_filter"
                        }
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
                            "value": "CustomSuperTokenCreatedEvent_orderBy"
                        }
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
                            "value": "customSuperTokenCreatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SuperTokenCreatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "superTokenCreatedEvents"
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
                            "value": "SuperTokenCreatedEvent_filter"
                        }
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
                            "value": "SuperTokenCreatedEvent_orderBy"
                        }
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
                            "value": "superTokenCreatedEvents"
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
                    }
                ]
            }
        }
    ]
};
const SuperTokenLogicCreatedEventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "superTokenLogicCreatedEvents"
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
                            "value": "SuperTokenLogicCreatedEvent_filter"
                        }
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
                            "value": "SuperTokenLogicCreatedEvent_orderBy"
                        }
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
                            "value": "superTokenLogicCreatedEvents"
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
};
const EventsDocument = {
    "kind": "Document",
    "definitions": [
        {
            "kind": "OperationDefinition",
            "operation": "query",
            "name": {
                "kind": "Name",
                "value": "events"
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
                                    "value": "block"
                                },
                                "value": {
                                    "kind": "Variable",
                                    "name": {
                                        "kind": "Name",
                                        "value": "block"
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
                                        "value": "timestamp"
                                    }
                                },
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
}; //# sourceMappingURL=events.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "EventQueryHandler": (()=>EventQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js [app-ssr] (ecmascript)");
;
;
;
class EventQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "addresses"
                ],
                tokenKeys: []
            });
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventsDocument"];
    }
    getRelevantAddressesFromResultCore() {
        return {
            accounts: [],
            tokens: []
        };
    }
    mapFromSubgraphResponse(response) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGetAllEventsQueryEvents"])(response.events);
    }
} //# sourceMappingURL=events.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/flowUpdatedEvent.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "FlowUpdatedEventQueryHandler": (()=>FlowUpdatedEventQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js [app-ssr] (ecmascript)");
;
;
;
class FlowUpdatedEventQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "sender",
                    "receiver",
                    "flowOperator"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FlowUpdatedEventsDocument"];
    }
    getRelevantAddressesFromResultCore(result) {
        return {
            accounts: [
                result.sender,
                result.receiver
            ],
            tokens: [
                result.token
            ]
        };
    }
    mapFromSubgraphResponse(response) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGetAllEventsQueryEvents"])(response.flowUpdatedEvents);
    }
} //# sourceMappingURL=flowUpdatedEvent.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/indexUpdatedEvent.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IndexUpdatedEventQueryHandler": (()=>IndexUpdatedEventQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js [app-ssr] (ecmascript)");
;
;
;
class IndexUpdatedEventQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
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
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexUpdatedEventsDocument"];
    }
    getRelevantAddressesFromResultCore(result) {
        return {
            accounts: [
                result.publisher
            ],
            tokens: [
                result.token
            ]
        };
    }
    mapFromSubgraphResponse(response) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGetAllEventsQueryEvents"])(response.indexUpdatedEvents);
    }
} //# sourceMappingURL=indexUpdatedEvent.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/subscriptionUnitsUpdatedEvents.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SubscriptionUnitsUpdatedEventQueryHandler": (()=>SubscriptionUnitsUpdatedEventQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js [app-ssr] (ecmascript)");
;
;
;
class SubscriptionUnitsUpdatedEventQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "publisher",
                    "subscriber"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubscriptionUnitsUpdatedEventsDocument"];
    }
    getRelevantAddressesFromResultCore(result) {
        return {
            accounts: [
                result.publisher,
                result.subscriber
            ],
            tokens: [
                result.token
            ]
        };
    }
    mapFromSubgraphResponse(response) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGetAllEventsQueryEvents"])(response.subscriptionUnitsUpdatedEvents);
    }
} //# sourceMappingURL=subscriptionUnitsUpdatedEvents.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/transferEvents.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TransferEventQueryHandler": (()=>TransferEventQueryHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js [app-ssr] (ecmascript)");
;
;
;
class TransferEventQueryHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"] {
    constructor(){
        super(...arguments);
        this.getAddressFieldKeysFromFilter = ()=>({
                accountKeys: [
                    "from",
                    "to"
                ],
                tokenKeys: [
                    "token"
                ]
            });
        this.requestDocument = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$generated$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferEventsDocument"];
    }
    getRelevantAddressesFromResultCore(result) {
        return {
            accounts: [
                result.from,
                result.to
            ],
            tokens: [
                result.token
            ]
        };
    }
    mapFromSubgraphResponse(response) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGetAllEventsQueryEvents"])(response.transferEvents);
    }
} //# sourceMappingURL=transferEvents.js.map
}}),

};

//# sourceMappingURL=e10cc_%40superfluid-finance_sdk-core_dist_module_subgraph_events_316238._.js.map