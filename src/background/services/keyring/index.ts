// forked from https://github.com/MetaMask/KeyringController/blob/main/src/KeyringController.ts

import * as encryptorUtils from "@metamask/browser-passworder";
import { ObservableStore } from "@metamask/obs-store";
import { EventEmitter } from "events";

import { KeyringControllerError } from "./consts";
import {
  Eip1024EncryptedData,
  Hex,
  Json,
  Keyring,
  KeyringControllerPersistentState,
  KeyringControllerState,
  SerializedKeyring,
} from "./types";
import HDPrivateKey from "test-test-test-hd-wallet/src/hd/private";

interface KeyringControllerArgs {
  initState: KeyringControllerPersistentState;
  cacheEncryptionKey: string;
  encryptor: typeof encryptorUtils;
}

class KeyringController extends EventEmitter {
  public store: ObservableStore<KeyringControllerPersistentState>;

  public memStore: ObservableStore<KeyringControllerState>;

  public encryptor: typeof encryptorUtils;

  public keyrings: Keyring<Json>[];

  public cacheEncryptionKey: boolean;

  public unsupportedKeyrings: SerializedKeyring[];

  public password?: string;

  constructor({
    cacheEncryptionKey,
    initState = {},
    encryptor = encryptorUtils,
  }: KeyringControllerArgs) {
    super();
    this.store = new ObservableStore(initState);
    this.memStore = new ObservableStore({
      isUnlocked: false,
      keyrings: [],
    });

    this.encryptor = encryptor;
    this.keyrings = [];
    this.unsupportedKeyrings = [];

    // This option allows the controller to cache an exported key
    // for use in decrypting and encrypting data without password
    this.cacheEncryptionKey = Boolean(cacheEncryptionKey);
  }

  fullUpdate() {
    this.emit("update", this.memStore.getState());
    return this.memStore.getState();
  }

  async createNewVaultAndKeychain(
    password: string
  ): Promise<KeyringControllerState> {
    this.password = password;

    await this.#createFirstKeyTree();
    this.#setUnlocked();
    return this.fullUpdate();
  }

  async createNewVaultAndRestore(
    password: string,
    seedPhrase: Uint8Array | string | number[]
  ): Promise<KeyringControllerState> {
    if (typeof password !== "string") {
      throw new TypeError(KeyringControllerError.WrongPasswordType);
    }
    this.password = password;

    await this.#clearKeyrings();
    const keyring = await this.addNewKeyring({
      mnemonic: seedPhrase,
      numberOfAccounts: 1,
    });

    const [firstAccount] = await keyring.getAccounts();

    if (!firstAccount) {
      throw new Error(KeyringControllerError.NoFirstAccount);
    }
    this.#setUnlocked();
    return this.fullUpdate();
  }

  async setLocked(): Promise<KeyringControllerState> {
    delete this.password;

    // set locked
    this.memStore.putState({
      isUnlocked: false,
      keyrings: [],
    });

    // remove keyrings
    await this.#clearKeyrings();
    this.emit("lock");
    return this.fullUpdate();
  }

  async submitPassword(password: string): Promise<KeyringControllerState> {
    this.keyrings = await this.unlockKeyrings(password);

    this.#setUnlocked();
    return this.fullUpdate();
  }

  async submitEncryptionKey(
    encryptionKey: string,
    encryptionSalt: string
  ): Promise<KeyringControllerState> {
    this.keyrings = await this.unlockKeyrings(
      undefined,
      encryptionKey,
      encryptionSalt
    );
    this.#setUnlocked();
    return this.fullUpdate();
  }

  async verifyPassword(password: string): Promise<void> {
    const encryptedVault = this.store.getState().vault;
    if (!encryptedVault) {
      throw new Error(KeyringControllerError.VaultError);
    }
    await this.encryptor.decrypt(password, encryptedVault);
  }

  async addNewAccount(
    selectedKeyring: Keyring<Json>
  ): Promise<KeyringControllerState> {
    const accounts = await selectedKeyring.addAccounts(1);
    accounts.forEach((hexAccount) => {
      this.emit("newAccount", hexAccount);
    });

    await this.persistAllKeyrings();
    return this.fullUpdate();
  }

  async exportAccount(address: string): Promise<string> {
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringControllerError.UnsupportedExportAccount);
    }

    return await keyring.exportAccount(address.toLowerCase());
  }

  async removeAccount(address: Hex): Promise<KeyringControllerState> {
    const keyring = await this.getKeyringForAccount(address);

    // Not all the keyrings support this, so we have to check
    if (!keyring.removeAccount) {
      throw new Error(KeyringControllerError.UnsupportedRemoveAccount);
    }
    keyring.removeAccount(address);
    this.emit("removedAccount", address);

    const accounts = await keyring.getAccounts();
    // Check if this was the last/only account
    if (accounts.length === 0) {
      await this.removeEmptyKeyrings();
    }

    await this.persistAllKeyrings();
    return this.fullUpdate();
  }

  async getAccounts(): Promise<string[]> {
    const keyrings = this.keyrings || [];

    const keyringArrays = await Promise.all(
      keyrings.map(async (keyring) => keyring.getAccounts())
    );
    const addresses = keyringArrays.reduce((res, arr) => {
      return res.concat(arr);
    }, []);

    // Cast to `Hex[]` here is safe here because `addresses` has no nullish
    // values, and `normalizeToHex` returns `Hex` unless given a nullish value
    return addresses.map((v) => v.toLowerCase()) as Hex[];
  }

  async updateMemStoreKeyrings(): Promise<void> {
    const keyrings = await Promise.all(this.keyrings.map(displayForKeyring));
    this.memStore.updateState({ keyrings });
  }

  async signTransaction(
    tideTx: unknown,
    rawAddress: string,
    opts: Record<string, unknown> = {}
  ): Promise<unknown> {
    const address = rawAddress.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signTransaction) {
      throw new Error(KeyringControllerError.UnsupportedSignTransaction);
    }

    return await keyring.signTransaction(address, tideTx, opts);
  }

  async signMessage(
    msgParams: {
      from: string;
      data: string;
    },
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const address = msgParams.from.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signMessage) {
      throw new Error(KeyringControllerError.UnsupportedSignMessage);
    }

    return await keyring.signMessage(address, msgParams.data, opts);
  }

  async signPersonalMessage(
    msgParams: {
      from: string;
      data: string;
    },
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const address = msgParams.from.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signPersonalMessage) {
      throw new Error(KeyringControllerError.UnsupportedSignPersonalMessage);
    }

    const normalizedData = msgParams.data.toLowerCase() as Hex;

    return await keyring.signPersonalMessage(address, normalizedData, opts);
  }

  async getEncryptionPublicKey(
    address: string,
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const normalizedAddress = address.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.getEncryptionPublicKey) {
      throw new Error(KeyringControllerError.UnsupportedGetEncryptionPublicKey);
    }

    return await keyring.getEncryptionPublicKey(normalizedAddress, opts);
  }

  async decryptMessage(msgParams: {
    from: string;
    data: Eip1024EncryptedData;
  }): Promise<string> {
    const address = msgParams.from.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.decryptMessage) {
      throw new Error(KeyringControllerError.UnsupportedDecryptMessage);
    }

    return keyring.decryptMessage(address, msgParams.data);
  }

  async signTypedMessage(
    msgParams: {
      from: string;
      data: Record<string, unknown> | Record<string, unknown>[];
    },
    opts: Record<string, unknown> = { version: "V1" }
  ): Promise<string> {
    // Cast to `Hex` here is safe here because `msgParams.from` is not nullish.
    // `normalizeToHex` returns `Hex` unless given a nullish value.
    const address = msgParams.from.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signTypedData) {
      throw new Error(KeyringControllerError.UnsupportedSignTypedMessage);
    }

    // Looks like this is not well defined in the Keyring interface since
    // our tests show that we should be able to pass an array.
    // @ts-expect-error Missing other required permission types.
    return keyring.signTypedData(address, msgParams.data, opts);
  }

  async getAppKeyAddress(rawAddress: string, origin: string): Promise<string> {
    const address = rawAddress.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.getAppKeyAddress) {
      throw new Error(KeyringControllerError.UnsupportedGetAppKeyAddress);
    }

    return keyring.getAppKeyAddress(address, origin);
  }

  async exportAppKeyForAddress(
    rawAddress: string,
    origin: string
  ): Promise<string> {
    const address = rawAddress.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringControllerError.UnsupportedExportAppKeyForAddress);
    }
    return keyring.exportAccount(address, { withAppKeyOrigin: origin });
  }

  async addNewKeyring(opts?: unknown): Promise<Keyring<Json>> {
    const keyring = await this.#newKeyring(opts);

    if (!keyring) {
      throw new Error(KeyringControllerError.NoKeyring);
    }

    if (!(opts instanceof Object) || !(opts as any).mnemonic) {
      if (!keyring.generateRandomMnemonic) {
        throw new Error(
          KeyringControllerError.UnsupportedGenerateRandomMnemonic
        );
      }

      keyring.generateRandomMnemonic();
      await keyring.addAccounts(1);
    }

    const accounts = await keyring.getAccounts();
    await this.checkForDuplicate(accounts);

    this.keyrings.push(keyring);
    await this.persistAllKeyrings();

    this.fullUpdate();

    return keyring;
  }

  async removeEmptyKeyrings(): Promise<void> {
    const validKeyrings: Keyring<Json>[] = [];

    await Promise.all(
      this.keyrings.map(async (keyring: Keyring<Json>) => {
        const accounts = await keyring.getAccounts();
        if (accounts.length > 0) {
          validKeyrings.push(keyring);
        } else {
          await this.#destroyKeyring(keyring);
        }
      })
    );
    this.keyrings = validKeyrings;
  }

  async checkForDuplicate(newAccountArray: string[]): Promise<string[]> {
    return newAccountArray;
  }

  async getKeyringForAccount(address: string): Promise<Keyring<Json>> {
    const hexed = address.toLowerCase() as Hex;

    const candidates = await Promise.all(
      this.keyrings.map(async (keyring) => {
        return Promise.all([keyring, keyring.getAccounts()]);
      })
    );

    const winners = candidates.filter((candidate) => {
      const accounts = candidate[1].map((i) => i.toLowerCase());
      return accounts.includes(hexed);
    });

    if (winners.length && winners[0]?.length) {
      return winners[0][0];
    }

    // Adding more info to the error
    let errorInfo = "";
    if (!candidates.length) {
      errorInfo = "There are no keyrings";
    } else if (!winners.length) {
      errorInfo = "There are keyrings, but none match the address";
    }
    throw new Error(
      `${KeyringControllerError.NoKeyring}. Error info: ${errorInfo}`
    );
  }

  async restoreKeyring(
    serialized: SerializedKeyring
  ): Promise<Keyring<Json> | undefined> {
    const keyring = await this.#restoreKeyring(serialized);
    if (keyring) {
      await this.updateMemStoreKeyrings();
    }
    return keyring;
  }

  getKeyringsByType(type: string): Keyring<Json>[] {
    return this.keyrings.filter((keyring) => keyring.type === type);
  }

  async persistAllKeyrings(): Promise<boolean> {
    const { encryptionKey, encryptionSalt } = this.memStore.getState();

    if (!this.password && !encryptionKey) {
      throw new Error(KeyringControllerError.MissingCredentials);
    }

    const serializedKeyrings = await Promise.all(
      this.keyrings.map(async (keyring) => {
        const [data] = await Promise.all([keyring.serialize()]);
        return { data };
      })
    );

    serializedKeyrings.push(...this.unsupportedKeyrings);

    let vault: string | undefined;
    let newEncryptionKey: string | undefined;

    if (this.cacheEncryptionKey) {
      if (this.password) {
        const { vault: newVault, exportedKeyString } =
          await this.encryptor.encryptWithDetail(
            this.password,
            serializedKeyrings
          );

        vault = newVault;
        newEncryptionKey = exportedKeyString;
      } else if (encryptionKey) {
        const key = await this.encryptor.importKey(encryptionKey);
        const vaultJSON = await this.encryptor.encryptWithKey(
          key,
          serializedKeyrings
        );
        vaultJSON.salt = encryptionSalt;
        vault = JSON.stringify(vaultJSON);
      }
    } else {
      if (typeof this.password !== "string") {
        throw new TypeError(KeyringControllerError.WrongPasswordType);
      }
      vault = await this.encryptor.encrypt(this.password, serializedKeyrings);
    }

    if (!vault) {
      throw new Error(KeyringControllerError.MissingVaultData);
    }

    this.store.updateState({ vault });

    // The keyring updates need to be announced before updating the encryptionKey
    // so that the updated keyring gets propagated to the extension first.
    // Not calling {@link updateMemStoreKeyrings} results in the wrong account being selected
    // in the extension.
    await this.updateMemStoreKeyrings();
    if (newEncryptionKey) {
      this.memStore.updateState({
        encryptionKey: newEncryptionKey,
        encryptionSalt: JSON.parse(vault).salt,
      });
    }

    return true;
  }

  async unlockKeyrings(
    password: string | undefined,
    encryptionKey?: string,
    encryptionSalt?: string
  ): Promise<Keyring<Json>[]> {
    const encryptedVault = this.store.getState().vault;
    if (!encryptedVault) {
      throw new Error(KeyringControllerError.VaultError);
    }

    await this.#clearKeyrings();

    let vault;

    if (this.cacheEncryptionKey) {
      if (password) {
        const result = await this.encryptor.decryptWithDetail(
          password,
          encryptedVault
        );
        vault = result.vault;
        this.password = password;

        this.memStore.updateState({
          encryptionKey: result.exportedKeyString,
          encryptionSalt: result.salt,
        });
      } else {
        const parsedEncryptedVault = JSON.parse(encryptedVault);

        if (encryptionSalt !== parsedEncryptedVault.salt) {
          throw new Error(KeyringControllerError.ExpiredCredentials);
        }

        if (typeof encryptionKey !== "string") {
          throw new TypeError(KeyringControllerError.WrongPasswordType);
        }

        const key = await this.encryptor.importKey(encryptionKey);
        vault = await this.encryptor.decryptWithKey(key, parsedEncryptedVault);

        // This call is required on the first call because encryptionKey
        // is not yet inside the memStore
        this.memStore.updateState({
          encryptionKey,
          // we can safely assume that encryptionSalt is defined here
          // because we compare it with the salt from the vault
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          encryptionSalt: encryptionSalt!,
        });
      }
    } else {
      if (typeof password !== "string") {
        throw new TypeError(KeyringControllerError.WrongPasswordType);
      }

      vault = await this.encryptor.decrypt(password, encryptedVault);
      this.password = password;
    }

    await Promise.all(vault.map(this.#restoreKeyring.bind(this)));
    await this.updateMemStoreKeyrings();
    return this.keyrings;
  }

  async #createFirstKeyTree(): Promise<null> {
    await this.#clearKeyrings();

    const keyring = await this.addNewKeyring();
    if (!keyring) {
      throw new Error(KeyringControllerError.NoKeyring);
    }

    const [firstAccount] = await keyring.getAccounts();
    if (!firstAccount) {
      throw new Error(KeyringControllerError.NoAccountOnKeychain);
    }

    const hexAccount = firstAccount.toLowerCase();
    this.emit("newVault", hexAccount);
    return null;
  }

  async #restoreKeyring(
    serialized: SerializedKeyring
  ): Promise<Keyring<Json> | undefined> {
    const { data } = serialized;

    let keyring: Keyring<Json> | undefined;
    try {
      keyring = await this.#newKeyring(data);
    } catch (error) {
      // Ignore error.
      console.error(error);
    }

    if (!keyring) {
      this.unsupportedKeyrings.push(serialized);
      return undefined;
    }

    // getAccounts also validates the accounts for some keyrings
    await keyring.getAccounts();
    this.keyrings.push(keyring);
    return keyring;
  }

  async #clearKeyrings() {
    // clear keyrings from memory
    for (const keyring of this.keyrings) {
      await this.#destroyKeyring(keyring);
    }
    this.keyrings = [];
    this.memStore.updateState({
      keyrings: [],
    });
  }

  async #destroyKeyring(keyring: Keyring<Json>) {
    await keyring.destroy?.();
  }

  #setUnlocked(): void {
    this.memStore.updateState({ isUnlocked: true });
    this.emit("unlock");
  }

  async #newKeyring(data: unknown): Promise<Keyring<Json>> {
    const keyringBuilder = HDPrivateKey;

    if (!keyringBuilder) {
      throw new Error(
        `${KeyringControllerError.NoKeyringBuilder}. Keyring type: ${type}`
      );
    }

    const keyring = new keyringBuilder();
    await keyring.deserialize(data);

    if (keyring.init) {
      await keyring.init();
    }

    return keyring;
  }
}

function keyringBuilderFactory() {
  return new HDPrivateKey();
}

async function displayForKeyring(
  keyring: Keyring<Json>
): Promise<{ type: string; accounts: string[] }> {
  const accounts = await keyring.getAccounts();

  return {
    type: keyring.type,
    // Cast to `Hex[]` here is safe here because `addresses` has no nullish
    // values, and `normalizeToHex` returns `Hex` unless given a nullish value
    accounts: accounts.map((i) => i.toLowerCase()) as Hex[],
  };
}

export { KeyringController, keyringBuilderFactory };
