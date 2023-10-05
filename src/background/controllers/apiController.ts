import { ApiUTXO, IApiController } from "@/shared/interfaces/apiController";
import { fetchTDCMainnet } from "@/shared/utils";

class ApiController implements IApiController {
  async getAccountBalance(address: string) {
    const data = await fetchTDCMainnet<{ balance: number }>({
      path: `/address/${address}/balance`,
      method: "GET",
    });
    return data?.balance;
  }

  async getUtxos(address: string) {
    const data = await fetchTDCMainnet<ApiUTXO[]>({
      path: `/address/${address}`,
      params: {
        unspent: "true",
      },
    });
    return data;
  }

  async pushTx(rawTx: string) {
    const data = await fetchTDCMainnet<{ txId: string }>({
      path: "/tx/send",
      body: JSON.stringify({
        rawTx,
      }),
    });
    return data;
  }
}

export default new ApiController();
