import { ApiUTXO, IApiController } from "@/shared/interfaces/apiController";
import { fetchTDCMainnet } from "@/shared/utils";

class ApiController implements IApiController {
  async getAccountBalance(address: string): Promise<number | undefined> {
    const data = await fetchTDCMainnet<{ balance: number }>({
      path: `/address/${address}/balance`,
      method: "GET",
    });
    return data?.balance;
  }

  async getUtxos(address: string): Promise<ApiUTXO[] | undefined> {
    const data = await fetchTDCMainnet<ApiUTXO[]>({
      path: `/address/${address}`,
      params: {
        unspent: "true",
      },
    });
    return data;
  }
}

export default new ApiController();
