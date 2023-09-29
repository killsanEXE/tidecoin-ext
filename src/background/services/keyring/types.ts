import { KeyringType } from "./consts";

export type Json = any;
export type Hex = string;

export type KeyringControllerArgs = {
  keyringBuilders?: { (): Keyring<Json>; type: string }[];
  cacheEncryptionKey: boolean;
  initState?: KeyringControllerPersistentState;
  encryptor?: any;
};

export type Eip1024EncryptedData = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export type KeyringObject = {
  type: string;
  accounts: string[];
};

export type KeyringControllerPersistentState = {
  vault?: string;
};

export type KeyringControllerState = {
  keyrings: KeyringObject[];
  isUnlocked: boolean;
  encryptionKey?: string;
  encryptionSalt?: string;
};

export type SerializedKeyring = {
  type: string;
  data: Json;
};

export type BuildersKeys = (typeof KeyringType)[keyof typeof KeyringType];

export type KeyringClass<State extends Json> = {
  new (options?: Record<string, unknown>): Keyring<State>;
  type: BuildersKeys;
};

export type Keyring<State extends Json> = {
  type: string;
  getAccounts(): Promise<Hex[]>;
  addAccounts(number: number): Promise<Hex[]>;
  serialize(): Promise<State>;
  deserialize(state: State): Promise<void>;
  init?(): Promise<void>;
  removeAccount?(address: Hex): void;
  exportAccount?(
    address: Hex,
    options?: Record<string, unknown>
  ): Promise<string>;
  getAppKeyAddress?(address: Hex, origin: string): Promise<Hex>;
  signTransaction?(
    address: Hex,
    transaction: unknown,
    options?: Record<string, unknown>
  ): Promise<unknown>;
  signMessage?(
    address: Hex,
    message: string,
    options?: Record<string, unknown>
  ): Promise<string>;
  signPersonalMessage?(
    address: Hex,
    message: Hex,
    options?: { version?: string } & Record<string, unknown>
  ): Promise<string>;
  signTypedData?(
    address: Hex,
    typedData: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<string>;
  getEncryptionPublicKey?(
    account: Hex,
    options?: Record<string, unknown>
  ): Promise<string>;
  decryptMessage?(
    account: Hex,
    encryptedData: Eip1024EncryptedData
  ): Promise<string>;
  generateRandomMnemonic?(): void;
  destroy?(): Promise<void>;
};
