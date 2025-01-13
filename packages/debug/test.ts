/*************************************************
 * COMPLETE DEBUG SCRIPT: Encrypted Request Creation
 *************************************************/
import EthereumPrivateKeyCipherProvider from '../desktop/electron/services/ehtereum-private-key-cipher-provider';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/epk-signature';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { ethers } from 'ethers';

/**
 * Mock service to generate an ephemeral key
 * This mimics what ephemeralKeyService would do
 */
function generateEphemeralKey() {
  const wallet = ethers.Wallet.createRandom();
  const publicKey = wallet.publicKey; // Uncompressed public key
  const token = ethers.utils.hexlify(ethers.utils.randomBytes(32)); // Random token
  return { publicKey, token };
}

async function debugEphemeralRequest() {
  console.log('\n=== STEP 1: Generate Ephemeral Key ===');
  const { publicKey, token } = generateEphemeralKey();
  console.log('Ephemeral Key (publicKey):', publicKey);
  console.log('Token:', token);

  console.log('\n=== STEP 2: Validate Key Format ===');
  if (!publicKey.startsWith('0x04')) {
    console.error(
      '❌ Public key does NOT start with 0x04. Likely invalid for uncompressed keys.'
    );
    return;
  }
  console.log('✅ Public key starts with 0x04.');

  console.log('Public key length:', publicKey.length);
  if (publicKey.length !== 132) {
    console.warn(
      '⚠️ Expected 132 characters (including 0x) for an uncompressed key. Found:',
      publicKey.length
    );
  } else {
    console.log('✅ Public key length is correct.');
  }

  console.log('\n=== STEP 3: Generate Test Wallet for Payee ===');
  const payeeWallet = ethers.Wallet.createRandom();
  console.log('Payee Private Key:', payeeWallet.privateKey);
  console.log('Payee Public Key:', payeeWallet.publicKey);

  console.log('\n=== STEP 4: Initialize Request Network Client ===');
  const cipherProvider = new EthereumPrivateKeyCipherProvider({
    key: payeeWallet.privateKey,
    method: Types.Encryption.METHOD.ECIES, // Use ECIES encryption method
  });

  const signatureProvider = new EthereumPrivateKeySignatureProvider({
    privateKey: payeeWallet.privateKey,
    method: Types.Signature.METHOD.ECDSA,
  });

  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: 'https://xdai.gateway.request.network/', // Replace with your Request Node URL if needed
    },
    cipherProvider,
    signatureProvider,
    useMockStorage: false,
  });

  console.log('\n=== STEP 5: Create Encrypted Request ===');
  const payeeIdentity = {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: payeeWallet.address,
  };

  const payerIdentity = {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: '0x3ed0c7fcfe78df428c63acabd660b2959d7dadbd',
  };

  // Define encryption parameters as an array
  const encryptionParams = [
    {
      key: publicKey, // Using our ephemeral key
      method: Types.Encryption.METHOD.ECIES,
    },
    {
      key: payeeWallet.publicKey,
      method: Types.Encryption.METHOD.ECIES,
    },
  ];

  // Create request parameters with full structure
  const requestCreateParameters: Types.ICreateRequestParameters = {
    requestInfo: {
      currency: {
        type: Types.RequestLogic.CURRENCY.ETH,
        value: 'ETH',
        network: 'xdai',
      },
      expectedAmount: '1000000000000000000', // 1 ETH in wei
      payee: payeeIdentity,
      payer: payerIdentity,
      timestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
      parameters: {
        paymentAddress: payeeIdentity.value,
      },
    },
    contentData: {
      reason: 'Debug test payment',
      dueDate: new Date().toISOString().split('T')[0],
    },
    signer: payeeIdentity,
  };

  try {
    console.log('Sending encrypted request...');
    const request = await requestClient._createEncryptedRequest(
      requestCreateParameters,
      encryptionParams
    );
    await request.waitForConfirmation();
    console.log('✅ Encrypted request created successfully:');
    console.log('Request ID:', request.requestId);
    // attempt decrypt
    const invoiceFromRequestID = await requestClient.fromRequestId(
      request.requestId
    );

    const requestData = invoiceFromRequestID.getData();

    console.log(requestData);
  } catch (err) {
    console.error('❌ Failed to create encrypted request:', err.message);
    console.error('Error details:', err);
  }
}

debugEphemeralRequest()
  .then(() => console.log('\n=== Debugging Complete ==='))
  .catch((err) => console.error('❌ Unexpected Error:', err));
