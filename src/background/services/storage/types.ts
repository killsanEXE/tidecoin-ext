interface StorageAccountItem {
  id: number;
  name: string;
}

interface StorageWalletItem {
  name: string;
  accounts: StorageAccountItem[];
}

export type DecryptedSecrets = { id: number; data: any; phrase?: string }[];

export interface StorageInterface {
  enc: Record<"data" | "iv" | "salt", string>;
  cache: StorageWalletItem[];
}
