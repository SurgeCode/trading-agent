import { DEPLOYMENT_URL } from 'vercel-url';

const ACCOUNT_ID = process.env.ACCOUNT_ID;

const PLUGIN_URL =
  DEPLOYMENT_URL ||
  `${process.env.NEXT_PUBLIC_HOST || 'localhost'}:${process.env.PORT || 3000}`;

if (!PLUGIN_URL) {
  console.error(
    '!!! Plugin URL not found in env, BITTE_CONFIG or DEPLOYMENT_URL !!!',
  );
  process.exit(1);
}

export const NEAR = 'near';
export const INTENTS_CONTRACT_ID = process.env.INTENTS_CONTRACT_ID || 'intents.near';

export const TOKEN_LIST = [
  {
    "assetId": "nep141:wrap.near",
    "decimals": 24,
    "blockchain": "near",
    "symbol": "wNEAR",
    "price": 2.7,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "wrap.near"
  },
  {
    "assetId": "nep141:eth.bridge.near",
    "decimals": 18,
    "blockchain": "near",
    "symbol": "ETH",
    "price": 3649.37,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "eth.bridge.near"
  },
  {
    "assetId": "nep141:2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
    "decimals": 8,
    "blockchain": "near",
    "symbol": "wBTC",
    "price": 118658,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near"
  },
  {
    "assetId": "nep141:eth.omft.near",
    "decimals": 18,
    "blockchain": "eth",
    "symbol": "ETH",
    "price": 3649.37,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  },
  {
    "assetId": "nep141:sui.omft.near",
    "decimals": 9,
    "blockchain": "sui",
    "symbol": "SUI",
    "price": 3.71,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  },
  {
    "assetId": "nep141:btc.omft.near",
    "decimals": 8,
    "blockchain": "btc",
    "symbol": "BTC",
    "price": 118658,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  },
  {
    "assetId": "nep141:sol.omft.near",
    "decimals": 9,
    "blockchain": "sol",
    "symbol": "SOL",
    "price": 185.5,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  },
  {
    "assetId": "nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near",
    "decimals": 18,
    "blockchain": "arb",
    "symbol": "ARB",
    "price": 0.432771,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "0x912ce59144191c1204e64559fe8253a0e49e6548"
  },
  {
    "assetId": "nep141:sol-b9c68f94ec8fd160137af8cdfe5e61cd68e2afba.omft.near",
    "decimals": 6,
    "blockchain": "sol",
    "symbol": "$WIF",
    "price": 1.088,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
  },
  {
    "assetId": "nep141:base.omft.near",
    "decimals": 18,
    "blockchain": "base",
    "symbol": "ETH",
    "price": 3649.37,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  },
  {
    "assetId": "nep141:base-0x532f27101965dd16442e59d40670faf5ebb142e4.omft.near",
    "decimals": 18,
    "blockchain": "base",
    "symbol": "BRETT",
    "price": 0.054971,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "0x532f27101965dd16442e59d40670faf5ebb142e4"
  },
  {
    "assetId": "nep141:arb.omft.near",
    "decimals": 18,
    "blockchain": "arb",
    "symbol": "ETH",
    "price": 3649.37,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  },
  {
    "assetId": "nep141:eth-0x6982508145454ce325ddbe47a25d4ec3d2311933.omft.near",
    "decimals": 18,
    "blockchain": "eth",
    "symbol": "PEPE",
    "price": 0.00001255,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "0x6982508145454ce325ddbe47a25d4ec3d2311933"
  },
  {
    "assetId": "nep141:nbtc.bridge.near",
    "decimals": 8,
    "blockchain": "near",
    "symbol": "BTC",
    "price": 118658,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "nbtc.bridge.near"
  },
  {
    "assetId": "nep141:sol-91914f13d3b54f8126a2824d71632d4b078d7403.omft.near",
    "decimals": 8,
    "blockchain": "sol",
    "symbol": "xBTC",
    "price": 118658,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z",
    "contractAddress": "CtzPWv73Sn1dMGVU3ZtLv9yWSyUAanBni19YWDaznnkn"
  },
  {
    "assetId": "nep245:v2_1.omni.hot.tg:10_11111111111111111111",
    "decimals": 18,
    "blockchain": "op",
    "symbol": "ETH",
    "price": 3649.37,
    "priceUpdatedAt": "2025-07-24T11:27:05.100Z"
  }
] as const;

export { ACCOUNT_ID, PLUGIN_URL };
