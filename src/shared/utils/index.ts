import browser from "./browser";
import BroadcastChannelMessage from "./message/broadcastChannelMessage";
import PortMessage from "./message/portMessage";

const Message = {
    BroadcastChannelMessage,
    PortMessage
};

const t = (name) => browser.i18n.getMessage(name);

const format = (str, ...args) => {
    return args.reduce((m, n) => m.replace('_s_', n), str);
};