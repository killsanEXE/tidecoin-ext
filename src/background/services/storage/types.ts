import { AddressType } from "test-test-test-hd-wallet/src/hd/types";

interface StorageAccountItem {
  id: number;
  name: string;
}

interface StorageWalletItem {
  name: string;
  addressType: AddressType,
  accounts: StorageAccountItem[];
}

export type DecryptedSecrets = { id: number; data: any; phrase?: string }[];

export interface StorageInterface {
  enc: Record<"data" | "iv" | "salt", string>;
  cache: StorageWalletItem[];
}
