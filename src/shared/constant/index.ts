/* eslint-disable quotes */

/* constants pool */
import { UTXOAddressType } from "tidecoin-utils/lib/OrdTransaction";
import { Chain, NetworkType, RestoreWalletType } from "../types";

export enum CHAINS_ENUM {
  TDC = "TDC",
}

export const CHAINS: Record<string, Chain> = {
  [CHAINS_ENUM.TDC]: {
    name: "TDC",
    enum: CHAINS_ENUM.TDC,
    logo: "",
    network: "mainnet",
  },
};

export const KEYRING_TYPE = {
  HdKeyring: "HD Key Tree",
  SimpleKeyring: "Simple Key Pair",
};

export const KEYRING_CLASS = {
  PRIVATE_KEY: "Simple Key Pair",
  MNEMONIC: "HD Key Tree",
};

export const KEYRING_TYPE_TEXT = {
  [KEYRING_TYPE.HdKeyring]: "Created by Mnemonic",
  [KEYRING_TYPE.SimpleKeyring]: "Imported by Private Key",
};
export const BRAND_ALIAN_TYPE_TEXT = {
  [KEYRING_TYPE.HdKeyring]: "Account",
  [KEYRING_TYPE.SimpleKeyring]: "Private Key",
};

export const KEYRING_TYPES: {
  [key: string]: {
    name: string;
    tag: string;
    alianName: string;
  };
} = {
  "HD Key Tree": {
    name: "HD Key Tree",
    tag: "HD",
    alianName: "HD Component",
  },
  "Simple Key Pair": {
    name: "Simple Key Pair",
    tag: "IMPORT",
    alianName: "Single Component",
  },
};

export const IS_CHROME = /Chrome\//i.test(navigator.userAgent);

export const IS_FIREFOX = /Firefox\//i.test(navigator.userAgent);

export const IS_LINUX = /linux/i.test(navigator.userAgent);

let chromeVersion: number | null = null;

if (IS_CHROME) {
  const matches = navigator.userAgent.match(/Chrome\/(\d+[^.\s])/);
  if (matches && matches.length >= 2) {
    chromeVersion = Number(matches[1]);
  }
}

export const IS_AFTER_CHROME91 = IS_CHROME
  ? chromeVersion && chromeVersion >= 91
  : false;

export const GAS_LEVEL_TEXT = {
  slow: "Standard",
  normal: "Fast",
  fast: "Instant",
  custom: "Custom",
};

export const IS_WINDOWS = /windows/i.test(navigator.userAgent);

export const LANGS = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "zh_CN",
    label: "Chinese",
  },
  {
    value: "ja",
    label: "Japanese",
  },
  {
    value: "es",
    label: "Spanish",
  },
];

export const ADDRESS_TYPES: {
  value: UTXOAddressType;
  label: string;
  name: string;
  hdPath: string;
  displayIndex: number;
}[] = [
  {
    value: UTXOAddressType.P2PKH,
    label: "P2PKH",
    name: "Legacy (P2PKH)",
    hdPath: "m/44'/0'/0'/0",
    displayIndex: 3,
  },
  {
    value: UTXOAddressType.P2WPKH,
    label: "P2WPKH",
    name: "Native Segwit (P2WPKH)",
    hdPath: "m/84'/0'/0'/0",
    displayIndex: 0,
  },
  {
    value: UTXOAddressType.P2SH_P2WPKH,
    label: "P2SH-P2WPKH",
    name: "Nested Segwit (P2SH-P2WPKH)",
    hdPath: "m/49'/0'/0'/0",
    displayIndex: 1,
  },
  {
    value: UTXOAddressType.M44_P2WPKH,
    label: "P2WPKH",
    name: "Native SegWit (P2WPKH)",
    hdPath: "m/44'/0'/0'/0",
    displayIndex: 4,
  },
];

export const RESTORE_WALLETS: {
  value: RestoreWalletType;
  name: string;
  addressTypes: UTXOAddressType[];
}[] = [
  {
    value: RestoreWalletType.TIDECOIN,
    name: "TideCoin Wallet",
    addressTypes: [
      UTXOAddressType.P2WPKH,
      UTXOAddressType.P2SH_P2WPKH,
      UTXOAddressType.P2PKH,
      UTXOAddressType.M44_P2WPKH,
    ],
  },
  {
    value: RestoreWalletType.SPARROW,
    name: "Sparrow Wallet",
    addressTypes: [
      UTXOAddressType.P2PKH,
      UTXOAddressType.P2WPKH,
      UTXOAddressType.P2SH_P2WPKH,
    ],
  },
  {
    value: RestoreWalletType.XVERSE,
    name: "Xverse Wallet",
    addressTypes: [UTXOAddressType.P2SH_P2WPKH],
  },
  {
    value: RestoreWalletType.OTHERS,
    name: "Other Wallet",
    addressTypes: [
      UTXOAddressType.P2PKH,
      UTXOAddressType.P2WPKH,
      UTXOAddressType.P2SH_P2WPKH,
      UTXOAddressType.M44_P2WPKH,
    ],
  },
];

export const NETWORK_TYPES = [
  {
    value: NetworkType.MAINNET,
    label: "LIVENET",
    name: "livenet",
    validNames: [0, "livenet", "mainnet"],
  },
  {
    value: NetworkType.TESTNET,
    label: "TESTNET",
    name: "testnet",
    validNames: ["testnet"],
  },
];

export const MINIMUM_GAS_LIMIT = 21000;

export enum WATCH_ADDRESS_CONNECT_TYPE {
  WalletConnect = "WalletConnect",
}

export const WALLETCONNECT_STATUS_MAP = {
  PENDING: 1,
  CONNECTED: 2,
  WAITING: 3,
  SIBMITTED: 4,
  REJECTED: 5,
  FAILD: 6,
};

export const INTERNAL_REQUEST_ORIGIN = "https://tdc.cash";

export const INTERNAL_REQUEST_SESSION = {
  name: "TideCoin Wallet",
  origin: INTERNAL_REQUEST_ORIGIN,
  icon: "./images/logo/logo@128x.png",
};

export const OPENAPI_URL_MAINNET = "https://tdc.cash";
export const OPENAPI_URL_TESTNET = "https://tdc.cash";

export const EVENTS = {
  broadcastToUI: "broadcastToUI",
  broadcastToBackground: "broadcastToBackground",
  SIGN_FINISHED: "SIGN_FINISHED",
  WALLETCONNECT: {
    STATUS_CHANGED: "WALLETCONNECT_STATUS_CHANGED",
    INIT: "WALLETCONNECT_INIT",
    INITED: "WALLETCONNECT_INITED",
  },
};

export const SORT_WEIGHT = {
  [KEYRING_TYPE.HdKeyring]: 1,
  [KEYRING_TYPE.SimpleKeyring]: 2,
};

export const GASPRICE_RANGE = {
  [CHAINS_ENUM.TDC]: [0, 10000],
};

export const COIN_NAME = "TDC";
export const COIN_SYMBOL = "TDC";

export const COIN_DUST = 1000;

export const TO_LOCALE_STRING_CONFIG = {
  minimumFractionDigits: 8,
};

export const SATS_DOMAIN = ".sats";

export const CHANNEL = "chrome";

export const TDC_API_URL = "https://tdc.cash";
export const TDC_MAINNET_PATH = "/api/TDC/mainnet";
