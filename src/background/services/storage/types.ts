interface StorageAccountItem {
  id: number;
  name: string;
}

interface StorageWalletItem {
  name: string;
  accounts: StorageAccountItem[];
}

export type DecryptedSecrets = string[];

export interface StorageInterface {
  enc: Record<"data" | "iv" | "salt", string>;
  cache: StorageWalletItem[];
}
