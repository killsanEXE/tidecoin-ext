import { EVENTS } from "@/shared/constant";
import eventBus from "@/shared/eventBus";
import { Message } from "@/shared/utils";
import { sessionService } from "@/background/services";
import { openExtensionInTab } from "@/shared/features/tabs";
import { browserRuntimeOnConnect, browserRuntimeOnInstalled } from "@/shared/utils/browser";
import walletController from "./controllers/walletController";


const { PortMessage } = Message;

// for page provider
browserRuntimeOnConnect((port) => {
    if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
        const pm = new PortMessage(port as any);
        pm.listen((data) => {
            if (data?.type) {
                switch (data.type) {
                    case 'broadcast':
                        eventBus.emit(data.method, data.params);
                        break;
                    case 'openapi':
                        // if (walletController.openapi[data.method]) {
                        //     return walletController.openapi[data.method].apply(null, data.params);
                        // }
                        break;
                    case 'controller':
                    default:
                        if (data.method) {
                            return walletController[data.method].apply(null, data.params);
                        }
                }
            }
        });

        const boardcastCallback = (data: any) => {
            pm.request({
                type: 'broadcast',
                method: data.method,
                params: data.params
            });
        };

        if (port.name === 'popup') {
            // console.log("PORT NAME IS POPUP")
        }

        eventBus.addEventListener(EVENTS.broadcastToUI, boardcastCallback);
        port.onDisconnect.addListener(() => {
            eventBus.removeEventListener(EVENTS.broadcastToUI, boardcastCallback);
        });

        return;
    }

    const pm = new PortMessage(port);
    pm.listen(async (data) => {
        const sessionId = port.sender?.tab?.id;
        const session = sessionService.getOrCreateSession(sessionId);

        const req = { data, session };
        // for background push to respective page
        req.session.pushMessage = (event, data) => {
            pm.send('message', { event, data });
        };

        // return providerController(req);
    });

    port.onDisconnect.addListener(() => {
        // todo
    });
});

const addAppInstalledEvent = () => {
    openExtensionInTab();
    return;
};

browserRuntimeOnInstalled((details) => {
    if (details.reason === 'install') {
        addAppInstalledEvent();
    }
});