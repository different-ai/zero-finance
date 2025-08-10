export const BASE_CHAIN_ID = 8453;

export type BaseVault = {
  id: "seamless" | "gauntletCore" | "steakhouse";
  name: string;
  address: `0x${string}`;
  risk: "Conservative" | "Balanced" | "High";
  curator: string;
  appUrl: string;
};

export const BASE_USDC_VAULTS: BaseVault[] = [
  {
    id: "seamless",
    name: "Seamless USDC",
    address: "0x616a4E1db48e22028f6bbf20444Cd3b8e3273738",
    risk: "Balanced",
    curator: "Gauntlet",
    appUrl: "https://app.morpho.org/base/vault/0x616a4E1db48e22028f6bbf20444Cd3b8e3273738/seamless-usdc-vault",
  },
  {
    id: "steakhouse",
    name: "Steakhouse USDC",
    address: "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183",
    risk: "Balanced",
    curator: "Steakhouse",
    appUrl: "https://app.morpho.org/base/vault/0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183/steakhouse-usdc",
  },
];