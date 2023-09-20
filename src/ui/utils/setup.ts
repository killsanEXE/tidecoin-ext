import { EVENTS } from "@/shared/constant";
import eventBus from "@/shared/eventBus";
import { Message } from "@/shared/utils";
import { IWalletController } from "../shared/interfaces/IWalletController";

export function setupPm() {
    const { PortMessage } = Message;
    const portMessageChannel = new PortMessage();
    portMessageChannel.connect('popup');

    portMessageChannel.listen((data) => {
        if (data.type === 'broadcast') {
            eventBus.emit(data.method, data.params);
        }
    });

    eventBus.addEventListener(EVENTS.broadcastToBackground, (data) => {
        portMessageChannel.request({
            type: 'broadcast',
            method: data.method,
            params: data.data
        });
    });

    return portMessageChannel;
}

export function setupWalletProxy() {
    const portMessageChannel = setupPm();

    const wallet: Record<string, any> = new Proxy(
        {
        },
        {
            get(obj, key) {
                switch (key) {
                    case 'openapi':
                        return new Proxy(
                            {},
                            {
                                get(obj, key) {
                                    return function (...params: any) {
                                        return portMessageChannel.request({
                                            type: 'openapi',
                                            method: key,
                                            params
                                        });
                                    };
                                }
                            }
                        );
                        break;
                    default:
                        return function (...params: any) {
                            return portMessageChannel.request({
                                type: 'controller',
                                method: key,
                                params
                            });
                        };
                }
            }
        }
    );
    return wallet as IWalletController;
}