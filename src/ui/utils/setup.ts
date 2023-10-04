import { EVENTS } from "@/shared/constant";
import eventBus from "@/shared/eventBus";
import { Message } from "@/shared/utils";
import { IWalletController } from "@/shared/interfaces";
import { IApiController } from "@/shared/interfaces/apiController";
import { IStateController } from "@/shared/interfaces/stateController";

function setupPm() {
  const { PortMessage } = Message;
  const portMessageChannel = new PortMessage();
  portMessageChannel.connect("popup");

  portMessageChannel.listen((data: { method: string, params: any[], type: string }) => {
    if (data.type === "broadcast") {
      eventBus.emit(data.method, data.params);
    }
  });

  eventBus.addEventListener(EVENTS.broadcastToBackground, async (data: { method: string, data: any }) => {
    await portMessageChannel.request({
      type: "broadcast",
      method: data.method,
      params: data.data,
    });
  });

  return portMessageChannel;
}

const portMessageChannel = setupPm()

export function setupWalletProxy() {
  const wallet: Record<string, any> = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: "controller",
            method: key,
            params,
          });
        };
      },
    }
  );
  return wallet as IWalletController;
}

export function setupOpenAPIProxy() {
  const openapi: Record<string, any> = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: "openapi",
            method: key,
            params,
          });
        };
      },
    }
  );
  return openapi as IApiController;
}

export function setupStateProxy() {
  const state: Record<string, any> = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: "state",
            method: key,
            params,
          });
        };
      },
    }
  );
  return state as IStateController;
}