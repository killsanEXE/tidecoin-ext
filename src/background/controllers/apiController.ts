import {
  ApiUTXO,
  IApiController,
  ITransaction,
  ITransactionInfo,
} from "@/shared/interfaces/apiController";
import { fetchTDCMainnet } from "@/shared/utils";

class ApiController implements IApiController {
  async getAccountBalance(address: string) {
    const data = await fetchTDCMainnet<any>({
      path: `/address/${address}/balance`,
      method: "GET",
    });

    const transactions = await fetchTDCMainnet<ITransaction[]>({
      path: `/address/${address}/txs`,
    });
    console.log(!transactions || (!transactions[-1] && !transactions[0]) || !data.unconfirmed)
    if (!transactions || (!transactions[-1] && !transactions[0]) || !data.unconfirmed) return data.balance;
    else {
      const lastTransaction = transactions[-1] ?? transactions[0];
      console.log(lastTransaction)
      console.log(data)
      if (lastTransaction.mintIndex) return data.balance - data.unconfirmed;
      else return data.balance + data.unconfirmed
    }
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
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rawTx,
      }),
    });
    return data;
  }

  async getTransactions(address: string): Promise<ITransaction[] | undefined> {
    return await fetchTDCMainnet<ITransaction[]>({
      path: `/address/${address}/txs`,
    });
  }

  async getTransactionInfo(
    txid: string
  ): Promise<ITransactionInfo | undefined> {
    return await fetchTDCMainnet<ITransactionInfo>({
      path: `/tx/${txid}`,
    });
  }
}

export default new ApiController();
