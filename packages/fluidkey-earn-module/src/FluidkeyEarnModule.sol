// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.23;

import { IERC20 } from "forge-std/interfaces/IERC20.sol";
import { IERC4626 } from "forge-std/interfaces/IERC4626.sol";
import { SentinelListLib, SENTINEL, ZERO_ADDRESS } from "sentinellist/SentinelList.sol";
import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";
import { ECDSA } from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import { MessageHashUtils } from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";


interface Safe {
    /**
     * @dev Allows a Module to execute a Safe transaction without any further confirmations.
     * @param to Destination address of module transaction.
     * @param value Ether value of module transaction.
     * @param data Data payload of module transaction.
     * @param operation Operation type of module transaction.
     */
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation
    )
        external
        returns (bool success);
}

interface IWrappedNative {
    function deposit() external payable;
}

/**
 * @title FluidkeyEarnModule
 * This module allows Fluidkey to automatically deposit funds into an ERC-4626 vault on behalf of
 * users, using a new config layout to support multiple chainIds and config sets.
 * @dev This contract is based on a contract originally authored by Rhinestone (AutoSavings).
 * The original contract can be found at
 * https://github.com/rhinestonewtf/core-modules/blob/main/src/AutoSavings/AutoSavings.sol (commit
 * 18b057).
 */
contract FluidkeyEarnModule is Ownable {
    using SentinelListLib for SentinelListLib.SentinelList;

    /*//////////////////////////////////////////////////////////////////////////
                            CONSTANTS & STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    error TooManyTokens();
    error EmptyConfigList();
    error ModuleNotInitialized(address account);
    error ModuleAlreadyInitialized(address account);
    error NotAuthorized(address relayer);
    error ConfigNotFound(address token);
    error CannotRemoveSelf();
    error SignatureAlreadyUsed();
    error InvalidConfigHash();

    uint256 internal constant MAX_TOKENS = 100;
    address public constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /// @notice Address of the wrapped native token (like WETH)
    address public immutable wrappedNative;

    /**
     * @dev authorizedRelayers -> bool
     *      A relayer address can initiate autoEarn calls (or sign them).
     */
    mapping(address => bool) public authorizedRelayers;

    /**
     * @dev The config mapping organizes vault addresses by:
     *      config[configHash][chainId][token] = vault
     *      This structure allows multiple chainIds within the same configHash.
     */
    mapping(uint256 => mapping(uint256 => mapping(address => address))) public config;

    /**
     * @dev tokens[configHashChainId] is a SentinelList containing
     *      the set of tokens used in that configHash + chainId pair.
     */
    mapping(uint256 => SentinelListLib.SentinelList) private tokens;

    /**
     * @dev accountConfig[smartAccount] = the configHash being used by that account
     */
    mapping(address => uint256) public accountConfig;

    /**
     * @dev executedHashes helps avoid replay attacks.
     *      For each message hash we store if it's already been used.
     */
    mapping(bytes32 => bool) public executedHashes;

    /// @dev Emitted when a relayer is added
    event AddAuthorizedRelayer(address indexed relayer);

    /// @dev Emitted when a relayer is removed
    event RemoveAuthorizedRelayer(address indexed relayer);

    /// @dev Emitted when the module is initialized (installed) on a Safe
    event ModuleInitialized(address indexed account);

    /// @dev Emitted when the module is uninstalled
    event ModuleUninitialized(address indexed account);

    /// @dev Emitted when a new config (chainId + token) is set for a specific configHash
    event ConfigSet(uint256 indexed configHash, uint256 indexed chainId, address token);

    /// @dev Emitted when a deposit has been executed in the vault
    event AutoEarnExecuted(address indexed smartAccount, address indexed token, uint256 amountIn);

    /// @dev Emitted when an account updates its configHash to a new value
    event ConfigHashChanged(address indexed account, uint256 oldConfigHash, uint256 newConfigHash);

    /*//////////////////////////////////////////////////////////////////////////
                                     STRUCTS
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Struct used to store and retrieve user configs on the chain
     *      The user must ensure the list is sorted by chainId and token before hashing.
     */
    struct ConfigInput {
        uint256 chainId; // chain id to which the token+vault mapping belongs
        address token; // address of the token
        address vault; // address of the vault
    }

    /**
     * @dev Struct used to retrieve existing configurations
     *      specifically for the chain the contract is executing on.
     */
    struct ConfigWithToken {
        address token; // address of the token
        address vault; // address of the vault
    }

    /*//////////////////////////////////////////////////////////////////////////
                                 CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Deploys the FluidkeyEarnModule contract
     * @param _authorizedRelayer The first authorized relayer
     * @param _wrappedNative The address of the wrapped native token
     * @param _owner The owner address for this module
     */
    constructor(address _authorizedRelayer, address _wrappedNative, address _owner)
        Ownable(_owner)
    {
        authorizedRelayers[_authorizedRelayer] = true;
        emit AddAuthorizedRelayer(_authorizedRelayer);

        wrappedNative = _wrappedNative;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Modifier to check if the caller is an authorized relayer or the owner
     */
    modifier onlyAuthorizedRelayer() {
        if (!authorizedRelayers[msg.sender] && msg.sender != owner()) {
            revert NotAuthorized(msg.sender);
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     CONFIG
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Adds a new authorized relayer
     * @notice The caller must be either an existing authorized relayer or the owner
     * @param newRelayer address of the new relayer
     */
    function addAuthorizedRelayer(address newRelayer) external onlyAuthorizedRelayer {
        authorizedRelayers[newRelayer] = true;
        emit AddAuthorizedRelayer(newRelayer);
    }

    /**
     * @dev Removes an authorized relayer
     * @notice The caller must be either an existing authorized relayer or the owner
     * @param relayer address of the relayer to be removed
     */
    function removeAuthorizedRelayer(address relayer) external onlyAuthorizedRelayer {
        if (relayer == msg.sender) revert CannotRemoveSelf();
        delete authorizedRelayers[relayer];
        emit RemoveAuthorizedRelayer(relayer);
    }

    /**
     * @dev Sets the configuration for future usage, identified by a unique configHash.
     *      The input must be sorted by (chainId, token).
     *      We store each (chainId, token, vault) in config[configHash][chainId][token].
     *      We also push the token into a sentinel list keyed by keccak256(configHash + chainId).
     * @notice The caller must be the owner of this module.
     * @param newConfigs array of (token, vault, chainId)
     */
    function setConfig(ConfigInput[] calldata newConfigs) external onlyOwner {
        if (newConfigs.length == 0) revert EmptyConfigList();

        // compute configHash from entire list
        bytes32 rawHash = keccak256(abi.encode(newConfigs));
        uint256 configHash_ = uint256(rawHash);

        for (uint256 i = 0; i < newConfigs.length; i++) {
            address _token = newConfigs[i].token;
            address _vault = newConfigs[i].vault;
            uint256 _chainId = newConfigs[i].chainId;

            // configHashChainId is used to store tokens in a sentinel list
            uint256 configHashChainId =
                uint256(keccak256(abi.encodePacked(configHash_, _chainId)));

            // if not initialized yet, init the sentinel list
            if (!tokens[configHashChainId].alreadyInitialized()) {
                tokens[configHashChainId].init();
            }

            // check limit & push if token not already present
            if (!tokens[configHashChainId].contains(_token)) {
                (, address next) =
                    tokens[configHashChainId].getEntriesPaginated(SENTINEL, MAX_TOKENS);
                if (next != SENTINEL && next != ZERO_ADDRESS) revert TooManyTokens();
                tokens[configHashChainId].push(_token);
            }

            // store in config
            config[configHash_][_chainId][_token] = _vault;

            emit ConfigSet(configHash_, _chainId, _token);
        }
    }

    /**
     * @dev Handles module installation to a specific Safe.
     *      The only operation is to store the `configHash` inside `accountConfig`.
     * @notice This function is called once at the time of module install.
     * @param data encoded uint256 configHash
     */
    function onInstall(bytes calldata data) external {
        address account = msg.sender;

        if (isInitialized(account)) revert ModuleAlreadyInitialized(account);

        uint256 configHash_ = abi.decode(data, (uint256));
        if (configHash_ == 0) revert InvalidConfigHash();

        accountConfig[account] = configHash_;

        emit ModuleInitialized(account);
        emit ConfigHashChanged(account, 0x0, configHash_);
    }

    /**
     * @dev Handles the uninstallation of the module and clears the configHash for that Safe.
     * @notice The data parameter is not used in this version.
     */
    function onUninstall() external {
        address account = msg.sender;

        accountConfig[account] = 0;

        emit ModuleUninitialized(account);
    }

    /**
     * @dev Checks if the module is initialized for a given smartAccount.
     * @param smartAccount address of the smart account
     * @return true if the module is initialized (i.e., configHash != 0), false otherwise
     */
    function isInitialized(address smartAccount) public view returns (bool) {
        return accountConfig[smartAccount] != 0;
    }

    /**
     * @dev Allows an already-initialized account to switch to a different configHash.
     *      This can be used if the module owner has created a new or updated config set,
     *      and the account wants to adopt it.
     * @notice The caller must be the Safe itself (i.e. msg.sender) and must already be initialized.
     * @param newConfigHash The new configHash to assign to the caller’s accountConfig.
     */
    function changeConfigHash(uint256 newConfigHash) external {
       address account = msg.sender;
       if (!isInitialized(account)) revert ModuleNotInitialized(account);
       if (newConfigHash == 0) revert InvalidConfigHash();
       uint256 oldConfigHash = accountConfig[account];
       accountConfig[account] = newConfigHash;
       emit ConfigHashChanged(account, oldConfigHash, newConfigHash);
   }

    /*//////////////////////////////////////////////////////////////////////////
                                 READ METHODS
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Gets a list of all tokens for a given configHash and chainId.
     * @param configHash_ The configHash used to store the token addresses
     * @param chainId_ The chainId corresponding to the tokens to retrieve
     * @return tokensArray The array of token addresses
     */
    function getTokens(uint256 configHash_, uint256 chainId_)
        external
        view
        returns (address[] memory tokensArray)
    {
        uint256 configHashChainId = uint256(
            keccak256(abi.encodePacked(configHash_, chainId_))
        );

        (tokensArray, ) = tokens[configHashChainId].getEntriesPaginated(
            SENTINEL,
            MAX_TOKENS
        );
    }

    /**
     * @dev Gets all configurations for the chain the contract is executing on, for a given account.
     *      It returns the data in a `ConfigWithToken` format (token + vault).
     * @param account address of the account
     * @return configsArray Array of (token, vault) for the current chain
     */
    function getAllConfigs(address account)
        external
        view
        returns (ConfigWithToken[] memory)
    {
        uint256 configHash_ = accountConfig[account];
        if (configHash_ == 0) {
            // no config set, return empty
            return new ConfigWithToken[](0);
        }

        uint256 chainId_ = block.chainid;
        uint256 configHashChainId = uint256(
            keccak256(abi.encodePacked(configHash_, chainId_))
        );

        (address[] memory tokensArray, ) =
            tokens[configHashChainId].getEntriesPaginated(SENTINEL, MAX_TOKENS);
        ConfigWithToken[] memory configsArray = new ConfigWithToken[](tokensArray.length);

        for (uint256 i; i < tokensArray.length; i++) {
            address _token = tokensArray[i];
            address _vault = config[configHash_][chainId_][_token];
            configsArray[i] = ConfigWithToken({ token: _token, vault: _vault });
        }

        return configsArray;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     MODULE LOGIC
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Initiates the auto-earn process for the specified token and amount.
     *      This overload checks the relayer's authorization via signature.
     * @notice This function reverts if the signature has already been used or if
     *         the relayer is not authorized.
     * @param token The address of the token to be saved.
     * @param amountToSave The amount of tokens to deposit into the vault.
     * @param safe The address of the Safe from which the transaction is executed.
     * @param nonce A unique identifier for the transaction.
     * @param signature A signature from the relayer verifying the transaction details.
     */
    function autoEarn(
        address token,
        uint256 amountToSave,
        address safe,
        uint256 nonce,
        bytes memory signature
    )
        external
    {
        // signature-based approach
        bytes32 hash = keccak256(
            abi.encodePacked(block.chainid, token, amountToSave, safe, nonce)
        );
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(hash);

        if (executedHashes[ethSignedHash]) revert SignatureAlreadyUsed();

        address relayer = ECDSA.recover(ethSignedHash, signature);
        if (!authorizedRelayers[relayer]) revert NotAuthorized(relayer);

        executedHashes[ethSignedHash] = true;

        // execute the auto-earn process
        _autoEarn(token, amountToSave, safe);
    }

    /**
     * @dev Initiates the auto-earn process for the specified token and amount.
     *      This overload assumes the caller is already an authorized relayer.
     * @param token The address of the token to be saved.
     * @param amountToSave The amount of tokens to deposit into the vault.
     * @param safe The address of the Safe from which the transaction is executed.
     */
    function autoEarn(
        address token,
        uint256 amountToSave,
        address safe
    )
        external
        onlyAuthorizedRelayer
    {
        _autoEarn(token, amountToSave, safe);
    }

    /**
     * @dev Executes the auto-earn logic.
     *      1. Fetch the configHash of the Safe, verify the vault for the chainId.
     *      2. Wrap native tokens if necessary.
     *      3. Approve the vault to spend tokens on behalf of the Safe.
     *      4. Deposit tokens into the vault.
     * @param token address of the token received
     * @param amountToSave amount received by the user
     * @param safe address of the user's Safe to execute the transaction on
     */
    function _autoEarn(address token, uint256 amountToSave, address safe) private {
        if (!isInitialized(safe)) revert ModuleNotInitialized(safe);

        // derive the vault from config
        uint256 configHash_ = accountConfig[safe];
        address vaultAddress = config[configHash_][block.chainid][token];
        if (vaultAddress == address(0)) {
            revert ConfigNotFound(token);
        }

        Safe safeInstance = Safe(safe);
        IERC4626 vault = IERC4626(vaultAddress);

        IERC20 tokenToSave;
        // if token is native, wrap it
        if (token == NATIVE_TOKEN) {
            bool wrappingSuccess = safeInstance.execTransactionFromModule(
                wrappedNative,
                amountToSave,
                abi.encodeWithSelector(IWrappedNative.deposit.selector),
                0
            );
            if (!wrappingSuccess) {
                revert("Failed to wrap native token");
            }
            tokenToSave = IERC20(wrappedNative);
        } else {
            tokenToSave = IERC20(token);
        }

        // approve vault to spend tokens
        bool approvalSuccess = safeInstance.execTransactionFromModule(
            address(tokenToSave),
            0,
            abi.encodeWithSelector(IERC20.approve.selector, address(vault), amountToSave),
            0
        );
        if (!approvalSuccess) {
            revert("Failed to approve vault to spend tokens");
        }

        // deposit to vault
        bool depositSuccess = safeInstance.execTransactionFromModule(
            address(vault),
            0,
            abi.encodeWithSelector(IERC4626.deposit.selector, amountToSave, safe),
            0
        );
        if (!depositSuccess) {
            revert("Failed to deposit tokens into the vault");
        }

        emit AutoEarnExecuted(safe, token, amountToSave);
    }
}
