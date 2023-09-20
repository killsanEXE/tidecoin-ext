export default interface IAccount {
  id: number;
  privateKey?: string;
  publicKey?: string;
  balance?: number;
  name?: string;
}