import { CHAINS, TDC_API_URL, TDC_MAINNET_PATH } from "@/shared/constant";
import browser from "./browser";
import BroadcastChannelMessage from "./message/broadcastChannelMessage";
import PortMessage from "./message/portMessage";
import { keyBy } from "lodash";

const Message = {
  BroadcastChannelMessage,
  PortMessage,
};

const t = (name: string) => browser.i18n.getMessage(name);

const format = (str: string, ...args: any[]) => {
  return args.reduce((m, n) => m.replace("_s_", n), str);
};

export { Message, t, format };

const chainsDict = keyBy(CHAINS, "serverId");
export const getChain = (chainId?: string) => {
  if (!chainId) {
    return null;
  }
  return chainsDict[chainId];
};

interface fetchProps extends RequestInit {
  method?: "POST" | "GET" | "PUT" | "DELETE";
  headers?: HeadersInit;
  path: string;
  params?: Record<string, string>;
  error?: boolean;
}

export const fetchTDCMainnet = async <T>({
  path,
  ...props
}: fetchProps): Promise<T | undefined> => {
  try {
    const url = new URL(TDC_MAINNET_PATH.concat(path), TDC_API_URL);
    if (props.params) {
      Object.entries(props.params).forEach((v) => url.searchParams.set(...v));
    }
    const res = await fetch(url.toString(), { ...props });

    if (!res.ok) {
      console.error(res);
      throw new Error("^^^ Error in response ^^^");
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const extractKeysFromObj = <
  T extends Record<string, any>,
  K extends keyof T
>(
  obj: T,
  keysToExtract: K[]
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, _v]) => !keysToExtract.includes(k as K))
  ) as Omit<T, K>;
};
