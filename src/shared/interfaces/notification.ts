import { EthereumProviderError } from "eth-rpc-errors";

export interface INotificationController {
    getApproval(): Promise<ApprovalData>;
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