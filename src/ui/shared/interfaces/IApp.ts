import IAccount from "./IAccount";
import { IWallet } from "./IWallet";

export default interface IApp {
    isReady: boolean;
    isUnlocked: boolean;
    vault: string[];
    password: string | undefined;
    updateAppState: (app: Partial<IApp>) => void;
}
