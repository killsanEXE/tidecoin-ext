
export interface IApiController {
    getAccountBalance(address: string): Promise<number>;
}
