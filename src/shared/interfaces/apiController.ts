export interface ApiUTXO {
  _id: string;
  chain: "TDC";
  network: "mainnet";
  coinbase: boolean;
  mintIndex: number;
  spentTxid: string;
  mintTxid: string;
  mintHeight: number;
  spentHeight: number;
  address: string;
  script: string;
  value: number;
  confirmations: number;
}

export interface IApiController {
  getAccountBalance(address: string): Promise<number | undefined>;
  getUtxos(address: string): Promise<ApiUTXO[] | undefined>;
  pushTx(rawTx: string): Promise<{ txId: string } | undefined>;
  getTransactions(address: string): Promise<ITransaction[] | undefined>;
}

export interface ITransaction {
  _id: string
  chain: string
  network: string
  coinbase: boolean
  mintIndex: number
  spentTxid: string
  mintTxid: string
  mintHeight: number
  spentHeight: number
  address: string
  script: string
  value: number
  confirmations: number
  sequenceNumber: number
}