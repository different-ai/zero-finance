# Deployments Directory

This directory contains deployment information for the FluidkeyEarnModule on various networks.

## Structure

```
deployments/
  ├── README.md                # This file
  ├── base/                    # Base Mainnet deployments
  │   ├── deployment-info.md   # Human-readable deployment details
  │   └── deployment-info.json # Machine-readable deployment info
  └── [network]/               # Other network deployments following the same pattern
```

## Files

- `deployment-info.md`: Contains human-readable information about the deployment, including addresses, configuration hashes, and instructions for redeployment.
- `deployment-info.json`: Contains the same information in a machine-readable JSON format for programmatic use.

## Usage

You can reference these files in your frontend or scripts to get the latest deployed contract addresses and configuration details. For example:

```typescript
import baseDeployment from './deployments/base/deployment-info.json';

const moduleAddress = baseDeployment.deployment.contractAddress;
```

## Adding New Deployments

When deploying to a new network or redeploying to an existing network:

1. Create a directory for the network if it doesn't exist
2. Update the deployment information files with the new deployment details
3. Commit the changes to the repository 