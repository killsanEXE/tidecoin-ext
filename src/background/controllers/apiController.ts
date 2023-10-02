import { IApiController } from "@/shared/interfaces/apiController";
import { fetchTDCMainnet } from "@/shared/utils";

export class ApiController implements IApiController {
    async getAccountBalance(address: string): Promise<number> {
        const data = await fetchTDCMainnet<any>({
            path: `address/${address}/balance`,
            method: "GET"
        });
        return data["balance"];
    }
}

export default new ApiController();
