# FluidkeyEarnModule Deployment Information

## Deployment Details
- **Network**: Base Mainnet
- **Date**: 2024-05-07
- **Contract Address**: 0xDb7c529890aBfa09De186ed72152f39FB7202eAf
- **BaseScan**: [View on BaseScan](https://basescan.org/address/0xdb7c529890abfa09de186ed72152f39fb7202eaf)

## Configuration
- **CONFIG_HASH**: 27717409500341009931199546606446628373026119427637160854971055607956617712043
- **Relayer Address**: 0xc60d9C89bC4ff854A36802e0AC845Cec81e0DB31
- **Wrapped ETH**: 0x4200000000000000000000000000000000000006

## Vault Configuration
- **USDC Address**: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- **USDC Vault (Seamless)**: 0x616a4E1db48e22028f6bbf20444Cd3b8e3273738

## Deployment Commands
To deploy this contract again or to a new network:

```bash
# Set environment variables
export RPC_URL_BASE="https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
export DEPLOYER_PK="0xYOUR_PRIVATE_KEY_HERE" 
export RELAYER_ADDR="0xYOUR_RELAYER_ADDRESS"
export BASESCAN_KEY="YOUR_BASESCAN_API_KEY"

# Run forge script
forge script script/HyprEarnDeployer.s.sol \
  --rpc-url $RPC_URL_BASE \
  --broadcast \
  --private-key $DEPLOYER_PK \
  --verify -vv
```

## Usage
To add a backup relayer after deployment (recommended):
```solidity
// Call this from the owner address/safe
module.addAuthorizedRelayer(0xBackupRelayerAddress);
```

## Keys and Private Information
To avoid deployer confusion in the future, remember:
1. Private keys must be prefixed with "0x" in the .env file
2. Set proper environment variables when deploying
3. Keep your private keys secure and never commit them to the repository 