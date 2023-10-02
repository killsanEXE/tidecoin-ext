import { CHAINS, TDC_MAINNET_URL } from "@/shared/constant";
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
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
  headers?: HeadersInit
  path: string
  error?: boolean
}

export const fetchTDCMainnet = async <T>({
  path,
  ...props
}: fetchProps): Promise<T | undefined> => {
  try {
    const res = await fetch(`${TDC_MAINNET_URL}${path}`, { ...props })

    if (!res.ok) {
      console.log("ERROR IN RESPONSE")
      console.log(res.body)
    }

    return await res.json()
  } catch (error) {
    console.log(error)
  }
}