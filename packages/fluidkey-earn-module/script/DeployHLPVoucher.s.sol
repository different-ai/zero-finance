// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/HLPVoucher.sol";

/**
 * Deploy HLPVoucher contract
 * 
 * Usage:
 * forge script script/DeployHLPVoucher.s.sol:DeployHLPVoucher \
 *   --rpc-url $BASE_RPC_URL \
 *   --broadcast \
 *   --verify \
 *   --etherscan-api-key $BASESCAN_API_KEY
 */
contract DeployHLPVoucher is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying HLPVoucher with deployer:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        HLPVoucher voucher = new HLPVoucher();
        
        console.log("HLPVoucher deployed to:", address(voucher));
        console.log("Owner:", voucher.owner());
        
        // In production, authorize your solver address here:
        // voucher.setAuthorizedSolver(SOLVER_ADDRESS, true);
        
        vm.stopBroadcast();
        
        console.log("\nDeployment successful!");
        console.log("Next steps:");
        console.log("1. Update NEXT_PUBLIC_HLP_VOUCHER_ADDRESS in .env");
        console.log("2. Authorize solver address via setAuthorizedSolver()");
        console.log("3. Test minting a voucher");
    }
}
