import IAccount from "./IAccount";

export default interface IWallet {
    key: string;
    accounts: IAccount[]
}