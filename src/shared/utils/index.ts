import { CHAINS } from "@/shared/constant";
import browser from "./browser";
import BroadcastChannelMessage from "./message/broadcastChannelMessage";
import PortMessage from "./message/portMessage";
import { keyBy } from 'lodash';

const Message = {
    BroadcastChannelMessage,
    PortMessage
};

const t = (name) => browser.i18n.getMessage(name);

const format = (str, ...args) => {
    return args.reduce((m, n) => m.replace('_s_', n), str);
};

export { Message, t, format };

const chainsDict = keyBy(CHAINS, 'serverId');
export const getChain = (chainId?: string) => {
    if (!chainId) {
        return null;
    }
    return chainsDict[chainId];
};
