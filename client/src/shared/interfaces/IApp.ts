import IAccount from "./IAccount";

export default interface IApp {
    isReady: boolean;
    isUnlocked: boolean;
    exportedAccounts: IAccount[];
    vaultAccounts: string[];
    password: string | undefined;
    updateAppState: (app: Partial<IApp>) => void;
    checkVault: () => void;
    saveAppState: () => void;
    createNewAccount: () => void;
}
