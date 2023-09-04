import Account from "./AccountInterface";

export default interface App {
    isReady: boolean;
    isUnlocked: boolean;
    exportedAccounts: Account[];
    vaultAccounts: string[];
    password: string | undefined;
    updateVaultAccount: (account: Partial<Record<keyof Account, any>>) => void;
    updateAppState: (app: Partial<Record<keyof App, any>>) => void;
    checkVault: () => void;
    saveAppState: () => void;
    createNewAccount: () => void;
}
