/* eslint-disable quotes */

/* constants pool */
import { AddressType } from "test-test-test-hd-wallet/src/hd/types";

export const IS_CHROME = /Chrome\//i.test(navigator.userAgent);

export const IS_FIREFOX = /Firefox\//i.test(navigator.userAgent);

export const IS_LINUX = /linux/i.test(navigator.userAgent);

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
  value: AddressType;
  label: string;
  name: string;
  hdPath: string;
}[] = [
    {
      value: AddressType.P2WPKH,
      label: "P2WPKH",
      name: "Native Segwit (P2WPKH)",
      hdPath: "m/84'/0'/0'/0",
    },
    {
      value: AddressType.P2SH,
      label: "P2SH-P2WPKH",
      name: "Nested Segwit (P2SH-P2WPKH)",
      hdPath: "m/49'/0'/0'/0",
    },
    {
      value: AddressType.P2PKH,
      label: "P2PKH",
      name: "Legacy (P2PKH)",
      hdPath: "m/44'/0'/0'/0",
    },
  ];


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


export const COIN_SYMBOL = "TDC";
export const SAT_SYMBOL = "tid/Vb"

export const TDC_API_URL = "https://api.tdc.cash";
export const TDC_MAINNET_PATH = "";
