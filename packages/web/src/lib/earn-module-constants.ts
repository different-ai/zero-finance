import { type Address, toHex } from 'viem';

export const AUTO_EARN_MODULE_ADDRESS: Address = '0xDb7c529890aBfa09De186ed72152f39FB7202eAf';

const CONFIG_HASH_DECIMAL = '27717409500341009931199546606446628373026119427637160854971055607956617712043';

/**
 * The configuration hash for the earn module, converted to a 32-byte hex string.
 * This is used in the `onInstall` function call when enabling the module.
 */
export const PADDED_CONFIG_HASH = toHex(BigInt(CONFIG_HASH_DECIMAL), { size: 32 }); 