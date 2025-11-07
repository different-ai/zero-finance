// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HLPVoucher
 * @notice NFT representing HLP vault positions on Hyperliquid
 * @dev Deployed on Base, represents off-chain HLP holdings
 * 
 * How it works:
 * 1. User wants to deposit to HLP vault on Hyperliquid
 * 2. Solver bridges USDC to Hyperliquid and deposits to HLP
 * 3. Solver mints voucher NFT to user's Safe on Base
 * 4. User can redeem voucher later to withdraw from HLP
 */
contract HLPVoucher is ERC721, Ownable {
    struct HLPPosition {
        uint256 hlpShares;           // HLP shares on Hyperliquid
        string hyperliquidAddress;   // User's Hyperliquid address (where HLP is held)
        uint256 depositedAt;         // Timestamp of deposit
        bytes32 intentHash;          // Original intent hash
        uint256 usdcValue;          // USDC value at time of deposit (for display)
    }
    
    mapping(uint256 => HLPPosition) public positions;
    uint256 public nextTokenId;
    
    // Authorized solvers who can mint vouchers
    mapping(address => bool) public authorizedSolvers;
    
    event VoucherMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 hlpShares,
        string hyperliquidAddress,
        bytes32 intentHash,
        uint256 usdcValue
    );
    
    event VoucherRedeemed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 hlpShares,
        string hyperliquidAddress
    );
    
    event SolverAuthorized(address indexed solver, bool authorized);
    
    constructor() ERC721("Zero Finance HLP Voucher", "ZF-HLP") Ownable(msg.sender) {}
    
    /**
     * @notice Solver mints voucher after depositing to HLP on Hyperliquid
     * @param to User's Safe address on Base
     * @param hlpShares Number of HLP shares deposited
     * @param hyperliquidAddress Address on Hyperliquid where HLP is held
     * @param intentHash Original intent hash
     * @param usdcValue USDC value at time of deposit
     */
    function mintVoucher(
        address to,
        uint256 hlpShares,
        string memory hyperliquidAddress,
        bytes32 intentHash,
        uint256 usdcValue
    ) external returns (uint256 tokenId) {
        require(authorizedSolvers[msg.sender], "Only authorized solvers");
        require(hlpShares > 0, "Invalid shares");
        require(bytes(hyperliquidAddress).length > 0, "Invalid address");
        require(to != address(0), "Invalid recipient");
        
        tokenId = nextTokenId++;
        
        positions[tokenId] = HLPPosition({
            hlpShares: hlpShares,
            hyperliquidAddress: hyperliquidAddress,
            depositedAt: block.timestamp,
            intentHash: intentHash,
            usdcValue: usdcValue
        });
        
        _mint(to, tokenId);
        
        emit VoucherMinted(
            tokenId,
            to,
            hlpShares,
            hyperliquidAddress,
            intentHash,
            usdcValue
        );
    }
    
    /**
     * @notice User redeems voucher to initiate HLP withdrawal
     * @dev Burns the voucher and emits event for solver to process withdrawal
     * @param tokenId The voucher token ID to redeem
     */
    function redeemVoucher(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        
        HLPPosition memory position = positions[tokenId];
        
        // Burn voucher
        _burn(tokenId);
        
        // Delete position data to save gas
        delete positions[tokenId];
        
        // Emit event for solver to process withdrawal
        emit VoucherRedeemed(
            tokenId,
            msg.sender,
            position.hlpShares,
            position.hyperliquidAddress
        );
    }
    
    /**
     * @notice Get position details for a voucher
     * @param tokenId The voucher token ID
     */
    function getPosition(uint256 tokenId) external view returns (HLPPosition memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return positions[tokenId];
    }
    
    /**
     * @notice Owner can add/remove authorized solvers
     * @param solver Address of the solver
     * @param authorized Whether to authorize or deauthorize
     */
    function setAuthorizedSolver(address solver, bool authorized) external onlyOwner {
        require(solver != address(0), "Invalid solver address");
        authorizedSolvers[solver] = authorized;
        emit SolverAuthorized(solver, authorized);
    }
    
    /**
     * @notice Get all vouchers owned by an address
     * @dev This is a helper for frontends, iterates through tokens
     * @param owner Address to check
     * @return tokenIds Array of token IDs owned by the address
     */
    function getVouchersByOwner(address owner) external view returns (uint256[] memory tokenIds) {
        uint256 balance = balanceOf(owner);
        tokenIds = new uint256[](balance);
        uint256 currentIndex = 0;
        
        // Iterate through all minted tokens to find owner's tokens
        // Note: This is gas-intensive, only for view functions
        for (uint256 i = 0; i < nextTokenId && currentIndex < balance; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @notice Override tokenURI to provide metadata
     * @param tokenId The voucher token ID
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        // In production, this would return proper metadata JSON
        // For now, return a simple string
        return string(
            abi.encodePacked(
                "Zero Finance HLP Voucher #",
                _toString(tokenId)
            )
        );
    }
    
    /**
     * @notice Helper to convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
