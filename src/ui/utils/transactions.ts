import { ITransaction } from "@/shared/interfaces/apiController";
import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import { payments } from "tidecoinjs-lib";

export enum TxDirection {
  out = 0,
  in = 1,
}

export const getTxDirection = (
  transaction: ITransaction,
  targetAddress: string
): TxDirection => {
  const includesIn = transaction.vin
    .map((i) => i.prevout.scriptpubkey_address)
    .includes(targetAddress);
  const includesOut = transaction.vout
    .map((i) => i.scriptpubkey_address)
    .includes(targetAddress);
  if (includesIn && includesOut) {
    return TxDirection.out;
  } else if (includesIn) {
    return TxDirection.out;
  }
  return TxDirection.in;
};

export const getTransactionValue = (
  transaction: ITransaction,
  targetAddress: string
) => {
  const direction = getTxDirection(transaction, targetAddress);
  switch (direction) {
    case TxDirection.in:
      return (
        transaction.vout.reduce(
          (acc, cur) =>
            cur.scriptpubkey_address === targetAddress ? acc + cur.value : acc,
          0
        ) /
        10 ** 8
      );
    case TxDirection.out:
      return (
        (transaction.vin.reduce(
          (acc, cur) =>
            cur.prevout.scriptpubkey_address === targetAddress
              ? acc + cur.prevout.value
              : acc,
          0
        ) +
          transaction.fee -
          transaction.vout.reduce(
            (acc, cur) =>
              cur.scriptpubkey_address === targetAddress
                ? cur.value + acc
                : acc,
            0
          )) /
        10 ** 8
      );
  }
};

export const isIncomeTx = (
  transaction: ITransaction,
  targetAddress: string
) => {
  const direction = getTxDirection(transaction, targetAddress);
  return direction === TxDirection.in;
};

export const getScriptForAddress = (
  publicKey: Uint8Array,
  addressType: AddressType
) => {
  switch (addressType) {
    case AddressType.P2WPKH:
      return payments.p2wpkh({ pubkey: Buffer.from(publicKey) }).output;
    case AddressType.P2SH:
      return payments.p2sh({
        redeem: payments.p2wpkh({ pubkey: Buffer.from(publicKey) }),
      }).output;
    case AddressType.P2PKH as any:
      return payments.p2pkh({ pubkey: Buffer.from(publicKey) }).output;
    default:
      throw new Error("Invalid AddressType");
  }
};

export const getRoundedPrice = (value: number) => {
  const strValue = String(value);
  if (strValue.length > 20) {
    if (strValue.split(".")[1].length > 2) {
      return Number(value.toFixed(2));
    }
    return Number(value.toFixed(0));
  }
  return value;
};
