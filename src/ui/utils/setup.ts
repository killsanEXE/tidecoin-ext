import { EVENTS } from "@/shared/constant";
import eventBus from "@/shared/eventBus";
import { Message } from "@/shared/utils";
import { IWalletController } from "@/shared/interfaces";
import { IApiController } from "@/shared/interfaces/apiController";
import { IStateController } from "@/shared/interfaces/stateController";
import { IKeyringController } from "@/shared/interfaces/keyringController";

function setupPm() {
  const { PortMessage } = Message;
  const portMessageChannel = new PortMessage();
  portMessageChannel.connect("popup");

  portMessageChannel.listen((data: { method: string; params: any[]; type: string }) => {
    if (data.type === "broadcast") {
      eventBus.emit(data.method, data.params);
    }
  });

  eventBus.addEventListener(EVENTS.broadcastToBackground, async (data: { method: string; data: any }) => {
    await portMessageChannel.request({
      type: "broadcast",
      method: data.method,
      params: data.data,
    });
  });

  return portMessageChannel;
}

const portMessageChannel = setupPm();

type AvailableType = "controller" | "openapi" | "state" | "keyring";

function setupProxy<T>(type: AvailableType): T {
  const wallet: Record<string, any> = new Proxy(
    {},
    {
      get(_obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: type,
            method: key,
            params,
          });
        };
      },
    }
  );
  return wallet as T;
}

export function setupWalletProxy() {
  return setupProxy<IWalletController>("controller");
}

export function setupOpenAPIProxy() {
  return setupProxy<IApiController>("openapi");
}

export function setupStateProxy() {
  return setupProxy<IStateController>("state");
}

export function setupKeyringProxy() {
  return setupProxy<IKeyringController>("keyring");
}
