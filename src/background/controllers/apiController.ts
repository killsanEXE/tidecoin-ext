import { AccountBalanceResponse, ApiUTXO, ITransaction } from "@/shared/interfaces/api";
import { fetchTDCMainnet } from "@/shared/utils";

export interface IApiController {
  getAccountBalance(address: string): Promise<number | undefined>;
  getUtxos(address: string): Promise<ApiUTXO[] | undefined>;
  pushTx(rawTx: string): Promise<{ txid: string } | undefined>;
  getTransactions(address: string): Promise<ITransaction[] | undefined>;
  getPaginatedTransactions(address: string, txid: string): Promise<ITransaction[] | undefined>;
  getTDCPrice(): Promise<{ data: { last: string } }>;
  getLastBlockTDC(): Promise<number>;
}

class ApiController implements IApiController {
  async getAccountBalance(address: string) {
    const data = await fetchTDCMainnet<AccountBalanceResponse>({
      path: `/address/${address}`,
    });

    if (!data) return undefined;

    return (
      data.chain_stats.funded_txo_sum -
      data.chain_stats.spent_txo_sum +
      data.mempool_stats.funded_txo_sum -
      data.mempool_stats.spent_txo_sum
    );
  }

  async getUtxos(address: string) {
    const data = await fetchTDCMainnet<ApiUTXO[]>({
      path: `/address/${address}/utxo`,
    });
    return data;
  }

  async pushTx(rawTx: string) {
    const data = await fetchTDCMainnet<string>({
      path: "/tx",
      method: "POST",
      headers: {
        "content-type": "text/plain",
      },
      json: false,
      body: rawTx,
    });
    return {
      txid: data,
    };
  }

  async getTransactions(address: string): Promise<ITransaction[] | undefined> {
    return await fetchTDCMainnet<ITransaction[]>({
      path: `/address/${address}/txs`,
      // path: `/address/TSofqS7nm8Vnk1fk8jU7YgqQcGuWA7wtnK/txs`,
    });
  }

  async getPaginatedTransactions(address: string, txid: string): Promise<ITransaction[] | undefined> {
    try {
      return await fetchTDCMainnet<ITransaction[]>({
        path: `/adress/${address}/txs/chain/${txid}`
        // path: `/address/TSofqS7nm8Vnk1fk8jU7YgqQcGuWA7wtnK/txs/chain/${txid}`
      })
    } catch (e) {
      return undefined
    }
  }

  async getLastBlockTDC(): Promise<number> {
    return Number(
      await fetchTDCMainnet<string>({
        path: "/blocks/tip/height",
      })
    );
  }

  async getTDCPrice() {
    const res = await fetch("https://api.dex-trade.com/v1/public/ticker?pair=TDCUSDT");
    return (await res.json()) as { data: { last: string } };
  }
}

export default new ApiController();
