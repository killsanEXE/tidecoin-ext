import { EthereumProviderError } from "eth-rpc-errors";

export interface INotificationController {
  getApproval(): Promise<ApprovalData>;
  rejectApproval(err?: string, stay?: boolean, isInternal?: boolean): Promise<void>;
  resolveApproval(data?: any, forceReject?: boolean): Promise<void>;
  changedAccount(): Promise<void>;
}

export interface Approval {
  data: ApprovalData;
  resolve(params?: any): void;
  reject(err: EthereumProviderError<any>): void;
}

export interface Session {
  origin: string;
  name: string;
}

export interface ApprovalData {
  state: number;
  params?: Params;
  origin?: string;
  approvalComponent: string;
  session: Session;
  requestDefer?: Promise<any>;
  approvalType: string;
}

export interface Params {
  method: string;
  data: any;
  session: Session;
}

export type SignTransactionProps = string;
export interface CreateTransaction {
  address: string;
  amount: number;
  feeRate: number;
}
