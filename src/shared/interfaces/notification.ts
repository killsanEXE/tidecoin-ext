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

export interface ApprovalData {
    state: number;
    params?: any;
    origin?: string;
    approvalComponent: string;
    requestDefer?: Promise<any>;
    approvalType: string;
}