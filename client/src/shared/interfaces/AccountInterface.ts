export default interface Account{
    type: string;
    pubkey: string;
    address: string;
    brandName?: string;
    alianName?: string;
    displayBrandName?: string;
    index?: number;
    balance?: number;
    key: string;
  }