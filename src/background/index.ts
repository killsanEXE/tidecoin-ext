import { EVENTS } from "shared/constant";
import eventBus from "shared/eventBus";
import { Message } from "shared/utils";
import { sessionService } from "./services";
import { browserRuntimeOnConnect, browserRuntimeOnInstalled } from './webapi/browser';
import { openExtensionInTab } from "shared/features/tabs";

export default function initBackground() {
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
                            console.log("openapi")
                            break;
                        case 'controller':
                        default:
                            if (data.method) {
                                // return walletController[data.method].apply(null, data.params);
                                console.log(data.method);
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

            // if (port.name === 'popup') {
            //     preferenceService.setPopupOpen(true);

            //     port.onDisconnect.addListener(() => {
            //         preferenceService.setPopupOpen(false);
            //     });
            // }

            eventBus.addEventListener(EVENTS.broadcastToUI, boardcastCallback);
            port.onDisconnect.addListener(() => {
                eventBus.removeEventListener(EVENTS.broadcastToUI, boardcastCallback);
            });

            return;
        }

        const pm = new PortMessage(port);
        pm.listen(async (data) => {
            console.log(data);
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
}