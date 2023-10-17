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
  pushTx(rawTx: string): Promise<{ txid: string } | undefined>;
  getTransactions(address: string): Promise<ITransaction[] | undefined>;
  getTransactionInfo(txid: string): Promise<ITransactionInfo | undefined>;
  getTDCPrice(): Promise<{ data: { last: string } }>;
}

export interface ITransaction {
  _id: string;
  chain: string;
  network: string;
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
  sequenceNumber: number;
}

export interface ITransactionInfo {
  _id: string;
  txid: string;
  network: string;
  chain: string;
  blockHeight: number;
  blockHash: string;
  blockTime: string;
  blockTimeNormalized: string;
  coinbase: boolean;
  locktime: number;
  inputCount: number;
  outputCount: number;
  size: number;
  fee: number;
  value: number;
  confirmations: number;
}

export interface ISend {
  toAddress: string;
  fromAddress: string;
  amount: number;
  feeAmount: number;
  includeFeeInAmount: boolean;
  hex: string;
}
