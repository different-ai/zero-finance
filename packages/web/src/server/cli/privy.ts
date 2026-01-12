type PrivyWalletRequest = {
  chain_type:
    | 'ethereum'
    | 'solana'
    | 'stellar'
    | 'cosmos'
    | 'sui'
    | 'tron'
    | 'bitcoin-segwit'
    | 'near'
    | 'ton'
    | 'starknet'
    | 'movement';
  wallet_index?: number;
  policy_ids?: string[];
  additional_signers?: Array<{
    signer_id: string;
    override_policy_ids?: string[];
  }>;
  create_smart_account?: boolean;
};

type PrivyLinkedAccount =
  | { type: 'email'; address: string }
  | { type: 'phone'; address: string };

export type PrivyCreateUserParams = {
  linked_accounts: PrivyLinkedAccount[];
  wallets?: PrivyWalletRequest[];
  create_direct_signer?: boolean;
  custom_metadata?: Record<string, unknown>;
};

export type PrivyPregenerateWalletsParams = {
  user_id: string;
  wallets: PrivyWalletRequest[];
  create_direct_signer?: boolean;
};

function getPrivyCredentials() {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Missing Privy app credentials');
  }

  return { appId, appSecret };
}

function buildAuthHeader(appId: string, appSecret: string) {
  const token = Buffer.from(`${appId}:${appSecret}`).toString('base64');
  return `Basic ${token}`;
}

export async function createPrivyUser(params: PrivyCreateUserParams) {
  const { appId, appSecret } = getPrivyCredentials();

  const response = await fetch('https://auth.privy.io/api/v1/users', {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(appId, appSecret),
      'privy-app-id': appId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Privy create user failed: ${body}`);
  }

  return response.json();
}

export async function pregeneratePrivyWallets(
  params: PrivyPregenerateWalletsParams,
) {
  const { appId, appSecret } = getPrivyCredentials();

  const response = await fetch(
    `https://auth.privy.io/api/v1/apps/${appId}/users/wallet`,
    {
      method: 'POST',
      headers: {
        Authorization: buildAuthHeader(appId, appSecret),
        'privy-app-id': appId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Privy pregenerate wallets failed: ${body}`);
  }

  return response.json();
}
