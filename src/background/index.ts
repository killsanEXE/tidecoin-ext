import { EVENTS } from "@/shared/constant";
import eventBus from "@/shared/eventBus";
import { Message } from "@/shared/utils";
import { sessionService } from "@/background/services";
import {
  browserRuntimeOnConnect,
  browserRuntimeOnInstalled,
} from "@/shared/utils/browser";
import walletController from "./controllers/walletController";
import apiController from "./controllers/apiController";
import keyringController from "./controllers/keyring";
import stateController from "./controllers/stateController";

const { PortMessage } = Message;

// for page provider
browserRuntimeOnConnect((port: any) => {
  if (
    port.name === "popup" ||
    port.name === "notification" ||
    port.name === "tab"
  ) {
    const pm = new PortMessage(port);
    pm.listen((data: any) => {
      if (!data.method) return;

      if (data?.type) {
        switch (data.type) {
          case "broadcast":
            eventBus.emit(data.method, data.params);
            break;
          case "openapi":
            return apiController[data.method].apply(null, data.params);
          case "keyring":
            return keyringController[data.method].apply(null, data.params);
          case "state":
            return stateController[data.method].apply(null, data.params);
          default:
            if (!walletController[data.method]) return;
            return walletController[data.method].apply(null, data.params);
        }
      }
    });

    const broadcastCallback = (data: any) => {
      pm.request({
        type: "broadcast",
        method: data.method,
        params: data.params,
      });
    };

    if (port.name === "popup") {
      // console.log("PORT NAME IS POPUP")
    }

    eventBus.addEventListener(EVENTS.broadcastToUI, broadcastCallback);
    port.onDisconnect.addListener(() => {
      eventBus.removeEventListener(EVENTS.broadcastToUI, broadcastCallback);
    });

    return;
  }

  const pm = new PortMessage(port);
  pm.listen(async (data: any) => {
    const sessionId = port.sender?.tab?.id;
    const session = sessionService.getOrCreateSession(sessionId);

    const req = { data, session };
    // for background push to respective page
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.pushMessage = (event, data) => {
      pm.send("message", { event, data });
    };

    // return providerController(req);
  });

  port.onDisconnect.addListener(() => {
    // todo
  });
});

const addAppInstalledEvent = () => {
  // openExtensionInTab();
  return;
};

browserRuntimeOnInstalled((details) => {
  if (details.reason === "install") {
    addAppInstalledEvent();
  }
});

const INTERNAL_STAYALIVE_PORT = "CT_Internal_port_alive";
let alivePort: any = null;

setInterval(() => {
  if (alivePort == null) {
    alivePort = chrome.runtime.connect({ name: INTERNAL_STAYALIVE_PORT });
    alivePort.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        //   // Handle error
      } else {
        //   // Handle successful disconnect
      }
      alivePort = null;
    });
  }

  if (alivePort) {
    alivePort.postMessage({ content: "keep alive~" });
    if (chrome.runtime.lastError) {
      // Handle error
    } else {
      // Handle successful postMessage
    }
  }
}, 5000);
